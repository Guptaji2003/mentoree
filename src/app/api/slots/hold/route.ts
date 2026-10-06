import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { AvailabilityService } from "@/server/modules/availability/availability.service";
import { holdSlotSchema } from "@/server/modules/availability/availability.schema";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { session } = await requireAuth(req, [Role.STUDENT, Role.ADMIN]);
    const ip = req.headers.get("x-forwarded-for") || undefined;
    const body = await req.json();

    const { slotId, ...rest } = body;
    if (!slotId) {
      throw new Error("400 Bad Request: slotId is required");
    }

    const validated = holdSlotSchema.parse(rest);
    const result = await AvailabilityService.holdSlot(session.userId, slotId, validated, ip);

    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
