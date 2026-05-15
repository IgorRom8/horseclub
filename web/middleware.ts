import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getAdminSessionSecret } from "@/lib/adminCredentials";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/adminSession";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const secret = getAdminSessionSecret();

  const isLoginPath =
    pathname === "/admin" || pathname === "/admin/" || pathname.startsWith("/admin/login");

  if (isLoginPath) {
    if ((pathname === "/admin" || pathname === "/admin/") && secret) {
      const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
      if (await verifyAdminSessionToken(token, secret)) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
    if (!secret && pathname.startsWith("/admin/login")) {
      return NextResponse.redirect(new URL("/admin?err=config", request.url));
    }
    return NextResponse.next();
  }

  if (!secret) {
    return NextResponse.redirect(new URL("/admin?err=config", request.url));
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await verifyAdminSessionToken(token, secret))) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
