import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/server/modules/auth/auth.service";
import { loginSchema } from "@/server/modules/auth/auth.schema";
import { setAuthCookies } from "@/server/utils/auth-guard";
import { RateLimiter } from "@/server/utils/rate-limit";
import { apiError, handleRouteError } from "@/server/utils/response";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const body = await req.json();
    const validated = loginSchema.parse(body);

    const rateLimitKey = `auth:login:${ip}:${validated.email.toLowerCase()}`;
    const rateLimit = await RateLimiter.checkLimit(rateLimitKey, 5, 900);
    if (!rateLimit.allowed) {
      return apiError(
        `Too many failed login attempts. Please try again in ${rateLimit.resetInSeconds} seconds.`,
        429,
        "Rate Limit Exceeded"
      );
    }

    const { user, accessToken, refreshToken, refreshExpiresAt } = await AuthService.login(
      validated,
      ip
    );

    await RateLimiter.resetLimit(rateLimitKey);

    const res = NextResponse.json({
      success: true,
      message: "Login successful",
      user,
      accessToken,
    });

    setAuthCookies(res, accessToken, refreshToken, refreshExpiresAt);
    return res;
  } catch (err) {
    return handleRouteError(err);
  }
}
