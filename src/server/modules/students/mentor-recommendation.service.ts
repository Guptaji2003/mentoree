import { db } from "@/server/db";
import { VerificationStatus } from "@prisma/client";

export interface MentorRecommendationScore {
  mentorId: string;
  score: number;
  matchReasons: string[];
}

export class MentorRecommendationService {
  /**
   * Calculate personalized mentor recommendation ranking for a student
   * Field-agnostic rule-based matching engine
   */
  public static async getRecommendedMentors(
    studentProfileId: string,
    filters?: {
      field?: string;
      expertise?: string;
      minPrice?: number;
      maxPrice?: number;
      rating?: number;
      page?: number;
      limit?: number;
    }
  ) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const skip = (page - 1) * limit;

    // 1. Fetch Student Profile with all dimensions
    const student = await db.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        interests: true,
        skills: true,
        goals: true,
        mentorshipPreference: true,
      },
    });

    // 2. Fetch all verified mentors
    const verifiedMentors = await db.mentorProfile.findMany({
      where: {
        status: VerificationStatus.VERIFIED,
        ...(filters?.field && filters.field !== "All" ? { category: { contains: filters.field, mode: "insensitive" } } : {}),
        ...(filters?.rating ? { ratingAvg: { gte: filters.rating } } : {}),
        ...(filters?.minPrice || filters?.maxPrice ? {
          hourlyRate: {
            ...(filters?.minPrice ? { gte: filters.minPrice } : {}),
            ...(filters?.maxPrice ? { lte: filters.maxPrice } : {}),
          }
        } : {}),
      },
      include: {
        user: { select: { name: true, avatarUrl: true, email: true } },
        availabilitySlots: {
          where: { status: "AVAILABLE" },
          take: 5,
        },
        services: true,
        reviews: {
          where: { hidden: false },
          take: 3,
        },
      },
    });

    if (!student) {
      // Fallback: Return sorted by ratingAvg and reviews
      const sorted = verifiedMentors.sort((a, b) => b.ratingAvg - a.ratingAvg);
      return {
        mentors: sorted.slice(skip, skip + limit),
        total: sorted.length,
        page,
        limit,
      };
    }

    const studentField = (student.primaryField || "").toLowerCase();
    const studentInterests = student.interests.map((i) => i.interestName.toLowerCase());
    const studentSkills = student.skills.map((s) => s.skillName.toLowerCase());
    const studentGoals = student.goals.map((g) => `${g.goalType} ${g.title}`.toLowerCase());
    const studentTargetRole = (student.targetRole || "").toLowerCase();
    const studentIndustry = (student.targetIndustry || "").toLowerCase();
    const prefFields = (student.mentorshipPreference?.preferredMentorFields || []).map((f) => f.toLowerCase());
    const prefExpertise = (student.mentorshipPreference?.preferredMentorExpertise || []).map((e) => e.toLowerCase());

    // 3. Compute score for each mentor
    const scoredMentors = verifiedMentors.map((m) => {
      let score = 0;
      const reasons: string[] = [];

      const mentorCategory = (m.category || "").toLowerCase();
      const mentorHeadline = (m.headline || "").toLowerCase();
      const mentorBio = (m.bio || "").toLowerCase();
      const mentorRole = (m.role || "").toLowerCase();
      const mentorCompany = (m.company || "").toLowerCase();
      const mentorTags = (m.tags || []).map((t) => t.toLowerCase());

      // Criterion 1: Field Match (+25)
      if (
        (studentField && mentorCategory.includes(studentField)) ||
        (studentField && studentField.includes(mentorCategory)) ||
        prefFields.some((pf) => mentorCategory.includes(pf) || pf.includes(mentorCategory))
      ) {
        score += 25;
        reasons.push("Direct match for your academic domain");
      }

      // Criterion 2: Interest Match (+20)
      const interestMatches = studentInterests.filter(
        (interest) =>
          mentorTags.some((tag) => tag.includes(interest) || interest.includes(tag)) ||
          mentorHeadline.includes(interest) ||
          mentorBio.includes(interest)
      );
      if (interestMatches.length > 0) {
        score += Math.min(20, interestMatches.length * 10);
        reasons.push(`Specializes in ${interestMatches.slice(0, 2).join(", ")}`);
      }

      // Criterion 3: Goal Match (+20)
      const goalMatches = studentGoals.filter(
        (goal) =>
          mentorHeadline.includes(goal) ||
          mentorBio.includes(goal) ||
          mentorTags.some((t) => goal.includes(t))
      );
      if (goalMatches.length > 0) {
        score += 20;
        reasons.push("Aligned with your current learning milestone");
      }

      // Criterion 4: Skill / Expertise Match (+15)
      const skillMatches = studentSkills.filter(
        (skill) =>
          mentorTags.some((tag) => tag.includes(skill) || skill.includes(tag)) ||
          mentorBio.includes(skill)
      );
      const prefExpertiseMatches = prefExpertise.filter(
        (exp) =>
          mentorHeadline.includes(exp) ||
          mentorTags.some((tag) => tag.includes(exp))
      );
      if (skillMatches.length > 0 || prefExpertiseMatches.length > 0) {
        score += 15;
        reasons.push("Can mentor on your target skills");
      }

      // Criterion 5: Target Role Match (+10)
      if (
        studentTargetRole &&
        (mentorRole.includes(studentTargetRole) ||
          mentorHeadline.includes(studentTargetRole) ||
          studentTargetRole.includes(mentorRole))
      ) {
        score += 10;
        reasons.push(`Experienced as a ${m.role}`);
      }

      // Criterion 6: Target Industry / Company (+5)
      if (
        (studentIndustry && mentorCompany.includes(studentIndustry)) ||
        (studentIndustry && mentorHeadline.includes(studentIndustry))
      ) {
        score += 5;
        reasons.push(`Works in your target company/industry (${m.company})`);
      }

      // Criterion 7: Rating & Experience Multiplier (up to +5)
      if (m.ratingAvg >= 4.8) score += 3;
      if (m.experienceYears >= 5) score += 2;

      return {
        mentor: {
          id: m.id,
          name: m.user.name,
          headline: m.headline,
          company: m.company,
          companyDomain: m.companyDomain,
          role: m.role,
          category: m.category,
          experienceYears: m.experienceYears,
          hourlyRateINR: m.hourlyRate,
          avatar: m.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
          bio: m.bio,
          tags: m.tags,
          verificationStatus: m.status,
          verificationBadges: {
            emailVerified: true,
            identityVerified: true,
            employmentVerified: true,
            linkedinVerified: true,
          },
          ratingAvg: m.ratingAvg,
          totalReviews: m.totalReviews,
          totalMenteesHelped: m.totalMenteesHelped,
          availability: m.availabilitySlots.map((s) => ({
            id: s.id,
            mentorId: s.mentorId,
            date: s.startTime.toISOString().split("T")[0],
            startTime: s.startTime.toISOString().split("T")[1].slice(0, 5),
            endTime: s.endTime.toISOString().split("T")[1].slice(0, 5),
            localTimeDisplay: s.startTime.toLocaleDateString(),
            isBooked: s.status === "BOOKED",
          })),
          services: m.services.map((srv) => ({
            id: srv.id,
            title: srv.title,
            durationMinutes: srv.durationMinutes,
            priceINR: srv.priceINR,
            description: srv.description,
            popular: srv.popular,
          })),
          reviews: m.reviews.map((r) => ({
            id: r.id,
            studentName: "Verified Mentee",
            studentRole: "Learner",
            studentAvatar: "",
            rating: r.rating,
            comment: r.comment,
            sessionType: "1:1 Live Call",
            date: "Recently",
          })),
        },
        recommendationScore: score,
        matchReasons: reasons.length > 0 ? reasons : ["Highly rated practitioner in their field"],
      };
    });

    // Sort by recommendationScore DESC, then ratingAvg DESC
    scoredMentors.sort((a, b) => {
      if (b.recommendationScore !== a.recommendationScore) {
        return b.recommendationScore - a.recommendationScore;
      }
      return b.mentor.ratingAvg - a.mentor.ratingAvg;
    });

    const paginated = scoredMentors.slice(skip, skip + limit);

    return {
      recommendations: paginated,
      total: scoredMentors.length,
      page,
      limit,
    };
  }
}
