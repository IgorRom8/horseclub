import { NextResponse } from "next/server";

import { assertAdmin } from "@/lib/adminApiAuth";
import { isAdminEditableSlug } from "@/lib/adminEditablePages";
import { prisma } from "@/lib/prisma";
import { prismaUserFacingHttpError } from "@/lib/prismaDbHelp";

export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const auth = await assertAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json({ error: "Нужен DATABASE_URL" }, { status: 503 });
  }

  const { slug } = await ctx.params;
  if (!isAdminEditableSlug(slug)) {
    return NextResponse.json({ error: "Неизвестная страница" }, { status: 400 });
  }

  let body: { title?: string; content?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ error: "Заголовок обязателен" }, { status: 400 });
  }

  let content: unknown = body.content;
  if (typeof content === "string") {
    try {
      content = JSON.parse(content);
    } catch {
      return NextResponse.json({ error: "Поле content должно быть валидным JSON" }, { status: 400 });
    }
  }
  if (content === undefined || content === null || typeof content !== "object") {
    return NextResponse.json({ error: "Нужен объект content" }, { status: 400 });
  }

  try {
    await prisma.page.upsert({
      where: { slug },
      create: { slug, title, content: content as object },
      update: { title, content: content as object },
    });
  } catch (e) {
    const facing = prismaUserFacingHttpError(e);
    if (facing) return NextResponse.json({ error: facing.error }, { status: facing.status });
    console.error(e);
    return NextResponse.json({ error: "Ошибка записи в БД" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
