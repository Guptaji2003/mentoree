import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { PaymentsService } from "@/server/modules/payments/payments.service";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { Role, PayoutStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req, [Role.ADMIN]);

    const url = new URL(req.url);
    const statusParam = url.searchParams.get("status") as PayoutStatus | null;

    const payouts = await PaymentsService.listPayouts(statusParam || undefined);
    return apiSuccess({ payouts });
  } catch (err) {
    return handleRouteError(err);
  }
}
