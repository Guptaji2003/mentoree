import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { AvailabilityEngineService } from "@/server/modules/availability/availability-engine.service";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const connections = await AvailabilityEngineService.getCalendarConnections(session);
    return apiSuccess({ connections });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const body = await req.json();
    const { connectionId, syncEnabled } = body;

    if (!connectionId) {
      throw new Error("400 Bad Request: connectionId is required");
    }

    const connection = await AvailabilityEngineService.toggleCalendarSync(
      session,
      connectionId,
      Boolean(syncEnabled)
    );
    return apiSuccess({ connection });
  } catch (err) {
    return handleRouteError(err);
  }
}
