"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Search, Sparkles, CheckCircle2, Target } from "lucide-react";

export default function MentorMenteesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const mentees = [
    {
      id: "std-1",
      name: "Pulkit Gupta",
      email: "pulkit.gupta@stanford.edu",
      targetGoal: "Senior Software Engineer (Tier-1 Tech)",
      readiness: "85%",
      sessionsCompleted: 3,
      lastSession: "Oct 5, 2026",
      status: "ACTIVE_MENTEE",
    },
    {
      id: "std-2",
      name: "Jessia Rose",
      email: "jessia.rose@harvard.edu",
      targetGoal: "Private Equity Analyst",
      readiness: "90%",
      sessionsCompleted: 2,
      lastSession: "Oct 4, 2026",
      status: "ROADMAP_ON_TRACK",
    },
    {
      id: "std-3",
      name: "Aman Gupta",
      email: "aman.g@iitd.ac.in",
      targetGoal: "Distributed Systems & Cloud Engineer",
      readiness: "75%",
      sessionsCompleted: 1,
      lastSession: "Upcoming Tomorrow",
      status: "UPCOMING_CALL",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
            <Link href="/mentor/dashboard" className="hover:text-[#7922f5]">Mentor</Link>
            <span>/</span>
            <span className="text-[#1e2433] font-semibold">Mentees & Roadmaps</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Active Mentees & Goal Progress
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Track student placement readiness, milestone checklists, and career progression.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-purple-50 text-[#7922f5] text-xs font-bold border border-purple-100">
          <Users className="w-4 h-4" />
          <span>{mentees.length} Active Mentees Guided</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {mentees.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4"
          >
            <div>
              <h3 className="text-base font-bold text-[#1e2433]">{m.name}</h3>
              <p className="text-xs text-[#9aa0b4]">{m.email}</p>
            </div>

            <div className="space-y-2 p-3 rounded-xl bg-[#f8f9fb] border border-[#eaecf2] text-xs">
              <div className="flex items-center space-x-1.5 text-[#7922f5] font-bold">
                <Target className="w-3.5 h-3.5" />
                <span>Target Career Milestone:</span>
              </div>
              <p className="font-semibold text-[#1e2433]">{m.targetGoal}</p>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-[#9aa0b4]">Readiness Score</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {m.readiness} Ready
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
