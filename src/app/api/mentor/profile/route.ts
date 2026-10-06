import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { MentorsService } from "@/server/modules/mentors/mentors.service";
import { updateMentorProfileSchema } from "@/server/modules/mentors/mentors.schema";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const mentor = await MentorsService.getMentorById(session.userId, session);

    return apiSuccess({ mentor });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const body = await req.json();
    const validated = updateMentorProfileSchema.parse(body);
    const updated = await MentorsService.updateProfile(session.userId, validated);

    return apiSuccess({ profile: updated });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
