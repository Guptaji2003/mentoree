import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { BookingsService } from "@/server/modules/bookings/bookings.service";
import { rescheduleBookingSchema } from "@/server/modules/bookings/bookings.schema";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { Role } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { session } = await requireAuth(req, [Role.STUDENT, Role.ADMIN]);
    const body = await req.json();
    const validated = rescheduleBookingSchema.parse(body);

    const ipAddress = req.headers.get("x-forwarded-for") || undefined;

    const result = await BookingsService.rescheduleBooking(
      session,
      params.id,
      validated.newSlotId,
      validated.reason,
      ipAddress
    );

    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
