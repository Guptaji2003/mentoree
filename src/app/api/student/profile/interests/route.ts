import { NextRequest } from "next/server";
import { getStudentUserId } from "@/server/utils/student-auth";
import { StudentService } from "@/server/modules/students/student.service";
import { apiSuccess, handleRouteError } from "@/server/utils/response";

export async function GET(req: NextRequest) {
  try {
    const userId = await getStudentUserId(req);
    const list = await StudentService.listInterests(userId);
    return apiSuccess({ interests: list });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getStudentUserId(req);
    const body = await req.json();
    const created = await StudentService.createInterest(userId, body);
    return apiSuccess(created);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getStudentUserId(req);
    const body = await req.json();
    const interests = body.interests || [];
    const updated = await StudentService.updateInterests(userId, interests);
    return apiSuccess({ interests: updated });
  } catch (err) {
    return handleRouteError(err);
  }
}
