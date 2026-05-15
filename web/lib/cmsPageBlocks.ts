/** Структура `content` для страниц, которые рендерит `CmsPageContent`. */

export type CmsIntroBlock = { kind: "intro"; text: string };

export type CmsSectionBlock = {
  kind: "section";
  title: string;
  body: string[];
  image?: { src: string; caption?: string };
};

export type CmsRulesSectionBlock = { kind: "rulesSection"; title: string; items: string[] };

export type CmsBlock = CmsIntroBlock | CmsSectionBlock | CmsRulesSectionBlock;

export type CmsPageContentShape = { blocks: CmsBlock[] };

function asRecord(v: unknown): Record<string, unknown> | null {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  return v as Record<string, unknown>;
}

function normalizeIntro(b: Record<string, unknown>): CmsIntroBlock | null {
  if (b.kind !== "intro") return null;
  const text = typeof b.text === "string" ? b.text : "";
  return { kind: "intro", text };
}

function normalizeSection(b: Record<string, unknown>): CmsSectionBlock | null {
  if (b.kind !== "section") return null;
  const title = typeof b.title === "string" ? b.title : "";
  let body: string[] = [];
  if (Array.isArray(b.body)) {
    body = b.body.filter((x): x is string => typeof x === "string");
  }
  if (body.length === 0) body = [""];
  let image: { src: string; caption?: string } | undefined;
  const img = b.image;
  if (img && typeof img === "object" && !Array.isArray(img)) {
    const ir = img as Record<string, unknown>;
    const src = typeof ir.src === "string" ? ir.src : "";
    const caption = typeof ir.caption === "string" ? ir.caption : undefined;
    if (src.trim()) image = { src, caption };
  }
  return { kind: "section", title, body, image };
}

function normalizeRulesSection(b: Record<string, unknown>): CmsRulesSectionBlock | null {
  if (b.kind !== "rulesSection") return null;
  const title = typeof b.title === "string" ? b.title : "";
  let items: string[] = [];
  if (Array.isArray(b.items)) {
    items = b.items.filter((x): x is string => typeof x === "string");
  }
  if (items.length === 0) items = [""];
  return { kind: "rulesSection", title, items };
}

export function normalizePageContent(raw: unknown): CmsPageContentShape {
  const root = asRecord(raw);
  const arr = root?.blocks;
  if (!Array.isArray(arr)) return { blocks: [] };
  const blocks: CmsBlock[] = [];
  for (const item of arr) {
    const rec = asRecord(item);
    if (!rec) continue;
    const block =
      normalizeIntro(rec) ?? normalizeSection(rec) ?? normalizeRulesSection(rec);
    if (block) blocks.push(block);
  }
  return { blocks };
}

export function emptyIntroBlock(): CmsIntroBlock {
  return { kind: "intro", text: "" };
}

export function emptySectionBlock(): CmsSectionBlock {
  return { kind: "section", title: "", body: [""] };
}

export function emptyRulesSectionBlock(): CmsRulesSectionBlock {
  return { kind: "rulesSection", title: "", items: [""] };
}
