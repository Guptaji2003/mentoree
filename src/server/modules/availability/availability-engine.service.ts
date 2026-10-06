import { db } from "@/server/db";
import { SessionPayload } from "../auth/auth.service";
import {
  UpdateWorkingHoursInput,
  UpdateSchedulingRulesInput,
  CreateBlockedDateInput,
  SetMentorBreakInput,
  SetServiceOverrideInput,
} from "./availability-engine.schema";

const DEFAULT_WEEKLY_SCHEDULE = [
  {
    day: "MONDAY",
    enabled: true,
    intervals: [{ start: "10:00", end: "18:00" }],
  },
  {
    day: "TUESDAY",
    enabled: true,
    intervals: [{ start: "10:00", end: "18:00" }],
  },
  {
    day: "WEDNESDAY",
    enabled: true,
    intervals: [{ start: "10:00", end: "18:00" }],
  },
  {
    day: "THURSDAY",
    enabled: true,
    intervals: [{ start: "10:00", end: "18:00" }],
  },
  {
    day: "FRIDAY",
    enabled: true,
    intervals: [{ start: "10:00", end: "18:00" }],
  },
  {
    day: "SATURDAY",
    enabled: false,
    intervals: [{ start: "10:00", end: "14:00" }],
  },
  {
    day: "SUNDAY",
    enabled: false,
    intervals: [{ start: "10:00", end: "14:00" }],
  },
];

export class AvailabilityEngineService {
  /**
   * Helper to fetch the mentor profile for the current user
   */
  public static async getMentorProfile(userId: string) {
    const mentor = await db.mentorProfile.findUnique({
      where: { userId },
    });
    if (!mentor) {
      throw new Error("404 Not Found: Mentor profile not found");
    }
    return mentor;
  }

  // =========================================================================
  // 1. WORKING HOURS & TIMEZONE
  // =========================================================================

  public static async getWorkingHours(session: SessionPayload) {
    const mentor = await this.getMentorProfile(session.userId);

    let workingHours = await db.mentorWorkingHours.findUnique({
      where: { mentorId: mentor.id },
    });

    if (!workingHours) {
      workingHours = await db.mentorWorkingHours.create({
        data: {
          mentorId: mentor.id,
          timezone: "Asia/Kolkata",
          weeklySchedule: DEFAULT_WEEKLY_SCHEDULE,
        },
      });
    }

    return workingHours;
  }

  public static async updateWorkingHours(
    session: SessionPayload,
    input: UpdateWorkingHoursInput
  ) {
    const mentor = await this.getMentorProfile(session.userId);

    return db.mentorWorkingHours.upsert({
      where: { mentorId: mentor.id },
      create: {
        mentorId: mentor.id,
        timezone: input.timezone || "Asia/Kolkata",
        weeklySchedule: input.weeklySchedule as any,
      },
      update: {
        timezone: input.timezone || "Asia/Kolkata",
        weeklySchedule: input.weeklySchedule as any,
      },
    });
  }

  // =========================================================================
  // 2. SCHEDULING RULES
  // =========================================================================

  public static async getSchedulingRules(session: SessionPayload) {
    const mentor = await this.getMentorProfile(session.userId);

    let rules = await db.schedulingRule.findUnique({
      where: { mentorId: mentor.id },
    });

    if (!rules) {
      rules = await db.schedulingRule.create({
        data: {
          mentorId: mentor.id,
          minNoticeHours: 12,
          maxFutureBookingDays: 30,
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: 15,
          slotIntervalMinutes: 30,
          maxBookingsPerDay: 4,
          maxBookingsPerWeek: 20,
        },
      });
    }

    return rules;
  }

