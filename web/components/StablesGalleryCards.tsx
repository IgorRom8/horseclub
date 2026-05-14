"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import type { StablesGalleryCard } from "@/lib/stablesGalleryFallback";

type Props = {
  items: StablesGalleryCard[];
  className?: string;
};

export function StablesGalleryCards({ items, className }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close]);

  const active = openIndex !== null ? items[openIndex] : null;

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {items.map((item, i) => (
          <article
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={() => setOpenIndex(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpenIndex(i);
              }
            }}
            className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-sand bg-white/80 shadow-soft transition duration-300 hover:border-accent/25 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
              <Image
                src={item.thumbnailUrl}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition duration-500 ease-smooth group-hover:scale-[1.04]"
                loading="lazy"
              />
              <span className="absolute bottom-3 left-3 rounded border border-white/35 bg-black/50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white backdrop-blur-[2px]">
                Подробнее
              </span>
            </div>
            <div className="flex flex-1 flex-col border-t border-sand/90 bg-gradient-to-b from-white/60 to-[#faf7f2]/90 p-5">
              <h2 className="font-serif text-xl leading-snug text-accent">{item.title}</h2>
              <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-neutral-700 md:line-clamp-3">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px] transition-opacity"
            aria-label="Закрыть"
            onClick={close}
          />
          <div
            className="relative z-10 flex max-h-[min(92vh,880px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-sand bg-[var(--bg)] shadow-lift sm:rounded-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="stables-modal-title"
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-sand bg-white/90 text-lg text-accent shadow-soft transition hover:bg-sand hover:text-accent-dark"
              aria-label="Закрыть окно"
            >
              ×
            </button>
            <div className="shrink-0 border-b border-sand bg-sand/40">
              <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
                <Image
                  src={active.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 48rem"
                  priority
                />
              </div>
            </div>
            <div className="max-h-[40vh] overflow-y-auto px-5 pb-6 pt-5 sm:max-h-none sm:px-7 sm:pb-7">
              <h2
                id="stables-modal-title"
                className="pr-10 font-serif text-2xl leading-tight text-accent sm:text-3xl"
              >
                {active.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-neutral-700 sm:text-base">
                {active.description}
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-6 rounded-md border border-sand bg-white px-4 py-2.5 text-sm font-medium text-accent shadow-soft transition hover:border-accent/30 hover:bg-sand/80"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
