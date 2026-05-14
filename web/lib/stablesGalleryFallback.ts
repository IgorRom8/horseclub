import type { GalleryDto } from "@/lib/cms";
import { konyushniGalleryImages } from "@/lib/siteImages";

/** Убирает карточки с тем же `imageUrl` (на случай старых данных в БД). */
export function uniqueGalleryByImageUrl<T extends { imageUrl: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.imageUrl.trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getStaticKonyushniGallery(): GalleryDto[] {
  const out: GalleryDto[] = [];
  const pages = [
    { key: "stables" as const, count: 3 },
    { key: "arenas" as const, count: 3 },
    { key: "paddocks" as const, count: 2 },
  ];
  let idx = 0;

  for (const { key: page, count } of pages) {
    for (let i = 1; i <= count; i++) {
      const label =
        page === "stables" ? `Конюшни ${i}` : page === "arenas" ? `Манеж ${i}` : `Левада ${i}`;
      const src = konyushniGalleryImages[idx];
      if (src === undefined) throw new Error("konyushniGalleryImages: не хватает путей");
      idx += 1;
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
