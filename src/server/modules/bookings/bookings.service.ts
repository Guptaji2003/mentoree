import { db } from "@/server/db";
import { BookingStatus, SlotStatus, PayoutStatus, AuditAction, Role } from "@prisma/client";
import { SessionPayload } from "../auth/auth.service";
import { evaluateCancellationRefund } from "../payments/refund-policy";
import { PaymentsService } from "../payments/payments.service";
import { NotificationService } from "../notifications/notifications.service";

export class BookingsService {
  /**
   * List user's bookings (Student: own bookings, Mentor: mentees' bookings, Admin: all)
   */
  public static async listBookings(session: SessionPayload) {
    let whereClause = {};

    if (session.role === Role.ADMIN) {
      whereClause = {};
    } else if (session.role === Role.MENTOR) {
      whereClause = { mentor: { userId: session.userId } };
    } else {
      whereClause = { studentId: session.userId };
    }

    const bookings = await db.booking.findMany({
      where: whereClause,
      include: {
        student: { select: { id: true, name: true, email: true, avatarUrl: true } },
        mentor: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          },
        },
        slot: true,
        service: true,
        payment: true,
        review: true,
        payout: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return bookings;
  }

  /**
   * Get single booking by ID (Strict ownership enforced)
   */
  public static async getBookingById(session: SessionPayload, bookingId: string) {
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        student: { select: { id: true, name: true, email: true, avatarUrl: true } },
        mentor: {
          include: {
            user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          },
        },
        slot: true,
        service: true,
        payment: true,
        review: true,
        payout: true,
      },
    });

    if (!booking) {
      throw new Error("404 Not Found: Booking not found");
    }

    const isStudent = booking.studentId === session.userId;
    const isMentor = booking.mentor.userId === session.userId;
    const isAdmin = session.role === Role.ADMIN;

    if (!isStudent && !isMentor && !isAdmin) {
      throw new Error("403 Forbidden: You do not have permission to view this booking");
    }

    return booking;
  }

  /**
   * Cancel booking & process automated refund if eligible
   */
  public static async cancelBooking(
    session: SessionPayload,
    bookingId: string,
    reason: string,
    ipAddress?: string
  ) {
    const booking = await this.getBookingById(session, bookingId);

    if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.COMPLETED) {
      throw new Error(`400 Bad Request: Booking cannot be cancelled in status ${booking.status}`);
    }

    let refundDetails = null;

    // If payment was captured, process refund according to cancellation policy
    if (booking.payment && booking.payment.status === "CAPTURED") {
      const eligibility = evaluateCancellationRefund(booking.slot.startTime, booking.payment.amount);
      if (eligibility.eligible && eligibility.refundAmountINR > 0) {
        refundDetails = await PaymentsService.processRefund(
          booking.payment.id,
          eligibility.refundAmountINR,
          `Cancellation: ${reason} (${eligibility.reason})`,
          session.userId
        );
      }
    }

    await db.$transaction([
      db.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.CANCELLED },
      }),
      db.availabilitySlot.update({
        where: { id: booking.slotId },
        data: {
          status: SlotStatus.AVAILABLE,
          lockedByToken: null,
          lockExpiresAt: null,
        },
      }),
      db.auditLog.create({
        data: {
          mentorId: booking.mentorId,
          action: AuditAction.SLOT_RELEASED,
          performedBy: session.email,
          details: `Cancelled booking ${booking.id}. Reason: ${reason}. Refund: ${refundDetails ? `₹${refundDetails.amountINR}` : "None"}`,
          ipAddress: ipAddress || null,
        },
      }),
    ]);

    // Send notifications
    await Promise.all([
      NotificationService.sendEmailNotification({
        userId: booking.studentId,
        to: booking.student.email,
        subject: `Mentorship Session Cancelled`,
        html: `<p>Your session with ${booking.mentor.user.name} has been cancelled. Reason: ${reason}</p>`,
        type: "BOOKING_CANCELLED",
        payload: { bookingId: booking.id, reason },
      }),
      NotificationService.sendEmailNotification({
        userId: booking.mentor.userId,
        to: booking.mentor.user.email,
        subject: `Session Cancelled by ${session.name || "User"}`,
        html: `<p>Session on ${booking.slot.startTime.toUTCString()} has been cancelled. Slot is now available for other students.</p>`,
        type: "BOOKING_CANCELLED",
        payload: { bookingId: booking.id, reason },
      }),
    ]);

    return { success: true, message: "Booking cancelled successfully", refundDetails };
  }

  /**
   * Mark booking as COMPLETED and automatically generate mentor Payout row
   */
  public static async completeBooking(
    session: SessionPayload,
    bookingId: string,
    actionPlanDeliverable?: string,
    ipAddress?: string
  ) {
    const booking = await this.getBookingById(session, bookingId);

    const isMentor = booking.mentor.userId === session.userId;
    const isAdmin = session.role === Role.ADMIN;

    if (!isMentor && !isAdmin) {
      throw new Error("403 Forbidden: Only the assigned mentor or admin can mark a session as completed");
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new Error(`400 Bad Request: Only CONFIRMED bookings can be completed (current: ${booking.status})`);
    }

    const mentorPayoutAmount = booking.payment?.mentorPayout ?? Math.round(booking.amount * 0.8);

    const result = await db.$transaction(async (tx) => {
      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.COMPLETED,
          actionPlanDeliverable: actionPlanDeliverable || booking.actionPlanDeliverable || null,
        },
      });

      // Upsert mentor Payout row (status: PENDING)
      const payout = await tx.payout.upsert({
        where: { bookingId: booking.id },
        create: {
          mentorId: booking.mentorId,
          bookingId: booking.id,
          amount: mentorPayoutAmount,
          status: PayoutStatus.PENDING,
        },
        update: {
          amount: mentorPayoutAmount,
          status: PayoutStatus.PENDING,
        },
      });

      await tx.auditLog.create({
        data: {
          mentorId: booking.mentorId,
          action: AuditAction.APPROVED,
          performedBy: session.email,
          details: `Completed session for booking ${booking.id}. Created pending payout of ₹${mentorPayoutAmount}`,
          ipAddress: ipAddress || null,
        },
      });

      return { booking: updatedBooking, payout };
    });

    return { success: true, message: "Session marked as completed", ...result };
  }
}
