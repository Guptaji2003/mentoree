import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { MentorPortalService } from "@/server/modules/mentor-portal/mentor-portal.service";
import { Role } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const result = await MentorPortalService.acceptBookingRequest(
      session,
      params.id
    );
    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
