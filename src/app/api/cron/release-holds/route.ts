import { NextRequest } from "next/server";
import { AvailabilityService } from "@/server/modules/availability/availability.service";
import { env } from "@/server/env";
import { apiSuccess, apiError, handleRouteError } from "@/server/utils/response";

export async function GET(req: NextRequest) {
  return handleCron(req);
}

export async function POST(req: NextRequest) {
  return handleCron(req);
}

async function handleCron(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecretParam = req.nextUrl.searchParams.get("secret");

    const isAuthorized =
      authHeader === `Bearer ${env.CRON_SECRET}` ||
      cronSecretParam === env.CRON_SECRET;

    if (!isAuthorized && process.env.NODE_ENV === "production") {
      return apiError("Unauthorized cron invocation", 401, "Unauthorized");
    }

    const result = await AvailabilityService.releaseExpiredHolds();
    return apiSuccess({
      message: "Expired slot holds released successfully",
      ...result,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
