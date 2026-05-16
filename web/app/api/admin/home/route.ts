import { NextResponse } from "next/server";

import { assertAdmin } from "@/lib/adminApiAuth";
import { ensureDatabaseUrlFromIntegrations } from "@/lib/ensureDatabaseUrl";
import {
  defaultHomeTexts,
  homePageSettingKeys,
  type HomeTexts,
  type ResolvedSiteImages,
} from "@/lib/homePageSettings";
import { prismaUserFacingHttpError } from "@/lib/prismaDbHelp";
import { prisma } from "@/lib/prisma";
import { siteImages } from "@/lib/siteImages";

export const runtime = "nodejs";

export async function POST(req: Request) {
  ensureDatabaseUrlFromIntegrations();
  const auth = await assertAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json(
      {
        error:
          "Нет подключения к БД: задайте в Vercel переменную DATABASE_URL или DATA_BASE_POSTGRES_URL (URI из Neon), включите Production и Preview, затем Redeploy.",
      },
      { status: 503 },
    );
  }

  let body: { site_images?: Partial<ResolvedSiteImages>; home_texts?: Partial<HomeTexts> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  try {
    if (body.site_images && typeof body.site_images === "object") {
      const merged: ResolvedSiteImages = { ...siteImages };
      for (const k of Object.keys(siteImages) as (keyof ResolvedSiteImages)[]) {
        const v = body.site_images[k];
        if (typeof v === "string" && v.trim()) merged[k] = v.trim();
      }
      await prisma.siteSetting.upsert({
        where: { key: homePageSettingKeys.SITE_IMAGES_KEY },
        create: { key: homePageSettingKeys.SITE_IMAGES_KEY, value: JSON.stringify(merged) },
        update: { value: JSON.stringify(merged) },
      });
    }

    if (body.home_texts && typeof body.home_texts === "object") {
      const merged: HomeTexts = { ...defaultHomeTexts };
      for (const k of Object.keys(defaultHomeTexts) as (keyof HomeTexts)[]) {
        const v = body.home_texts[k];
        if (typeof v === "string") merged[k] = v;
      }
      await prisma.siteSetting.upsert({
        where: { key: homePageSettingKeys.HOME_TEXTS_KEY },
        create: { key: homePageSettingKeys.HOME_TEXTS_KEY, value: JSON.stringify(merged) },
        update: { value: JSON.stringify(merged) },
      });
    }
  } catch (e) {
    const facing = prismaUserFacingHttpError(e);
    if (facing) return NextResponse.json({ error: facing.error }, { status: facing.status });
    console.error(e);
    return NextResponse.json({ error: "Ошибка записи в БД" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
