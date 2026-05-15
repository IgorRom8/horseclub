/** Подписанная httpOnly-cookie сессии админки (HMAC-SHA256), без внешних зависимостей — работает в Edge (middleware). */

export const ADMIN_SESSION_COOKIE = "admin_session";

function u8ToB64url(u8: Uint8Array): string {
  let s = "";
  for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]!);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlToU8(s: string): Uint8Array {
  const pad = s.length % 4;
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + (pad ? "=".repeat(4 - pad) : "");
  const bin = atob(b64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i)!;
  return u8;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

export async function createAdminSessionToken(secret: string, ttlMs = 7 * 24 * 60 * 60 * 1000): Promise<string> {
  const payload = { exp: Date.now() + ttlMs, v: 1 as const };
  const payloadStr = JSON.stringify(payload);
  const enc = new TextEncoder();
  const payloadBytes = enc.encode(payloadStr);
  const key = await getHmacKey(secret);
  const sigBuf = await crypto.subtle.sign("HMAC", key, payloadBytes);
  return `${u8ToB64url(payloadBytes)}.${u8ToB64url(new Uint8Array(sigBuf))}`;
}

export async function verifyAdminSessionToken(token: string | undefined, secret: string): Promise<boolean> {
  if (!token?.trim() || !secret.trim()) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  try {
    const payloadBytes = b64urlToU8(parts[0]!);
    const sig = b64urlToU8(parts[1]!);
    const key = await getHmacKey(secret);
    const ok = await crypto.subtle.verify("HMAC", key, sig, payloadBytes);
    if (!ok) return false;
    const payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as { exp: number; v?: number };
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}
