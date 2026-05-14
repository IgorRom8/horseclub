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

export type GalleryItem = {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  title: string;
};

type Props = {
  items: GalleryItem[];
  className?: string;
};

export function GalleryGrid({ items, className }: Props) {
  const [index, setIndex] = useState(-1);
  const slides: Slide[] = useMemo(
    () => items.map((i) => ({ src: i.imageUrl, title: i.title, alt: i.title })),
    [items],
  );

  const open = useCallback((i: number) => setIndex(i), []);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => open(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-md border border-sand bg-sand text-left focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <Image
              src={item.thumbnailUrl}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover transition group-hover:scale-[1.02]"
              loading="lazy"
            />
            <span className="absolute bottom-0 left-0 right-0 bg-black/45 px-2 py-1 text-xs text-white">
              {item.title}
            </span>
          </button>
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
