import type { NextConfig } from "next";

/**
 * Одна директория `.next`: отдельные папки по портам dev часто смешиваются со `next build` / OneDrive,
 * после чего server-loader ищет `./861.js`, а файл оказывается только в `chunks/`.
 */

const nextConfig: NextConfig = {

  distDir: ".next",

  transpilePackages: ["yet-another-react-lightbox"],

  images: {

    /** Локальные файлы из `public/images`. */

    unoptimized: true,

  },

};



export default nextConfig;


