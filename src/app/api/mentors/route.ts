import { NextRequest } from "next/server";
import { MentorsService } from "@/server/modules/mentors/mentors.service";
import { getMentorsQuerySchema } from "@/server/modules/mentors/mentors.schema";
import { apiSuccess, handleRouteError } from "@/server/utils/response";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const params = {
      category: url.searchParams.get("category") || undefined,
      company: url.searchParams.get("company") || undefined,
      maxPrice: url.searchParams.get("maxPrice") ? Number(url.searchParams.get("maxPrice")) : undefined,
      search: url.searchParams.get("search") || undefined,
      page: url.searchParams.get("page") ? Number(url.searchParams.get("page")) : 1,
      limit: url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : 20,
    };

    const validatedQuery = getMentorsQuerySchema.parse(params);
    const result = await MentorsService.listVerifiedMentors(validatedQuery);

    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
