/** Заявки пользователя — только localStorage (привязка к userId из localAuth). */

export type LocalLeadStatus = "new" | "in_progress" | "done";

export type LocalLead = {
  id: string;
  userId: string;
  name: string;
  phone: string;
  message?: string;
  serviceSlug?: string;
  serviceTitle?: string;
  preferredDate?: string;
  status: LocalLeadStatus;
  createdAt: string;
};

const LEADS_KEY = "kon_local_leads";

export const LEADS_UPDATED_EVENT = "kon-leads-updated";

const SERVICE_LABELS: Record<string, string> = {
  postoy: "Постой",
  trenirovki: "Тренировки",
  kormlenie: "Кормление",
};

export function serviceLabel(slug?: string, title?: string): string | null {
  if (title?.trim()) return title.trim();
  if (slug && SERVICE_LABELS[slug]) return SERVICE_LABELS[slug];
  return slug ? slug : null;
}

export const LEAD_STATUS_LABELS: Record<LocalLeadStatus, string> = {
  new: "Принята",
  in_progress: "В работе",
  done: "Завершена",
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readAllLeads(): LocalLead[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is LocalLead =>
        l &&
        typeof l === "object" &&
        typeof (l as LocalLead).id === "string" &&
        typeof (l as LocalLead).userId === "string" &&
        typeof (l as LocalLead).name === "string" &&
        typeof (l as LocalLead).phone === "string" &&
        typeof (l as LocalLead).createdAt === "string",
    );
  } catch {
    return [];
  }
}

function writeAllLeads(leads: LocalLead[]): void {
  if (!canUseStorage()) return;
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

function notifyUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(LEADS_UPDATED_EVENT));
  }
}

export function getLocalLeadsForUser(userId: string): LocalLead[] {
  return readAllLeads()
    .filter((l) => l.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export type AddLocalLeadInput = {
  userId: string;
  name: string;
  phone: string;
  message?: string;
  serviceSlug?: string;
  serviceTitle?: string;
  preferredDate?: string;
};

export function addLocalLead(input: AddLocalLeadInput): LocalLead {
  const lead: LocalLead = {
    id: crypto.randomUUID(),
    userId: input.userId,
    name: input.name.trim(),
    phone: input.phone.replace(/\D/g, ""),
    message: input.message?.trim() || undefined,
    serviceSlug: input.serviceSlug,
    serviceTitle: input.serviceTitle,
    preferredDate: input.preferredDate,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  writeAllLeads([lead, ...readAllLeads()]);
  notifyUpdated();
  return lead;
}

export function formatPhoneDisplay(digits: string): string {
  const d = digits.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("7")) {
    return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
  }
  if (d.length === 10) {
    return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`;
  }
  return d || "—";
}

export function formatLeadDate(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPreferredDate(ymd?: string): string | null {
  if (!ymd) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return ymd;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}
