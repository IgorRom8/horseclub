import { AdminGalleryEditor } from "./AdminGalleryEditor";
import { getGalleryByCategory } from "@/lib/cms";

export default async function AdminGalleryPage() {
  const hasDb = Boolean(process.env.DATABASE_URL?.trim());
  let items: {
    id: string;
    title: string;
    imageUrl: string;
    thumbnailUrl: string;
    description: string;
    detail: string;
  }[] = [];

  if (hasDb) {
    try {
      const rows = await getGalleryByCategory("stables");
      items = rows.map((r) => ({
        id: r.id,
        title: r.title,
        imageUrl: r.imageUrl,
        thumbnailUrl: r.thumbnailUrl,
        description: r.description ?? "",
        detail: r.detail ?? "",
      }));
    } catch {
      items = [];
    }
  }

  return <AdminGalleryEditor items={items} hasDb={hasDb} />;
}
