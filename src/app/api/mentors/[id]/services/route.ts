import { NextRequest, NextResponse } from "next/server";
import { MentorServicesService } from "@/server/modules/services/mentor-services.service";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const services = await MentorServicesService.getPublicServicesForMentor(params.id);
    return NextResponse.json({ success: true, data: { services } });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to load mentor services" },
      { status: 500 }
    );
  }
}
