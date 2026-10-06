import { NextRequest } from "next/server";
import { VerificationService } from "@/server/modules/verification/verification.service";
import { requireAuth } from "@/server/utils/auth-guard";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req, [Role.ADMIN]);
    const result = await VerificationService.listAdminVerifications();
    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
