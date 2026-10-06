import { z } from "zod";

export const createCustomSlotSchema = z.object({
  startTime: z.string().datetime({ message: "startTime must be a valid ISO-8601 UTC string" }),
  endTime: z.string().datetime({ message: "endTime must be a valid ISO-8601 UTC string" }),
}).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
  message: "endTime must be strictly after startTime",
  path: ["endTime"],
});

export const createRecurringSlotsSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "startDate must be YYYY-MM-DD"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "endDate must be YYYY-MM-DD"),
  daysOfWeek: z.array(z.number().min(0).max(6)).min(1, "Select at least one day of the week"),
  dailyStartTime: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:mm"),
  dailyEndTime: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:mm"),
  slotDurationMinutes: z.union([z.literal(30), z.literal(45), z.literal(60)]),
});

export const holdSlotSchema = z.object({
  serviceId: z.string().min(1, "serviceId is required"),
  preSessionGoal: z.string().min(3, "Please specify your goal for this session"),
  preSessionQuestions: z.string().min(5, "Please list questions for the mentor"),
  preSessionResumeUrl: z.string().url().optional().or(z.literal("")),
});

export type CreateCustomSlotInput = z.infer<typeof createCustomSlotSchema>;
export type CreateRecurringSlotsInput = z.infer<typeof createRecurringSlotsSchema>;
export type HoldSlotInput = z.infer<typeof holdSlotSchema>;
