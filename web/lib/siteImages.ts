/**
 * JPG/WebP в `web/public/images/` (латинские имена слотов — без проблем с URL).
 *
 * Свои файлы кладите в **`kon/images/`** в корне проекта и выполняйте из папки `web`:
 * `npm run images:sync` — скопирует и переименует под нужные слоты (см. `scripts/sync-from-root-images.mjs`).
 * Либо `npm run download-images` — загрузка стоков с Unsplash.
 */

/** Главная, блоки услуг, общие иллюстрации */
export const siteImages = {
  hero: "/images/hero.jpg",
  servicePostoy: "/images/service-postoy.jpg",
  serviceTrain: "/images/service-train.jpg",
  serviceFeed: "/images/service-feed.jpg",
  infrastructureAside: "/images/infrastructure.jpg",
  managerPortrait: "/images/manager.jpg",
} as const;

/** Fallback CMS (то же в `web/prisma/siteImageUrls.mjs` для seed) */
export const cmsStockImages = {
  denniki: "/images/cms-denniki.jpg",
  plac: "/images/cms-plac.jpg",
  manezh: "/images/cms-manezh.jpg",
  levada: "/images/cms-levada.jpg",
  /** Амуничник / снаряжение (`amyn.webp` через `npm run images:sync`) */
  amunichnik: "/images/cms-tack.webp",
  aboutTeam: "/images/manager.jpg",
} as const;

/** Галерея «конюшни» */
export const galleryStockImages = {
  stable3: "/images/gallery-stable-3.jpg",
  arena3: "/images/gallery-arena-3.jpg",
} as const;

