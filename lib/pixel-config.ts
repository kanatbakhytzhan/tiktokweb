const DEFAULT_ADMIN_PATH = "pixel-admin-x9k27r-hidden";

export function getPixelAdminSlug(): string {
  const fromEnv = process.env.PIXEL_ADMIN_PATH?.trim();
  if (!fromEnv) return DEFAULT_ADMIN_PATH;
  return fromEnv.replace(/^\/+|\/+$/g, "") || DEFAULT_ADMIN_PATH;
}

export function getPixelMaxLength(): number {
  return 20000;
}
