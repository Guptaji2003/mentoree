import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { AvailabilityEngineService } from "@/server/modules/availability/availability-engine.service";
import { Role } from "@prisma/client";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const result = await AvailabilityEngineService.deleteBlockedDate(session, params.id);
    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
