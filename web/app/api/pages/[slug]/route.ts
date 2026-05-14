import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } }).catch(() => null);
  if (!page) {
    return NextResponse.json({ error: "Страница не найдена" }, { status: 404 });
  }
  return NextResponse.json(page);
}
