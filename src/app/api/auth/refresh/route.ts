import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/server/modules/auth/auth.service";
import { REFRESH_TOKEN_COOKIE, setAuthCookies, clearAuthCookies } from "@/server/utils/auth-guard";
import { apiError, handleRouteError } from "@/server/utils/response";

export async function POST(req: NextRequest) {
  try {
    const rawRefreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!rawRefreshToken) {
      return apiError("Refresh token missing from request cookie", 401, "Unauthorized");
    }

    try {
      const { user, accessToken, refreshToken, refreshExpiresAt } = await AuthService.rotateRefreshToken(
        rawRefreshToken
      );

      const res = NextResponse.json({
        success: true,
        message: "Token refreshed successfully",
        user,
        accessToken,
      });

      setAuthCookies(res, accessToken, refreshToken, refreshExpiresAt);
      return res;
    } catch (rotateErr) {
      const res = handleRouteError(rotateErr);
      clearAuthCookies(res);
      return res;
    }
  } catch (err) {
    return handleRouteError(err);
  }
}
