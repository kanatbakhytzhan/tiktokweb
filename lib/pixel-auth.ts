import crypto from "node:crypto";
import { cookies } from "next/headers";

export const PIXEL_ADMIN_COOKIE_NAME = "pixel_admin_session";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSessionSecret(): string {
  const secret =
    process.env.ADMIN_PIXEL_SESSION_SECRET ?? process.env.ADMIN_PIXEL_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_PIXEL_PASSWORD is not configured");
  }
  return secret;
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PIXEL_PASSWORD ?? "";
  if (!expected) return false;

  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createAdminSessionToken(): string {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${expiresAt}.${crypto.randomBytes(16).toString("hex")}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function isValidAdminSessionToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [expiresAtRaw, random, signature] = parts;
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || !random || !signature) return false;
  if (expiresAt < Math.floor(Date.now() / 1000)) return false;

  const expectedSignature = sign(`${expiresAtRaw}.${random}`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(PIXEL_ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  return isValidAdminSessionToken(token);
}

export function isAdminAuthenticatedFromRequest(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const tokenPart = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${PIXEL_ADMIN_COOKIE_NAME}=`));

  if (!tokenPart) return false;
  const token = decodeURIComponent(tokenPart.split("=")[1] ?? "");
  if (!token) return false;
  return isValidAdminSessionToken(token);
}
