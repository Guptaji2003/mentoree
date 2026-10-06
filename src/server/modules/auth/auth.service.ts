import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";
import * as argon2 from "@node-rs/argon2";
import { db } from "@/server/db";
import { env } from "@/server/env";
import { Role } from "@prisma/client";
import { SignupInput, LoginInput } from "./auth.schema";

export interface SessionPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
}

export class AuthService {
  private static jwtSecretKey = new TextEncoder().encode(env.JWT_SECRET);

  /**
   * Hash password using Argon2id
   */
  public static async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
      algorithm: 2, // Argon2id
    });
  }

  /**
   * Verify password against Argon2id hash
   */
  public static async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      return false;
    }
  }

  /**
   * Hash a raw refresh token using SHA-256 for secure database storage
   */
  public static hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  /**
   * Generate 15-minute Access Token (JWT with jose HS256)
   */
  public static async generateAccessToken(payload: SessionPayload): Promise<string> {
    return new SignJWT({
      sub: payload.userId,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(this.jwtSecretKey);
  }

  /**
   * Generate 7-day Refresh Token (opaque hex string stored hashed in DB)
   */
  public static async generateRefreshToken(userId: string): Promise<{ rawToken: string; expiresAt: Date }> {
    const rawToken = "rt_" + crypto.randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days in UTC

    await db.refreshToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
        isRevoked: false,
      },
    });

    return { rawToken, expiresAt };
  }

  /**
   * Verify Access Token and return user session payload
   */
  public static async verifyAccessToken(token: string): Promise<SessionPayload | null> {
    try {
      const { payload } = await jwtVerify(token, this.jwtSecretKey, {
        algorithms: ["HS256"],
      });

      if (!payload.sub || !payload.email || !payload.role) {
        return null;
      }

      return {
        userId: payload.sub as string,
        email: payload.email as string,
        role: payload.role as Role,
        name: (payload.name as string) || "",
      };
    } catch {
      return null;
    }
  }

  /**
   * Signup a new user (STUDENT or MENTOR only. Never ADMIN via signup).
   */
  public static async signup(input: SignupInput) {
    const existing = await db.user.findUnique({
      where: { email: input.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new Error("409 Conflict: An account with this email already exists");
    }

    // Explicitly restrict signup roles: STUDENT or MENTOR only
    const assignedRole: Role = input.role === "MENTOR" ? Role.MENTOR : Role.STUDENT;
    const passwordHash = await this.hashPassword(input.password);

    const user = await db.user.create({
      data: {
        email: input.email.toLowerCase().trim(),
        name: input.name.trim(),
        passwordHash,
        role: assignedRole,
        isVerified: false,
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        emailVerified: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    // If mentor, create initial pending MentorProfile
    if (assignedRole === Role.MENTOR) {
      await db.mentorProfile.create({
        data: {
          userId: user.id,
          headline: "Professional Mentor",
          company: "Independent",
          companyDomain: "independent.com",
          role: "Mentor",
          category: "Engineering",
          experienceYears: 1,
          hourlyRate: 1000,
          bio: "Passionate about mentoring college students.",
          tags: ["Mentorship", "Career Advice"],
          status: "PENDING_VERIFICATION",
        },
      });
    }

    const sessionPayload: SessionPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const accessToken = await this.generateAccessToken(sessionPayload);
    const { rawToken: refreshToken, expiresAt: refreshExpiresAt } = await this.generateRefreshToken(user.id);

    return {
      user,
      accessToken,
      refreshToken,
      refreshExpiresAt,
    };
  }

  /**
   * Login user with email and password
   */
  public static async login(input: LoginInput, ipAddress?: string) {
    const user = await db.user.findUnique({
      where: { email: input.email.toLowerCase().trim() },
      include: { mentorProfile: true },
    });

    if (!user) {
      await db.auditLog.create({
        data: {
          action: "LOGIN_FAILED",
          performedBy: input.email,
          details: "Login attempt with non-existent email",
          ipAddress: ipAddress || null,
        },
      });
      throw new Error("401 Unauthorized: Invalid email or password");
    }

    const isValid = await this.verifyPassword(input.password, user.passwordHash);
    if (!isValid) {
      await db.auditLog.create({
        data: {
          action: "LOGIN_FAILED",
          performedBy: input.email,
          details: "Login attempt with incorrect password",
          ipAddress: ipAddress || null,
        },
      });
      throw new Error("401 Unauthorized: Invalid email or password");
    }

    const sessionPayload: SessionPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const accessToken = await this.generateAccessToken(sessionPayload);
    const { rawToken: refreshToken, expiresAt: refreshExpiresAt } = await this.generateRefreshToken(user.id);

    // Sanitize user object
    const sanitizedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
      emailVerified: user.emailVerified,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      mentorProfile: user.mentorProfile,
    };

    return {
      user: sanitizedUser,
      accessToken,
      refreshToken,
      refreshExpiresAt,
    };
  }

  /**
   * Rotate Refresh Token (Token rotation and reuse detection)
   */
  public static async rotateRefreshToken(rawRefreshToken: string) {
    const tokenHash = this.hashToken(rawRefreshToken);

    const storedToken = await db.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { include: { mentorProfile: true } } },
    });

    if (!storedToken) {
      throw new Error("401 Unauthorized: Invalid refresh token");
    }

    // Reuse detection: If a revoked token is used, revoke all tokens for this user!
    if (storedToken.isRevoked) {
      await db.refreshToken.updateMany({
        where: { userId: storedToken.userId },
        data: { isRevoked: true },
      });
      throw new Error("401 Unauthorized: Revoked refresh token reused. All sessions invalidated for security.");
    }

    // Check expiry
    if (storedToken.expiresAt < new Date()) {
      await db.refreshToken.update({
        where: { id: storedToken.id },
        data: { isRevoked: true },
      });
      throw new Error("401 Unauthorized: Refresh token has expired");
    }

    // Revoke old token
    await db.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    // Generate new token pair
    const sessionPayload: SessionPayload = {
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
      name: storedToken.user.name,
    };

    const newAccessToken = await this.generateAccessToken(sessionPayload);
    const { rawToken: newRefreshToken, expiresAt: newRefreshExpiresAt } = await this.generateRefreshToken(
      storedToken.user.id
    );

    const sanitizedUser = {
      id: storedToken.user.id,
      email: storedToken.user.email,
      name: storedToken.user.name,
      role: storedToken.user.role,
      isVerified: storedToken.user.isVerified,
      emailVerified: storedToken.user.emailVerified,
      avatarUrl: storedToken.user.avatarUrl,
      mentorProfile: storedToken.user.mentorProfile,
    };

    return {
      user: sanitizedUser,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      refreshExpiresAt: newRefreshExpiresAt,
    };
  }

  /**
   * Revoke Refresh Token on Logout
   */
  public static async logout(rawRefreshToken?: string) {
    if (rawRefreshToken) {
      const tokenHash = this.hashToken(rawRefreshToken);
      await db.refreshToken.updateMany({
        where: { tokenHash },
        data: { isRevoked: true },
      });
    }
  }

  /**
   * Get authenticated user by ID
   */
  public static async getCurrentUser(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        emailVerified: true,
        avatarUrl: true,
        createdAt: true,
        mentorProfile: true,
      },
    });

    if (!user) {
      throw new Error("404 Not Found: User does not exist");
    }

    return user;
  }
}
