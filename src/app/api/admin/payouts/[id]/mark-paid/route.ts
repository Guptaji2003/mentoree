import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { PaymentsService } from "@/server/modules/payments/payments.service";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { Role } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { session } = await requireAuth(req, [Role.ADMIN]);
    const updated = await PaymentsService.markPayoutPaid(params.id, session.userId, session.email);

    return apiSuccess({ payout: updated });
  } catch (err) {
    return handleRouteError(err);
  }
}
