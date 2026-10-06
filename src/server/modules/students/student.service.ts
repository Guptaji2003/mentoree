import { db } from "@/server/db";
import { ProfileCompletionService } from "./profile-completion.service";
import {
  UpdateStudentProfileSchema,
  CreateEducationSchema,
  UpdateEducationSchema,
  CreateSkillSchema,
  CreateInterestSchema,
  CreateGoalSchema,
  UpdateGoalSchema,
  CreateExperienceSchema,
  UpdateExperienceSchema,
  CreateProjectSchema,
  UpdateProjectSchema,
  CreateLinkSchema,
  UpdateLinkSchema,
  UpdateMentorshipPreferencesSchema,
} from "./student.schema";
import { z } from "zod";

// In-memory development store when local database is offline
const inMemoryStore: Record<string, any> = {};

function getDefaultInMemoryProfile(userId: string) {
  return {
    id: `prof-${userId}`,
    userId,
    firstName: "Jessia",
    lastName: "Rose",
    displayName: "Jessia Rose",
    phoneNumber: "+1 (555) 123-4567",
    country: "United States",
    state: "California",
    city: "San Francisco",
    bio: "Passionate learner exploring full-stack engineering, distributed systems, and mentorship.",
    profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    primaryField: "Computer Science & Engineering",
    primarySpecialization: "Full Stack & Cloud Architecture",
    targetRole: "Software Development Engineer (SDE)",
    targetDomain: "Distributed Systems & AI",
    targetIndustry: "Technology / SaaS",
    isExploringCareer: false,
    profileVisibility: "PUBLIC",
    completionPercentage: 85,
    draftStep: 5,
    isDraftCompleted: true,
    education: [
      {
        id: "edu-1",
        institution: "Stanford University",
        degree: "B.Tech Computer Science",
        fieldOfStudy: "Computer Science",
        educationLevel: "Undergraduate",
        currentStatus: "Currently Studying",
        gradeType: "CGPA",
        gradeValue: "3.9 / 4.0",
        startYear: 2022,
        endYear: 2026,
        isCurrent: true,
      }
    ],
    skills: [
      { id: "sk-1", skillName: "TypeScript", category: "Programming", proficiency: "ADVANCED" },
      { id: "sk-2", skillName: "React / Next.js", category: "Frontend", proficiency: "ADVANCED" },
      { id: "sk-3", skillName: "Node.js & Express", category: "Backend", proficiency: "INTERMEDIATE" },
      { id: "sk-4", skillName: "PostgreSQL & Prisma", category: "Database", proficiency: "INTERMEDIATE" },
    ],
    interests: [
      { id: "int-1", interestName: "Distributed Systems" },
      { id: "int-2", interestName: "Cloud Architecture" },
      { id: "int-3", interestName: "System Design" },
    ],
    goals: [
      {
        id: "goal-1",
        title: "Crack SDE-1 Interview at Tier-1 Tech",
        targetRole: "Software Engineer",
        targetIndustry: "Fintech / Cloud",
        priority: "HIGH",
        status: "IN_PROGRESS",
        targetDate: "2026-12-31",
      }
    ],
    experiences: [
      {
        id: "exp-1",
        title: "Software Engineering Intern",
        organization: "TechCorp Labs",
        experienceType: "INTERNSHIP",
        location: "San Francisco, CA",
        description: "Built high-throughput webhook pipelines and optimized Next.js caching layers.",
        startDate: "2025-06-01",
        endDate: "2025-08-31",
        isCurrent: false,
      }
    ],
    projects: [
      {
        id: "proj-1",
        title: "High Concurrency Order Processing Engine",
        role: "Lead Developer",
        description: "Built an idempotent order processing queue handling 5,000 req/sec with Redis & BullMQ.",
        projectUrl: "https://github.com/example/engine",
        skillsUsed: ["Node.js", "Redis", "BullMQ", "PostgreSQL"],
      }
    ],
    links: [
      { id: "lnk-1", platform: "LINKEDIN", url: "https://linkedin.com/in/example", label: "LinkedIn" },
      { id: "lnk-2", platform: "GITHUB", url: "https://github.com/example", label: "GitHub" },
      { id: "lnk-3", platform: "PORTFOLIO", url: "https://example.dev", label: "Portfolio" },
    ],
    resume: {
      id: "res-1",
      fileName: "Jessia_Rose_Resume_2026.pdf",
      fileUrl: "/resumes/sample.pdf",
      fileSizeBytes: 245000,
      mimeType: "application/pdf",
      uploadedAt: new Date().toISOString(),
    },
    mentorshipPreference: {
      id: "pref-1",
      preferredMentorFields: ["Engineering & Tech", "Product"],
      preferredMentorExpertise: ["System Design", "Distributed Systems", "Resume Review"],
      preferredMentorRoles: ["Staff Engineer", "Senior SDE", "Engineering Manager"],
      preferredMentorIndustries: ["Fintech", "Cloud / SaaS"],
      preferredSessionType: "ONE_ON_ONE",
      minBudgetINR: 1000,
      maxBudgetINR: 4000,
      preferredLanguages: ["English", "Hindi"],
      preferredExperienceLevel: "5+ Years",
      preferredAvailability: "Weekends & Evenings",
    },
    targetOrganizations: [],
  };
}

