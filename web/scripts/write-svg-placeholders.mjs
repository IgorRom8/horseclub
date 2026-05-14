/**

 * Без сети: создаёт SVG в `public/images/` (те же имена + `.svg`), чтобы сайт не отдавал 404.

 * Фото потом можно заменить: `npm run download-images` и вернуть в коде расширения на `.jpg`.

 */



import fs from "fs";

import path from "path";

import { fileURLToPath } from "url";



const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OUT = path.join(__dirname, "..", "public", "images");



function esc(s) {

  return String(s)

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;");

}



function svg(w, h, title, subtitle = "") {

  const fsz = Math.max(18, Math.floor(Math.min(w, h) * 0.055));

  const sub = subtitle
    ? `<text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" fill="#7d6b52" font-family="system-ui,sans-serif" font-size="${Math.floor(fsz * 0.32)}">${esc(subtitle)}</text>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>

<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">

  <defs>

    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">

      <stop offset="0%" stop-color="#faf7f2"/>

      <stop offset="50%" stop-color="#ebe4d8"/>

      <stop offset="100%" stop-color="#ddd5c8"/>

    </linearGradient>

  </defs>

  <rect fill="url(#bg)" width="100%" height="100%"/>

  <text x="50%" y="${subtitle ? "46" : "50"}%" dominant-baseline="middle" text-anchor="middle" fill="#5c4d3a" font-family="Georgia,serif" font-size="${fsz}">${esc(title)}</text>

  ${sub}

</svg>`;

}



const FILES = [

  { name: "hero.svg", w: 1920, h: 720, title: "Конный клуб", sub: "Подмосковье · постой и тренировки" },

  { name: "service-postoy.svg", w: 1200, h: 800, title: "Постой", sub: "денники · кормление · выгул" },

  { name: "service-train.svg", w: 1200, h: 800, title: "Тренировки", sub: "манеж · инструктор" },

  { name: "service-feed.svg", w: 1200, h: 800, title: "Кормление", sub: "рацион по согласованию" },

  { name: "infrastructure.svg", w: 1200, h: 800, title: "Инфраструктура", sub: "плац · левады · амуничник" },

  { name: "manager.svg", w: 512, h: 512, title: "Менеджер", sub: "связь по кнопке" },

  { name: "cms-denniki.svg", w: 900, h: 600, title: "Денники", sub: "" },

  { name: "cms-plac.svg", w: 900, h: 600, title: "Плац", sub: "" },

  { name: "cms-manezh.svg", w: 900, h: 600, title: "Манеж", sub: "" },

  { name: "cms-levada.svg", w: 900, h: 600, title: "Левады", sub: "" },

  { name: "cms-tack.svg", w: 900, h: 600, title: "Амуничник", sub: "" },

  { name: "gallery-stable-3.svg", w: 900, h: 600, title: "Конюшни · вид 3", sub: "" },

  { name: "gallery-arena-3.svg", w: 900, h: 600, title: "Манеж · вид 3", sub: "" },

];



fs.mkdirSync(OUT, { recursive: true });

for (const f of FILES) {

  fs.writeFileSync(path.join(OUT, f.name), svg(f.w, f.h, f.title, f.sub), "utf8");

  console.log("written", f.name);

}

console.log("OK", OUT);


