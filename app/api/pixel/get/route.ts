import { isAdminAuthenticatedFromRequest } from "@/lib/pixel-auth";
import { getTikTokPixelCode } from "@/lib/pixel-storage";

export async function GET(request: Request) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const code = await getTikTokPixelCode();
    return Response.json({ ok: true, code, active: Boolean(code) });
  } catch {
    return Response.json(
      { ok: false, message: "Storage is unavailable" },
      { status: 500 },
    );
  }
}
