import { PrismaClient, Role, VerificationStatus, DocumentType, DocumentStatus, SlotStatus, AuditAction } from "@prisma/client";
import * as argon2 from "@node-rs/argon2";
import { INITIAL_MENTORS } from "../src/data/mockData";

const prisma = new PrismaClient();

async function hashPassword(password: string) {
  return argon2.hash(password, {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
    algorithm: 2, // Argon2id
  });
}

async function main() {
  console.log("🌱 Starting database seeding with 20 diverse mentors across all disciplines...");

  // 1. Clean existing seed data in safe dependency order
  await prisma.auditLog.deleteMany();
  await prisma.webhookLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.emailOtp.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.mentorService.deleteMany();
  await prisma.verificationDocument.deleteMany();
  await prisma.mentorProfile.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await hashPassword("MentoreePass123!");

  // 2. Create 1 Super Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@mentoree.in",
      name: "Super Admin",
      passwordHash: defaultPasswordHash,
      role: Role.ADMIN,
      isVerified: true,
      emailVerified: true,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
  });
  console.log(`✅ Seeded Admin: ${adminUser.email}`);

  // 3. Create Student Users
  const student1 = await prisma.user.create({
    data: {
      email: "pulkit.gupta@stanford.edu",
      name: "Pulkit Gupta",
      passwordHash: defaultPasswordHash,
      role: Role.STUDENT,
      isVerified: true,
      emailVerified: true,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
  });

  await prisma.studentProfile.create({
    data: {
      userId: student1.id,
      firstName: "Pulkit",
      lastName: "Gupta",
      displayName: "Pulkit Gupta",
      phoneNumber: "+91 98765 43210",
      country: "India",
      state: "Delhi",
      city: "New Delhi",
      bio: "Passionate learner preparing for top-tier careers and seeking verified mentor guidance.",
      profilePhoto: student1.avatarUrl,
      primaryField: "Engineering & Technology",
      primarySpecialization: "Distributed Systems & Full Stack",
      targetRole: "Senior Software Engineer",
      targetDomain: "Cloud Architecture & Fintech",
      targetIndustry: "Technology / SaaS",
      isExploringCareer: false,
      profileVisibility: "PUBLIC",
      completionPercentage: 90,
      draftStep: 5,
      isDraftCompleted: true,
    }
  });

  const student2 = await prisma.user.create({
    data: {
      email: "jessia.rose@harvard.edu",
      name: "Jessia Rose",
      passwordHash: defaultPasswordHash,
      role: Role.STUDENT,
      isVerified: true,
      emailVerified: true,
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
  });

  console.log(`✅ Seeded Students: ${student1.email}, ${student2.email}`);

  // 4. Seed all 20 Verified Mentors with Services, Slots, and Verification
  console.log(`🚀 Seeding ${INITIAL_MENTORS.length} field-agnostic mentors...`);

  for (let i = 0; i < INITIAL_MENTORS.length; i++) {
    const rawMentor = INITIAL_MENTORS[i];
    const mentorEmail = `mentor${i + 1}@${rawMentor.companyDomain || "mentoree.in"}`;

    const user = await prisma.user.create({
      data: {
        email: mentorEmail,
        name: rawMentor.name,
        passwordHash: defaultPasswordHash,
        role: Role.MENTOR,
        isVerified: true,
        emailVerified: true,
        avatarUrl: rawMentor.avatar,
      },
    });

    const mentorProfile = await prisma.mentorProfile.create({
      data: {
        userId: user.id,
        headline: rawMentor.headline,
        bio: rawMentor.bio,
        company: rawMentor.company,
        companyDomain: rawMentor.companyDomain || "company.com",
        role: rawMentor.role,
        category: rawMentor.category,
        experienceYears: rawMentor.experienceYears,
        hourlyRate: rawMentor.hourlyRateINR,
        status: VerificationStatus.VERIFIED,
        ratingAvg: rawMentor.ratingAvg,
        totalReviews: rawMentor.totalReviews,
        totalMenteesHelped: rawMentor.totalMenteesHelped,
        tags: rawMentor.tags,
      },
    });

    // Create Services
    for (const srv of rawMentor.services) {
      await prisma.mentorService.create({
        data: {
          mentorId: mentorProfile.id,
          title: srv.title,
          description: srv.description,
          durationMinutes: srv.durationMinutes,
          priceINR: srv.priceINR,
          popular: srv.popular || false,
        },
      });
    }

    // Create 4 Availability Slots per mentor across next 14 days
    const baseDate = new Date();
    for (let dayOffset = 1; dayOffset <= 4; dayOffset++) {
      const slotDate = new Date(baseDate);
      slotDate.setDate(baseDate.getDate() + dayOffset * 2);
      
      const startTime = new Date(slotDate);
      startTime.setHours(17 + (dayOffset % 3), 0, 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(startTime.getMinutes() + 45);

      await prisma.availabilitySlot.create({
        data: {
          mentorId: mentorProfile.id,
          startTime,
          endTime,
          status: SlotStatus.AVAILABLE,
        },
      });
    }

    // Create Sample Verified Document
    await prisma.verificationDocument.create({
      data: {
        mentorId: mentorProfile.id,
        documentType: DocumentType.EMPLOYEE_ID,
        fileUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600",
        fileName: `${rawMentor.name.replace(/\s+/g, "_")}_Employment_Verification.pdf`,
        fileSize: "240KB",
        status: DocumentStatus.APPROVED,
        verifiedDomain: rawMentor.companyDomain,
      },
    });

    console.log(`   [${i + 1}/${INITIAL_MENTORS.length}] Seeded mentor: ${rawMentor.name} (${rawMentor.category} @ ${rawMentor.company})`);
  }

  // 5. Seed Platform Audit Log
  await prisma.auditLog.create({
    data: {
      action: AuditAction.APPROVED,
      performedBy: adminUser.email,
      details: "Successfully seeded 20 verified mentors across all disciplines with live bookable slots and services.",
      ipAddress: "127.0.0.1",
    },
  });

  console.log("\n🎉 Database successfully seeded with 20 diverse mentors across all disciplines!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
