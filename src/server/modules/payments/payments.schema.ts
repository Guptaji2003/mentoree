import { z } from "zod";

export const createOrderSchema = z.object({
  bookingId: z.string().min(1, "bookingId is required"),
  reservationToken: z.string().min(1, "reservationToken is required"),
});

export const verifyPaymentSchema = z.object({
  bookingId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export const adminRefundSchema = z.object({
  reason: z.string().min(3, "Refund reason required"),
  amountINR: z.number().positive().optional(),
});

export const adminMarkPayoutPaidSchema = z.object({
  transactionReference: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
export type AdminRefundInput = z.infer<typeof adminRefundSchema>;
export type AdminMarkPayoutPaidInput = z.infer<typeof adminMarkPayoutPaidSchema>;
