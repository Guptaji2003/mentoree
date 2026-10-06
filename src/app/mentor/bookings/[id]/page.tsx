"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Video,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  RotateCcw,
  MessageSquare,
  AlertTriangle,
  FileText,
  User,
  ShieldCheck,
  DollarSign,
  GraduationCap,
  Sparkles,
  Check,
  X,
  Loader2,
} from "lucide-react";
import {
  useMentorBookingDetail,
  useAcceptBookingRequestMutation,
  useDeclineBookingRequestMutation,
  useCompleteBookingMutation,
  useCancelBookingMutation,
  useRescheduleBookingMutation,
  useMarkNoShowMutation,
} from "@/hooks/useQueries";

export default function MentorBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string;

  const { data: booking, isLoading } = useMentorBookingDetail(bookingId);
  const acceptMutation = useAcceptBookingRequestMutation();
  const declineMutation = useDeclineBookingRequestMutation();
  const completeMutation = useCompleteBookingMutation();
  const cancelMutation = useCancelBookingMutation();
  const rescheduleMutation = useRescheduleBookingMutation();
  const noShowMutation = useMarkNoShowMutation();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isActionPlanModalOpen, setIsActionPlanModalOpen] = useState(false);
  const [deliverableText, setDeliverableText] = useState("");

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAcceptRequest = async () => {
    try {
      await acceptMutation.mutateAsync(bookingId);
      showToast("Booking request accepted!");
    } catch (err: any) {
      showToast(err.message || "Failed to accept booking");
    }
  };

  const handleDeclineRequest = async () => {
    try {
      await declineMutation.mutateAsync({
        bookingId,
        reason: cancelReason || "Mentor unavailable at requested time",
      });
      showToast("Booking request declined.");
      setIsCancelModalOpen(false);
    } catch (err: any) {
      showToast(err.message || "Failed to decline booking");
    }
  };

  const handleCompleteSession = async () => {
    try {
      await completeMutation.mutateAsync({
        bookingId,
        actionPlanDeliverable: deliverableText,
      });
      showToast("Session completed & action plan deliverable shared with student!");
      setIsActionPlanModalOpen(false);
    } catch (err: any) {
      showToast(err.message || "Failed to complete session");
    }
  };

  // Fallback data
  const displayBooking = booking || {
    id: bookingId,
    status: "CONFIRMED",
    amount: 2000,
    meetingUrl: "https://meet.google.com/xyz-mentoree-session",
    preSessionGoal: "Review 3-statement financial model & DCF assumptions for M&A casing.",
    preSessionQuestions: "1. How to best justify terminal growth rate?\n2. What sensitivity tables matter most to partners?",
    slot: {
      startTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    },
    student: {
      id: "u-101",
      name: "Pulkit Gupta",
      email: "pulkit.gupta@stanford.edu",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      studentProfile: {
        primaryField: "Commerce & Finance",
        primarySpecialization: "Corporate Valuation & DCF Modeling",
        targetRole: "Investment Banking Analyst",
        country: "India",
        bio: "Pre-final year student at Stanford University preparing for Tier-1 investment banking interviews.",
        education: [
          {
            institutionName: "Stanford University",
            degreeOrProgram: "B.S. Mathematical & Computational Finance",
            currentStatus: "Currently Studying",
          },
        ],
        skills: [
          { skillName: "Financial Modeling" },
          { skillName: "LBO Modeling" },
          { skillName: "Python for Quant" },
        ],
        goals: [
          { title: "Crack Goldman Sachs IBD Summer Internship", priority: "High" },
        ],
      },
    },
    service: {
      title: "1:1 Corporate Valuation & DCF Modeling",
      category: "Finance & Banking",
      durationMinutes: 60,
      description: "Deep dive into financial modeling, sensitivity analysis, and pitch-deck valuation casing.",
      deliverables: ["DCF Template (.xlsx)", "M&A Case Feedback Notes"],
    },
    payment: {
      amount: 2000,
      platformFee: 400,
      mentorPayout: 1600,
      status: "CAPTURED",
    },
  };

  const isUpcoming = displayBooking.status === "CONFIRMED";
  const isPending = displayBooking.status === "PENDING";
  const isCompleted = displayBooking.status === "COMPLETED";
  const isCancelled = displayBooking.status === "CANCELLED";

  const formattedDate = new Date(displayBooking.slot?.startTime).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedStartTime = new Date(displayBooking.slot?.startTime).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedEndTime = new Date(displayBooking.slot?.endTime).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#7922f5] text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-xs sm:text-sm flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <Link
            href="/mentor/bookings"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
              <Link href="/mentor/bookings" className="hover:text-[#7922f5]">
                Bookings
              </Link>
              <span>/</span>
              <span className="text-[#1e2433] font-semibold">{displayBooking.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1e2433] tracking-tight">
              Booking & Mentee Details
            </h1>
          </div>
        </div>

        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            isUpcoming
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : isPending
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : isCompleted
              ? "bg-purple-50 text-purple-700 border border-purple-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {displayBooking.status}
        </span>
      </div>

      {/* Top Banner for Upcoming Session */}
      {isUpcoming && (
        <div className="bg-gradient-to-r from-[#7922f5] to-[#9333ea] rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-purple-600/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-purple-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Confirmed 1:1 Live Call</span>
            </div>
            <h2 className="text-xl font-extrabold">
              {formattedDate} • {formattedStartTime} – {formattedEndTime} IST
            </h2>
            <p className="text-xs text-purple-100">
              Session room is active. Join Google Meet room with your mentee.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <a
              href={displayBooking.meetingUrl || "https://meet.google.com/xyz-mentoree-session"}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-2xl bg-white text-[#7922f5] hover:bg-slate-50 font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center space-x-2"
            >
              <Video className="w-4 h-4" />
              <span>Join Google Meet</span>
            </a>

            <button
              onClick={() => setIsActionPlanModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-purple-700/60 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center space-x-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Complete & Action Plan</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Student Profile & Pre-Session Brief */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Mentee Profile & Background
            </h3>

            <div className="flex items-start space-x-4">
              <img
                src={
                  displayBooking.student?.avatarUrl ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                }
                alt={displayBooking.student?.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-100 shrink-0"
              />

              <div className="space-y-1">
                <h4 className="text-base font-bold text-[#1e2433]">
                  {displayBooking.student?.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {displayBooking.student?.email}
                </p>
                {displayBooking.student?.studentProfile?.targetRole && (
                  <span className="inline-block text-[11px] font-bold text-[#7922f5] bg-purple-50 px-2.5 py-0.5 rounded-md mt-1">
                    Target Role: {displayBooking.student.studentProfile.targetRole}
                  </span>
                )}
              </div>
            </div>

            {displayBooking.student?.studentProfile?.bio && (
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                {displayBooking.student.studentProfile.bio}
              </p>
            )}

            {/* Education & Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
              <div>
                <p className="font-bold text-slate-700 mb-1">Education</p>
                <p className="text-slate-600">
                  {displayBooking.student?.studentProfile?.education?.[0]?.institutionName ||
                    "Stanford University"}
                </p>
                <p className="text-[11px] text-slate-400">
                  {displayBooking.student?.studentProfile?.education?.[0]?.degreeOrProgram ||
                    "Undergraduate"}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-700 mb-1">Skills & Domain</p>
                <div className="flex flex-wrap gap-1">
                  {(
                    displayBooking.student?.studentProfile?.skills || [
                      { skillName: "Corporate Finance" },
                      { skillName: "Modeling" },
                    ]
                  ).map((sk: any, idx: number) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                    >
                      {sk.skillName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pre-Session Brief & Answered Questions */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pre-Session Context & Goals
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-700">What mentee wants help with:</span>
                <p className="text-slate-600">{displayBooking.preSessionGoal}</p>
              </div>

              {displayBooking.preSessionQuestions && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-700">Specific Questions to Cover:</span>
                  <p className="text-slate-600 whitespace-pre-line">
                    {displayBooking.preSessionQuestions}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Service, Financials & Lifecycle Actions */}
        <div className="space-y-6">
          {/* Financial Breakdown (80% Take) */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Earnings Breakdown
              </h3>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Verified Payment
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Gross Session Fee</span>
                <span>₹{(displayBooking.payment?.amount || displayBooking.amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Platform Commission (20%)</span>
                <span className="text-rose-600">
                  -₹{(displayBooking.payment?.platformFee || Math.round(displayBooking.amount * 0.2)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between font-extrabold text-slate-900 pt-2 border-t border-slate-100 text-sm">
                <span>Your Net Payout (80%)</span>
                <span className="text-[#7922f5]">
                  ₹{(displayBooking.payment?.mentorPayout || Math.round(displayBooking.amount * 0.8)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Lifecycle Action Buttons */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Session Actions
            </h3>

            {isPending && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleAcceptRequest}
                  disabled={acceptMutation.isPending}
                  className="w-full py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept Booking Request</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeclineRequest}
                  disabled={declineMutation.isPending}
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Decline Request</span>
                </button>
              </div>
            )}

            {isUpcoming && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setIsActionPlanModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center space-x-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Complete & Submit Action Plan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(true)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Session</span>
                </button>
              </div>
            )}

            {isCompleted && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Session Completed • Payout Pending</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Plan Deliverable Modal */}
      {isActionPlanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1e2433]">
                Complete Session & Send Action Plan
              </h3>
              <button
                onClick={() => setIsActionPlanModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Provide structured takeaways, resource links, and action milestones discussed during your session with{" "}
              <span className="font-semibold text-slate-800">{displayBooking.student?.name}</span>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Deliverables & Action Steps
              </label>
              <textarea
                rows={5}
                value={deliverableText}
                onChange={(e) => setDeliverableText(e.target.value)}
                placeholder="1. Suggested adjustments to DCF assumptions&#10;2. Key case frameworks to memorize&#10;3. Next milestone roadmap"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsActionPlanModalOpen(false)}
                className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteSession}
                className="px-6 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20"
              >
                Complete & Release Payout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
