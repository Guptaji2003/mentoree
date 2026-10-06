import { describe, it, expect, vi } from "vitest";
import { AuthService } from "@/server/modules/auth/auth.service";
import { Role } from "@prisma/client";

describe("Step 2 - Auth Module & Security", () => {
  it("should hash and verify passwords using Argon2id", async () => {
    const rawPassword = "SuperSecurePassword123!";
    const hash = await AuthService.hashPassword(rawPassword);

    expect(hash).toBeDefined();
    expect(hash.startsWith("$argon2")).toBe(true);

    const isMatch = await AuthService.verifyPassword(rawPassword, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await AuthService.verifyPassword("WrongPassword123!", hash);
    expect(isWrongMatch).toBe(false);
  });

  it("should generate and verify 15-minute Jose JWT access tokens", async () => {
    const payload = {
      userId: "test-user-id-123",
      email: "student@college.edu",
      role: Role.STUDENT,
      name: "Test Student",
    };

    const token = await AuthService.generateAccessToken(payload);
    expect(token).toBeDefined();

    const decoded = await AuthService.verifyAccessToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.email).toBe(payload.email);
    expect(decoded?.role).toBe(Role.STUDENT);
  });

  it("should reject tampered or invalid JWT tokens", async () => {
    const validToken = await AuthService.generateAccessToken({
      userId: "usr-1",
      email: "student@college.edu",
      role: Role.STUDENT,
      name: "Student",
    });

    const tampered = validToken.substring(0, validToken.length - 5) + "abcde";
    const decoded = await AuthService.verifyAccessToken(tampered);
    expect(decoded).toBeNull();
  });
});
