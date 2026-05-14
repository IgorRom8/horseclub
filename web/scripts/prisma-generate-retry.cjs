/* eslint-disable no-console -- bootstrap for Prisma on Windows/OneDrive */

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const webRoot = path.join(__dirname, "..");

const attempts = Number(process.env.PRISMA_GENERATE_RETRIES || "6");
const delayMs = Number(process.env.PRISMA_GENERATE_RETRY_DELAY_MS || "2000");

function sleepSync(ms) {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    /* wait */
  }
}

/** Запуск Prisma без .cmd/sh: на Windows пути с кириллицей ломают cmd.exe. */
function resolvePrismaEntry() {
  const roots = [webRoot, path.join(webRoot, "..")];
  for (const root of roots) {
    const p = path.join(root, "node_modules", "prisma", "build", "index.js");
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      /* ignore */
    }
  }
  return null;
}

function runGenerate() {
  const entry = resolvePrismaEntry();
  if (!entry) {
    console.error(
      "Не найден prisma (node_modules/prisma/build/index.js). Выполните npm install из корня монорепозитория.",
    );
    return { status: 1 };
  }
  return spawnSync(process.execPath, [entry, "generate"], {
    cwd: webRoot,
    stdio: "inherit",
    env: process.env,
  });
}

let lastStatus = 1;

for (let i = 1; i <= attempts; i++) {
  console.log(`prisma generate (${i}/${attempts})…`);
  const r = runGenerate();
  lastStatus = typeof r.status === "number" ? r.status : 1;
  if (lastStatus === 0) process.exit(0);

  if (i < attempts) {
    console.warn(`prisma generate не удался (код ${lastStatus}). Повтор через ${delayMs / 1000} с…`);
    sleepSync(delayMs);
  }
}

console.error(
  "prisma generate: все попытки исчерпаны. Часто помогает: остановить `npm run dev`, закрыть процессы Node, " +
    "временно отключить синхронизацию OneDrive для папки проекта или перенести репозиторий вне OneDrive."
);
process.exit(lastStatus);
