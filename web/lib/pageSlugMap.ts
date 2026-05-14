/** URL-сегмент → slug в API / базе Page */
export const routeToPageSlug: Record<string, string> = {
  infrastruktura: "infrastructure",
  "o-nas": "about",
  "pravila-i-tb": "rules",
};

export type DynamicSlugKey = keyof typeof routeToPageSlug;