  public static async updateSchedulingRules(
    session: SessionPayload,
    input: UpdateSchedulingRulesInput
  ) {
    const mentor = await this.getMentorProfile(session.userId);

    return db.schedulingRule.upsert({
      where: { mentorId: mentor.id },
      create: {
        mentorId: mentor.id,
        minNoticeHours: input.minNoticeHours,
        maxFutureBookingDays: input.maxFutureBookingDays,
        bufferBeforeMinutes: input.bufferBeforeMinutes,
        bufferAfterMinutes: input.bufferAfterMinutes,
        slotIntervalMinutes: input.slotIntervalMinutes,
        maxBookingsPerDay: input.maxBookingsPerDay || null,
        maxBookingsPerWeek: input.maxBookingsPerWeek || null,
      },
      update: {
        minNoticeHours: input.minNoticeHours,
        maxFutureBookingDays: input.maxFutureBookingDays,
        bufferBeforeMinutes: input.bufferBeforeMinutes,
        bufferAfterMinutes: input.bufferAfterMinutes,
        slotIntervalMinutes: input.slotIntervalMinutes,
        maxBookingsPerDay: input.maxBookingsPerDay || null,
        maxBookingsPerWeek: input.maxBookingsPerWeek || null,
      },
    });
  }

  // =========================================================================
  // 3. BLOCKED DATES
  // =========================================================================

  public static async getBlockedDates(session: SessionPayload) {
    const mentor = await this.getMentorProfile(session.userId);

    return db.blockedDate.findMany({
      where: { mentorId: mentor.id },
      orderBy: { startDate: "asc" },
    });
  }

  public static async createBlockedDate(
    session: SessionPayload,
    input: CreateBlockedDateInput
  ) {
    const mentor = await this.getMentorProfile(session.userId);

    return db.blockedDate.create({
      data: {
        mentorId: mentor.id,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        startTime: input.startTime || null,
        endTime: input.endTime || null,
        reason: input.reason || "VACATION",
        notes: input.notes || null,
      },
    });
  }

  public static async deleteBlockedDate(session: SessionPayload, id: string) {
    const mentor = await this.getMentorProfile(session.userId);

    const blocked = await db.blockedDate.findUnique({
      where: { id },
    });

    if (!blocked || blocked.mentorId !== mentor.id) {
      throw new Error("404 Not Found: Blocked date record not found");
    }

    await db.blockedDate.delete({ where: { id } });
    return { success: true, message: "Blocked date removed" };
  }

  // =========================================================================
  // 4. TAKE A BREAK / PAUSE AVAILABILITY
  // =========================================================================

  public static async getBreaks(session: SessionPayload) {
    const mentor = await this.getMentorProfile(session.userId);

    return db.mentorBreak.findMany({
      where: { mentorId: mentor.id },
      orderBy: { startDate: "desc" },
    });
  }

  public static async setBreak(session: SessionPayload, input: SetMentorBreakInput) {
    const mentor = await this.getMentorProfile(session.userId);

    return db.mentorBreak.create({
      data: {
        mentorId: mentor.id,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        reason: input.reason || null,
        breakType: input.breakType || "VACATION",
        isActive: input.isActive !== undefined ? input.isActive : true,
      },
    });
  }

  public static async toggleBreakStatus(
    session: SessionPayload,
    breakId: string,
    isActive: boolean
  ) {
    const mentor = await this.getMentorProfile(session.userId);

    const b = await db.mentorBreak.findUnique({ where: { id: breakId } });
    if (!b || b.mentorId !== mentor.id) {
      throw new Error("404 Not Found: Break record not found");
    }

    return db.mentorBreak.update({
      where: { id: breakId },
      data: { isActive },
    });
  }

  public static async deleteBreak(session: SessionPayload, breakId: string) {
    const mentor = await this.getMentorProfile(session.userId);

    const b = await db.mentorBreak.findUnique({ where: { id: breakId } });
    if (!b || b.mentorId !== mentor.id) {
      throw new Error("404 Not Found: Break record not found");
    }

    await db.mentorBreak.delete({ where: { id: breakId } });
    return { success: true, message: "Break period deleted" };
  }

  // =========================================================================
  // 5. SERVICE-SPECIFIC AVAILABILITY OVERRIDES
  // =========================================================================

