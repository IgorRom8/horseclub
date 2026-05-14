export const dynamic = "force-dynamic";

import { GalleryGrid } from "@/components/GalleryGrid";
import { ManagerContactBlock } from "@/components/ManagerContactBlock";
import type { GalleryDto } from "@/lib/cms";
import { getGalleryByCategory } from "@/lib/cms";
import { getStaticKonyushniGallery } from "@/lib/stablesGalleryFallback";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Конюшни · фотогалерея",
};

type Img = Pick<GalleryDto, "id" | "imageUrl" | "thumbnailUrl" | "title">;

async function loadGallery(): Promise<Img[]> {
  if (!process.env.DATABASE_URL?.trim()) {
    return getStaticKonyushniGallery();
  }

  try {
    const [stables, arenas, paddocks] = await Promise.all([
      getGalleryByCategory("stables"),
      getGalleryByCategory("arenas"),
      getGalleryByCategory("paddocks"),
    ]);
    const merged = [...stables, ...arenas, ...paddocks].slice(0, 9);
    return merged.length ? merged : getStaticKonyushniGallery();
  } catch {
    return getStaticKonyushniGallery();
  }
}

export default async function StablesGalleryPage() {
  const items = await loadGallery();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-serif text-4xl text-accent">Конюшни</h1>
      <p className="mt-3 max-w-2xl text-neutral-700">
        Фотогалерея: денники, манеж, левады. Клик — полноэкранный просмотр со стрелками.
      </p>

      <GalleryGrid items={items} className="mt-10" />

      <ManagerContactBlock className="mt-16" />
    </div>
  );
}
