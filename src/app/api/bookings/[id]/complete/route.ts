import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { BookingsService } from "@/server/modules/bookings/bookings.service";
import { completeBookingSchema } from "@/server/modules/bookings/bookings.schema";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { Role } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const ip = req.headers.get("x-forwarded-for") || undefined;
    const body = await req.json().catch(() => ({}));
    const validated = completeBookingSchema.parse(body);

    const result = await BookingsService.completeBooking(
      session,
      params.id,
      validated.actionPlanDeliverable,
      ip
    );

    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
