import { z } from "zod";

export const getMentorsQuerySchema = z.object({
  category: z.string().optional(),
  company: z.string().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export const updateMentorProfileSchema = z.object({
  headline: z.string().min(3),
  company: z.string().min(2),
  companyDomain: z.string().min(3),
  role: z.string().min(2),
  category: z.string().min(2),
  experienceYears: z.number().min(0),
  hourlyRate: z.number().min(0),
  bio: z.string().min(10),
  tags: z.array(z.string()).default([]),
  meetingUrl: z.string().url("Invalid meeting URL").optional().or(z.literal("")),
});

export const mentorServiceSchema = z.object({
  title: z.string().min(3),
  durationMinutes: z.number().refine((n) => n > 0 && n <= 180, "Duration must be between 1 and 180 minutes"),
  priceINR: z.number().min(0, "Price must be non-negative"),
  description: z.string().min(5),
  popular: z.boolean().optional().default(false),
});

export type GetMentorsQuery = z.infer<typeof getMentorsQuerySchema>;
export type UpdateMentorProfileInput = z.infer<typeof updateMentorProfileSchema>;
export type MentorServiceInput = z.infer<typeof mentorServiceSchema>;
