/**
 * Financial Engine: Server-Authoritative Fee and Tax Calculation
 * 
 * TODO [Chartered Accountant Confirmation Required]:
 * Determine whether 18% GST on platform commission (₹platformFee * 0.18) should be:
 * 1. Added on top of the student's base session price (gross addition), OR
 * 2. Deducted inclusive from the platform commission margin.
 * Currently implemented: Option 1 (Standard Marketplace SaaS model in India).
 */

export interface PricingBreakdown {
  baseAmountINR: number;
  platformFeeINR: number;     // 20% platform commission
  mentorPayoutINR: number;    // 80% net mentor share
  gstTaxINR: number;          // 18% GST on platform fee
  totalPayableINR: number;    // Base + GST
  totalPayablePaise: number;  // In paise for Razorpay
}

export function calculatePricing(baseAmountINR: number): PricingBreakdown {
  if (baseAmountINR < 0) {
    throw new Error("Base amount cannot be negative");
  }

  const platformFeeINR = Math.round(baseAmountINR * 0.20);
  const mentorPayoutINR = baseAmountINR - platformFeeINR;
  const gstTaxINR = Math.round(platformFeeINR * 0.18);
  const totalPayableINR = baseAmountINR + gstTaxINR;
  const totalPayablePaise = totalPayableINR * 100;

  return {
    baseAmountINR,
    platformFeeINR,
    mentorPayoutINR,
    gstTaxINR,
    totalPayableINR,
    totalPayablePaise,
  };
}
