import { AdminHomeEditor } from "./AdminHomeEditor";
import { getResolvedHomeContent } from "@/lib/homePageSettings";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const { images, texts } = await getResolvedHomeContent();
  const hasDb = Boolean(process.env.DATABASE_URL?.trim());
  return <AdminHomeEditor initialImages={images} initialTexts={texts} hasDb={hasDb} />;
}
