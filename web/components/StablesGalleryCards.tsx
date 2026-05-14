"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import type { Slide } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const Lightbox = dynamic(
  () => import("yet-another-react-lightbox").then((mod) => mod.Lightbox),
  { ssr: false, loading: () => null },
);

import type { StablesGalleryCard } from "@/lib/stablesGalleryFallback";

type Props = {
  items: StablesGalleryCard[];
  className?: string;
};

export function StablesGalleryCards({ items, className }: Props) {
  const [index, setIndex] = useState(-1);

  const slides: Slide[] = useMemo(
    () =>
      items.map((i) => ({
        src: i.imageUrl,
        title: i.title,
        description: i.description,
        alt: i.title,
      })),
    [items],
  );

  const open = useCallback((i: number) => setIndex(i), []);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {items.map((item, i) => (
          <article
            key={item.id}
            className="group flex h-full flex-col overflow-hidden rounded-lg border border-sand bg-white/80 shadow-soft transition duration-300 hover:border-accent/20 hover:shadow-lift"
          >
            <button
              type="button"
              onClick={() => open(i)}
              className="relative aspect-[4/3] w-full shrink-0 overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
            >
              <Image
                src={item.thumbnailUrl}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition duration-500 ease-smooth group-hover:scale-[1.04]"
                loading="lazy"
              />
              <span className="absolute bottom-3 left-3 rounded border border-white/30 bg-black/45 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white backdrop-blur-[2px]">
                Открыть крупно
              </span>
            </button>
            <div className="flex flex-1 flex-col border-t border-sand/90 bg-gradient-to-b from-white/60 to-[#faf7f2]/90 p-5">
              <h2 className="font-serif text-xl leading-snug text-accent">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        controller={{ closeOnBackdropClick: true }}
      />
    </div>
  );
}
