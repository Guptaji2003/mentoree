import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { AvailabilityEngineService } from "@/server/modules/availability/availability-engine.service";
import { UpdateSchedulingRulesSchema } from "@/server/modules/availability/availability-engine.schema";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const rules = await AvailabilityEngineService.getSchedulingRules(session);
    return apiSuccess({ rules });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const body = await req.json();
    const input = UpdateSchedulingRulesSchema.parse(body);
    const rules = await AvailabilityEngineService.updateSchedulingRules(
      session,
      input
    );
    return apiSuccess({ rules });
  } catch (err) {
    return handleRouteError(err);
  }
}
