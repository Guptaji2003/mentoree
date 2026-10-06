import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { VerificationService } from "@/server/modules/verification/verification.service";
import { sendWorkEmailOtpSchema } from "@/server/modules/verification/verification.schema";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const body = await req.json();
    const validated = sendWorkEmailOtpSchema.parse(body);

    const result = await VerificationService.sendWorkEmailOtp(session.userId, validated);
    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
