import { NextRequest } from "next/server";
import { getStudentUserId } from "@/server/utils/student-auth";
import { StudentService } from "@/server/modules/students/student.service";
import { ProfileCompletionService } from "@/server/modules/students/profile-completion.service";
import { apiSuccess, handleRouteError } from "@/server/utils/response";

export async function GET(req: NextRequest) {
  try {
    const userId = await getStudentUserId(req);
    const { profile } = await StudentService.getProfile(userId);
    const breakdown = ProfileCompletionService.calculate(profile);
    return apiSuccess(breakdown);
  } catch (err) {
    return handleRouteError(err);
  }
}
