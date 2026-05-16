/**
 * Vercel + Neon часто отдают URL не в DATABASE_URL или оставляют localhost в шаблоне.
 * Prisma ожидает рабочий DATABASE_URL до создания клиента.
 */
const INTEGRATION_KEYS = [
  "DATA_BASE_POSTGRES_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "NEON_DATABASE_URL",
] as const;

function looksLikeLocalPlaceholder(url: string): boolean {
  return /\blocalhost\b/i.test(url) || /\b127\.0\.0\.1\b/.test(url);
}

/** Вызывать перед проверками process.env.DATABASE_URL и до Prisma. Идемпотентно. */
export function ensureDatabaseUrlFromIntegrations(): void {
  const onVercel = process.env.VERCEL === "1";
  let current = process.env.DATABASE_URL?.trim();

  if (onVercel && current && looksLikeLocalPlaceholder(current)) {
    delete process.env.DATABASE_URL;
    current = undefined;
  }

  if (current) return;

  for (const key of INTEGRATION_KEYS) {
    const v = process.env[key]?.trim();
    if (v) {
      process.env.DATABASE_URL = v;
      return;
    }
  }
}

ensureDatabaseUrlFromIntegrations();
