"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  Sparkles, 
  Award, 
  ArrowRight
} from "lucide-react";

interface StudentCareerLoopProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onExploreMentors: () => void;
}

export const StudentCareerLoop: React.FC<StudentCareerLoopProps> = ({
  isOpen,
  onClose,
  isDark,
  onExploreMentors,
}) => {
  const [completedItems, setCompletedItems] = useState<number[]>([0, 1]);

  if (!isOpen) return null;

  const toggleItem = (idx: number) => {
    if (completedItems.includes(idx)) {
      setCompletedItems(completedItems.filter((i) => i !== idx));
    } else {
      setCompletedItems([...completedItems, idx]);
    }
  };

  const progressPercent = Math.round((completedItems.length / 5) * 100);

  const loopSteps = [
    {
      title: "1. Placement Goal & Skill Gap Assessment",
      desc: "Define target companies (Google, Stripe, Microsoft) and evaluate current DSA & System Design readiness.",
      done: completedItems.includes(0),
    },
    {
      title: "2. Matched with Verified Senior Practitioner",
      desc: "Connect with Kathryn Murphy (Staff @ Google Cloud) who cleared the exact placement hurdle.",
      done: completedItems.includes(1),
    },
    {
      title: "3. Focused 1:1 Live Deep-Dive Session",
      desc: "Mock interview with live feedback rubric on Monotonic Stack DSA and distributed caching trade-offs.",
      done: completedItems.includes(2),
    },
    {
      title: "4. Post-Session Structured Action Plan",
      desc: "Mentor synthesized 3 concrete weekly milestones with curated practice questions and resume edits.",
      done: completedItems.includes(3),
    },
    {
      title: "5. Placement Offer & Referral Readiness",
      desc: "Verify interview readiness score > 90% and unlock direct internal employee referral intro.",
      done: completedItems.includes(4),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div
        className={`relative w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border overflow-hidden transition-all duration-300 my-auto ${
          isDark
            ? "bg-[#141418] border-white/15 text-white"
            : "bg-white border-teal-100 text-gray-900"
        }`}
      >
        {/* Top Banner */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-teal-900 via-[#134e4a] to-emerald-900 text-white relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Core Differentiator</span>
            </div>
            <button
              onClick={onClose}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <h3 className="text-lg sm:text-2xl font-extrabold font-sans">
            The Goal-Driven Career Outcome Loop
          </h3>
          <p className="text-xs text-emerald-200 mt-1 max-w-lg leading-relaxed">
            “Don't just book a mentor. Build a career path with someone who's already walked it.”
          </p>

          {/* Progress Bar */}
          <div className="mt-3 sm:mt-4 bg-black/40 rounded-2xl p-2.5 sm:p-3 border border-white/10 flex items-center justify-between">
            <div className="flex-1 mr-3 sm:mr-4">
              <div className="flex justify-between text-[10px] sm:text-[11px] font-bold mb-1">
                <span>Placement Execution Pipeline</span>
                <span className="text-emerald-400">{progressPercent}% Ready</span>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <Award className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 shrink-0" />
          </div>
        </div>

        {/* Steps interactive list */}
        <div className="p-4 sm:p-6 space-y-2.5 sm:space-y-3.5 max-h-[60vh] overflow-y-auto">
          {loopSteps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => toggleItem(idx)}
              className={`p-3 sm:p-4 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3 ${
                step.done
                  ? isDark
                    ? "bg-emerald-950/20 border-emerald-500/40"
                    : "bg-teal-50 border-teal-300"
                  : isDark
                  ? "bg-[#191922] border-white/10 opacity-70"
                  : "bg-gray-50 border-gray-200 opacity-80"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                ) : (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-gray-400 flex items-center justify-center text-[9px] sm:text-[10px] text-gray-400">
                    {idx + 1}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className={`text-xs sm:text-sm font-bold ${step.done ? "text-emerald-400" : ""}`}>
                  {step.title}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}

          <div className="pt-2 sm:pt-3">
            <button
              onClick={() => {
                onClose();
                onExploreMentors();
              }}
              className="w-full py-3 rounded-full font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Match With a Mentor to Complete Next Milestone</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
