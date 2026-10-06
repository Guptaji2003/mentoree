import { NextRequest, NextResponse } from "next/server";
import { PaymentsService } from "@/server/modules/payments/payments.service";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";
    const eventId =
      req.headers.get("x-razorpay-event-id") ||
      (JSON.parse(rawBody)?.event_id) ||
      (JSON.parse(rawBody)?.payload?.payment?.entity?.id) ||
      "evt_" + Date.now();

    const result = await PaymentsService.handleWebhook(rawBody, signature, eventId);

    return NextResponse.json({
      status: "ok",
      result,
    });
  } catch (err: any) {
    console.error("[Razorpay Webhook Error]:", err.message);
    return NextResponse.json(
      {
        status: "error",
        message: err.message,
      },
      { status: err.message.includes("401") ? 401 : 400 }
    );
  }
}
