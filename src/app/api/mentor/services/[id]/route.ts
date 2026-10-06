import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { MentorServicesService } from "@/server/modules/services/mentor-services.service";
import { UpdateMentorServiceSchema } from "@/server/modules/services/mentor-services.schema";
import { Role } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const service = await MentorServicesService.getServiceById(session, params.id);
    return apiSuccess({ service });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const body = await req.json();
    const input = UpdateMentorServiceSchema.parse(body);
    const service = await MentorServicesService.updateService(
      session,
      params.id,
      input
    );
    return apiSuccess({ service });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const result = await MentorServicesService.deleteService(session, params.id);
    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
