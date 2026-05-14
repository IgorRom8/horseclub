import { Prisma } from "@/generated/prisma-client";
import { prisma } from "@/lib/prisma";

const allowedSlug = ["postoy", "trenirovki", "kormlenie"] as const;

export type ContactResult = { ok: true; id: string } | { ok: false; status: number; error: string };

function prismaFailureMessage(err: unknown): { status: number; error: string } {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P1001":
      case "P1002":
      case "P1017":
        return {
          status: 503,
          error:
            "База данных сейчас недоступна. Проверьте на Vercel переменную DATABASE_URL (хост в интернете, не localhost) и что база принимает подключения.",
        };
      case "P1000":
        return {
          status: 503,
          error:
            "Не удалось подключиться к базе: неверный логин или пароль в DATABASE_URL.",
        };
      case "P2021":
        return {
          status: 503,
          error:
            "Таблицы в базе не созданы. Выполните из каталога web: npx prisma db push (к вашей облачной БД).",
        };
      default:
        break;
    }
  }
  return {
    status: 500,
    error: "Не удалось сохранить заявку. Попробуйте позже или позвоните нам — контакты на сайте.",
  };
}

export async function createContactRequest(body: unknown): Promise<ContactResult> {
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
  const phone = (source.phone ?? "").trim();
  if (!name || !phone) {
    return { ok: false, status: 400, error: "Укажите имя и телефон" };
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

  let created;
  try {
    created = await prisma.contactRequest.create({
      data: {
        name,
        phone,
        message: source.message?.trim() || undefined,
        serviceSlug,
        preferredDate,
      },
    });
  } catch (err) {
    console.error("[contact-create] prisma.contactRequest.create", err);
    const { status, error } = prismaFailureMessage(err);
    return { ok: false, status, error };
  }
  return { ok: true, id: created.id };
}
