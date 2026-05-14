import type { GalleryDto } from "@/lib/cms";
import { cmsStockImages, galleryStockImages, siteImages } from "@/lib/siteImages";

/** Те же слоты, что в `prisma/seed.ts` → `galleryImages` (без БД страница «Конюшни» всё равно показывает галерею). */
const galleryImages = {
  stables: [siteImages.servicePostoy, cmsStockImages.denniki, galleryStockImages.stable3],
  arenas: [siteImages.serviceTrain, cmsStockImages.manezh, galleryStockImages.arena3],
  paddocks: [siteImages.hero, siteImages.infrastructureAside, cmsStockImages.levada],
} as const;

export function getStaticKonyushniGallery(): GalleryDto[] {
  const pages = ["stables", "arenas", "paddocks"] as const;
  const out: GalleryDto[] = [];

  for (const page of pages) {
    const urls = galleryImages[page];
    for (let i = 1; i <= 3; i++) {
      const label =
        page === "stables" ? `Конюшни ${i}` : page === "arenas" ? `Манеж ${i}` : `Левада ${i}`;
      const src = urls[i - 1]!;
      out.push({
        id: `static-${page}-${i}`,
        title: label,
        imageUrl: src,
        thumbnailUrl: src,
      });
    }
  }

  return out;
}
