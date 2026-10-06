import { NextRequest } from "next/server";
import { getSession } from "./auth-guard";
import { db } from "../db";
import { Role } from "@prisma/client";

/**
 * Resolves current authenticated student or development demo student
 */
export async function getStudentUserId(req: NextRequest): Promise<string> {
  try {
    const session = await getSession(req);
    if (session && session.userId) {
      return session.userId;
    }

    // Fallback for development / demo persona switcher
    const firstStudent = await db.user.findFirst({
      where: { role: Role.STUDENT },
      orderBy: { createdAt: "asc" },
    });

    if (firstStudent) {
      return firstStudent.id;
    }

    // Create a fallback student user if none exists
    const created = await db.user.create({
      data: {
        email: "learner@mentoree.in",
        name: "Pulkit Gupta",
        passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$dummyhash",
        role: Role.STUDENT,
        isVerified: true,
        emailVerified: true,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      },
    });

    return created.id;
  } catch (err) {
    // If DB is offline during local dev, use deterministic fallback ID
    return "dev-student-pulkit";
  }
}
