"use client";

import { useState } from "react";

import type { HomeTexts, ResolvedSiteImages } from "@/lib/homePageSettings";
import { siteImages } from "@/lib/siteImages";

const LABELS: Record<keyof ResolvedSiteImages, string> = {
  hero: "Герой (верх страницы)",
  servicePostoy: "Услуга «Постой»",
  serviceTrain: "Услуга «Тренировки»",
  serviceFeed: "Услуга «Кормление»",
  infrastructureAside: "Блок «Инфраструктура» (фото справа)",
  managerPortrait: "Портрет менеджера",
};

type Props = {
  initialImages: ResolvedSiteImages;
  initialTexts: HomeTexts;
  hasDb: boolean;
};

export function AdminHomeEditor({ initialImages, initialTexts, hasDb }: Props) {
  const keys = Object.keys(siteImages) as (keyof ResolvedSiteImages)[];
  const [images, setImages] = useState(initialImages);
  const [texts, setTexts] = useState(initialTexts);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function uploadToSlot(slot: keyof ResolvedSiteImages, file: File | null) {
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
      setImages((prev) => ({ ...prev, [slot]: j.url! }));
      setMsg("Файл загружен — нажмите «Сохранить всё», чтобы применить.");
    }
  }

  async function save() {
    if (!hasDb) return;
    setLoading(true);
    setMsg("");
    const r = await fetch("/api/admin/home", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site_images: images, home_texts: texts }),
    });
    const j = (await r.json().catch(() => ({}))) as { error?: string };
    setLoading(false);
    if (!r.ok) {
      setMsg(j.error || "Ошибка сохранения");
      return;
    }
    setMsg("Сохранено.");
  }

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl text-accent">Главная страница</h1>
      {!hasDb ? (
        <p className="text-sm text-amber-800">Подключите DATABASE_URL, чтобы сохранять изменения.</p>
      ) : null}
      {msg ? <p className="text-sm text-neutral-700">{msg}</p> : null}

      <section className="space-y-4 rounded-xl border border-sand/90 bg-white p-6 shadow-soft">
        <h2 className="font-semibold text-neutral-900">Тексты</h2>
        {(Object.keys(texts) as (keyof HomeTexts)[]).map((k) => (
          <label key={k} className="block text-sm">
            <span className="text-neutral-600">{k}</span>
            <textarea
              className="mt-1 w-full rounded-lg border border-sand px-3 py-2 text-sm text-neutral-900"
              rows={k === "heroSubtitle" || k === "servicesIntro" || k === "leadIntro" ? 3 : 1}
              value={texts[k]}
              onChange={(e) => setTexts((t) => ({ ...t, [k]: e.target.value }))}
              disabled={!hasDb}
            />
          </label>
        ))}
      </section>

      <section className="space-y-6 rounded-xl border border-sand/90 bg-white p-6 shadow-soft">
        <h2 className="font-semibold text-neutral-900">Изображения (URL или загрузка)</h2>
        {keys.map((key) => (
          <div key={key} className="border-b border-sand/60 pb-4 last:border-0">
            <p className="text-sm font-medium text-neutral-800">{LABELS[key]}</p>
            <input
              type="text"
              className="mt-2 w-full rounded-lg border border-sand px-3 py-2 text-sm"
              value={images[key]}
              onChange={(e) => setImages((im) => ({ ...im, [key]: e.target.value }))}
              disabled={!hasDb}
            />
            <label className="mt-2 block text-xs text-neutral-600">
              Загрузить файл
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="ml-2 text-xs"
                disabled={!hasDb || loading}
                onChange={(e) => void uploadToSlot(key, e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        ))}
      </section>

      <button
        type="button"
        onClick={() => void save()}
        disabled={!hasDb || loading}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Сохранение…" : "Сохранить всё"}
      </button>
    </div>
  );
}
