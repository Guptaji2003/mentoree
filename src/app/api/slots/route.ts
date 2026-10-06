import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { AvailabilityService } from "@/server/modules/availability/availability.service";
import { createCustomSlotSchema, createRecurringSlotsSchema } from "@/server/modules/availability/availability.schema";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.MENTOR, Role.ADMIN]);
    const body = await req.json();

    if (body.type === "RECURRING" || body.startDate) {
      const validated = createRecurringSlotsSchema.parse(body);
      const result = await AvailabilityService.createRecurringSlots(session.userId, validated);
      return apiSuccess(result, 201);
    } else {
      const validated = createCustomSlotSchema.parse(body);
      const result = await AvailabilityService.createCustomSlot(session.userId, validated);
      return apiSuccess({ slot: result }, 201);
    }
  } catch (err) {
    return handleRouteError(err);
  }
}
