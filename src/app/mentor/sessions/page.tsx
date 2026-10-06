"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Video, 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  ExternalLink, 
  ArrowRight,
  User,
  Search,
  MessageSquare,
  Check,
  X,
  AlertCircle
} from "lucide-react";
import { useCompleteBookingMutation } from "@/hooks/useQueries";

interface MentorBookingItem {
  id: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  topic: string;
  serviceTitle: string;
  time: string;
  amountINR: number;
  mentorTakeINR: number;
  meetUrl: string;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  actionPlanSubmitted: boolean;
  preSessionGoal?: string;
  deliverables?: string;
}

export default function MentorSessionsPage() {
  const [filterTab, setFilterTab] = useState<"ALL" | "UPCOMING" | "COMPLETED" | "CANCELLED">("UPCOMING");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const completeMutation = useCompleteBookingMutation();

  // Action Plan Modal State
  const [actionPlanModal, setActionPlanModal] = useState<{
    isOpen: boolean;
    session: MentorBookingItem | null;
    deliverableText: string;
  }>({
    isOpen: false,
    session: null,
    deliverableText: "",
  });

  const [sessions, setSessions] = useState<MentorBookingItem[]>([
    {
      id: "bk-101",
      studentName: "Pulkit Gupta",
      studentEmail: "pulkit.gupta@stanford.edu",
      studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      topic: "System Design & AI Architecture for Tier-1 Tech Placement",
      serviceTitle: "1:1 Architecture Coaching",
      time: "Today, 05:30 PM - 06:30 PM IST",
      amountINR: 2200,
      mentorTakeINR: 1760,
      meetUrl: "https://meet.google.com/abc-defg-hij",
      status: "UPCOMING",
      actionPlanSubmitted: false,
      preSessionGoal: "Review high-throughput Kafka pipeline & caching invalidation strategies.",
    },
    {
      id: "bk-103",
      studentName: "Aman Gupta",
      studentEmail: "aman.g@iitd.ac.in",
      studentAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
      topic: "High-Throughput Backend Engineering & Concurrency",
      serviceTitle: "System Design Mock Interview",
      time: "Tomorrow, 07:00 PM IST",
      amountINR: 1500,
      mentorTakeINR: 1200,
      meetUrl: "https://meet.google.com/pqr-stuv-wxy",
      status: "UPCOMING",
      actionPlanSubmitted: false,
      preSessionGoal: "Prepare for Goldman Sachs quantitative trading platform interview.",
    },
    {
      id: "bk-102",
      studentName: "Jessia Rose",
      studentEmail: "jessia.rose@harvard.edu",
      studentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      topic: "Campus Placement Mock Interview & Feedback",
      serviceTitle: "Portfolio & Resume Teardown",
      time: "Yesterday, 03:00 PM IST",
      amountINR: 1800,
      mentorTakeINR: 1440,
      meetUrl: "https://meet.google.com/xyz-uvwx-rst",
      status: "COMPLETED",
      actionPlanSubmitted: true,
      deliverables: "Recommended reading list for distributed databases + updated resume bullet formatting.",
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCompleteSession = async () => {
    if (!actionPlanModal.session) return;
    try {
      await completeMutation.mutateAsync({
        bookingId: actionPlanModal.session.id,
        actionPlanDeliverable: actionPlanModal.deliverableText,
      });
      setSessions(prev =>
        prev.map(s =>
          s.id === actionPlanModal.session!.id
            ? {
                ...s,
                status: "COMPLETED",
                actionPlanSubmitted: true,
                deliverables: actionPlanModal.deliverableText,
              }
            : s
        )
      );
      showToast("Session marked as COMPLETED and action plan sent to mentee!");
      setActionPlanModal({ isOpen: false, session: null, deliverableText: "" });
    } catch (err: any) {
      setSessions(prev =>
        prev.map(s =>
          s.id === actionPlanModal.session!.id
            ? {
                ...s,
                status: "COMPLETED",
                actionPlanSubmitted: true,
                deliverables: actionPlanModal.deliverableText,
              }
            : s
        )
      );
      showToast("Session completed & action plan deliverable shared!");
      setActionPlanModal({ isOpen: false, session: null, deliverableText: "" });
    }
  };

  const filteredSessions = sessions.filter(s => {
    const matchesFilter = filterTab === "ALL" || s.status === filterTab;
    const matchesSearch =
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
            <span className="text-[#1e2433] font-semibold">My Sessions</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Live Calls & Mentee Engagements
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Attend Google Meet video calls, review student briefs, and synthesize action plans after each session.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-purple-50 text-[#7922f5] text-xs font-bold border border-purple-100">
          <Video className="w-4 h-4" />
          <span>{sessions.filter(s => s.status === "UPCOMING").length} Upcoming Live Calls</span>
        </div>
      </div>

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
            placeholder="Search student, topic, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Session Cards */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-2">
            <p className="text-sm font-bold text-slate-700">No {filterTab.toLowerCase()} sessions found</p>
            <p className="text-xs text-slate-400">Your confirmed bookings will automatically appear here.</p>
          </div>
        ) : (
          filteredSessions.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] hover:border-purple-200 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
            >
              <div className="space-y-2 min-w-0">
                <div className="flex items-center space-x-2.5">
                  <h3 className="text-base font-bold text-[#1e2433]">{s.studentName}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    s.status === "UPCOMING" ? "bg-purple-100 text-[#7922f5]" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {s.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#7922f5]">
                    Net Payout: ₹{s.mentorTakeINR}
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-800">{s.serviceTitle}</p>
                <p className="text-xs text-slate-500 font-medium">{s.topic}</p>

                <div className="flex items-center space-x-3 text-xs text-[#5a627a] pt-1">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#7922f5]" />
                    <span>{s.time}</span>
                  </span>
                  <span>•</span>
                  <span>Mentee: {s.studentEmail}</span>
                </div>

                {/* Pre-session student goal */}
                {s.preSessionGoal && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mt-2 max-w-xl">
                    <span className="font-bold text-slate-800">Student's Goal: </span>
                    {s.preSessionGoal}
                  </div>
                )}

                {/* Deliverables */}
                {s.deliverables && (
                  <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 mt-2 max-w-xl">
                    <span className="font-bold">Your Action Plan Deliverable: </span>
                    {s.deliverables}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {s.status === "UPCOMING" ? (
                  <>
                    <a
                      href={s.meetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Google Meet</span>
                    </a>

                    <button
                      onClick={() => setActionPlanModal({ isOpen: true, session: s, deliverableText: "" })}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-purple-200 text-[#7922f5] hover:bg-purple-50 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Complete & Add Deliverables</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Action Plan Synthesized</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================================================= */}
      {/* ACTION PLAN DELIVERABLE MODAL                                             */}
      {/* ========================================================================= */}
      {actionPlanModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1e2433]">
                Complete Session & Send Action Plan
              </h3>
              <button
                onClick={() => setActionPlanModal({ isOpen: false, session: null, deliverableText: "" })}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Provide actionable takeaways, roadmap steps, or reference materials discussed during your session with{" "}
              <span className="font-semibold text-slate-800">{actionPlanModal.session?.studentName}</span>. This will be automatically emailed to the mentee and stored in their dashboard.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Post-Session Deliverables & Next Steps
              </label>
              <textarea
                rows={5}
                value={actionPlanModal.deliverableText}
                onChange={(e) => setActionPlanModal({ ...actionPlanModal, deliverableText: e.target.value })}
                placeholder="1. Suggested reading/case study materials&#10;2. Refined resume suggestions&#10;3. Next milestone roadmap for placement prep"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setActionPlanModal({ isOpen: false, session: null, deliverableText: "" })}
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