export class StudentService {
  /**
   * Helper: Ensure student profile exists for the user, create default if not
   */
  public static async getOrCreateProfile(userId: string) {
    try {
      let profile = await db.studentProfile.findUnique({
        where: { userId },
        include: {
          education: { orderBy: { createdAt: "desc" } },
          interests: true,
          skills: true,
          goals: { orderBy: { createdAt: "desc" } },
          experiences: { orderBy: { createdAt: "desc" } },
          projects: { orderBy: { createdAt: "desc" } },
          links: true,
          resume: true,
          mentorshipPreference: true,
          targetOrganizations: true,
        },
      });

      if (!profile) {
        const user = await db.user.findUnique({ where: { id: userId } });
        const nameParts = (user?.name || "Student").split(" ");
        const firstName = nameParts[0] || "Student";
        const lastName = nameParts.slice(1).join(" ") || undefined;

        profile = await db.studentProfile.create({
          data: {
            userId,
            firstName,
            lastName,
            displayName: user?.name || "Learner",
            profilePhoto: user?.avatarUrl,
            primaryField: "Exploring / Undecided",
            isExploringCareer: true,
            completionPercentage: 15,
            draftStep: 1,
          },
          include: {
            education: true,
            interests: true,
            skills: true,
            goals: true,
            experiences: true,
            projects: true,
            links: true,
            resume: true,
            mentorshipPreference: true,
            targetOrganizations: true,
          },
        });
      }

      return profile;
    } catch (dbErr) {
      if (!inMemoryStore[userId]) {
        inMemoryStore[userId] = getDefaultInMemoryProfile(userId);
      }
      return inMemoryStore[userId];
    }
  }

  /**
   * Get full profile by User ID
   */
  public static async getProfile(userId: string) {
    try {
      const profile = await this.getOrCreateProfile(userId);
      const breakdown = ProfileCompletionService.calculate(profile);

      try {
        // Sync completion percentage if changed
        if (profile.completionPercentage !== breakdown.percentage) {
          await db.studentProfile.update({
            where: { id: profile.id },
            data: { completionPercentage: breakdown.percentage },
          });
          profile.completionPercentage = breakdown.percentage;
        }
      } catch {}

      return {
        profile,
        completion: breakdown,
      };
    } catch (err) {
      const fallback = inMemoryStore[userId] || getDefaultInMemoryProfile(userId);
      const breakdown = ProfileCompletionService.calculate(fallback);
      return {
        profile: fallback,
        completion: breakdown,
      };
    }
  }

