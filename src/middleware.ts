import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_TOKEN_COOKIE = "access_token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/mentor") ||
    pathname.startsWith("/admin");

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("auth_error", "Session expired or authentication required");
    return NextResponse.redirect(url);
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "super_secret_jwt_access_token_encryption_key_at_least_32_chars_long"
    );
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });

    const role = payload.role as string;

    // RBAC: /admin requires ADMIN role
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("auth_error", "Unauthorized access to admin console");
      return NextResponse.redirect(url);
    }

    // RBAC: /mentor requires MENTOR or ADMIN role
    if (pathname.startsWith("/mentor") && role !== "MENTOR" && role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("auth_error", "Unauthorized access to mentor dashboard");
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("auth_error", "Invalid or expired session token");
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/mentor/:path*", "/admin/:path*"],
};
