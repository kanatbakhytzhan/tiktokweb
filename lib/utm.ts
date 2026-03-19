export type UTMData = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
};

type SearchParamsLike = {
  get: (name: string) => string | null;
};

export const emptyUTM: UTMData = {
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  utmTerm: "",
};

export function getUTMFromSearchParams(
  searchParams: SearchParamsLike,
): UTMData {
  return {
    utmSource: searchParams.get("utm_source") ?? "",
    utmMedium: searchParams.get("utm_medium") ?? "",
    utmCampaign: searchParams.get("utm_campaign") ?? "",
    utmContent: searchParams.get("utm_content") ?? "",
    utmTerm: searchParams.get("utm_term") ?? "",
  };
}
