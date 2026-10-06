import { z } from "zod";

export const TimeIntervalSchema = z.object({
  start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format must be HH:MM"),
  end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format must be HH:MM"),
});

export const DayScheduleSchema = z.object({
  day: z.enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]),
  enabled: z.boolean().default(true),
  intervals: z.array(TimeIntervalSchema).default([{ start: "10:00", end: "18:00" }]),
});

export const UpdateWorkingHoursSchema = z.object({
  timezone: z.string().default("Asia/Kolkata"),
  weeklySchedule: z.array(DayScheduleSchema),
});

export const UpdateSchedulingRulesSchema = z.object({
  minNoticeHours: z.number().min(0).max(168).default(12),
  maxFutureBookingDays: z.number().min(1).max(365).default(30),
  bufferBeforeMinutes: z.number().min(0).max(120).default(0),
  bufferAfterMinutes: z.number().min(0).max(120).default(15),
  slotIntervalMinutes: z.number().min(15).max(120).default(30),
  maxBookingsPerDay: z.number().min(1).max(24).optional().nullable(),
  maxBookingsPerWeek: z.number().min(1).max(100).optional().nullable(),
});

export const CreateBlockedDateSchema = z.object({
  startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  reason: z.enum(["VACATION", "PERSONAL", "HOLIDAY", "WORK", "OTHER"]).default("VACATION"),
  notes: z.string().optional().nullable(),
});

export const SetMentorBreakSchema = z.object({
  startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  reason: z.string().optional().nullable(),
  breakType: z.enum(["VACATION", "PERSONAL", "EXAMS", "OTHER"]).default("VACATION"),
  isActive: z.boolean().default(true),
});

export const SetServiceOverrideSchema = z.object({
  serviceId: z.string(),
  weeklySchedule: z.array(DayScheduleSchema),
  isActive: z.boolean().default(true),
});

export type UpdateWorkingHoursInput = z.infer<typeof UpdateWorkingHoursSchema>;
export type UpdateSchedulingRulesInput = z.infer<typeof UpdateSchedulingRulesSchema>;
export type CreateBlockedDateInput = z.infer<typeof CreateBlockedDateSchema>;
export type SetMentorBreakInput = z.infer<typeof SetMentorBreakSchema>;
export type SetServiceOverrideInput = z.infer<typeof SetServiceOverrideSchema>;
