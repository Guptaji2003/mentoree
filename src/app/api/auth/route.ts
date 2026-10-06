import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Auth endpoints available at /api/auth/signup, /api/auth/login, /api/auth/logout, /api/auth/refresh, /api/auth/me",
  });
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    {
      statusCode: 400,
      error: "Deprecated endpoint. Use dedicated /api/auth/signup, /api/auth/login, or /api/auth/logout routes.",
    },
    { status: 400 }
  );
}
