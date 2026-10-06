import { z } from "zod";

export const cancelBookingSchema = z.object({
  reason: z.string().min(3, "Cancellation reason is required"),
});

export const completeBookingSchema = z.object({
  actionPlanDeliverable: z.string().optional(),
});

export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
export type CompleteBookingInput = z.infer<typeof completeBookingSchema>;
