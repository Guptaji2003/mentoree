import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { MentorsService } from "@/server/modules/mentors/mentors.service";
import { mentorServiceSchema } from "@/server/modules/mentors/mentors.schema";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const body = await req.json();
    const validated = mentorServiceSchema.parse(body);
    const service = await MentorsService.createService(session.userId, validated);

    return apiSuccess({ service }, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}
