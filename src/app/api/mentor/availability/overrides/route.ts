import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { AvailabilityEngineService } from "@/server/modules/availability/availability-engine.service";
import { SetServiceOverrideSchema } from "@/server/modules/availability/availability-engine.schema";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const overrides = await AvailabilityEngineService.getServiceOverrides(session);
    return apiSuccess({ overrides });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const body = await req.json();
    const input = SetServiceOverrideSchema.parse(body);
    const override = await AvailabilityEngineService.setServiceOverride(
      session,
      input
    );
    return apiSuccess({ override }, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}
