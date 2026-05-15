import type { GalleryImage as GalleryRow, Page } from "@/generated/prisma-client";
import { prisma } from "@/lib/prisma";

export type CmsPageRecord = {
  slug: string;
  title: string;
  content: unknown;
};

export async function getCmsPageBySlug(slug: string): Promise<CmsPageRecord | null> {
  const row: Page | null = await prisma.page.findUnique({ where: { slug } }).catch(() => null);
  if (!row) return null;
  return { slug: row.slug, title: row.title, content: row.content as unknown };
}

export type GalleryDto = Pick<
  GalleryRow,
  "id" | "imageUrl" | "thumbnailUrl" | "title" | "description" | "detail"
>;

export async function getGalleryByCategory(category: string): Promise<GalleryDto[]> {
  return prisma.galleryImage.findMany({
    where: { page: category },
    orderBy: [{ order: "asc" }, { id: "asc" }],
    select: {
      id: true,
      imageUrl: true,
      thumbnailUrl: true,
      title: true,
      description: true,
      detail: true,
    },
  });
}
