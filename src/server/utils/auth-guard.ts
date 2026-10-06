import { NextRequest, NextResponse } from "next/server";
import { AuthService, SessionPayload } from "@/server/modules/auth/auth.service";
import { Role } from "@prisma/client";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

export async function getSession(req: NextRequest): Promise<SessionPayload | null> {
  const token =
    req.cookies.get(ACCESS_TOKEN_COOKIE)?.value ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!token) return null;
  return AuthService.verifyAccessToken(token);
}

export async function requireAuth(
  req: NextRequest,
  allowedRoles?: Role[]
): Promise<{ session: SessionPayload }> {
  const session = await getSession(req);

  if (!session) {
    throw new Error("401 Unauthorized: Valid session required");
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    throw new Error(`403 Forbidden: Insufficient permissions for role ${session.role}`);
  }

  return { session };
}

export function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string,
  refreshExpiresAt: Date
) {
  const isProd = process.env.NODE_ENV === "production";

  res.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  res.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    expires: refreshExpiresAt,
  });
}

export function clearAuthCookies(res: NextResponse) {
  const isProd = process.env.NODE_ENV === "production";

  res.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  res.cookies.set(REFRESH_TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
