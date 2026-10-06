import { z } from "zod";

export const QuestionTypeEnum = z.enum([
  "SHORT_TEXT",
  "LONG_TEXT",
  "SINGLE_SELECT",
  "MULTI_SELECT",
  "NUMBER",
  "URL",
]);

export const ServiceQuestionInputSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(3, "Question must be at least 3 characters"),
  type: QuestionTypeEnum.default("SHORT_TEXT"),
  required: z.boolean().default(true),
  options: z.array(z.string()).default([]),
  sortOrder: z.number().default(0),
});

export const CreateMentorServiceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string().default("Career Guidance"),
  durationMinutes: z.number().min(15).max(180).default(60),
  priceINR: z.number().min(0, "Price cannot be negative"),
  currency: z.string().default("INR"),
  description: z.string().min(10, "Short description must be at least 10 characters"),
  detailedDescription: z.string().optional(),
  sessionType: z.enum(["VIDEO", "AUDIO", "CHAT"]).default("VIDEO"),
  deliverables: z.array(z.string()).default([]),
  topicsCovered: z.array(z.string()).default([]),
  targetAudience: z.string().optional(),
  bookingMode: z.enum(["INSTANT", "APPROVAL_REQUIRED"]).default("INSTANT"),
  status: z.enum(["DRAFT", "PUBLISHED", "PAUSED", "ARCHIVED"]).default("PUBLISHED"),
  popular: z.boolean().default(false),
  customQuestions: z.array(ServiceQuestionInputSchema).optional().default([]),
});

export const UpdateMentorServiceSchema = CreateMentorServiceSchema.partial();

export const ChangeServiceStatusSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "PAUSED", "ARCHIVED"]),
});

export type CreateMentorServiceInput = z.infer<typeof CreateMentorServiceSchema>;
export type UpdateMentorServiceInput = z.infer<typeof UpdateMentorServiceSchema>;
export type ServiceQuestionInput = z.infer<typeof ServiceQuestionInputSchema>;
