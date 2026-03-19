import { siteConfig } from "@/constants/site";

type LeadRequestBody = {
  name?: string;
  phone?: string;
  utm?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
  };
};

function getAlmatyTimestamp(): string {
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Almaty",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.day}.${map.month}.${map.year} ${map.hour}:${map.minute}`;
}

export async function POST(request: Request) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  try {
    const body = (await request.json()) as LeadRequestBody;
    const name = body.name?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const normalizedPhone = phone.replace(/\D/g, "").replace(/^8/, "7");

    if (!name || !phone) {
      return Response.json(
        { ok: false, message: "Missing required fields: name and phone" },
        { status: 400 },
      );
    }

    if (!/^7\d{10}$/.test(normalizedPhone)) {
      return Response.json(
        { ok: false, message: "Invalid phone format" },
        { status: 400 },
      );
    }

    const payload = {
      timestamp: getAlmatyTimestamp(),
      name,
      phone: normalizedPhone,
      source: siteConfig.sourceName,
      userAgent: request.headers.get("user-agent") ?? "",
      utmSource: body.utm?.utmSource ?? "",
      utmMedium: body.utm?.utmMedium ?? "",
      utmCampaign: body.utm?.utmCampaign ?? "",
      utmContent: body.utm?.utmContent ?? "",
      utmTerm: body.utm?.utmTerm ?? "",
    };

    if (!scriptUrl) {
      if (isDevelopment) {
        return Response.json({ success: true, ok: true, dev: true });
      }

      return Response.json(
        { ok: false, message: "GOOGLE_SCRIPT_URL is not configured" },
        { status: 500 },
      );
    }

    const appsScriptResponse = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!appsScriptResponse.ok) {
      return Response.json(
        { ok: false, message: "Failed to save lead to Google Sheets" },
        { status: 502 },
      );
    }

    const responseText = await appsScriptResponse.text();
    if (!responseText) {
      return Response.json(
        { ok: false, message: "Failed to save lead to Google Sheets" },
        { status: 502 },
      );
    }

    let scriptJson: unknown;
    try {
      scriptJson = JSON.parse(responseText);
    } catch {
      return Response.json(
        { ok: false, message: "Invalid response from Google Apps Script" },
        { status: 502 },
      );
    }

    const scriptOk =
      typeof scriptJson === "object" &&
      scriptJson !== null &&
      (("ok" in scriptJson && (scriptJson as { ok?: boolean }).ok === true) ||
        ("success" in scriptJson &&
          (scriptJson as { success?: boolean }).success === true));

    if (!scriptOk) {
      return Response.json(
        { ok: false, message: "Failed to save lead to Google Sheets" },
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error";
    return Response.json(
      { ok: false, message: `Server error: ${message}` },
      { status: 500 },
    );
  }
}
