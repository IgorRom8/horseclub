/** Slug в таблице Page ↔ публичный URL */
export const ADMIN_EDITABLE_PAGE_SLUGS = ["infrastructure", "about", "rules"] as const;

export type AdminEditableSlug = (typeof ADMIN_EDITABLE_PAGE_SLUGS)[number];

export const adminPageLabels: Record<AdminEditableSlug, string> = {
  infrastructure: "Инфраструктура — /infrastruktura",
  about: "О нас — /o-nas",
  rules: "Правила и ТБ — /pravila-i-tb",
};

export function isAdminEditableSlug(s: string): s is AdminEditableSlug {
  return (ADMIN_EDITABLE_PAGE_SLUGS as readonly string[]).includes(s);
}
