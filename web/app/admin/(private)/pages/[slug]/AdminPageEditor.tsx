"use client";

import { useMemo, useState } from "react";

import { AdminCmsBlocksEditor } from "@/components/admin/AdminCmsBlocksEditor";
import {
  type CmsBlock,
  emptyIntroBlock,
  emptyRulesSectionBlock,
  emptySectionBlock,
  normalizePageContent,
} from "@/lib/cmsPageBlocks";

type Props = {
  slug: string;
  initialTitle: string;
  initialContent: unknown;
  hasDb: boolean;
};

function initialBlocks(slug: string, raw: unknown): CmsBlock[] {
  const n = normalizePageContent(raw).blocks;
  if (n.length > 0) return n;
  if (slug === "rules") return [emptyRulesSectionBlock()];
  return [emptyIntroBlock(), emptySectionBlock()];
}

function serializeForSave(blocks: CmsBlock[]): { blocks: CmsBlock[] } {
  const blocksOut: CmsBlock[] = blocks.map((b) => {
    if (b.kind === "intro") {
      return { kind: "intro", text: b.text.replace(/\s+$/u, "") };
    }
    if (b.kind === "section") {
      const body = b.body.map((s) => s.trim()).filter((s) => s.length > 0);
      let image = b.image;
      if (image) {
        const src = image.src.trim();
        if (!src) image = undefined;
        else {
          const cap = image.caption?.trim();
          image = { src, caption: cap || undefined };
        }
      }
      return {
        kind: "section",
        title: b.title.trim(),
        body: body.length > 0 ? body : [""],
        image,
      };
    }
    const items = b.items.map((s) => s.trim()).filter((s) => s.length > 0);
    return {
      kind: "rulesSection",
      title: b.title.trim(),
      items: items.length > 0 ? items : [""],
    };
  });
  return { blocks: blocksOut };
}

export function AdminPageEditor({ slug, initialTitle, initialContent, hasDb }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [blocks, setBlocks] = useState(() => initialBlocks(slug, initialContent));
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const previewJson = useMemo(() => JSON.stringify(serializeForSave(blocks), null, 2), [blocks]);

  async function save() {
    if (!hasDb) return;
    setLoading(true);
    setMsg("");
    const content = serializeForSave(blocks);
    const r = await fetch(`/api/admin/page/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), content }),
    });
    const j = (await r.json().catch(() => ({}))) as { error?: string };
    setLoading(false);
    if (!r.ok) {
      setMsg(j.error || "Ошибка");
      return;
    }
    setMsg("Сохранено.");
  }

  return (
    <div className="space-y-8">
      {!hasDb ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Подключите DATABASE_URL, чтобы сохранять.
        </p>
      ) : null}
      {msg ? (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${msg === "Сохранено." ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-800"}`}
        >
          {msg}
        </p>
      ) : null}

      <section className="rounded-2xl border border-sand/90 bg-gradient-to-br from-white to-sand/20 p-6 shadow-soft md:p-8">
        <h2 className="font-serif text-lg font-semibold text-accent">Заголовок страницы</h2>
        <p className="mt-1 text-xs text-neutral-600">Отображается как H1 на публичной странице.</p>
        <input
          className="mt-4 w-full rounded-xl border border-sand bg-white px-4 py-3 text-base font-medium text-neutral-900 shadow-inner focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/15"
          value={title}
          disabled={!hasDb}
          placeholder="Заголовок"
          onChange={(e) => setTitle(e.target.value)}
        />
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg font-semibold text-accent">Содержимое</h2>
            <p className="mt-1 max-w-xl text-xs text-neutral-600">
              Блоки как на сайте: вступление, разделы со списками и иллюстрациями, блоки правил. Можно менять
              порядок, добавлять и удалять блоки.
            </p>
          </div>
          <button
            type="button"
            className="text-xs font-medium text-neutral-500 underline-offset-2 hover:text-accent hover:underline"
            onClick={() => setShowJson((v) => !v)}
          >
            {showJson ? "Скрыть JSON" : "Показать JSON (для отладки)"}
          </button>
        </div>

        {showJson ? (
          <pre className="mb-4 max-h-64 overflow-auto rounded-xl border border-sand bg-neutral-900/95 p-4 font-mono text-[11px] leading-relaxed text-emerald-100/95">
            {previewJson}
          </pre>
        ) : null}

        <AdminCmsBlocksEditor blocks={blocks} onBlocksChange={setBlocks} hasDb={hasDb} />
      </section>

      <button
        type="button"
        onClick={() => void save()}
        disabled={!hasDb || loading || !title.trim()}
        className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-dark disabled:opacity-50"
      >
        {loading ? "Сохранение…" : "Сохранить страницу"}
      </button>
    </div>
  );
}
