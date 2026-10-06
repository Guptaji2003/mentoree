"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Layers, Plus, DollarSign, Clock, CheckCircle2 } from "lucide-react";

export default function MentorServicesPage() {
  const [services, setServices] = useState([
    {
      id: "srv-1",
      title: "1:1 Live System Design Teardown",
      durationMinutes: 60,
      priceINR: 2200,
      mentorTakeINR: 1760,
      description: "Deep dive into microservices, cache layers, distributed databases, and high-concurrency rate limiters.",
      deliverables: "Structured architecture diagram + action plan roadmap",
    },
    {
      id: "srv-2",
      title: "Mock Technical Interview & Placement Feedback",
      durationMinutes: 45,
      priceINR: 1800,
      mentorTakeINR: 1440,
      description: "Realistic 45-minute FAANG/Tier-1 coding & behavioral interview with immediate actionable scorecards.",
      deliverables: "Rubric assessment + DSA improvement milestones",
    },
    {
      id: "srv-3",
      title: "Resume & Portfolio Roast",
      durationMinutes: 30,
      priceINR: 1200,
      mentorTakeINR: 960,
      description: "Line-by-line ATS resume review and project portfolio feedback to maximize shortlisting rates.",
      deliverables: "Annotated resume PDF + action checklist",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
            <Link href="/mentor/dashboard" className="hover:text-[#7922f5]">Mentor</Link>
            <span>/</span>
            <span className="text-[#1e2433] font-semibold">Services & Pricing</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Mentorship Packages & Pricing Tiers
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Configure bookable offerings. You receive 80% of every booked session directly into your bank account.
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all active:scale-95 flex items-center space-x-1.5 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Add Custom Offering</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {services.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] flex flex-col justify-between space-y-4 hover:border-purple-200 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7922f5] border border-purple-100">
                  {s.durationMinutes} Minutes
                </span>
                <div className="text-right">
                  <div className="text-base font-black text-[#1e2433]">₹{s.priceINR}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">You get ₹{s.mentorTakeINR}</div>
                </div>
              </div>

              <h3 className="text-sm font-bold text-[#1e2433] leading-snug">{s.title}</h3>
              <p className="text-xs text-[#5a627a] leading-relaxed">{s.description}</p>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase text-[#9aa0b4] block mb-1">Deliverables:</span>
                <span className="text-xs text-slate-700 font-medium">{s.deliverables}</span>
              </div>
            </div>

            <button className="w-full py-2 rounded-xl border border-[#eaecf2] hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors">
              Edit Package Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
