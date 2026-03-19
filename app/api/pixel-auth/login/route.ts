import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  PIXEL_ADMIN_COOKIE_NAME,
  verifyAdminPassword,
} from "@/lib/pixel-auth";

type LoginBody = {
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const password = body.password?.trim() ?? "";

    if (!password || !verifyAdminPassword(password)) {
      return Response.json({ ok: false, message: "Invalid password" }, { status: 401 });
    }

    const token = createAdminSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(PIXEL_ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return Response.json({ ok: false, message: "Login failed" }, { status: 500 });
  }
}
