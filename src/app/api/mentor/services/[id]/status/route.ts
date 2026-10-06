import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { MentorServicesService } from "@/server/modules/services/mentor-services.service";
import { ChangeServiceStatusSchema } from "@/server/modules/services/mentor-services.schema";
import { Role } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const body = await req.json();
    const { status } = ChangeServiceStatusSchema.parse(body);
    const service = await MentorServicesService.changeServiceStatus(
      session,
      params.id,
      status
    );
    return apiSuccess({ service });
  } catch (err) {
    return handleRouteError(err);
  }
}
