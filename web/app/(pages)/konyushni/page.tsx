export const dynamic = "force-dynamic";

import { GalleryGrid } from "@/components/GalleryGrid";
import { ManagerContactBlock } from "@/components/ManagerContactBlock";
import type { GalleryDto } from "@/lib/cms";
import { getGalleryByCategory } from "@/lib/cms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Конюшни · фотогалерея",
};

type Img = Pick<GalleryDto, "id" | "imageUrl" | "thumbnailUrl" | "title">;

async function loadGallery(): Promise<Img[]> {
  try {
    const [stables, arenas, paddocks] = await Promise.all([
      getGalleryByCategory("stables"),
      getGalleryByCategory("arenas"),
      getGalleryByCategory("paddocks"),
    ]);
    return [...stables, ...arenas, ...paddocks].slice(0, 9);
  } catch {
    return [];
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

      {items.length ? (
        <GalleryGrid items={items} className="mt-10" />
      ) : (
        <p className="mt-10 text-neutral-600">
          Подключите PostgreSQL (DATABASE_URL в .env), затем в каталоге <code className="rounded bg-sand/80 px-1">web</code>{" "}
          выполните <code className="rounded bg-sand/80 px-1">npm run db:push</code> и{" "}
          <code className="rounded bg-sand/80 px-1">npm run db:seed</code>.
        </p>
      )}

      <ManagerContactBlock className="mt-16" />
    </div>
  );
}
