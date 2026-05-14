import type { GalleryDto } from "@/lib/cms";
import { konyushniGalleryImages } from "@/lib/siteImages";

export type StablesGalleryCard = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
};

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

/** Пути к фото карточек конюшни (третья — другой кадр, не gallery-kon-03). */
const STABLES_CARD_IMAGE_INDICES = [0, 1, 3] as const;

function stablesCardImageAt(cardIndex: number): string {
  const slot = STABLES_CARD_IMAGE_INDICES[cardIndex];
  if (slot === undefined) throw new Error("stables: нет слота изображения");
  const src = konyushniGalleryImages[slot];
  if (!src) throw new Error("konyushniGalleryImages: не хватает файла для карточки конюшни");
  return src;
}

const STABLES_INTRO = [
  {
    key: "stoyanka",
    title: "Постой и денники",
    description:
      "Ряд боксов с вентиляцией и естественным светом: подстилка по сезону, кормушки и поилки на месте. Центральный проход удобен для наблюдения за лошадью без лишнего стресса для животного.",
  },
  {
    key: "ryad",
    title: "Обустройство конюшни",
    description:
      "Чистые проходы, порядок в денниках и понятная логистика кормления. Так проще соблюдать распорядок и держать базу в состоянии, в котором комфортно и людям, и лошадям.",
  },
  {
    key: "uchastok",
    title: "Ряд у выхода",
    description:
      "Удобная высота дверей и просветов, спокойный свет в проходе — меньше суеты при выводе и возврате. Рядом с боксами удобно оставить снаряжение на время ухода за конём.",
  },
] as const;

export function getStaticStablesGalleryCards(): StablesGalleryCard[] {
  return STABLES_INTRO.map((row, i) => {
    const src = stablesCardImageAt(i);
    return {
      id: `static-${row.key}`,
      title: row.title,
      description: row.description,
      imageUrl: src,
      thumbnailUrl: src,
    };
  });
}

/** Подставляет URL из БД, сохраняя заголовки и описания из вёрстки. */
export function mergeDbStablesGalleryImages(
  dbRows: GalleryDto[],
  fallback: StablesGalleryCard[],
): StablesGalleryCard[] {
  const unique = uniqueGalleryByImageUrl(dbRows).slice(0, 3);
  if (unique.length === 0) return fallback;
  return fallback.map((card, i) => {
    const row = unique[i];
    if (!row) return card;
    return {
      ...card,
      id: row.id,
      imageUrl: row.imageUrl,
      thumbnailUrl: row.thumbnailUrl,
    };
  });
}
