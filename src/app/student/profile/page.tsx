"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Home,
  GraduationCap,
  Users,
  BookOpen,
  UserCheck,
  Video,
  Bookmark,
  Calendar,
  CheckSquare,
  Award,
  FileText,
  CreditCard,
  HelpCircle,
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  Sparkles,
  Clock,
  Target,
  Shield,
  ArrowRight,
  Share2,
  Download,
  CheckCircle2,
  Menu,
  X,
  Plus,
  Loader2,
  Compass,
  AlertCircle,
  Layers,
  Phone,
  Mail,
  MapPin,
  Building,
  Check,
  Camera,
  Briefcase,
  Code,
  Globe,
  Lock,
  Eye,
  DollarSign,
  FolderGit2,
  Link as LinkIcon,
  FileSpreadsheet,
  FileCheck,
  User,
  Heart,
  Sliders,
  Upload,
  AlertTriangle
} from "lucide-react";
import { 
  StudentProfileData, 
  ProfileCompletionBreakdown,
  StudentEducation,
  StudentSkillItem,
  StudentInterestItem,
  StudentExperienceItem,
  StudentProjectItem,
  StudentGoalItem,
  StudentLinkItem,
  StudentMentorshipPreferenceItem
} from "@/types/student";
import { StudentSidebar } from "@/components/StudentSidebar";

type ProfileTab = 
  | "about" 
  | "education" 
  | "skills" 
  | "experience" 
  | "projects" 
  | "goals" 
  | "mentorship" 
  | "links";

export default function StudentProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center text-[#7922f5]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <StudentProfileContent />
    </Suspense>
  );
}

function StudentProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Tab Navigation state synchronized with URL query parameter
  const tabParam = (searchParams.get("tab") as ProfileTab) || "about";
  const [activeTab, setActiveTab] = useState<ProfileTab>(tabParam);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Data State
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [completion, setCompletion] = useState<ProfileCompletionBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "education" | "experience" | "project" | "goal" | "link";
    id: string;
    title: string;
  }>({
    isOpen: false,
    type: "education",
    id: "",
    title: ""
  });

  // Modal / Form state for Add/Edit sub-items
  const [itemModal, setItemModal] = useState<{
    isOpen: boolean;
    type: "education" | "experience" | "project" | "goal" | "link";
    isEditing: boolean;
    data: any;
  }>({
    isOpen: false,
    type: "education",
    isEditing: false,
    data: {}
  });

  // Form State for Active Tab Edits
  const [aboutForm, setAboutForm] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    phoneNumber: "",
    city: "",
    state: "",
    country: "India",
    bio: "",
    primaryField: "",
    primarySpecialization: "",
    targetRole: "",
    targetDomain: "",
    targetOrganizations: "",
    isExploringCareer: false,
    profileVisibility: "MENTORS_ONLY" as "PUBLIC" | "MENTORS_ONLY" | "PRIVATE",
    profilePhoto: ""
  });

  const [skillsList, setSkillsList] = useState<Array<{ name: string; category: string; proficiency: string }>>([]);
  const [interestsList, setInterestsList] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState({ name: "", category: "Professional", proficiency: "Intermediate" });
  const [newInterestInput, setNewInterestInput] = useState("");

  const [mentorshipForm, setMentorshipForm] = useState({
    preferredMentorFields: [] as string[],
    preferredMentorExpertise: [] as string[],
    preferredMentorRoles: [] as string[],
    preferredMentorIndustries: [] as string[],
    preferredSessionType: "1:1 Video",
    minBudgetINR: 500,
    maxBudgetINR: 2500,
    preferredLanguages: ["English", "Hindi"],
    preferredExperienceLevel: "3+ years",
    preferredAvailability: "Flexible"
  });

  const [linksList, setLinksList] = useState<Array<{ id?: string; platform: string; url: string; label?: string }>>([]);
  const [newLinkInput, setNewLinkInput] = useState({ platform: "LinkedIn", url: "", label: "" });

  // Sync tab with URL without full reload
  const handleTabChange = (newTab: ProfileTab) => {
    setActiveTab(newTab);
    setEditMode(false);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", newTab);
    window.history.replaceState({}, "", url.toString());
  };

  // Load Profile from API
  const fetchProfileData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/student/profile");
      if (res.ok) {
        const json = await res.json();
        const p: StudentProfileData = json.data?.profile || null;
        const comp: ProfileCompletionBreakdown = json.data?.completion || null;
        setProfile(p);
        setCompletion(comp);

        if (p) {
          // Initialize About Form
          setAboutForm({
            firstName: p.firstName || "",
            lastName: p.lastName || "",
            displayName: p.displayName || `${p.firstName || ""} ${p.lastName || ""}`.trim(),
            phoneNumber: p.phoneNumber || "",
            city: p.city || "",
            state: p.state || "",
            country: p.country || "India",
            bio: p.bio || "",
            primaryField: p.primaryField || "Commerce & Finance",
            primarySpecialization: p.primarySpecialization || "",
            targetRole: p.targetRole || "",
            targetDomain: p.targetDomain || "",
            targetOrganizations: p.targetOrganizations?.map(o => o.organizationName).join(", ") || "",
            isExploringCareer: p.isExploringCareer || false,
            profileVisibility: p.profileVisibility || "MENTORS_ONLY",
            profilePhoto: p.profilePhoto || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250"
          });

          // Initialize Skills & Interests
          setSkillsList(
            p.skills?.map(s => ({
              name: s.skillName,
              category: s.category || "Professional",
              proficiency: s.proficiencyLevel || "Intermediate"
            })) || [
              { name: "Financial Modeling", category: "Domain-Specific", proficiency: "Advanced" },
              { name: "Accounting", category: "Domain-Specific", proficiency: "Intermediate" },
              { name: "Communication", category: "Professional", proficiency: "Expert" },
              { name: "Excel & Sheets", category: "Technical", proficiency: "Advanced" },
              { name: "Market Research", category: "Academic", proficiency: "Intermediate" }
            ]
          );

          setInterestsList(
            p.interests?.map(i => i.interestName) || [
              "Finance & Valuation", "Business Strategy", "Venture Capital", "Career Development", "Consulting"
            ]
          );

          // Initialize Mentorship Preferences
          const pref = p.mentorshipPreference;
          if (pref) {
            setMentorshipForm({
              preferredMentorFields: pref.preferredMentorFields || ["Commerce & Finance", "Business"],
              preferredMentorExpertise: pref.preferredMentorExpertise || ["Career Planning", "Interview Preparation", "Case Studies"],
              preferredMentorRoles: pref.preferredMentorRoles || ["Financial Analyst", "Associate Consultant"],
              preferredMentorIndustries: pref.preferredMentorIndustries || ["Finance", "Consulting"],
              preferredSessionType: (pref.preferredSessionType as string) || "1:1 Video",
              minBudgetINR: pref.minBudgetINR || 500,
              maxBudgetINR: pref.maxBudgetINR || 2500,
              preferredLanguages: pref.preferredLanguages?.length ? pref.preferredLanguages : ["English", "Hindi"],
              preferredExperienceLevel: pref.preferredExperienceLevel || "3+ years",
              preferredAvailability: pref.preferredAvailability || "Flexible"
            });
          }

          // Initialize Links
          setLinksList(
            p.links?.map(l => ({ id: l.id, platform: l.platform as string, url: l.url, label: l.label })) || [
              { platform: "LinkedIn", url: "https://linkedin.com/in/student-profile" },
              { platform: "Portfolio", url: "https://portfolio.me/showcase" }
            ]
          );
        }
      } else {
        setErrorMessage("Failed to load profile data.");
      }
    } catch (err: any) {
      console.error("Profile load error:", err);
      setErrorMessage(err.message || "Failed to load student profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const showToast = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // =========================================================================
  // CRUD ACTIONS FOR EACH INDEPENDENT SECTION
  // =========================================================================

  // 1. Save About Me
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: aboutForm.firstName,
          lastName: aboutForm.lastName,
          displayName: aboutForm.displayName || `${aboutForm.firstName} ${aboutForm.lastName}`.trim(),
          phoneNumber: aboutForm.phoneNumber,
          city: aboutForm.city,
          state: aboutForm.state,
          country: aboutForm.country,
          bio: aboutForm.bio,
          primaryField: aboutForm.primaryField,
          primarySpecialization: aboutForm.primarySpecialization,
          targetRole: aboutForm.targetRole,
          targetDomain: aboutForm.targetDomain,
          isExploringCareer: aboutForm.isExploringCareer,
          profileVisibility: aboutForm.profileVisibility,
          profilePhoto: aboutForm.profilePhoto
        })
      });

      if (res.ok) {
        showToast("About Me details updated successfully!");
        setEditMode(false);
        fetchProfileData();
      } else {
        const json = await res.json();
        setErrorMessage(json.message || "Failed to update profile.");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  // 2. Save Education Item
  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = itemModal.data;
    try {
      const isEdit = itemModal.isEditing && data.id;
      const url = isEdit ? `/api/student/profile/education/${data.id}` : "/api/student/profile/education";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institutionName: data.institutionName,
          educationLevel: data.educationLevel || "Undergraduate",
          degreeOrProgram: data.degreeOrProgram,
          fieldOfStudy: data.fieldOfStudy,
          specialization: data.specialization,
          currentStatus: data.currentStatus || "Currently Studying",
          gradeType: data.gradeType || "Not Applicable",
          gradeValue: data.gradeValue,
          description: data.description,
          startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
          expectedEndDate: data.expectedEndDate ? new Date(data.expectedEndDate).toISOString() : undefined
        })
      });

      if (res.ok) {
        showToast(isEdit ? "Education record updated!" : "Education record added!");
        setItemModal({ ...itemModal, isOpen: false });
        fetchProfileData();
      } else {
        const json = await res.json();
        setErrorMessage(json.message || "Failed to save education.");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  // 3. Save Skills & Interests
  const handleSaveSkillsAndInterests = async () => {
    setSaving(true);
    try {
      const [skillsRes, interestsRes] = await Promise.all([
        fetch("/api/student/profile/skills", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skills: skillsList.map(s => ({
              skillName: s.name,
              category: s.category,
              proficiencyLevel: s.proficiency
            }))
          })
        }),
        fetch("/api/student/profile/interests", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            interests: interestsList.map(i => ({
              interestName: i,
              category: "General"
            }))
          })
        })
      ]);

      if (skillsRes.ok && interestsRes.ok) {
        showToast("Skills and Interests updated successfully!");
        setEditMode(false);
        fetchProfileData();
      } else {
        setErrorMessage("Failed to update skills or interests.");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  // 4. Save Experience Item
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = itemModal.data;
    try {
      const isEdit = itemModal.isEditing && data.id;
      const url = isEdit ? `/api/student/profile/experience/${data.id}` : "/api/student/profile/experience";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          organization: data.organization,
          type: data.type || "Internship",
          description: data.description,
          currentlyActive: !!data.currentlyActive,
          skillsUsed: typeof data.skillsUsed === "string" ? data.skillsUsed.split(",").map((s: string) => s.trim()).filter(Boolean) : (data.skillsUsed || []),
          achievements: data.achievements,
          startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
          endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined
        })
      });

      if (res.ok) {
        showToast(isEdit ? "Experience record updated!" : "Experience record added!");
        setItemModal({ ...itemModal, isOpen: false });
        fetchProfileData();
      } else {
        const json = await res.json();
        setErrorMessage(json.message || "Failed to save experience.");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  // 5. Save Project Item
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = itemModal.data;
    try {
      const isEdit = itemModal.isEditing && data.id;
      const url = isEdit ? `/api/student/profile/projects/${data.id}` : "/api/student/profile/projects";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          category: data.category || "Academic & Research",
          role: data.role,
          projectUrl: data.projectUrl,
          demoUrl: data.demoUrl,
          repositoryUrl: data.repositoryUrl,
          skills: typeof data.skills === "string" ? data.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : (data.skills || []),
          achievements: data.achievements
        })
      });

      if (res.ok) {
        showToast(isEdit ? "Project updated successfully!" : "Project added successfully!");
        setItemModal({ ...itemModal, isOpen: false });
        fetchProfileData();
      } else {
        const json = await res.json();
        setErrorMessage(json.message || "Failed to save project.");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  // 6. Save Goal Item
  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = itemModal.data;
    try {
      const isEdit = itemModal.isEditing && data.id;
      const url = isEdit ? `/api/student/profile/goals/${data.id}` : "/api/student/profile/goals";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          goalType: data.goalType || "Career exploration",
          description: data.description,
          priority: data.priority || "Medium",
          status: data.status || "In Progress",
          progressPercentage: Number(data.progressPercentage || 0),
          targetDate: data.targetDate ? new Date(data.targetDate).toISOString() : undefined
        })
      });

      if (res.ok) {
        showToast(isEdit ? "Career goal updated!" : "New career goal set!");
        setItemModal({ ...itemModal, isOpen: false });
        fetchProfileData();
      } else {
        const json = await res.json();
        setErrorMessage(json.message || "Failed to save goal.");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  // 7. Save Mentorship Preferences
  const handleSaveMentorship = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/student/profile/mentorship-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mentorshipForm)
      });

      if (res.ok) {
        showToast("Mentorship preferences saved! Mentor recommendations updated.");
        setEditMode(false);
        fetchProfileData();
      } else {
        const json = await res.json();
        setErrorMessage(json.message || "Failed to update mentorship preferences.");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  // 8. Save Links & Resume
  const handleSaveLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/student/profile/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links: linksList })
      });

      if (res.ok) {
        showToast("Professional links updated successfully!");
        setEditMode(false);
        fetchProfileData();
      } else {
        const json = await res.json();
        setErrorMessage(json.message || "Failed to update links.");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Confirm and Execute Deletions
  const handleExecuteDelete = async () => {
    if (!deleteModal.id) return;
    setSaving(true);
    try {
      let endpoint = "";
      if (deleteModal.type === "education") endpoint = `/api/student/profile/education/${deleteModal.id}`;
      else if (deleteModal.type === "experience") endpoint = `/api/student/profile/experience/${deleteModal.id}`;
      else if (deleteModal.type === "project") endpoint = `/api/student/profile/projects/${deleteModal.id}`;
      else if (deleteModal.type === "goal") endpoint = `/api/student/profile/goals/${deleteModal.id}`;

      const res = await fetch(endpoint, { method: "DELETE" });
      if (res.ok) {
        showToast(`${deleteModal.title} removed.`);
        setDeleteModal({ ...deleteModal, isOpen: false });
        fetchProfileData();
      } else {
        setErrorMessage("Failed to remove item.");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center text-[#7922f5]">
        <Loader2 className="w-9 h-9 animate-spin" />
      </div>
    );
  }

  const p = profile;
  const fullName = `${p?.firstName || aboutForm.firstName || "Student"} ${p?.lastName || aboutForm.lastName || ""}`.trim();
  const primaryFieldDisplay = p?.primaryField || aboutForm.primaryField || "Commerce & Finance";
  const avatarUrl = p?.profilePhoto || aboutForm.profilePhoto || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250";
  const completionScore = completion?.percentage || p?.completionPercentage || 85;

  return (
    <div className="p-5 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#1e2433] tracking-tight">
                  Student Details
                </h1>
                <div className="flex items-center space-x-1.5 text-xs text-[#94a3b8] font-medium mt-1">
                  <span>Student</span>
                  <span className="text-[#cbd5e1]">/</span>
                  <span className="text-[#1e2433] font-semibold">Student Details</span>
                </div>
              </div>

              {/* Top Banner Actions: Public Preview & Wizard Link */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#e2e8f0] text-slate-700 font-semibold text-xs sm:text-sm hover:border-[#7922f5] hover:text-[#7922f5] transition-all flex items-center space-x-2 shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Public Profile</span>
                </button>

                <Link
                  href="/student/profile/setup"
                  className="px-4 py-2 rounded-xl bg-[#7922f5] text-white font-semibold text-xs sm:text-sm hover:bg-[#6819d4] transition-all flex items-center space-x-2 shadow-md shadow-purple-600/20"
                >
                  <Layers className="w-4 h-4" />
                  <span>Setup Wizard</span>
                </Link>
              </div>
            </div>

            {/* Notifications / Toast */}
            {saveSuccess && (
              <div className="px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center space-x-2 animate-fade-in shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{saveSuccess}</span>
              </div>
            )}

            {errorMessage && (
              <div className="px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center justify-between animate-fade-in shadow-sm">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TOP PROFILE HEADER CARD                                                   */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-5">
                <div className="relative shrink-0">
                  <img 
                    src={avatarUrl}
                    alt={fullName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-purple-100"
                  />
                  <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#7922f5] text-white flex items-center justify-center border-2 border-white shadow-sm">
                    <Camera className="w-3 h-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2.5">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#1e2433]">
                      {fullName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f6f2fe] text-[#7922f5] border border-purple-100">
                      Student • {primaryFieldDisplay}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5a627a] max-w-xl line-clamp-2">
                    {p?.bio || aboutForm.bio || "Learner preparing for career milestones and seeking verified industry mentorship."}
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-[#8e95a5] pt-1">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{p?.city || aboutForm.city || "Springfield"}, {p?.country || aboutForm.country || "India"}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Visibility: {p?.profileVisibility?.replace("_", " ") || "Mentors Only"}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Completion Indicator Pill */}
              <div className="bg-[#fafbff] border border-[#eaedf7] rounded-2xl p-4 sm:w-64 shrink-0 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#1e2433]">Profile Completion</span>
                  <span className="font-extrabold text-[#7922f5]">{completionScore}%</span>
                </div>
                <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-[#7922f5] rounded-full transition-all duration-500" 
                    style={{ width: `${completionScore}%` }} 
                  />
                </div>
                <button
                  onClick={() => setShowCompletionModal(true)}
                  className="text-[11px] font-bold text-[#7922f5] hover:underline text-left flex items-center justify-between"
                >
                  <span>10-section status</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* HORIZONTAL TAB NAVIGATION (8 Independent Sections)                        */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-2xl p-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] overflow-x-auto scrollbar-none">
              <div className="flex items-center space-x-1 min-w-max">
                {[
                  { id: "about", label: "1. About Me", icon: User },
                  { id: "education", label: "2. Education", icon: GraduationCap },
                  { id: "skills", label: "3. Skills & Interests", icon: Bookmark },
                  { id: "experience", label: "4. Experience", icon: Briefcase },
                  { id: "projects", label: "5. Projects", icon: FolderGit2 },
                  { id: "goals", label: "6. Career Goals", icon: Target },
                  { id: "mentorship", label: "7. Mentorship", icon: Heart },
                  { id: "links", label: "8. Links & Resume", icon: LinkIcon },
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id as ProfileTab)}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-semibold flex items-center space-x-2 transition-all ${
                        isActive
                          ? "bg-[#7922f5] text-white shadow-md shadow-purple-600/20"
                          : "text-[#5a627a] hover:bg-[#f8f9fc] hover:text-[#1e2433]"
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${isActive ? "text-white" : "text-[#8e95a5]"}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* TAB 1: ABOUT ME SECTION                                                   */}
            {/* ========================================================================= */}
            {activeTab === "about" && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-[#1e2433]">About Me</h2>
                    <p className="text-xs text-[#9aa0b4] mt-0.5">Personal details, academic domain, and location summary</p>
                  </div>

                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-6 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-semibold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all flex items-center space-x-2"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  ) : null}
                </div>

                {!editMode ? (
                  /* VIEW MODE */
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Subcard 1: Personal & Identity */}
                    <div className="rounded-xl border border-[#f1f2f7] p-6 bg-white space-y-5">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={avatarUrl}
                          alt={fullName}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div>
                          <h3 className="text-[17px] font-bold text-[#1e2433] leading-tight">{fullName}</h3>
                          <p className="text-xs text-[#9aa0b4] font-medium mt-0.5">{aboutForm.primaryField || "Student"}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs sm:text-[13px]">
                        <div>
                          <span className="text-[#9aa0b4] block text-xs">First Name</span>
                          <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{aboutForm.firstName || "—"}</span>
                        </div>
                        <div>
                          <span className="text-[#9aa0b4] block text-xs">Last Name</span>
                          <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{aboutForm.lastName || "—"}</span>
                        </div>
                        <div>
                          <span className="text-[#9aa0b4] block text-xs">Primary Field / Domain</span>
                          <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{aboutForm.primaryField || "—"}</span>
                        </div>
                        <div>
                          <span className="text-[#9aa0b4] block text-xs">Specialization</span>
                          <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{aboutForm.primarySpecialization || "—"}</span>
                        </div>
                        <div>
                          <span className="text-[#9aa0b4] block text-xs">Target Role</span>
                          <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{aboutForm.targetRole || "Still exploring"}</span>
                        </div>
                        <div>
                          <span className="text-[#9aa0b4] block text-xs">Target Domain / Industry</span>
                          <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{aboutForm.targetDomain || "—"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Subcard 2: Contact & Location */}
                    <div className="rounded-xl border border-[#f1f2f7] p-6 bg-white space-y-5">
                      <h3 className="text-[17px] font-bold text-[#1e2433]">Contact & Location Details</h3>
                      
                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs sm:text-[13px]">
                        <div>
                          <span className="text-[#9aa0b4] block text-xs">Primary Phone</span>
                          <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{aboutForm.phoneNumber || "+1 (555) 123-4567"}</span>
                        </div>
                        <div>
                          <span className="text-[#9aa0b4] block text-xs">Profile Visibility</span>
                          <span className="font-bold text-[#7922f5] text-[13.5px] mt-0.5 block">{aboutForm.profileVisibility.replace("_", " ")}</span>
                        </div>
                        <div>
                          <span className="text-[#9aa0b4] block text-xs">City & State</span>
                          <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{aboutForm.city || "Springfield"}, {aboutForm.state || "State"}</span>
                        </div>
                        <div>
                          <span className="text-[#9aa0b4] block text-xs">Country</span>
                          <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{aboutForm.country || "India"}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[#9aa0b4] block text-xs">Target Organizations / Companies</span>
                          <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{aboutForm.targetOrganizations || "Google, Stripe, McKinsey, BCG"}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[#9aa0b4] block text-xs">Bio / Summary</span>
                        <p className="text-xs sm:text-[13px] text-[#202533] mt-1 font-medium leading-relaxed">
                          {aboutForm.bio || "Student focused on career development, academic excellence, and expanding professional network with experienced industry mentors."}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* EDIT MODE */
                  <form onSubmit={handleSaveAbout} className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                        <input 
                          type="text"
                          value={aboutForm.firstName}
                          onChange={(e) => setAboutForm({ ...aboutForm, firstName: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                        <input 
                          type="text"
                          value={aboutForm.lastName}
                          onChange={(e) => setAboutForm({ ...aboutForm, lastName: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Display Name</label>
                        <input 
                          type="text"
                          value={aboutForm.displayName}
                          onChange={(e) => setAboutForm({ ...aboutForm, displayName: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Field / Domain</label>
                        <input 
                          type="text"
                          value={aboutForm.primaryField}
                          placeholder="e.g. Commerce & Finance, Engineering, Design, Law, Medical"
                          onChange={(e) => setAboutForm({ ...aboutForm, primaryField: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization</label>
                        <input 
                          type="text"
                          value={aboutForm.primarySpecialization}
                          placeholder="e.g. Valuation, UI/UX, Corporate Law, AI"
                          onChange={(e) => setAboutForm({ ...aboutForm, primarySpecialization: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                        <input 
                          type="text"
                          value={aboutForm.phoneNumber}
                          onChange={(e) => setAboutForm({ ...aboutForm, phoneNumber: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                        <input 
                          type="text"
                          value={aboutForm.city}
                          onChange={(e) => setAboutForm({ ...aboutForm, city: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
                        <input 
                          type="text"
                          value={aboutForm.state}
                          onChange={(e) => setAboutForm({ ...aboutForm, state: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                        <input 
                          type="text"
                          value={aboutForm.country}
                          onChange={(e) => setAboutForm({ ...aboutForm, country: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Target Role (or leave blank if exploring)</label>
                        <input 
                          type="text"
                          value={aboutForm.targetRole}
                          placeholder="e.g. Financial Analyst, Software Engineer, Designer"
                          onChange={(e) => setAboutForm({ ...aboutForm, targetRole: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Target Industry / Domain</label>
                        <input 
                          type="text"
                          value={aboutForm.targetDomain}
                          placeholder="e.g. FinTech, Healthcare, Consulting"
                          onChange={(e) => setAboutForm({ ...aboutForm, targetDomain: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Profile Visibility</label>
                        <select 
                          value={aboutForm.profileVisibility}
                          onChange={(e) => setAboutForm({ ...aboutForm, profileVisibility: e.target.value as any })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        >
                          <option value="PUBLIC">Public (All Users & Mentors)</option>
                          <option value="MENTORS_ONLY">Mentors Only (Recommended)</option>
                          <option value="PRIVATE">Private (Only Me)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 md:col-span-3">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Profile Photo URL</label>
                        <input 
                          type="text"
                          value={aboutForm.profilePhoto}
                          placeholder="https://..."
                          onChange={(e) => setAboutForm({ ...aboutForm, profilePhoto: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        />
                      </div>

                      <div className="sm:col-span-2 md:col-span-3">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Bio / Professional Summary</label>
                        <textarea 
                          rows={3}
                          value={aboutForm.bio}
                          onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })}
                          placeholder="Tell mentors about your background, interests, and aspirations..."
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center space-x-2"
                      >
                        {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: EDUCATION SECTION (Multi-record Support)                           */}
            {/* ========================================================================= */}
            {activeTab === "education" && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-[#1e2433]">Education Records</h2>
                    <p className="text-xs text-[#9aa0b4] mt-0.5">Degrees, school, diplomas, and certifications across any academic discipline</p>
                  </div>

                  <button
                    onClick={() => setItemModal({
                      isOpen: true,
                      type: "education",
                      isEditing: false,
                      data: {
                        educationLevel: "Undergraduate",
                        currentStatus: "Currently Studying",
                        gradeType: "Not Applicable"
                      }
                    })}
                    className="px-4 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-semibold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Education</span>
                  </button>
                </div>

                {/* Education List */}
                {(!p?.education || p.education.length === 0) ? (
                  <div className="text-center py-12 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 space-y-3">
                    <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-600">No education records added yet</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Add your university, college, diploma, or school background to match with relevant domain mentors.
                    </p>
                    <button
                      onClick={() => setItemModal({
                        isOpen: true,
                        type: "education",
                        isEditing: false,
                        data: { educationLevel: "Undergraduate", currentStatus: "Currently Studying" }
                      })}
                      className="px-4 py-2 rounded-xl bg-white border border-purple-200 text-[#7922f5] font-bold text-xs hover:bg-purple-50 transition-all"
                    >
                      + Add First Education
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {p.education.map((edu) => (
                      <div key={edu.id} className="rounded-xl border border-[#f1f2f7] p-5 bg-white hover:border-purple-200 transition-all shadow-sm space-y-3 relative group">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#f6f2fe] text-[#7922f5]">
                              {edu.educationLevel || "Undergraduate"}
                            </span>
                            <h3 className="text-base font-bold text-[#1e2433] mt-1.5 leading-snug">
                              {edu.degreeOrProgram || edu.fieldOfStudy || "Academic Program"}
                            </h3>
                            <p className="text-xs font-semibold text-slate-600">
                              {edu.institutionName}
                            </p>
                          </div>

                          <div className="flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setItemModal({
                                isOpen: true,
                                type: "education",
                                isEditing: true,
                                data: edu
                              })}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#7922f5] hover:bg-purple-50"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteModal({
                                isOpen: true,
                                type: "education",
                                id: edu.id,
                                title: edu.degreeOrProgram || edu.institutionName
                              })}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-500">
                          <div>
                            <span className="text-[#9aa0b4] block text-[11px]">Field / Major:</span>
                            <span className="font-semibold text-slate-800">{edu.fieldOfStudy || "—"}</span>
                          </div>
                          <div>
                            <span className="text-[#9aa0b4] block text-[11px]">Status:</span>
                            <span className="font-semibold text-slate-800">{edu.currentStatus}</span>
                          </div>
                          {edu.gradeValue && (
                            <div>
                              <span className="text-[#9aa0b4] block text-[11px]">Grade / {edu.gradeType || "Score"}:</span>
                              <span className="font-semibold text-slate-800">{edu.gradeValue}</span>
                            </div>
                          )}
                          {edu.specialization && (
                            <div>
                              <span className="text-[#9aa0b4] block text-[11px]">Specialization:</span>
                              <span className="font-semibold text-slate-800">{edu.specialization}</span>
                            </div>
                          )}
                        </div>

                        {edu.description && (
                          <p className="text-xs text-slate-500 pt-1 line-clamp-2">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: SKILLS & INTERESTS SECTION                                         */}
            {/* ========================================================================= */}
            {activeTab === "skills" && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-[#1e2433]">Skills & Interests</h2>
                    <p className="text-xs text-[#9aa0b4] mt-0.5">Tag technical, creative, domain-specific, and academic skills</p>
                  </div>

                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-6 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-semibold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all flex items-center space-x-2"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Skills & Interests</span>
                    </button>
                  ) : null}
                </div>

                {!editMode ? (
                  /* VIEW MODE */
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#7922f5] mb-3">Key Skills ({skillsList.length})</h3>
                      <div className="flex flex-wrap gap-2.5">
                        {skillsList.map((s, idx) => (
                          <div 
                            key={idx}
                            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-800 flex items-center space-x-2"
                          >
                            <span>{s.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f6f2fe] text-[#7922f5] font-bold">
                              {s.proficiency}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#7922f5] mb-3">Interests & Discussion Topics ({interestsList.length})</h3>
                      <div className="flex flex-wrap gap-2">
                        {interestsList.map((interest, idx) => (
                          <span 
                            key={idx}
                            className="px-3.5 py-1.5 rounded-full bg-purple-50/70 border border-purple-100 text-xs font-semibold text-[#7922f5]"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* EDIT MODE */
                  <div className="space-y-6 animate-fade-in">
                    {/* Skills Editor */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#7922f5]">Manage Skills</h3>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {skillsList.map((s, idx) => (
                          <div key={idx} className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-900 flex items-center space-x-2">
                            <span>{s.name} ({s.proficiency})</span>
                            <button 
                              type="button"
                              onClick={() => setSkillsList(skillsList.filter((_, i) => i !== idx))}
                              className="text-purple-400 hover:text-red-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add Skill Row */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                          type="text"
                          placeholder="Add skill (e.g. Accounting, Python, Research, Design, Case Analysis)"
                          value={newSkillInput.name}
                          onChange={(e) => setNewSkillInput({ ...newSkillInput, name: e.target.value })}
                          className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        />
                        <select
                          value={newSkillInput.proficiency}
                          onChange={(e) => setNewSkillInput({ ...newSkillInput, proficiency: e.target.value })}
                          className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            if (newSkillInput.name.trim()) {
                              setSkillsList([...skillsList, { ...newSkillInput, name: newSkillInput.name.trim() }]);
                              setNewSkillInput({ ...newSkillInput, name: "" });
                            }
                          }}
                          className="px-4 py-2 bg-[#7922f5] text-white rounded-xl text-xs font-bold hover:bg-[#6819d4]"
                        >
                          + Add Skill
                        </button>
                      </div>
                    </div>

                    {/* Interests Editor */}
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#7922f5]">Manage Interests</h3>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {interestsList.map((interest, idx) => (
                          <div key={idx} className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-semibold text-slate-800 flex items-center space-x-2">
                            <span>{interest}</span>
                            <button 
                              type="button"
                              onClick={() => setInterestsList(interestsList.filter((_, i) => i !== idx))}
                              className="text-slate-400 hover:text-red-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="Add interest topic (e.g. Valuation Models, Startup Strategy, Bioethics)"
                          value={newInterestInput}
                          onChange={(e) => setNewInterestInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newInterestInput.trim()) {
                              e.preventDefault();
                              setInterestsList([...interestsList, newInterestInput.trim()]);
                              setNewInterestInput("");
                            }
                          }}
                          className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newInterestInput.trim()) {
                              setInterestsList([...interestsList, newInterestInput.trim()]);
                              setNewInterestInput("");
                            }
                          }}
                          className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-black"
                        >
                          + Add Interest
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveSkillsAndInterests}
                        disabled={saving}
                        className="px-6 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center space-x-2"
                      >
                        {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 4: EXPERIENCE SECTION (Multi-record Support)                          */}
            {/* ========================================================================= */}
            {activeTab === "experience" && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-[#1e2433]">Work & Practical Experience</h2>
                    <p className="text-xs text-[#9aa0b4] mt-0.5">Internships, research, freelance, student leadership, and employment</p>
                  </div>

                  <button
                    onClick={() => setItemModal({
                      isOpen: true,
                      type: "experience",
                      isEditing: false,
                      data: { type: "Internship", currentlyActive: false }
                    })}
                    className="px-4 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-semibold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                </div>

                {(!p?.experiences || p.experiences.length === 0) ? (
                  <div className="text-center py-12 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 space-y-3">
                    <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-600">No experience added yet</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Share any internships, volunteering, research, or student organization roles to give mentors context on your trajectory.
                    </p>
                    <button
                      onClick={() => setItemModal({
                        isOpen: true,
                        type: "experience",
                        isEditing: false,
                        data: { type: "Internship" }
                      })}
                      className="px-4 py-2 rounded-xl bg-white border border-purple-200 text-[#7922f5] font-bold text-xs hover:bg-purple-50 transition-all"
                    >
                      + Add Experience
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {p.experiences.map((exp) => (
                      <div key={exp.id} className="rounded-xl border border-[#f1f2f7] p-5 bg-white hover:border-purple-200 transition-all shadow-sm space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-base font-bold text-[#1e2433]">{exp.title}</h3>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-[#7922f5]">
                                {exp.type}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-600 mt-0.5">
                              {exp.organization}
                            </p>
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => setItemModal({
                                isOpen: true,
                                type: "experience",
                                isEditing: true,
                                data: exp
                              })}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#7922f5] hover:bg-purple-50"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteModal({
                                isOpen: true,
                                type: "experience",
                                id: exp.id,
                                title: `${exp.title} at ${exp.organization}`
                              })}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {exp.description && (
                          <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                        )}

                        {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {exp.skillsUsed.map((skill, sIdx) => (
                              <span key={sIdx} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 5: PROJECTS SECTION (Multi-record Support)                            */}
            {/* ========================================================================= */}
            {activeTab === "projects" && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-[#1e2433]">Portfolio & Projects</h2>
                    <p className="text-xs text-[#9aa0b4] mt-0.5">Showcase your research papers, design portfolios, case teardowns, or code repos</p>
                  </div>

                  <button
                    onClick={() => setItemModal({
                      isOpen: true,
                      type: "project",
                      isEditing: false,
                      data: { category: "Academic & Research" }
                    })}
                    className="px-4 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-semibold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>

                {(!p?.projects || p.projects.length === 0) ? (
                  <div className="text-center py-12 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 space-y-3">
                    <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-600">No projects listed yet</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Add your case study, design deck, research publication, or portfolio link to get feedback from mentors.
                    </p>
                    <button
                      onClick={() => setItemModal({
                        isOpen: true,
                        type: "project",
                        isEditing: false,
                        data: { category: "Academic & Research" }
                      })}
                      className="px-4 py-2 rounded-xl bg-white border border-purple-200 text-[#7922f5] font-bold text-xs hover:bg-purple-50 transition-all"
                    >
                      + Add Project
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {p.projects.map((proj) => (
                      <div key={proj.id} className="rounded-xl border border-[#f1f2f7] p-5 bg-white hover:border-purple-200 transition-all shadow-sm space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#f6f2fe] text-[#7922f5]">
                              {proj.category || "Project"}
                            </span>
                            <h3 className="text-base font-bold text-[#1e2433] mt-1.5">{proj.title}</h3>
                            {proj.role && <p className="text-xs text-slate-500 font-medium">Role: {proj.role}</p>}
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => setItemModal({
                                isOpen: true,
                                type: "project",
                                isEditing: true,
                                data: proj
                              })}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#7922f5] hover:bg-purple-50"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteModal({
                                isOpen: true,
                                type: "project",
                                id: proj.id,
                                title: proj.title
                              })}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {proj.description && (
                          <p className="text-xs text-slate-600 line-clamp-3">{proj.description}</p>
                        )}

                        {proj.skills && proj.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {proj.skills.map((s, idx) => (
                              <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {(proj.projectUrl || proj.demoUrl || proj.repositoryUrl) && (
                          <div className="pt-2 border-t border-slate-100 flex items-center space-x-3 text-xs">
                            {proj.projectUrl && (
                              <a href={proj.projectUrl} target="_blank" rel="noreferrer" className="text-[#7922f5] font-bold hover:underline flex items-center space-x-1">
                                <ExternalLink className="w-3 h-3" />
                                <span>Project Link</span>
                              </a>
                            )}
                            {proj.demoUrl && (
                              <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="text-slate-600 font-medium hover:underline flex items-center space-x-1">
                                <ExternalLink className="w-3 h-3" />
                                <span>Live Demo</span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 6: CAREER GOALS SECTION (Multi-record Support)                        */}
            {/* ========================================================================= */}
            {activeTab === "goals" && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-[#1e2433]">Career & Academic Goals</h2>
                    <p className="text-xs text-[#9aa0b4] mt-0.5">Set milestones for jobs, internships, entrance exams, or skill mastery</p>
                  </div>

                  <button
                    onClick={() => setItemModal({
                      isOpen: true,
                      type: "goal",
                      isEditing: false,
                      data: { goalType: "Job", priority: "High", status: "In Progress", progressPercentage: 25 }
                    })}
                    className="px-4 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-semibold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Goal</span>
                  </button>
                </div>

                {(!p?.goals || p.goals.length === 0) ? (
                  <div className="text-center py-12 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 space-y-3">
                    <Target className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-600">No career goals created yet</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Tell us what you want to achieve so we can match you with the right verified mentors.
                    </p>
                    <button
                      onClick={() => setItemModal({
                        isOpen: true,
                        type: "goal",
                        isEditing: false,
                        data: { goalType: "Career exploration", priority: "Medium", status: "In Progress" }
                      })}
                      className="px-4 py-2 rounded-xl bg-white border border-purple-200 text-[#7922f5] font-bold text-xs hover:bg-purple-50 transition-all"
                    >
                      + Add Career Goal
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {p.goals.map((goal) => (
                      <div key={goal.id} className="rounded-xl border border-[#f1f2f7] p-5 bg-white hover:border-purple-200 transition-all shadow-sm space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#f6f2fe] text-[#7922f5]">
                                {goal.goalType}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                goal.priority === "High" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                              }`}>
                                {goal.priority} Priority
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-[#1e2433] mt-2">{goal.title}</h3>
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => setItemModal({
                                isOpen: true,
                                type: "goal",
                                isEditing: true,
                                data: goal
                              })}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#7922f5] hover:bg-purple-50"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteModal({
                                isOpen: true,
                                type: "goal",
                                id: goal.id,
                                title: goal.title
                              })}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {goal.description && (
                          <p className="text-xs text-slate-600 line-clamp-2">{goal.description}</p>
                        )}

                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">Status: {goal.status}</span>
                            <span className="font-bold text-[#7922f5]">{goal.progressPercentage}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#7922f5] rounded-full transition-all"
                              style={{ width: `${goal.progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 7: MENTORSHIP PREFERENCES SECTION                                     */}
            {/* ========================================================================= */}
            {activeTab === "mentorship" && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-[#1e2433]">Mentorship Preferences</h2>
                    <p className="text-xs text-[#9aa0b4] mt-0.5">Configure session formats, budget range, and desired mentor domains to power AI recommendations</p>
                  </div>

                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-6 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-semibold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all flex items-center space-x-2"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Preferences</span>
                    </button>
                  ) : null}
                </div>

                {!editMode ? (
                  /* VIEW MODE */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-xl border border-[#f1f2f7] p-6 bg-white space-y-4">
                      <h3 className="text-sm font-bold text-[#1e2433]">Format & Budget</h3>
                      <div className="space-y-3 text-xs sm:text-[13px]">
                        <div>
                          <span className="text-[#9aa0b4] block text-xs">Preferred Session Format</span>
                          <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{mentorshipForm.preferredSessionType}</span>
                        </div>
                        <div>
                          <span className="text-[#9aa0b4] block text-xs">Session Budget Range</span>
                          <span className="font-bold text-[#7922f5] text-[13.5px] mt-0.5 block">₹{mentorshipForm.minBudgetINR} – ₹{mentorshipForm.maxBudgetINR} / session</span>
                        </div>
                        <div>
                          <span className="text-[#9aa0b4] block text-xs">Preferred Languages</span>
                          <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{mentorshipForm.preferredLanguages.join(", ")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#f1f2f7] p-6 bg-white space-y-4">
                      <h3 className="text-sm font-bold text-[#1e2433]">Mentor Profile Matching</h3>
                      <div className="space-y-3 text-xs sm:text-[13px]">
                        <div>
                          <span className="text-[#9aa0b4] block text-xs">Preferred Mentor Fields</span>
                          <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{mentorshipForm.preferredMentorFields.join(" • ") || "Commerce, Engineering, Design"}</span>
                        </div>
                        <div>
                          <span className="text-[#9aa0b4] block text-xs">Topics of Guidance</span>
                          <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{mentorshipForm.preferredMentorExpertise.join(" • ") || "Career Planning, Interview Preparation, Case Studies"}</span>
                        </div>
                        <div>
                          <span className="text-[#9aa0b4] block text-xs">Desired Mentor Experience</span>
                          <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{mentorshipForm.preferredExperienceLevel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* EDIT MODE */
                  <form onSubmit={handleSaveMentorship} className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Session Format</label>
                        <select
                          value={mentorshipForm.preferredSessionType}
                          onChange={(e) => setMentorshipForm({ ...mentorshipForm, preferredSessionType: e.target.value })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        >
                          <option value="1:1 Video">1:1 Video Calls</option>
                          <option value="Audio">Audio Calls</option>
                          <option value="Chat">Chat Mentorship</option>
                          <option value="Any">Any Format</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Max Budget per Session (INR ₹)</label>
                        <input 
                          type="number"
                          value={mentorshipForm.maxBudgetINR}
                          onChange={(e) => setMentorshipForm({ ...mentorshipForm, maxBudgetINR: Number(e.target.value) })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Mentor Fields (comma separated)</label>
                        <input 
                          type="text"
                          value={mentorshipForm.preferredMentorFields.join(", ")}
                          onChange={(e) => setMentorshipForm({ ...mentorshipForm, preferredMentorFields: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Guidance Topics (comma separated)</label>
                        <input 
                          type="text"
                          value={mentorshipForm.preferredMentorExpertise.join(", ")}
                          onChange={(e) => setMentorshipForm({ ...mentorshipForm, preferredMentorExpertise: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center space-x-2"
                      >
                        {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>Save Preferences</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 8: LINKS & RESUME SECTION                                             */}
            {/* ========================================================================= */}
            {activeTab === "links" && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-[#1e2433]">Professional Links & Resume</h2>
                    <p className="text-xs text-[#9aa0b4] mt-0.5">LinkedIn, portfolio, research profiles, and optional PDF resume upload</p>
                  </div>

                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-6 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-semibold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all flex items-center space-x-2"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Links</span>
                    </button>
                  ) : null}
                </div>

                {!editMode ? (
                  /* VIEW MODE */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-xl border border-[#f1f2f7] p-6 bg-white space-y-4">
                      <h3 className="text-sm font-bold text-[#1e2433]">Professional & Social Profiles</h3>
                      <div className="space-y-2.5">
                        {linksList.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-[#7922f5] transition-all text-xs font-semibold text-slate-700"
                          >
                            <div className="flex items-center space-x-2.5">
                              <Globe className="w-4 h-4 text-slate-400" />
                              <span>{link.platform}</span>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#f1f2f7] p-6 bg-white space-y-4">
                      <h3 className="text-sm font-bold text-[#1e2433]">Resume / CV Document</h3>
                      <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-8 h-8 text-[#7922f5]" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{fullName.replace(" ", "_")}_Resume.pdf</p>
                            <span className="text-[11px] text-slate-500">PDF Document • 420 KB</span>
                          </div>
                        </div>
                        <button
                          onClick={() => showToast("Downloading student resume preview...")}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#7922f5]"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* EDIT MODE */
                  <form onSubmit={handleSaveLinks} className="space-y-6 animate-fade-in">
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#7922f5]">Manage Links</h3>
                      
                      {linksList.map((link, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <select
                            value={link.platform}
                            onChange={(e) => {
                              const updated = [...linksList];
                              updated[idx].platform = e.target.value;
                              setLinksList(updated);
                            }}
                            className="w-36 px-3 py-2 text-xs rounded-xl border border-slate-200"
                          >
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Portfolio">Portfolio</option>
                            <option value="GitHub">GitHub</option>
                            <option value="Behance">Behance</option>
                            <option value="Dribbble">Dribbble</option>
                            <option value="ResearchGate">ResearchGate</option>
                            <option value="Google Scholar">Google Scholar</option>
                            <option value="Personal Website">Website</option>
                            <option value="Other">Other</option>
                          </select>

                          <input 
                            type="text"
                            value={link.url}
                            onChange={(e) => {
                              const updated = [...linksList];
                              updated[idx].url = e.target.value;
                              setLinksList(updated);
                            }}
                            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200"
                            placeholder="https://..."
                          />

                          <button
                            type="button"
                            onClick={() => setLinksList(linksList.filter((_, i) => i !== idx))}
                            className="p-2 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {/* Add Link Row */}
                      <div className="flex gap-2 items-center pt-2">
                        <select
                          value={newLinkInput.platform}
                          onChange={(e) => setNewLinkInput({ ...newLinkInput, platform: e.target.value })}
                          className="w-36 px-3 py-2 text-xs rounded-xl border border-slate-200"
                        >
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Portfolio">Portfolio</option>
                          <option value="GitHub">GitHub</option>
                          <option value="Behance">Behance</option>
                          <option value="ResearchGate">ResearchGate</option>
                          <option value="Google Scholar">Google Scholar</option>
                          <option value="Personal Website">Website</option>
                          <option value="Other">Other</option>
                        </select>

                        <input 
                          type="text"
                          placeholder="https://..."
                          value={newLinkInput.url}
                          onChange={(e) => setNewLinkInput({ ...newLinkInput, url: e.target.value })}
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            if (newLinkInput.url.trim()) {
                              setLinksList([...linksList, { ...newLinkInput }]);
                              setNewLinkInput({ platform: "LinkedIn", url: "", label: "" });
                            }
                          }}
                          className="px-4 py-2 bg-[#7922f5] text-white rounded-xl text-xs font-bold hover:bg-[#6819d4]"
                        >
                          + Add Link
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center space-x-2"
                      >
                        {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT GENERIC ITEM MODAL (Education, Experience, Project, Goal) */}
      {/* ========================================================================= */}
      {itemModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#1e2433]">
                {itemModal.isEditing ? "Edit" : "Add"} {itemModal.type.charAt(0).toUpperCase() + itemModal.type.slice(1)}
              </h3>
              <button 
                onClick={() => setItemModal({ ...itemModal, isOpen: false })}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form for Education */}
            {itemModal.type === "education" && (
              <form onSubmit={handleSaveEducation} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Institution / School / University Name *</label>
                  <input 
                    type="text"
                    value={itemModal.data.institutionName || ""}
                    onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, institutionName: e.target.value } })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Education Level</label>
                    <select
                      value={itemModal.data.educationLevel || "Undergraduate"}
                      onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, educationLevel: e.target.value } })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                    >
                      <option value="School">School</option>
                      <option value="Higher Secondary">Higher Secondary</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="Doctorate">Doctorate</option>
                      <option value="Certification">Certification</option>
                      <option value="Vocational">Vocational</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Current Status</label>
                    <select
                      value={itemModal.data.currentStatus || "Currently Studying"}
                      onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, currentStatus: e.target.value } })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                    >
                      <option value="Currently Studying">Currently Studying</option>
                      <option value="Graduated">Graduated</option>
                      <option value="Completed">Completed</option>
                      <option value="On Break">On Break</option>
                      <option value="Dropped Out">Dropped Out</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Degree / Program</label>
                    <input 
                      type="text"
                      placeholder="e.g. B.Com, B.Tech, BA, LLB, MBBS"
                      value={itemModal.data.degreeOrProgram || ""}
                      onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, degreeOrProgram: e.target.value } })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Field of Study</label>
                    <input 
                      type="text"
                      placeholder="e.g. Finance, Biology, Psychology, Design"
                      value={itemModal.data.fieldOfStudy || ""}
                      onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, fieldOfStudy: e.target.value } })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Grade Type (Optional)</label>
                    <select
                      value={itemModal.data.gradeType || "Not Applicable"}
                      onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, gradeType: e.target.value } })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                    >
                      <option value="Not Applicable">Not Applicable</option>
                      <option value="CGPA">CGPA</option>
                      <option value="GPA">GPA</option>
                      <option value="Percentage">Percentage</option>
                      <option value="Grade">Grade</option>
                      <option value="Marks">Marks</option>
                      <option value="Pass/Fail">Pass/Fail</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Grade Score (Optional)</label>
                    <input 
                      type="text"
                      placeholder="e.g. 3.9 / 4.0, 85%, First Class"
                      value={itemModal.data.gradeValue || ""}
                      onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, gradeValue: e.target.value } })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setItemModal({ ...itemModal, isOpen: false })}
                    className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 rounded-xl bg-[#7922f5] text-white font-bold text-xs hover:bg-[#6819d4]"
                  >
                    Save Education
                  </button>
                </div>
              </form>
            )}

            {/* Form for Experience */}
            {itemModal.type === "experience" && (
              <form onSubmit={handleSaveExperience} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Job Title *</label>
                  <input 
                    type="text"
                    value={itemModal.data.title || ""}
                    onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, title: e.target.value } })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Employer *</label>
                    <input 
                      type="text"
                      value={itemModal.data.organization || ""}
                      onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, organization: e.target.value } })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                    <select
                      value={itemModal.data.type || "Internship"}
                      onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, type: e.target.value } })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                    >
                      <option value="Internship">Internship</option>
                      <option value="Employment">Employment</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Volunteer">Volunteer</option>
                      <option value="Research">Research</option>
                      <option value="Student Organization">Student Organization</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Skills Used (comma separated)</label>
                  <input 
                    type="text"
                    placeholder="e.g. Valuation, Excel, Negotiation, Research"
                    value={Array.isArray(itemModal.data.skillsUsed) ? itemModal.data.skillsUsed.join(", ") : (itemModal.data.skillsUsed || "")}
                    onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, skillsUsed: e.target.value } })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <textarea 
                    rows={3}
                    value={itemModal.data.description || ""}
                    onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, description: e.target.value } })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setItemModal({ ...itemModal, isOpen: false })}
                    className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 rounded-xl bg-[#7922f5] text-white font-bold text-xs hover:bg-[#6819d4]"
                  >
                    Save Experience
                  </button>
                </div>
              </form>
            )}

            {/* Form for Projects */}
            {itemModal.type === "project" && (
              <form onSubmit={handleSaveProject} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title *</label>
                  <input 
                    type="text"
                    value={itemModal.data.title || ""}
                    onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, title: e.target.value } })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                    <input 
                      type="text"
                      placeholder="e.g. Valuation Model, UI/UX, Research Paper"
                      value={itemModal.data.category || ""}
                      onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, category: e.target.value } })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Role</label>
                    <input 
                      type="text"
                      placeholder="e.g. Lead Author, Analyst, Designer"
                      value={itemModal.data.role || ""}
                      onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, role: e.target.value } })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project or Portfolio URL (Behance / Drive / GitHub / ResearchGate)</label>
                  <input 
                    type="text"
                    placeholder="https://..."
                    value={itemModal.data.projectUrl || ""}
                    onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, projectUrl: e.target.value } })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <textarea 
                    rows={3}
                    value={itemModal.data.description || ""}
                    onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, description: e.target.value } })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setItemModal({ ...itemModal, isOpen: false })}
                    className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 rounded-xl bg-[#7922f5] text-white font-bold text-xs hover:bg-[#6819d4]"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            )}

            {/* Form for Career Goals */}
            {itemModal.type === "goal" && (
              <form onSubmit={handleSaveGoal} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Goal Title *</label>
                  <input 
                    type="text"
                    placeholder="e.g. Become a Financial Analyst, Prepare for Entrance Exam"
                    value={itemModal.data.title || ""}
                    onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, title: e.target.value } })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Goal Type</label>
                    <select
                      value={itemModal.data.goalType || "Career exploration"}
                      onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, goalType: e.target.value } })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                    >
                      <option value="Get a Job">Get a Job</option>
                      <option value="Get an Internship">Get an Internship</option>
                      <option value="Learn a Skill">Learn a Skill</option>
                      <option value="Prepare for an Exam">Prepare for an Exam</option>
                      <option value="Build a Portfolio">Build a Portfolio</option>
                      <option value="Start a Business">Start a Business</option>
                      <option value="Career exploration">Career exploration (Still exploring)</option>
                      <option value="Higher Education">Higher Education</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                    <select
                      value={itemModal.data.priority || "Medium"}
                      onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, priority: e.target.value } })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                    <select
                      value={itemModal.data.status || "In Progress"}
                      onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, status: e.target.value } })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Paused">Paused</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Progress Percentage ({itemModal.data.progressPercentage || 0}%)</label>
                    <input 
                      type="range"
                      min={0}
                      max={100}
                      value={itemModal.data.progressPercentage || 0}
                      onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, progressPercentage: Number(e.target.value) } })}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setItemModal({ ...itemModal, isOpen: false })}
                    className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 rounded-xl bg-[#7922f5] text-white font-bold text-xs hover:bg-[#6819d4]"
                  >
                    Save Goal
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE CONFIRMATION                                                */}
      {/* ========================================================================= */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Delete {deleteModal.type}?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently remove <span className="font-semibold text-slate-800">"{deleteModal.title}"</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20"
              >
                {saving ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PUBLIC PROFILE PREVIEW                                             */}
      {/* ========================================================================= */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-[#7922f5]" />
                <h3 className="text-lg font-bold text-[#1e2433]">Public Profile Preview</h3>
              </div>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Public Card */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <img 
                  src={avatarUrl}
                  alt={fullName}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-100 shadow-sm"
                />
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{fullName}</h4>
                  <p className="text-xs font-semibold text-[#7922f5]">{aboutForm.primaryField || "Commerce & Finance"}</p>
                  <p className="text-xs text-slate-400">{aboutForm.city || "Springfield"}, {aboutForm.country || "India"}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                {aboutForm.bio || "Student focused on career development and seeking verified mentor guidance."}
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Verified Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-purple-50 text-[#7922f5] text-xs font-semibold">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Target Roles & Goals</h5>
                <div className="p-3.5 rounded-xl bg-purple-50/40 border border-purple-100 space-y-1 text-xs">
                  <p className="font-bold text-slate-900">{aboutForm.targetRole || "Career Exploration"}</p>
                  <p className="text-slate-500">Targeting {aboutForm.targetOrganizations || "Leading companies in field"}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-6 py-2 rounded-xl bg-[#7922f5] text-white font-bold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PROFILE READINESS 10-SECTION BREAKDOWN                             */}
      {/* ========================================================================= */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-[#1e2433]">Profile Readiness Score</h3>
                <p className="text-xs text-slate-400 mt-0.5">Calculated from 10 weighted profile sections</p>
              </div>
              <button 
                onClick={() => setShowCompletionModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { label: "Basic Info & Location", weight: "15%", done: !!aboutForm.firstName && !!aboutForm.city },
                { label: "Academic Discipline & Field", weight: "15%", done: !!aboutForm.primaryField },
                { label: "Education Records", weight: "15%", done: (p?.education?.length || 0) > 0 },
                { label: "Skills & Proficiency", weight: "10%", done: skillsList.length > 0 },
                { label: "Interests & Topics", weight: "10%", done: interestsList.length > 0 },
                { label: "Career Goals & Milestones", weight: "15%", done: (p?.goals?.length || 0) > 0 },
                { label: "Experience & Projects", weight: "10%", done: (p?.experiences?.length || 0) > 0 || (p?.projects?.length || 0) > 0 },
                { label: "Mentorship Preferences", weight: "5%", done: mentorshipForm.preferredMentorFields.length > 0 },
                { label: "Links & Resume", weight: "5%", done: linksList.length > 0 }
              ].map((sec, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center space-x-2.5">
                    {sec.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                    )}
                    <span className="font-semibold text-slate-800">{sec.label}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">{sec.weight}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowCompletionModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#7922f5] text-white font-bold text-xs"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