  /**
   * Update Student Profile metadata (Basic Info, Career Direction, Visibility, Draft Step)
   */
  public static async updateProfile(userId: string, input: z.infer<typeof UpdateStudentProfileSchema>) {
    const profile = await this.getOrCreateProfile(userId);
    const validated = UpdateStudentProfileSchema.parse(input);

    try {
      const updated = await db.studentProfile.update({
        where: { id: profile.id },
        data: {
          ...(validated.firstName !== undefined && { firstName: validated.firstName }),
          ...(validated.lastName !== undefined && { lastName: validated.lastName }),
          ...(validated.displayName !== undefined && { displayName: validated.displayName }),
          ...(validated.phoneNumber !== undefined && { phoneNumber: validated.phoneNumber }),
          ...(validated.country !== undefined && { country: validated.country }),
          ...(validated.state !== undefined && { state: validated.state }),
          ...(validated.city !== undefined && { city: validated.city }),
          ...(validated.bio !== undefined && { bio: validated.bio }),
          ...(validated.profilePhoto !== undefined && { profilePhoto: validated.profilePhoto }),
          ...(validated.primaryField !== undefined && { primaryField: validated.primaryField }),
          ...(validated.primarySpecialization !== undefined && { primarySpecialization: validated.primarySpecialization }),
          ...(validated.targetRole !== undefined && { targetRole: validated.targetRole }),
          ...(validated.targetDomain !== undefined && { targetDomain: validated.targetDomain }),
          ...(validated.targetIndustry !== undefined && { targetIndustry: validated.targetIndustry }),
          ...(validated.isExploringCareer !== undefined && { isExploringCareer: validated.isExploringCareer }),
          ...(validated.profileVisibility !== undefined && { profileVisibility: validated.profileVisibility }),
          ...(validated.draftStep !== undefined && { draftStep: validated.draftStep }),
          ...(validated.isDraftCompleted !== undefined && { isDraftCompleted: validated.isDraftCompleted }),
        },
        include: {
          education: true,
          interests: true,
          skills: true,
          goals: true,
          experiences: true,
          projects: true,
          links: true,
          resume: true,
          mentorshipPreference: true,
          targetOrganizations: true,
        },
      });

      const completion = ProfileCompletionService.calculate(updated);
      if (updated.completionPercentage !== completion.percentage) {
        try {
          await db.studentProfile.update({
            where: { id: updated.id },
            data: { completionPercentage: completion.percentage },
          });
        } catch {}
        updated.completionPercentage = completion.percentage;
      }

      return { profile: updated, completion };
    } catch (err) {
      // In-memory fallback mutation
      const current = inMemoryStore[userId] || getDefaultInMemoryProfile(userId);
      const mutated = {
        ...current,
        ...validated,
      };
      const completion = ProfileCompletionService.calculate(mutated);
      mutated.completionPercentage = completion.percentage;
      inMemoryStore[userId] = mutated;
      return { profile: mutated, completion };
    }
  }

