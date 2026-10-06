import { Resend } from "resend";
import { db } from "@/server/db";
import { env } from "@/server/env";

export class NotificationService {
  private static resendClient = new Resend(env.RESEND_API_KEY);

  /**
   * Dispatch an email notification and log to Notification model
   */
  public static async sendEmailNotification(params: {
    userId: string;
    to: string;
    subject: string;
    html: string;
    type: "WORK_EMAIL_OTP" | "BOOKING_CONFIRMED" | "SESSION_REMINDER" | "BOOKING_CANCELLED" | "VERIFICATION_UPDATE";
    payload: Record<string, unknown>;
  }) {
    const { userId, to, subject, html, type, payload } = params;

    // Create Notification record in DB
    const notification = await db.notification.create({
      data: {
        userId,
        type,
        payload: payload as any,
        status: "PENDING",
        attempts: 1,
      },
    });

    try {
      if (process.env.NODE_ENV !== "test") {
        await this.resendClient.emails.send({
          from: env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          to,
          subject,
          html,
        });
      }

      await db.notification.update({
        where: { id: notification.id },
        data: { status: "SENT" },
      });

      return { success: true, notificationId: notification.id };
    } catch (err: any) {
      console.error("[NotificationService] Email delivery failed:", err);
      await db.notification.update({
        where: { id: notification.id },
        data: {
          status: "FAILED",
          attempts: { increment: 1 },
        },
      });
      return { success: false, error: err.message, notificationId: notification.id };
    }
  }
}
