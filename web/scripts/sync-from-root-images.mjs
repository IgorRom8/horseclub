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

/** Девять отдельных файлов для страницы «Конюшни»: каждому слоту — свой исходник, без повторов по кругу пула. */
function copyKonyushniUniqueGallery() {
  const slots = [
    ["gallery-kon-01.jpg", "лошад1.jpeg"],
    ["gallery-kon-02.jpg", "лошад.jpg"],
    ["gallery-kon-03.jpg", "лошад_тыгыдыг.jpg"],
    ["gallery-kon-04.jpg", "лошад_тыгыдык2.jpg"],
    ["gallery-kon-05.jpg", "еще лошади.jpg"],
    ["gallery-kon-06.jpg", "manej.jpg"],
    ["gallery-kon-07.jpg", "levad.jpg"],
    ["gallery-kon-08.webp", "amyn.webp"],
  ];

  const usedSources = new Set();

  function pickUnusedFromPool() {
    for (const candidate of FALLBACK_POOL) {
      if (!fs.existsSync(path.join(SRC_DIR, candidate))) continue;
      if (usedSources.has(candidate)) continue;
      return candidate;
    }
    return null;
  }

  function pickAnyFromPool() {
    for (const candidate of FALLBACK_POOL) {
      if (fs.existsSync(path.join(SRC_DIR, candidate))) return candidate;
    }
    return null;
  }

  for (const [destName, preferred] of slots) {
    let srcName =
      preferred && fs.existsSync(path.join(SRC_DIR, preferred)) ? preferred : null;
    if (!srcName) srcName = pickUnusedFromPool();
    if (!srcName) srcName = pickAnyFromPool();

    if (!srcName) {
      console.warn("Конюшни:", destName, "— нет подходящего исходника, пропуск");
      continue;
    }

    if (usedSources.has(srcName)) {
      console.warn("Конюшни:", destName, "← тот же исходник", srcName, "(в папке images мало разных файлов)");
    }
    usedSources.add(srcName);

    fs.copyFileSync(path.join(SRC_DIR, srcName), path.join(OUT_DIR, destName));
    console.log(`OK ${destName} ← images/${srcName}`);
  }
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

  copyKonyushniUniqueGallery();
}

main();
