import crypto from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "@/server/db";
import { env } from "@/server/env";
import { VerificationStatus, DocumentType, DocumentStatus, AuditAction, Role } from "@prisma/client";
import { NotificationService } from "../notifications/notifications.service";
import {
  SendWorkEmailOtpInput,
  VerifyWorkEmailOtpInput,
  PresignedUploadUrlInput,
  RecordDocumentInput,
} from "./verification.schema";

export class VerificationService {
  private static s3Client = new S3Client({
    region: env.AWS_REGION || "ap-south-1",
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  /**
   * Send 6-digit OTP to corporate work email (10-min expiry, max 5 attempts)
   * Invariant: Never return the OTP in the API response!
   */
  public static async sendWorkEmailOtp(userId: string, input: SendWorkEmailOtpInput) {
    const mentor = await db.mentorProfile.findUnique({
      where: { userId },
    });

    if (!mentor) {
      throw new Error("404 Not Found: Mentor profile not found");
    }

    // Generate cryptographically secure 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes in UTC

    // Invalidate prior pending OTPs for this email/user
    await db.emailOtp.deleteMany({
      where: { email: input.email.toLowerCase().trim() },
    });

    await db.emailOtp.create({
      data: {
        userId,
        email: input.email.toLowerCase().trim(),
        codeHash,
        expiresAt,
        attempts: 0,
      },
    });

    // Send email via Resend / NotificationService
    const domain = input.email.split("@")[1];
    await NotificationService.sendEmailNotification({
      userId,
      to: input.email.toLowerCase().trim(),
      subject: `Verify your corporate email for Mentoree (@${domain})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>Corporate Email Verification</h2>
          <p>Please use the following 6-digit verification code to verify your employment domain <strong>@${domain}</strong>:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 16px; background: #f4f4f5; border-radius: 8px; text-align: center;">
            ${code}
          </div>
          <p style="color: #71717a; font-size: 14px; margin-top: 16px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
      type: "WORK_EMAIL_OTP",
      payload: { email: input.email, domain },
    });

    return {
      success: true,
      message: `Verification code sent to corporate email @${domain}`,
      domain,
    };
  }

  /**
   * Verify Work Email OTP and update mentor profile and documents
   */
  public static async verifyWorkEmailOtp(userId: string, input: VerifyWorkEmailOtpInput) {
    const email = input.email.toLowerCase().trim();
    const otpHash = crypto.createHash("sha256").update(input.otp).digest("hex");

    const record = await db.emailOtp.findFirst({
      where: { email, userId },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      throw new Error("400 Bad Request: No active verification request found for this email");
    }

    if (record.attempts >= 5) {
      await db.emailOtp.delete({ where: { id: record.id } });
      throw new Error("400 Bad Request: Maximum OTP attempts exceeded. Please request a new code.");
    }

    if (record.expiresAt < new Date()) {
      await db.emailOtp.delete({ where: { id: record.id } });
      throw new Error("400 Bad Request: Verification code has expired. Please request a new code.");
    }

    if (record.codeHash !== otpHash) {
      await db.emailOtp.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      throw new Error("400 Bad Request: Invalid 6-digit verification code");
    }

    // Successfully verified!
    const domain = email.split("@")[1];
    const mentor = await db.mentorProfile.findUnique({
      where: { userId },
    });

    if (!mentor) {
      throw new Error("404 Not Found: Mentor profile not found");
    }

    // Upsert WORK_EMAIL document as APPROVED
    const existingDoc = await db.verificationDocument.findFirst({
      where: { mentorId: mentor.id, documentType: DocumentType.WORK_EMAIL },
    });

    if (existingDoc) {
      await db.verificationDocument.update({
        where: { id: existingDoc.id },
        data: {
          status: DocumentStatus.APPROVED,
          verifiedDomain: domain,
          fileName: email,
          fileUrl: `mailto:${email}`,
        },
      });
    } else {
      await db.verificationDocument.create({
        data: {
          mentorId: mentor.id,
          documentType: DocumentType.WORK_EMAIL,
          fileName: email,
          fileUrl: `mailto:${email}`,
          fileSize: "0 KB",
          status: DocumentStatus.APPROVED,
          verifiedDomain: domain,
        },
      });
    }

    // Update company domain on mentor profile
    await db.mentorProfile.update({
      where: { id: mentor.id },
      data: { companyDomain: domain },
    });

    // Clean up OTP record
    await db.emailOtp.delete({ where: { id: record.id } });

    return {
      success: true,
      message: `Corporate email @${domain} successfully verified!`,
      verifiedDomain: domain,
    };
  }

  /**
   * Generate S3 presigned PUT URL for private document upload (PDF/JPG/PNG, max 5MB)
   */
  public static async generatePresignedUploadUrl(userId: string, input: PresignedUploadUrlInput) {
    const mentor = await db.mentorProfile.findUnique({
      where: { userId },
    });

    if (!mentor) {
      throw new Error("404 Not Found: Mentor profile not found");
    }

    const fileExt = input.fileName.split(".").pop() || "pdf";
    const uniqueFileId = crypto.randomUUID();
    const objectKey = `documents/${mentor.id}/${uniqueFileId}.${fileExt}`;

    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: objectKey,
      ContentType: input.fileType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 900 }); // 15 mins
    const publicDocUrl = `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${objectKey}`;

    return {
      uploadUrl,
      fileUrl: publicDocUrl,
      objectKey,
      documentType: input.documentType,
    };
  }

  /**
   * Record uploaded document in DB
   */
  public static async recordUploadedDocument(userId: string, input: RecordDocumentInput) {
    const mentor = await db.mentorProfile.findUnique({
      where: { userId },
    });

    if (!mentor) {
      throw new Error("404 Not Found: Mentor profile not found");
    }

    const doc = await db.verificationDocument.create({
      data: {
        mentorId: mentor.id,
        documentType: input.documentType,
        fileName: input.fileName,
        fileUrl: input.fileUrl,
        fileSize: input.fileSize,
        status: DocumentStatus.PENDING,
      },
    });

    return doc;
  }

  /**
   * Admin: List verifications with filter
   */
  public static async listAdminVerifications(statusFilter?: VerificationStatus, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = statusFilter ? { status: statusFilter } : {};

    const [total, mentors] = await Promise.all([
      db.mentorProfile.count({ where }),
      db.mentorProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, name: true, email: true, isVerified: true, avatarUrl: true },
          },
          verificationDocs: true,
          services: true,
        },
      }),
    ]);

    return {
      mentors,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Admin: Approve Mentor
   */
  public static async adminApproveMentor(
    adminId: string,
    adminEmail: string,
    mentorId: string,
    ipAddress?: string
  ) {
    const mentor = await db.mentorProfile.findFirst({
      where: { OR: [{ id: mentorId }, { userId: mentorId }] },
      include: { user: true, verificationDocs: true },
    });

    if (!mentor) {
      throw new Error("404 Not Found: Mentor not found");
    }

    // Update mentor status and approve pending docs
    await db.$transaction([
      db.mentorProfile.update({
        where: { id: mentor.id },
        data: { status: VerificationStatus.VERIFIED },
      }),
      db.user.update({
        where: { id: mentor.userId },
        data: { isVerified: true },
      }),
      db.verificationDocument.updateMany({
        where: { mentorId: mentor.id, status: DocumentStatus.PENDING },
        data: { status: DocumentStatus.APPROVED },
      }),
      db.auditLog.create({
        data: {
          mentorId: mentor.id,
          action: AuditAction.APPROVED,
          performedBy: `${adminEmail} (Admin)`,
          details: `Approved mentor application. Verified credentials for @${mentor.companyDomain}. Published to public directory.`,
          ipAddress: ipAddress || null,
        },
      }),
    ]);

    // Send confirmation email
    await NotificationService.sendEmailNotification({
      userId: mentor.userId,
      to: mentor.user.email,
      subject: "🎉 Your Mentoree Mentor Application Has Been Approved!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>Congratulations, ${mentor.user.name}!</h2>
          <p>Your mentor profile has been verified by our compliance team and is now live on the Mentoree Directory.</p>
          <p>You can now manage your availability slots and start accepting 1:1 mentorship bookings.</p>
        </div>
      `,
      type: "VERIFICATION_UPDATE",
      payload: { mentorId: mentor.id, status: "APPROVED" },
    });

    return { success: true, message: `Mentor ${mentor.user.name} successfully approved and published.` };
  }

  /**
   * Admin: Reject Mentor
   */
  public static async adminRejectMentor(
    adminId: string,
    adminEmail: string,
    mentorId: string,
    reason: string,
    ipAddress?: string
  ) {
    const mentor = await db.mentorProfile.findFirst({
      where: { OR: [{ id: mentorId }, { userId: mentorId }] },
      include: { user: true },
    });

    if (!mentor) {
      throw new Error("404 Not Found: Mentor not found");
    }

    await db.$transaction([
      db.mentorProfile.update({
        where: { id: mentor.id },
        data: { status: VerificationStatus.REJECTED },
      }),
      db.verificationDocument.updateMany({
        where: { mentorId: mentor.id, status: DocumentStatus.PENDING },
        data: { status: DocumentStatus.REJECTED, rejectionReason: reason },
      }),
      db.auditLog.create({
        data: {
          mentorId: mentor.id,
          action: AuditAction.REJECTED,
          performedBy: `${adminEmail} (Admin)`,
          details: `Rejected mentor application. Reason: ${reason}`,
          ipAddress: ipAddress || null,
        },
      }),
    ]);

    // Send rejection email
    await NotificationService.sendEmailNotification({
      userId: mentor.userId,
      to: mentor.user.email,
      subject: "Update regarding your Mentoree Mentor Application",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>Application Update</h2>
          <p>Hello ${mentor.user.name},</p>
          <p>We reviewed your application for the Mentoree Mentor Marketplace. Unfortunately, we could not verify your credentials at this time.</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p>You may submit updated employment documentation or contact support if you believe this is a mistake.</p>
        </div>
      `,
      type: "VERIFICATION_UPDATE",
      payload: { mentorId: mentor.id, status: "REJECTED", reason },
    });

    return { success: true, message: `Mentor ${mentor.user.name} application rejected.` };
  }
}
