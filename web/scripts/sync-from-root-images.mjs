/**
 * Берёт фото из `kon/images/` и копирует в `web/public/images/` под именами из `siteImages.ts`.
 * Контекстные файлы приоритетно: `manej.jpg`, `levad.jpg`, `amyn.webp`; остальные слоты — ротация
 * конных кадров. Из каталога `web`: `npm run images:sync`.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const REPO_ROOT = path.join(__dirname, "..", "..");
const SRC_DIR = path.join(REPO_ROOT, "images");
const OUT_DIR = path.join(__dirname, "..", "public", "images");

const DESTS_ORDER = [
  "hero.jpg",
  "service-postoy.jpg",
  "service-train.jpg",
  "service-feed.jpg",
  "infrastructure.jpg",
  "manager.jpg",
  "cms-denniki.jpg",
  "cms-plac.jpg",
  "cms-manezh.jpg",
  "cms-levada.jpg",
  "cms-tack.webp",
  "gallery-stable-3.jpg",
  "gallery-arena-3.jpg",
];

/** Тематическое совпадение по имени файла в корневой `images/`. */
const CONTEXTUAL_SOURCES = {
  "service-train.jpg": "manej.jpg",
  "cms-manezh.jpg": "manej.jpg",
  "gallery-arena-3.jpg": "manej.jpg",
  "cms-levada.jpg": "levad.jpg",
  "cms-tack.webp": "amyn.webp",
};

const FALLBACK_POOL = [
  "лошад1.jpeg",
  "лошад.jpg",
  "лошад_тыгыдыг.jpg",
  "лошад_тыгыдык2.jpg",
  "еще лошади.jpg",
];

function firstExistingInPool(startIndex) {
  for (let k = 0; k < FALLBACK_POOL.length; k++) {
    const name = FALLBACK_POOL[(startIndex + k) % FALLBACK_POOL.length];
    if (fs.existsSync(path.join(SRC_DIR, name))) return name;
  }
  return null;
}

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error("Нет папки images в корне проекта:", SRC_DIR);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let poolCursor = 0;

  for (let i = 0; i < DESTS_ORDER.length; i++) {
    const destName = DESTS_ORDER[i];
    const preferred = CONTEXTUAL_SOURCES[destName];

    let srcName = null;
    if (preferred && fs.existsSync(path.join(SRC_DIR, preferred))) {
      srcName = preferred;
    } else {
      srcName = firstExistingInPool(poolCursor);
      if (srcName !== null) poolCursor++;
    }

    if (!srcName) {
      console.error("Не нашли исходник для слота:", destName, "| пул:", FALLBACK_POOL);
      process.exit(1);
    }

    const src = path.join(SRC_DIR, srcName);
    const dest = path.join(OUT_DIR, destName);
    fs.copyFileSync(src, dest);
    console.log(`OK ${destName} ← images/${srcName}`);
  }
}

main();