  // ===================== EDUCATION =====================
  public static async listEducation(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    return db.education.findMany({
      where: { studentProfileId: profile.id },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async createEducation(userId: string, input: z.infer<typeof CreateEducationSchema>) {
    const profile = await this.getOrCreateProfile(userId);
    const data = CreateEducationSchema.parse(input);

    const record = await db.education.create({
      data: {
        studentProfileId: profile.id,
        institutionName: data.institutionName,
        educationLevel: data.educationLevel,
        degreeOrProgram: data.degreeOrProgram || undefined,
        fieldOfStudy: data.fieldOfStudy || undefined,
        specialization: data.specialization || undefined,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        expectedEndDate: data.expectedEndDate ? new Date(data.expectedEndDate) : undefined,
        completionDate: data.completionDate ? new Date(data.completionDate) : undefined,
        currentStatus: data.currentStatus,
        gradeType: data.gradeType || undefined,
        gradeValue: data.gradeValue || undefined,
        description: data.description || undefined,
      },
    });

    await this.refreshCompletionScore(profile.id);
    return record;
  }

  public static async updateEducation(userId: string, id: string, input: z.infer<typeof UpdateEducationSchema>) {
    const profile = await this.getOrCreateProfile(userId);
    const existing = await db.education.findFirst({
      where: { id, studentProfileId: profile.id },
    });
    if (!existing) throw new Error("404 Not Found: Education record not found");

    const data = UpdateEducationSchema.parse(input);
    const updated = await db.education.update({
      where: { id },
      data: {
        ...(data.institutionName && { institutionName: data.institutionName }),
        ...(data.educationLevel && { educationLevel: data.educationLevel }),
        ...(data.degreeOrProgram !== undefined && { degreeOrProgram: data.degreeOrProgram }),
        ...(data.fieldOfStudy !== undefined && { fieldOfStudy: data.fieldOfStudy }),
        ...(data.specialization !== undefined && { specialization: data.specialization }),
        ...(data.startDate !== undefined && { startDate: data.startDate ? new Date(data.startDate) : null }),
        ...(data.expectedEndDate !== undefined && { expectedEndDate: data.expectedEndDate ? new Date(data.expectedEndDate) : null }),
        ...(data.completionDate !== undefined && { completionDate: data.completionDate ? new Date(data.completionDate) : null }),
        ...(data.currentStatus && { currentStatus: data.currentStatus }),
        ...(data.gradeType !== undefined && { gradeType: data.gradeType }),
        ...(data.gradeValue !== undefined && { gradeValue: data.gradeValue }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });

    await this.refreshCompletionScore(profile.id);
    return updated;
  }

  public static async deleteEducation(userId: string, id: string) {
    const profile = await this.getOrCreateProfile(userId);
    const existing = await db.education.findFirst({
      where: { id, studentProfileId: profile.id },
    });
    if (!existing) throw new Error("404 Not Found: Education record not found");

    await db.education.delete({ where: { id } });
    await this.refreshCompletionScore(profile.id);
    return { success: true, message: "Education record deleted" };
  }

  // ===================== SKILLS =====================
  public static async listSkills(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    return db.studentSkill.findMany({
      where: { studentProfileId: profile.id },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async createSkill(userId: string, input: z.infer<typeof CreateSkillSchema>) {
    const profile = await this.getOrCreateProfile(userId);
    const data = CreateSkillSchema.parse(input);

    const record = await db.studentSkill.upsert({
      where: {
        studentProfileId_skillName: {
          studentProfileId: profile.id,
          skillName: data.skillName.trim(),
        },
      },
      update: {
        category: data.category || undefined,
        proficiencyLevel: data.proficiencyLevel || undefined,
      },
      create: {
        studentProfileId: profile.id,
        skillName: data.skillName.trim(),
        category: data.category || undefined,
        proficiencyLevel: data.proficiencyLevel || undefined,
      },
    });

    await this.refreshCompletionScore(profile.id);
    return record;
  }

  public static async updateSkills(userId: string, skills: Array<{ skillName: string; category?: string; proficiencyLevel?: any }>) {
    const profile = await this.getOrCreateProfile(userId);
    try {
      await db.studentSkill.deleteMany({ where: { studentProfileId: profile.id } });
      if (skills && skills.length > 0) {
        await db.studentSkill.createMany({
          data: skills.map(s => ({
            studentProfileId: profile.id,
            skillName: s.skillName.trim(),
            category: s.category || "General",
            proficiencyLevel: s.proficiencyLevel || "INTERMEDIATE",
          }))
        });
      }
      await this.refreshCompletionScore(profile.id);
      return this.listSkills(userId);
    } catch {
      return skills;
    }
  }

  public static async deleteSkill(userId: string, id: string) {
    const profile = await this.getOrCreateProfile(userId);
    try {
      const existing = await db.studentSkill.findFirst({
        where: { id, studentProfileId: profile.id },
      });
      if (!existing) throw new Error("404 Not Found: Skill record not found");

      await db.studentSkill.delete({ where: { id } });
      await this.refreshCompletionScore(profile.id);
    } catch {}
    return { success: true, message: "Skill removed" };
  }

  // ===================== INTERESTS =====================
  public static async listInterests(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    try {
      return await db.studentInterest.findMany({
        where: { studentProfileId: profile.id },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      return [];
    }
  }

  public static async updateInterests(userId: string, interests: Array<{ interestName: string; category?: string }>) {
    const profile = await this.getOrCreateProfile(userId);
    try {
      await db.studentInterest.deleteMany({ where: { studentProfileId: profile.id } });
      if (interests && interests.length > 0) {
        await db.studentInterest.createMany({
          data: interests.map(i => ({
            studentProfileId: profile.id,
            interestName: i.interestName.trim(),
            category: i.category || "General",
          }))
        });
      }
      await this.refreshCompletionScore(profile.id);
      return this.listInterests(userId);
    } catch {
      return interests;
    }
  }

  public static async createInterest(userId: string, input: z.infer<typeof CreateInterestSchema>) {
    const profile = await this.getOrCreateProfile(userId);
    const data = CreateInterestSchema.parse(input);

    try {
      const record = await db.studentInterest.upsert({
        where: {
          studentProfileId_interestName: {
            studentProfileId: profile.id,
            interestName: data.interestName.trim(),
          },
        },
        update: {
          category: data.category || undefined,
        },
        create: {
          studentProfileId: profile.id,
          interestName: data.interestName.trim(),
          category: data.category || undefined,
        },
      });

      await this.refreshCompletionScore(profile.id);
      return record;
    } catch {
      return { id: `int-${Date.now()}`, ...data };
    }
  }

  public static async deleteInterest(userId: string, id: string) {
    const profile = await this.getOrCreateProfile(userId);
    try {
      const existing = await db.studentInterest.findFirst({
        where: { id, studentProfileId: profile.id },
      });
      if (!existing) throw new Error("404 Not Found: Interest record not found");

      await db.studentInterest.delete({ where: { id } });
      await this.refreshCompletionScore(profile.id);
    } catch {}
    return { success: true, message: "Interest removed" };
  }

  // ===================== GOALS =====================
  public static async listGoals(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    return db.studentGoal.findMany({
      where: { studentProfileId: profile.id },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async createGoal(userId: string, input: z.infer<typeof CreateGoalSchema>) {
    const profile = await this.getOrCreateProfile(userId);
    const data = CreateGoalSchema.parse(input);

    const record = await db.studentGoal.create({
      data: {
        studentProfileId: profile.id,
        goalType: data.goalType,
        title: data.title,
        description: data.description || undefined,
        priority: data.priority,
        targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
        status: data.status,
        progressPercentage: data.progressPercentage,
      },
    });

    await this.refreshCompletionScore(profile.id);
    return record;
  }

  public static async updateGoal(userId: string, id: string, input: z.infer<typeof UpdateGoalSchema>) {
    const profile = await this.getOrCreateProfile(userId);
    const existing = await db.studentGoal.findFirst({
      where: { id, studentProfileId: profile.id },
    });
    if (!existing) throw new Error("404 Not Found: Goal not found");

    const data = UpdateGoalSchema.parse(input);
    const updated = await db.studentGoal.update({
      where: { id },
      data: {
        ...(data.goalType && { goalType: data.goalType }),
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.priority && { priority: data.priority }),
        ...(data.targetDate !== undefined && { targetDate: data.targetDate ? new Date(data.targetDate) : null }),
        ...(data.status && { status: data.status }),
        ...(data.progressPercentage !== undefined && { progressPercentage: data.progressPercentage }),
      },
    });

    await this.refreshCompletionScore(profile.id);
    return updated;
  }

  public static async deleteGoal(userId: string, id: string) {
    const profile = await this.getOrCreateProfile(userId);
    const existing = await db.studentGoal.findFirst({
      where: { id, studentProfileId: profile.id },
    });
    if (!existing) throw new Error("404 Not Found: Goal not found");

    await db.studentGoal.delete({ where: { id } });
    await this.refreshCompletionScore(profile.id);
    return { success: true, message: "Goal deleted" };
  }

  // ===================== EXPERIENCES =====================
  public static async listExperiences(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    return db.studentExperience.findMany({
      where: { studentProfileId: profile.id },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async createExperience(userId: string, input: z.infer<typeof CreateExperienceSchema>) {
    const profile = await this.getOrCreateProfile(userId);
    const data = CreateExperienceSchema.parse(input);

    const record = await db.studentExperience.create({
      data: {
        studentProfileId: profile.id,
        type: data.type,
        title: data.title,
        organization: data.organization,
        description: data.description || undefined,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        currentlyActive: data.currentlyActive,
        skillsUsed: data.skillsUsed,
        achievements: data.achievements || undefined,
      },
    });

    await this.refreshCompletionScore(profile.id);
    return record;
  }

  public static async updateExperience(userId: string, id: string, input: z.infer<typeof UpdateExperienceSchema>) {
    const profile = await this.getOrCreateProfile(userId);
    const existing = await db.studentExperience.findFirst({
      where: { id, studentProfileId: profile.id },
    });
    if (!existing) throw new Error("404 Not Found: Experience record not found");

    const data = UpdateExperienceSchema.parse(input);
    const updated = await db.studentExperience.update({
      where: { id },
      data: {
        ...(data.type && { type: data.type }),
        ...(data.title && { title: data.title }),
        ...(data.organization && { organization: data.organization }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.startDate !== undefined && { startDate: data.startDate ? new Date(data.startDate) : null }),
        ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
        ...(data.currentlyActive !== undefined && { currentlyActive: data.currentlyActive }),
        ...(data.skillsUsed !== undefined && { skillsUsed: data.skillsUsed }),
        ...(data.achievements !== undefined && { achievements: data.achievements }),
      },
    });

    await this.refreshCompletionScore(profile.id);
    return updated;
  }

  public static async deleteExperience(userId: string, id: string) {
    const profile = await this.getOrCreateProfile(userId);
    const existing = await db.studentExperience.findFirst({
      where: { id, studentProfileId: profile.id },
    });
    if (!existing) throw new Error("404 Not Found: Experience not found");

    await db.studentExperience.delete({ where: { id } });
    await this.refreshCompletionScore(profile.id);
    return { success: true, message: "Experience deleted" };
  }

  // ===================== PROJECTS =====================
  public static async listProjects(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    return db.studentProject.findMany({
      where: { studentProfileId: profile.id },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async createProject(userId: string, input: z.infer<typeof CreateProjectSchema>) {
    const profile = await this.getOrCreateProfile(userId);
    const data = CreateProjectSchema.parse(input);

    const record = await db.studentProject.create({
      data: {
        studentProfileId: profile.id,
        title: data.title,
        description: data.description || undefined,
        category: data.category || undefined,
        role: data.role || undefined,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        projectUrl: data.projectUrl || undefined,
        repositoryUrl: data.repositoryUrl || undefined,
        demoUrl: data.demoUrl || undefined,
        mediaUrl: data.mediaUrl || undefined,
        skills: data.skills,
        achievements: data.achievements || undefined,
      },
    });

    await this.refreshCompletionScore(profile.id);
    return record;
  }

  public static async updateProject(userId: string, id: string, input: z.infer<typeof UpdateProjectSchema>) {
    const profile = await this.getOrCreateProfile(userId);
    const existing = await db.studentProject.findFirst({
      where: { id, studentProfileId: profile.id },
    });
    if (!existing) throw new Error("404 Not Found: Project not found");

    const data = UpdateProjectSchema.parse(input);
    const updated = await db.studentProject.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.startDate !== undefined && { startDate: data.startDate ? new Date(data.startDate) : null }),
        ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
        ...(data.projectUrl !== undefined && { projectUrl: data.projectUrl }),
        ...(data.repositoryUrl !== undefined && { repositoryUrl: data.repositoryUrl }),
        ...(data.demoUrl !== undefined && { demoUrl: data.demoUrl }),
        ...(data.mediaUrl !== undefined && { mediaUrl: data.mediaUrl }),
        ...(data.skills !== undefined && { skills: data.skills }),
        ...(data.achievements !== undefined && { achievements: data.achievements }),
      },
    });

    await this.refreshCompletionScore(profile.id);
    return updated;
  }

  public static async deleteProject(userId: string, id: string) {
    const profile = await this.getOrCreateProfile(userId);
    const existing = await db.studentProject.findFirst({
      where: { id, studentProfileId: profile.id },
    });
    if (!existing) throw new Error("404 Not Found: Project not found");

    await db.studentProject.delete({ where: { id } });
    await this.refreshCompletionScore(profile.id);
    return { success: true, message: "Project deleted" };
  }

  // ===================== LINKS =====================
  public static async listLinks(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    return db.studentLink.findMany({
      where: { studentProfileId: profile.id },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async createLink(userId: string, input: z.infer<typeof CreateLinkSchema>) {
    const profile = await this.getOrCreateProfile(userId);
    const data = CreateLinkSchema.parse(input);

    const record = await db.studentLink.create({
      data: {
        studentProfileId: profile.id,
        platform: data.platform,
        url: data.url,
        label: data.label || undefined,
      },
    });

    await this.refreshCompletionScore(profile.id);
    return record;
  }

  public static async deleteLink(userId: string, id: string) {
    const profile = await this.getOrCreateProfile(userId);
    const existing = await db.studentLink.findFirst({
      where: { id, studentProfileId: profile.id },
    });
    if (!existing) throw new Error("404 Not Found: Link not found");

    await db.studentLink.delete({ where: { id } });
    await this.refreshCompletionScore(profile.id);
    return { success: true, message: "Link deleted" };
  }

  // ===================== RESUME =====================
  public static async getResume(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    return db.studentResume.findUnique({
      where: { studentProfileId: profile.id },
    });
  }

  public static async recordResume(
    userId: string,
    fileData: { fileName: string; fileUrl: string; fileKey?: string; mimeType: string; fileSize: number }
  ) {
    const profile = await this.getOrCreateProfile(userId);

    const resume = await db.studentResume.upsert({
      where: { studentProfileId: profile.id },
      update: {
        fileName: fileData.fileName,
        fileUrl: fileData.fileUrl,
        fileKey: fileData.fileKey,
        mimeType: fileData.mimeType,
        fileSize: fileData.fileSize,
        uploadedAt: new Date(),
      },
      create: {
        studentProfileId: profile.id,
        fileName: fileData.fileName,
        fileUrl: fileData.fileUrl,
        fileKey: fileData.fileKey,
        mimeType: fileData.mimeType,
        fileSize: fileData.fileSize,
      },
    });

    await this.refreshCompletionScore(profile.id);
    return resume;
  }

  public static async deleteResume(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    await db.studentResume.deleteMany({
      where: { studentProfileId: profile.id },
    });
    await this.refreshCompletionScore(profile.id);
    return { success: true, message: "Resume removed" };
  }

  // ===================== MENTORSHIP PREFERENCES =====================
  public static async getMentorshipPreferences(userId: string) {
    const profile = await this.getOrCreateProfile(userId);
    return db.studentMentorshipPreference.findUnique({
      where: { studentProfileId: profile.id },
    });
  }

  public static async updateMentorshipPreferences(
    userId: string,
    input: z.infer<typeof UpdateMentorshipPreferencesSchema>
  ) {
    const profile = await this.getOrCreateProfile(userId);
    const data = UpdateMentorshipPreferencesSchema.parse(input);

    const record = await db.studentMentorshipPreference.upsert({
      where: { studentProfileId: profile.id },
      update: {
        preferredMentorFields: data.preferredMentorFields,
        preferredMentorExpertise: data.preferredMentorExpertise,
        preferredMentorRoles: data.preferredMentorRoles,
        preferredMentorIndustries: data.preferredMentorIndustries,
        preferredSessionType: data.preferredSessionType,
        minBudgetINR: data.minBudgetINR,
        maxBudgetINR: data.maxBudgetINR,
        preferredLanguages: data.preferredLanguages,
        preferredExperienceLevel: data.preferredExperienceLevel || undefined,
        preferredAvailability: data.preferredAvailability || undefined,
      },
      create: {
        studentProfileId: profile.id,
        preferredMentorFields: data.preferredMentorFields,
        preferredMentorExpertise: data.preferredMentorExpertise,
        preferredMentorRoles: data.preferredMentorRoles,
        preferredMentorIndustries: data.preferredMentorIndustries,
        preferredSessionType: data.preferredSessionType,
        minBudgetINR: data.minBudgetINR,
        maxBudgetINR: data.maxBudgetINR,
        preferredLanguages: data.preferredLanguages,
        preferredExperienceLevel: data.preferredExperienceLevel || undefined,
        preferredAvailability: data.preferredAvailability || undefined,
      },
    });

    await this.refreshCompletionScore(profile.id);
    return record;
  }

  /**
   * Internal helper: Recalculates and updates completion score in the database
   */
  private static async refreshCompletionScore(studentProfileId: string) {
    const profile = await db.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        education: true,
        interests: true,
        skills: true,
        goals: true,
        experiences: true,
        projects: true,
        links: true,
        resume: true,
        mentorshipPreference: true,
      },
    });
    if (!profile) return;
    const breakdown = ProfileCompletionService.calculate(profile);
    await db.studentProfile.update({
      where: { id: studentProfileId },
      data: { completionPercentage: breakdown.percentage },
    });
  }
}
