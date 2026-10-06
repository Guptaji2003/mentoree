import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { BookingsService } from "@/server/modules/bookings/bookings.service";
import { cancelBookingSchema } from "@/server/modules/bookings/bookings.schema";
import { apiSuccess, handleRouteError } from "@/server/utils/response";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { session } = await requireAuth(req);
    const ip = req.headers.get("x-forwarded-for") || undefined;
    const body = await req.json();
    const validated = cancelBookingSchema.parse(body);

    const result = await BookingsService.cancelBooking(session, params.id, validated.reason, ip);
    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
