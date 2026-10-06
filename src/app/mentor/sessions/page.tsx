"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Video, CalendarCheck, Clock, CheckCircle2, FileText, Sparkles, ExternalLink, ArrowRight } from "lucide-react";

export default function MentorSessionsPage() {
  const [sessions, setSessions] = useState([
    {
      id: "bk-101",
      studentName: "Pulkit Gupta",
      studentEmail: "pulkit.gupta@stanford.edu",
      topic: "System Design & AI Architecture for Tier-1 Tech Placement",
      time: "Today, 05:30 PM - 06:30 PM IST",
      amountINR: 2200,
      mentorTakeINR: 1760,
      meetUrl: "https://meet.google.com/abc-defg-hij",
      status: "UPCOMING",
      actionPlanSubmitted: false,
    },
    {
      id: "bk-103",
      studentName: "Aman Gupta",
      studentEmail: "aman.g@iitd.ac.in",
      topic: "High-Throughput Backend Engineering & Concurrency",
      time: "Tomorrow, 07:00 PM IST",
      amountINR: 1500,
      mentorTakeINR: 1200,
      meetUrl: "https://meet.google.com/pqr-stuv-wxy",
      status: "UPCOMING",
      actionPlanSubmitted: false,
    },
    {
      id: "bk-102",
      studentName: "Jessia Rose",
      studentEmail: "jessia.rose@harvard.edu",
      topic: "Campus Placement Mock Interview & Feedback",
      time: "Yesterday, 03:00 PM IST",
      amountINR: 1800,
      mentorTakeINR: 1440,
      meetUrl: "https://meet.google.com/xyz-uvwx-rst",
      status: "COMPLETED",
      actionPlanSubmitted: true,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
            <Link href="/mentor/dashboard" className="hover:text-[#7922f5]">Mentor</Link>
            <span>/</span>
            <span className="text-[#1e2433] font-semibold">My Sessions</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Live Calls & Post-Session Action Plans
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Attend Google Meet video calls and synthesize structured roadmaps after each session.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-purple-50 text-[#7922f5] text-xs font-bold border border-purple-100">
          <Video className="w-4 h-4" />
          <span>{sessions.filter(s => s.status === "UPCOMING").length} Upcoming Live Calls</span>
        </div>
      </div>

      <div className="space-y-4">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] hover:border-purple-200 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
          >
            <div className="space-y-1.5 min-w-0">
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

              <p className="text-xs font-medium text-slate-700">{s.topic}</p>

              <div className="flex items-center space-x-3 text-xs text-[#5a627a] pt-1">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-[#7922f5]" />
                  <span>{s.time}</span>
                </span>
                <span>•</span>
                <span>Mentee: {s.studentEmail}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              {s.status === "UPCOMING" ? (
                <a
                  href={s.meetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full lg:w-auto px-5 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Google Meet</span>
                </a>
              ) : (
                <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Action Plan Synthesized</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
