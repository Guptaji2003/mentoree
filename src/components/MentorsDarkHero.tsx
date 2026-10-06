"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mentor } from "@/types";
import { 
  Search, 
  Play, 
  ShieldCheck, 
  Clock,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle2,
  Users
} from "lucide-react";

interface MentorsDarkHeroProps {
  isDark?: boolean;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  onSearch: (term: string) => void;
  onSelectMentor: (mentor: Mentor) => void;
  mentors: Mentor[];
  onOpenVerification: () => void;
  onScrollToDirectory: () => void;
}

export const MentorsDarkHero: React.FC<MentorsDarkHeroProps> = ({
  isDark = false,
  onSelectCategory,
  selectedCategory,
  onSearch,
  onSelectMentor,
  mentors,
  onOpenVerification,
  onScrollToDirectory,
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  const alex = mentors.find((m) => m.name.includes("Alex") || m.name.includes("Kumar")) || mentors[0];
  const kathryn = mentors.find((m) => m.name.includes("Kathryn") || m.name.includes("Murphy")) || mentors[1] || mentors[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/mentors?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/mentors");
    }
  };

  const handleNavigateToDirectory = () => {
    router.push("/mentors");
  };

  return (
    <div className={`relative overflow-hidden pt-8 sm:pt-12 pb-16 sm:pb-20 border-b transition-colors duration-300 ${
      isDark 
        ? "bg-[#121212] text-white border-white/10" 
        : "bg-white text-[#1e2433] border-[#eaecf2]"
    }`}>
      {/* Subtle Purple / Ambient Glow */}
      <div className={`absolute top-1/4 -left-48 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        isDark ? "bg-emerald-500/10" : "bg-purple-500/10"
      }`} />
      <div className={`absolute top-1/3 -right-48 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        isDark ? "bg-amber-500/10" : "bg-indigo-500/10"
      }`} />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline & Controls */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* Top Verification Tag */}
            <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold ${
              isDark 
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" 
                : "bg-[#f6f2fe] border border-purple-100 text-[#7922f5]"
            }`}>
              <ShieldCheck className="w-4 h-4" />
              <span>100% Background-Verified Practitioners</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-[54px] font-extrabold tracking-tight leading-[1.12] text-[#1e2433]">
              We Help People <br />
              <span className="text-[#7922f5]">Connect With Their</span> <br />
              Right Mentors.
            </h1>

            <p className={`text-xs sm:text-sm md:text-base max-w-xl leading-relaxed font-medium ${
              isDark ? "text-gray-400" : "text-[#5a627a]"
            }`}>
              Book personalized 1:1 roadmap sessions, portfolio reviews, and mock technical interviews with staff engineers and senior practitioners across Engineering, Finance, Medicine, Law, Design, and Science.
            </p>

            {/* Action Bar: Primary CTA + Search Pill */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={handleNavigateToDirectory}
                className={`flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 ${
                  isDark
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400"
                    : "bg-[#7922f5] hover:bg-[#6819d4] text-white shadow-purple-600/25"
                }`}
              >
                <span>Browse Mentors Directory</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Search Pill Input */}
              <form
                onSubmit={handleSearchSubmit}
                className={`flex-1 flex items-center rounded-full px-4 py-2.5 border transition-all ${
                  isDark
                    ? "bg-[#1e1e24]/90 border-white/10 focus-within:border-emerald-400 text-white"
                    : "bg-[#f4f5fa] border-[#eceff5] focus-within:border-[#7922f5] focus-within:bg-white text-[#1e2433]"
                }`}
              >
                <Search className={`w-4 h-4 mr-2 shrink-0 ${isDark ? "text-gray-400" : "text-[#9aa0b4]"}`} />
                <input
                  type="text"
                  placeholder="Search role, skills, Goldman, Stripe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm placeholder-[#9aa0b4] focus:outline-none font-medium"
                />
              </form>
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs font-medium text-[#5a627a]">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#7922f5]" />
                <span>10-min slot hold lock</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#7922f5]" />
                <span>1:1 Google Meet calls</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#7922f5]" />
                <span>Post-session action plan</span>
              </div>
            </div>
          </div>

          {/* Right Column: Mentor Spotlight Cards */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
            <div className="relative w-full max-w-sm space-y-4">
              
              {/* Spotlight Card 1 */}
              {alex && (
                <div
                  onClick={() => onSelectMentor(alex)}
                  className={`rounded-2xl p-5 border transition-all cursor-pointer transform hover:-translate-y-1 group ${
                    isDark
                      ? "bg-[#18181f]/90 border-white/15 shadow-2xl hover:border-emerald-500/50"
                      : "bg-white border-[#eef0f6] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:border-purple-200"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={alex.avatar}
                      alt={alex.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-purple-50 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-bold text-sm truncate ${isDark ? "text-white" : "text-[#1e2433] group-hover:text-[#7922f5] transition-colors"}`}>
                          {alex.name}
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isDark 
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                            : "bg-[#f6f2fe] text-[#7922f5] border border-purple-100"
                        }`}>
                          {alex.company}
                        </span>
                      </div>
                      <p className={`text-xs truncate font-medium ${isDark ? "text-gray-400" : "text-[#5a627a]"}`}>{alex.role}</p>
                      <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold pt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{alex.ratingAvg}</span>
                        <span className="text-[#9aa0b4] font-normal">({alex.totalReviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
                    isDark ? "border-white/10" : "border-slate-100"
                  }`}>
                    <span className={isDark ? "text-gray-400" : "text-[#9aa0b4]"}>Starting at</span>
                    <span className={`font-black text-sm ${isDark ? "text-emerald-400" : "text-[#1e2433]"}`}>₹{alex.hourlyRateINR} / session</span>
                  </div>
                </div>
              )}

              {/* Spotlight Card 2 */}
              {kathryn && (
                <div
                  onClick={() => onSelectMentor(kathryn)}
                  className={`rounded-2xl p-5 border transition-all cursor-pointer transform hover:-translate-y-1 group ${
                    isDark
                      ? "bg-[#18181f]/90 border-white/15 shadow-2xl hover:border-emerald-500/50"
                      : "bg-white border-[#eef0f6] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:border-purple-200"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={kathryn.avatar}
                      alt={kathryn.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-purple-50 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-bold text-sm truncate ${isDark ? "text-white" : "text-[#1e2433] group-hover:text-[#7922f5] transition-colors"}`}>
                          {kathryn.name}
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isDark 
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                            : "bg-[#f6f2fe] text-[#7922f5] border border-purple-100"
                        }`}>
                          {kathryn.company}
                        </span>
                      </div>
                      <p className={`text-xs truncate font-medium ${isDark ? "text-gray-400" : "text-[#5a627a]"}`}>{kathryn.role}</p>
                      <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold pt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{kathryn.ratingAvg}</span>
                        <span className="text-[#9aa0b4] font-normal">({kathryn.totalReviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
                    isDark ? "border-white/10" : "border-slate-100"
                  }`}>
                    <span className={isDark ? "text-gray-400" : "text-[#9aa0b4]"}>Starting at</span>
                    <span className={`font-black text-sm ${isDark ? "text-emerald-400" : "text-[#1e2433]"}`}>₹{kathryn.hourlyRateINR} / session</span>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
