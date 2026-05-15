/**
 * Учётка по умолчанию: admin / 123456 (переопределяется через ADMIN_USERNAME / ADMIN_PASSWORD).
 * В production задайте ADMIN_SESSION_SECRET — иначе вход и защита панели недоступны (кроме режима ADMIN_OPEN_ACCESS).
 */

/**
 * Открытый доступ к `/admin` без логина (удобно до продакшена).
 * - `development`: по умолчанию открыто.
 * - `production`: открыто только при ADMIN_OPEN_ACCESS=true.
 * - Принудительно закрыть везде: ADMIN_OPEN_ACCESS=false
 */
export function isAdminOpenAccess(): boolean {
  const v = process.env.ADMIN_OPEN_ACCESS?.trim().toLowerCase();
  if (v === "false" || v === "0") return false;
  if (v === "true" || v === "1") return true;
  return process.env.NODE_ENV !== "production";
}

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
