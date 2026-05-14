import type { GalleryDto } from "@/lib/cms";
import { cmsStockImages, galleryStockImages, siteImages } from "@/lib/siteImages";

/**
 * Те же слоты, что в `prisma/seed.ts` → `galleryImages`.
 * Не используем подряд service-train + cms-manezh + gallery-arena-3: в `images:sync` все три
 * часто копируются из одного `manej.jpg` — на странице получались три одинаковых кадра.
 */
const galleryImages = {
  stables: [siteImages.servicePostoy, cmsStockImages.denniki, galleryStockImages.stable3],
  arenas: [cmsStockImages.manezh, cmsStockImages.plac, siteImages.serviceFeed],
  paddocks: [cmsStockImages.levada, siteImages.hero, siteImages.infrastructureAside],
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

/** Убирает карточки с тем же `imageUrl` (порядок сохраняется, дубликаты после первого отбрасываются). */
export function uniqueGalleryByImageUrl<T extends { imageUrl: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.imageUrl.trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
