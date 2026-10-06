import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { BookingsService } from "@/server/modules/bookings/bookings.service";
import { apiSuccess, handleRouteError } from "@/server/utils/response";

export async function GET(req: NextRequest) {
  try {
    const { session } = await requireAuth(req);
    const bookings = await BookingsService.listBookings(session);
    return apiSuccess({ bookings });
  } catch (err) {
    return handleRouteError(err);
  }
}
