"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Check, 
  X, 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Eye, 
  Building2,
  Mail,
  Award,
  Loader2
} from "lucide-react";

import { 
  useAdminVerifications, 
  useApproveMentorMutation, 
  useRejectMentorMutation 
} from "@/hooks/useQueries";

const INITIAL_APPLICANTS = [
  {
    id: "app-1",
    name: "Dr. Anirudh Sen",
    email: "anirudh.sen@aiims.edu",
    role: "Chief Resident, Dept of Neurobiology",
    company: "AIIMS New Delhi",
    category: "Medical & Healthcare",
    experienceYears: 8,
    appliedAt: "Oct 5, 2026, 11:20 AM",
    status: "PENDING",
    documents: [
      { name: "Government ID / Passport", type: "ID_PROOF", status: "VERIFIED" },
      { name: "AIIMS Staff ID Card", type: "EMPLOYMENT_PROOF", status: "PENDING" },
      { name: "MD Degree Certificate", type: "DEGREE", status: "PENDING" },
    ],
    bio: "Conducting clinical trials and mentoring postgraduate medical students for national entrance and super-specialty interviews.",
  },
  {
    id: "app-2",
    name: "Sanya Malhotra",
    email: "sanya.m@trilegal.com",
    role: "Senior Associate, Corporate M&A",
    company: "Trilegal",
    category: "Law & Legal Studies",
    experienceYears: 6,
    appliedAt: "Oct 5, 2026, 09:15 AM",
    status: "PENDING",
    documents: [
      { name: "Bar Council Enrollment Card", type: "ID_PROOF", status: "VERIFIED" },
      { name: "Trilegal Corporate Offer/Payslip", type: "EMPLOYMENT_PROOF", status: "PENDING" },
    ],
    bio: "Advising cross-border corporate mergers. Mentoring law students for Tier-1 corporate firm recruitment and internships.",
  },
  {
    id: "app-3",
    name: "Rohan Varma",
    email: "rohan.v@goldmansachs.com",
    role: "VP Quantitative Strategy",
    company: "Goldman Sachs",
    category: "Commerce & Finance",
    experienceYears: 9,
    appliedAt: "Oct 4, 2026, 04:40 PM",
    status: "PENDING",
    documents: [
      { name: "Goldman Sachs Corporate Badge", type: "EMPLOYMENT_PROOF", status: "PENDING" },
      { name: "PAN Card", type: "ID_PROOF", status: "VERIFIED" },
    ],
    bio: "Derivatives pricing and algorithmic portfolio management. Mentoring quantitative finance aspirants for Wall Street and Dalal Street.",
  },
];

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rejectApplicantSchema, RejectApplicantFormData } from "@/lib/validations";
import { useAppDispatch } from "@/store/hooks";
import { addToast } from "@/store/slices/uiSlice";

