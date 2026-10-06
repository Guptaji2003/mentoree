import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { AvailabilityEngineService } from "@/server/modules/availability/availability-engine.service";
import { UpdateWorkingHoursSchema } from "@/server/modules/availability/availability-engine.schema";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const workingHours = await AvailabilityEngineService.getWorkingHours(session);
    return apiSuccess({ workingHours });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const body = await req.json();
    const input = UpdateWorkingHoursSchema.parse(body);
    const workingHours = await AvailabilityEngineService.updateWorkingHours(
      session,
      input
    );
    return apiSuccess({ workingHours });
  } catch (err) {
    return handleRouteError(err);
  }
}
