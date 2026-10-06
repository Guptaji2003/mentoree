"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
  Users,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Plus,
  Coffee,
  Check,
  X,
  ExternalLink,
  RotateCcw,
  Star,
  Loader2,
} from "lucide-react";
import {
  useMentorDashboard,
  useAcceptBookingRequestMutation,
  useDeclineBookingRequestMutation,
} from "@/hooks/useQueries";

export default function MentorDashboardPage() {
  const { data: dashboard, isLoading, isError } = useMentorDashboard();
  const acceptMutation = useAcceptBookingRequestMutation();
  const declineMutation = useDeclineBookingRequestMutation();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Decline Modal State
  const [declineModal, setDeclineModal] = useState<{
    isOpen: boolean;
    requestId: string | null;
    studentName: string;
    reason: string;
  }>({
    isOpen: false,
    requestId: null,
    studentName: "",
    reason: "",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAcceptRequest = async (requestId: string, studentName: string) => {
    try {
      await acceptMutation.mutateAsync(requestId);
      showToast(`Booking request from ${studentName} accepted!`);
    } catch (err: any) {
      showToast(err.message || "Failed to accept booking");
    }
  };

  const handleDeclineRequest = async () => {
    if (!declineModal.requestId) return;
    try {
      await declineMutation.mutateAsync({
        bookingId: declineModal.requestId,
        reason: declineModal.reason || "Mentor unavailable at requested time",
      });
      showToast(`Booking request from ${declineModal.studentName} declined.`);
      setDeclineModal({ isOpen: false, requestId: null, studentName: "", reason: "" });
    } catch (err: any) {
      showToast(err.message || "Failed to decline booking");
    }
  };

  // Fallback state if query loading or mock
  const displayData = dashboard || {
    mentor: {
      id: "m-101",
      name: "Dr. Alex Kumar",
      headline: "VP of Quantitative Valuation at Goldman Sachs",
      company: "Goldman Sachs",
      ratingAvg: 4.95,
      totalReviews: 48,
    },
    summary: {
      upcomingCount: 3,
      pendingRequestsCount: 2,
      completedCount: 24,
      publishedServicesCount: 4,
      grossEarningsINR: 48000,
      netEarningsINR: 38400,
      platformFeesINR: 9600,
      availableForPayoutINR: 14400,
    },
    nextSession: {
      id: "bk-101",
      studentName: "Pulkit Gupta",
      studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      serviceTitle: "1:1 Corporate Valuation & DCF Modeling",
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      meetingUrl: "https://meet.google.com/xyz-mentoree-session",
      status: "CONFIRMED",
      preSessionGoal: "Review 3-statement financial model & DCF assumptions for M&A casing.",
    },
    pendingRequests: [
      {
        id: "req-201",
        studentName: "Aman Gupta",
        studentEmail: "aman.g@iitd.ac.in",
        studentAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
        serviceTitle: "Portfolio & System Design Mock",
        requestedDate: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
        amountINR: 2000,
        createdAt: new Date().toISOString(),
        preSessionGoal: "Preparing for Tier-1 Tech Placement casing.",
      },
      {
        id: "req-202",
        studentName: "Jessia Rose",
        studentEmail: "jessia.rose@harvard.edu",
        studentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        serviceTitle: "Resume Teardown & ATS Strategy",
        requestedDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        amountINR: 1500,
        createdAt: new Date().toISOString(),
        preSessionGoal: "Switching from consulting to product management.",
      },
    ],
    availabilityStatus: {
      status: "AVAILABLE",
      timezone: "Asia/Kolkata",
      breakReason: null,
      breakEndsAt: null,
    },
    recentBookings: [
      {
        id: "bk-101",
        studentName: "Pulkit Gupta",
        studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        serviceTitle: "1:1 Corporate Valuation & DCF Modeling",
        date: new Date().toISOString(),
        status: "CONFIRMED",
        amountINR: 1500,
      },
      {
        id: "bk-102",
        studentName: "Kathryn Murphy",
        studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        serviceTitle: "Consulting Case Prep",
        date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        status: "COMPLETED",
        amountINR: 2000,
      },
    ],
  };

  const isBreakActive = displayData.availabilityStatus.status === "ON_BREAK";

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#7922f5] text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-xs sm:text-sm flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Welcome & Quick Status Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1e2433] tracking-tight">
              Welcome back, {displayData.mentor.name.split(" ")[0]}!
            </h1>
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#7922f5] border border-purple-100">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Mentor</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Action Center • You have {displayData.summary.upcomingCount} upcoming video calls and{" "}
            {displayData.summary.pendingRequestsCount} pending booking requests.
          </p>
        </div>

        {/* Status indicator & Quick Actions */}
        <div className="flex items-center space-x-3 shrink-0">
          <div
            className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center space-x-2 ${
              isBreakActive
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isBreakActive ? "bg-amber-500" : "bg-emerald-500 animate-pulse"
              }`}
            />
            <span>
              {isBreakActive ? "On Break / Paused" : "Accepting Bookings"}
            </span>
          </div>

          <Link
            href="/mentor/services/new"
            className="px-4 py-2 rounded-2xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Service</span>
          </Link>
        </div>
      </div>

      {/* 4 Core Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Upcoming Sessions */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Upcoming Sessions
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7922f5] flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-[#1e2433]">
              {displayData.summary.upcomingCount}
            </span>
            <span className="text-xs font-bold text-purple-600">Active video calls</span>
          </div>
          <Link
            href="/mentor/sessions"
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#7922f5] hover:underline pt-1"
          >
            <span>View all sessions</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Card 2: Pending Requests */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Requests
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-[#1e2433]">
              {displayData.summary.pendingRequestsCount}
            </span>
            <span className="text-xs font-bold text-amber-600">Action required</span>
          </div>
          <p className="text-[11px] text-slate-400">Approval-required requests</p>
        </div>

        {/* Card 3: Completed Sessions */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Completed Mentees
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-[#1e2433]">
              {displayData.summary.completedCount}
            </span>
            <span className="text-xs font-bold text-emerald-600">Sessions delivered</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold pt-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{displayData.mentor.ratingAvg} Rating ({displayData.mentor.totalReviews} reviews)</span>
          </div>
        </div>

        {/* Card 4: Net Earnings */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Net Earnings (80%)
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7922f5] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-[#1e2433]">
              ₹{displayData.summary.netEarningsINR.toLocaleString()}
            </span>
          </div>
          <Link
            href="/mentor/earnings"
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#7922f5] hover:underline pt-1"
          >
            <span>Available for payout: ₹{displayData.summary.availableForPayoutINR.toLocaleString()}</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Next Session & Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Next Session Banner & Pending Requests */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Call Focus Card */}
          {displayData.nextSession ? (
            <div className="bg-gradient-to-r from-[#7922f5] to-[#9333ea] rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-purple-600/15 space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-purple-100">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Next Live Mentorship Session</span>
                </div>
                <span className="text-xs font-mono font-bold text-purple-200">
                  Timezone: {displayData.availabilityStatus.timezone}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <img
                    src={displayData.nextSession.studentAvatar}
                    alt={displayData.nextSession.studentName}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/30 shadow-md shrink-0"
                  />
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">{displayData.nextSession.studentName}</h3>
                    <p className="text-xs text-purple-100 font-medium">
                      {displayData.nextSession.serviceTitle}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-purple-200">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(displayData.nextSession.startTime).toLocaleDateString("en-IN", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {new Date(displayData.nextSession.startTime).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2.5 shrink-0">
                  <a
                    href={displayData.nextSession.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-2.5 rounded-xl bg-white text-[#7922f5] hover:bg-slate-50 font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center space-x-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Google Meet</span>
                  </a>

                  <Link
                    href={`/mentor/sessions`}
                    className="px-4 py-1.5 rounded-lg bg-purple-700/60 hover:bg-purple-700 text-white font-bold text-xs border border-white/20 transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {displayData.nextSession.preSessionGoal && (
                <div className="p-3 rounded-2xl bg-black/20 backdrop-blur-md text-xs text-purple-100">
                  <span className="font-bold text-white">Student's Goal: </span>
                  {displayData.nextSession.preSessionGoal}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No sessions scheduled for today</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your slots are published and available for prospective mentees to book.
              </p>
              <Link
                href="/mentor/availability"
                className="inline-block px-5 py-2.5 rounded-xl bg-[#7922f5] text-white font-bold text-xs shadow-md shadow-purple-600/20 hover:bg-[#6819d4]"
              >
                Manage Working Hours →
              </Link>
            </div>
          )}

          {/* Pending Approval Requests Section */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1e2433]">
                  Pending Booking Requests
                </h3>
                <p className="text-xs text-slate-500">
                  Review and accept incoming mentorship requests for approval-required services.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                {displayData.pendingRequests.length} Pending
              </span>
            </div>

            {displayData.pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="font-bold text-slate-600">All caught up!</p>
                <p>No pending booking approvals at this time.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayData.pendingRequests.map((req: any) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-purple-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3 min-w-0">
                      <img
                        src={req.studentAvatar}
                        alt={req.studentName}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-bold text-[#1e2433]">{req.studentName}</h4>
                          <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold">
                            ₹{req.amountINR.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium truncate">
                          {req.serviceTitle}
                        </p>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                          <Clock className="w-3 h-3 text-[#7922f5]" />
                          <span>
                            Requested for:{" "}
                            {new Date(req.requestedDate).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {req.preSessionGoal && (
                          <p className="text-[11px] text-slate-500 italic">
                            "{req.preSessionGoal}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleAcceptRequest(req.id, req.studentName)}
                        disabled={acceptMutation.isPending}
                        className="px-3.5 py-1.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-sm shadow-purple-600/20 transition-all flex items-center space-x-1 disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>

                      <button
                        onClick={() =>
                          setDeclineModal({
                            isOpen: true,
                            requestId: req.id,
                            studentName: req.studentName,
                            reason: "",
                          })
                        }
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors flex items-center space-x-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Quick Actions & Availability Overview */}
        <div className="space-y-6">
          {/* Quick Actions Hub */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Management
            </h3>

            <div className="space-y-2">
              <Link
                href="/mentor/services/new"
                className="w-full p-3 rounded-xl bg-purple-50/60 hover:bg-purple-50 text-[#7922f5] font-bold text-xs transition-colors flex items-center justify-between border border-purple-100"
              >
                <div className="flex items-center space-x-2.5">
                  <Plus className="w-4 h-4" />
                  <span>Create New Service</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <Link
                href="/mentor/availability"
                className="w-full p-3 rounded-xl border border-slate-100 hover:border-purple-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <Clock className="w-4 h-4 text-[#7922f5]" />
                  <span>Working Hours & Rules</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/mentor/availability?tab=blocked"
                className="w-full p-3 rounded-xl border border-slate-100 hover:border-purple-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <Calendar className="w-4 h-4 text-[#7922f5]" />
                  <span>Block Unavailable Dates</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/mentor/availability?tab=break"
                className="w-full p-3 rounded-xl border border-slate-100 hover:border-purple-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <Coffee className="w-4 h-4 text-[#7922f5]" />
                  <span>Take a Vacation / Break</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Recent Bookings Feed */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recent Bookings
              </h3>
              <Link
                href="/mentor/sessions"
                className="text-xs font-bold text-[#7922f5] hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {displayData.recentBookings.map((b: any) => (
                <div key={b.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={b.studentAvatar}
                      alt={b.studentName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-800">{b.studentName}</p>
                      <p className="text-[11px] text-slate-400">{b.serviceTitle}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-slate-800">₹{b.amountINR.toLocaleString()}</p>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === "CONFIRMED"
                          ? "bg-purple-50 text-[#7922f5]"
                          : b.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DECLINE REQUEST MODAL                                                     */}
      {/* ========================================================================= */}
      {declineModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Decline Booking Request?</h3>
              <p className="text-xs text-slate-500">
                Decline mentorship request from{" "}
                <span className="font-semibold text-slate-800">{declineModal.studentName}</span>.
                The requested slot will remain available for other students.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for declining (shared with student)
              </label>
              <input
                type="text"
                value={declineModal.reason}
                onChange={(e) => setDeclineModal({ ...declineModal, reason: e.target.value })}
                placeholder="e.g. Schedule conflict, out of scope for current availability"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  setDeclineModal({ isOpen: false, requestId: null, studentName: "", reason: "" })
                }
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
              >
                Keep Request
              </button>
              <button
                type="button"
                onClick={handleDeclineRequest}
                disabled={declineMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 disabled:opacity-50"
              >
                {declineMutation.isPending ? "Declining..." : "Confirm Decline"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
