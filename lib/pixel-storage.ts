import { createClient } from "@supabase/supabase-js";
import { getPixelMaxLength } from "@/lib/pixel-config";

const PIXEL_CODE_KEY = "tiktok_pixel_code";

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase env is not configured");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function validatePixelCode(code: string): string | null {
  const trimmed = code.trim();
  if (!trimmed) return "Pixel code is invalid";
  if (trimmed.length > getPixelMaxLength()) return "Pixel code is too long";

  const lower = trimmed.toLowerCase();
  const markers = ["ttq", "tiktok", "analytics.tiktok.com", "pixel"];
  const looksLikePixel = markers.some((marker) => lower.includes(marker));

  if (!looksLikePixel) return "Pixel code is invalid";
  return null;
}

function normalizePixelCode(code: string): string {
  return code.trim();
}

export async function getTikTokPixelCode(): Promise<string> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", PIXEL_CODE_KEY)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to read pixel code");
  }

  return (data?.value as string | null) ?? "";
}

export async function saveTikTokPixelCode(code: string): Promise<void> {
  const validationError = validatePixelCode(code);
  if (validationError) {
    throw new Error(validationError);
  }

  const supabase = getSupabaseAdminClient();
  const normalizedCode = normalizePixelCode(code);

  const { error } = await supabase.from("site_settings").upsert(
    {
      key: PIXEL_CODE_KEY,
      value: normalizedCode,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) {
    throw new Error("Failed to save pixel code");
  }
}

export async function clearTikTokPixelCode(): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .delete()
    .eq("key", PIXEL_CODE_KEY);

  if (error) {
    throw new Error("Failed to remove pixel code");
  }
}
