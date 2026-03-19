import { isAdminAuthenticatedFromRequest } from "@/lib/pixel-auth";
import { clearTikTokPixelCode, saveTikTokPixelCode } from "@/lib/pixel-storage";

type SaveBody = {
  code?: string;
  action?: "save" | "clear";
};

export async function POST(request: Request) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as SaveBody;
    const action = body.action ?? "save";

    if (action === "clear") {
      await clearTikTokPixelCode();
      return Response.json({ ok: true, message: "Pixel removed" });
    }

    const code = body.code ?? "";
    await saveTikTokPixelCode(code);
    return Response.json({ ok: true, message: "Success" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save pixel code";
    return Response.json({ ok: false, message }, { status: 400 });
  }
}
