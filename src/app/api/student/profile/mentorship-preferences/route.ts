import { NextRequest } from "next/server";
import { getStudentUserId } from "@/server/utils/student-auth";
import { StudentService } from "@/server/modules/students/student.service";
import { apiSuccess, handleRouteError } from "@/server/utils/response";

export async function GET(req: NextRequest) {
  try {
    const userId = await getStudentUserId(req);
    const preferences = await StudentService.getMentorshipPreferences(userId);
    return apiSuccess({ preferences });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getStudentUserId(req);
    const body = await req.json();
    const updated = await StudentService.updateMentorshipPreferences(userId, body);
    return apiSuccess(updated);
  } catch (err) {
    return handleRouteError(err);
  }
}
