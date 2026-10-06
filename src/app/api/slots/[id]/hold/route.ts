import { NextRequest } from "next/server";
import { requireAuth } from "@/server/utils/auth-guard";
import { AvailabilityService } from "@/server/modules/availability/availability.service";
import { holdSlotSchema } from "@/server/modules/availability/availability.schema";
import { apiSuccess, handleRouteError } from "@/server/utils/response";
import { Role } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { session } = await requireAuth(req, [Role.STUDENT, Role.ADMIN]);
    const ip = req.headers.get("x-forwarded-for") || undefined;
    const body = await req.json();
    const validated = holdSlotSchema.parse(body);

    const result = await AvailabilityService.holdSlot(session.userId, params.id, validated, ip);
    return apiSuccess(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
