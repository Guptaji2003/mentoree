import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { ReviewsService } from "@/server/modules/reviews/reviews.service";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { Role } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(req, [Role.ADMIN]);
    const body = await req.json().catch(() => ({ hidden: true }));
    const hidden = body.hidden !== undefined ? Boolean(body.hidden) : true;

    const review = await ReviewsService.toggleHideReview(params.id, hidden);
    return apiSuccess({ review });
  } catch (err) {
    return handleRouteError(err);
  }
}
