"use client";

import { useCallback, useState } from "react";

import {
  type CmsBlock,
  type CmsIntroBlock,
  type CmsRulesSectionBlock,
  type CmsSectionBlock,
  emptyIntroBlock,
  emptyRulesSectionBlock,
  emptySectionBlock,
} from "@/lib/cmsPageBlocks";

type Props = {
  blocks: CmsBlock[];
  onBlocksChange: (next: CmsBlock[]) => void;
  hasDb: boolean;
};

const card =
  "rounded-2xl border border-sand/90 bg-white p-6 shadow-soft ring-1 ring-black/[0.03]";
const label = "block text-xs font-semibold uppercase tracking-wide text-neutral-500";
const input =
  "mt-1.5 w-full rounded-xl border border-sand bg-[#fdfcfa] px-3.5 py-2.5 text-sm text-neutral-900 shadow-inner placeholder:text-neutral-400 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/15";
const textarea = `${input} min-h-[120px] resize-y leading-relaxed`;
const btnGhost =
  "rounded-lg border border-sand bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 hover:border-accent/30 hover:bg-sand/30";
const btnSmall = "rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-200";

function kindLabel(kind: CmsBlock["kind"]): string {
  switch (kind) {
    case "intro":
      return "Вступление";
    case "section":
      return "Раздел со списком";
    case "rulesSection":
      return "Блок правил";
    default:
      return kind;
  }
}

