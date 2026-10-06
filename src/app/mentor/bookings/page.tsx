"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Video,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
  User,
  Search,
  Filter,
  Check,
  X,
  FileText,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  useMentorBookingsList,
  useAcceptBookingRequestMutation,
  useDeclineBookingRequestMutation,
  useCompleteBookingMutation,
  useCancelBookingMutation,
  useRescheduleBookingMutation,
  useMarkNoShowMutation,
} from "@/hooks/useQueries";

export default function MentorBookingsPage() {
  const [filterTab, setFilterTab] = useState<"ALL" | "UPCOMING" | "PENDING" | "COMPLETED" | "CANCELLED">("UPCOMING");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { data: serverBookings, isLoading } = useMentorBookingsList(filterTab);
  const acceptMutation = useAcceptBookingRequestMutation();
  const declineMutation = useDeclineBookingRequestMutation();
  const completeMutation = useCompleteBookingMutation();
  const cancelMutation = useCancelBookingMutation();
  const rescheduleMutation = useRescheduleBookingMutation();
  const noShowMutation = useMarkNoShowMutation();

  // Action Plan Deliverables Modal
  const [actionPlanModal, setActionPlanModal] = useState<{
    isOpen: boolean;
    bookingId: string | null;
    studentName: string;
    deliverableText: string;
  }>({
    isOpen: false,
    bookingId: null,
    studentName: "",
    deliverableText: "",
  });

  // Decline Modal
  const [declineModal, setDeclineModal] = useState<{
    isOpen: boolean;
    bookingId: string | null;
    studentName: string;
    reason: string;
  }>({
    isOpen: false,
    bookingId: null,
    studentName: "",
    reason: "",
  });

  // Cancel Modal
  const [cancelModal, setCancelModal] = useState<{
    isOpen: boolean;
    bookingId: string | null;
    studentName: string;
    reason: string;
  }>({
    isOpen: false,
    bookingId: null,
    studentName: "",
    reason: "",
  });

  // Reschedule Modal
  const [rescheduleModal, setRescheduleModal] = useState<{
    isOpen: boolean;
    bookingId: string | null;
    studentName: string;
    selectedSlotId: string | null;
  }>({
    isOpen: false,
    bookingId: null,
    studentName: "",
    selectedSlotId: null,
  });

  // No-Show Modal
  const [noShowModal, setNoShowModal] = useState<{
    isOpen: boolean;
    bookingId: string | null;
    studentName: string;
    notes: string;
  }>({
    isOpen: false,
    bookingId: null,
    studentName: "",
    notes: "",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAcceptRequest = async (bookingId: string, studentName: string) => {
    try {
      await acceptMutation.mutateAsync(bookingId);
      showToast(`Booking request from ${studentName} accepted!`);
    } catch (err: any) {
      showToast(err.message || "Failed to accept booking");
    }
  };

  const handleDeclineRequest = async () => {
    if (!declineModal.bookingId) return;
    try {
      await declineMutation.mutateAsync({
        bookingId: declineModal.bookingId,
        reason: declineModal.reason || "Mentor unavailable at requested time",
      });
      showToast(`Booking request from ${declineModal.studentName} declined.`);
      setDeclineModal({ isOpen: false, bookingId: null, studentName: "", reason: "" });
    } catch (err: any) {
      showToast(err.message || "Failed to decline booking");
    }
  };

  const handleCompleteSession = async () => {
    if (!actionPlanModal.bookingId) return;
    try {
      await completeMutation.mutateAsync({
        bookingId: actionPlanModal.bookingId,
        actionPlanDeliverable: actionPlanModal.deliverableText,
      });
      showToast("Session completed & action plan deliverable shared with mentee!");
      setActionPlanModal({ isOpen: false, bookingId: null, studentName: "", deliverableText: "" });
    } catch (err: any) {
      showToast(err.message || "Failed to complete session");
    }
  };

  const handleCancelSession = async () => {
    if (!cancelModal.bookingId) return;
    try {
      await cancelMutation.mutateAsync({
        bookingId: cancelModal.bookingId,
        reason: cancelModal.reason || "Mentor schedule conflict",
      });
      showToast("Booking cancelled and mentee notified.");
      setCancelModal({ isOpen: false, bookingId: null, studentName: "", reason: "" });
    } catch (err: any) {
      showToast(err.message || "Failed to cancel booking");
    }
  };

  const handleRescheduleSession = async () => {
    if (!rescheduleModal.bookingId || !rescheduleModal.selectedSlotId) return;
    try {
      await rescheduleMutation.mutateAsync({
        bookingId: rescheduleModal.bookingId,
        newSlotId: rescheduleModal.selectedSlotId,
        reason: "Mentor rescheduled to updated availability window",
      });
      showToast("Session rescheduled successfully!");
      setRescheduleModal({ isOpen: false, bookingId: null, studentName: "", selectedSlotId: null });
    } catch (err: any) {
      showToast(err.message || "Failed to reschedule session");
    }
  };

  const handleMarkNoShow = async () => {
    if (!noShowModal.bookingId) return;
    try {
      await noShowMutation.mutateAsync({
        bookingId: noShowModal.bookingId,
        party: "STUDENT",
        notes: noShowModal.notes || "Student did not attend call",
      });
      showToast("Session marked as Student No-Show.");
      setNoShowModal({ isOpen: false, bookingId: null, studentName: "", notes: "" });
    } catch (err: any) {
      showToast(err.message || "Failed to mark no-show");
    }
  };

  // Default fallback data
  const defaultBookings = serverBookings || [
    {
      id: "bk-101",
      studentId: "u-101",
      student: {
        name: "Pulkit Gupta",
        email: "pulkit.gupta@stanford.edu",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      },
      service: {
        title: "1:1 Corporate Valuation & DCF Modeling",
        durationMinutes: 60,
      },
      slot: {
        startTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      },
      status: "CONFIRMED",
      amount: 1500,
      meetingUrl: "https://meet.google.com/xyz-mentoree-session",
      preSessionGoal: "Review 3-statement financial model & DCF assumptions for M&A casing.",
    },
    {
      id: "bk-102",
      studentId: "u-102",
      student: {
        name: "Kathryn Murphy",
        email: "kathryn.m@mckinsey.com",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      },
      service: {
        title: "Management Consulting Case Prep",
        durationMinutes: 45,
      },
      slot: {
        startTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString(),
      },
      status: "COMPLETED",
      amount: 2000,
      meetingUrl: "https://meet.google.com/abc-mentoree-session",
      actionPlanDeliverable: "Structured case feedback sheet + 5 casing frameworks.",
    },
    {
      id: "req-201",
      studentId: "u-103",
      student: {
        name: "Aman Gupta",
        email: "aman.g@iitd.ac.in",
        avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
      },
      service: {
        title: "Portfolio & System Design Mock",
        durationMinutes: 60,
      },
      slot: {
        startTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString(),
      },
      status: "PENDING",
      amount: 2000,
      preSessionGoal: "Preparing for Tier-1 Tech Placement casing.",
    },
  ];

  const filteredBookings = defaultBookings.filter((b: any) => {
    const matchesFilter = filterTab === "ALL" || b.status === filterTab;
    const matchesSearch =
      b.student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.service?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.student?.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#7922f5] text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-xs sm:text-sm flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
            <Link href="/mentor/dashboard" className="hover:text-[#7922f5]">Mentor</Link>
            <span>/</span>
            <span className="text-[#1e2433] font-semibold">Bookings & Sessions</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Mentorship Bookings & Sessions
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Manage upcoming video calls, review pending approval requests, reschedule, cancel, and submit post-session deliverables.
          </p>
        </div>

        <Link
          href="/mentor/availability"
          className="px-4 py-2 rounded-2xl bg-purple-50 text-[#7922f5] hover:bg-purple-100 font-bold text-xs border border-purple-100 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Clock className="w-4 h-4" />
          <span>Manage Working Hours</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-2 sm:pb-0">
          {[
            { id: "ALL", label: "All Bookings" },
            { id: "UPCOMING", label: "Upcoming" },
            { id: "PENDING", label: "Pending Approval" },
            { id: "COMPLETED", label: "Completed" },
            { id: "CANCELLED", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterTab === tab.id
                  ? "bg-[#7922f5] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search mentee, topic, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#eef0f6] space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No {filterTab.toLowerCase()} bookings found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Bookings made by prospective mentees will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b: any) => {
            const isUpcoming = b.status === "CONFIRMED";
            const isPending = b.status === "PENDING";
            const isCompleted = b.status === "COMPLETED";
            const isCancelled = b.status === "CANCELLED";

            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] hover:border-purple-200 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left: Mentee info & session details */}
                <div className="flex items-start space-x-4 min-w-0">
                  <img
                    src={b.student?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                    alt={b.student?.name || "Mentee"}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-100 shadow-sm shrink-0"
                  />

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center space-x-2.5">
                      <h3 className="text-base font-bold text-[#1e2433]">
                        {b.student?.name}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isUpcoming
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : isPending
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : isCompleted
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {b.status}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#7922f5]">
                        Net Take: ₹{Math.round(b.amount * 0.8).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-800">{b.service?.title}</p>
                    <p className="text-xs text-slate-500 font-medium">
                      Mentee Email: {b.student?.email}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#7922f5]" />
                        <span>
                          {b.slot?.startTime
                            ? new Date(b.slot.startTime).toLocaleDateString("en-IN", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })
                            : "Scheduled Date"}
                        </span>
                      </span>

                      <span className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#7922f5]" />
                        <span>
                          {b.slot?.startTime
                            ? `${new Date(b.slot.startTime).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })} IST`
                            : "60 mins"}
                        </span>
                      </span>
                    </div>

                    {/* Pre-session goal */}
                    {b.preSessionGoal && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mt-2 max-w-xl">
                        <span className="font-bold text-slate-800">Mentee Goal: </span>
                        {b.preSessionGoal}
                      </div>
                    )}

                    {/* Action plan deliverable */}
                    {b.actionPlanDeliverable && (
                      <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 mt-2 max-w-xl">
                        <span className="font-bold">Your Action Plan: </span>
                        {b.actionPlanDeliverable}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-2.5 shrink-0 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <Link
                    href={`/mentor/bookings/${b.id}`}
                    className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#7922f5] hover:border-purple-300 transition-colors flex items-center space-x-1"
                  >
                    <span>View Booking Detail</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  {isUpcoming && (
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={b.meetingUrl || "https://meet.google.com/xyz-mentoree-session"}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center space-x-1.5"
                      >
                        <Video className="w-4 h-4" />
                        <span>Join Meeting</span>
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          setActionPlanModal({
                            isOpen: true,
                            bookingId: b.id,
                            studentName: b.student?.name || "Student",
                            deliverableText: "",
                          })
                        }
                        className="px-3.5 py-2 rounded-xl border border-purple-200 text-[#7922f5] hover:bg-purple-50 font-bold text-xs transition-colors flex items-center space-x-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Complete & Action Plan</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setNoShowModal({
                            isOpen: true,
                            bookingId: b.id,
                            studentName: b.student?.name || "Student",
                            notes: "",
                          })
                        }
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                      >
                        No-Show
                      </button>
                    </div>
                  )}

                  {isPending && (
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleAcceptRequest(b.id, b.student?.name || "Student")}
                        className="px-4 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-sm shadow-purple-600/20 transition-all flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Request</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeclineModal({
                            isOpen: true,
                            bookingId: b.id,
                            studentName: b.student?.name || "Student",
                            reason: "",
                          })
                        }
                        className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors flex items-center space-x-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ACTION PLAN DELIVERABLE MODAL                                             */}
      {/* ========================================================================= */}
      {actionPlanModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1e2433]">
                Complete Session & Provide Action Plan
              </h3>
              <button
                onClick={() => setActionPlanModal({ isOpen: false, bookingId: null, studentName: "", deliverableText: "" })}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Share actionable next steps, recommended reading, and milestone roadmap items for{" "}
              <span className="font-semibold text-slate-800">{actionPlanModal.studentName}</span>. This will complete the session and create a pending payout of 80% net take.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Post-Session Action Plan Deliverables
              </label>
              <textarea
                rows={5}
                value={actionPlanModal.deliverableText}
                onChange={(e) => setActionPlanModal({ ...actionPlanModal, deliverableText: e.target.value })}
                placeholder="1. Detailed model adjustments for DCF casing&#10;2. Recommended quantitative finance books&#10;3. Follow-up milestones before placement season"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setActionPlanModal({ isOpen: false, bookingId: null, studentName: "", deliverableText: "" })}
                className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteSession}
                className="px-6 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20"
              >
                Complete Session & Release Payout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DECLINE MODAL                                                             */}
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
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for declining
              </label>
              <input
                type="text"
                value={declineModal.reason}
                onChange={(e) => setDeclineModal({ ...declineModal, reason: e.target.value })}
                placeholder="e.g. Schedule conflict, out of scope"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeclineModal({ isOpen: false, bookingId: null, studentName: "", reason: "" })}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
              >
                Keep Request
              </button>
              <button
                type="button"
                onClick={handleDeclineRequest}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NO SHOW MODAL                                                             */}
      {typeof noShowModal !== "undefined" && noShowModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Mark Student No-Show?</h3>
              <p className="text-xs text-slate-500">
                Mark that <span className="font-semibold text-slate-800">{noShowModal.studentName}</span> did not attend the scheduled Google Meet video room.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notes / Attendance Record
              </label>
              <input
                type="text"
                value={noShowModal.notes}
                onChange={(e) => setNoShowModal({ ...noShowModal, notes: e.target.value })}
                placeholder="e.g. Waited in Google Meet room for 15 minutes, student absent."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setNoShowModal({ isOpen: false, bookingId: null, studentName: "", notes: "" })}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleMarkNoShow}
                className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
              >
                Confirm No-Show
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
