import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { AvailabilityEngineService } from "@/server/modules/availability/availability-engine.service";
import { CreateBlockedDateSchema } from "@/server/modules/availability/availability-engine.schema";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const blockedDates = await AvailabilityEngineService.getBlockedDates(session);
    return apiSuccess({ blockedDates });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const body = await req.json();
    const input = CreateBlockedDateSchema.parse(body);
    const blockedDate = await AvailabilityEngineService.createBlockedDate(
      session,
      input
    );
    return apiSuccess({ blockedDate }, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}
