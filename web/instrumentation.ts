export async function register() {
  const { ensureDatabaseUrlFromIntegrations } = await import("./lib/ensureDatabaseUrl");
  ensureDatabaseUrlFromIntegrations();
}
