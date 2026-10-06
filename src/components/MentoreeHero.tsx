"use client";

import React, { useState } from "react";
import { Mentor } from "@/types";
import { 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  ChevronDown
} from "lucide-react";

interface MentoreeHeroProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  onSearch: (term: string) => void;
  onSelectMentor: (mentor: Mentor) => void;
  mentors: Mentor[];
  onOpenVerification: () => void;
  onScrollToDirectory: () => void;
}

const DOMAIN_TAGS = [
  "All",
  "Education",
  "Entrepreneurship",
  "Arts/creative",
  "Media/production",
  "Law",
  "IT Services",
  "Health Care",
  "Finance",
  "HR",
  "Placement Prep",
];

export const MentoreeHero: React.FC<MentoreeHeroProps> = ({
  onSelectCategory,
  selectedCategory,
  onSearch,
  onSelectMentor,
  mentors,
  onOpenVerification,
  onScrollToDirectory,
}) => {
  const [domainDropdown, setDomainDropdown] = useState("Education");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDomainMenu, setShowDomainMenu] = useState(false);

  const kathryn = mentors.find((m) => m.name.includes("Kathryn")) || mentors[0];
  const savannah = mentors.find((m) => m.name.includes("Savannah")) || mentors[1];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    onScrollToDirectory();
  };

  return (
    <div className="relative bg-[#e6f4f1] overflow-hidden pt-4 sm:pt-6 pb-14 sm:pb-20 border-b border-teal-100">
      {/* Background subtle mesh decoration */}
      <div className="absolute inset-0 bg-mesh-mentoree pointer-events-none opacity-80" />

      {/* Floating Avatar Micro-Badges (Visible on larger screens) */}
      <div className="hidden xl:block absolute top-16 left-12 animate-float-slow">
        <div className="relative group cursor-pointer" onClick={() => onSelectMentor(kathryn)}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="Mentor avatar"
            className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
          />
          <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
          </span>
        </div>
      </div>

      <div className="hidden xl:block absolute top-40 right-20 animate-float-delayed">
        <div className="relative group cursor-pointer" onClick={() => onSelectMentor(savannah)}>
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
            alt="Mentor avatar"
            className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
          />
          <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
            VP
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 relative z-10">
        {/* Domain Category Filter Tabs (Horizontally scrollable with smooth touch) */}
        <div className="flex items-center sm:justify-center space-x-1.5 sm:space-x-2 overflow-x-auto pb-3 sm:pb-4 scrollbar-none px-1">
          {DOMAIN_TAGS.map((tag) => {
            const isSelected = selectedCategory.toLowerCase() === tag.toLowerCase() || (tag === "All" && selectedCategory === "All");
            return (
              <button
                key={tag}
                onClick={() => onSelectCategory(tag)}
                className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? "bg-[#14b8a6] text-white shadow-sm font-semibold"
                    : "bg-white/80 text-gray-600 hover:bg-white hover:text-gray-900 border border-teal-100"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Hero Title & Pitch */}
        <div className="text-center mt-5 sm:mt-8 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#134e4a] tracking-tight leading-tight font-sans">
            Having a Guide Can Make <br className="hidden xs:inline" />
            All the <span className="text-[#ff6b4a] underline decoration-wavy decoration-teal-300 decoration-2">Difference</span>.
          </h1>
          <p className="mt-3 sm:mt-4 text-xs sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Search amazing verified individuals around the globe, find a mentor from top product firms, expand your network, and learn practical career strategies!
          </p>

          {/* Integrated Responsive Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="mt-5 sm:mt-7 max-w-2xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl sm:rounded-full p-2 shadow-xl shadow-teal-900/5 border border-teal-100 gap-2 sm:gap-0"
          >
            {/* Domain Dropdown */}
            <div className="relative flex justify-between items-center sm:justify-start px-2 sm:px-0">
              <button
                type="button"
                onClick={() => setShowDomainMenu(!showDomainMenu)}
                className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 text-xs font-semibold text-gray-700 hover:text-teal-700 rounded-xl sm:rounded-full hover:bg-gray-50 transition-colors"
              >
                <span>{domainDropdown}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {showDomainMenu && (
                <div className="absolute left-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-30 text-left">
                  {["Education", "Engineering", "Product", "Design", "Placement Prep", "Finance"].map((dom) => (
                    <button
                      key={dom}
                      type="button"
                      onClick={() => {
                        setDomainDropdown(dom);
                        onSelectCategory(dom === "Engineering" ? "Engineering" : dom);
                        setShowDomainMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-teal-50 hover:text-teal-800"
                    >
                      {dom}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden sm:block h-6 w-[1px] bg-gray-200 mx-1" />

            {/* Search Input */}
            <div className="flex-1 flex items-center px-3 py-1 sm:py-0 border-y sm:border-y-0 border-gray-100">
              <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search mentor, company (Google, Stripe), skill..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  onSearch(e.target.value);
                }}
                className="w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
              />
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-5 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center space-x-1 shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <span>Search</span>
            </button>
          </form>

          {/* Quick Pill Action */}
          <div className="mt-4 sm:mt-5 flex items-center justify-center space-x-3">
            <button
              onClick={onScrollToDirectory}
              className="inline-flex items-center space-x-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#06b6d4] hover:bg-[#0891b2] text-white text-xs sm:text-sm font-bold shadow-md shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <span>Browse all Mentors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Floating Featured Mentor Cards Showcase (Responsive 1-col on mobile, 2-col on tablet/desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-12 max-w-4xl mx-auto">
          {/* Mentor 1 Card - Kathryn Murphy */}
          {kathryn && (
            <div 
              onClick={() => onSelectMentor(kathryn)}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg border border-white hover:border-teal-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer relative overflow-hidden group"
            >
              <div className="flex items-start space-x-3.5 sm:space-x-4">
                <div className="relative shrink-0">
                  <img
                    src={kathryn.avatar}
                    alt={kathryn.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white p-0.5 sm:p-1 rounded-full border-2 border-white shadow">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 truncate">
                      👥 {kathryn.totalMenteesHelped}+ Mentees
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-gray-500 flex items-center shrink-0">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400 mr-0.5" />
                      {kathryn.ratingAvg}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mt-1 flex items-center space-x-1 truncate">
                    <span>{kathryn.name}</span>
                    <span className="text-xs">🇮🇳</span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-teal-700 font-medium truncate">
                    {kathryn.role} @ <strong className="text-gray-900">{kathryn.company}</strong>
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1 line-clamp-1">
                    {kathryn.tags.slice(0, 3).join(" • ")}
                  </p>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-semibold block">Verified Rate</span>
                  <p className="text-xs sm:text-sm font-extrabold text-gray-900">
                    ₹{kathryn.services[0]?.priceINR || kathryn.hourlyRateINR} <span className="text-[10px] sm:text-xs font-normal text-gray-500">/ 30m</span>
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMentor(kathryn);
                  }}
                  className="px-3 sm:px-3.5 py-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Book 1:1 Call →
                </button>
              </div>
            </div>
          )}

          {/* Mentor 2 Card - Savannah Nguyen */}
          {savannah && (
            <div 
              onClick={() => onSelectMentor(savannah)}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg border border-white hover:border-teal-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer relative overflow-hidden group"
            >
              <div className="flex items-start space-x-3.5 sm:space-x-4">
                <div className="relative shrink-0">
                  <img
                    src={savannah.avatar}
                    alt={savannah.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 sm:p-1 rounded-full border-2 border-white shadow">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 truncate">
                      👥 {savannah.totalMenteesHelped}+ Mentees
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-gray-500 flex items-center shrink-0">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400 mr-0.5" />
                      {savannah.ratingAvg}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mt-1 flex items-center space-x-1 truncate">
                    <span>{savannah.name}</span>
                    <span className="text-xs">🇨🇦</span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-emerald-700 font-medium truncate">
                    {savannah.role} @ <strong className="text-gray-900">{savannah.company}</strong>
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1 line-clamp-1">
                    {savannah.tags.slice(0, 3).join(" • ")}
                  </p>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-semibold block">Verified Rate</span>
                  <p className="text-xs sm:text-sm font-extrabold text-gray-900">
                    ₹{savannah.services[0]?.priceINR || savannah.hourlyRateINR} <span className="text-[10px] sm:text-xs font-normal text-gray-500">/ 30m</span>
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMentor(savannah);
                  }}
                  className="px-3 sm:px-3.5 py-1.5 rounded-full bg-[#0f766e] hover:bg-teal-900 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Book 1:1 Call →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dual Cards Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-10 max-w-4xl mx-auto">
          {/* Find a Mentor Card */}
          <div 
            onClick={onScrollToDirectory}
            className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-md border border-teal-100 flex items-center justify-between cursor-pointer hover:shadow-xl hover:border-teal-300 transition-all group"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Find a mentor"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover border border-teal-100 shrink-0"
              />
              <div>
                <h4 className="text-sm sm:text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                  Find a Mentor
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-500">Filter by company, mock interviews & DSA</p>
                <span className="text-[11px] sm:text-xs font-semibold text-teal-600 inline-block mt-0.5">Register now →</span>
              </div>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors shrink-0">
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>

          {/* Become a Mentor Card */}
          <div 
            onClick={onOpenVerification}
            className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-md border border-teal-100 flex items-center justify-between cursor-pointer hover:shadow-xl hover:border-emerald-300 transition-all group"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="Become a mentor"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover border border-emerald-100 shrink-0"
              />
              <div>
                <h4 className="text-sm sm:text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  Become a Mentor
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-500">Monetize your expertise (80% mentor payout)</p>
                <span className="text-[11px] sm:text-xs font-semibold text-emerald-600 inline-block mt-0.5">Get Started & Verify →</span>
              </div>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
