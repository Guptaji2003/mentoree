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
    const body = await req.json();
    const party = body.party === "MENTOR" ? "MENTOR" : "STUDENT";
    const notes = body.notes || undefined;

    const result = await MentorPortalService.markNoShow(
      session,
      params.id,
      party,
      notes
    );
    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