  public static async getServiceOverrides(session: SessionPayload) {
    const mentor = await this.getMentorProfile(session.userId);

    return db.serviceAvailabilityOverride.findMany({
      where: { mentorId: mentor.id },
      include: { service: true },
    });
  }

  public static async setServiceOverride(
    session: SessionPayload,
    input: SetServiceOverrideInput
  ) {
    const mentor = await this.getMentorProfile(session.userId);

    return db.serviceAvailabilityOverride.upsert({
      where: {
        mentorId_serviceId: {
          mentorId: mentor.id,
          serviceId: input.serviceId,
        },
      },
      create: {
        mentorId: mentor.id,
        serviceId: input.serviceId,
        weeklySchedule: input.weeklySchedule as any,
        isActive: input.isActive,
      },
      update: {
        weeklySchedule: input.weeklySchedule as any,
        isActive: input.isActive,
      },
      include: { service: true },
    });
  }

  public static async deleteServiceOverride(session: SessionPayload, overrideId: string) {
    const mentor = await this.getMentorProfile(session.userId);

    const ov = await db.serviceAvailabilityOverride.findUnique({
      where: { id: overrideId },
    });
    if (!ov || ov.mentorId !== mentor.id) {
      throw new Error("404 Not Found: Service override not found");
    }

    await db.serviceAvailabilityOverride.delete({ where: { id: overrideId } });
    return { success: true, message: "Service override removed" };
  }

  // =========================================================================
  // 6. CALENDAR INTEGRATION & SYNC
  // =========================================================================

  public static async getCalendarConnections(session: SessionPayload) {
    const mentor = await this.getMentorProfile(session.userId);

    let connections = await db.calendarConnection.findMany({
      where: { mentorId: mentor.id },
    });

    if (connections.length === 0) {
      // Default initial mock connection
      const initial = await db.calendarConnection.create({
        data: {
          mentorId: mentor.id,
          provider: "GOOGLE_CALENDAR",
          email: session.email,
          syncEnabled: true,
          lastSyncAt: new Date(),
        },
      });
      connections = [initial];
    }

    return connections;
  }

  public static async toggleCalendarSync(
    session: SessionPayload,
    connectionId: string,
    syncEnabled: boolean
  ) {
    const mentor = await this.getMentorProfile(session.userId);

    const conn = await db.calendarConnection.findUnique({
      where: { id: connectionId },
    });
    if (!conn || conn.mentorId !== mentor.id) {
      throw new Error("404 Not Found: Calendar connection not found");
    }

    return db.calendarConnection.update({
      where: { id: connectionId },
      data: {
        syncEnabled,
        lastSyncAt: new Date(),
      },
    });
  }

  // =========================================================================
  // 7. CORE ENGINE: CALCULATE REAL AVAILABLE BOOKING SLOTS
  // =========================================================================

