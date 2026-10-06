import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/server/modules/auth/auth.service";
import { REFRESH_TOKEN_COOKIE, clearAuthCookies } from "@/server/utils/auth-guard";
import { handleRouteError } from "@/server/utils/response";

export async function POST(req: NextRequest) {
  try {
    const rawRefreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    await AuthService.logout(rawRefreshToken);

    const res = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    clearAuthCookies(res);
    return res;
  } catch (err) {
    return handleRouteError(err);
  }
}
