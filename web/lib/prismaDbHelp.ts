import { Prisma } from "@/generated/prisma-client";

/** Таблица отсутствует в БД — нужен `prisma db push` */
export function prismaMissingTableUserHint(e: unknown): string | null {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2021") {
    return "В PostgreSQL нет актуальной схемы. В каталоге проекта выполните: npm run db:push (или из web: npx prisma db push).";
  }
  return null;
}
