import { NextResponse } from "next/server";

import { assertAdmin } from "@/lib/adminApiAuth";
import { prisma } from "@/lib/prisma";
import { prismaMissingTableUserHint } from "@/lib/prismaDbHelp";

export const runtime = "nodejs";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await assertAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json({ error: "Нужен DATABASE_URL" }, { status: 503 });
  }

  const { id } = await ctx.params;

  let body: {
    title?: string;
    imageUrl?: string;
    thumbnailUrl?: string;
    description?: string;
    detail?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const data: Record<string, string> = {};
  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.imageUrl === "string" && body.imageUrl.trim()) data.imageUrl = body.imageUrl.trim();
  if (typeof body.thumbnailUrl === "string" && body.thumbnailUrl.trim()) {
    data.thumbnailUrl = body.thumbnailUrl.trim();
  }
  if (typeof body.description === "string") data.description = body.description.trim();
  if (typeof body.detail === "string") data.detail = body.detail.trim();

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Нет полей для обновления" }, { status: 400 });
  }

  try {
    const row = await prisma.galleryImage.update({
      where: { id },
      data,
    });
    if (row.page !== "stables") {
      return NextResponse.json({ error: "Можно редактировать только галерею конюшен" }, { status: 403 });
    }
  } catch (e) {
    const hint = prismaMissingTableUserHint(e);
    if (hint) return NextResponse.json({ error: hint }, { status: 503 });
    return NextResponse.json({ error: "Карточка не найдена" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
