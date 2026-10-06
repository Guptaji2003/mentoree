import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { AvailabilityEngineService } from "@/server/modules/availability/availability-engine.service";
import { SetMentorBreakSchema } from "@/server/modules/availability/availability-engine.schema";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const breaks = await AvailabilityEngineService.getBreaks(session);
    return apiSuccess({ breaks });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const body = await req.json();
    const input = SetMentorBreakSchema.parse(body);
    const breakItem = await AvailabilityEngineService.setBreak(
      session,
      input
    );
    return apiSuccess({ breakItem }, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}
