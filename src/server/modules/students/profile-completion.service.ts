import { ProfileCompletionBreakdown } from "@/types/student";

export interface StudentProfileEntityForCompletion {
  firstName?: string | null;
  displayName?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
  country?: string | null;
  primaryField?: string | null;
  targetRole?: string | null;
  isExploringCareer?: boolean;
  education?: any[];
  interests?: any[];
  skills?: any[];
  goals?: any[];
  experiences?: any[];
  projects?: any[];
  links?: any[];
  resume?: any | null;
  mentorshipPreference?: any | null;
}

export class ProfileCompletionService {
  public static calculate(profile: StudentProfileEntityForCompletion): ProfileCompletionBreakdown {
    // 1. Basic Info (15%)
    const hasBasic = Boolean(
      profile.firstName &&
      profile.displayName &&
      (profile.bio || profile.phoneNumber || profile.country)
    );
    const basicWeight = 15;

    // 2. Education (15%)
    const hasEducation = Boolean(profile.education && profile.education.length > 0);
    const educationWeight = 15;

    // 3. Field & Interests (15%)
    const hasFieldAndInterests = Boolean(
      profile.primaryField &&
      profile.interests &&
      profile.interests.length > 0
    );
    const fieldWeight = 15;

    // 4. Skills (10%)
    const hasSkills = Boolean(profile.skills && profile.skills.length > 0);
    const skillsWeight = 10;

    // 5. Goals (15%)
    const hasGoals = Boolean(profile.goals && profile.goals.length > 0);
    const goalsWeight = 15;

    // 6. Experience or Projects (10%)
    const hasExpOrProjects = Boolean(
      (profile.experiences && profile.experiences.length > 0) ||
      (profile.projects && profile.projects.length > 0)
    );
    const expWeight = 10;

    // 7. Career Direction / Exploration (10%)
    const hasCareerDirection = Boolean(
      profile.targetRole ||
      profile.isExploringCareer ||
      profile.primaryField
    );
    const careerWeight = 10;

    // 8. Links or Resume (5%)
    const hasLinksOrResume = Boolean(
      (profile.links && profile.links.length > 0) ||
      profile.resume
    );
    const linksWeight = 5;

    // 9. Mentorship Preferences (5%)
    const hasPreferences = Boolean(
      profile.mentorshipPreference &&
      (profile.mentorshipPreference.preferredMentorFields?.length > 0 ||
       profile.mentorshipPreference.preferredMentorExpertise?.length > 0 ||
       profile.mentorshipPreference.preferredLanguages?.length > 0)
    );
    const prefWeight = 5;

    let totalScore = 0;
    if (hasBasic) totalScore += basicWeight;
    if (hasEducation) totalScore += educationWeight;
    if (hasFieldAndInterests) totalScore += fieldWeight;
    if (hasSkills) totalScore += skillsWeight;
    if (hasGoals) totalScore += goalsWeight;
    if (hasExpOrProjects) totalScore += expWeight;
    if (hasCareerDirection) totalScore += careerWeight;
    if (hasLinksOrResume) totalScore += linksWeight;
    if (hasPreferences) totalScore += prefWeight;

    const recommendations: string[] = [];
    if (!hasGoals) {
      recommendations.push("Set a primary learning or career goal to receive targeted mentor recommendations.");
    }
    if (!hasFieldAndInterests) {
      recommendations.push("Select your academic field and interests to help mentors understand your domain.");
    }
    if (!hasSkills) {
      recommendations.push("Add key skills you want to strengthen or practice with mentors.");
    }
    if (!hasEducation) {
      recommendations.push("Add your current school, college, or certification to personalize guidance.");
    }
    if (!hasPreferences) {
      recommendations.push("Specify your mentorship budget and preferred session format for better matches.");
    }

    return {
      percentage: Math.min(100, totalScore),
      sections: {
        basicInfo: {
          completed: hasBasic,
          weight: basicWeight,
          label: "Basic Profile",
          tip: "Add your name, location, and a brief bio about your learning journey.",
        },
        education: {
          completed: hasEducation,
          weight: educationWeight,
          label: "Education Background",
          tip: "Add current or completed degrees, diplomas, or certificates.",
        },
        fieldAndInterests: {
          completed: hasFieldAndInterests,
          weight: fieldWeight,
          label: "Academic Field & Interests",
          tip: "Select your domain and specific topic interests.",
        },
        skills: {
          completed: hasSkills,
          weight: skillsWeight,
          label: "Skills & Proficiencies",
          tip: "Add technical, creative, academic, or professional skills.",
        },
        goals: {
          completed: hasGoals,
          weight: goalsWeight,
          label: "Learning & Career Goals",
          tip: "Define milestones like internships, exams, or skill acquisition.",
        },
        experienceOrProjects: {
          completed: hasExpOrProjects,
          weight: expWeight,
          label: "Projects & Experiences",
          tip: "Showcase coursework, internships, research, or creative projects.",
        },
        careerDirection: {
          completed: hasCareerDirection,
          weight: careerWeight,
          label: "Target Direction",
          tip: "Specify target roles or mark that you are exploring options.",
        },
        linksOrResume: {
          completed: hasLinksOrResume,
          weight: linksWeight,
          label: "Links & Portfolio / Resume",
          tip: "Attach optional portfolio links, Behance, LinkedIn, or CV.",
        },
        mentorshipPreferences: {
          completed: hasPreferences,
          weight: prefWeight,
          label: "Mentorship Preferences",
          tip: "Set preferred format (Video/Audio/Chat), languages, and budget.",
        },
      },
      recommendations,
    };
  }
}
