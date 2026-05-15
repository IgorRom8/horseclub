/**
 * Учётка по умолчанию: admin / 123456 (переопределяется через ADMIN_USERNAME / ADMIN_PASSWORD).
 * В production задайте ADMIN_SESSION_SECRET — иначе вход и защита панели недоступны.
 */

export function getAdminUsername(): string {
  return process.env.ADMIN_USERNAME?.trim() || "admin";
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || "123456";
}

/** Секрет подписи cookie. В development допускается встроенный запасной вариант. */
export function getAdminSessionSecret(): string | null {
  const fromEnv = process.env.ADMIN_SESSION_SECRET?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") return null;
  return "__dev_localhost_admin_session_secret_kon__";
}
