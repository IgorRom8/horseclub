import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getAdminPassword, getAdminSessionSecret, getAdminUsername } from "@/lib/adminCredentials";
import { ADMIN_SESSION_COOKIE, createAdminSessionToken } from "@/lib/adminSession";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = getAdminSessionSecret();
  const user = getAdminUsername();
  const pass = getAdminPassword();

  if (!secret) {
    return NextResponse.json(
      { error: "Задайте ADMIN_SESSION_SECRET в .env (обязателен в production)" },
      { status: 503 },
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  if (body.username !== user || body.password !== pass) {
    return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
  }

  const token = await createAdminSessionToken(secret);
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.json({ ok: true });
}
