/**
 * Те же пути, что `web/lib/siteImages.ts` (Prisma seed не импортирует из `web/`).
 * Исходники в `kon/images/`: из папки `web` выполните `npm run images:sync`.
 */

export const siteImages = {
  hero: "/images/hero.jpg",
  servicePostoy: "/images/service-postoy.jpg",
  serviceTrain: "/images/service-train.jpg",
  serviceFeed: "/images/service-feed.jpg",
  infrastructureAside: "/images/infrastructure.jpg",
  managerPortrait: "/images/manager.jpg",
};

export const cmsStockImages = {
  denniki: "/images/cms-denniki.jpg",
  plac: "/images/cms-plac.jpg",
  manezh: "/images/cms-manezh.jpg",
  levada: "/images/cms-levada.jpg",
  amunichnik: "/images/cms-tack.webp",
  aboutTeam: "/images/manager.jpg",
};

export const galleryStockImages = {
  stable3: "/images/gallery-stable-3.jpg",
  arena3: "/images/gallery-arena-3.jpg",
};

/** Как в `web/lib/siteImages.ts` → `konyushniGalleryImages` */
export const konyushniGalleryImages = [
  "/images/gallery-kon-01.jpg",
  "/images/gallery-kon-02.jpg",
  "/images/gallery-kon-03.jpg",
  "/images/gallery-kon-04.jpg",
  "/images/gallery-kon-05.jpg",
  "/images/gallery-kon-06.jpg",
  "/images/gallery-kon-07.jpg",
  "/images/gallery-kon-08.webp",
];
