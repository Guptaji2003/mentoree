import { NextRequest } from "next/server";
import { getStudentUserId } from "@/server/utils/student-auth";
import { StudentService } from "@/server/modules/students/student.service";
import { apiSuccess, handleRouteError } from "@/server/utils/response";

export async function GET(req: NextRequest) {
  try {
    const userId = await getStudentUserId(req);
    const resume = await StudentService.getResume(userId);
    return apiSuccess({ resume });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getStudentUserId(req);
    const body = await req.json();
    const resume = await StudentService.recordResume(userId, body);
    return apiSuccess(resume);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getStudentUserId(req);
    const result = await StudentService.deleteResume(userId);
    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
