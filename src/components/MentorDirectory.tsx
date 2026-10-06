"use client";

import React, { useState, useMemo } from "react";
import { Mentor } from "@/types";
import { 
  Search, 
  Star, 
  Clock, 
  CheckCircle2, 
  UserCheck
} from "lucide-react";

interface MentorDirectoryProps {
  mentors: Mentor[];
  isDark: boolean;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelectMentor: (mentor: Mentor) => void;
  onQuickBook: (mentor: Mentor) => void;
}

const CATEGORIES = [
  "All",
  "Placement",
  "Engineering",
  "Product",
  "Data & AI",
  "Design",
  "Entrepreneurship",
  "Finance",
];

const COMPANIES = ["All", "Google", "Stripe", "OpenAI", "Microsoft", "Apple", "Uber", "Razorpay"];

export const MentorDirectory: React.FC<MentorDirectoryProps> = ({
  mentors,
  isDark,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  onSelectMentor,
  onQuickBook,
}) => {
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [maxPrice, setMaxPrice] = useState(3000);
  const [onlyVerifiedEmployment, setOnlyVerifiedEmployment] = useState(false);
  const [activeSort, setActiveSort] = useState<"recommended" | "rating" | "price-low" | "price-high">("recommended");

  // Filter and sort logic
  const filteredMentors = useMemo(() => {
    return mentors
      .filter((m) => {
        if (m.verificationStatus !== "VERIFIED") return false;

        if (selectedCategory !== "All" && m.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          if (selectedCategory === "Placement Prep" && m.category !== "Placement" && !m.tags.some(t => t.toLowerCase().includes("placement"))) {
            return false;
          } else if (selectedCategory !== "Placement Prep") {
            return false;
          }
        }

        if (selectedCompany !== "All" && !m.company.toLowerCase().includes(selectedCompany.toLowerCase())) {
          return false;
        }

        if (onlyVerifiedEmployment && !m.verificationBadges.employmentVerified) {
          return false;
        }

        const startingPrice = m.services[0]?.priceINR || m.hourlyRateINR;
        if (startingPrice > maxPrice) {
          return false;
        }

        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = m.name.toLowerCase().includes(q);
          const matchCompany = m.company.toLowerCase().includes(q);
          const matchRole = m.role.toLowerCase().includes(q);
          const matchTags = m.tags.some((t) => t.toLowerCase().includes(q));
          const matchBio = m.bio.toLowerCase().includes(q);
          if (!matchName && !matchCompany && !matchRole && !matchTags && !matchBio) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (activeSort === "rating") return b.ratingAvg - a.ratingAvg;
        if (activeSort === "price-low") {
          const pA = a.services[0]?.priceINR || a.hourlyRateINR;
          const pB = b.services[0]?.priceINR || b.hourlyRateINR;
          return pA - pB;
        }
        if (activeSort === "price-high") {
          const pA = a.services[0]?.priceINR || a.hourlyRateINR;
          const pB = b.services[0]?.priceINR || b.hourlyRateINR;
          return pB - pA;
        }
        return b.totalReviews - a.totalReviews;
      });
  }, [mentors, selectedCategory, selectedCompany, onlyVerifiedEmployment, maxPrice, searchTerm, activeSort]);

  return (
    <section 
      id="mentor-directory-section" 
      className={`py-12 sm:py-16 transition-colors duration-300 ${
        isDark ? "bg-[#0c0c0e] text-white" : "bg-[#f8f9fb] text-[#1e2433]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <div className={`inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider mb-2 px-3.5 py-1 rounded-full ${
              isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-[#f6f2fe] text-[#7922f5] border border-purple-100"
            }`}>
              <UserCheck className="w-3.5 h-3.5" />
              <span>Verified Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1e2433]">
              Discover {filteredMentors.length} Verified Career Mentors
            </h2>
            <p className={`text-xs sm:text-sm mt-1 font-medium ${isDark ? "text-gray-400" : "text-[#5a627a]"}`}>
              Every mentor has verified identity, corporate credentials, and 1:1 slot booking.
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 self-start md:self-auto">
            <span className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-[#9aa0b4]"}`}>Sort by:</span>
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as any)}
              className={`text-xs font-medium rounded-xl px-3 py-1.5 border focus:outline-none ${
                isDark
                  ? "bg-[#18181c] border-white/10 text-white"
                  : "bg-white border-[#eaecf2] text-[#1e2433] focus:border-[#7922f5]"
              }`}
            >
              <option value="recommended">Most Recommended</option>
              <option value="rating">Highest Rating</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filters Bar */}
        <div className={`p-4 sm:p-5 rounded-2xl border mb-6 sm:mb-8 transition-colors ${
          isDark ? "bg-[#141418] border-white/10" : "bg-white border-[#eef0f6] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
        }`}>
          {/* Category Pills */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto pb-3 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                    active
                      ? isDark
                        ? "bg-emerald-500 text-black font-bold shadow"
                        : "bg-[#7922f5] text-white font-bold shadow-md shadow-purple-600/20"
                      : isDark
                      ? "bg-[#1f1f26] text-gray-300 hover:bg-[#282832]"
                      : "bg-[#f8f9fb] text-slate-600 border border-[#eaecf2] hover:border-purple-200 hover:text-[#7922f5]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Secondary Filters */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-center">
            {/* Search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by keyword / skill..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none ${
                  isDark
                    ? "bg-[#1d1d24] border-white/10 text-white placeholder-gray-500"
                    : "bg-[#f8f9fb] border-[#eaecf2] text-[#1e2433] placeholder-[#9aa0b4] focus:border-[#7922f5]"
                }`}
              />
            </div>

            {/* Company Dropdown */}
            <div className="flex items-center space-x-2">
              <span className={`text-xs whitespace-nowrap font-medium ${isDark ? "text-gray-400" : "text-[#9aa0b4]"}`}>Company:</span>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className={`w-full text-xs font-medium rounded-xl px-2.5 py-1.5 border focus:outline-none ${
                  isDark
                    ? "bg-[#1d1d24] border-white/10 text-white"
                    : "bg-[#f8f9fb] border-[#eaecf2] text-[#1e2433] focus:border-[#7922f5]"
                }`}
              >
                {COMPANIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Price Range Slider */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className={isDark ? "text-gray-400" : "text-[#9aa0b4]"}>Max Rate / slot:</span>
                <span className={`font-bold ${isDark ? "text-emerald-500" : "text-[#7922f5]"}`}>₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="800"
                max="3000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className={`w-full h-1.5 rounded-lg cursor-pointer ${isDark ? "accent-emerald-500 bg-gray-700" : "accent-[#7922f5] bg-slate-100"}`}
              />
            </div>

            {/* Employment Proof Checkbox */}
            <label className="flex items-center space-x-2 cursor-pointer select-none text-[11px] sm:text-xs">
              <input
                type="checkbox"
                checked={onlyVerifiedEmployment}
                onChange={(e) => setOnlyVerifiedEmployment(e.target.checked)}
                className={`w-4 h-4 rounded ${isDark ? "accent-emerald-500" : "accent-[#7922f5]"}`}
              />
              <span className={isDark ? "text-gray-300" : "text-slate-700 font-medium"}>
                🔒 Corporate Verified Only
              </span>
            </label>
          </div>
        </div>

        {/* Mentors Grid */}
        {filteredMentors.length === 0 ? (
          <div className={`text-center py-12 sm:py-16 rounded-3xl border ${
            isDark ? "bg-[#16161c] border-white/10" : "bg-white border-gray-200"
          }`}>
            <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm sm:text-base font-bold">No verified mentors found matching your filters</h3>
            <p className="text-xs text-gray-400 mt-1">Try relaxing your price range or search terms.</p>
            <button
              onClick={() => {
                onSelectCategory("All");
                setSelectedCompany("All");
                setMaxPrice(3000);
                onSearchChange("");
              }}
              className="mt-4 px-4 py-2 rounded-full text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredMentors.map((mentor) => {
              const startingService = mentor.services[0];
              const nextSlot = mentor.availability.find((s) => !s.isBooked);

              return (
                <div
                  key={mentor.id}
                  className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group space-y-4 ${
                    isDark
                      ? "bg-[#16161b] border-white/10 hover:border-emerald-500/40"
                      : "bg-white border-[#eef0f6] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-purple-200"
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Header with Avatar & Badges */}
                    <div className="flex items-start space-x-3.5">
                      <div className="relative shrink-0">
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-purple-50 group-hover:scale-105 transition-transform"
                        />
                        <div className={`absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full border-2 border-white shadow ${
                          isDark ? "bg-emerald-500 text-black" : "bg-[#7922f5] text-white"
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            isDark 
                              ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30" 
                              : "bg-[#f6f2fe] text-[#7922f5] border-purple-100"
                          }`}>
                            {mentor.company}
                          </span>
                          <span className="text-xs font-bold flex items-center text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                            {mentor.ratingAvg}
                            <span className="text-[10px] text-[#9aa0b4] font-normal ml-0.5">({mentor.totalReviews})</span>
                          </span>
                        </div>

                        <h3 className={`text-[15px] font-bold mt-1 truncate ${isDark ? "text-white" : "text-[#1e2433] group-hover:text-[#7922f5] transition-colors"}`}>
                          {mentor.name}
                        </h3>
                        <p className={`text-xs font-semibold truncate ${isDark ? "text-emerald-400" : "text-[#7922f5]"}`}>
                          {mentor.role}
                        </p>
                      </div>
                    </div>

                    {/* Bio snippet */}
                    <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? "text-gray-400" : "text-[#5a627a]"}`}>
                      {mentor.headline || mentor.bio}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {mentor.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                            isDark 
                              ? "bg-[#22222a] text-gray-300" 
                              : "bg-[#f8f9fb] border border-[#eaecf2] text-slate-600"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Next Available Slot Preview */}
                    <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                      isDark ? "bg-[#101014] border-white/5 text-gray-300" : "bg-[#f8f9fb] border-[#eaecf2] text-slate-600"
                    }`}>
                      <div className="flex items-center space-x-1.5 min-w-0 mr-2">
                        <Clock className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-emerald-500" : "text-[#7922f5]"}`} />
                        <span className="text-[11px] font-medium truncate">
                          {nextSlot ? nextSlot.localTimeDisplay : "Custom slot on request"}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold shrink-0 ${isDark ? "text-emerald-400" : "text-[#7922f5]"}`}>
                        ⚡ 10m Hold
                      </span>
                    </div>
                  </div>

                  {/* Bottom Price & Booking Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-[#9aa0b4] block leading-tight">Starting at</span>
                      <p className={`text-base font-extrabold ${isDark ? "text-white" : "text-[#1e2433]"}`}>
                        ₹{startingService ? startingService.priceINR : mentor.hourlyRateINR}
                        <span className="text-[10px] font-normal text-[#9aa0b4] ml-0.5">
                          /{startingService ? `${startingService.durationMinutes}m` : "hr"}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      <button
                        onClick={() => onSelectMentor(mentor)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isDark
                            ? "border-white/15 hover:bg-white/10 text-gray-200"
                            : "border-[#e2e8f0] hover:bg-slate-50 text-[#8a92a6] hover:text-[#1e2433]"
                        }`}
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => onQuickBook(mentor)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center space-x-1 ${
                          isDark
                            ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20"
                            : "bg-[#7922f5] hover:bg-[#6819d4] text-white shadow-purple-600/20"
                        }`}
                      >
                        <span>Book 1:1</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
