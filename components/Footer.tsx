import Link from "next/link";
import { siteConfig } from "@/constants/site";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-medium text-zinc-800">{siteConfig.companyName}</p>
        <Link href="#" className="underline underline-offset-4">
          Политика конфиденциальности
        </Link>
        <a
          href={`https://wa.me/${siteConfig.whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-zinc-800"
        >
          WhatsApp
        </a>
      </div>
    </footer>
  );
}
