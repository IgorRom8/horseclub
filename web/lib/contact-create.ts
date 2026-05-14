import { randomUUID } from "crypto";

const allowedSlug = ["postoy", "trenirovki", "kormlenie"] as const;

export type ContactResult = { ok: true; id: string } | { ok: false; status: number; error: string };

type NormalizedContact = {
  name: string;
  phone: string;
  message?: string;
  serviceSlug?: string;
  preferredDate?: Date;
};

/** Опционально: уведомление в Discord / Make и т.д. Заявка на сайте всегда считается принятой после валидации. */
async function notifyContactWebhook(data: NormalizedContact): Promise<void> {
  const url = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (!url) return;

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
  } catch (e) {
    console.error("[contact-create] webhook fetch", e);
  }
}

export async function createContactRequest(body: unknown): Promise<ContactResult> {
  try {
    return createContactRequestInner(body);
  } catch (err) {
    console.error("[contact-create] unexpected", err);
    return {
      ok: false,
      status: 500,
      error: "Не удалось обработать заявку. Позвоните нам — контакты на сайте.",
    };
  }
}

function createContactRequestInner(body: unknown): ContactResult {
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

  void notifyContactWebhook(normalized);

  return { ok: true, id: `ok-${randomUUID()}` };
}
