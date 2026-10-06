/**
 * Refund and Cancellation Policy Engine
 */

export interface RefundEligibility {
  eligible: boolean;
  refundPercentage: number; // 0 to 100
  refundAmountINR: number;
  reason: string;
}

export function evaluateCancellationRefund(
  sessionStartTime: Date,
  totalPaidINR: number,
  cancelledAt: Date = new Date()
): RefundEligibility {
  const diffHours = (sessionStartTime.getTime() - cancelledAt.getTime()) / (1000 * 60 * 60);

  if (diffHours >= 24) {
    // 100% full refund if cancelled 24+ hours before session
    return {
      eligible: true,
      refundPercentage: 100,
      refundAmountINR: totalPaidINR,
      reason: "Cancelled 24+ hours prior to scheduled session time (100% full refund).",
    };
  } else if (diffHours >= 6) {
    // 50% partial refund if cancelled between 6 and 24 hours
    const refundAmountINR = Math.round(totalPaidINR * 0.5);
    return {
      eligible: true,
      refundPercentage: 50,
      refundAmountINR,
      reason: "Cancelled between 6 and 24 hours prior to scheduled session time (50% partial refund).",
    };
  } else {
    // No refund if cancelled less than 6 hours prior
    return {
      eligible: false,
      refundPercentage: 0,
      refundAmountINR: 0,
      reason: "Cancelled less than 6 hours prior to session. Ineligible for automated refund.",
    };
  }
}
