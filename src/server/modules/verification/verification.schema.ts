import { z } from "zod";

const BLOCKED_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "aol.com",
  "zoho.com",
  "mail.com",
  "gmx.com",
  "yandex.com",
];

export const sendWorkEmailOtpSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .refine((val) => {
      const domain = val.split("@")[1]?.toLowerCase();
      return !BLOCKED_DOMAINS.includes(domain);
    }, "Please provide a valid corporate/work email. Free public email providers (Gmail, Yahoo, Outlook, etc.) are not allowed for mentor verification."),
});

export const verifyWorkEmailOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must contain only digits"),
});

export const presignedUploadUrlSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.enum(["application/pdf", "image/jpeg", "image/png", "image/webp"]),
  fileSizeBytes: z.number().max(5 * 1024 * 1024, "File size cannot exceed 5MB"),
  documentType: z.enum(["EMPLOYEE_ID", "OFFER_LETTER", "PAYSLIP", "LINKEDIN"]),
});

export const recordDocumentSchema = z.object({
  documentType: z.enum(["WORK_EMAIL", "EMPLOYEE_ID", "OFFER_LETTER", "PAYSLIP", "LINKEDIN"]),
  fileName: z.string().min(1),
  fileUrl: z.string().url("Invalid file URL"),
  fileSize: z.string(),
});

export const adminApproveSchema = z.object({
  reason: z.string().optional(),
});

export const adminRejectSchema = z.object({
  reason: z.string().min(5, "Rejection reason must be at least 5 characters"),
});

export type SendWorkEmailOtpInput = z.infer<typeof sendWorkEmailOtpSchema>;
export type VerifyWorkEmailOtpInput = z.infer<typeof verifyWorkEmailOtpSchema>;
export type PresignedUploadUrlInput = z.infer<typeof presignedUploadUrlSchema>;
export type RecordDocumentInput = z.infer<typeof recordDocumentSchema>;
export type AdminRejectInput = z.infer<typeof adminRejectSchema>;
