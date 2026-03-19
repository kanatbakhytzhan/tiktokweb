import { siteConfig } from "@/constants/site";

export function buildWhatsAppUrl(): string {
  const encodedText = encodeURIComponent(siteConfig.whatsappMessage);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodedText}`;
}
