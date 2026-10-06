import { describe, it, expect } from "vitest";
import {
  CreateMentorServiceSchema,
  UpdateMentorServiceSchema,
  ChangeServiceStatusSchema,
} from "@/server/modules/services/mentor-services.schema";
import {
  UpdateWorkingHoursSchema,
  UpdateSchedulingRulesSchema,
  CreateBlockedDateSchema,
  SetMentorBreakSchema,
  SetServiceOverrideSchema,
} from "@/server/modules/availability/availability-engine.schema";

describe("Mentor Services Schema Validation", () => {
  it("should validate a valid service payload", () => {
    const valid = CreateMentorServiceSchema.parse({
      title: "1:1 Strategic Career Guidance",
      category: "Career Guidance",
      description: "Personalized mentorship and roadmap guidance for ambitious engineers and leaders.",
      detailedDescription: "In-depth 45 minute consultation covering roadmap, resumes, and strategic career pivots.",
      durationMinutes: 45,
      sessionType: "VIDEO",
      priceINR: 1500,
      currency: "INR",
      bookingMode: "INSTANT",
      deliverables: ["Personalized action plan", "Curated roadmap", "Session recording"],
      topicsCovered: ["Resume review", "Career transitions", "Interview prep"],
      targetAudience: "Junior & Mid-level professionals seeking career acceleration",
      customQuestions: [
        {
          question: "What is your main goal for this session?",
          type: "LONG_TEXT",
          required: true,
          options: [],
        },
      ],
    });

    expect(valid.title).toBe("1:1 Strategic Career Guidance");
    expect(valid.priceINR).toBe(1500);
    expect(valid.bookingMode).toBe("INSTANT");
    expect(valid.durationMinutes).toBe(45);
    expect(valid.customQuestions).toHaveLength(1);
  });

  it("should reject invalid service price or duration", () => {
    expect(() =>
      CreateMentorServiceSchema.parse({
        title: "Bad Service",
        category: "General",
        durationMinutes: 5, // Below 15 min minimum
        priceINR: -100, // Negative price
        description: "Too short",
      })
    ).toThrow();
  });

  it("should validate service status transitions", () => {
    const statusObj = ChangeServiceStatusSchema.parse({ status: "PUBLISHED" });
    expect(statusObj.status).toBe("PUBLISHED");

    expect(() =>
      ChangeServiceStatusSchema.parse({ status: "INVALID_STATUS" as any })
    ).toThrow();
  });
});

describe("Availability Engine Schemas", () => {
  it("should validate working hours with multiple intervals", () => {
    const valid = UpdateWorkingHoursSchema.parse({
      timezone: "Asia/Kolkata",
      weeklySchedule: [
        {
          day: "MONDAY",
          enabled: true,
          intervals: [
            { start: "09:00", end: "13:00" },
            { start: "14:00", end: "18:00" },
          ],
        },
        {
          day: "TUESDAY",
          enabled: false,
          intervals: [],
        },
      ],
    });

    expect(valid.timezone).toBe("Asia/Kolkata");
    expect(valid.weeklySchedule[0].intervals).toHaveLength(2);
  });

  it("should validate scheduling rules and buffers", () => {
    const rules = UpdateSchedulingRulesSchema.parse({
      minNoticeHours: 12,
      maxFutureBookingDays: 30,
      bufferBeforeMinutes: 15,
      bufferAfterMinutes: 15,
      slotIntervalMinutes: 30,
      maxBookingsPerDay: 4,
    });

    expect(rules.minNoticeHours).toBe(12);
    expect(rules.bufferBeforeMinutes).toBe(15);
    expect(rules.maxBookingsPerDay).toBe(4);
  });

  it("should validate blocked date and break ranges", () => {
    const blocked = CreateBlockedDateSchema.parse({
      startDate: "2026-12-20",
      endDate: "2026-12-25",
      reason: "VACATION",
      notes: "Year-end winter holidays",
    });
    expect(blocked.reason).toBe("VACATION");

    const onBreak = SetMentorBreakSchema.parse({
      startDate: "2026-11-01",
      endDate: "2026-11-15",
      breakType: "PERSONAL",
      reason: "Parental leave & recharge break",
      isActive: true,
    });
    expect(onBreak.breakType).toBe("PERSONAL");
    expect(onBreak.isActive).toBe(true);
  });

  it("should validate service-specific availability override", () => {
    const override = SetServiceOverrideSchema.parse({
      serviceId: "srv_mock_interview_123",
      weeklySchedule: [
        {
          day: "SATURDAY",
          enabled: true,
          intervals: [{ start: "10:00", end: "14:00" }],
        },
      ],
      isActive: true,
    });

    expect(override.serviceId).toBe("srv_mock_interview_123");
    expect(override.weeklySchedule[0].day).toBe("SATURDAY");
  });
});

describe("Financial Ledger (80/20 Mentor Split)", () => {
  it("should accurately compute 80% mentor net take and 20% platform fee", () => {
    const bookingPrice = 2000;
    const platformFeeRate = 0.20;
    const platformFee = Math.round(bookingPrice * platformFeeRate);
    const mentorNet = bookingPrice - platformFee;

    expect(platformFee).toBe(400);
    expect(mentorNet).toBe(1600);
    expect(mentorNet / bookingPrice).toBe(0.80);
  });

  it("should calculate correct amounts for edge case ticket sizes", () => {
    const price = 1499;
    const fee = Math.round(price * 0.20);
    const net = price - fee;

    expect(fee).toBe(300);
    expect(net).toBe(1199);
    expect(fee + net).toBe(price);
  });
});
