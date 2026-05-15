import { Prisma } from "@/generated/prisma-client";

const SCHEMA_HINT =
  "В PostgreSQL нет актуальной схемы. В каталоге проекта выполните: npm run db:push (или из web: npx prisma db push).";

const DB_CONNECT_HINT =
  "Не удаётся подключиться к базе. Проверьте DATABASE_URL в настройках Vercel, что база доступна извне и что в строке подключения для облачного PostgreSQL указан SSL (часто нужно добавить ?sslmode=require).";

/** Таблица отсутствует в БД — нужен `prisma db push` */
export function prismaMissingTableUserHint(e: unknown): string | null {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2021") {
    return SCHEMA_HINT;
  }
  return null;
}

/** Сообщение и HTTP-код для типовых ошибок Prisma при сохранении в админке */
export function prismaUserFacingHttpError(e: unknown): { error: string; status: number } | null {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2021") {
      return { error: SCHEMA_HINT, status: 503 };
    }
    if (e.code === "P2025") {
      return { error: "Запись не найдена", status: 404 };
    }
    if (
      e.code === "P1000" ||
      e.code === "P1001" ||
      e.code === "P1003" ||
      e.code === "P1011" ||
      e.code === "P1017"
    ) {
      return { error: DB_CONNECT_HINT, status: 503 };
    }
  }
  if (e instanceof Prisma.PrismaClientInitializationError) {
    return { error: DB_CONNECT_HINT, status: 503 };
  }
  return null;
}
