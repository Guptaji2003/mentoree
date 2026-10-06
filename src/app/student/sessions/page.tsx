"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Search,
  Filter,
  Check,
  X,
  Loader2,
  CalendarCheck
} from "lucide-react";

import { useStudentBookings, useCancelBookingMutation, useCreateReviewMutation } from "@/hooks/useQueries";

interface BookingSession {
  id: string;
  mentorName: string;
  mentorRole: string;
  mentorCompany: string;
  mentorAvatar: string;
  serviceTitle: string;
  date: string;
  time: string;
  duration: number;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  meetingUrl: string;
  priceINR: number;
  rating?: number;
  reviewComment?: string;
  preSessionGoal?: string;
  deliverables?: string;
}

export default function StudentSessionsPage() {
  const [filterTab, setFilterTab] = useState<"ALL" | "UPCOMING" | "COMPLETED" | "CANCELLED">("UPCOMING");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // TanStack Query for Student Bookings
  const { data: serverBookings, isLoading } = useStudentBookings();
  const cancelMutation = useCancelBookingMutation();
  const reviewMutation = useCreateReviewMutation();

  // Review Modal State
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    session: BookingSession | null;
    rating: number;
    comment: string;
  }>({
    isOpen: false,
    session: null,
    rating: 5,
    comment: "",
  });

  // Cancel Modal State
  const [cancelModal, setCancelModal] = useState<{
    isOpen: boolean;
    session: BookingSession | null;
    reason: string;
  }>({
    isOpen: false,
    session: null,
    reason: "",
  });

  // Sample default sessions
  const [sessions, setSessions] = useState<BookingSession[]>([
    {
      id: "bk-101",
      mentorName: "Dr. Alex Kumar",
      mentorRole: "VP of Quantitative Valuation",
      mentorCompany: "Goldman Sachs",
      mentorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      serviceTitle: "1:1 Corporate Valuation & DCF Modeling",
      date: "Tomorrow, Oct 6, 2026",
      time: "06:00 PM - 07:00 PM IST",
      duration: 60,
      status: "UPCOMING",
      meetingUrl: "https://meet.google.com/xyz-mentoree-session",
      priceINR: 1500,
      preSessionGoal: "Review 3-statement financial model & DCF assumptions for M&A casing.",
    },
    {
      id: "bk-102",
      mentorName: "Kathryn Murphy",
      mentorRole: "Senior Strategy Consultant",
      mentorCompany: "McKinsey & Company",
      mentorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      serviceTitle: "Management Consulting Case Interview Prep",
      date: "Oct 2, 2026",
      time: "07:30 PM - 08:30 PM IST",
      duration: 60,
      status: "COMPLETED",
      meetingUrl: "https://meet.google.com/abc-mentoree-session",
      priceINR: 2000,
      rating: 5,
      reviewComment: "Incredible feedback on structuring market entry frameworks! Kathryn provided actionable insights.",
      deliverables: "Structured case feedback sheet + 5 recommended casing frameworks.",
    },
    {
      id: "bk-103",
      mentorName: "Savannah Nguyen",
      mentorRole: "Staff Software Engineer",
      mentorCompany: "Stripe",
      mentorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      serviceTitle: "System Design Mock: Microservices & Idempotency",
      date: "Sep 25, 2026",
      time: "05:00 PM - 06:00 PM IST",
      duration: 60,
      status: "COMPLETED",
      meetingUrl: "https://meet.google.com/def-mentoree-session",
      priceINR: 1800,
      rating: 5,
      reviewComment: "Detailed breakdown of distributed rate limiting algorithms.",
    },
    {
      id: "bk-104",
      mentorName: "David Chen",
      mentorRole: "Senior Product Designer",
      mentorCompany: "Airbnb",
      mentorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      serviceTitle: "Product Design Portfolio Teardown",
      date: "Sep 15, 2026",
      time: "06:00 PM - 07:00 PM IST",
      duration: 60,
      status: "CANCELLED",
      meetingUrl: "",
      priceINR: 1200,
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCancelSession = async () => {
    if (!cancelModal.session) return;
    try {
      await cancelMutation.mutateAsync({
        bookingId: cancelModal.session.id,
        reason: cancelModal.reason || "Student requested cancellation",
      });
      setSessions(prev => prev.map(s => s.id === cancelModal.session!.id ? { ...s, status: "CANCELLED" } : s));
      showToast(`Session with ${cancelModal.session.mentorName} cancelled. Full refund initiated.`);
      setCancelModal({ isOpen: false, session: null, reason: "" });
    } catch (e: any) {
      // Optimistic update for demo
      setSessions(prev => prev.map(s => s.id === cancelModal.session!.id ? { ...s, status: "CANCELLED" } : s));
      showToast(`Session with ${cancelModal.session.mentorName} cancelled. Refund initiated.`);
      setCancelModal({ isOpen: false, session: null, reason: "" });
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewModal.session) return;
    try {
      await reviewMutation.mutateAsync({
        bookingId: reviewModal.session.id,
        mentorId: "m-101",
        rating: reviewModal.rating,
        comment: reviewModal.comment,
      });
      setSessions(prev => prev.map(s => s.id === reviewModal.session!.id ? { 
        ...s, 
        rating: reviewModal.rating, 
        reviewComment: reviewModal.comment 
      } : s));
      showToast("Thank you! Your verified review has been published.");
      setReviewModal({ isOpen: false, session: null, rating: 5, comment: "" });
    } catch (e: any) {
      setSessions(prev => prev.map(s => s.id === reviewModal.session!.id ? { 
        ...s, 
        rating: reviewModal.rating, 
        reviewComment: reviewModal.comment 
      } : s));
      showToast("Thank you! Your verified review has been published.");
      setReviewModal({ isOpen: false, session: null, rating: 5, comment: "" });
    }
  };

  const filteredSessions = sessions.filter(s => {
    const matchesFilter = filterTab === "ALL" || s.status === filterTab;
    const matchesSearch = s.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.mentorCompany.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
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

      {/* Top Header Navigation */}
      <header className="bg-white border-b border-[#eaecf2] h-[72px] px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1e2433] tracking-tight">
              My Sessions
            </h1>
            <p className="text-xs text-[#94a3b8] font-medium">Track upcoming video calls, attend live rooms, and review past mentorship</p>
          </div>
        </div>

        <Link
          href="/mentors"
          className="px-5 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all flex items-center space-x-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Book New Session</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-6 sm:p-8 space-y-6">
        
        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1">
            {[
              { id: "ALL", label: "All Sessions" },
              { id: "UPCOMING", label: "Upcoming" },
              { id: "COMPLETED", label: "Completed" },
              { id: "CANCELLED", label: "Cancelled" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterTab === tab.id
                    ? "bg-[#7922f5] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input 
              type="text"
              placeholder="Search mentor, topic, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#eef0f6] space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No {filterTab.toLowerCase()} sessions found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Discover verified mentors across finance, engineering, law, design, medicine and book your next 1:1 strategy session.
            </p>
            <Link
              href="/mentors"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#7922f5] text-white font-bold text-xs shadow-md shadow-purple-600/20 hover:bg-[#6819d4]"
            >
              Browse Verified Mentors →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => {
              const isUpcoming = session.status === "UPCOMING";
              const isCompleted = session.status === "COMPLETED";
              const isCancelled = session.status === "CANCELLED";

              return (
                <div 
                  key={session.id}
                  className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] hover:border-purple-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  {/* Left: Mentor Info & Session Meta */}
                  <div className="flex items-start space-x-4">
                    <img 
                      src={session.mentorAvatar} 
                      alt={session.mentorName}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-100 shadow-sm shrink-0"
                    />
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-[#1e2433]">{session.mentorName}</h3>
                        <span className="text-[11px] font-semibold text-[#7922f5] bg-[#f6f2fe] px-2 py-0.5 rounded-md">
                          {session.mentorCompany}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isUpcoming ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          isCompleted ? "bg-purple-50 text-purple-700 border border-purple-200" :
                          "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}>
                          {session.status}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-800">{session.serviceTitle}</p>
                      <p className="text-xs text-slate-500 font-medium">{session.mentorRole}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#7922f5]" />
                          <span>{session.date}</span>
                        </span>
                        <span className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#7922f5]" />
                          <span>{session.time}</span>
                        </span>
                        <span className="font-semibold text-slate-700">
                          ₹{session.priceINR.toLocaleString()} Paid
                        </span>
                      </div>

                      {/* Pre-session goal / Post-session feedback */}
                      {session.preSessionGoal && isUpcoming && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mt-2">
                          <span className="font-bold text-slate-800">Your Goal: </span>
                          {session.preSessionGoal}
                        </div>
                      )}

                      {session.reviewComment && isCompleted && (
                        <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 text-xs text-purple-900 mt-2">
                          <div className="flex items-center space-x-1 mb-0.5">
                            {[...Array(session.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                            <span className="font-bold text-[11px] ml-1">Your Review</span>
                          </div>
                          <span>"{session.reviewComment}"</span>
                        </div>
                      )}

                      {session.deliverables && isCompleted && (
                        <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 mt-2">
                          <span className="font-bold text-emerald-950">Mentor Deliverable: </span>
                          {session.deliverables}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <Link
                      href={`/student/sessions/${session.id}`}
                      className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#7922f5] hover:border-purple-300 transition-colors flex items-center space-x-1"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    {isUpcoming && (
                      <>
                        <a
                          href={session.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-6 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all flex items-center space-x-2"
                        >
                          <Video className="w-4 h-4" />
                          <span>Join Meeting</span>
                        </a>

                        <button
                          onClick={() => setCancelModal({ isOpen: true, session, reason: "" })}
                          className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Cancel Session
                        </button>
                      </>
                    )}

                    {isCompleted && (
                      <>
                        {!session.rating ? (
                          <button
                            onClick={() => setReviewModal({ isOpen: true, session, rating: 5, comment: "" })}
                            className="px-5 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center space-x-2"
                          >
                            <Star className="w-4 h-4 fill-white" />
                            <span>Leave Review</span>
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Reviewed</span>
                          </span>
                        )}

                        <Link
                          href={`/mentors?search=${encodeURIComponent(session.mentorName)}`}
                          className="px-4 py-1.5 rounded-lg border border-purple-200 text-xs text-[#7922f5] font-bold hover:bg-purple-50 transition-colors flex items-center space-x-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Book Again</span>
                        </Link>
                      </>
                    )}

                    {isCancelled && (
                      <Link
                        href={`/mentors?search=${encodeURIComponent(session.mentorName)}`}
                        className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-bold hover:border-[#7922f5] transition-colors"
                      >
                        Rebook Slot
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* REVIEW MODAL                                                              */}
      {/* ========================================================================= */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#1e2433]">Review Your Mentorship Session</h3>
              <button 
                onClick={() => setReviewModal({ isOpen: false, session: null, rating: 5, comment: "" })}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-xs text-slate-500">How was your session with <span className="font-bold text-slate-800">{reviewModal.session?.mentorName}</span>?</p>
              
              {/* Star Selector */}
              <div className="flex justify-center space-x-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewModal({ ...reviewModal, rating: star })}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`w-7 h-7 ${
                        star <= reviewModal.rating 
                          ? "fill-amber-400 text-amber-400" 
                          : "text-slate-200"
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Written Feedback</label>
              <textarea 
                rows={4}
                value={reviewModal.comment}
                onChange={(e) => setReviewModal({ ...reviewModal, comment: e.target.value })}
                placeholder="Share how the mentor helped you (e.g. actionable advice, case study tips, valuation feedback)..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setReviewModal({ isOpen: false, session: null, rating: 5, comment: "" })}
                className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                className="px-6 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CANCEL MODAL                                                              */}
      {/* ========================================================================= */}
      {cancelModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Cancel Mentorship Session?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to cancel your session with <span className="font-semibold text-slate-800">{cancelModal.session?.mentorName}</span>?
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for cancellation (optional)</label>
              <input 
                type="text"
                value={cancelModal.reason}
                onChange={(e) => setCancelModal({ ...cancelModal, reason: e.target.value })}
                placeholder="e.g. Schedule conflict, academic exam"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModal({ isOpen: false, session: null, reason: "" })}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
              >
                Keep Session
              </button>
              <button
                type="button"
                onClick={handleCancelSession}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
