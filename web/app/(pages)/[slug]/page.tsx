export const dynamic = "force-dynamic";

import { CmsPageContent } from "@/components/CmsPageContent";
import type { CmsPageRecord } from "@/lib/cms";
import { getCmsPageBySlug } from "@/lib/cms";
import { cmsPageFallbacks } from "@/lib/cmsPageFallbacks";
import { routeToPageSlug } from "@/lib/pageSlugMap";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const valid = new Set(Object.keys(routeToPageSlug));

export async function generateStaticParams() {
  return Object.keys(routeToPageSlug).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!valid.has(slug)) return {};
  const apiSlug = routeToPageSlug[slug as keyof typeof routeToPageSlug];
  let pageRow: CmsPageRecord | null = null;
  try {
    pageRow = await getCmsPageBySlug(apiSlug);
  } catch {
    pageRow = null;
  }
  if (!pageRow) {
    const fb = cmsPageFallbacks[apiSlug];
    if (fb) return { title: fb.title };
    return {};
  }
  return { title: pageRow.title };
}

export default async function DynamicCmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!valid.has(slug)) notFound();
  const apiSlug = routeToPageSlug[slug as keyof typeof routeToPageSlug];
  let page: CmsPageRecord | null = null;
  try {
    page = await getCmsPageBySlug(apiSlug);
  } catch {
    page = null;
  }
  if (!page) {
    const fb = cmsPageFallbacks[apiSlug];
    if (!fb) notFound();
    page = fb;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-serif text-4xl text-accent">{page.title}</h1>
      <div className="mt-8">
        <CmsPageContent content={page.content} />
      </div>
    </div>
  );
}
