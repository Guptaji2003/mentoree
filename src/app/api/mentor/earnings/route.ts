import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { MentorPortalService } from "@/server/modules/mentor-portal/mentor-portal.service";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const earnings = await MentorPortalService.getMentorEarnings(session);
    return apiSuccess(earnings);
  } catch (err) {
    return handleRouteError(err);
  }
}
