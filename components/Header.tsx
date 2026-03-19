import Image from "next/image";
import { siteConfig } from "@/constants/site";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center px-2.5 sm:px-6">
        <Image
          src="/logo-bakha.png"
          alt={`Логотип ${siteConfig.companyName}`}
          width={210}
          height={72}
          className="h-auto w-[168px] object-contain sm:w-[210px]"
          priority
        />
      </div>
    </header>
  );
}
