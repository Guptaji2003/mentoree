import { NextRequest, NextResponse } from "next/server";
import { AvailabilityEngineService } from "@/server/modules/availability/availability-engine.service";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; serviceId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const targetTimezone = searchParams.get("timezone") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const result = await AvailabilityEngineService.calculateAvailableSlots({
      mentorId: params.id,
      serviceId: params.serviceId,
      targetTimezone,
      startDate,
      endDate,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to calculate available slots" },
      { status: 500 }
    );
  }
}
