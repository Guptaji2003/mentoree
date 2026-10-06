// Generic, Field-Agnostic Student Types

export type ProfileVisibility = "PUBLIC" | "MENTORS_ONLY" | "PRIVATE";

export type EducationLevel =
  | "School"
  | "Higher Secondary"
  | "Diploma"
  | "Undergraduate"
  | "Postgraduate"
  | "Doctorate"
  | "Certification"
  | "Vocational"
  | "Other";

export type EducationStatus =
  | "Currently Studying"
  | "Graduated"
  | "Completed"
  | "On Break"
  | "Dropped Out"
  | "Other";

export type GradeType =
  | "CGPA"
  | "GPA"
  | "Percentage"
  | "Grade"
  | "Marks"
  | "Pass/Fail"
  | "Not Applicable";

export type SkillCategory =
  | "Technical"
  | "Professional"
  | "Creative"
  | "Academic"
  | "Domain-Specific";

export type SkillProficiency = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type GoalType =
  | "Internship"
  | "Job"
  | "Entrance Exam"
  | "Learn Skill"
  | "Build Portfolio"
  | "Start Business"
  | "Interview Prep"
  | "Career Switch"
  | "Higher Education"
  | "Research"
  | "Academic Performance"
  | "Industry Guidance"
  | "Explore Options"
  | "Freelancing"
  | "Competitive Exams"
  | "Get a Job"
  | "Get an Internship"
  | "Prepare for Interviews"
  | "Learn a New Skill"
  | "Improve Existing Skills"
  | "Build a Portfolio"
  | "Prepare for an Entrance Exam"
  | "Conduct Academic Research"
  | "Start a Business / Venture"
  | "Explore Career Options"
  | "Other"
  | (string & {});

export type GoalPriority = "Low" | "Medium" | "High";
export type GoalStatus = "Not Started" | "In Progress" | "Completed" | "Paused";

export type ExperienceType =
  | "Internship"
  | "Project"
  | "Freelance"
  | "Volunteer"
  | "Research"
  | "Part-time"
  | "Student Organization"
  | "Competition"
  | "Entrepreneurship"
  | "Other";

export type LinkPlatform =
  | "LinkedIn"
  | "GitHub"
  | "Portfolio"
  | "Behance"
  | "Dribbble"
  | "Medium"
  | "ResearchGate"
  | "Google Scholar"
  | "Personal Website"
  | "YouTube"
  | "Instagram"
  | "Other";

export type SessionTypePreference = "Video" | "Audio" | "Chat" | "Any";

export interface StudentEducation {
  id: string;
  studentProfileId?: string;
  institutionName: string;
  educationLevel: EducationLevel | string;
  degreeOrProgram?: string;
  fieldOfStudy?: string;
  specialization?: string;
  startDate?: string;
  expectedEndDate?: string;
  completionDate?: string;
  currentStatus: EducationStatus | string;
  gradeType?: GradeType | string;
  gradeValue?: string;
  description?: string;
}

export interface StudentInterestItem {
  id: string;
  interestName: string;
  category?: string;
}

export interface StudentSkillItem {
  id: string;
  skillName: string;
  category?: SkillCategory | string;
  proficiencyLevel?: SkillProficiency | string;
}

export interface StudentGoalItem {
  id: string;
  goalType: GoalType | string;
  title: string;
  description?: string;
  priority: GoalPriority | string;
  targetDate?: string;
  status: GoalStatus | string;
  progressPercentage: number;
}

export interface StudentExperienceItem {
  id: string;
  type: ExperienceType | string;
  title: string;
  organization: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  currentlyActive: boolean;
  skillsUsed: string[];
  achievements?: string;
}

export interface StudentProjectItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  projectUrl?: string;
  repositoryUrl?: string;
  demoUrl?: string;
  mediaUrl?: string;
  skills: string[];
  achievements?: string;
}

export interface StudentLinkItem {
  id: string;
  platform: LinkPlatform | string;
  url: string;
  label?: string;
}

export interface StudentResumeItem {
  id: string;
  fileName: string;
  fileUrl: string;
  fileKey?: string;
  mimeType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface StudentMentorshipPreferenceItem {
  id?: string;
  preferredMentorFields: string[];
  preferredMentorExpertise: string[];
  preferredMentorRoles: string[];
  preferredMentorIndustries: string[];
  preferredSessionType: SessionTypePreference | string;
  minBudgetINR: number;
  maxBudgetINR: number;
  preferredLanguages: string[];
  preferredExperienceLevel?: string;
  preferredAvailability?: string;
}

export interface StudentTargetOrganizationItem {
  id: string;
  organizationName: string;
  type?: string;
}

export interface StudentProfileData {
  id: string;
  userId: string;
  firstName: string;
  lastName?: string;
  displayName: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  city?: string;
  bio?: string;
  profilePhoto?: string;
  primaryField?: string;
  primarySpecialization?: string;
  targetRole?: string;
  targetDomain?: string;
  targetIndustry?: string;
  isExploringCareer: boolean;
  profileVisibility: ProfileVisibility;
  completionPercentage: number;
  draftStep: number;
  isDraftCompleted: boolean;
  createdAt: string;
  updatedAt: string;

  education: StudentEducation[];
  interests: StudentInterestItem[];
  skills: StudentSkillItem[];
  goals: StudentGoalItem[];
  experiences: StudentExperienceItem[];
  projects: StudentProjectItem[];
  links: StudentLinkItem[];
  resume?: StudentResumeItem | null;
  mentorshipPreference?: StudentMentorshipPreferenceItem | null;
  targetOrganizations: StudentTargetOrganizationItem[];
}

export interface ProfileCompletionBreakdown {
  percentage: number;
  sections: {
    basicInfo: { completed: boolean; weight: number; label: string; tip?: string };
    education: { completed: boolean; weight: number; label: string; tip?: string };
    fieldAndInterests: { completed: boolean; weight: number; label: string; tip?: string };
    skills: { completed: boolean; weight: number; label: string; tip?: string };
    goals: { completed: boolean; weight: number; label: string; tip?: string };
    experienceOrProjects: { completed: boolean; weight: number; label: string; tip?: string };
    careerDirection: { completed: boolean; weight: number; label: string; tip?: string };
    linksOrResume: { completed: boolean; weight: number; label: string; tip?: string };
    mentorshipPreferences: { completed: boolean; weight: number; label: string; tip?: string };
  };
  recommendations: string[];
}
