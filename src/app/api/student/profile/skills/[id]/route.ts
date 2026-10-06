import { NextRequest } from "next/server";
import { getStudentUserId } from "@/server/utils/student-auth";
import { StudentService } from "@/server/modules/students/student.service";
import { apiSuccess, handleRouteError } from "@/server/utils/response";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getStudentUserId(req);
    const result = await StudentService.deleteSkill(userId, params.id);
    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
