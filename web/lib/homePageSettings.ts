import { ensureDatabaseUrlFromIntegrations } from "@/lib/ensureDatabaseUrl";

ensureDatabaseUrlFromIntegrations();

import { prisma } from "@/lib/prisma";
import { siteImages } from "@/lib/siteImages";

export type HomeTexts = {
  heroEyebrow: string;
  heroSubtitle: string;
  servicesTitle: string;
  servicesIntro: string;
  infraTitle: string;
  leadTitle: string;
  leadIntro: string;
  managerTitle: string;
};

export const defaultHomeTexts: HomeTexts = {
  heroEyebrow: "Конная база",
  heroSubtitle: "Постой, тренировки, понятная инфраструктура и регламент площадки.",
  servicesTitle: "Услуги",
  servicesIntro: "Три направления: размещение лошади, занятия с тренером, кормление по рациону.",
  infraTitle: "Инфраструктура",
  leadTitle: "Оставить заявку",
  leadIntro:
    "Укажите контакты и при желании удобную дату — менеджер свяжется с вами для уточнения деталей.",
  managerTitle: "Связь с менеджером",
};

export type ResolvedSiteImages = Record<keyof typeof siteImages, string>;

const SITE_IMAGES_KEY = "site_images";
const HOME_TEXTS_KEY = "home_texts";

function cloneImages(): ResolvedSiteImages {
  return { ...siteImages };
}

export async function getResolvedHomeContent(): Promise<{ images: ResolvedSiteImages; texts: HomeTexts }> {
  const images = cloneImages();
  const texts = { ...defaultHomeTexts };
  if (!process.env.DATABASE_URL?.trim()) return { images, texts };

  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: [SITE_IMAGES_KEY, HOME_TEXTS_KEY] } },
    });
    for (const r of rows) {
      if (r.key === SITE_IMAGES_KEY) {
        try {
          const parsed = JSON.parse(r.value) as Partial<ResolvedSiteImages>;
          for (const k of Object.keys(images) as (keyof ResolvedSiteImages)[]) {
            const v = parsed[k]?.trim();
            if (v) images[k] = v;
          }
        } catch {
          /* невалидный JSON */
        }
      }
      if (r.key === HOME_TEXTS_KEY) {
        try {
          const parsed = JSON.parse(r.value) as Partial<HomeTexts>;
          for (const k of Object.keys(defaultHomeTexts) as (keyof HomeTexts)[]) {
            const v = parsed[k]?.trim();
            if (v) texts[k] = v;
          }
        } catch {
          /* невалидный JSON */
        }
      }
    }
  } catch (e) {
    /* Prisma всё равно пишет в лог; не пробрасываем — отдаём статику */
    void e;
    /* БД недоступна или таблиц ещё нет — см. npm run db:push */
  }
  return { images, texts };
}

export const homePageSettingKeys = { SITE_IMAGES_KEY, HOME_TEXTS_KEY } as const;
