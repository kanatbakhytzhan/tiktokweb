import { unstable_noStore as noStore } from "next/cache";
import { getTikTokPixelCode } from "@/lib/pixel-storage";

export async function TikTokPixelInjector() {
  noStore();

  let pixelCode = "";

  try {
    pixelCode = await getTikTokPixelCode();
  } catch {
    pixelCode = "";
  }

  if (!pixelCode) return null;

  return <div dangerouslySetInnerHTML={{ __html: pixelCode }} suppressHydrationWarning />;
}
