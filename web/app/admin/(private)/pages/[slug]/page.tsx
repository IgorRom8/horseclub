import { notFound } from "next/navigation";

import { AdminPageEditor } from "./AdminPageEditor";
import { adminPageLabels, isAdminEditableSlug, type AdminEditableSlug } from "@/lib/adminEditablePages";
import { cmsPageFallbacks } from "@/lib/cmsPageFallbacks";
import { prisma } from "@/lib/prisma";

async function loadPage(slug: AdminEditableSlug) {
  if (process.env.DATABASE_URL?.trim()) {
    try {
      const row = await prisma.page.findUnique({ where: { slug } });
      if (row) return { title: row.title, content: row.content };
    } catch {
      /* */
    }
  }
  const fb = cmsPageFallbacks[slug];
  if (!fb) return null;
  return { title: fb.title, content: fb.content };
}

export default async function AdminSinglePageEditor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isAdminEditableSlug(slug)) notFound();
  const d = await loadPage(slug);
  if (!d) notFound();
  const hasDb = Boolean(process.env.DATABASE_URL?.trim());

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-accent">{adminPageLabels[slug]}</h1>
      <AdminPageEditor slug={slug} initialTitle={d.title} initialContent={d.content} hasDb={hasDb} />
    </div>
  );
}
