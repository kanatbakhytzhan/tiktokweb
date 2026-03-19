import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.vercel.app"),
  title: "Натяжные потолки - бесплатный замер и консультация",
  description:
    "Оставьте заявку на натяжные потолки и получите расчет стоимости с 90% точностью. Замер и консультация бесплатно.",
  openGraph: {
    title: "Натяжные потолки - бесплатный замер и консультация",
    description:
      "Оставьте заявку и получите расчет стоимости с 90% точностью. Замер и консультация бесплатно.",
    type: "website",
    locale: "ru_RU",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
