"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Target, 
  Briefcase, 
  Layers, 
  Link as LinkIcon, 
  FileText, 
  Sliders, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Loader2, 
  HelpCircle, 
  Compass, 
  User, 
  Award,
  Globe,
  UploadCloud,
  Eye,
  ShieldCheck
} from "lucide-react";
import { 
  StudentProfileData, 
  EducationLevel, 
  EducationStatus, 
  GradeType, 
  SkillCategory, 
  SkillProficiency, 
  GoalType, 
  GoalPriority, 
  ExperienceType,
  LinkPlatform,
  SessionTypePreference,
  ProfileVisibility
} from "@/types/student";

const SETUP_STEPS = [
  { step: 1, title: "Welcome", icon: Sparkles, desc: "Get started" },
  { step: 2, title: "Basic Info", icon: User, desc: "Who you are" },
  { step: 3, title: "Education", icon: GraduationCap, desc: "Your background" },
  { step: 4, title: "Field & Interests", icon: BookOpen, desc: "What you study" },
  { step: 5, title: "Skills", icon: Layers, desc: "Your abilities" },
  { step: 6, title: "Goals", icon: Target, desc: "Where you want to go" },
  { step: 7, title: "Experience & Projects", icon: Briefcase, desc: "What you've built" },
  { step: 8, title: "Career Direction", icon: Compass, desc: "Target domains" },
  { step: 9, title: "Links & Resume", icon: LinkIcon, desc: "Portfolio & CV" },
  { step: 10, title: "Mentorship", icon: Sliders, desc: "Mentor preferences" },
  { step: 11, title: "Review & Finish", icon: CheckCircle2, desc: "Complete profile" },
];

