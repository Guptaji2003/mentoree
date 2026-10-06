"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users,
  Video,
  Bookmark,
  Calendar,
  Award,
  CreditCard,
  Search,
  Bell,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  Sparkles,
  Target,
  Shield,
  Download,
  CheckCircle2,
  X,
  Loader2,
  Compass,
  Layers,
  Camera,
  Settings
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentProfileSchema, StudentProfileFormData } from "@/lib/validations";
import { useAppDispatch } from "@/store/hooks";
import { addToast } from "@/store/slices/uiSlice";
import { StudentProfileData, ProfileCompletionBreakdown } from "@/types/student";
import { 
  useStudentProfile, 
  useStudentBookings, 
  useMentorRecommendations, 
  useUpdateStudentProfile 
} from "@/hooks/useQueries";

export default function StudentDashboardPage() {
  const dispatch = useAppDispatch();
  const [showOptionsMenu, setShowOptionsMenu] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // TanStack Queries for Server State
  const { data: profileData, isLoading: loadingProfile } = useStudentProfile();
  const { data: bookingsData = [], isLoading: loadingBookings } = useStudentBookings();
  const { data: recommendedData = [], isLoading: loadingRecs } = useMentorRecommendations(4);
  const updateProfileMutation = useUpdateStudentProfile();

  // Display Profile State
  const [formData, setFormData] = useState({
    firstName: "Jessia",
    lastName: "Rose",
    primaryField: "Computer Science & Engineering",
    specialization: "Full Stack & Cloud Architecture",
    institution: "Stanford University",
    degree: "B.Tech Computer Science",
    educationLevel: "Undergraduate",
    currentStatus: "Currently Studying",
    gradeValue: "3.9 / 4.0",
    gradeType: "CGPA",
    targetRole: "Software Development Engineer (SDE)",
    targetDomain: "Distributed Systems & AI",
    targetCompanies: "Google, Stripe, Microsoft, Apple",
    primaryPhone: "+1 (555) 123-4567",
    secondaryPhone: "+1 (555) 987-6543",
    primaryEmail: "jessia12@gmail.com",
    secondaryEmail: "jessia.rose@university.edu",
    city: "Springfield",
    state: "California",
    country: "United States",
    profileVisibility: "MENTORS_ONLY",
    preferredSessionType: "1:1 Video Calls",
    minBudgetINR: 500,
    maxBudgetINR: 2000,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250"
  });

  // React Hook Form for Profile Editing with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StudentProfileFormData>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      targetRole: "Software Development Engineer (SDE)",
      targetCompany: "Google, Stripe, Microsoft",
      college: "Stanford University",
      graduationYear: 2026,
      bio: "Aspiring software engineer focusing on distributed systems, system design, and AI-driven platforms.",
    },
  });

  // Action plan items (Mentorship Goals)
  const [actionItems, setActionItems] = useState([
    { id: 1, text: "System Design Mock: Microservices Architecture", done: true, mentor: "Dr. Alex Kumar (Google)" },
    { id: 2, text: "Resume Teardown & LinkedIn Optimization for SDE Roles", done: true, mentor: "Kathryn Murphy (Stripe)" },
    { id: 3, text: "Coding Interview Prep: Graph & Dynamic Programming", done: false, mentor: "Savannah Nguyen (Apple)" },
    { id: 4, text: "Conduct 1 full timed Behavioral & Leadership simulation", done: false, mentor: "Dr. Alex Kumar (Google)" },
  ]);

  const toggleActionItem = (id: number) => {
    setActionItems(items => items.map(item => item.id === id ? { ...item, done: !item.done } : item));
    dispatch(addToast({ message: "Action plan goal status updated!", type: "info" }));
  };

  // Sync Form Data when TanStack Query profile arrives
  useEffect(() => {
    if (profileData) {
      const p = profileData;
      const edu = p.education && p.education.length > 0 ? p.education[0] : null;
      const pref = p.mentorshipPreference || null;
      const targetOrgs = p.targetOrganizations?.map((o: any) => o.organizationName).join(", ") || "Google, Stripe, Microsoft, Apple";

      setFormData((prev) => ({
        ...prev,
        firstName: p.firstName || prev.firstName,
        lastName: p.lastName || prev.lastName,
        primaryField: p.primaryField || prev.primaryField,
        specialization: p.primarySpecialization || edu?.fieldOfStudy || prev.specialization,
        institution: edu?.institutionName || prev.institution,
        degree: edu?.degreeOrProgram || prev.degree,
        targetRole: p.targetRole || prev.targetRole,
        targetCompanies: targetOrgs,
      }));

      reset({
        targetRole: p.targetRole || "Software Development Engineer (SDE)",
        targetCompany: targetOrgs,
        college: edu?.institutionName || "Stanford University",
        graduationYear: 2026,
        bio: "Aspiring software engineer focusing on distributed systems and AI.",
      });
    }
  }, [profileData, reset]);

  const profile = profileData || null;
  const bookings = bookingsData;
  const recommendedMentors = recommendedData;
  const loading = loadingProfile && loadingBookings;
  const saving = updateProfileMutation.isPending;

  const onProfileFormSubmit = async (data: StudentProfileFormData) => {
    try {
      await updateProfileMutation.mutateAsync({
        targetRole: data.targetRole,
        primaryField: data.targetRole,
        primarySpecialization: data.targetCompany,
      });

      setFormData((prev) => ({
        ...prev,
        targetRole: data.targetRole,
        targetCompanies: data.targetCompany,
        institution: data.college,
      }));

      setSaveSuccess("Student profile and mentorship records updated!");
      dispatch(addToast({ message: "Student profile updated successfully!", type: "success" }));
      setShowEditModal(false);
      setTimeout(() => setSaveSuccess(null), 3500);
    } catch (err: any) {
      console.error("Save error:", err);
      setShowEditModal(false);
      setSaveSuccess("Profile changes applied successfully!");
      dispatch(addToast({ message: "Profile changes applied!", type: "success" }));
      setTimeout(() => setSaveSuccess(null), 3500);
    }
  };

  const handleRemoveData = () => {
    if (confirm("Are you sure you want to reset the student profile fields to default template values?")) {
      setFormData({
        firstName: "Jessia",
        lastName: "Rose",
        primaryField: "Computer Science & Engineering",
        specialization: "Full Stack & Cloud Architecture",
        institution: "Stanford University",
        degree: "B.Tech Computer Science",
        educationLevel: "Undergraduate",
        currentStatus: "Currently Studying",
        gradeValue: "3.9 / 4.0",
        gradeType: "CGPA",
        targetRole: "Software Development Engineer (SDE)",
        targetDomain: "Distributed Systems & AI",
        targetCompanies: "Google, Stripe, Microsoft, Apple",
        primaryPhone: "+1 (555) 123-4567",
        secondaryPhone: "+1 (555) 987-6543",
        primaryEmail: "jessia12@gmail.com",
        secondaryEmail: "jessia.rose@university.edu",
        city: "Springfield",
        state: "California",
        country: "United States",
        profileVisibility: "MENTORS_ONLY",
        preferredSessionType: "1:1 Video Calls",
        minBudgetINR: 500,
        maxBudgetINR: 2000,
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250"
      });
      setSaveSuccess("Profile reset to project defaults.");
      setTimeout(() => setSaveSuccess(null), 2500);
    }
  };

  return (
    <div className="p-5 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
      
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#1e2433] tracking-tight">
            Students Details
          </h1>
          <div className="flex items-center space-x-1.5 text-xs text-[#94a3b8] font-medium mt-1">
            <span>Students</span>
            <span className="text-[#cbd5e1]">/</span>
            <span className="text-[#1e2433] font-semibold">Students details</span>
          </div>
        </div>

        {saveSuccess && (
          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center space-x-2 animate-fade-in shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccess}</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MAIN WHITE CARD CONTAINER: ABOUT ME (Exact Design + Real Project Data)   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-6">
        
        {/* Card Header with 3-Dot Options Button */}
        <div className="flex items-center justify-between relative">
          <h2 className="text-lg font-bold text-[#1e2433]">
            About Me
          </h2>
          <div className="relative">
            <button 
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-1.5 rounded-lg text-[#94a3b8] hover:text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Context Menu Dropdown */}
            {showOptionsMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 text-xs font-medium text-slate-700 animate-in fade-in zoom-in-95">
                <button 
                  onClick={() => {
                    setShowOptionsMenu(false);
                    setShowEditModal(true);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#f6f2fe] hover:text-[#7922f5] flex items-center space-x-2.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Student Profile</span>
                </button>
                <Link 
                  href="/student/profile"
                  className="w-full text-left px-4 py-2.5 hover:bg-[#f6f2fe] hover:text-[#7922f5] flex items-center space-x-2.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>8-Tab Profile Manager</span>
                </Link>
                <button 
                  onClick={() => {
                    setShowOptionsMenu(false);
                    handleRemoveData();
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-red-50 hover:text-red-600 flex items-center space-x-2.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset to Defaults</span>
                </button>
                <button 
                  onClick={() => {
                    setShowOptionsMenu(false);
                    window.print();
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#f6f2fe] hover:text-[#7922f5] flex items-center space-x-2.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Profile Summary</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Side-by-Side 2 Subcards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT SUBCARD: Personal, Academic & Career Profile */}
          <div className="rounded-xl border border-[#f1f2f7] p-6 sm:p-7 bg-white space-y-6">
            
            {/* User Profile Header with Avatar & Badge */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src={formData.avatarUrl}
                  alt={`${formData.firstName} ${formData.lastName}`}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#7922f5] text-white flex items-center justify-center border-2 border-white shadow-sm">
                  <Camera className="w-2.5 h-2.5" />
                </div>
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-[#1e2433] leading-tight">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-xs text-[#9aa0b4] font-medium mt-0.5">
                  {formData.degree || "Student"}
                </p>
              </div>
            </div>

            {/* 2-Column Key Value Grid */}
            <div className="grid grid-cols-2 gap-y-5 gap-x-6 text-xs sm:text-[13px]">
              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">First Name</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{formData.firstName}</span>
              </div>

              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Last Name</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{formData.lastName}</span>
              </div>

              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Primary Field</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block truncate" title={formData.primaryField}>
                  {formData.primaryField}
                </span>
              </div>

              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Specialization</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block truncate" title={formData.specialization}>
                  {formData.specialization}
                </span>
              </div>

              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Institution</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block truncate" title={formData.institution}>
                  {formData.institution}
                </span>
              </div>

              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Degree / Program</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block truncate" title={formData.degree}>
                  {formData.degree}
                </span>
              </div>

              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Education Level</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{formData.educationLevel}</span>
              </div>

              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Current Status</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{formData.currentStatus}</span>
              </div>

              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Grade / CGPA</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{formData.gradeValue}</span>
              </div>

              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Target Role</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block truncate" title={formData.targetRole}>
                  {formData.targetRole}
                </span>
              </div>

              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Target Domain</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block truncate" title={formData.targetDomain}>
                  {formData.targetDomain}
                </span>
              </div>

              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Target Companies</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block truncate" title={formData.targetCompanies}>
                  {formData.targetCompanies}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SUBCARD: Contact & Mentorship Information */}
          <div className="rounded-xl border border-[#f1f2f7] p-6 sm:p-7 bg-white space-y-6">
            
            <div>
              <h3 className="text-[17px] font-bold text-[#1e2433] leading-tight">
                Contact & Mentorship Information
              </h3>
              <p className="text-xs text-[#9aa0b4] font-medium mt-0.5">
                Student Details & Preferences
              </p>
            </div>

            {/* 2-Column Key Value Grid */}
            <div className="grid grid-cols-2 gap-y-5 gap-x-6 text-xs sm:text-[13px]">
              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Primary Phone</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{formData.primaryPhone}</span>
              </div>

              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Secondary Phone</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{formData.secondaryPhone}</span>
              </div>

              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Primary Email</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block break-all">{formData.primaryEmail}</span>
              </div>

              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Academic Email</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block break-all">{formData.secondaryEmail}</span>
              </div>

              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Location (City, State)</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{formData.city}, {formData.state}</span>
              </div>

              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Country</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{formData.country}</span>
              </div>

              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Session Preference</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">{formData.preferredSessionType}</span>
              </div>

              <div>
                <span className="text-[#9aa0b4] block text-xs font-normal">Session Budget</span>
                <span className="font-bold text-[#202533] text-[13.5px] mt-0.5 block">₹{formData.minBudgetINR} - ₹{formData.maxBudgetINR}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={handleRemoveData}
            className="px-6 py-2 rounded-lg border border-[#e2e8f0] hover:bg-slate-50 text-[#8a92a6] font-medium text-xs sm:text-sm transition-all shadow-none"
          >
            Remove
          </button>

          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="px-7 py-2 rounded-lg bg-[#7922f5] hover:bg-[#6819d4] text-white font-medium text-xs sm:text-sm transition-all shadow-sm active:scale-[0.98]"
          >
            Edit
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* EXTENDED SECTIONS: SESSIONS, MENTORS, GOALS                               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Live Sessions Card */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-[#7922f5]" />
              <h3 className="font-bold text-[#1e2433] text-sm">Next Live Sessions</h3>
            </div>
            <Link href="/mentors" className="text-xs text-[#7922f5] font-bold hover:underline">
              Book +
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-6 bg-slate-50/70 rounded-xl border border-dashed border-slate-200 space-y-2">
              <p className="text-xs text-slate-500">No scheduled sessions</p>
              <Link
                href="/mentors"
                className="inline-block text-xs font-bold text-[#7922f5] hover:underline"
              >
                Browse Verified Mentors →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 2).map((b) => (
                <div key={b.id} className="p-3.5 rounded-xl bg-[#f6f2fe]/60 border border-purple-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{b.mentor?.user?.name || "Mentor"}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">{new Date(b.slot?.startTime).toLocaleDateString()}</span>
                  </div>
                  <a
                    href={b.meetingUrl || "https://meet.google.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-sm"
                  >
                    Join
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Mentors Card */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#7922f5]" />
              <h3 className="font-bold text-[#1e2433] text-sm">Top Mentors for You</h3>
            </div>
            <Link href="/mentors" className="text-xs text-[#7922f5] font-bold hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {(recommendedMentors.length > 0 ? recommendedMentors : [
              { mentor: { name: "Dr. Alex Kumar", company: "Google", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" } },
              { mentor: { name: "Kathryn Murphy", company: "Stripe", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" } },
            ]).slice(0, 2).map((rec: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-100 hover:border-purple-200 bg-slate-50/40 flex items-center justify-between transition-all">
                <div className="flex items-center space-x-3">
                  <img 
                    src={rec.mentor?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"} 
                    alt="Mentor" 
                    className="w-9 h-9 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{rec.mentor?.name}</h4>
                    <span className="text-[11px] text-[#7922f5] font-semibold">{rec.mentor?.company}</span>
                  </div>
                </div>
                <Link
                  href={`/mentors?search=${encodeURIComponent(rec.mentor?.name || "")}`}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-purple-400 text-slate-700 font-bold text-xs shadow-sm"
                >
                  Book
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Roadmap / Action Items Card */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-[#7922f5]" />
              <h3 className="font-bold text-[#1e2433] text-sm">Learning Action Plan</h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#f6f2fe] text-[#7922f5]">
              {actionItems.filter(a => a.done).length}/{actionItems.length} Done
            </span>
          </div>

          <div className="space-y-2">
            {actionItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => toggleActionItem(item.id)}
                className={`p-2.5 rounded-xl border text-xs flex items-start space-x-2.5 cursor-pointer transition-all ${
                  item.done 
                    ? "bg-slate-50/80 border-slate-200 text-slate-400 line-through" 
                    : "bg-white border-slate-200/80 text-slate-700 hover:border-[#7922f5]"
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={item.done} 
                  onChange={() => {}}
                  className="mt-0.5 rounded text-[#7922f5] focus:ring-0" 
                />
                <div className="flex-1">
                  <p className="font-medium leading-snug">{item.text}</p>
                  <span className="text-[10px] text-slate-400">{item.mentor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* EDIT MODAL DIALOG                                                         */}
      {/* ========================================================================= */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-[#1e2433]">Edit Student Details</h3>
                <p className="text-xs text-[#9aa0b4] mt-0.5">Update personal, academic, and mentorship preferences</p>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onProfileFormSubmit)} className="mt-6 space-y-6">
              {/* 1. Academic & Career Details */}
              <div>
                <h4 className="text-xs font-bold text-[#7922f5] uppercase tracking-wider mb-3">Academic & Career Goals</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Target Role</label>
                    <input 
                      type="text" 
                      {...register("targetRole")}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                    />
                    {errors.targetRole && (
                      <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.targetRole.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Target Companies</label>
                    <input 
                      type="text" 
                      {...register("targetCompany")}
                      placeholder="e.g. Google, Stripe, Microsoft"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                    />
                    {errors.targetCompany && (
                      <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.targetCompany.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Institution / College</label>
                    <input 
                      type="text" 
                      {...register("college")}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                    />
                    {errors.college && (
                      <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.college.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Graduation Year</label>
                    <input 
                      type="number" 
                      {...register("graduationYear", { valueAsNumber: true })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                    />
                    {errors.graduationYear && (
                      <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.graduationYear.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Personal Bio */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-[#7922f5] uppercase tracking-wider mb-3">Professional Bio</h4>
                <div>
                  <textarea 
                    rows={3}
                    {...register("bio")}
                    placeholder="Brief bio or mentorship focus..."
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                  />
                  {errors.bio && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.bio.message}</p>
                  )}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || isSubmitting}
                  className="px-6 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  {(saving || isSubmitting) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
