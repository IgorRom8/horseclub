"use client";

import { useState } from "react";

export type GalleryRow = {
  id: string;
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  description: string;
  detail: string;
};

type Props = { items: GalleryRow[]; hasDb: boolean };

export function AdminGalleryEditor({ items, hasDb }: Props) {
  const [rows, setRows] = useState(items);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function uploadFor(id: string, file: File | null) {
    if (!file?.size) return;
    setLoading(true);
    setMsg("");
    const fd = new FormData();
    fd.set("file", file);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const j = (await r.json().catch(() => ({}))) as { url?: string; error?: string };
    setLoading(false);
    if (!r.ok) {
      setMsg(j.error || "Ошибка загрузки");
      return;
    }
    if (j.url) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, imageUrl: j.url!, thumbnailUrl: j.url! } : row,
        ),
      );
      setMsg("URL подставлен — сохраните карточку.");
    }
  }

  async function saveRow(row: GalleryRow) {
    if (!hasDb) return;
    setLoading(true);
    setMsg("");
    const r = await fetch(`/api/admin/gallery/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: row.title,
        imageUrl: row.imageUrl,
        thumbnailUrl: row.thumbnailUrl,
        description: row.description,
        detail: row.detail,
      }),
    });
    const j = (await r.json().catch(() => ({}))) as { error?: string };
    setLoading(false);
    if (!r.ok) {
      setMsg(j.error || "Ошибка");
      return;
    }
    setMsg("Карточка сохранена.");
  }

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl text-accent">Конюшни — галерея</h1>
        <p className="text-sm text-neutral-700">
          В базе нет записей категории <code>stables</code>. Укажите <code>DATABASE_URL</code>, выполните{" "}
          <code className="rounded bg-sand px-1">npm run db:push</code> и{" "}
          <code className="rounded bg-sand px-1">npm run db:seed</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl text-accent">Конюшни — три карточки</h1>
      {!hasDb ? (
        <p className="text-sm text-amber-800">Подключите DATABASE_URL для сохранения.</p>
      ) : null}
      {msg ? <p className="text-sm text-neutral-700">{msg}</p> : null}

      {rows.map((row, idx) => (
        <div key={row.id} className="space-y-3 rounded-xl border border-sand/90 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold text-neutral-500">Карточка {idx + 1}</p>
          <label className="block text-sm">
            Заголовок
            <input
              className="mt-1 w-full rounded-lg border border-sand px-3 py-2"
              value={row.title}
              onChange={(e) => setRows((r) => r.map((x) => (x.id === row.id ? { ...x, title: e.target.value } : x)))}
              disabled={!hasDb}
            />
          </label>
          <label className="block text-sm">
            Краткий текст (карточка)
            <textarea
              className="mt-1 w-full rounded-lg border border-sand px-3 py-2"
              rows={3}
              value={row.description}
              onChange={(e) =>
                setRows((r) => r.map((x) => (x.id === row.id ? { ...x, description: e.target.value } : x)))
              }
              disabled={!hasDb}
            />
          </label>
          <label className="block text-sm">
            Подробный текст (модалка)
            <textarea
              className="mt-1 w-full rounded-lg border border-sand px-3 py-2 font-mono text-xs"
              rows={8}
              value={row.detail}
              onChange={(e) =>
                setRows((r) => r.map((x) => (x.id === row.id ? { ...x, detail: e.target.value } : x)))
              }
              disabled={!hasDb}
            />
          </label>
          <label className="block text-sm">
            URL большого фото
            <input
              className="mt-1 w-full rounded-lg border border-sand px-3 py-2 text-sm"
              value={row.imageUrl}
              onChange={(e) =>
                setRows((r) => r.map((x) => (x.id === row.id ? { ...x, imageUrl: e.target.value } : x)))
              }
              disabled={!hasDb}
            />
          </label>
          <label className="block text-sm">
            URL превью (можно совпадать с большим)
            <input
              className="mt-1 w-full rounded-lg border border-sand px-3 py-2 text-sm"
              value={row.thumbnailUrl}
              onChange={(e) =>
                setRows((r) => r.map((x) => (x.id === row.id ? { ...x, thumbnailUrl: e.target.value } : x)))
              }
              disabled={!hasDb}
            />
          </label>
          <label className="mt-2 block text-xs text-neutral-600">
            Загрузить изображение (подставит оба URL)
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="ml-2"
              disabled={!hasDb || loading}
              onChange={(e) => void uploadFor(row.id, e.target.files?.[0] ?? null)}
            />
          </label>
          <button
            type="button"
            onClick={() => void saveRow(row)}
            disabled={!hasDb || loading}
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Сохранить карточку
          </button>
        </div>
      ))}
    </div>
  );
}
