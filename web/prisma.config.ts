import { defineConfig } from "prisma/config";

/**
 * Конфиг CLI Prisma (seed и пути). URL БД по-прежнему в prisma/schema.prisma → env("DATABASE_URL").
 * @see https://www.prisma.io/docs/orm/reference/prisma-config-reference
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
