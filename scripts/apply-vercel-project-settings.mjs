#!/usr/bin/env node
/**
 * Настраивает проект на Vercel под этот монорепозиторий (Next в ./web).
 *
 * Токен: Vercel → Account Settings → Tokens → Create.
 * Команда из корня репозитория:
 *   VERCEL_TOKEN=... npm run vercel:apply -- my-project-name
 * Для команды (не личного аккаунта): VERCEL_TEAM_ID=team_...
 *
 * @see https://vercel.com/docs/rest-api/reference/endpoints/projects/update-an-existing-project
 */

const token = process.env.VERCEL_TOKEN;
const teamId = process.env.VERCEL_TEAM_ID || "";
const arg = process.argv[2];
/** Имя или id проекта из URL / настроек на Vercel */
const idOrName =
  arg?.trim() ||
  process.env.VERCEL_PROJECT_NAME?.trim() ||
  "horseclub";

if (!token) {
  console.error(`Задайте переменную окружения VERCEL_TOKEN.

  1) Создайте токен: https://vercel.com/account/tokens
  2) В PowerShell:
     $env:VERCEL_TOKEN="ваш_токен"
     npm run vercel:apply -- ${idOrName}
  3) Если проект в команде:
     $env:VERCEL_TEAM_ID="team_xxxxx"`);
  process.exit(1);
}

const qs = new URLSearchParams();
if (teamId) qs.set("teamId", teamId);

async function main() {
  const base = `https://api.vercel.com/v9/projects/${encodeURIComponent(idOrName)}`;
  const url = qs.size ? `${base}?${qs}` : base;

  /** @type {Record<string, unknown>} */
  const body = {
    rootDirectory: "web",
    framework: "nextjs",
    outputDirectory: null,
    /** Как в web/vercel.json — lockfile в корне монорепо */
    installCommand:
      'if [ "$(basename "$PWD")" = "web" ] && [ -f ../package.json ]; then cd .. && (npm ci || npm install); else (npm ci || npm install); fi',
    /** По умолчанию из package.json пакета web через vercel.json */
    buildCommand: null,
    /** Для workspace / установки из родительской папки */
    sourceFilesOutsideRootDirectory: true,
  };

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  /** @type {unknown} */
  let json;
  try {
    json = await res.json();
  } catch {
    json = {};
  }

  if (!res.ok) {
    console.error("Vercel API:", res.status, json);
    process.exit(1);
  }

  const p = /** @type {Record<string, unknown>} */ (json);
  console.log("Готово. Текущие настройки проекта:");
  console.log({
    name: p.name,
    id: p.id,
    rootDirectory: p.rootDirectory,
    framework: p.framework,
    outputDirectory: p.outputDirectory,
    installCommand: p.installCommand,
    buildCommand: p.buildCommand,
    sourceFilesOutsideRootDirectory: p.sourceFilesOutsideRootDirectory,
  });
  console.log("\nСделайте Redeploy последнего коммита в Vercel (Deployments → … → Redeploy).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
