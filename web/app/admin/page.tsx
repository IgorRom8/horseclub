import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "./login/AdminLoginForm";
import { getAdminSessionSecret, isAdminOpenAccess } from "@/lib/adminCredentials";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/adminSession";

export default async function AdminLoginEntryPage({
  searchParams,
}: {
  searchParams: Promise<{ err?: string }>;
}) {
  if (isAdminOpenAccess()) {
    redirect("/admin/dashboard");
  }

  const { err } = await searchParams;
  const secret = getAdminSessionSecret();
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const ok = secret ? await verifyAdminSessionToken(token, secret) : false;
  if (ok) redirect("/admin/dashboard");

  const configError = err === "config" || (process.env.NODE_ENV === "production" && !secret);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-sand/50 to-[#faf8f5] px-4 py-16">
      <AdminLoginForm configError={configError} />
    </div>
  );
}
