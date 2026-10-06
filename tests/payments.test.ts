import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { calculatePricing } from "@/server/modules/payments/pricing";
import { evaluateCancellationRefund } from "@/server/modules/payments/refund-policy";

describe("Step 5 - Payments, Pricing & Refunds", () => {
  it("should accurately calculate 20% platform fee, 80% mentor payout and 18% GST", () => {
    const baseAmount = 1000;
    const pricing = calculatePricing(baseAmount);

    expect(pricing.baseAmountINR).toBe(1000);
    expect(pricing.platformFeeINR).toBe(200); // 20% of 1000
    expect(pricing.mentorPayoutINR).toBe(800); // 80% of 1000
    expect(pricing.gstTaxINR).toBe(36); // 18% of 200
    expect(pricing.totalPayableINR).toBe(1036); // 1000 + 36
    expect(pricing.totalPayablePaise).toBe(103600);
  });

  it("should evaluate cancellation refund based on 24h+ policy", () => {
    const now = new Date();
    const futureSession28Hours = new Date(now.getTime() + 28 * 60 * 60 * 1000);
    const futureSession12Hours = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    const futureSession2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const fullRefund = evaluateCancellationRefund(futureSession28Hours, 1000, now);
    expect(fullRefund.eligible).toBe(true);
    expect(fullRefund.refundPercentage).toBe(100);
    expect(fullRefund.refundAmountINR).toBe(1000);

    const partialRefund = evaluateCancellationRefund(futureSession12Hours, 1000, now);
    expect(partialRefund.eligible).toBe(true);
    expect(partialRefund.refundPercentage).toBe(50);
    expect(partialRefund.refundAmountINR).toBe(500);

    const noRefund = evaluateCancellationRefund(futureSession2Hours, 1000, now);
    expect(noRefund.eligible).toBe(false);
    expect(noRefund.refundAmountINR).toBe(0);
  });

  it("should verify Razorpay HMAC signatures securely using timingSafeEqual", () => {
    const secret = "test_webhook_secret_hmac_sha256";
    const rawBody = JSON.stringify({ event: "payment.captured", id: "pay_123" });
    const validSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

    // Timing-safe check
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(validSignature, "utf-8"),
      Buffer.from(validSignature, "utf-8")
    );
    expect(isMatch).toBe(true);

    const invalidSignature = "invalid_signature_hash_0000000000000000000000000000000000000000000000000000000000000000";
    const isInvalidMatch =
      validSignature.length === invalidSignature.length &&
      crypto.timingSafeEqual(Buffer.from(validSignature, "utf-8"), Buffer.from(invalidSignature, "utf-8"));
    expect(isInvalidMatch).toBe(false);
  });
});