function kindBadgeClass(kind: CmsBlock["kind"]): string {
  switch (kind) {
    case "intro":
      return "bg-sand/80 text-ink";
    case "section":
      return "bg-accent/12 text-accent";
    case "rulesSection":
      return "bg-[#e8f0e8] text-[#2d4a2d]";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

export function AdminCmsBlocksEditor({ blocks, onBlocksChange, hasDb }: Props) {
  const [uploadIdx, setUploadIdx] = useState<number | null>(null);
  const hasIntro = blocks.some((b) => b.kind === "intro");

  const setBlock = useCallback(
    (i: number, b: CmsBlock) => {
      const next = blocks.slice();
      next[i] = b;
      onBlocksChange(next);
    },
    [blocks, onBlocksChange],
  );

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = blocks.slice();
    [next[i], next[j]] = [next[j]!, next[i]!];
    onBlocksChange(next);
  };

  const remove = (i: number) => {
    onBlocksChange(blocks.filter((_, k) => k !== i));
  };

  const add = (kind: CmsBlock["kind"]) => {
    if (kind === "intro" && hasIntro) return;
    const b =
      kind === "intro" ? emptyIntroBlock() : kind === "section" ? emptySectionBlock() : emptyRulesSectionBlock();
    onBlocksChange([...blocks, b]);
  };

  async function uploadSectionImage(i: number, file: File | null) {
    if (!file?.size || !hasDb) return;
    setUploadIdx(i);
    const fd = new FormData();
    fd.set("file", file);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const j = (await r.json().catch(() => ({}))) as { url?: string };
    setUploadIdx(null);
    if (!r.ok || !j.url) return;
    const b = blocks[i];
    if (!b || b.kind !== "section") return;
    const prev = b.image?.caption ?? "";
    setBlock(i, {
      ...b,
      image: { src: j.url, caption: prev },
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-sand/80 bg-gradient-to-r from-sand/25 to-transparent px-4 py-3">
        <p className="text-sm text-neutral-600">Добавить блок в конец страницы:</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={btnGhost}
            disabled={!hasDb || hasIntro}
            onClick={() => add("intro")}
            title={hasIntro ? "Вступление уже есть" : undefined}
          >
            + Вступление
          </button>
          <button type="button" className={btnGhost} disabled={!hasDb} onClick={() => add("section")}>
            + Раздел
          </button>
          <button type="button" className={btnGhost} disabled={!hasDb} onClick={() => add("rulesSection")}>
            + Правила
          </button>
        </div>
      </div>

      {blocks.length === 0 ? (
        <p className="rounded-xl border border-sand bg-sand/20 p-6 text-center text-sm text-neutral-600">
          Блоков пока нет — добавьте первый блок кнопками выше.
        </p>
      ) : null}

      {blocks.map((block, i) => (
        <div key={`${block.kind}-${i}`} className={card}>
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-sand/60 pb-4">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${kindBadgeClass(block.kind)}`}
            >
              {kindLabel(block.kind)} · блок {i + 1}
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                className={btnSmall}
                disabled={!hasDb || i === 0}
                onClick={() => move(i, -1)}
              >
                Вверх
              </button>
              <button
                type="button"
                className={btnSmall}
                disabled={!hasDb || i === blocks.length - 1}
                onClick={() => move(i, 1)}
              >
                Вниз
              </button>
              <button
                type="button"
                className="rounded-lg bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-40"
                disabled={!hasDb}
                onClick={() => remove(i)}
              >
                Удалить
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {block.kind === "intro" ? <IntroFields block={block} disabled={!hasDb} onChange={(b) => setBlock(i, b)} /> : null}
            {block.kind === "section" ? (
              <SectionFields
                block={block}
                disabled={!hasDb}
                uploading={uploadIdx === i}
                onChange={(b) => setBlock(i, b)}
                onUploadFile={(f) => void uploadSectionImage(i, f)}
              />
            ) : null}
            {block.kind === "rulesSection" ? (
              <RulesFields block={block} disabled={!hasDb} onChange={(b) => setBlock(i, b)} />
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function IntroFields({
  block,
  disabled,
  onChange,
}: {
  block: CmsIntroBlock;
  disabled: boolean;
  onChange: (b: CmsIntroBlock) => void;
}) {
  return (
    <label className={label}>
      Текст под заголовком страницы
      <textarea
        className={textarea}
        rows={6}
        value={block.text}
        disabled={disabled}
        placeholder="Короткий вводный абзац для посетителей…"
        onChange={(e) => onChange({ ...block, text: e.target.value })}
      />
    </label>
  );
}

function SectionFields({
  block,
  disabled,
  uploading,
  onChange,
  onUploadFile,
}: {
  block: CmsSectionBlock;
  disabled: boolean;
  uploading: boolean;
  onChange: (b: CmsSectionBlock) => void;
  onUploadFile: (file: File | null) => void;
}) {
  const hasImage = block.image !== undefined;

  const setBodyLine = (li: number, val: string) => {
    const body = block.body.slice();
    body[li] = val;
    onChange({ ...block, body });
  };

  const addBodyLine = () => onChange({ ...block, body: [...block.body, ""] });
  const removeBodyLine = (li: number) => {
    if (block.body.length <= 1) return;
    onChange({ ...block, body: block.body.filter((_, k) => k !== li) });
  };

  return (
    <>
      <label className={label}>
        Заголовок раздела
        <input
          className={input}
          value={block.title}
          disabled={disabled}
          placeholder="Например: Денники"
          onChange={(e) => onChange({ ...block, title: e.target.value })}
        />
      </label>
      <div>
        <p className={label}>Пункты списка</p>
        <ul className="mt-2 space-y-2">
          {block.body.map((line, li) => (
            <li key={li} className="flex gap-2">
              <span className="mt-3 shrink-0 font-mono text-xs text-neutral-400">{li + 1}.</span>
              <textarea
                className={`${textarea} min-h-[72px] flex-1`}
                value={line}
                disabled={disabled}
                onChange={(e) => setBodyLine(li, e.target.value)}
              />
              <button
                type="button"
                className="mt-1 h-9 shrink-0 self-start rounded-lg border border-sand px-2 text-xs text-neutral-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
                disabled={disabled || block.body.length <= 1}
                onClick={() => removeBodyLine(li)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className={`${btnGhost} mt-3`} disabled={disabled} onClick={addBodyLine}>
          + Пункт списка
        </button>
      </div>

      <div className="rounded-xl border border-sand/80 bg-sand/20 p-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-neutral-800">
          <input
            type="checkbox"
            className="rounded border-sand text-accent focus:ring-accent"
            checked={hasImage}
            disabled={disabled}
            onChange={(e) => {
              if (e.target.checked) {
                onChange({ ...block, image: { src: "", caption: "" } });
              } else {
                const { image: _, ...rest } = block;
                onChange(rest as CmsSectionBlock);
              }
            }}
          />
          Иллюстрация справа (как на сайте)
        </label>
        {hasImage ? (
          <div className="mt-4 space-y-3 border-t border-sand/60 pt-4">
            <label className={label}>
              URL изображения
              <input
                className={input}
                value={block.image?.src ?? ""}
                disabled={disabled}
                placeholder="/images/…"
                onChange={(e) =>
                  onChange({
                    ...block,
                    image: {
                      src: e.target.value,
                      caption: block.image?.caption ?? "",
                    },
                  })
                }
              />
            </label>
            <label className={label}>
              Подпись под фото
              <input
                className={input}
                value={block.image?.caption ?? ""}
                disabled={disabled}
                onChange={(e) =>
                  onChange({
                    ...block,
                    image: {
                      src: block.image?.src ?? "",
                      caption: e.target.value,
                    },
                  })
                }
              />
            </label>
            <label className="block text-xs text-neutral-600">
              Загрузить файл
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                disabled={disabled || uploading}
                className="mt-1 block w-full text-xs"
                onChange={(e) => onUploadFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {uploading ? <p className="text-xs text-neutral-500">Загрузка…</p> : null}
          </div>
        ) : null}
      </div>
    </>
  );
}

function RulesFields({
  block,
  disabled,
  onChange,
}: {
  block: CmsRulesSectionBlock;
  disabled: boolean;
  onChange: (b: CmsRulesSectionBlock) => void;
}) {
  const setItem = (li: number, val: string) => {
    const items = block.items.slice();
    items[li] = val;
    onChange({ ...block, items });
  };

  const addItem = () => onChange({ ...block, items: [...block.items, ""] });
  const removeItem = (li: number) => {
    if (block.items.length <= 1) return;
    onChange({ ...block, items: block.items.filter((_, k) => k !== li) });
  };

  return (
    <>
      <label className={label}>
        Заголовок блока правил
        <input
          className={input}
          value={block.title}
          disabled={disabled}
          placeholder="Например: 1. Общие правила"
          onChange={(e) => onChange({ ...block, title: e.target.value })}
        />
      </label>
      <div>
        <p className={label}>Правила (пункты)</p>
        <ul className="mt-2 space-y-2">
          {block.items.map((line, li) => (
            <li key={li} className="flex gap-2">
              <span className="mt-3 shrink-0 font-mono text-xs text-neutral-400">{li + 1}.</span>
              <textarea
                className={`${textarea} min-h-[72px] flex-1`}
                value={line}
                disabled={disabled}
                onChange={(e) => setItem(li, e.target.value)}
              />
              <button
                type="button"
                className="mt-1 h-9 shrink-0 self-start rounded-lg border border-sand px-2 text-xs text-neutral-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
                disabled={disabled || block.items.length <= 1}
                onClick={() => removeItem(li)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className={`${btnGhost} mt-3`} disabled={disabled} onClick={addItem}>
          + Правило
        </button>
      </div>
    </>
  );
}
