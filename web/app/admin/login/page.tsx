import { redirect } from "next/navigation";

/** Старый адрес; форма входа — на /admin */
export default async function AdminLoginLegacyRedirect({
  searchParams,
}: {
  searchParams: Promise<{ err?: string }>;
}) {
  const { err } = await searchParams;
  const q = err ? `?err=${encodeURIComponent(err)}` : "";
  redirect(`/admin${q}`);
}
