import { describe, it, expect } from "vitest";
import { getMentorsQuerySchema, updateMentorProfileSchema } from "@/server/modules/mentors/mentors.schema";
import { sendWorkEmailOtpSchema } from "@/server/modules/verification/verification.schema";

describe("Step 3 - Mentors & Verification Schemas", () => {
  it("should validate mentor query parameters", () => {
    const valid = getMentorsQuerySchema.parse({
      category: "Engineering",
      maxPrice: 2000,
      page: 1,
      limit: 10,
    });
    expect(valid.category).toBe("Engineering");
    expect(valid.maxPrice).toBe(2000);
    expect(valid.page).toBe(1);
    expect(valid.limit).toBe(10);
  });

  it("should reject free-mail domains for work email verification", () => {
    expect(() =>
      sendWorkEmailOtpSchema.parse({ email: "mentor@gmail.com" })
    ).toThrow(/corporate\/work email/);

    expect(() =>
      sendWorkEmailOtpSchema.parse({ email: "mentor@yahoo.com" })
    ).toThrow(/corporate\/work email/);

    const valid = sendWorkEmailOtpSchema.parse({ email: "staff@google.com" });
    expect(valid.email).toBe("staff@google.com");
  });

  it("should validate mentor profile updates", () => {
    const valid = updateMentorProfileSchema.parse({
      headline: "Staff Engineer @ Google Cloud",
      company: "Google",
      companyDomain: "google.com",
      role: "Staff Engineer",
      category: "Engineering",
      experienceYears: 8,
      hourlyRate: 1800,
      bio: "Helping students crack Tier-1 product companies.",
      tags: ["Distributed Systems", "DSA"],
      meetingUrl: "https://meet.google.com/abc-defg-hij",
    });
    expect(valid.companyDomain).toBe("google.com");
    expect(valid.hourlyRate).toBe(1800);
  });
});
