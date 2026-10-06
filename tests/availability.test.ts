import { describe, it, expect } from "vitest";
import { createCustomSlotSchema, holdSlotSchema } from "@/server/modules/availability/availability.schema";

describe("Step 4 - Availability & Hold Schemas", () => {
  it("should enforce endTime strictly after startTime", () => {
    const valid = createCustomSlotSchema.parse({
      startTime: "2026-10-10T10:00:00.000Z",
      endTime: "2026-10-10T10:30:00.000Z",
    });
    expect(valid.startTime).toBe("2026-10-10T10:00:00.000Z");

    expect(() =>
      createCustomSlotSchema.parse({
        startTime: "2026-10-10T11:00:00.000Z",
        endTime: "2026-10-10T10:00:00.000Z",
      })
    ).toThrow(/endTime must be strictly after startTime/);
  });

  it("should validate hold slot input requirements", () => {
    const valid = holdSlotSchema.parse({
      serviceId: "srv-123",
      preSessionGoal: "Preparation for Tier-1 Mock Interview",
      preSessionQuestions: "How to structure Graph BFS/DFS questions in 45 minutes?",
      preSessionResumeUrl: "https://drive.google.com/sample",
    });
    expect(valid.serviceId).toBe("srv-123");
    expect(valid.preSessionGoal).toBe("Preparation for Tier-1 Mock Interview");
  });
});
