import { getTikTokPixelCode } from "@/lib/pixel-storage";

export async function TikTokPixelInjector() {
  let pixelCode = "";

  try {
    pixelCode = await getTikTokPixelCode();
  } catch {
    pixelCode = "";
  }

  if (!pixelCode) return null;

  return <div dangerouslySetInnerHTML={{ __html: pixelCode }} suppressHydrationWarning />;
}
