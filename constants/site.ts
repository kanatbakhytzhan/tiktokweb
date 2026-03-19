export const siteConfig = {
  companyName: "BAKHA POTOLOK",
  whatsappNumber: "77784739587", // номер компании в формате 7XXXXXXXXXX
  whatsappMessage: "Хочу записаться на бесплатный замер (т.т)",
  sourceName: "Landing page",
  trustedTitle: "Нам доверяют",
  trustedCompanies: [
    { name: "BI Group", logo: "/logos/bi-group.svg" },
    { name: "BAZIS-A", logo: "/logos/bazis.svg" },
    { name: "RAMS", logo: "/logos/rams.svg" },
    { name: "KAZ Minerals", logo: "/logos/kaz-minerals.svg" },
  ], // TODO: замените названия и файлы логотипов в public/logos
} as const;
