import { NextRequest } from "next/server";
import { getStudentUserId } from "@/server/utils/student-auth";
import { StudentService } from "@/server/modules/students/student.service";
import { MentorRecommendationService } from "@/server/modules/students/mentor-recommendation.service";
import { RecommendationQuerySchema } from "@/server/modules/students/student.schema";
import { apiSuccess, handleRouteError } from "@/server/utils/response";

export async function GET(req: NextRequest) {
  try {
    const userId = await getStudentUserId(req);
    const { profile } = await StudentService.getProfile(userId);

    const url = new URL(req.url);
    const query = RecommendationQuerySchema.parse({
      page: url.searchParams.get("page") || 1,
      limit: url.searchParams.get("limit") || 12,
      field: url.searchParams.get("field") || undefined,
      expertise: url.searchParams.get("expertise") || undefined,
      minPrice: url.searchParams.get("minPrice") || undefined,
      maxPrice: url.searchParams.get("maxPrice") || undefined,
      rating: url.searchParams.get("rating") || undefined,
      availability: url.searchParams.get("availability") || undefined,
      language: url.searchParams.get("language") || undefined,
    });

    const result = await MentorRecommendationService.getRecommendedMentors(profile.id, query);
    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
