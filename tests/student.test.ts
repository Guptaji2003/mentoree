import { describe, it, expect } from "vitest";
import { ProfileCompletionService } from "@/server/modules/students/profile-completion.service";
import {
  UpdateStudentProfileSchema,
  CreateEducationSchema,
  CreateGoalSchema,
  CreateSkillSchema,
  CreateInterestSchema,
} from "@/server/modules/students/student.schema";

describe("Field-Agnostic Student Profile System - Generalization Tests", () => {
  // Scenario 1: Computer Science Student
  it("Test 1: should represent Computer Science student without hardcoded branches", () => {
    const profile = UpdateStudentProfileSchema.parse({
      firstName: "Aarav",
      displayName: "Aarav S.",
      primaryField: "Computer Science & IT",
      primarySpecialization: "Distributed Systems",
      targetRole: "Software Engineer",
      isExploringCareer: false,
    });

    const edu = CreateEducationSchema.parse({
      institutionName: "IIT Delhi",
      educationLevel: "Undergraduate",
      degreeOrProgram: "B.Tech",
      fieldOfStudy: "Computer Science",
      currentStatus: "Currently Studying",
      gradeType: "CGPA",
      gradeValue: "8.9",
    });

    const skill1 = CreateSkillSchema.parse({ skillName: "React", category: "Technical" });
    const skill2 = CreateSkillSchema.parse({ skillName: "Node.js", category: "Technical" });
    const goal = CreateGoalSchema.parse({ goalType: "Get a Job", title: "Software Engineer at Top Tech" });

    expect(profile.primaryField).toBe("Computer Science & IT");
    expect(edu.gradeType).toBe("CGPA");
    expect(skill1.skillName).toBe("React");
    expect(goal.goalType).toBe("Get a Job");
  });

  // Scenario 2: Commerce & Finance Student
  it("Test 2: should represent Commerce & Finance student without engineering terminology", () => {
    const profile = UpdateStudentProfileSchema.parse({
      firstName: "Rhea",
      displayName: "Rhea M.",
      primaryField: "Commerce & Finance",
      primarySpecialization: "Investment Banking",
      targetRole: "Financial Analyst",
      isExploringCareer: false,
    });

    const edu = CreateEducationSchema.parse({
      institutionName: "St. Xavier's College",
      educationLevel: "Undergraduate",
      degreeOrProgram: "Bachelor of Commerce (B.Com)",
      fieldOfStudy: "Finance & Accounting",
      currentStatus: "Currently Studying",
      gradeType: "Percentage",
      gradeValue: "88%",
    });

    const skill = CreateSkillSchema.parse({ skillName: "Financial Modeling", category: "Domain-Specific", proficiencyLevel: "Advanced" });
    const goal = CreateGoalSchema.parse({ goalType: "Get an Internship", title: "Investment Banking Summer Analyst" });

    expect(profile.primaryField).toBe("Commerce & Finance");
    expect(edu.fieldOfStudy).toBe("Finance & Accounting");
    expect(edu.gradeType).toBe("Percentage");
    expect(skill.proficiencyLevel).toBe("Advanced");
    expect(goal.title).toContain("Investment Banking");
  });

  // Scenario 3: Arts & Humanities Student
  it("Test 3: should represent Arts & Psychology student with qualitative grading and research goals", () => {
    const profile = UpdateStudentProfileSchema.parse({
      firstName: "Ananya",
      displayName: "Ananya P.",
      primaryField: "Arts & Humanities",
      primarySpecialization: "Cognitive Psychology",
      targetRole: "Content Strategist / Research Associate",
      isExploringCareer: false,
    });

    const edu = CreateEducationSchema.parse({
      institutionName: "Lady Shri Ram College",
      educationLevel: "Undergraduate",
      degreeOrProgram: "BA Honours",
      fieldOfStudy: "Psychology",
      currentStatus: "Currently Studying",
      gradeType: "Grade",
      gradeValue: "A+",
    });

    const skill = CreateSkillSchema.parse({ skillName: "Scientific Writing", category: "Academic" });
    const goal = CreateGoalSchema.parse({ goalType: "Conduct Academic Research", title: "Publish Cognitive Bias Study" });

    expect(profile.primaryField).toBe("Arts & Humanities");
    expect(edu.gradeType).toBe("Grade");
    expect(skill.category).toBe("Academic");
    expect(goal.goalType).toBe("Conduct Academic Research");
  });

  // Scenario 4: Biology & Pure Science Student
  it("Test 4: should represent Biology / Pure Science student with laboratory skills", () => {
    const profile = UpdateStudentProfileSchema.parse({
      firstName: "Vikram",
      displayName: "Vikram S.",
      primaryField: "Pure & Applied Science",
      primarySpecialization: "Genomics & Biotechnology",
      targetRole: "Research Scientist",
    });

    const edu = CreateEducationSchema.parse({
      institutionName: "IISc Bangalore",
      educationLevel: "Postgraduate",
      degreeOrProgram: "Master of Science (M.Sc)",
      fieldOfStudy: "Biotechnology",
      currentStatus: "Currently Studying",
    });

    const skill = CreateSkillSchema.parse({ skillName: "PCR & DNA Sequencing", category: "Domain-Specific" });
    const goal = CreateGoalSchema.parse({ goalType: "Pursue Higher Education", title: "Ph.D. in Molecular Biology" });

    expect(profile.primaryField).toBe("Pure & Applied Science");
    expect(edu.educationLevel).toBe("Postgraduate");
    expect(skill.skillName).toContain("PCR");
    expect(goal.goalType).toBe("Pursue Higher Education");
  });

  // Scenario 5: Design Student
  it("Test 5: should represent Design student with creative portfolio and tools", () => {
    const profile = UpdateStudentProfileSchema.parse({
      firstName: "Meera",
      displayName: "Meera N.",
      primaryField: "Design & Creative Arts",
      primarySpecialization: "UI/UX & Product Design",
      targetRole: "Product Designer",
    });

    const edu = CreateEducationSchema.parse({
      institutionName: "National Institute of Design (NID)",
      educationLevel: "Undergraduate",
      degreeOrProgram: "Bachelor of Design (B.Des)",
      fieldOfStudy: "Interaction Design",
      currentStatus: "Currently Studying",
    });

    const skill = CreateSkillSchema.parse({ skillName: "Figma & Prototyping", category: "Creative" });
    const goal = CreateGoalSchema.parse({ goalType: "Build a Portfolio", title: "Complete 3 Case Studies on Behance" });

    expect(profile.primaryField).toBe("Design & Creative Arts");
    expect(skill.category).toBe("Creative");
    expect(goal.goalType).toBe("Build a Portfolio");
  });

  // Scenario 6: Law Student
  it("Test 6: should represent Law student with legal due diligence skills", () => {
    const profile = UpdateStudentProfileSchema.parse({
      firstName: "Rohan",
      displayName: "Rohan K.",
      primaryField: "Law & Legal Studies",
      primarySpecialization: "Corporate & M&A Law",
      targetRole: "Corporate Associate",
    });

    const edu = CreateEducationSchema.parse({
      institutionName: "National Law School of India University (NLSIU)",
      educationLevel: "Undergraduate",
      degreeOrProgram: "B.A. LL.B. (Hons.)",
      fieldOfStudy: "Corporate Law",
      currentStatus: "Currently Studying",
    });

    const skill = CreateSkillSchema.parse({ skillName: "Legal Due Diligence", category: "Domain-Specific" });
    const goal = CreateGoalSchema.parse({ goalType: "Get an Internship", title: "Tier-1 Law Firm Corporate Internship" });

    expect(profile.primaryField).toBe("Law & Legal Studies");
    expect(edu.degreeOrProgram).toContain("LL.B.");
    expect(skill.skillName).toBe("Legal Due Diligence");
  });

  // Scenario 7: Exploring / Undecided Student
  it("Test 7: should allow an undecided/exploring student to complete profile without forcing a target role", () => {
    const profile = UpdateStudentProfileSchema.parse({
      firstName: "Dev",
      displayName: "Dev G.",
      primaryField: "Exploring / Undecided",
      isExploringCareer: true,
      targetRole: undefined,
    });

    const edu = CreateEducationSchema.parse({
      institutionName: "Delhi Public School",
      educationLevel: "Higher Secondary",
      fieldOfStudy: "General Studies",
      currentStatus: "Currently Studying",
      gradeType: "Pass/Fail",
      gradeValue: "Pass",
    });

    const interest = CreateInterestSchema.parse({ interestName: "Business & Technology" });
    const goal = CreateGoalSchema.parse({ goalType: "Explore Career Options", title: "Discover suited career pathways with mentors" });

    expect(profile.primaryField).toBe("Exploring / Undecided");
    expect(profile.isExploringCareer).toBe(true);
    expect(profile.targetRole).toBeUndefined();
    expect(interest.interestName).toBe("Business & Technology");
    expect(goal.goalType).toBe("Explore Career Options");
  });

  // Profile Completion Score Tests
  it("Test 8: should calculate high profile completion (95%) without resume, CGPA, or GitHub", () => {
    const mockStudent = {
      firstName: "Pooja",
      displayName: "Pooja V.",
      bio: "Second year commerce student exploring career pathways in finance.",
      primaryField: "Commerce & Finance",
      isExploringCareer: true,
      education: [
        { institutionName: "SRCC", educationLevel: "Undergraduate", fieldOfStudy: "Commerce" },
      ],
      interests: [
        { interestName: "Financial Modeling" },
        { interestName: "Equity Research" },
      ],
      skills: [
        { skillName: "Excel", category: "Domain-Specific" },
      ],
      goals: [
        { goalType: "Get an Internship", title: "Summer Analyst" },
      ],
      experiences: [
        { type: "Student Organization", title: "Finance Club Member", organization: "SRCC" },
      ],
      links: [
        { platform: "LinkedIn", url: "https://linkedin.com/in/poojav" },
      ],
      mentorshipPreference: {
        preferredMentorFields: ["Commerce & Finance"],
        preferredMentorExpertise: ["Equity Research"],
        preferredLanguages: ["English", "Hindi"],
      },
      // Note: resume is undefined, CGPA is undefined, GitHub is undefined
      resume: null,
    };

    const breakdown = ProfileCompletionService.calculate(mockStudent);
    expect(breakdown.percentage).toBeGreaterThanOrEqual(95);
    expect(breakdown.sections.education.completed).toBe(true);
    expect(breakdown.sections.goals.completed).toBe(true);
    expect(breakdown.sections.fieldAndInterests.completed).toBe(true);
  });
});
