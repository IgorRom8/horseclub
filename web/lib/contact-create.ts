import { prisma } from "@/lib/prisma";

const allowedSlug = ["postoy", "trenirovki", "kormlenie"] as const;

export type ContactResult = { ok: true; id: string } | { ok: false; status: number; error: string };

export async function createContactRequest(body: unknown): Promise<ContactResult> {
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
}