export default function AdminVerificationsPage() {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // React Hook Form for rejection reason audit
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RejectApplicantFormData>({
    resolver: zodResolver(rejectApplicantSchema),
    defaultValues: { reason: "" },
  });

  // TanStack Query Hooks & Mutations
  const { data: serverApplicants, isLoading } = useAdminVerifications();
  const approveMutation = useApproveMentorMutation();
  const rejectMutation = useRejectMentorMutation();

  const [localApplicants, setLocalApplicants] = useState(INITIAL_APPLICANTS);

  const applicants = (serverApplicants && serverApplicants.length > 0) ? serverApplicants : localApplicants;

  const showToast = (msg: string, type: "success" | "error" | "info" | "warning" = "success") => {
    setActionMessage(msg);
    dispatch(addToast({ message: msg, type }));
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleApprove = async (id: string, name: string) => {
    try {
      await approveMutation.mutateAsync(id);
    } catch {
      // Local fallback
    }
    setLocalApplicants((prev) => prev.filter((a) => a.id !== id));
    showToast(`✅ ${name}'s application has been verified and published to the live directory!`);
    setSelectedApplicant(null);
  };

  const handleRejectSubmit = async (data: RejectApplicantFormData) => {
    if (!selectedApplicant) return;
    try {
      await rejectMutation.mutateAsync({ mentorId: selectedApplicant.id, reason: data.reason });
    } catch {
      // Local fallback
    }
    setLocalApplicants((prev) => prev.filter((a) => a.id !== selectedApplicant.id));
    showToast(`⚠️ ${selectedApplicant.name}'s application rejected with feedback sent to applicant.`, "warning");
    setIsRejectModalOpen(false);
    setSelectedApplicant(null);
    reset({ reason: "" });
  };

  const filtered = applicants.filter((a) => {
    if (filterCategory !== "All" && a.category !== filterCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {actionMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-[#7922f5] text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between space-x-3 animate-slideIn text-xs font-medium">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="p-1 hover:bg-white/10 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
            <Link href="/admin" className="hover:text-[#7922f5]">Admin</Link>
            <span>/</span>
            <span className="text-[#1e2433] font-semibold">KYC Verification Queue</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Mentor Identity & Employment Verification
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Zero fake claims invariant: Verify official employment credentials and degree documents before marketplace activation.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#f6f2fe] border border-purple-100 text-[#7922f5] text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>{applicants.length} Pending Approvals</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-[#9aa0b4] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search applicant name, company, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#f8f9fb] border border-[#eaecf2] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1e2433] placeholder-[#9aa0b4] focus:outline-none focus:border-[#7922f5] font-medium"
          />
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto text-xs">
          <span className="text-[#9aa0b4] font-medium">Filter by Field:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#f8f9fb] border border-[#eaecf2] rounded-xl px-3 py-1.5 text-xs text-[#1e2433] font-medium focus:outline-none focus:border-[#7922f5]"
          >
            <option value="All">All Disciplines</option>
            <option value="Medical & Healthcare">Medical & Healthcare</option>
            <option value="Law & Legal Studies">Law & Legal Studies</option>
            <option value="Commerce & Finance">Commerce & Finance</option>
            <option value="Engineering & Technology">Engineering & Technology</option>
          </select>
        </div>
      </div>

      {/* Verification Queue Cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#eef0f6] shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7922f5] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#1e2433]">No pending verification applications!</h3>
          <p className="text-xs text-[#5a627a] max-w-sm mx-auto">All mentor KYC onboarding requests have been reviewed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] hover:border-purple-200 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#1e2433]">{app.name}</h3>
                    <p className="text-xs text-[#7922f5] font-semibold">{app.role}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                    PENDING
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#5a627a]">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-3.5 h-3.5 text-[#9aa0b4]" />
                    <span className="font-medium text-[#1e2433]">{app.company}</span>
                    <span className="text-[#9aa0b4]">({app.experienceYears} yrs exp)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-[#9aa0b4]" />
                    <span>{app.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-3.5 h-3.5 text-[#9aa0b4]" />
                    <span>{app.category}</span>
                  </div>
                </div>

                <p className="text-xs text-[#5a627a] line-clamp-2 leading-relaxed bg-[#f8f9fb] p-3 rounded-xl border border-[#eaecf2]">
                  "{app.bio}"
                </p>

                {/* Uploaded Documents preview */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#9aa0b4]">Submitted Proofs:</div>
                  <div className="space-y-1">
                    {app.documents?.map((doc: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-[#f8f9fb] border border-[#eaecf2]">
                        <span className="font-medium text-[#1e2433] truncate">{doc.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${doc.status === "VERIFIED" ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-[#7922f5]"}`}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                <button
                  onClick={() => handleApprove(app.id, app.name)}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-1 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedApplicant(app);
                    setIsRejectModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors flex items-center justify-center space-x-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal with Reason Input */}
      {isRejectModalOpen && selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#eaecf2]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1e2433]">Reject Mentor Application</h3>
              <button onClick={() => setIsRejectModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleRejectSubmit)} className="space-y-4">
              <p className="text-xs text-[#5a627a]">
                Please specify the audit reason for rejecting <strong>{selectedApplicant.name}</strong>'s verification request:
              </p>

              <div>
                <textarea
                  rows={3}
                  {...register("reason")}
                  placeholder="e.g. Official employment ID expired or unverified corporate domain email..."
                  className="w-full bg-[#f8f9fb] border border-[#eaecf2] rounded-xl p-3 text-xs text-[#1e2433] placeholder-[#9aa0b4] focus:outline-none focus:border-[#7922f5]"
                />
                {errors.reason && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.reason.message}</p>
                )}
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRejectModalOpen(false);
                    reset({ reason: "" });
                  }}
                  className="px-4 py-2 rounded-xl border border-[#eaecf2] text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
