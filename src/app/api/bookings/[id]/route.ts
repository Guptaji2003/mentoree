import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { BookingsService } from "@/server/modules/bookings/bookings.service";
import { apiSuccess, handleRouteError } from "@/server/utils/response";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { session } = await requireAuth(req);
    const booking = await BookingsService.getBookingById(session, params.id);
    return apiSuccess({ booking });
  } catch (err) {
    return handleRouteError(err);
  }
}
