import { cookies } from "next/headers";

import { getAdminSessionSecret, isAdminOpenAccess } from "@/lib/adminCredentials";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/adminSession";

export async function assertAdmin(): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  if (isAdminOpenAccess()) {
    return { ok: true };
  }
  const secret = getAdminSessionSecret();
  if (!secret) {
    return { ok: false, status: 503, message: "ADMIN_SESSION_SECRET не задан (обязателен в production)" };
  }
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await verifyAdminSessionToken(token, secret))) {
    return { ok: false, status: 401, message: "Нужна авторизация" };
  }
  return { ok: true };
}
