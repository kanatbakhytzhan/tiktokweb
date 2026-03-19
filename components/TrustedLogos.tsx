import Image from "next/image";
import { siteConfig } from "@/constants/site";

export function TrustedLogos() {
  return (
    <section className="bg-white py-8 sm:py-12" aria-label="Нам доверяют">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-lg font-semibold text-zinc-900">
          {siteConfig.trustedTitle}
        </h2>
        <div className="mt-5 grid grid-cols-2 items-center gap-x-6 gap-y-4 opacity-80 sm:grid-cols-4">
          {siteConfig.trustedCompanies.map((company) => (
            <div key={company.name} className="flex h-10 items-center justify-center">
              <Image
                src={company.logo}
                alt={`Логотип ${company.name}`}
                width={120}
                height={28}
                className="h-6 w-auto object-contain grayscale"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
