"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Mentor, UserRole } from "@/types";
import { useMentors } from "@/hooks/useQueries";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSearchTerm as setSearchTermAction,
  setSelectedCategory as setSelectedCategoryAction,
  setSelectedCompany as setSelectedCompanyAction,
  setMaxPrice as setMaxPriceAction,
  setMinRating as setMinRatingAction,
  setMinExperience as setMinExperienceAction,
  setOnlyWithSlots as setOnlyWithSlotsAction,
  setOnlyVerifiedCorporate as setOnlyVerifiedCorporateAction,
  setSortBy as setSortByAction,
  setViewMode as setViewModeAction,
  resetFilters as resetFiltersAction,
} from "@/store/slices/filterSlice";
import { addToast } from "@/store/slices/uiSlice";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MentorDetailModal } from "@/components/MentorDetailModal";
import { BookingFlowModal } from "@/components/BookingFlowModal";
import { VerificationPortalModal } from "@/components/VerificationPortalModal";
import { AdminVerificationDashboard } from "@/components/AdminVerificationDashboard";
import { StudentCareerLoop } from "@/components/StudentCareerLoop";
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  Clock, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  LayoutGrid, 
  ListFilter, 
  RotateCcw, 
  Loader2, 
  AlertCircle,
  Briefcase,
  Sparkles,
  Check,
  Compass
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Engineering & Technology",
  "Computer Science & IT",
  "Commerce & Finance",
  "Business & Management",
  "Arts & Humanities",
  "Pure & Applied Science",
  "Medical & Healthcare",
  "Law & Legal Studies",
  "Design & Creative Arts",
  "Architecture & Planning",
  "Media & Communication",
  "Education & Teaching",
  "Placement Prep",
];

const COMPANIES = [
  "All",
  "Google",
  "Goldman Sachs",
  "McKinsey & Company",
  "Stripe",
  "Microsoft",
  "Apple",
  "Amazon",
  "Meta",
  "Uber",
];

const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended" },
  { id: "rating-high", label: "Highest Rated (★ 5.0)" },
  { id: "reviews-most", label: "Most Reviewed" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "experience", label: "Most Experienced" },
];

function MentorsDirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL Query Parameters initialization
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";
  const initialCompany = searchParams.get("company") || "All";

  const [activeRole, setActiveRole] = useState<UserRole>("STUDENT");

  // Redux Toolkit Client State
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const {
    searchTerm,
    selectedCategory,
    selectedCompany,
    maxPrice,
    minRating,
    minExperience,
    onlyWithSlots,
    onlyVerifiedCorporate,
    sortBy,
    viewMode,
  } = filters;

  // Setters bound to Redux actions
  const setSearchTerm = (val: string): void => { dispatch(setSearchTermAction(val)); };
  const setSelectedCategory = (val: string): void => { dispatch(setSelectedCategoryAction(val)); };
  const setSelectedCompany = (val: string): void => { dispatch(setSelectedCompanyAction(val)); };
  const setMaxPrice = (val: number): void => { dispatch(setMaxPriceAction(val)); };
  const setMinRating = (val: number): void => { dispatch(setMinRatingAction(val)); };
  const setMinExperience = (val: number): void => { dispatch(setMinExperienceAction(val)); };
  const setOnlyWithSlots = (val: boolean): void => { dispatch(setOnlyWithSlotsAction(val)); };
  const setOnlyVerifiedCorporate = (val: boolean): void => { dispatch(setOnlyVerifiedCorporateAction(val)); };
  const setSortBy = (val: string): void => { dispatch(setSortByAction(val)); };
  const setViewMode = (val: "grid" | "list"): void => { dispatch(setViewModeAction(val)); };
  const resetFilters = (): void => { dispatch(resetFiltersAction()); };

  // TanStack Query for Mentors Directory (Server State)
  const { 
    data: mentors = [], 
    isLoading: loading, 
    error: queryErrorObj, 
    refetch: fetchMentors 
  } = useMentors();

  const error = queryErrorObj ? (queryErrorObj as Error).message : null;

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Modals State
  const [inspectingMentor, setInspectingMentor] = useState<Mentor | null>(null);
  const [bookingMentor, setBookingMentor] = useState<Mentor | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isCareerLoopModalOpen, setIsCareerLoopModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Update query state if URL params change
  useEffect(() => {
    if (initialSearch) setSearchTerm(initialSearch);
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialCompany) setSelectedCompany(initialCompany);
  }, [initialSearch, initialCategory, initialCompany]);

  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(msg);
    dispatch(addToast({ message: msg, type }));
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filter and Sort Logic
  const filteredAndSortedMentors = useMemo(() => {
    let result = [...mentors];

    // 1. Search Query Match
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          m.company.toLowerCase().includes(q) ||
          m.headline.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // 2. Category Match
    if (selectedCategory !== "All") {
      result = result.filter((m) => m.category === selectedCategory);
    }

    // 3. Company Match
    if (selectedCompany !== "All") {
      result = result.filter((m) => m.company.toLowerCase() === selectedCompany.toLowerCase());
    }

    // 4. Max Price Filter
    result = result.filter((m) => m.hourlyRateINR <= maxPrice);

    // 5. Min Rating Filter
    if (minRating > 0) {
      result = result.filter((m) => m.ratingAvg >= minRating);
    }

    // 6. Experience Filter
    if (minExperience > 0) {
      result = result.filter((m) => m.experienceYears >= minExperience);
    }

    // 7. Open Slots Filter
    if (onlyWithSlots) {
      result = result.filter((m) => m.availability && m.availability.some((s) => !s.isBooked));
    }

    // 8. Corporate Verified Filter
    if (onlyVerifiedCorporate) {
      result = result.filter((m) => m.verificationStatus === "VERIFIED" || m.verificationBadges?.emailVerified);
    }

    // Sorting
    switch (sortBy) {
      case "rating-high":
        result.sort((a, b) => b.ratingAvg - a.ratingAvg);
        break;
      case "reviews-most":
        result.sort((a, b) => b.totalReviews - a.totalReviews);
        break;
      case "price-low":
        result.sort((a, b) => a.hourlyRateINR - b.hourlyRateINR);
        break;
      case "price-high":
        result.sort((a, b) => b.hourlyRateINR - a.hourlyRateINR);
        break;
      case "experience":
        result.sort((a, b) => b.experienceYears - a.experienceYears);
        break;
      case "recommended":
      default:
        result.sort((a, b) => b.ratingAvg * Math.log10(b.totalReviews + 1) - a.ratingAvg * Math.log10(a.totalReviews + 1));
        break;
    }

    return result;
  }, [
    mentors,
    searchTerm,
    selectedCategory,
    selectedCompany,
    maxPrice,
    minRating,
    minExperience,
    onlyWithSlots,
    onlyVerifiedCorporate,
    sortBy,
  ]);

  const resetAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedCompany("All");
    setMaxPrice(3000);
    setMinRating(0);
    setMinExperience(0);
    setOnlyWithSlots(false);
    setOnlyVerifiedCorporate(false);
    setSortBy("recommended");
  };

  const activeFiltersCount = [
    searchTerm !== "",
    selectedCategory !== "All",
    selectedCompany !== "All",
    maxPrice < 3000,
    minRating > 0,
    minExperience > 0,
    onlyWithSlots,
    onlyVerifiedCorporate,
  ].filter(Boolean).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#1e293b] font-sans antialiased selection:bg-purple-100 selection:text-purple-700 flex flex-col justify-between">
      <div>
        {/* Toast Banner */}
        {toastMessage && (
          <div className="fixed top-20 right-4 z-50 max-w-md bg-[#7922f5] text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between space-x-3 animate-slideIn font-medium text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-white/10 rounded-full text-white/80">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Navbar */}
        <Navbar
          isDark={false}
          activeRole={activeRole}
          onRoleChange={setActiveRole}
          onOpenVerification={() => setIsVerificationModalOpen(true)}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
          onOpenActionPlan={() => setIsCareerLoopModalOpen(true)}
          onScrollToDirectory={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />

        {/* Hero Header Banner */}
        <div className="bg-white border-b border-[#eaecf2] py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            
            {/* Breadcrumb & Verification Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-1.5 text-xs text-[#94a3b8] font-medium">
                <Link href="/dashboard" className="hover:text-[#7922f5] transition-colors">Students</Link>
                <span className="text-[#cbd5e1]">/</span>
                <span className="text-[#1e2433] font-semibold">Find Mentors</span>
              </div>

              <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#f6f2fe] border border-purple-100 text-[#7922f5] text-xs font-bold shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Background-Verified Mentors</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#1e2433] tracking-tight">
                  Browse & Connect with Verified Mentors
                </h1>
                <p className="text-xs sm:text-sm text-[#5a627a] mt-1 max-w-2xl font-medium">
                  Book 1:1 roadmap sessions, portfolio roasts, and mock interviews with senior leaders across engineering, finance, medical, design, and all academic domains.
                </p>
              </div>

              {/* Pill Search Input */}
              <form onSubmit={handleSearchSubmit} className="w-full md:w-80 flex items-center bg-[#f4f5fa] border border-[#eceff5] rounded-full px-4 py-2.5 focus-within:border-[#7922f5] focus-within:bg-white transition-all shadow-none">
                <Search className="w-4 h-4 text-[#9aa0b4] mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search skills, companies, roles..."
                  className="w-full bg-transparent text-xs text-[#1e2433] placeholder-[#9aa0b4] focus:outline-none font-medium"
                />
                {searchTerm && (
                  <button type="button" onClick={() => setSearchTerm("")} className="text-[#9aa0b4] hover:text-slate-800 p-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Main Content Layout (Filter Sidebar + Results Grid) */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT FILTER SIDEBAR (Desktop) */}
            <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#1e2433]">
                  <SlidersHorizontal className="w-4 h-4 text-[#7922f5]" />
                  <span>Filter Directory</span>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetAllFilters}
                    className="flex items-center space-x-1 text-[11px] text-[#7922f5] hover:underline font-bold transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* 1. Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1e2433] uppercase tracking-wider block">Category & Field</label>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                        selectedCategory === cat
                          ? "bg-[#7922f5] text-white font-bold shadow-sm shadow-purple-600/20"
                          : "text-slate-600 hover:bg-purple-50 hover:text-[#7922f5]"
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      {selectedCategory === cat && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Top Companies Filter */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-[#1e2433] uppercase tracking-wider block">Top Organizations</label>
                <div className="flex flex-wrap gap-1.5">
                  {COMPANIES.map((comp) => (
                    <button
                      key={comp}
                      onClick={() => setSelectedCompany(comp)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                        selectedCompany === comp
                          ? "bg-purple-50 border-[#7922f5] text-[#7922f5] font-bold"
                          : "bg-[#f8f9fb] border-[#eaecf2] text-slate-600 hover:border-purple-200"
                      }`}
                    >
                      {comp}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Hourly Rate Range Slider */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">Max Session Rate</span>
                  <span className="text-[#7922f5] font-bold">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#7922f5] bg-slate-100 h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#9aa0b4] font-mono">
                  <span>₹500</span>
                  <span>₹1,500</span>
                  <span>₹3,000</span>
                </div>
              </div>

              {/* 4. Minimum Rating Filter */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-[#1e2433] uppercase tracking-wider block">Minimum Rating</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 4.5, 4.8, 4.9].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        minRating === rating
                          ? "bg-purple-50 border-[#7922f5] text-[#7922f5]"
                          : "bg-[#f8f9fb] border-[#eaecf2] text-slate-600 hover:border-purple-200"
                      }`}
                    >
                      {rating === 0 ? "Any" : `★ ${rating}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Minimum Experience */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-[#1e2433] uppercase tracking-wider block">Experience</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: "All", val: 0 },
                    { label: "3+ yrs", val: 3 },
                    { label: "6+ yrs", val: 6 },
                  ].map((exp) => (
                    <button
                      key={exp.val}
                      onClick={() => setMinExperience(exp.val)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        minExperience === exp.val
                          ? "bg-purple-50 border-[#7922f5] text-[#7922f5]"
                          : "bg-[#f8f9fb] border-[#eaecf2] text-slate-600 hover:border-purple-200"
                      }`}
                    >
                      {exp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Checkbox Toggles */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-700 font-medium">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyWithSlots}
                    onChange={(e) => setOnlyWithSlots(e.target.checked)}
                    className="rounded accent-[#7922f5] w-4 h-4"
                  />
                  <span>Has Open Slots This Week</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyVerifiedCorporate}
                    onChange={(e) => setOnlyVerifiedCorporate(e.target.checked)}
                    className="rounded accent-[#7922f5] w-4 h-4"
                  />
                  <span>Verified Corporate Only</span>
                </label>
              </div>
            </aside>

            {/* RIGHT RESULTS SECTION */}
            <div className="col-span-1 lg:col-span-9 space-y-6">
              
              {/* Controls Bar: Results Count, Active Tags, Sorting, View Toggle */}
              <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                    className="lg:hidden px-3 py-1.5 bg-purple-50 text-[#7922f5] rounded-xl text-xs font-bold flex items-center space-x-1.5"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filters ({activeFiltersCount})</span>
                  </button>

                  <div className="text-xs text-[#9aa0b4] font-medium">
                    Showing <strong className="text-[#1e2433]">{filteredAndSortedMentors.length}</strong> verified mentor{filteredAndSortedMentors.length === 1 ? "" : "s"}
                  </div>
                </div>

                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end space-x-3">
                  {/* Sorting Menu */}
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-[#9aa0b4] hidden xs:inline font-medium">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-[#f8f9fb] border border-[#eaecf2] rounded-xl px-3 py-1.5 text-xs text-[#1e2433] font-medium focus:outline-none focus:border-[#7922f5] cursor-pointer"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-[#f8f9fb] border border-[#eaecf2] rounded-xl p-0.5">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === "grid" ? "bg-[#7922f5] text-white shadow-sm" : "text-[#9aa0b4] hover:text-[#1e2433]"
                      }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === "list" ? "bg-[#7922f5] text-white shadow-sm" : "text-[#9aa0b4] hover:text-[#1e2433]"
                      }`}
                      title="List View"
                    >
                      <ListFilter className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Collapsible Filters */}
              {isMobileFiltersOpen && (
                <div className="lg:hidden bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1e2433] uppercase tracking-wider">Active Filters</span>
                    <button onClick={resetAllFilters} className="text-xs text-[#7922f5] font-bold">Reset All</button>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-[#f8f9fb] border border-[#eaecf2] rounded-xl p-2 text-xs text-slate-800"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Target Company</label>
                    <select
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      className="w-full bg-[#f8f9fb] border border-[#eaecf2] rounded-xl p-2 text-xs text-slate-800"
                    >
                      {COMPANIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Max Rate</span>
                      <span className="text-[#7922f5] font-bold">₹{maxPrice}</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="3000"
                      step="100"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#7922f5]"
                    />
                  </div>
                </div>
              )}

              {/* LOADING SKELETON */}
              {loading ? (
                <div className="py-24 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-8 h-8 text-[#7922f5] animate-spin" />
                  <p className="text-xs text-[#9aa0b4] font-semibold tracking-wider">Loading verified mentors directory...</p>
                </div>
              ) : error ? (
                <div className="p-8 rounded-3xl bg-rose-50 border border-rose-100 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                  <p className="text-sm font-bold text-rose-700">{error}</p>
                  <button onClick={() => fetchMentors()} className="px-5 py-2 bg-[#7922f5] text-white text-xs font-bold rounded-xl shadow-sm">
                    Retry Loading
                  </button>
                </div>
              ) : filteredAndSortedMentors.length === 0 ? (
                /* EMPTY SEARCH STATE */
                <div className="p-12 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto text-[#7922f5]">
                    <Search className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#1e2433]">No Verified Mentors Match Your Criteria</h3>
                    <p className="text-xs text-[#5a627a] max-w-md mx-auto">
                      Try adjusting your budget, selecting "All" categories, or resetting active filters to view all verified experts.
                    </p>
                  </div>
                  <button
                    onClick={resetAllFilters}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear All Filters</span>
                  </button>
                </div>
              ) : (
                /* MENTORS RESULTS CONTAINER */
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" : "space-y-4"}>
                  {filteredAndSortedMentors.map((mentor) => {
                    const availableSlots = mentor.availability.filter((s) => !s.isBooked);

                    if (viewMode === "list") {
                      /* LIST VIEW CARD */
                      return (
                        <div
                          key={mentor.id}
                          className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] hover:border-purple-200 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
                        >
                          <div className="flex items-start space-x-4 min-w-0">
                            <div className="relative shrink-0">
                              <img
                                src={mentor.avatar}
                                alt={mentor.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-purple-50 group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#7922f5] text-white flex items-center justify-center border-2 border-white">
                                <ShieldCheck className="w-2.5 h-2.5" />
                              </div>
                            </div>
                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-bold text-[#1e2433] group-hover:text-[#7922f5] transition-colors">
                                  {mentor.name}
                                </h3>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f6f2fe] text-[#7922f5] border border-purple-100">
                                  {mentor.company}
                                </span>
                              </div>
                              <p className="text-xs text-[#5a627a] line-clamp-1">{mentor.headline}</p>
                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                                <span className="flex items-center space-x-1 text-amber-500 font-bold">
                                  <Star className="w-3 h-3 fill-amber-400" />
                                  <span>{mentor.ratingAvg} ({mentor.totalReviews})</span>
                                </span>
                                <span>•</span>
                                <span className="flex items-center space-x-1">
                                  <Briefcase className="w-3 h-3 text-[#7922f5]" />
                                  <span>{mentor.experienceYears} yrs exp</span>
                                </span>
                                <span>•</span>
                                <span className="flex items-center space-x-1 text-[#7922f5] font-medium">
                                  <Clock className="w-3 h-3" />
                                  <span>{availableSlots.length} open slot{availableSlots.length === 1 ? "" : "s"}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Price and CTA */}
                          <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                            <div className="text-left md:text-right">
                              <div className="text-base font-black text-[#1e2433]">₹{mentor.hourlyRateINR}</div>
                              <div className="text-[10px] text-[#9aa0b4]">starts per session</div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setInspectingMentor(mentor)}
                                className="px-3.5 py-2 rounded-xl border border-[#e2e8f0] hover:bg-slate-50 text-[#8a92a6] hover:text-slate-800 text-xs font-semibold transition-all"
                              >
                                View Profile
                              </button>
                              <button
                                onClick={() => setBookingMentor(mentor)}
                                className="px-4 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-transform active:scale-95 flex items-center space-x-1"
                              >
                                <span>Book Call</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    /* GRID VIEW CARD */
                    return (
                      <div
                        key={mentor.id}
                        className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] hover:border-purple-200 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group space-y-4"
                      >
                        <div className="space-y-3.5">
                          {/* Card Header: Avatar, Name, Company Badge */}
                          <div className="flex items-start space-x-3.5">
                            <div className="relative shrink-0">
                              <img
                                src={mentor.avatar}
                                alt={mentor.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-purple-50 group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#7922f5] text-white flex items-center justify-center border-2 border-white">
                                <ShieldCheck className="w-2.5 h-2.5" />
                              </div>
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center space-x-1.5">
                                <h3 className="text-[15px] font-bold text-[#1e2433] truncate group-hover:text-[#7922f5] transition-colors">
                                  {mentor.name}
                                </h3>
                              </div>
                              <p className="text-xs text-[#7922f5] font-semibold truncate">{mentor.role} @ {mentor.company}</p>
                              <div className="flex items-center space-x-1 text-[11px] text-amber-500 font-bold pt-0.5">
                                <Star className="w-3 h-3 fill-amber-400" />
                                <span>{mentor.ratingAvg}</span>
                                <span className="text-[#9aa0b4] font-normal">({mentor.totalReviews} reviews)</span>
                              </div>
                            </div>
                          </div>

                          {/* Bio / Headline */}
                          <p className="text-xs text-[#5a627a] line-clamp-2 leading-relaxed">
                            {mentor.headline}
                          </p>

                          {/* Skills / Tags */}
                          <div className="flex flex-wrap gap-1.5">
                            {mentor.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-[#f8f9fb] border border-[#eaecf2] text-[10px] text-slate-600 font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Available Slots Badge */}
                          <div className="p-2.5 rounded-xl bg-[#f8f9fb] border border-[#eaecf2] text-[11px] flex items-center justify-between text-slate-600">
                            <span className="flex items-center space-x-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#7922f5]" />
                              <span>{availableSlots.length > 0 ? `${availableSlots.length} open slots this week` : "Slots by request"}</span>
                            </span>
                            <span className="text-[10px] font-mono text-[#7922f5] font-bold">10m Hold</span>
                          </div>
                        </div>

                        {/* Card Footer: Price & Book Actions */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <div className="text-base font-black text-[#1e2433]">₹{mentor.hourlyRateINR}</div>
                            <div className="text-[9px] text-[#9aa0b4]">starts per session</div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setInspectingMentor(mentor)}
                              className="px-3.5 py-1.5 rounded-xl border border-[#e2e8f0] hover:bg-slate-50 text-[#8a92a6] hover:text-[#1e2433] text-xs font-semibold transition-all"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => setBookingMentor(mentor)}
                              className="px-4 py-1.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all active:scale-95 flex items-center space-x-1"
                            >
                              <span>Book</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer
        isDark={false}
        onOpenVerification={() => setIsVerificationModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />

      {/* MODALS */}
      {/* 1. Mentor Detail Modal */}
      <MentorDetailModal
        mentor={inspectingMentor}
        isOpen={!!inspectingMentor}
        onClose={() => setInspectingMentor(null)}
        isDark={false}
        onBookNow={(m) => {
          setInspectingMentor(null);
          setBookingMentor(m);
        }}
      />

      {/* 2. Concurrency Slot Hold & Razorpay Checkout Modal */}
      <BookingFlowModal
        mentor={bookingMentor}
        isOpen={!!bookingMentor}
        onClose={() => setBookingMentor(null)}
        isDark={false}
        onBookingSuccess={() => {
          fetchMentors();
          showToast("🎉 Booking confirmed! Meeting link has been created.");
        }}
      />

      {/* 3. Verification Modal */}
      <VerificationPortalModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        isDark={false}
        onSubmitApplication={() => showToast("Application submitted for KYC approval.")}
      />

      {/* 4. Admin Verification Console */}
      <AdminVerificationDashboard
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isDark={false}
        pendingMentors={[]}
        onApproveMentor={() => {}}
        onRejectMentor={() => {}}
        auditLogs={[]}
      />

      {/* 5. Student Career Outcome Loop Modal */}
      <StudentCareerLoop
        isOpen={isCareerLoopModalOpen}
        onClose={() => setIsCareerLoopModalOpen(false)}
        isDark={false}
        onExploreMentors={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
    </div>
  );
}

export default function MentorsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center text-slate-800">
        <Loader2 className="w-8 h-8 text-[#7922f5] animate-spin" />
      </div>
    }>
      <MentorsDirectoryContent />
    </Suspense>
  );
}