  /**
   * Calculates live, authoritative bookable slots dynamically.
   * Logic:
   * 1. Mentor Working Hours ∩ Service Override
   * 2. Exclude Active Breaks
   * 3. Exclude Blocked Dates
   * 4. Exclude Existing Confirmed Bookings (with before/after buffers)
   * 5. Exclude Active Slot Holds
   * 6. Apply Minimum Notice hours
   * 7. Apply Maximum Future Booking Window
   * 8. Apply Service Duration & Slot Interval
   */
  public static async calculateAvailableSlots(params: {
    mentorId: string;
    serviceId?: string;
    targetTimezone?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const { mentorId, serviceId } = params;

    // 1. Fetch Mentor Profile, Working Hours, Rules, Blocked Dates, Breaks, Overrides
    const mentor = await db.mentorProfile.findUnique({
      where: { id: mentorId },
      include: {
        workingHours: true,
        schedulingRule: true,
        blockedDates: true,
        breaks: { where: { isActive: true } },
        serviceOverrides: serviceId ? { where: { serviceId, isActive: true } } : false,
      },
    });

    if (!mentor) {
      throw new Error("404 Not Found: Mentor not found");
    }

    // 2. Fetch Service Details (for duration)
    let serviceDurationMinutes = 60;
    if (serviceId) {
      const service = await db.mentorService.findUnique({
        where: { id: serviceId },
      });
      if (service) {
        if (service.status !== "PUBLISHED") {
          return {
            available: false,
            reason: "This service is currently unavailable for bookings.",
            slots: [],
          };
        }
        serviceDurationMinutes = service.durationMinutes || 60;
      }
    }

    const now = new Date();

    // 3. Check if mentor is currently on active break
    const activeBreak = mentor.breaks.find(
      (b) => new Date(b.startDate) <= now && new Date(b.endDate) >= now
    );

    if (activeBreak) {
      return {
        available: false,
        reason: `Mentor is currently taking a break (${activeBreak.reason || "Away"}) until ${new Date(
          activeBreak.endDate
        ).toLocaleDateString()}`,
        slots: [],
      };
    }

    // 4. Scheduling Rules
    const rules = mentor.schedulingRule || {
      minNoticeHours: 12,
      maxFutureBookingDays: 30,
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 15,
      slotIntervalMinutes: 30,
      maxBookingsPerDay: 4,
    };

    const minNoticeMs = rules.minNoticeHours * 60 * 60 * 1000;
    const earliestBookableTime = new Date(now.getTime() + minNoticeMs);

    const maxFutureMs = rules.maxFutureBookingDays * 24 * 60 * 60 * 1000;
    const latestBookableTime = new Date(now.getTime() + maxFutureMs);

    // 5. Working Hours & Schedule to use (Service Override takes precedence if active)
    let weeklySchedule = DEFAULT_WEEKLY_SCHEDULE;
    if (
      mentor.serviceOverrides &&
      mentor.serviceOverrides.length > 0 &&
      mentor.serviceOverrides[0].isActive
    ) {
      weeklySchedule = mentor.serviceOverrides[0].weeklySchedule as any;
    } else if (mentor.workingHours && mentor.workingHours.weeklySchedule) {
      weeklySchedule = mentor.workingHours.weeklySchedule as any;
    }

    const timezone =
      params.targetTimezone ||
      mentor.workingHours?.timezone ||
      "Asia/Kolkata";

    // 6. Fetch Existing Confirmed Bookings and Active Holds in this range
    const existingBookings = await db.booking.findMany({
      where: {
        mentorId: mentor.id,
        status: { in: ["CONFIRMED", "PENDING"] },
        slot: {
          startTime: { gte: earliestBookableTime, lte: latestBookableTime },
        },
      },
      include: { slot: true },
    });

    const activeHolds = await db.availabilitySlot.findMany({
      where: {
        mentorId: mentor.id,
        status: "HELD",
        lockExpiresAt: { gt: now },
        startTime: { gte: earliestBookableTime, lte: latestBookableTime },
      },
    });

    // 7. Days mapping helper
    const daysMap: Record<number, string> = {
      0: "SUNDAY",
      1: "MONDAY",
      2: "TUESDAY",
      3: "WEDNESDAY",
      4: "THURSDAY",
      5: "FRIDAY",
      6: "SATURDAY",
    };

    const slots: Array<{
      id: string;
      startTime: string;
      endTime: string;
      displayDate: string;
      displayTime: string;
      durationMinutes: number;
      timezone: string;
    }> = [];

    // 8. Generate dynamic slots over the next `maxFutureBookingDays`
    const durationMs = serviceDurationMinutes * 60 * 1000;
    const intervalMs = rules.slotIntervalMinutes * 60 * 1000;
    const bufferBeforeMs = rules.bufferBeforeMinutes * 60 * 1000;
    const bufferAfterMs = rules.bufferAfterMinutes * 60 * 1000;

    const daysToScan = Math.min(rules.maxFutureBookingDays, 30);
    const currentDate = new Date(now);

    for (let dayOffset = 0; dayOffset < daysToScan; dayOffset++) {
      const targetDay = new Date(currentDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);
      const dayOfWeekName = daysMap[targetDay.getUTCDay()];

      const dayConfig = weeklySchedule.find((d) => d.day === dayOfWeekName);
      if (!dayConfig || !dayConfig.enabled) {
        continue;
      }

      // Check if this date falls within a Blocked Date
      const isDateBlocked = mentor.blockedDates.some((bd) => {
        const bStart = new Date(bd.startDate);
        const bEnd = new Date(bd.endDate);
        return targetDay >= bStart && targetDay <= bEnd && !bd.startTime;
      });

      if (isDateBlocked) {
        continue;
      }

      // Count bookings on this day to enforce maxBookingsPerDay
      const bookingsOnThisDay = existingBookings.filter((b) => {
        const bDate = new Date(b.slot.startTime);
        return (
          bDate.getUTCFullYear() === targetDay.getUTCFullYear() &&
          bDate.getUTCMonth() === targetDay.getUTCMonth() &&
          bDate.getUTCDate() === targetDay.getUTCDate()
        );
      }).length;

      if (
        rules.maxBookingsPerDay &&
        bookingsOnThisDay >= rules.maxBookingsPerDay
      ) {
        continue;
      }

      // Process all intervals in this day
      for (const interval of dayConfig.intervals) {
        const [startH, startM] = interval.start.split(":").map(Number);
        const [endH, endM] = interval.end.split(":").map(Number);

        const windowStart = new Date(targetDay);
        windowStart.setUTCHours(startH, startM, 0, 0);

        const windowEnd = new Date(targetDay);
        windowEnd.setUTCHours(endH, endM, 0, 0);

        let slotCursor = new Date(windowStart);

        while (slotCursor.getTime() + durationMs <= windowEnd.getTime()) {
          const slotEnd = new Date(slotCursor.getTime() + durationMs);

          // Must satisfy minimum notice and max window
          if (
            slotCursor >= earliestBookableTime &&
            slotEnd <= latestBookableTime
          ) {
            // Check conflict with existing bookings (including buffers)
            const hasBookingConflict = existingBookings.some((b) => {
              const bStart = new Date(
                new Date(b.slot.startTime).getTime() - bufferBeforeMs
              );
              const bEnd = new Date(
                new Date(b.slot.endTime).getTime() + bufferAfterMs
              );
              return slotCursor < bEnd && slotEnd > bStart;
            });

            // Check conflict with active 10-min holds
            const hasHoldConflict = activeHolds.some((h) => {
              const hStart = new Date(h.startTime);
              const hEnd = new Date(h.endTime);
              return slotCursor < hEnd && slotEnd > hStart;
            });

            // Check partial blocked date hours
            const hasBlockedTimeConflict = mentor.blockedDates.some((bd) => {
              if (!bd.startTime || !bd.endTime) return false;
              const [bStartH, bStartM] = bd.startTime.split(":").map(Number);
              const [bEndH, bEndM] = bd.endTime.split(":").map(Number);

              const bTimeStart = new Date(targetDay);
              bTimeStart.setUTCHours(bStartH, bStartM, 0, 0);

              const bTimeEnd = new Date(targetDay);
              bTimeEnd.setUTCHours(bEndH, bEndM, 0, 0);

              return slotCursor < bTimeEnd && slotEnd > bTimeStart;
            });

            if (
              !hasBookingConflict &&
              !hasHoldConflict &&
              !hasBlockedTimeConflict
            ) {
              const slotId = `slot_${mentor.id.slice(0, 6)}_${slotCursor.getTime()}`;

              const displayDate = slotCursor.toLocaleDateString("en-IN", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });

              const displayTime = `${slotCursor.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })} – ${slotEnd.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}`;

              slots.push({
                id: slotId,
                startTime: slotCursor.toISOString(),
                endTime: slotEnd.toISOString(),
                displayDate,
                displayTime,
                durationMinutes: serviceDurationMinutes,
                timezone,
              });
            }
          }

          slotCursor = new Date(slotCursor.getTime() + intervalMs);
        }
      }
    }

    return {
      available: true,
      timezone,
      count: slots.length,
      slots,
    };
  }
}
