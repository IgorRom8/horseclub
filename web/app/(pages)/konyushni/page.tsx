export const dynamic = "force-dynamic";

import { ManagerContactBlock } from "@/components/ManagerContactBlock";
import { StablesGalleryCards } from "@/components/StablesGalleryCards";
import { getGalleryByCategory } from "@/lib/cms";
import {
  getStaticStablesGalleryCards,
  mergeDbStablesGalleryImages,
} from "@/lib/stablesGalleryFallback";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Конюшни",
  description: "Как устроены денники и постой на базе: три ключевых ракурса.",
};

async function loadStablesCards() {
  const fallback = getStaticStablesGalleryCards();
  if (!process.env.DATABASE_URL?.trim()) return fallback;

  try {
    const stables = await getGalleryByCategory("stables");
    if (stables.length > 0) return mergeDbStablesGalleryImages(stables, fallback);
  } catch {
    /* БД недоступна — статика */
  }
  return fallback;
}

export default async function StablesGalleryPage() {
  const items = await loadStablesCards();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-serif text-4xl text-accent">Конюшни</h1>
      <p className="mt-3 max-w-2xl text-neutral-700">
        Три снимка об устройстве постоя: денники, проходы и удобство повседневной работы с лошадьми.
        Нажмите фото — откроется просмотр крупным планом.
      </p>

      <StablesGalleryCards items={items} className="mt-10" />

      <ManagerContactBlock className="mt-16" />
    </div>
  );
}
