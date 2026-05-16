/**
 * Интеграция Vercel + Neon иногда создаёт только DATA_BASE_POSTGRES_URL.
 * Prisma и код ожидают DATABASE_URL — подставляем fallback до создания клиента.
 */
const fromIntegration = process.env.DATA_BASE_POSTGRES_URL?.trim();
const current = process.env.DATABASE_URL?.trim();

if (!current && fromIntegration) {
  process.env.DATABASE_URL = fromIntegration;
}

export {};
