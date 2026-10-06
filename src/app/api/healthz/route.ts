import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET() {
  try {
    // Ping DB with quick query
    await db.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
      },
    });
  } catch (err: any) {
    console.error("[Healthcheck Error]:", err);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: err.message || "Database connection failed",
      },
      { status: 503 }
    );
  }
}
