"use client";

import React from "react";
import { Mentor } from "@/types";
import { 
  X, 
  ShieldCheck, 
  Star, 
  Briefcase, 
  CheckCircle2, 
  Linkedin, 
  Mail, 
  Sparkles, 
  ArrowRight
} from "lucide-react";

interface MentorDetailModalProps {
  mentor: Mentor | null;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onBookNow: (mentor: Mentor) => void;
}

export const MentorDetailModal: React.FC<MentorDetailModalProps> = ({
  mentor,
  isOpen,
  onClose,
  isDark,
  onBookNow,
}) => {
  if (!isOpen || !mentor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div
        className={`relative w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border overflow-hidden transition-all duration-300 my-auto ${
          isDark
            ? "bg-[#141418] border-white/15 text-white"
            : "bg-white border-teal-100 text-gray-900"
        }`}
      >
        {/* Header Cover */}
        <div className={`h-20 sm:h-28 relative ${
          isDark
            ? "bg-gradient-to-r from-emerald-900/60 via-[#181820] to-teal-900/50"
            : "bg-gradient-to-r from-teal-100 via-emerald-100 to-cyan-100"
        }`}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-10"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-0 -mt-10 sm:-mt-14 max-h-[80vh] overflow-y-auto">
          {/* Avatar & Key Stats */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="flex items-end space-x-3 sm:space-x-4">
              <div className="relative shrink-0">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-18 h-18 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl object-cover border-3 sm:border-4 border-white dark:border-[#141418] shadow-xl"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 sm:p-1 rounded-full border-2 border-white dark:border-[#141418]">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="mb-0.5 sm:mb-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h2 className="text-lg sm:text-2xl font-extrabold truncate">{mentor.name}</h2>
                  <span className="text-[9px] sm:text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    VERIFIED
                  </span>
                </div>
                <p className={`text-xs sm:text-sm font-medium truncate ${isDark ? "text-emerald-400" : "text-teal-700"}`}>
                  {mentor.role} @ <strong className={isDark ? "text-white" : "text-gray-900"}>{mentor.company}</strong>
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onBookNow(mentor)}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 shrink-0"
            >
              <span>Book Session (₹{mentor.services[0]?.priceINR || mentor.hourlyRateINR})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Verification Badges Row */}
          <div className={`p-3 rounded-2xl border mb-5 flex flex-wrap gap-1.5 sm:gap-2 items-center ${
            isDark ? "bg-[#1a1a22] border-white/10" : "bg-teal-50/60 border-teal-100"
          }`}>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-400 mr-1">
              Verified:
            </span>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Mail className="w-3 h-3" />
              <span>@{mentor.companyDomain}</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Linkedin className="w-3 h-3" />
              <span>LinkedIn Checked</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <ShieldCheck className="w-3 h-3" />
              <span>Gov KYC</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Briefcase className="w-3 h-3" />
              <span>{mentor.experienceYears}+ Yrs Exp</span>
            </span>
          </div>

          {/* Bio */}
          <div className="space-y-4 mb-5">
            <div>
              <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                About the Mentor
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {mentor.bio}
              </p>
            </div>

            <div>
              <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Specialized Topics
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {mentor.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-medium ${
                      isDark ? "bg-[#22222a] text-gray-200" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mb-5">
            <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
              Available 1:1 Session Formats
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {mentor.services.map((srv) => (
                <div
                  key={srv.id}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
                    isDark ? "bg-[#181820] border-white/10" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs sm:text-sm font-bold">{srv.title}</h4>
                      {srv.popular && (
                        <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-black">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-gray-400">{srv.description}</p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">⏱️ {srv.durationMinutes} min</span>
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-400">₹{srv.priceINR}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Plan Template */}
          <div className={`p-3.5 sm:p-4 rounded-2xl border mb-5 ${
            isDark ? "bg-purple-950/20 border-purple-800/30" : "bg-purple-50/70 border-purple-200"
          }`}>
            <div className="flex items-center space-x-2 text-purple-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Standard Post-Session Action Plan Deliverable</span>
            </div>
            <ul className="space-y-1 text-[11px] sm:text-xs text-gray-300">
              {(mentor.actionPlanTemplate || [
                "Detailed evaluation of current preparation roadmap",
                "Line-by-line feedback on resume & technical projects",
                "Curated milestone checklist for placement rounds"
              ]).map((item, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Student Reviews */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                Verified Mentee Reviews ({mentor.totalReviews})
              </h3>
              <div className="flex items-center space-x-1 text-xs font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{mentor.ratingAvg} / 5.0</span>
              </div>
            </div>

            {mentor.reviews.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No public reviews written yet.</p>
            ) : (
              <div className="space-y-2">
                {mentor.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`p-3 rounded-xl border ${
                      isDark ? "bg-[#181820] border-white/5" : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2 min-w-0">
                        <img
                          src={rev.studentAvatar}
                          alt={rev.studentName}
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                        <span className="text-xs font-bold truncate">{rev.studentName}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 shrink-0">{rev.date}</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-gray-300 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