export default function StudentProfileSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Taxonomies loaded from API
  const [fieldCategories, setFieldCategories] = useState<any[]>([]);
  const [taxInterests, setTaxInterests] = useState<any[]>([]);
  const [taxSkills, setTaxSkills] = useState<any[]>([]);

  // Step 2: Basic Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("India");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [visibility, setVisibility] = useState<ProfileVisibility>("MENTORS_ONLY");

  // Step 3: Education
  const [educationList, setEducationList] = useState<any[]>([]);
  const [newInst, setNewInst] = useState("");
  const [newLevel, setNewLevel] = useState<EducationLevel>("Undergraduate");
  const [newDegree, setNewDegree] = useState("");
  const [newField, setNewField] = useState("");
  const [newStatus, setNewStatus] = useState<EducationStatus>("Currently Studying");
  const [newGradeType, setNewGradeType] = useState<GradeType>("Percentage");
  const [newGradeVal, setNewGradeVal] = useState("");

  // Step 4: Field & Interests
  const [selectedPrimaryField, setSelectedPrimaryField] = useState("Commerce & Finance");
  const [specialization, setSpecialization] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterestInput, setCustomInterestInput] = useState("");

  // Step 5: Skills
  const [selectedSkills, setSelectedSkills] = useState<{ name: string; category: string; proficiency: string }[]>([]);
  const [customSkillName, setCustomSkillName] = useState("");
  const [customSkillCat, setCustomSkillCat] = useState("Professional");
  const [customSkillProf, setCustomSkillProf] = useState("Intermediate");

  // Step 6: Goals
  const [goalsList, setGoalsList] = useState<any[]>([]);
  const [newGoalType, setNewGoalType] = useState<GoalType>("Get a Job");
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDesc, setNewGoalDesc] = useState("");
  const [newGoalPriority, setNewGoalPriority] = useState<GoalPriority>("High");

  // Step 7: Experience & Projects
  const [experiences, setExperiences] = useState<any[]>([]);
  const [newExpType, setNewExpType] = useState<ExperienceType>("Internship");
  const [newExpTitle, setNewExpTitle] = useState("");
  const [newExpOrg, setNewExpOrg] = useState("");
  const [newExpDesc, setNewExpDesc] = useState("");

  const [projects, setProjects] = useState<any[]>([]);
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjUrl, setNewProjUrl] = useState("");

  // Step 8: Career Direction
  const [isExploring, setIsExploring] = useState(false);
  const [targetRole, setTargetRole] = useState("");
  const [targetIndustry, setTargetIndustry] = useState("");
  const [targetOrganizations, setTargetOrganizations] = useState<string[]>([]);
  const [orgInput, setOrgInput] = useState("");

  // Step 9: Links & Resume
  const [links, setLinks] = useState<{ platform: string; url: string }[]>([]);
  const [newLinkPlatform, setNewLinkPlatform] = useState<LinkPlatform>("LinkedIn");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);

  // Step 10: Mentorship Preferences
  const [prefSessionType, setPrefSessionType] = useState<SessionTypePreference>("Video");
  const [minBudget, setMinBudget] = useState(500);
  const [maxBudget, setMaxBudget] = useState(2500);
  const [prefLanguages, setPrefLanguages] = useState<string[]>(["English", "Hindi"]);
  const [prefExperience, setPrefExperience] = useState("3-5 years");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load initial profile data and taxonomies
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Load taxonomies
        const taxRes = await fetch("/api/taxonomy");
        if (taxRes.ok) {
          const taxData = await taxRes.json();
          setFieldCategories(taxData.data?.fields || []);
          setTaxInterests(taxData.data?.interests || []);
          setTaxSkills(taxData.data?.skills || []);
        }

        // Load existing student profile
        const profRes = await fetch("/api/student/profile");
        if (profRes.ok) {
          const profData = await profRes.json();
          const p: StudentProfileData = profData.data?.profile;
          if (p) {
            setFirstName(p.firstName || "");
            setLastName(p.lastName || "");
            setDisplayName(p.displayName || "");
            setPhoneNumber(p.phoneNumber || "");
            setCountry(p.country || "India");
            setCity(p.city || "");
            setBio(p.bio || "");
            setVisibility(p.profileVisibility || "MENTORS_ONLY");

            if (p.primaryField) setSelectedPrimaryField(p.primaryField);
            if (p.primarySpecialization) setSpecialization(p.primarySpecialization);
            setIsExploring(p.isExploringCareer || false);
            if (p.targetRole) setTargetRole(p.targetRole);
            if (p.targetIndustry) setTargetIndustry(p.targetIndustry);

            if (p.education && p.education.length > 0) setEducationList(p.education);
            if (p.interests && p.interests.length > 0) setSelectedInterests(p.interests.map(i => i.interestName));
            if (p.skills && p.skills.length > 0) setSelectedSkills(p.skills.map(s => ({ name: s.skillName, category: s.category || "General", proficiency: s.proficiencyLevel || "Intermediate" })));
            if (p.goals && p.goals.length > 0) setGoalsList(p.goals);
            if (p.experiences && p.experiences.length > 0) setExperiences(p.experiences);
            if (p.projects && p.projects.length > 0) setProjects(p.projects);
            if (p.links && p.links.length > 0) setLinks(p.links);
            if (p.resume) setResumeFileName(p.resume.fileName);

            if (p.mentorshipPreference) {
              setPrefSessionType((p.mentorshipPreference.preferredSessionType as any) || "Video");
              setMinBudget(p.mentorshipPreference.minBudgetINR || 500);
              setMaxBudget(p.mentorshipPreference.maxBudgetINR || 2500);
              if (p.mentorshipPreference.preferredLanguages) setPrefLanguages(p.mentorshipPreference.preferredLanguages);
              if (p.mentorshipPreference.preferredExperienceLevel) setPrefExperience(p.mentorshipPreference.preferredExperienceLevel);
            }

            if (p.draftStep && p.draftStep > 1 && !p.isDraftCompleted) {
              setCurrentStep(p.draftStep);
            }
          }
        }
      } catch (err) {
        console.error("Setup load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Save draft on each step progression
  const saveDraftToBackend = async (nextStepNumber?: number) => {
    setSaving(true);
    try {
      await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          displayName: displayName.trim() || undefined,
          phoneNumber: phoneNumber.trim() || undefined,
          country,
          city: city.trim() || undefined,
          bio: bio.trim() || undefined,
          primaryField: selectedPrimaryField,
          primarySpecialization: specialization.trim() || undefined,
          targetRole: isExploring ? "Exploring Options" : targetRole.trim() || undefined,
          targetIndustry: targetIndustry.trim() || undefined,
          isExploringCareer: isExploring,
          profileVisibility: visibility,
          draftStep: nextStepNumber || currentStep,
          isDraftCompleted: nextStepNumber === 11,
        }),
      });

      // Save preferences
      await fetch("/api/student/profile/mentorship-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferredMentorFields: [selectedPrimaryField],
          preferredMentorExpertise: selectedInterests.slice(0, 5),
          preferredMentorRoles: targetRole ? [targetRole] : [],
          preferredMentorIndustries: targetIndustry ? [targetIndustry] : [],
          preferredSessionType: prefSessionType,
          minBudgetINR: minBudget,
          maxBudgetINR: maxBudget,
          preferredLanguages: prefLanguages,
          preferredExperienceLevel: prefExperience,
        }),
      });
    } catch (err) {
      console.error("Draft save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < 11) {
      const next = currentStep + 1;
      await saveDraftToBackend(next);
      setCurrentStep(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinish = async () => {
    await saveDraftToBackend(11);
    showToast("🎉 Profile created successfully! Welcome to Mentoree.");
    router.push("/dashboard");
  };

  // Step 3 helper: Add Education
  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInst.trim()) {
      showToast("⚠️ Institution name is required");
      return;
    }
    const item = {
      institutionName: newInst.trim(),
      educationLevel: newLevel,
      degreeOrProgram: newDegree.trim() || undefined,
      fieldOfStudy: newField.trim() || undefined,
      currentStatus: newStatus,
      gradeType: newGradeType,
      gradeValue: newGradeVal.trim() || undefined,
    };
    try {
      const res = await fetch("/api/student/profile/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const data = await res.json();
        setEducationList(prev => [data.data, ...prev]);
        setNewInst("");
        setNewDegree("");
        setNewField("");
        setNewGradeVal("");
        showToast("✅ Education record added");
      }
    } catch {
      setEducationList(prev => [{ id: `edu-${Date.now()}`, ...item }, ...prev]);
      showToast("✅ Education record added");
    }
  };

  // Step 4 helper: Add interest
  const toggleInterest = async (interest: string) => {
    const isSelected = selectedInterests.includes(interest);
    if (isSelected) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
      try {
        await fetch("/api/student/profile/interests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interestName: interest, category: selectedPrimaryField }),
        });
      } catch {}
    }
  };

  const handleAddCustomInterest = async () => {
    if (!customInterestInput.trim()) return;
    const val = customInterestInput.trim();
    if (!selectedInterests.includes(val)) {
      setSelectedInterests(prev => [...prev, val]);
      try {
        await fetch("/api/student/profile/interests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ interestName: val, category: selectedPrimaryField }),
        });
      } catch {}
    }
    setCustomInterestInput("");
  };

  // Step 5 helper: Add skill
  const handleAddSkill = async () => {
    if (!customSkillName.trim()) return;
    const skillItem = {
      name: customSkillName.trim(),
      category: customSkillCat,
      proficiency: customSkillProf,
    };
    setSelectedSkills(prev => [...prev, skillItem]);
    try {
      await fetch("/api/student/profile/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillName: skillItem.name,
          category: skillItem.category,
          proficiencyLevel: skillItem.proficiency,
        }),
      });
    } catch {}
    setCustomSkillName("");
    showToast("⚡ Skill added");
  };

  // Step 6 helper: Add Goal
  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    const goalItem = {
      goalType: newGoalType,
      title: newGoalTitle.trim(),
      description: newGoalDesc.trim() || undefined,
      priority: newGoalPriority,
      status: "In Progress",
      progressPercentage: 15,
    };
    try {
      const res = await fetch("/api/student/profile/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goalItem),
      });
      if (res.ok) {
        const data = await res.json();
        setGoalsList(prev => [data.data, ...prev]);
      } else {
        setGoalsList(prev => [{ id: `goal-${Date.now()}`, ...goalItem }, ...prev]);
      }
    } catch {
      setGoalsList(prev => [{ id: `goal-${Date.now()}`, ...goalItem }, ...prev]);
    }
    setNewGoalTitle("");
    setNewGoalDesc("");
    showToast("🎯 Learning goal saved");
  };

  // Step 7 helper: Add Experience / Project
  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpTitle.trim() || !newExpOrg.trim()) return;
    const expItem = {
      type: newExpType,
      title: newExpTitle.trim(),
      organization: newExpOrg.trim(),
      description: newExpDesc.trim() || undefined,
      currentlyActive: true,
      skillsUsed: [],
    };
    try {
      const res = await fetch("/api/student/profile/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expItem),
      });
      if (res.ok) {
        const data = await res.json();
        setExperiences(prev => [data.data, ...prev]);
      } else {
        setExperiences(prev => [{ id: `exp-${Date.now()}`, ...expItem }, ...prev]);
      }
    } catch {
      setExperiences(prev => [{ id: `exp-${Date.now()}`, ...expItem }, ...prev]);
    }
    setNewExpTitle("");
    setNewExpOrg("");
    setNewExpDesc("");
    showToast("💼 Experience added");
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;
    const projItem = {
      title: newProjTitle.trim(),
      description: newProjDesc.trim() || undefined,
      projectUrl: newProjUrl.trim() || undefined,
      skills: [],
    };
    try {
      const res = await fetch("/api/student/profile/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projItem),
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(prev => [data.data, ...prev]);
      } else {
        setProjects(prev => [{ id: `proj-${Date.now()}`, ...projItem }, ...prev]);
      }
    } catch {
      setProjects(prev => [{ id: `proj-${Date.now()}`, ...projItem }, ...prev]);
    }
    setNewProjTitle("");
    setNewProjDesc("");
    setNewProjUrl("");
    showToast("🚀 Project added");
  };

  // Step 8 helper: Add Target Org
  const handleAddTargetOrg = () => {
    if (!orgInput.trim()) return;
    setTargetOrganizations(prev => [...prev, orgInput.trim()]);
    setOrgInput("");
  };

  // Step 9 helper: Add Link
  const handleAddLink = async () => {
    if (!newLinkUrl.trim()) return;
    const linkItem = { platform: newLinkPlatform, url: newLinkUrl.trim() };
    setLinks(prev => [...prev, linkItem]);
    try {
      await fetch("/api/student/profile/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(linkItem),
      });
    } catch {}
    setNewLinkUrl("");
    showToast("🔗 Link saved");
  };

  const handleMockResumeUpload = async () => {
    setResumeFileName("Resume_Curriculum_Vitae.pdf");
    try {
      await fetch("/api/student/profile/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: "Resume_Curriculum_Vitae.pdf",
          fileUrl: "https://mentoree.in/uploads/resumes/demo-resume.pdf",
          mimeType: "application/pdf",
          fileSize: 1024 * 350,
        }),
      });
      showToast("📄 Resume attached (Optional)");
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <span className="text-xs text-gray-400">Preparing your personalized setup experience...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-emerald-500 text-black px-4 py-3 rounded-2xl shadow-2xl font-bold text-xs sm:text-sm flex items-center space-x-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="border-b border-white/10 bg-[#121217]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit to Dashboard</span>
            </Link>
            <div className="h-4 w-[1px] bg-white/10" />
            <span className="font-bold text-sm tracking-tight text-white flex items-center space-x-2">
              <span className="text-emerald-400">✨ Student Profile Setup</span>
              <span className="text-gray-400 font-normal hidden sm:inline">• Field-Agnostic Learning Hub</span>
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={() => saveDraftToBackend()}
              disabled={saving}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-[11px] font-semibold flex items-center space-x-1.5"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{saving ? "Saving..." : "Save Draft"}</span>
            </button>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
              Step {currentStep} of 11
            </span>
          </div>
        </div>
      </header>

      {/* Setup Container: Sidebar Stepper + Form Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Left Stepper */}
          <aside className="hidden lg:block lg:col-span-4 space-y-2 sticky top-24 h-fit">
            <div className="bg-[#14141c] border border-white/10 rounded-3xl p-5 shadow-xl">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Profile Roadmap
              </h3>
              <div className="space-y-1.5">
                {SETUP_STEPS.map((s) => {
                  const Icon = s.icon;
                  const isCurrent = currentStep === s.step;
                  const isPast = currentStep > s.step;

                  return (
                    <button
                      key={s.step}
                      onClick={() => setCurrentStep(s.step)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-2xl transition-all flex items-center space-x-3 text-xs ${
                        isCurrent
                          ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold"
                          : isPast
                          ? "text-gray-300 hover:bg-white/5"
                          : "text-gray-500 hover:bg-white/5"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                        isCurrent
                          ? "bg-emerald-500 text-black font-extrabold"
                          : isPast
                          ? "bg-emerald-500/20 text-emerald-400 font-bold"
                          : "bg-white/5 text-gray-400"
                      }`}>
                        {isPast ? "✓" : s.step}
                      </div>
                      <div className="flex-1 truncate">
                        <div className="truncate">{s.title}</div>
                        <div className="text-[10px] text-gray-400 font-normal">{s.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Form Workspace Area */}
          <section className="lg:col-span-8 bg-[#14141c] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl min-h-[580px] flex flex-col justify-between">
            <div>
              {/* STEP 1: WELCOME */}
              {currentStep === 1 && (
                <div className="space-y-6 py-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Welcome to your Mentorship & Career Journey
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                      Whether you study Commerce, Engineering, Arts, Design, Law, Pure Sciences, Medicine, or are still exploring your direction—Mentoree connects you with verified practitioners who have already walked the path.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-emerald-400 font-bold text-xs flex items-center space-x-1.5">
                        <Check className="w-4 h-4" />
                        <span>100% Field-Agnostic</span>
                      </span>
                      <p className="text-[11px] text-gray-400">
                        Tailored for any academic domain, diploma, certificate, or degree program.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-emerald-400 font-bold text-xs flex items-center space-x-1.5">
                        <Check className="w-4 h-4" />
                        <span>Zero Rigid Mandatory Fields</span>
                      </span>
                      <p className="text-[11px] text-gray-400">
                        No mandatory resume or CGPA required to get verified mentor recommendations.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: BASIC INFO */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Basic Information</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Tell us how you would like to be addressed across session notes and recommendations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-gray-300 font-bold mb-1.5">First Name *</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. Aarav / Pooja / Devansh"
                        className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-bold mb-1.5">Last Name (Optional)</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g. Sharma"
                        className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-bold mb-1.5">Display Name *</label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Aarav S."
                        className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-bold mb-1.5">Phone Number (Optional)</label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-bold mb-1.5">City / State</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai, Maharashtra"
                        className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-bold mb-1.5">Profile Visibility</label>
                      <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value as any)}
                        className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="MENTORS_ONLY">Mentors Only (Recommended)</option>
                        <option value="PUBLIC">Public</option>
                        <option value="PRIVATE">Private</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1.5 text-xs">Bio / About Your Learning Journey</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="e.g. I am a second-year commerce student exploring investment banking and corporate valuation."
                      className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: EDUCATION BACKGROUND */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Educational Background</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Add your current or past degrees, certifications, school, or diploma programs.
                    </p>
                  </div>

                  {/* Add Education Form */}
                  <form onSubmit={handleAddEducation} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-4 text-xs">
                    <h4 className="font-bold text-emerald-400 text-xs flex items-center space-x-1.5">
                      <Plus className="w-4 h-4" />
                      <span>Add Education Record</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-300 mb-1 font-semibold">Education Level *</label>
                        <select
                          value={newLevel}
                          onChange={(e) => setNewLevel(e.target.value as any)}
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="Undergraduate">Undergraduate (B.Com, B.A, B.Tech, B.Des, etc.)</option>
                          <option value="Postgraduate">Postgraduate (MBA, M.Com, M.Sc, etc.)</option>
                          <option value="Higher Secondary">Higher Secondary / 12th</option>
                          <option value="Diploma">Diploma Program</option>
                          <option value="Doctorate">Doctorate / Ph.D.</option>
                          <option value="Certification">Professional Certification</option>
                          <option value="Vocational">Vocational Training</option>
                          <option value="School">School / 10th</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-1 font-semibold">Institution Name *</label>
                        <input
                          type="text"
                          value={newInst}
                          onChange={(e) => setNewInst(e.target.value)}
                          placeholder="e.g. St. Xavier's College / Delhi University / IIT"
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-1 font-semibold">Degree / Program</label>
                        <input
                          type="text"
                          value={newDegree}
                          onChange={(e) => setNewDegree(e.target.value)}
                          placeholder="e.g. Bachelor of Commerce / B.Des / BA Psychology"
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-1 font-semibold">Field / Major</label>
                        <input
                          type="text"
                          value={newField}
                          onChange={(e) => setNewField(e.target.value)}
                          placeholder="e.g. Finance & Accounting / UI/UX / Economics"
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-1 font-semibold">Current Status</label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value as any)}
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                        >
                          <option value="Currently Studying">Currently Studying</option>
                          <option value="Graduated">Graduated</option>
                          <option value="Completed">Completed</option>
                          <option value="On Break">On Break</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-1 font-semibold">Grading (Optional)</label>
                        <div className="flex space-x-2">
                          <select
                            value={newGradeType}
                            onChange={(e) => setNewGradeType(e.target.value as any)}
                            className="w-1/2 bg-[#1b1b26] border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none text-[11px]"
                          >
                            <option value="Percentage">Percentage (%)</option>
                            <option value="CGPA">CGPA</option>
                            <option value="Grade">Letter Grade</option>
                            <option value="Marks">Marks</option>
                            <option value="Pass/Fail">Pass/Fail</option>
                            <option value="Not Applicable">Not Applicable</option>
                          </select>
                          <input
                            type="text"
                            value={newGradeVal}
                            onChange={(e) => setNewGradeVal(e.target.value)}
                            placeholder="e.g. 84% or 8.5"
                            className="w-1/2 bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add This Record</span>
                    </button>
                  </form>

                  {/* Existing Education Records */}
                  {educationList.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Added Education ({educationList.length})</h4>
                      {educationList.map((edu, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-[#1b1b26] border border-white/5 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-white">{edu.institutionName}</div>
                            <div className="text-gray-400 text-[11px]">
                              {edu.educationLevel} {edu.degreeOrProgram ? `• ${edu.degreeOrProgram}` : ""} {edu.fieldOfStudy ? `(${edu.fieldOfStudy})` : ""}
                            </div>
                            {edu.gradeValue && (
                              <div className="text-emerald-400 text-[10px] font-mono mt-0.5">
                                {edu.gradeType}: {edu.gradeValue}
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300">
                            {edu.currentStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: FIELD & INTERESTS */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Academic Field & Areas of Interest</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Choose your primary field of study or select "Exploring / Undecided".
                    </p>
                  </div>

                  {/* Primary Field Selection Grid */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2">Select Primary Field</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {fieldCategories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedPrimaryField(cat.name)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            selectedPrimaryField === cat.name
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-lg shadow-emerald-500/10"
                              : "bg-[#1b1b26] border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          <div className="text-xs font-bold">{cat.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Specialization Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Specialization / Major (Optional)</label>
                    <input
                      type="text"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="e.g. Investment Banking, UI/UX, Clinical Research, Corporate Law"
                      className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Interests Cloud */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2">Select Topics You Are Interested In</label>
                    <div className="flex flex-wrap gap-2">
                      {taxInterests.map((t, idx) => {
                        const isSelected = selectedInterests.includes(t.name);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleInterest(t.name)}
                            className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center space-x-1.5 ${
                              isSelected
                                ? "bg-emerald-500 text-black font-bold"
                                : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                            }`}
                          >
                            <span>{t.name}</span>
                            {isSelected && <span>✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Interest Input */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={customInterestInput}
                      onChange={(e) => setCustomInterestInput(e.target.value)}
                      placeholder="Add custom interest..."
                      className="flex-1 bg-[#1b1b26] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomInterest}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                    >
                      Add Custom
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: SKILLS */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Skills & Proficiencies</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Technical, professional, creative, or academic skills you have or want to develop.
                    </p>
                  </div>

                  {/* Quick Recommended Skills */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2">Quick Add Popular Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {taxSkills.map((sk, idx) => {
                        const hasIt = selectedSkills.some(s => s.name.toLowerCase() === sk.name.toLowerCase());
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (!hasIt) {
                                setSelectedSkills(prev => [...prev, { name: sk.name, category: sk.category, proficiency: "Intermediate" }]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                              hasIt
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                                : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                            }`}
                          >
                            <span>+ {sk.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add Custom Skill Form */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs">
                    <h4 className="font-bold text-emerald-400">Add Skill</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-gray-300 mb-1">Skill Name</label>
                        <input
                          type="text"
                          value={customSkillName}
                          onChange={(e) => setCustomSkillName(e.target.value)}
                          placeholder="e.g. Financial Analysis / Figma / Research"
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">Category</label>
                        <select
                          value={customSkillCat}
                          onChange={(e) => setCustomSkillCat(e.target.value)}
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                        >
                          <option value="Domain-Specific">Domain-Specific</option>
                          <option value="Professional">Professional / Soft Skill</option>
                          <option value="Creative">Creative / Design</option>
                          <option value="Technical">Technical / Software</option>
                          <option value="Academic">Academic / Research</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">Proficiency (Optional)</label>
                        <select
                          value={customSkillProf}
                          onChange={(e) => setCustomSkillProf(e.target.value)}
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs"
                    >
                      Add Skill
                    </button>
                  </div>

                  {/* Selected Skills */}
                  {selectedSkills.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Skills ({selectedSkills.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSkills.map((sk, idx) => (
                          <div key={idx} className="px-3 py-1.5 rounded-xl bg-[#1b1b26] border border-white/10 text-xs flex items-center space-x-2">
                            <span className="font-bold text-white">{sk.name}</span>
                            <span className="text-[10px] text-emerald-400 font-mono">({sk.proficiency})</span>
                            <button
                              type="button"
                              onClick={() => setSelectedSkills(prev => prev.filter((_, i) => i !== idx))}
                              className="text-gray-400 hover:text-red-400 text-xs ml-1"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 6: GOALS */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Learning & Career Goals</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Specify what you want to achieve through 1:1 mentorship (e.g. internships, exams, career transition, research).
                    </p>
                  </div>

                  <form onSubmit={handleAddGoal} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-300 mb-1 font-semibold">Goal Type *</label>
                        <select
                          value={newGoalType}
                          onChange={(e) => setNewGoalType(e.target.value as any)}
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                        >
                          <option value="Get a Job">Get a Job</option>
                          <option value="Get an Internship">Get an Internship</option>
                          <option value="Prepare for Interviews">Prepare for Interviews / Mock Casing</option>
                          <option value="Learn a New Skill">Learn a New Skill</option>
                          <option value="Build a Portfolio">Build a Portfolio / Project</option>
                          <option value="Prepare for an Entrance Exam">Prepare for Entrance / Competitive Exam</option>
                          <option value="Conduct Academic Research">Conduct Academic Research & Publishing</option>
                          <option value="Start a Business / Venture">Start a Business / Entrepreneurship</option>
                          <option value="Explore Career Options">Explore Career Options & Direction</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-1 font-semibold">Priority</label>
                        <select
                          value={newGoalPriority}
                          onChange={(e) => setNewGoalPriority(e.target.value as any)}
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                        >
                          <option value="High">High Priority</option>
                          <option value="Medium">Medium Priority</option>
                          <option value="Low">Low Priority</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1 font-semibold">Goal Title *</label>
                      <input
                        type="text"
                        value={newGoalTitle}
                        onChange={(e) => setNewGoalTitle(e.target.value)}
                        placeholder="e.g. Prepare for Financial Analyst interviews at top investment firms"
                        className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs"
                    >
                      Save Goal
                    </button>
                  </form>

                  {goalsList.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Goals ({goalsList.length})</h4>
                      {goalsList.map((g, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-[#1b1b26] border border-white/5 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-white">{g.title}</div>
                            <span className="text-[10px] text-gray-400">{g.goalType} • Priority: {g.priority}</span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400">In Progress</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 7: EXPERIENCE & PROJECTS */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Experience & Work Samples</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Optional: Add internships, research work, coursework projects, or freelance engagements.
                    </p>
                  </div>

                  {/* Add Experience */}
                  <form onSubmit={handleAddExperience} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs">
                    <h4 className="font-bold text-emerald-400">Add Experience (Optional)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-gray-300 mb-1">Type</label>
                        <select
                          value={newExpType}
                          onChange={(e) => setNewExpType(e.target.value as any)}
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                        >
                          <option value="Internship">Internship</option>
                          <option value="Research">Academic Research</option>
                          <option value="Freelance">Freelance</option>
                          <option value="Volunteer">Volunteer</option>
                          <option value="Student Organization">Student Organization</option>
                          <option value="Part-time">Part-time</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">Role Title</label>
                        <input
                          type="text"
                          value={newExpTitle}
                          onChange={(e) => setNewExpTitle(e.target.value)}
                          placeholder="e.g. Research Assistant / Analyst"
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">Organization</label>
                        <input
                          type="text"
                          value={newExpOrg}
                          onChange={(e) => setNewExpOrg(e.target.value)}
                          placeholder="e.g. University Lab / Firm"
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                    >
                      Add Experience
                    </button>
                  </form>

                  {/* Add Project */}
                  <form onSubmit={handleAddProject} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs">
                    <h4 className="font-bold text-emerald-400">Add Project / Work Sample (Optional)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-300 mb-1">Project Title</label>
                        <input
                          type="text"
                          value={newProjTitle}
                          onChange={(e) => setNewProjTitle(e.target.value)}
                          placeholder="e.g. Valuation Model for EV Market"
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">URL (Demo/Behance/Doc)</label>
                        <input
                          type="text"
                          value={newProjUrl}
                          onChange={(e) => setNewProjUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                    >
                      Add Project
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 8: CAREER DIRECTION */}
              {currentStep === 8 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Career Direction & Target Organizations</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Let mentors know what roles or sectors you aspire towards.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">Still Exploring Options?</h4>
                      <p className="text-xs text-gray-400">If you are undecided, we will help you discover career pathways.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isExploring}
                      onChange={(e) => setIsExploring(e.target.checked)}
                      className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                    />
                  </div>

                  {!isExploring && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-gray-300 font-bold mb-1.5">Target Role</label>
                        <input
                          type="text"
                          value={targetRole}
                          onChange={(e) => setTargetRole(e.target.value)}
                          placeholder="e.g. Financial Analyst / Product Designer / Lawyer"
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 font-bold mb-1.5">Target Industry / Domain</label>
                        <input
                          type="text"
                          value={targetIndustry}
                          onChange={(e) => setTargetIndustry(e.target.value)}
                          placeholder="e.g. FinTech / Healthcare / Media"
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Target Organizations */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Target Companies / Universities / Institutions</label>
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="text"
                        value={orgInput}
                        onChange={(e) => setOrgInput(e.target.value)}
                        placeholder="e.g. Deloitte / Oxford / WHO / Google / RBI"
                        className="flex-1 bg-[#1b1b26] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddTargetOrg}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                      >
                        Add
                      </button>
                    </div>

                    {targetOrganizations.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {targetOrganizations.map((org, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs">
                            {org}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 9: LINKS & RESUME */}
              {currentStep === 9 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Social Links & Resume</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Add optional links (LinkedIn, Portfolio, Behance, ResearchGate) or attach a resume.
                    </p>
                  </div>

                  {/* Add Link */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs">
                    <h4 className="font-bold text-emerald-400">Add Professional Link</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-gray-300 mb-1">Platform</label>
                        <select
                          value={newLinkPlatform}
                          onChange={(e) => setNewLinkPlatform(e.target.value as any)}
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                        >
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Portfolio">Portfolio Website</option>
                          <option value="Behance">Behance</option>
                          <option value="Dribbble">Dribbble</option>
                          <option value="Medium">Medium</option>
                          <option value="ResearchGate">ResearchGate</option>
                          <option value="Google Scholar">Google Scholar</option>
                          <option value="GitHub">GitHub</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-gray-300 mb-1">URL</label>
                        <input
                          type="text"
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
                    >
                      Save Link
                    </button>
                  </div>

                  {/* Resume Box */}
                  <div className="p-6 rounded-2xl bg-[#1b1b26] border border-dashed border-white/20 text-center space-y-3">
                    <FileText className="w-8 h-8 text-emerald-400 mx-auto" />
                    <div>
                      <h4 className="font-bold text-sm text-white">Upload Resume / CV (Optional)</h4>
                      <p className="text-xs text-gray-400">PDF or DOCX up to 10MB.</p>
                    </div>
                    {resumeFileName ? (
                      <div className="flex items-center justify-center space-x-2 text-xs text-emerald-400 font-mono">
                        <span>✓ {resumeFileName}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleMockResumeUpload}
                        className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-xs hover:bg-emerald-500/30"
                      >
                        Attach Sample Resume
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 10: MENTORSHIP PREFERENCES */}
              {currentStep === 10 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Mentorship Preferences</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Configure your ideal session format and budget to receive tailored mentor recommendations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-gray-300 font-bold mb-1.5">Preferred Session Format</label>
                      <select
                        value={prefSessionType}
                        onChange={(e) => setPrefSessionType(e.target.value as any)}
                        className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                      >
                        <option value="Video">1:1 Live Video Call (Google Meet)</option>
                        <option value="Audio">1:1 Audio Call</option>
                        <option value="Chat">Asynchronous Chat / Review</option>
                        <option value="Any">Any Format</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-bold mb-1.5">Mentor Experience Level</label>
                      <select
                        value={prefExperience}
                        onChange={(e) => setPrefExperience(e.target.value)}
                        className="w-full bg-[#1b1b26] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                      >
                        <option value="Any">Any Level</option>
                        <option value="0-2 years">Early Career (0–2 years)</option>
                        <option value="3-5 years">Mid-Level (3–5 years)</option>
                        <option value="5-10 years">Senior (5–10 years)</option>
                        <option value="10+ years">Staff / Director (10+ years)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-300">Session Budget (₹ INR)</span>
                        <span className="text-emerald-400 font-mono font-bold">₹{minBudget} – ₹{maxBudget}</span>
                      </div>
                      <input
                        type="range"
                        min="500"
                        max="5000"
                        step="100"
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 11: REVIEW & FINISH */}
              {currentStep === 11 && (
                <div className="space-y-6">
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Your Profile is Ready!</h2>
                    <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-lg mx-auto">
                      Review your summary below. You can update or expand any section anytime from your profile hub.
                    </p>
                  </div>

                  <div className="p-5 rounded-3xl bg-black/40 border border-white/10 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400">Name</span>
                      <span className="font-bold text-white">{firstName} {lastName} ({displayName})</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400">Academic Field</span>
                      <span className="font-bold text-emerald-400">{selectedPrimaryField}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400">Primary Goal</span>
                      <span className="font-bold text-white">{goalsList[0]?.title || "Explore Career & Mentorship"}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Interests & Skills</span>
                      <span className="text-gray-200">{selectedInterests.length} Interests • {selectedSkills.length} Skills</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-8 border-t border-white/10 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold flex items-center space-x-1.5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center space-x-3">
                {currentStep < 11 ? (
                  <>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-4 py-2.5 rounded-xl text-gray-400 hover:text-white text-xs font-medium"
                    >
                      Skip Step
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={saving}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-1.5"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-sm shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
                  >
                    <span>Finish Setup & Open Mentee Hub</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
