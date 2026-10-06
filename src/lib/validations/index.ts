import { z } from "zod";

// ==========================================
// 1. Auth Schemas
// ==========================================

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "MENTOR", "ADMIN"]),
});

export type SignupFormData = z.infer<typeof signupSchema>;

// ==========================================
// 2. Student Profile Schema
// ==========================================

export const studentProfileSchema = z.object({
  targetRole: z.string().min(2, "Target role must be at least 2 characters"),
  targetCompany: z.string().min(2, "Target company must be at least 2 characters"),
  college: z.string().min(2, "College name must be at least 2 characters"),
  graduationYear: z.number().min(2020, "Graduation year must be valid").max(2035, "Graduation year must be valid"),
  bio: z.string().optional(),
});

export type StudentProfileFormData = z.infer<typeof studentProfileSchema>;

// ==========================================
// 3. Mentor Availability Slot Schema
// ==========================================

export const availabilitySlotSchema = z.object({
  date: z.string().min(1, "Session date is required"),
  time: z.string().min(1, "Session time is required"),
});

export type AvailabilitySlotFormData = z.infer<typeof availabilitySlotSchema>;

// ==========================================
// 4. Admin Verification & Audit Schemas
// ==========================================

export const rejectApplicantSchema = z.object({
  reason: z.string().min(5, "Audit rejection reason must be at least 5 characters"),
});

export type RejectApplicantFormData = z.infer<typeof rejectApplicantSchema>;

// ==========================================
// 5. Booking Slot Schema
// ==========================================

export const bookingFormSchema = z.object({
  mentorId: z.string().min(1, "Mentor is required"),
  slotId: z.string().min(1, "Time slot is required"),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
