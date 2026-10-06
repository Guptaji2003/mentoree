import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { VerificationService } from "@/server/modules/verification/verification.service";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { Role, VerificationStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req, [Role.ADMIN]);

    const url = new URL(req.url);
    const statusParam = url.searchParams.get("status") as VerificationStatus | null;
    const page = url.searchParams.get("page") ? Number(url.searchParams.get("page")) : 1;
    const limit = url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : 20;

    const result = await VerificationService.listAdminVerifications(statusParam || undefined, page, limit);
    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
