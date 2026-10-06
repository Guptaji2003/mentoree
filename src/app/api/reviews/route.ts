import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { ReviewsService } from "@/server/modules/reviews/reviews.service";
import { createReviewSchema } from "@/server/modules/reviews/reviews.schema";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.STUDENT, Role.ADMIN]);
    const body = await req.json();
    const validated = createReviewSchema.parse(body);

    const review = await ReviewsService.createReview(session.userId, validated);
    return apiSuccess({ review }, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}
