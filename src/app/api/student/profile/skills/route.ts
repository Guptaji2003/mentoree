import { NextRequest } from "next/server";
import { getStudentUserId } from "@/server/utils/student-auth";
import { StudentService } from "@/server/modules/students/student.service";
import { apiSuccess, handleRouteError } from "@/server/utils/response";

export async function GET(req: NextRequest) {
  try {
    const userId = await getStudentUserId(req);
    const list = await StudentService.listSkills(userId);
    return apiSuccess({ skills: list });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getStudentUserId(req);
    const body = await req.json();
    const created = await StudentService.createSkill(userId, body);
    return apiSuccess(created);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getStudentUserId(req);
    const body = await req.json();
    const skills = body.skills || [];
    const updated = await StudentService.updateSkills(userId, skills);
    return apiSuccess({ skills: updated });
  } catch (err) {
    return handleRouteError(err);
  }
}
