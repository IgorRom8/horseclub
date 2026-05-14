import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const images = await prisma.galleryImage.findMany({
    where: { page: category },
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });
  return NextResponse.json(images);
}
