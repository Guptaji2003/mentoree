"use client";

import React from "react";
import { UserPlus, Search, Video, FileCheck, ArrowRight, ShieldCheck } from "lucide-react";

interface HowItWorksProps {
  isDark: boolean;
  onExplore: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksProps> = ({ isDark, onExplore }) => {
  const steps = [
    {
      icon: UserPlus,
      stepNum: "01",
      title: "Select Goal & Target Role",
      desc: "Specify your career destination—Tier-1 Campus Placement, FAANG Mock Interview, DSA Mastery, or System Design.",
    },
    {
      icon: Search,
      stepNum: "02",
      title: "Search Verified Experts",
      desc: "Filter mentors with proved corporate emails (@google.com, @stripe.com), authentic track records, and clear transparent slot rates.",
    },
    {
      icon: Video,
      stepNum: "03",
      title: "10-Min Hold & Live Session",
      desc: "Reserve your slot with high-concurrency lock protection, pay safely via Razorpay escrow, and attend a 1:1 LiveKit video session.",
    },
    {
      icon: FileCheck,
      stepNum: "04",
      title: "Structured Action Plan",
      desc: "Receive your customized career blueprint, study milestones, and interview score report synthesized directly after the call.",
    },
  ];

  return (
    <section className={`py-16 sm:py-20 transition-colors duration-300 ${
      isDark ? "bg-[#0b0b0d] text-white" : "bg-[#f8f9fb] text-[#1e2433]"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className={`text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full ${
            isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-[#f6f2fe] text-[#7922f5] border border-purple-100"
          }`}>
            Frictionless Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans text-[#1e2433]">
            How Sp!k Mentorship Works
          </h2>
          <p className={`text-xs sm:text-sm font-medium ${isDark ? "text-gray-400" : "text-[#5a627a]"}`}>
            From discovering verified practitioners to walking away with a battle-tested career action plan.
          </p>
        </div>

        {/* Steps Horizontal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className={`rounded-2xl p-6 sm:p-7 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative flex flex-col justify-between space-y-4 ${
                  isDark
                    ? "bg-[#15151c] border-white/10 hover:border-emerald-500/40"
                    : "bg-white border-[#eef0f6] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-purple-200"
                }`}
              >
                <div>
                  <span className={`text-2xl font-black font-mono block mb-3 ${
                    isDark ? "text-emerald-500/40" : "text-purple-300"
                  }`}>
                    {s.stepNum}
                  </span>

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                    isDark ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500" : "bg-purple-50 text-[#7922f5]"
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base font-bold text-[#1e2433] mb-2">{s.title}</h3>
                  <p className={`text-xs leading-relaxed ${isDark ? "text-gray-400" : "text-[#5a627a]"}`}>
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner */}
        <div className={`mt-12 rounded-2xl p-8 border flex flex-col md:flex-row items-center justify-between gap-6 ${
          isDark
            ? "bg-gradient-to-r from-emerald-950/60 via-[#181822] to-teal-950/40 border-emerald-500/30 text-white"
            : "bg-white border-[#eef0f6] shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-[#1e2433]"
        }`}>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1e2433]">
              Ready to learn from leaders who cleared the bar?
            </h3>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-gray-300" : "text-[#5a627a]"}`}>
              Join learners from engineering, commerce, law, medicine, and design fast-tracking their career milestones.
            </p>
          </div>

          <button
            onClick={onExplore}
            className={`shrink-0 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 flex items-center space-x-2 ${
              isDark 
                ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20" 
                : "bg-[#7922f5] hover:bg-[#6819d4] text-white shadow-purple-600/20"
            }`}
          >
            <span>Browse Verified Mentors</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
