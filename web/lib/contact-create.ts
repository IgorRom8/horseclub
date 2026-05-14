import { randomUUID } from "crypto";

import { Prisma } from "@/generated/prisma-client";
import { prisma } from "@/lib/prisma";

const allowedSlug = ["postoy", "trenirovki", "kormlenie"] as const;

export type ContactResult = { ok: true; id: string } | { ok: false; status: number; error: string };

type NormalizedContact = {
  name: string;
  phone: string;
  message?: string;
  serviceSlug?: string;
  preferredDate?: Date;
};

function prismaErrorCode(err: unknown): string | undefined {
  if (err instanceof Prisma.PrismaClientKnownRequestError) return err.code;
  if (err && typeof err === "object" && "code" in err) {
    const c = (err as { code?: unknown }).code;
    return typeof c === "string" ? c : undefined;
  }
  return undefined;
}

function prismaFailureMessage(err: unknown): { status: number; error: string } {
  if (err instanceof Prisma.PrismaClientInitializationError) {
    return {
      status: 503,
      error:
        "Не удалось инициализировать подключение к базе. Проверьте DATABASE_URL на Vercel (облачный хост PostgreSQL, sslmode, без localhost). Либо настройте CONTACT_WEBHOOK_URL — заявка уйдёт на вебхук.",
    };
  }
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return {
      status: 503,
      error:
        "Ошибка запроса к базе данных. Проверьте логи на Vercel и строку подключения или настройте CONTACT_WEBHOOK_URL.",
    };
  }
  const code = prismaErrorCode(err);
  if (code) {
    switch (code) {
      case "P1001":
      case "P1002":
      case "P1017":
        return {
          status: 503,
          error:
            "База данных недоступна. Укажите корректный DATABASE_URL или настройте CONTACT_WEBHOOK_URL на Vercel (Discord / Make.com и т.п.).",
        };
      case "P1000":
        return {
          status: 503,
          error:
            "Неверный логин или пароль в DATABASE_URL. Или используйте CONTACT_WEBHOOK_URL без базы.",
        };
      case "P2021":
        return {
          status: 503,
          error:
            "Таблица заявок не создана: из каталога web выполните npx prisma db push к облачной БД. Либо настройте CONTACT_WEBHOOK_URL.",
        };
      default:
        return {
          status: 503,
          error: `Ошибка базы (${code}). Проверьте подключение или задайте CONTACT_WEBHOOK_URL.`,
        };
    }
  }
  return {
    status: 500,
    error:
      "Не удалось сохранить заявку. Попробуйте позже или позвоните — контакты указаны на сайте.",
  };
}

async function notifyContactWebhook(data: NormalizedContact): Promise<boolean> {
  const url = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (!url) return false;

  const isDiscord = url.includes("discord.com/api/webhooks");
  const body: Record<string, unknown> = isDiscord
    ? {
        content: [
          "**Заявка с сайта конного клуба**",
          `Имя: ${data.name}`,
          `Телефон: ${data.phone}`,
          data.message ? `Комментарий: ${data.message}` : null,
          data.serviceSlug ? `Услуга: ${data.serviceSlug}` : null,
          data.preferredDate
            ? `Дата: ${data.preferredDate.toISOString().slice(0, 10)}`
            : null,
        ]
          .filter(Boolean)
          .join("\n"),
      }
    : {
        source: "horseclub-contact",
        name: data.name,
        phone: data.phone,
        message: data.message ?? null,
        serviceSlug: data.serviceSlug ?? null,
        preferredDate: data.preferredDate?.toISOString() ?? null,
        submittedAt: new Date().toISOString(),
      };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) {
      console.error("[contact-create] webhook HTTP", res.status, await res.text().catch(() => ""));
    }
    return res.ok;
  } catch (e) {
    console.error("[contact-create] webhook fetch", e);
    return false;
  }
}

export async function createContactRequest(body: unknown): Promise<ContactResult> {
  try {
    return await createContactRequestInner(body);
  } catch (err) {
    console.error("[contact-create] unexpected", err);
    const { status, error } = prismaFailureMessage(err);
    return { ok: false, status, error };
  }
}

async function createContactRequestInner(body: unknown): Promise<ContactResult> {
  const source = body as {
    name?: string;
    phone?: string;
    message?: string;
    serviceSlug?: string | null;
    preferredDate?: string | null;
  };
  const name = (source.name ?? "").trim();
  const phoneRaw = (source.phone ?? "").trim();
  const phone = phoneRaw.replace(/\D/g, "");
  if (!name || !phone) {
    return { ok: false, status: 400, error: "Укажите имя и телефон (только цифры в номере)" };
  }

  let serviceSlug: string | undefined;
  const rawSlug = typeof source.serviceSlug === "string" ? source.serviceSlug.trim() : "";
  if (rawSlug) {
    if (!allowedSlug.includes(rawSlug as (typeof allowedSlug)[number])) {
      return { ok: false, status: 400, error: "Неизвестная услуга" };
    }
    serviceSlug = rawSlug;
  }

  let preferredDate: Date | undefined;
  const rawDate = typeof source.preferredDate === "string" ? source.preferredDate.trim() : "";
  if (rawDate) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(rawDate);
    if (!m) {
      return { ok: false, status: 400, error: "Некорректная дата" };
    }
    const y = Number(m[1]);
    const mon = Number(m[2]);
    const d = Number(m[3]);
    const parsed = new Date(y, mon - 1, d, 12, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsed < today) {
      return { ok: false, status: 400, error: "Дата не может быть в прошлом" };
    }
    preferredDate = parsed;
  }

  if (serviceSlug && !preferredDate) {
    return { ok: false, status: 400, error: "Выберите дату записи на услугу" };
  }

  const normalized: NormalizedContact = {
    name,
    phone,
    message: source.message?.trim() || undefined,
    serviceSlug,
    preferredDate,
  };

  const hasDb = Boolean(process.env.DATABASE_URL?.trim());
  let dbError: unknown = null;

  if (hasDb) {
    try {
      const created = await prisma.contactRequest.create({
        data: {
          name: normalized.name,
          phone: normalized.phone,
          message: normalized.message,
          serviceSlug: normalized.serviceSlug,
          preferredDate: normalized.preferredDate,
        },
      });
      return { ok: true, id: created.id };
    } catch (err) {
      dbError = err;
      console.error("[contact-create] prisma.contactRequest.create", err);
    }
  }

  const webhookOk = await notifyContactWebhook(normalized);
  if (webhookOk) {
    return { ok: true, id: `wh-${randomUUID()}` };
  }

  if (dbError) {
    return { ok: false, ...prismaFailureMessage(dbError) };
  }

  if (!hasDb && !process.env.CONTACT_WEBHOOK_URL?.trim()) {
    return {
      ok: false,
      status: 503,
      error:
        "Заявки не настроены: задайте на Vercel DATABASE_URL (PostgreSQL в интернете) или CONTACT_WEBHOOK_URL (URL вебхука, например Discord / Make.com).",
    };
  }

  return {
    ok: false,
    status: 503,
    error:
      "Не удалось отправить заявку: база недоступна, а вебхук не ответил. Проверьте CONTACT_WEBHOOK_URL и что сервис принимает POST JSON.",
  };
}
