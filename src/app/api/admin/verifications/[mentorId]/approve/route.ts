import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { VerificationService } from "@/server/modules/verification/verification.service";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { Role } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { mentorId: string } }
) {
  try {
    const { session } = await requireAuth(req, [Role.ADMIN]);
    const ip = req.headers.get("x-forwarded-for") || undefined;

    const result = await VerificationService.adminApproveMentor(
      session.userId,
      session.email,
      params.mentorId,
      ip
    );

    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
