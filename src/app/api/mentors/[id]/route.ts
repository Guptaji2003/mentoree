import { NextRequest } from "next/server";
import { MentorsService } from "@/server/modules/mentors/mentors.service";
import { getSession } from "@/server/utils/auth-guard";
import { apiSuccess, handleRouteError } from "@/server/utils/response";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    const mentor = await MentorsService.getMentorById(params.id, session);

    return apiSuccess({ mentor });
  } catch (err) {
    return handleRouteError(err);
  }
}
