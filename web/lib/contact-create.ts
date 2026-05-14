import { Prisma } from "@/generated/prisma-client";
import { prisma } from "@/lib/prisma";

const allowedSlug = ["postoy", "trenirovki", "kormlenie"] as const;

export type ContactResult = { ok: true; id: string } | { ok: false; status: number; error: string };

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
        "Не удалось инициализировать подключение к базе. Проверьте DATABASE_URL на Vercel (облачный хост PostgreSQL, sslmode, без localhost).",
    };
  }
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return {
      status: 503,
      error:
        "Ошибка запроса к базе данных. Часто это сеть или несовместимость версии Prisma с хостингом. Проверьте логи функции на Vercel и строку подключения.",
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
            "База данных сейчас недоступна. Укажите на Vercel корректный DATABASE_URL (хост в интернете, не localhost) и разрешите внешние подключения у провайдера БД.",
        };
      case "P1000":
        return {
          status: 503,
          error: "Не удалось подключиться к базе: неверный логин или пароль в DATABASE_URL.",
        };
      case "P2021":
        return {
          status: 503,
          error:
            "Таблица заявок не найдена. Выполните к вашей облачной БД из каталога web: npx prisma db push",
        };
      default:
        return {
          status: 503,
          error: `Ошибка базы (${code}). Проверьте подключение и схему, либо напишите нам по телефону с сайта.`,
        };
    }
  }
  return {
    status: 500,
    error:
      "Не удалось сохранить заявку. Попробуйте позже или позвоните — контакты указаны на сайте.",
  };
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
  if (!process.env.DATABASE_URL?.trim()) {
    return {
      ok: false,
      status: 503,
      error:
        "Заявки через сайт не настроены: в окружении нет DATABASE_URL. Добавьте строку подключения к PostgreSQL в настройках проекта на Vercel.",
    };
  }

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

  try {
    const created = await prisma.contactRequest.create({
      data: {
        name,
        phone,
        message: source.message?.trim() || undefined,
        serviceSlug,
        preferredDate,
      },
    });
    return { ok: true, id: created.id };
  } catch (err) {
    console.error("[contact-create] prisma.contactRequest.create", err);
    const { status, error } = prismaFailureMessage(err);
    return { ok: false, status, error };
  }
}
