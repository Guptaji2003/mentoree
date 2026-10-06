import { z } from "zod";

export const ProfileVisibilityEnum = z.enum(["PUBLIC", "MENTORS_ONLY", "PRIVATE"]);

// Base Profile Setup / Update Schema
export const UpdateStudentProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100).optional(),
  lastName: z.string().max(100).optional().nullable(),
  displayName: z.string().min(1, "Display name is required").max(100).optional(),
  phoneNumber: z.string().max(30).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  bio: z.string().max(2000, "Bio cannot exceed 2000 characters").optional().nullable(),
  profilePhoto: z.string().url("Invalid photo URL").optional().nullable(),
  primaryField: z.string().max(150).optional().nullable(),
  primarySpecialization: z.string().max(150).optional().nullable(),
  targetRole: z.string().max(150).optional().nullable(),
  targetDomain: z.string().max(150).optional().nullable(),
  targetIndustry: z.string().max(150).optional().nullable(),
  isExploringCareer: z.boolean().optional(),
  profileVisibility: ProfileVisibilityEnum.optional(),
  draftStep: z.number().int().min(1).max(12).optional(),
  isDraftCompleted: z.boolean().optional(),
});

export const CreateEducationSchema = z.object({
  institutionName: z.string().min(1, "Institution name is required").max(200),
  educationLevel: z.string().min(1, "Education level is required").max(100),
  degreeOrProgram: z.string().max(150).optional().nullable(),
  fieldOfStudy: z.string().max(150).optional().nullable(),
  specialization: z.string().max(150).optional().nullable(),
  startDate: z.string().optional().nullable(),
  expectedEndDate: z.string().optional().nullable(),
  completionDate: z.string().optional().nullable(),
  currentStatus: z.string().max(100).default("Currently Studying"),
  gradeType: z.string().max(50).optional().nullable(),
  gradeValue: z.string().max(50).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
});

export const UpdateEducationSchema = CreateEducationSchema.partial();

export const CreateSkillSchema = z.object({
  skillName: z.string().min(1, "Skill name is required").max(100),
  category: z.string().max(100).optional().nullable(),
  proficiencyLevel: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).optional().nullable(),
});

export const CreateInterestSchema = z.object({
  interestName: z.string().min(1, "Interest name is required").max(100),
  category: z.string().max(100).optional().nullable(),
});

export const CreateGoalSchema = z.object({
  goalType: z.string().min(1, "Goal type is required").max(100),
  title: z.string().min(1, "Goal title is required").max(200),
  description: z.string().max(2000).optional().nullable(),
  priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
  targetDate: z.string().optional().nullable(),
  status: z.enum(["Not Started", "In Progress", "Completed", "Paused"]).default("In Progress"),
  progressPercentage: z.number().int().min(0).max(100).default(0),
});

export const UpdateGoalSchema = CreateGoalSchema.partial();

export const CreateExperienceSchema = z.object({
  type: z.string().min(1, "Experience type is required").max(100),
  title: z.string().min(1, "Title is required").max(150),
  organization: z.string().min(1, "Organization is required").max(200),
  description: z.string().max(3000).optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  currentlyActive: z.boolean().default(false),
  skillsUsed: z.array(z.string()).default([]),
  achievements: z.string().max(2000).optional().nullable(),
});

export const UpdateExperienceSchema = CreateExperienceSchema.partial();

export const CreateProjectSchema = z.object({
  title: z.string().min(1, "Project title is required").max(150),
  description: z.string().max(3000).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  role: z.string().max(100).optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  projectUrl: z.string().url("Invalid project URL").optional().nullable().or(z.literal("")),
  repositoryUrl: z.string().url("Invalid repository URL").optional().nullable().or(z.literal("")),
  demoUrl: z.string().url("Invalid demo URL").optional().nullable().or(z.literal("")),
  mediaUrl: z.string().url("Invalid media URL").optional().nullable().or(z.literal("")),
  skills: z.array(z.string()).default([]),
  achievements: z.string().max(2000).optional().nullable(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export const CreateLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required").max(100),
  url: z.string().url("Must be a valid URL").min(1),
  label: z.string().max(100).optional().nullable(),
});

export const UpdateLinkSchema = CreateLinkSchema.partial();

export const UpdateMentorshipPreferencesSchema = z.object({
  preferredMentorFields: z.array(z.string()).default([]),
  preferredMentorExpertise: z.array(z.string()).default([]),
  preferredMentorRoles: z.array(z.string()).default([]),
  preferredMentorIndustries: z.array(z.string()).default([]),
  preferredSessionType: z.enum(["Video", "Audio", "Chat", "Any"]).default("Video"),
  minBudgetINR: z.number().int().min(0).default(0),
  maxBudgetINR: z.number().int().min(0).max(50000).default(3000),
  preferredLanguages: z.array(z.string()).default(["English", "Hindi"]),
  preferredExperienceLevel: z.string().optional().nullable(),
  preferredAvailability: z.string().optional().nullable(),
});

export const RecommendationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  field: z.string().optional(),
  expertise: z.string().optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  availability: z.string().optional(),
  language: z.string().optional(),
});
