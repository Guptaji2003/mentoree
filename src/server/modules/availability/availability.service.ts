import crypto from "crypto";
import { db } from "@/server/db";
import { SlotStatus, BookingStatus, AuditAction } from "@prisma/client";
import { CreateCustomSlotInput, CreateRecurringSlotsInput, HoldSlotInput } from "./availability.schema";

export class AvailabilityService {
  /**
   * Create a single custom availability slot (Mentor only)
   * Enforces no overlapping slots and UTC storage
   */
  public static async createCustomSlot(userId: string, input: CreateCustomSlotInput) {
    const mentor = await db.mentorProfile.findUnique({
      where: { userId },
    });

    if (!mentor) {
      throw new Error("404 Not Found: Mentor profile not found");
    }

    const start = new Date(input.startTime);
    const end = new Date(input.endTime);

    if (start <= new Date()) {
      throw new Error("400 Bad Request: Slot start time must be in the future");
    }

    // Check for overlapping slots
    const overlap = await db.availabilitySlot.findFirst({
      where: {
        mentorId: mentor.id,
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } },
        ],
      },
    });

    if (overlap) {
      throw new Error("409 Conflict: An availability slot already overlaps with the requested time window");
    }

    return db.availabilitySlot.create({
      data: {
        mentorId: mentor.id,
        startTime: start,
        endTime: end,
        status: SlotStatus.AVAILABLE,
      },
    });
  }

  /**
   * Batch create recurring slots (e.g. Every Mon/Wed/Fri from 10:00 to 12:00 in 30/60m chunks)
   */
  public static async createRecurringSlots(userId: string, input: CreateRecurringSlotsInput) {
    const mentor = await db.mentorProfile.findUnique({
      where: { userId },
    });

    if (!mentor) {
      throw new Error("404 Not Found: Mentor profile not found");
    }

    const [startH, startM] = input.dailyStartTime.split(":").map(Number);
    const [endH, endM] = input.dailyEndTime.split(":").map(Number);
    const durationMs = input.slotDurationMinutes * 60 * 1000;

    const startDate = new Date(input.startDate + "T00:00:00Z");
    const endDate = new Date(input.endDate + "T23:59:59Z");
    const now = new Date();

    const createdSlots = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getUTCDay();
      if (input.daysOfWeek.includes(dayOfWeek)) {
        const windowStart = new Date(currentDate);
        windowStart.setUTCHours(startH, startM, 0, 0);

        const windowEnd = new Date(currentDate);
        windowEnd.setUTCHours(endH, endM, 0, 0);

        let slotCursor = new Date(windowStart);
        while (slotCursor.getTime() + durationMs <= windowEnd.getTime()) {
          const slotEnd = new Date(slotCursor.getTime() + durationMs);

          if (slotCursor > now) {
            // Check existing overlap
            const overlap = await db.availabilitySlot.findFirst({
              where: {
                mentorId: mentor.id,
                AND: [
                  { startTime: { lt: slotEnd } },
                  { endTime: { gt: slotCursor } },
                ],
              },
            });

            if (!overlap) {
              const newSlot = await db.availabilitySlot.create({
                data: {
                  mentorId: mentor.id,
                  startTime: slotCursor,
                  endTime: slotEnd,
                  status: SlotStatus.AVAILABLE,
                },
              });
              createdSlots.push(newSlot);
            }
          }

          slotCursor = new Date(slotCursor.getTime() + durationMs);
        }
      }
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return {
      count: createdSlots.length,
      slots: createdSlots,
    };
  }

  /**
   * Atomic Slot Hold with Postgres Invariants (10-minute hold)
   * Invariant 1: Student CANNOT hold their own mentor slot.
   * Invariant 2: Concurrency safe: exactly one student wins the slot hold.
   * Invariant 3: Booking is created in status HELD in the same transaction.
   */
  public static async holdSlot(studentId: string, slotId: string, input: HoldSlotInput, ipAddress?: string) {
    // 1. Fetch slot & mentor profile
    const slot = await db.availabilitySlot.findUnique({
      where: { id: slotId },
      include: { mentor: true },
    });

    if (!slot) {
      throw new Error("404 Not Found: Availability slot does not exist");
    }

    // Invariant: Student cannot hold their own mentor's slot
    if (slot.mentor.userId === studentId) {
      throw new Error("403 Forbidden: You cannot book or hold your own mentorship slot");
    }

    // 2. Fetch service to derive server-authoritative price
    const service = await db.mentorService.findUnique({
      where: { id: input.serviceId },
    });

    if (!service || service.mentorId !== slot.mentorId) {
      throw new Error("400 Bad Request: Invalid mentorship service selected for this mentor");
    }

    const reservationToken = "res_token_" + crypto.randomBytes(16).toString("hex");
    const lockExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes in UTC
    const now = new Date();

    // 3. Execute Atomic Postgres Hold
    // A slot can be held if it is AVAILABLE, OR if it is HELD with lockExpiresAt in the past
    const result = await db.$transaction(async (tx) => {
      // Atomic update matching Postgres criteria
      const updateResult = await tx.availabilitySlot.updateMany({
        where: {
          id: slotId,
          OR: [
            { status: SlotStatus.AVAILABLE },
            {
              status: SlotStatus.HELD,
              lockExpiresAt: { lt: now },
            },
          ],
        },
        data: {
          status: SlotStatus.HELD,
          lockedByToken: reservationToken,
          lockExpiresAt: lockExpiresAt,
        },
      });

      if (updateResult.count === 0) {
        throw new Error("409 Conflict: Slot is currently locked or booked by another student. Please select an alternate slot.");
      }

      // If an expired held booking existed on this slot, mark it as FAILED
      await tx.booking.updateMany({
        where: {
          slotId: slotId,
          status: BookingStatus.HELD,
        },
        data: {
          status: BookingStatus.FAILED,
        },
      });

      // Create new Booking in HELD status
      const booking = await tx.booking.create({
        data: {
          studentId,
          mentorId: slot.mentorId,
          slotId: slot.id,
          serviceId: service.id,
          status: BookingStatus.HELD,
          amount: service.priceINR, // Server-decided price!
          reservationToken,
          preSessionGoal: input.preSessionGoal,
          preSessionQuestions: input.preSessionQuestions,
          preSessionResumeUrl: input.preSessionResumeUrl || null,
        },
      });

      await tx.auditLog.create({
        data: {
          mentorId: slot.mentorId,
          action: AuditAction.SLOT_HELD,
          performedBy: studentId,
          details: `Held slot ${slot.id} for 10 minutes. Booking ID: ${booking.id}`,
          ipAddress: ipAddress || null,
        },
      });

      return { booking, slot };
    });

    return {
      success: true,
      bookingId: result.booking.id,
      reservationToken,
      expiresAt: lockExpiresAt.toISOString(),
      expiresAtTimestamp: lockExpiresAt.getTime(),
      amountINR: service.priceINR,
      slot: {
        id: slot.id,
        startTime: slot.startTime.toISOString(),
        endTime: slot.endTime.toISOString(),
      },
    };
  }

  /**
   * Release Expired Holds (Invoked by cron or background worker)
   * Correctness does not rely on this, but cleans up DB state and marks bookings FAILED.
   */
  public static async releaseExpiredHolds() {
    const now = new Date();

    const expiredSlots = await db.availabilitySlot.findMany({
      where: {
        status: SlotStatus.HELD,
        lockExpiresAt: { lt: now },
      },
      select: { id: true, mentorId: true },
    });

    if (expiredSlots.length === 0) {
      return { releasedCount: 0 };
    }

    const slotIds = expiredSlots.map((s) => s.id);

    await db.$transaction([
      db.availabilitySlot.updateMany({
        where: { id: { in: slotIds }, status: SlotStatus.HELD },
        data: {
          status: SlotStatus.AVAILABLE,
          lockedByToken: null,
          lockExpiresAt: null,
        },
      }),
      db.booking.updateMany({
        where: { slotId: { in: slotIds }, status: BookingStatus.HELD },
        data: { status: BookingStatus.FAILED },
      }),
      ...expiredSlots.map((s) =>
        db.auditLog.create({
          data: {
            mentorId: s.mentorId,
            action: AuditAction.SLOT_RELEASED,
            performedBy: "system:cron:release-holds",
            details: `Auto-released expired hold on slot ${s.id}`,
          },
        })
      ),
    ]);

    return { releasedCount: expiredSlots.length, releasedSlotIds: slotIds };
  }

  /**
   * List slots for a mentor
   */
  public static async getMentorSlots(mentorId: string) {
    return db.availabilitySlot.findMany({
      where: {
        mentorId,
        startTime: { gte: new Date() },
      },
      orderBy: { startTime: "asc" },
    });
  }
}
