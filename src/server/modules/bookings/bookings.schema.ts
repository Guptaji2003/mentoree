import { z } from "zod";

export const cancelBookingSchema = z.object({
  reason: z.string().min(3, "Cancellation reason is required"),
});

export const rescheduleBookingSchema = z.object({
  newSlotId: z.string().min(1, "New slot ID is required"),
  reason: z.string().optional(),
});

export const completeBookingSchema = z.object({
  actionPlanDeliverable: z.string().optional(),
});

export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
export type RescheduleBookingInput = z.infer<typeof rescheduleBookingSchema>;
export type CompleteBookingInput = z.infer<typeof completeBookingSchema>;
