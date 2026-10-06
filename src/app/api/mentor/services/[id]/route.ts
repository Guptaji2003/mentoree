import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { MentorsService } from "@/server/modules/mentors/mentors.service";
import { mentorServiceSchema } from "@/server/modules/mentors/mentors.schema";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { Role } from "@prisma/client";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const body = await req.json();
    const validated = mentorServiceSchema.parse(body);
    const service = await MentorsService.updateService(session.userId, params.id, validated);

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
    await MentorsService.deleteService(session.userId, params.id);

    return apiSuccess({ message: "Service deleted successfully" });
  } catch (err) {
    return handleRouteError(err);
  }
}
