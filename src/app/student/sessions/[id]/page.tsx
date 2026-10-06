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
  CreditCard,
  Download,
  Share2,
  Loader2,
  Sparkles,
  Info,
} from "lucide-react";
import {
  useBookingDetail,
  useCancelBookingMutation,
  useRescheduleBookingMutation,
  useCreateReviewMutation,
} from "@/hooks/useQueries";

export default function StudentBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string;

  const { data: booking, isLoading, isError } = useBookingDetail(bookingId);
  const cancelMutation = useCancelBookingMutation();
  const rescheduleMutation = useRescheduleBookingMutation();
  const reviewMutation = useCreateReviewMutation();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [selectedNewSlotId, setSelectedNewSlotId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Helper function to generate Google Calendar link
  const getGoogleCalendarUrl = () => {
    if (!booking) return "#";
    const startTime = new Date(booking.startTime || Date.now());
    const endTime = new Date(booking.endTime || Date.now() + 60 * 60 * 1000);

    const formatGCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const title = encodeURIComponent(
      `1:1 Mentorship Session: ${booking.service?.title || "Career Consultation"}`
    );
    const details = encodeURIComponent(
      `Mentorship Session with ${booking.mentor?.name || "Mentor"}\nGoogle Meet Link: ${
        booking.meetUrl || "Will be shared before call"
      }\nTopic: ${booking.preSessionGoal || "Strategy & Mentorship"}`
    );
    const location = encodeURIComponent(booking.meetUrl || "Google Meet Video Room");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatGCalDate(
      startTime
    )}/${formatGCalDate(endTime)}&details=${details}&location=${location}`;
  };

  // Helper function to download .ics file
  const downloadIcsFile = () => {
    if (!booking) return;
    const start = new Date(booking.startTime || Date.now());
    const end = new Date(booking.endTime || Date.now() + 60 * 60 * 1000);

    const formatDateICS = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Mentoree//1:1 Mentorship Booking//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:1:1 Mentorship with ${booking.mentor?.name || "Mentor"}
DESCRIPTION:${booking.service?.title || "Mentorship Session"} - Google Meet: ${booking.meetUrl || ""}
LOCATION:${booking.meetUrl || "Google Meet"}
DTSTART:${formatDateICS(start)}
DTEND:${formatDateICS(end)}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `mentoree-session-${booking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Calendar event (.ics) downloaded successfully!");
  };

  const handleCancelBooking = async () => {
    if (!bookingId) return;
    try {
      await cancelMutation.mutateAsync({
        bookingId,
        reason: cancelReason || "Cancelled by student",
      });
      showToast("Booking cancelled successfully. Refund initiated.");
      setIsCancelModalOpen(false);
    } catch (err: any) {
      showToast(err.message || "Failed to cancel booking");
    }
  };

  const handleRescheduleBooking = async () => {
    if (!bookingId || !selectedNewSlotId) return;
    try {
      await rescheduleMutation.mutateAsync({
        bookingId,
        newSlotId: selectedNewSlotId,
        reason: rescheduleReason,
      });
      showToast("Booking rescheduled successfully!");
      setIsRescheduleModalOpen(false);
    } catch (err: any) {
      showToast(err.message || "Failed to reschedule booking");
    }
  };

  const handleSubmitReview = async () => {
    if (!booking) return;
    try {
      await reviewMutation.mutateAsync({
        bookingId: booking.id,
        mentorId: booking.mentorId,
        rating: reviewRating,
        comment: reviewComment,
      });
      showToast("Thank you! Your verified review has been submitted.");
      setIsReviewModalOpen(false);
    } catch (err: any) {
      showToast(err.message || "Failed to submit review");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="w-8 h-8 text-[#7922f5] animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading booking details...</p>
      </div>
    );
  }

  // Fallback / mock data if query is empty
  const displayBooking = booking || {
    id: bookingId,
    status: "CONFIRMED",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
    timezone: "Asia/Kolkata (IST UTC+5:30)",
    price: 1500,
    currency: "INR",
    meetUrl: "https://meet.google.com/xyz-mentoree-session",
    preSessionGoal: "Review 3-statement financial model & DCF assumptions for M&A casing.",
    currentSituation: "Preparing for Tier-1 corporate finance interviews.",
    keyQuestions: "1. Best way to defend terminal growth rate?\n2. What sensitivity tables matter most to partners?",
    mentor: {
      id: "m-101",
      name: "Dr. Alex Kumar",
      headline: "VP of Quantitative Valuation at Goldman Sachs",
      company: "Goldman Sachs",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    service: {
      id: "srv-101",
      title: "1:1 Corporate Valuation & DCF Modeling",
      durationMinutes: 60,
      description: "Deep dive into financial modeling, sensitivity analysis, and pitch-deck valuation defending.",
    },
    payment: {
      id: "pay_12345",
      provider: "RAZORPAY",
      status: "SUCCESS",
      amountINR: 1500,
      platformFeeINR: 150,
      gstINR: 27,
      totalPaidINR: 1677,
      orderId: "order_mock_9921",
    },
  };

  const isUpcoming = displayBooking.status === "CONFIRMED" || displayBooking.status === "UPCOMING";
  const isCompleted = displayBooking.status === "COMPLETED";
  const isCancelled = displayBooking.status === "CANCELLED";

  const formattedDate = new Date(displayBooking.startTime).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedStartTime = new Date(displayBooking.startTime).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedEndTime = new Date(displayBooking.endTime).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#1e293b] font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#7922f5] text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-xs sm:text-sm flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-[#eaecf2] h-[72px] px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-4">
          <Link
            href="/student/sessions"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
              <Link href="/student/sessions" className="hover:text-[#7922f5]">
                My Sessions
              </Link>
              <span>/</span>
              <span className="text-[#1e2433] font-semibold">{displayBooking.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1e2433] tracking-tight">
              Booking Overview
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              isUpcoming
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : isCompleted
                ? "bg-purple-50 text-purple-700 border border-purple-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {displayBooking.status}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6 sm:p-8 space-y-6">
        {/* Top Banner / Call To Action for Upcoming Session */}
        {isUpcoming && (
          <div className="bg-gradient-to-r from-[#7922f5] to-[#9333ea] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-600/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-purple-100">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Confirmed Mentorship Video Call</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {formattedDate} • {formattedStartTime} – {formattedEndTime} IST
              </h2>
              <p className="text-xs sm:text-sm text-purple-100 max-w-xl">
                Your video session is locked and verified. Join the secure Google Meet room when the session starts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={displayBooking.meetUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-2xl bg-white text-[#7922f5] hover:bg-slate-50 font-extrabold text-xs sm:text-sm shadow-lg transition-all active:scale-95 flex items-center space-x-2"
              >
                <Video className="w-4 h-4" />
                <span>Join Google Meet</span>
              </a>

              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 rounded-2xl bg-purple-700/60 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center space-x-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Add to GCal</span>
              </a>

              <button
                onClick={downloadIcsFile}
                className="p-3 rounded-2xl bg-purple-700/60 hover:bg-purple-700 text-white font-bold text-xs border border-white/20 transition-all"
                title="Download .ics Calendar File"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Session & Mentor Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mentor Card */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Your Mentor
              </h3>
              <div className="flex items-start space-x-4">
                <img
                  src={
                    displayBooking.mentor?.avatarUrl ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  }
                  alt={displayBooking.mentor?.name || "Mentor"}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-100 shadow-sm shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-bold text-[#1e2433]">
                      {displayBooking.mentor?.name}
                    </h4>
                    <span className="text-xs font-semibold text-[#7922f5] bg-[#f6f2fe] px-2.5 py-0.5 rounded-md">
                      {displayBooking.mentor?.company}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {displayBooking.mentor?.headline}
                  </p>
                  <Link
                    href={`/mentors?search=${encodeURIComponent(
                      displayBooking.mentor?.name || ""
                    )}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-[#7922f5] hover:underline pt-1"
                  >
                    <span>View Mentor Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Service & Schedule Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mentorship Service
              </h3>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-[#1e2433]">
                      {displayBooking.service?.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {displayBooking.service?.description}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-purple-50 text-[#7922f5] text-xs font-bold shrink-0">
                    {displayBooking.service?.durationMinutes || 60} mins
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Calendar className="w-5 h-5 text-[#7922f5]" />
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium">Session Date</p>
                      <p className="text-xs font-bold text-slate-800">{formattedDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Clock className="w-5 h-5 text-[#7922f5]" />
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium">Time & Timezone</p>
                      <p className="text-xs font-bold text-slate-800">
                        {formattedStartTime} – {formattedEndTime} (IST)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pre-session Goals & Submitted Questions */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pre-Session Context & Goals
              </h3>

              <div className="space-y-3 text-xs">
                {displayBooking.preSessionGoal && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-700">What you want help with:</span>
                    <p className="text-slate-600">{displayBooking.preSessionGoal}</p>
                  </div>
                )}

                {displayBooking.currentSituation && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-700">Current Situation / Academic Stage:</span>
                    <p className="text-slate-600">{displayBooking.currentSituation}</p>
                  </div>
                )}

                {displayBooking.keyQuestions && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-700">Key Questions to Discuss:</span>
                    <p className="text-slate-600 whitespace-pre-line">
                      {displayBooking.keyQuestions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Col: Payment Summary & Booking Lifecycle Actions */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Payment Receipt
                </h3>
                <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Mentorship Fee</span>
                  <span>₹{(displayBooking.price || 1500).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Platform Fee</span>
                  <span>₹150</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (18%)</span>
                  <span>₹27</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-100 text-sm">
                  <span>Total Paid</span>
                  <span className="text-[#7922f5]">
                    ₹{((displayBooking.price || 1500) + 177).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500 space-y-1 font-mono">
                <p>Booking ID: {displayBooking.id}</p>
                <p>Provider: Razorpay Secure</p>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Session Actions
              </h3>

              {isUpcoming && (
                <div className="space-y-2.5">
                  <button
                    onClick={() => setIsRescheduleModalOpen(true)}
                    className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-[#7922f5] font-bold text-xs transition-colors flex items-center justify-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reschedule Slot</span>
                  </button>

                  <button
                    onClick={() => setIsCancelModalOpen(true)}
                    className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-500 hover:text-rose-600 hover:bg-rose-50/40 font-bold text-xs transition-colors flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel Booking</span>
                  </button>
                </div>
              )}

              {isCompleted && (
                <div className="space-y-2.5">
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center space-x-2"
                  >
                    <Star className="w-4 h-4 fill-white" />
                    <span>Leave Verified Review</span>
                  </button>

                  <Link
                    href={`/mentors?search=${encodeURIComponent(
                      displayBooking.mentor?.name || ""
                    )}`}
                    className="w-full py-2.5 rounded-xl border border-purple-200 text-[#7922f5] hover:bg-purple-50 font-bold text-xs transition-colors flex items-center justify-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Book Follow-up Session</span>
                  </Link>
                </div>
              )}

              {isCancelled && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">
                    This booking has been cancelled and any eligible refund has been processed to your source payment method.
                  </p>
                  <Link
                    href={`/mentors?search=${encodeURIComponent(
                      displayBooking.mentor?.name || ""
                    )}`}
                    className="w-full py-2.5 rounded-xl bg-[#7922f5] text-white font-bold text-xs flex items-center justify-center space-x-2"
                  >
                    <span>Browse Other Mentors</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* CANCEL MODAL                                                              */}
      {/* ========================================================================= */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Cancel Mentorship Session?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to cancel your session with{" "}
                <span className="font-semibold text-slate-800">
                  {displayBooking.mentor?.name}
                </span>
                ? Cancellations {">"} 24h prior receive a 100% refund.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for cancellation (optional)
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule conflict, academic exam"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
              >
                Keep Session
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={cancelMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 disabled:opacity-50"
              >
                {cancelMutation.isPending ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REVIEW MODAL                                                              */}
      {/* ========================================================================= */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#1e2433]">Review Your Mentorship Session</h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-xs text-slate-500">
                How was your session with{" "}
                <span className="font-bold text-slate-800">
                  {displayBooking.mentor?.name}
                </span>
                ?
              </p>

              {/* Star Selector */}
              <div className="flex justify-center space-x-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= reviewRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Written Feedback
              </label>
              <textarea
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share how the mentor helped you (e.g. actionable advice, case study tips, valuation feedback)..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={reviewMutation.isPending}
                className="px-6 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 disabled:opacity-50"
              >
                {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RESCHEDULE MODAL                                                          */}
      {/* ========================================================================= */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Reschedule Mentorship Session</h3>
              <button
                onClick={() => setIsRescheduleModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select an upcoming available slot from{" "}
              <span className="font-semibold text-slate-800">{displayBooking.mentor?.name}</span>'s schedule. Your original slot will be released automatically.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Available Upcoming Slots
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {[
                  { id: "slot-resch-1", date: "Oct 8, 2026", time: "05:00 PM – 06:00 PM" },
                  { id: "slot-resch-2", date: "Oct 9, 2026", time: "06:30 PM – 07:30 PM" },
                  { id: "slot-resch-3", date: "Oct 10, 2026", time: "04:00 PM – 05:00 PM" },
                  { id: "slot-resch-4", date: "Oct 11, 2026", time: "07:00 PM – 08:00 PM" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedNewSlotId(s.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                      selectedNewSlotId === s.id
                        ? "border-[#7922f5] bg-purple-50 font-bold text-[#7922f5]"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <p className="font-bold">{s.date}</p>
                    <p className="text-[11px] opacity-80">{s.time} IST</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Note to Mentor (optional)
              </label>
              <input
                type="text"
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
                placeholder="e.g. Needed to reschedule due to university exam"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRescheduleModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedNewSlotId || rescheduleMutation.isPending}
                onClick={handleRescheduleBooking}
                className="flex-1 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 disabled:opacity-50"
              >
                {rescheduleMutation.isPending ? "Updating Slot..." : "Confirm Reschedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
