import { db } from "@/server/db";
import { VerificationStatus, Prisma } from "@prisma/client";
import { GetMentorsQuery, UpdateMentorProfileInput, MentorServiceInput } from "./mentors.schema";
import { SessionPayload } from "../auth/auth.service";

export class MentorsService {
  /**
   * List public mentors - ONLY VERIFIED mentors are returned.
   */
  public static async listVerifiedMentors(query: GetMentorsQuery) {
    const { category, company, maxPrice, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.MentorProfileWhereInput = {
      status: VerificationStatus.VERIFIED,
    };

    if (category && category !== "All") {
      whereClause.category = { equals: category, mode: "insensitive" };
    }

    if (company && company !== "All") {
      whereClause.company = { equals: company, mode: "insensitive" };
    }

    if (maxPrice !== undefined && maxPrice > 0) {
      whereClause.hourlyRate = { lte: maxPrice };
    }

    if (search && search.trim().length > 0) {
      const term = search.trim();
      whereClause.OR = [
        { user: { name: { contains: term, mode: "insensitive" } } },
        { headline: { contains: term, mode: "insensitive" } },
        { company: { contains: term, mode: "insensitive" } },
        { bio: { contains: term, mode: "insensitive" } },
        { tags: { hasSome: [term] } },
      ];
    }

    const [total, mentors] = await Promise.all([
      db.mentorProfile.count({ where: whereClause }),
      db.mentorProfile.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: [{ ratingAvg: "desc" }, { totalReviews: "desc" }],
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
              isVerified: true,
            },
          },
          services: {
            orderBy: { priceINR: "asc" },
          },
          availabilitySlots: {
            where: {
              status: "AVAILABLE",
              startTime: { gte: new Date() },
            },
            orderBy: { startTime: "asc" },
            take: 20,
          },
          reviews: {
            where: { hidden: false },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
              booking: {
                include: {
                  student: {
                    select: { name: true, avatarUrl: true },
                  },
                },
              },
            },
          },
          verificationDocs: {
            where: { status: "APPROVED" },
            select: { documentType: true, status: true },
          },
        },
      }),
    ]);

    // Transform into clean public mentor structure
    const formattedMentors = mentors.map((m) => {
      const emailDoc = m.verificationDocs.some((d) => d.documentType === "WORK_EMAIL");
      const empDoc = m.verificationDocs.some((d) => d.documentType === "EMPLOYEE_ID" || d.documentType === "OFFER_LETTER" || d.documentType === "PAYSLIP");
      const linkedinDoc = m.verificationDocs.some((d) => d.documentType === "LINKEDIN");

      return {
        id: m.id,
        userId: m.userId,
        name: m.user.name,
        headline: m.headline,
        company: m.company,
        companyDomain: m.companyDomain,
        role: m.role,
        category: m.category,
        experienceYears: m.experienceYears,
        hourlyRateINR: m.hourlyRate,
        avatar: m.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
        bio: m.bio,
        tags: m.tags,
        verificationStatus: m.status,
        verificationBadges: {
          emailVerified: emailDoc,
          identityVerified: m.user.isVerified,
          employmentVerified: empDoc,
          linkedinVerified: linkedinDoc,
        },
        ratingAvg: m.ratingAvg,
        totalReviews: m.totalReviews,
        totalMenteesHelped: m.totalMenteesHelped,
        featured: m.ratingAvg >= 4.9,
        meetingUrl: m.meetingUrl,
        services: m.services.map((s) => ({
          id: s.id,
          title: s.title,
          durationMinutes: s.durationMinutes,
          priceINR: s.priceINR,
          description: s.description,
          popular: s.popular,
        })),
        availability: m.availabilitySlots.map((s) => ({
          id: s.id,
          mentorId: s.mentorId,
          date: s.startTime.toISOString().split("T")[0],
          startTime: s.startTime.toISOString().substring(11, 16),
          endTime: s.endTime.toISOString().substring(11, 16),
          startTimeUTC: s.startTime.toISOString(),
          endTimeUTC: s.endTime.toISOString(),
          isBooked: false,
        })),
        reviews: m.reviews.map((r) => ({
          id: r.id,
          studentName: r.booking.student.name,
          studentRole: "Mentee",
          studentAvatar: r.booking.student.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
          rating: r.rating,
          comment: r.comment,
          sessionType: "1:1 Mentorship Session",
          date: r.createdAt.toISOString(),
        })),
      };
    });

    return {
      mentors: formattedMentors,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single mentor profile by ID
   * Invariant: 404 for unverified mentor UNLESS caller is that mentor or an ADMIN.
   */
  public static async getMentorById(mentorId: string, sessionUser?: SessionPayload | null) {
    const mentor = await db.mentorProfile.findFirst({
      where: {
        OR: [{ id: mentorId }, { userId: mentorId }],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
        services: {
          orderBy: { priceINR: "asc" },
        },
        availabilitySlots: {
          where: {
            status: "AVAILABLE",
            startTime: { gte: new Date() },
          },
          orderBy: { startTime: "asc" },
        },
        reviews: {
          where: { hidden: false },
          orderBy: { createdAt: "desc" },
          include: {
            booking: {
              include: {
                student: {
                  select: { name: true, avatarUrl: true },
                },
              },
            },
          },
        },
        verificationDocs: true,
      },
    });

    if (!mentor) {
      throw new Error("404 Not Found: Mentor not found");
    }

    const isSelf = sessionUser && sessionUser.userId === mentor.userId;
    const isAdmin = sessionUser && sessionUser.role === "ADMIN";

    if (mentor.status !== VerificationStatus.VERIFIED && !isSelf && !isAdmin) {
      throw new Error("404 Not Found: Mentor profile is not publicly available");
    }

    const emailDoc = mentor.verificationDocs.some((d) => d.documentType === "WORK_EMAIL" && d.status === "APPROVED");
    const empDoc = mentor.verificationDocs.some(
      (d) =>
        (d.documentType === "EMPLOYEE_ID" || d.documentType === "OFFER_LETTER" || d.documentType === "PAYSLIP") &&
        d.status === "APPROVED"
    );
    const linkedinDoc = mentor.verificationDocs.some((d) => d.documentType === "LINKEDIN" && d.status === "APPROVED");

    return {
      id: mentor.id,
      userId: mentor.userId,
      name: mentor.user.name,
      headline: mentor.headline,
      company: mentor.company,
      companyDomain: mentor.companyDomain,
      role: mentor.role,
      category: mentor.category,
      experienceYears: mentor.experienceYears,
      hourlyRateINR: mentor.hourlyRate,
      avatar: mentor.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      bio: mentor.bio,
      tags: mentor.tags,
      verificationStatus: mentor.status,
      verificationBadges: {
        emailVerified: emailDoc,
        identityVerified: mentor.user.isVerified,
        employmentVerified: empDoc,
        linkedinVerified: linkedinDoc,
      },
      ratingAvg: mentor.ratingAvg,
      totalReviews: mentor.totalReviews,
      totalMenteesHelped: mentor.totalMenteesHelped,
      meetingUrl: isSelf || isAdmin ? mentor.meetingUrl : undefined,
      services: mentor.services,
      availability: mentor.availabilitySlots.map((s) => ({
        id: s.id,
        mentorId: s.mentorId,
        date: s.startTime.toISOString().split("T")[0],
        startTime: s.startTime.toISOString().substring(11, 16),
        endTime: s.endTime.toISOString().substring(11, 16),
        startTimeUTC: s.startTime.toISOString(),
        endTimeUTC: s.endTime.toISOString(),
        status: s.status,
      })),
      reviews: mentor.reviews.map((r) => ({
        id: r.id,
        studentName: r.booking.student.name,
        studentRole: "Mentee",
        studentAvatar: r.booking.student.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        rating: r.rating,
        comment: r.comment,
        sessionType: "1:1 Mentorship Session",
        date: r.createdAt.toISOString(),
      })),
    };
  }

  /**
   * Update mentor profile (own profile only)
   */
  public static async updateProfile(userId: string, input: UpdateMentorProfileInput) {
    const mentor = await db.mentorProfile.findUnique({
      where: { userId },
    });

    if (!mentor) {
      throw new Error("404 Not Found: Mentor profile does not exist");
    }

    return db.mentorProfile.update({
      where: { id: mentor.id },
      data: {
        headline: input.headline,
        company: input.company,
        companyDomain: input.companyDomain,
        role: input.role,
        category: input.category,
        experienceYears: input.experienceYears,
        hourlyRate: input.hourlyRate,
        bio: input.bio,
        tags: input.tags,
        meetingUrl: input.meetingUrl || null,
      },
    });
  }

  /**
   * Create mentor service (own services only)
   */
  public static async createService(userId: string, input: MentorServiceInput) {
    const mentor = await db.mentorProfile.findUnique({
      where: { userId },
    });

    if (!mentor) {
      throw new Error("404 Not Found: Mentor profile not found");
    }

    return db.mentorService.create({
      data: {
        mentorId: mentor.id,
        title: input.title,
        durationMinutes: input.durationMinutes,
        priceINR: input.priceINR,
        description: input.description,
        popular: input.popular ?? false,
      },
    });
  }

  /**
   * Update mentor service (own service only)
   */
  public static async updateService(userId: string, serviceId: string, input: MentorServiceInput) {
    const service = await db.mentorService.findUnique({
      where: { id: serviceId },
      include: { mentor: true },
    });

    if (!service || service.mentor.userId !== userId) {
      throw new Error("403 Forbidden: You do not own this service");
    }

    return db.mentorService.update({
      where: { id: serviceId },
      data: {
        title: input.title,
        durationMinutes: input.durationMinutes,
        priceINR: input.priceINR,
        description: input.description,
        popular: input.popular ?? false,
      },
    });
  }

  /**
   * Delete mentor service (own service only)
   */
  public static async deleteService(userId: string, serviceId: string) {
    const service = await db.mentorService.findUnique({
      where: { id: serviceId },
      include: { mentor: true },
    });

    if (!service || service.mentor.userId !== userId) {
      throw new Error("403 Forbidden: You do not own this service");
    }

    return db.mentorService.delete({
      where: { id: serviceId },
    });
  }
}
