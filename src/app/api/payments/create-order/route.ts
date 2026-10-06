import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { PaymentsService } from "@/server/modules/payments/payments.service";
import { createOrderSchema } from "@/server/modules/payments/payments.schema";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.STUDENT, Role.ADMIN]);
    const body = await req.json();
    const validated = createOrderSchema.parse(body);

    const result = await PaymentsService.createOrder(session.userId, validated);
    return apiSuccess(result, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}
