/**
 * Кладёт файлы в `public/images/` для офлайна (если хотите локальные пути вместо CDN).
 *
 * Unsplash license: https://unsplash.com/license
 * Если сеть недоступна — fallback на dummyimage.com.
 *
 * ID кадров совпадают с тем же набором, что задаётся путями в `web/lib/siteImages.ts` и `server/prisma/siteImageUrls.mjs`.
 * Запуск из папки web: npm run download-images
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "images");

/** [fileName, unsplashPhotoId, primaryWidth, fallbackW, fallbackH, fallbackLabel] */
const JOBS = [
  ["hero.jpg", "photo-1776758107856-bfabf799fd8c", 1920, 1920, 720, "Rider barn"],
  ["service-postoy.jpg", "photo-1635009649193-7ed41c32156e", 1600, 1200, 800, "Stables"],
  ["service-train.jpg", "photo-1690112329590-d88aafe4b768", 1600, 1200, 800, "Training"],
  ["service-feed.jpg", "photo-1772480789475-6f3b568fc3b3", 1600, 1200, 800, "Feeding hay"],
  ["infrastructure.jpg", "photo-1635536809684-9b5b9dbaa562", 1600, 1200, 800, "Horses herd"],
  ["manager.jpg", "photo-1573496359142-b8d87734a5a2", 900, 512, 512, "Manager"],
  ["cms-denniki.jpg", "photo-1682636109994-4f2bbee2fd72", 1400, 1200, 900, "Stalls"],
  ["cms-plac.jpg", "photo-1690112329521-46e0de04278f", 1400, 1200, 900, "Outdoor"],
  ["cms-manezh.jpg", "photo-1726209431921-71cb661b4dbf", 1400, 1200, 900, "Indoor"],
  ["cms-levada.jpg", "photo-1724878730267-4f49047d85f8", 1400, 1200, 900, "Paddock"],
  ["cms-tack.jpg", "photo-1641585863082-441e049e2101", 1400, 1200, 900, "Tack"],
  ["gallery-stable-3.jpg", "photo-1576692192914-9abed71b3ef9", 1400, 1200, 900, "Stable 3"],
  ["gallery-arena-3.jpg", "photo-1690112329829-8e80ec98e27f", 1400, 1200, 900, "Arena 3"],
];

function unsplashUrl(id, w) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
}

function fallbackUrl(w, h, text) {
  const t = encodeURIComponent(text);
  return `https://dummyimage.com/${w}x${h}/f5f0e6/8b7355.jpg&text=${t}`;
}

async function fetchOnce(u, ms = 35_000) {
  const ctrl = new AbortController();
  const kill = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(u, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: { Accept: "image/avif,image/webp,image/*,*/*;q=0.8" },
    });
    return res.ok ? Buffer.from(await res.arrayBuffer()) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(kill);
  }
}

async function main() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  for (const [file, pid, uw, fw, fh, label] of JOBS) {
    const primary = unsplashUrl(pid, uw);
    let buf = await fetchOnce(primary);
    const dest = path.join(OUT, file);
    if (!buf) {
      const fb = fallbackUrl(fw, fh, label);
      console.warn(`${file}: Unsplash недоступен, пробуем заглушку`);
      buf = await fetchOnce(fb);
      if (!buf) {
        console.error(`${file}: не удалось скачать`);
        continue;
      }
    }
    fs.writeFileSync(dest, buf);
    console.log(`OK ${file}`);
  }
}

main();
