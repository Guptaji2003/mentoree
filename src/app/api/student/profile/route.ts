import { NextRequest } from "next/server";
import { getStudentUserId } from "@/server/utils/student-auth";
import { StudentService } from "@/server/modules/students/student.service";
import { apiSuccess, handleRouteError } from "@/server/utils/response";

export async function GET(req: NextRequest) {
  try {
    const userId = await getStudentUserId(req);
    const data = await StudentService.getProfile(userId);
    return apiSuccess(data);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getStudentUserId(req);
    const body = await req.json();
    const data = await StudentService.updateProfile(userId, body);
    return apiSuccess(data);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getStudentUserId(req);
    const body = await req.json();
    const data = await StudentService.updateProfile(userId, body);
    return apiSuccess(data);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getStudentUserId(req);
    const body = await req.json();
    const data = await StudentService.updateProfile(userId, body);
    return apiSuccess(data);
  } catch (err) {
    return handleRouteError(err);
  }
}
