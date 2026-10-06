import crypto from "crypto";
import Razorpay from "razorpay";
import { db } from "@/server/db";
import { env } from "@/server/env";
import { BookingStatus, PaymentStatus, SlotStatus, PayoutStatus, AuditAction } from "@prisma/client";
import { calculatePricing } from "./pricing";
import { CreateOrderInput, VerifyPaymentInput } from "./payments.schema";
import { NotificationService } from "../notifications/notifications.service";

export class PaymentsService {
  private static razorpayClient = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });

  /**
   * Create Razorpay Order
   * Derives pricing exclusively on server; verifies valid hold and session ownership.
   */
  public static async createOrder(studentId: string, input: CreateOrderInput) {
    const booking = await db.booking.findUnique({
      where: { id: input.bookingId },
      include: {
        slot: true,
        mentor: { include: { user: true } },
        service: true,
      },
    });

    if (!booking) {
      throw new Error("404 Not Found: Booking not found");
    }

    if (booking.studentId !== studentId) {
      throw new Error("403 Forbidden: You do not have permission to pay for this booking");
    }

    if (booking.status !== BookingStatus.HELD) {
      throw new Error(`400 Bad Request: Booking cannot be paid in current status (${booking.status})`);
    }

    if (booking.reservationToken !== input.reservationToken) {
      throw new Error("400 Bad Request: Invalid reservation token");
    }

    if (booking.slot.lockExpiresAt && booking.slot.lockExpiresAt < new Date()) {
      throw new Error("410 Gone: Slot hold has expired. Please select the slot again.");
    }

    const pricing = calculatePricing(booking.amount);

    // Create Razorpay Order via Official SDK
    let rzpOrder: { id: string };
    try {
      if (process.env.NODE_ENV === "test") {
        rzpOrder = { id: `order_test_${crypto.randomBytes(8).toString("hex")}` };
      } else {
        rzpOrder = await this.razorpayClient.orders.create({
          amount: pricing.totalPayablePaise,
          currency: "INR",
          receipt: booking.id,
          notes: {
            bookingId: booking.id,
            studentId,
            mentorId: booking.mentorId,
          },
        });
      }
    } catch (err: any) {
      console.error("[PaymentsService] Razorpay order creation failed:", err);
      throw new Error(`502 Bad Gateway: Payment gateway error - ${err.message || "Failed to initiate payment"}`);
    }

    // Persist Razorpay Order ID & Payment Row in Database
    await db.$transaction([
      db.booking.update({
        where: { id: booking.id },
        data: { razorpayOrderId: rzpOrder.id },
      }),
      db.payment.upsert({
        where: { bookingId: booking.id },
        create: {
          bookingId: booking.id,
          amount: pricing.totalPayableINR,
          platformFee: pricing.platformFeeINR,
          mentorPayout: pricing.mentorPayoutINR,
          gstTax: pricing.gstTaxINR,
          status: PaymentStatus.PENDING,
        },
        update: {
          amount: pricing.totalPayableINR,
          platformFee: pricing.platformFeeINR,
          mentorPayout: pricing.mentorPayoutINR,
          gstTax: pricing.gstTaxINR,
          status: PaymentStatus.PENDING,
        },
      }),
    ]);

    return {
      orderId: rzpOrder.id,
      amountPaise: pricing.totalPayablePaise,
      amountINR: pricing.totalPayableINR,
      currency: "INR",
      keyId: env.RAZORPAY_KEY_ID,
      pricing,
      booking: {
        id: booking.id,
        mentorName: booking.mentor.user.name,
        serviceTitle: booking.service?.title || "Mentorship Session",
      },
    };
  }

  /**
   * Verify Payment Signature (Client Checkout Callback Fast-Path)
   */
  public static async verifyPayment(studentId: string, input: VerifyPaymentInput) {
    const booking = await db.booking.findUnique({
      where: { id: input.bookingId },
      include: {
        payment: true,
        slot: true,
        mentor: { include: { user: true } },
        student: true,
      },
    });

    if (!booking || booking.studentId !== studentId) {
      throw new Error("403 Forbidden: Booking ownership verification failed");
    }

    // Timing-safe HMAC verification
    const text = `${input.razorpayOrderId}|${input.razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    const isMatch =
      expectedSignature.length === input.razorpaySignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "utf-8"),
        Buffer.from(input.razorpaySignature, "utf-8")
      );

    if (!isMatch) {
      throw new Error("400 Bad Request: Invalid payment signature from Razorpay");
    }

    // Meeting URL from mentor profile
    const meetingUrl = booking.mentor.meetingUrl || `https://meet.google.com/new`;

    // Atomically transition state
    await db.$transaction([
      db.payment.update({
        where: { bookingId: booking.id },
        data: {
          status: PaymentStatus.CAPTURED,
          razorpayPaymentId: input.razorpayPaymentId,
          razorpaySignature: input.razorpaySignature,
        },
      }),
      db.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.CONFIRMED,
          meetingUrl: booking.meetingUrl || meetingUrl,
        },
      }),
      db.availabilitySlot.update({
        where: { id: booking.slotId },
        data: {
          status: SlotStatus.BOOKED,
          lockedByToken: null,
          lockExpiresAt: null,
        },
      }),
      db.mentorProfile.update({
        where: { id: booking.mentorId },
        data: { totalMenteesHelped: { increment: 1 } },
      }),
      db.auditLog.create({
        data: {
          mentorId: booking.mentorId,
          action: AuditAction.PAYMENT_CAPTURED,
          performedBy: studentId,
          details: `Captured payment ${input.razorpayPaymentId} for Booking ${booking.id}`,
        },
      }),
    ]);

    // Send confirmation emails
    await NotificationService.sendEmailNotification({
      userId: booking.studentId,
      to: booking.student.email,
      subject: `🎉 Booking Confirmed with ${booking.mentor.user.name}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>Your Mentorship Session is Confirmed!</h2>
          <p>Hi ${booking.student.name},</p>
          <p>Your session with <strong>${booking.mentor.user.name}</strong> is confirmed for <strong>${booking.slot.startTime.toUTCString()}</strong>.</p>
          <p><strong>Meeting Link:</strong> <a href="${meetingUrl}">${meetingUrl}</a></p>
          <p>Prepare your notes and questions ahead of time!</p>
        </div>
      `,
      type: "BOOKING_CONFIRMED",
      payload: { bookingId: booking.id, meetingUrl },
    });

    return {
      success: true,
      status: "CONFIRMED",
      meetingUrl,
      bookingId: booking.id,
    };
  }

  /**
   * Webhook Handler with Absolute Cryptographic Verification and Idempotency
   */
  public static async handleWebhook(rawBody: string, signature: string, eventId: string) {
    if (!signature) {
      throw new Error("401 Unauthorized: Missing Razorpay webhook signature");
    }

    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    const isMatch =
      expectedSignature.length === signature.length &&
      crypto.timingSafeEqual(Buffer.from(expectedSignature, "utf-8"), Buffer.from(signature, "utf-8"));

    if (!isMatch) {
      throw new Error("401 Unauthorized: Invalid webhook signature");
    }

    const event = JSON.parse(rawBody);

    // Idempotency: insert WebhookLog in transaction; on duplicate eventId skip safely
    try {
      const result = await db.$transaction(async (tx) => {
        // Idempotency insert
        const log = await tx.webhookLog.create({
          data: {
            eventId,
            eventType: event.event,
            payload: event,
            processed: true,
          },
        });

        if (event.event === "payment.captured") {
          const rzpPayment = event.payload.payment.entity;
          const rzpOrderId = rzpPayment.order_id;
          const capturedAmountINR = rzpPayment.amount / 100;

          const booking = await tx.booking.findFirst({
            where: { razorpayOrderId: rzpOrderId },
            include: { payment: true, mentor: true, slot: true, student: true },
          });

          if (!booking || !booking.payment) {
            console.warn(`[Webhook] No matching booking found for order ${rzpOrderId}`);
            return { processed: true, action: "NO_MATCHING_BOOKING" };
          }

          // Invariant: Amount check
          if (booking.payment.amount !== capturedAmountINR) {
            console.error(`[Webhook] Amount mismatch: expected ₹${booking.payment.amount}, received ₹${capturedAmountINR}`);
            await tx.auditLog.create({
              data: {
                mentorId: booking.mentorId,
                action: AuditAction.PAYMENT_FAILED,
                performedBy: "system:razorpay-webhook",
                details: `Amount mismatch on order ${rzpOrderId}. Expected ${booking.payment.amount}, got ${capturedAmountINR}`,
              },
            });
            return { processed: true, action: "AMOUNT_MISMATCH" };
          }

          const meetingUrl = booking.mentor.meetingUrl || `https://meet.google.com/new`;

          await tx.payment.update({
            where: { id: booking.payment.id },
            data: {
              status: PaymentStatus.CAPTURED,
              razorpayPaymentId: rzpPayment.id,
            },
          });

          await tx.booking.update({
            where: { id: booking.id },
            data: {
              status: BookingStatus.CONFIRMED,
              meetingUrl: booking.meetingUrl || meetingUrl,
            },
          });

          await tx.availabilitySlot.update({
            where: { id: booking.slotId },
            data: {
              status: SlotStatus.BOOKED,
              lockedByToken: null,
              lockExpiresAt: null,
            },
          });

          await tx.mentorProfile.update({
            where: { id: booking.mentorId },
            data: { totalMenteesHelped: { increment: 1 } },
          });

          await tx.auditLog.create({
            data: {
              mentorId: booking.mentorId,
              action: AuditAction.PAYMENT_CAPTURED,
              performedBy: "system:razorpay-webhook",
              details: `Webhook captured payment ${rzpPayment.id} for Booking ${booking.id}`,
            },
          });

          return { processed: true, action: "CONFIRMED", bookingId: booking.id };
        } else if (event.event === "payment.failed") {
          const rzpPayment = event.payload.payment.entity;
          const rzpOrderId = rzpPayment.order_id;

          const booking = await tx.booking.findFirst({
            where: { razorpayOrderId: rzpOrderId },
            include: { payment: true },
          });

          if (booking) {
            if (booking.payment) {
              await tx.payment.update({
                where: { id: booking.payment.id },
                data: { status: PaymentStatus.FAILED },
              });
            }

            await tx.booking.update({
              where: { id: booking.id },
              data: { status: BookingStatus.FAILED },
            });

            await tx.availabilitySlot.update({
              where: { id: booking.slotId },
              data: {
                status: SlotStatus.AVAILABLE,
                lockedByToken: null,
                lockExpiresAt: null,
              },
            });

            await tx.auditLog.create({
              data: {
                mentorId: booking.mentorId,
                action: AuditAction.PAYMENT_FAILED,
                performedBy: "system:razorpay-webhook",
                details: `Payment failed for order ${rzpOrderId}`,
              },
            });
          }

          return { processed: true, action: "FAILED" };
        }

        return { processed: true, action: "UNHANDLED_EVENT" };
      });

      return result;
    } catch (err: any) {
      // Prisma unique constraint violation code is P2002
      if (err.code === "P2002" || err.message?.includes("Unique constraint")) {
        console.log(`[Webhook] Duplicate event ${eventId} safely ignored.`);
        return { processed: false, reason: "Duplicate event already processed" };
      }
      throw err;
    }
  }

  /**
   * Process Refund
   */
  public static async processRefund(paymentId: string, amountINR: number, reason: string, performerId: string) {
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: { booking: { include: { slot: true } } },
    });

    if (!payment) {
      throw new Error("404 Not Found: Payment record not found");
    }

    if (payment.status !== PaymentStatus.CAPTURED) {
      throw new Error("400 Bad Request: Only captured payments can be refunded");
    }

    let rzpRefundId: string | null = null;
    if (payment.razorpayPaymentId) {
      try {
        if (process.env.NODE_ENV !== "test") {
          const rzpRefund = await this.razorpayClient.payments.refund(payment.razorpayPaymentId, {
            amount: amountINR * 100,
            notes: { reason, bookingId: payment.bookingId },
          });
          rzpRefundId = rzpRefund.id;
        } else {
          rzpRefundId = "rfnd_test_" + crypto.randomBytes(6).toString("hex");
        }
      } catch (err: any) {
        console.error("[PaymentsService] Razorpay refund failed:", err);
        throw new Error(`502 Bad Gateway: Refund failed - ${err.message}`);
      }
    }

    await db.$transaction([
      db.refund.create({
        data: {
          paymentId: payment.id,
          amount: amountINR,
          razorpayRefundId: rzpRefundId,
          reason,
          status: "PROCESSED",
        },
      }),
      db.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.REFUNDED },
      }),
      db.booking.update({
        where: { id: payment.bookingId },
        data: { status: BookingStatus.CANCELLED },
      }),
      db.availabilitySlot.update({
        where: { id: payment.booking.slotId },
        data: { status: SlotStatus.AVAILABLE },
      }),
      db.auditLog.create({
        data: {
          mentorId: payment.booking.mentorId,
          action: AuditAction.REFUND_ISSUED,
          performedBy: performerId,
          details: `Issued refund of ₹${amountINR} for booking ${payment.bookingId}. Reason: ${reason}`,
        },
      }),
    ]);

    return { success: true, refundId: rzpRefundId, amountINR };
  }

  /**
   * List Payouts for Admin Console
   */
  public static async listPayouts(status?: PayoutStatus) {
    return db.payout.findMany({
      where: status ? { status } : {},
      include: {
        mentor: { include: { user: true } },
        booking: { include: { student: true, service: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Admin: Mark Payout as Paid
   */
  public static async markPayoutPaid(payoutId: string, adminId: string, adminEmail: string) {
    const payout = await db.payout.findUnique({
      where: { id: payoutId },
      include: { mentor: { include: { user: true } } },
    });

    if (!payout) {
      throw new Error("404 Not Found: Payout not found");
    }

    const updated = await db.payout.update({
      where: { id: payoutId },
      data: {
        status: PayoutStatus.PAID,
        paidAt: new Date(),
      },
    });

    await db.auditLog.create({
      data: {
        mentorId: payout.mentorId,
        action: AuditAction.APPROVED,
        performedBy: `${adminEmail} (Admin)`,
        details: `Marked mentor payout of ₹${payout.amount} as PAID (ID: ${payout.id})`,
      },
    });

    return updated;
  }
}
