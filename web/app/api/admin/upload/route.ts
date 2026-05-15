import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { assertAdmin } from "@/lib/adminApiAuth";

export const runtime = "nodejs";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX = 8 * 1024 * 1024;

const extFromMime: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function POST(req: Request) {
  const auth = await assertAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  if (process.env.VERCEL === "1") {
    return NextResponse.json(
      {
        error:
          "На Vercel нельзя сохранять загрузки на локальный диск (файлы не сохраняются между запросами). Укажите URL картинки вручную или подключите хранилище файлов (например Vercel Blob).",
      },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Ожидается multipart/form-data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
  }
  if (file.size > MAX) {
    return NextResponse.json({ error: "Файл больше 8 МБ" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Допустимы JPEG, PNG, WebP, GIF" }, { status: 400 });
  }

  const ext = extFromMime[file.type] ?? ".bin";
  const name = `${randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), "public", "images", "uploads");
  try {
    await mkdir(dir, { recursive: true });
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, name), buf);
  } catch (e) {
    const code = e && typeof e === "object" && "code" in e ? String((e as NodeJS.ErrnoException).code) : "";
    console.error("admin upload write failed", e);
    if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
      return NextResponse.json(
        {
          error:
            "Файловая система недоступна для записи на этом сервере. Используйте прямую ссылку на изображение или внешнее хранилище.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: "Не удалось сохранить файл" }, { status: 500 });
  }

  return NextResponse.json({ url: `/images/uploads/${name}` });
}
