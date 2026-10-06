import { db } from "@/server/db";
import { SessionPayload } from "../auth/auth.service";
import { BookingStatus, SlotStatus, PayoutStatus, AuditAction, Role } from "@prisma/client";
import { evaluateCancellationRefund } from "../payments/refund-policy";
import { PaymentsService } from "../payments/payments.service";
import { NotificationService } from "../notifications/notifications.service";

export class MentorPortalService {
  /**
   * Helper to ensure the authenticated user has a mentor profile
   */
  public static async getMentorProfile(userId: string) {
    const mentor = await db.mentorProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        workingHours: true,
        schedulingRule: true,
        breaks: { where: { isActive: true } },
      },
    });
    if (!mentor) {
      throw new Error("404 Not Found: Mentor profile not found for authenticated user");
    }
    return mentor;
  }

  // =========================================================================
  // 1. MENTOR DASHBOARD ACTION CENTER
  // =========================================================================

  public static async getMentorDashboard(session: SessionPayload) {
    const mentor = await this.getMentorProfile(session.userId);
    const now = new Date();

    const [
      allBookings,
      pendingRequests,
      servicesCount,
      transactions,
    ] = await Promise.all([
      db.booking.findMany({
        where: { mentorId: mentor.id },
        include: {
          student: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
          service: true,
          slot: true,
          payment: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      db.booking.findMany({
        where: {
          mentorId: mentor.id,
          status: "PENDING",
          bookingMode: "APPROVAL_REQUIRED",
        },
        include: {
          student: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
          service: true,
          slot: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      db.mentorService.count({
        where: { mentorId: mentor.id, status: "PUBLISHED" },
      }),
      db.mentorTransaction.findMany({
        where: { mentorId: mentor.id },
      }),
    ]);

    const upcomingSessions = allBookings.filter(
      (b) =>
        b.status === "CONFIRMED" &&
        b.slot &&
        new Date(b.slot.startTime) >= now
    );

    const completedSessions = allBookings.filter((b) => b.status === "COMPLETED");

    // Financial calculations
    const grossEarningsINR = transactions.reduce((sum, t) => sum + t.grossAmount, 0);
    const platformFeesINR = transactions.reduce((sum, t) => sum + t.platformFee, 0);
    const netMentorEarningsINR = transactions.reduce((sum, t) => sum + t.mentorAmount, 0);

    const completedNetEarnings = completedSessions.reduce(
      (sum, b) => sum + (b.payment?.mentorPayout || Math.round(b.amount * 0.8)),
      0
    );

    // Next upcoming session
    const nextSession = upcomingSessions.sort(
      (a, b) =>
        new Date(a.slot.startTime).getTime() - new Date(b.slot.startTime).getTime()
    )[0] || null;

    // Availability status
    const activeBreak = mentor.breaks.find(
      (b) => new Date(b.startDate) <= now && new Date(b.endDate) >= now
    );
    const availabilityStatus = activeBreak ? "ON_BREAK" : "AVAILABLE";

    return {
      mentor: {
        id: mentor.id,
        name: mentor.user.name,
        email: mentor.user.email,
        avatarUrl: mentor.user.avatarUrl,
        headline: mentor.headline,
        company: mentor.company,
        ratingAvg: mentor.ratingAvg,
        totalReviews: mentor.totalReviews,
      },
      summary: {
        upcomingCount: upcomingSessions.length,
        pendingRequestsCount: pendingRequests.length,
        completedCount: completedSessions.length,
        publishedServicesCount: servicesCount,
        grossEarningsINR: grossEarningsINR || completedNetEarnings + Math.round(completedNetEarnings * 0.25),
        netEarningsINR: netMentorEarningsINR || completedNetEarnings,
        platformFeesINR: platformFeesINR || Math.round(completedNetEarnings * 0.25),
        availableForPayoutINR: completedNetEarnings,
      },
      nextSession: nextSession
        ? {
            id: nextSession.id,
            studentName: nextSession.student.name,
            studentAvatar: nextSession.student.avatarUrl,
            serviceTitle: nextSession.service?.title || "1:1 Mentorship Session",
            startTime: nextSession.slot.startTime.toISOString(),
            endTime: nextSession.slot.endTime.toISOString(),
            meetingUrl: nextSession.meetingUrl || "https://meet.google.com/xyz-mentoree-session",
            status: nextSession.status,
            preSessionGoal: nextSession.preSessionGoal,
          }
        : null,
      pendingRequests: pendingRequests.map((pr) => ({
        id: pr.id,
        studentName: pr.student.name,
        studentEmail: pr.student.email,
        studentAvatar: pr.student.avatarUrl,
        serviceTitle: pr.service?.title || "Mentorship Session",
        requestedDate: pr.slot.startTime.toISOString(),
        amountINR: pr.amount,
        createdAt: pr.createdAt.toISOString(),
        preSessionGoal: pr.preSessionGoal,
      })),
      availabilityStatus: {
        status: availabilityStatus,
        timezone: mentor.workingHours?.timezone || "Asia/Kolkata",
        breakReason: activeBreak?.reason || null,
        breakEndsAt: activeBreak ? activeBreak.endDate.toISOString() : null,
      },
      recentBookings: allBookings.slice(0, 5).map((b) => ({
        id: b.id,
        studentName: b.student.name,
        studentAvatar: b.student.avatarUrl,
        serviceTitle: b.service?.title || "Mentorship",
        date: b.slot.startTime.toISOString(),
        status: b.status,
        amountINR: b.amount,
      })),
    };
  }

  // =========================================================================
  // 2. MENTOR BOOKINGS MANAGEMENT (UPCOMING, PENDING, COMPLETED, CANCELLED)
  // =========================================================================

  public static async listBookings(
    session: SessionPayload,
    tab?: "ALL" | "UPCOMING" | "PENDING" | "COMPLETED" | "CANCELLED",
    search?: string
  ) {
    const mentor = await this.getMentorProfile(session.userId);
    const now = new Date();

    let statusFilter: any = {};
    if (tab === "UPCOMING") {
      statusFilter = {
        status: "CONFIRMED",
        slot: { startTime: { gte: now } },
      };
    } else if (tab === "PENDING") {
      statusFilter = { status: "PENDING" };
    } else if (tab === "COMPLETED") {
      statusFilter = { status: "COMPLETED" };
    } else if (tab === "CANCELLED") {
      statusFilter = { status: "CANCELLED" };
    }

    const bookings = await db.booking.findMany({
      where: {
        mentorId: mentor.id,
        ...statusFilter,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            studentProfile: true,
          },
        },
        service: true,
        slot: true,
        payment: true,
        session: true,
        review: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return bookings;
  }

  /**
   * Get full booking detail for mentor
   */
  public static async getBookingDetail(session: SessionPayload, bookingId: string) {
    const mentor = await this.getMentorProfile(session.userId);

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        student: {
          include: {
            studentProfile: {
              include: {
                education: true,
                skills: true,
                goals: true,
              },
            },
          },
        },
        mentor: { include: { user: true } },
        service: { include: { serviceQuestions: true } },
        slot: true,
        payment: true,
        session: true,
        review: true,
        transaction: true,
      },
    });

    if (!booking) {
      throw new Error("404 Not Found: Booking not found");
    }

    if (booking.mentorId !== mentor.id && session.role !== "ADMIN") {
      throw new Error("403 Forbidden: You do not own this booking");
    }

    return booking;
  }

  /**
   * Accept an APPROVAL_REQUIRED booking request
   */
  public static async acceptBookingRequest(
    session: SessionPayload,
    bookingId: string
  ) {
    const booking = await this.getBookingDetail(session, bookingId);

    if (booking.status !== "PENDING") {
      throw new Error(`400 Bad Request: Only PENDING requests can be accepted (current: ${booking.status})`);
    }

    const meetUrl =
      booking.meetingUrl ||
      booking.mentor.meetingUrl ||
      `https://meet.google.com/mentoree-${booking.id.slice(0, 8)}`;

    const result = await db.$transaction(async (tx) => {
      // 1. Confirm booking
      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.CONFIRMED,
          meetingUrl: meetUrl,
        },
      });

      // 2. Lock slot permanently
      await tx.availabilitySlot.update({
        where: { id: booking.slotId },
        data: {
          status: SlotStatus.BOOKED,
          lockedByToken: null,
          lockExpiresAt: null,
        },
      });

      // 3. Create Session entity
      await tx.session.upsert({
        where: { bookingId: booking.id },
        create: {
          bookingId: booking.id,
          provider: "GOOGLE_MEET",
          meetingUrl: meetUrl,
          scheduledStart: booking.slot.startTime,
          scheduledEnd: booking.slot.endTime,
          status: "SCHEDULED",
        },
        update: {
          meetingUrl: meetUrl,
          scheduledStart: booking.slot.startTime,
          scheduledEnd: booking.slot.endTime,
          status: "SCHEDULED",
        },
      });

      // 4. Audit log
      await tx.auditLog.create({
        data: {
          mentorId: booking.mentorId,
          action: AuditAction.APPROVED,
          performedBy: session.email,
          details: `Mentor accepted booking request ${booking.id}`,
        },
      });

      return updatedBooking;
    });

    // Notify student
    await NotificationService.sendEmailNotification({
      userId: booking.studentId,
      to: booking.student.email,
      subject: `🎉 Booking Accepted by ${booking.mentor.user.name}!`,
      html: `<p>Your mentorship session on <strong>${booking.slot.startTime.toUTCString()}</strong> has been accepted by ${booking.mentor.user.name}.</p><p>Meeting Link: <a href="${meetUrl}">${meetUrl}</a></p>`,
      type: "BOOKING_CONFIRMED",
      payload: { bookingId: booking.id, meetUrl },
    });

    return {
      success: true,
      message: "Booking request accepted successfully",
      booking: result,
    };
  }

  /**
   * Decline an APPROVAL_REQUIRED booking request
   */
  public static async declineBookingRequest(
    session: SessionPayload,
    bookingId: string,
    reason: string
  ) {
    const booking = await this.getBookingDetail(session, bookingId);

    if (booking.status !== "PENDING") {
      throw new Error(`400 Bad Request: Only PENDING requests can be declined (current: ${booking.status})`);
    }

    await db.$transaction([
      db.booking.update({
        where: { id: booking.id },
        data: {
          status: BookingStatus.CANCELLED,
          cancellationReason: `Declined by mentor: ${reason}`,
        },
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
          action: AuditAction.REJECTED,
          performedBy: session.email,
          details: `Mentor declined booking request ${booking.id}. Reason: ${reason}`,
        },
      }),
    ]);

    // Send notification
    await NotificationService.sendEmailNotification({
      userId: booking.studentId,
      to: booking.student.email,
      subject: `Booking Request Update from ${booking.mentor.user.name}`,
      html: `<p>Your booking request could not be accepted at this time. Reason: ${reason}</p>`,
      type: "BOOKING_CANCELLED",
      payload: { bookingId: booking.id, reason },
    });

    return { success: true, message: "Booking request declined" };
  }

  /**
   * Mark student or mentor as No-Show
   */
  public static async markNoShow(
    session: SessionPayload,
    bookingId: string,
    party: "STUDENT" | "MENTOR",
    notes?: string
  ) {
    const booking = await this.getBookingDetail(session, bookingId);

    const statusString = party === "STUDENT" ? "NO_SHOW_STUDENT" : "NO_SHOW_MENTOR";

    await db.$transaction([
      db.session.upsert({
        where: { bookingId: booking.id },
        create: {
          bookingId: booking.id,
          provider: "GOOGLE_MEET",
          scheduledStart: booking.slot.startTime,
          scheduledEnd: booking.slot.endTime,
          status: statusString,
          mentorNotes: notes || null,
        },
        update: {
          status: statusString,
          mentorNotes: notes || null,
        },
      }),
      db.auditLog.create({
        data: {
          mentorId: booking.mentorId,
          action: AuditAction.APPROVED,
          performedBy: session.email,
          details: `Marked session ${booking.id} as ${statusString}. Notes: ${notes || "None"}`,
        },
      }),
    ]);

    return { success: true, message: `Session marked as ${statusString}` };
  }

  // =========================================================================
  // 3. MENTOR EARNINGS & TRANSACTIONS
  // =========================================================================

  public static async getMentorEarnings(session: SessionPayload) {
    const mentor = await this.getMentorProfile(session.userId);

    const [transactions, completedBookings, payouts] = await Promise.all([
      db.mentorTransaction.findMany({
        where: { mentorId: mentor.id },
        include: { booking: { include: { student: true, service: true } } },
        orderBy: { createdAt: "desc" },
      }),
      db.booking.findMany({
        where: { mentorId: mentor.id, status: "COMPLETED" },
        include: { payment: true, student: true, service: true },
        orderBy: { updatedAt: "desc" },
      }),
      db.payout.findMany({
        where: { mentorId: mentor.id },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Financial totals
    const grossEarningsINR = completedBookings.reduce(
      (sum, b) => sum + (b.payment?.amount || b.amount),
      0
    );

    const platformFeesINR = completedBookings.reduce(
      (sum, b) => sum + (b.payment?.platformFee || Math.round(b.amount * 0.2)),
      0
    );

    const netMentorEarningsINR = completedBookings.reduce(
      (sum, b) => sum + (b.payment?.mentorPayout || Math.round(b.amount * 0.8)),
      0
    );

    const paidPayouts = payouts
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingPayouts = payouts
      .filter((p) => p.status === "PENDING")
      .reduce((sum, p) => sum + p.amount, 0);

    const availableForPayoutINR = netMentorEarningsINR - paidPayouts;

    return {
      overview: {
        grossEarningsINR,
        platformFeesINR,
        netMentorEarningsINR,
        availableForPayoutINR: Math.max(0, availableForPayoutINR),
        pendingPayoutINR: pendingPayouts,
        paidPayoutsINR: paidPayouts,
        completedSessionsCount: completedBookings.length,
      },
      transactions: transactions.map((t) => ({
        id: t.id,
        bookingId: t.bookingId,
        studentName: t.booking.student.name,
        serviceTitle: t.booking.service?.title || "Mentorship Session",
        grossAmount: t.grossAmount,
        platformFee: t.platformFee,
        mentorAmount: t.mentorAmount,
        currency: t.currency,
        status: t.status,
        date: t.createdAt.toISOString(),
      })),
      payouts: payouts.map((p) => ({
        id: p.id,
        amount: p.amount,
        status: p.status,
        paidAt: p.paidAt ? p.paidAt.toISOString() : null,
        createdAt: p.createdAt.toISOString(),
      })),
    };
  }
}
