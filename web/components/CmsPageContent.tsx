import { RegularImageBlock } from "@/components/RegularImageBlock";
import type { CmsPageContentShape } from "@/lib/cmsPageBlocks";

export function CmsPageContent({ content }: { content: unknown }) {
  const c = content as CmsPageContentShape;
  const blocks = c.blocks ?? [];

  return (
    <div className="prose prose-neutral max-w-none">
      {blocks.map((b, i) => {
        if (b.kind === "intro") {
          return (
            <p key={i} className="text-lg text-neutral-700">
              {b.text}
            </p>
          );
        }
        if (b.kind === "section") {
          const hasImage = Boolean(b.image);
          return (
            <section
              key={i}
              className={hasImage ? "mt-10 grid gap-8 md:grid-cols-2 md:items-start" : "mt-10 max-w-3xl"}
            >
              <div>
                <h2 className="font-serif text-2xl text-accent">{b.title}</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-800">
                  {b.body.map((line, j) => (
                    <li key={j}>{line}</li>
                  ))}
                </ul>
              </div>
              {hasImage ? (
                <RegularImageBlock
                  src={b.image!.src}
                  alt={b.image!.caption ?? b.title}
                  caption={b.image!.caption}
                />
              ) : null}
            </section>
          );
        }
        if (b.kind === "rulesSection") {
          return (
            <section key={i} className="mt-10">
              <h2 className="font-serif text-2xl text-accent">{b.title}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-800">
                {b.items.map((line, j) => (
                  <li key={j}>{line}</li>
                ))}
              </ul>
            </section>
          );
        }
        return null;
      })}
    </div>
  );
}
