"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserRole } from "@/types";
import { 
  ShieldCheck, 
  Sparkles, 
  ChevronDown,
  LayoutDashboard,
  CalendarCheck,
  Menu,
  X,
  Compass,
  ArrowRight,
  User,
  Bookmark,
  LogIn,
  LogOut
} from "lucide-react";

interface NavbarProps {
  currentTheme?: "mentoree" | "mentors";
  isDark?: boolean;
  onThemeToggle?: () => void;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenVerification: () => void;
  onOpenAdmin: () => void;
  onOpenActionPlan: () => void;
  onScrollToDirectory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDark = false,
  activeRole,
  onRoleChange,
  onOpenVerification,
  onOpenAdmin,
  onOpenActionPlan,
  onScrollToDirectory,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  return (
    <header className={`sticky top-0 z-40 w-full transition-colors duration-300 ${
      isDark 
        ? "bg-[#0f0f11]/90 backdrop-blur-md border-b border-white/10 text-white" 
        : "bg-white/95 backdrop-blur-md border-b border-[#eaecf2] text-[#1e2433]"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          {/* Brand Logo - Sp!k Light / Dark Luxe */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <Link 
              href="/dashboard"
              className="flex items-center space-x-2.5 cursor-pointer select-none group"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg transition-transform group-hover:scale-105 ${
                isDark 
                  ? "bg-gradient-to-tr from-emerald-500 to-teal-400 text-black shadow-lg shadow-emerald-500/20" 
                  : "bg-gradient-to-tr from-[#7922f5] to-indigo-600 text-white shadow-md shadow-purple-600/25"
              }`}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className={`font-black tracking-tight text-xl font-sans ${
                  isDark 
                    ? "bg-gradient-to-r from-white via-gray-100 to-emerald-400 bg-clip-text text-transparent" 
                    : "text-[#1e2433]"
                }`}>
                  sp<span className="text-[#7922f5]">!</span>k
                </span>
                <span className={`text-[9px] uppercase tracking-widest font-bold -mt-1 hidden xs:inline ${
                  isDark ? "text-emerald-400" : "text-[#7922f5]"
                }`}>
                  Mentorship Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation links - Persona Adaptive */}
            <nav className="hidden lg:flex items-center space-x-1">
              {activeRole === "STUDENT" && (
                <>
                  <Link
                    href="/dashboard"
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isDark 
                        ? "hover:bg-white/10 text-gray-200 hover:text-white" 
                        : "hover:bg-purple-50 text-slate-700 hover:text-[#7922f5]"
                    }`}
                  >
                    <LayoutDashboard className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-emerald-400" : "text-[#7922f5]"}`} />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/mentors"
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isDark 
                        ? "bg-white/10 text-emerald-400 font-bold" 
                        : "bg-purple-50 text-[#7922f5] font-bold"
                    }`}
                  >
                    Find Mentors
                  </Link>
                  <Link
                    href="/student/profile"
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isDark 
                        ? "hover:bg-white/10 text-gray-300 hover:text-white" 
                        : "hover:bg-purple-50 text-slate-700 hover:text-[#7922f5]"
                    }`}
                  >
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/student/sessions"
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isDark 
                        ? "hover:bg-white/10 text-gray-300 hover:text-white" 
                        : "hover:bg-purple-50 text-slate-700 hover:text-[#7922f5]"
                    }`}
                  >
                    My Sessions
                  </Link>
                  <Link
                    href="/student/saved"
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isDark 
                        ? "hover:bg-white/10 text-gray-300 hover:text-white" 
                        : "hover:bg-purple-50 text-slate-700 hover:text-[#7922f5]"
                    }`}
                  >
                    Saved Mentors
                  </Link>
                  <Link
                    href="/student/payments"
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isDark 
                        ? "hover:bg-white/10 text-gray-300 hover:text-white" 
                        : "hover:bg-purple-50 text-slate-700 hover:text-[#7922f5]"
                    }`}
                  >
                    Payments
                  </Link>
                </>
              )}

              {activeRole === "MENTOR" && (
                <>
                  <Link
                    href="/mentor/dashboard"
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isDark 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                        : "bg-purple-50 text-[#7922f5] border border-purple-200"
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                    <span>Mentor Portal</span>
                  </Link>
                  <Link
                    href="/mentors"
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isDark 
                        ? "hover:bg-white/10 text-gray-300 hover:text-white" 
                        : "hover:bg-purple-50 text-slate-700 hover:text-[#7922f5]"
                    }`}
                  >
                    Browse Directory
                  </Link>
                </>
              )}

              {activeRole === "ADMIN" && (
                <>
                  <Link
                    href="/admin"
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isDark 
                        ? "bg-purple-500/10 text-purple-300 border border-purple-500/30" 
                        : "bg-purple-50 text-[#7922f5] border border-purple-200"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Admin Console</span>
                  </Link>
                  <Link
                    href="/mentors"
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isDark 
                        ? "hover:bg-white/10 text-gray-300 hover:text-white" 
                        : "hover:bg-purple-50 text-slate-700 hover:text-[#7922f5]"
                    }`}
                  >
                    Marketplace View
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-medium cursor-pointer transition-all ${
                  isDark 
                    ? "bg-[#18181c] border-white/15 text-gray-300 hover:border-white/30" 
                    : "bg-[#f8f9fb] border-[#eaecf2] text-slate-700 hover:border-[#7922f5]/30 hover:bg-slate-50"
                }`}
              >
                <div className={`w-2 h-2 rounded-full animate-ping ${
                  activeRole === "ADMIN" ? "bg-purple-500" : activeRole === "MENTOR" ? "bg-amber-500" : "bg-emerald-500"
                }`} />
                <span className={isDark ? "text-gray-400" : "text-slate-400"}>Role:</span>
                <strong className={`font-extrabold capitalize ${isDark ? "text-white" : "text-slate-900"}`}>{activeRole.toLowerCase()}</strong>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* Role Dropdown */}
              {showRoleDropdown && (
                <div className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl p-2 z-50 animate-scaleUp border ${
                  isDark 
                    ? "bg-[#16161e] border-white/15 text-white" 
                    : "bg-white border-slate-100 text-slate-900 shadow-xl"
                }`}>
                  <div className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold border-b ${
                    isDark ? "text-gray-400 border-white/10" : "text-slate-400 border-slate-100"
                  }`}>
                    Switch Platform Role
                  </div>

                  {/* 1. Student Option */}
                  <div className="mt-1 space-y-1">
                    <button
                      onClick={() => {
                        onRoleChange("STUDENT");
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        activeRole === "STUDENT" 
                          ? (isDark ? "bg-emerald-500/20 text-emerald-300 font-bold" : "bg-purple-50 text-[#7922f5] font-bold") 
                          : (isDark ? "hover:bg-white/5 text-gray-300" : "hover:bg-slate-50 text-slate-700")
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span>🎓</span>
                          <span className="font-bold">Student / Mentee</span>
                        </div>
                        <div className={`text-[10px] mt-0.5 ${isDark ? "text-gray-400" : "text-slate-400"}`}>Explore mentors, bookings & roadmap</div>
                      </div>
                      {activeRole === "STUDENT" && <span className={`text-[10px] font-mono ${isDark ? "text-emerald-400" : "text-[#7922f5]"}`}>Active</span>}
                    </button>
                    <Link
                      href="/dashboard"
                      onClick={() => setShowRoleDropdown(false)}
                      className={`block text-center py-1 text-[11px] hover:underline rounded-lg ${
                        isDark ? "text-emerald-400 bg-emerald-500/5" : "text-[#7922f5] bg-purple-50/50"
                      }`}
                    >
                      → Go to Student Portal
                    </Link>
                  </div>

                  {/* 2. Mentor Option */}
                  <div className={`mt-2 pt-2 border-t space-y-1 ${isDark ? "border-white/10" : "border-slate-100"}`}>
                    <button
                      onClick={() => {
                        onRoleChange("MENTOR");
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        activeRole === "MENTOR" 
                          ? (isDark ? "bg-amber-500/20 text-amber-300 font-bold" : "bg-purple-50 text-[#7922f5] font-bold") 
                          : (isDark ? "hover:bg-white/5 text-gray-300" : "hover:bg-slate-50 text-slate-700")
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span>⚡</span>
                          <span className="font-bold">Verified Mentor</span>
                        </div>
                        <div className={`text-[10px] mt-0.5 ${isDark ? "text-gray-400" : "text-slate-400"}`}>Manage slots, earnings & mentees</div>
                      </div>
                      {activeRole === "MENTOR" && <span className={`text-[10px] font-mono ${isDark ? "text-amber-400" : "text-[#7922f5]"}`}>Active</span>}
                    </button>
                    <Link
                      href="/mentor/dashboard"
                      onClick={() => setShowRoleDropdown(false)}
                      className={`block text-center py-1 text-[11px] hover:underline rounded-lg ${
                        isDark ? "text-amber-400 bg-amber-500/5" : "text-[#7922f5] bg-purple-50/50"
                      }`}
                    >
                      → Go to Mentor Dashboard
                    </Link>
                  </div>

                  {/* 3. Admin Option */}
                  <div className={`mt-2 pt-2 border-t space-y-1 ${isDark ? "border-white/10" : "border-slate-100"}`}>
                    <button
                      onClick={() => {
                        onRoleChange("ADMIN");
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        activeRole === "ADMIN" 
                          ? (isDark ? "bg-purple-500/20 text-purple-300 font-bold" : "bg-purple-50 text-[#7922f5] font-bold") 
                          : (isDark ? "hover:bg-white/5 text-gray-300" : "hover:bg-slate-50 text-slate-700")
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span>🛡️</span>
                          <span className="font-bold">Platform Super Admin</span>
                        </div>
                        <div className={`text-[10px] mt-0.5 ${isDark ? "text-gray-400" : "text-slate-400"}`}>KYC queue, dispute & audit ledgers</div>
                      </div>
                      {activeRole === "ADMIN" && <span className={`text-[10px] font-mono ${isDark ? "text-purple-400" : "text-[#7922f5]"}`}>Active</span>}
                    </button>
                    <Link
                      href="/admin"
                      onClick={() => setShowRoleDropdown(false)}
                      className={`block text-center py-1 text-[11px] hover:underline rounded-lg ${
                        isDark ? "text-purple-400 bg-purple-500/5" : "text-[#7922f5] bg-purple-50/50"
                      }`}
                    >
                      → Go to Admin Console
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Role-Specific Direct CTA Buttons */}
            {activeRole === "STUDENT" && (
              <Link
                href="/student/profile"
                className={`hidden md:flex items-center space-x-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-md active:scale-98 ${
                  isDark 
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-emerald-500/20" 
                    : "bg-[#7922f5] hover:bg-[#6819d4] text-white shadow-purple-600/20"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>My Profile</span>
              </Link>
            )}

            {activeRole === "MENTOR" && (
              <Link
                href="/mentor/dashboard"
                className={`hidden md:flex items-center space-x-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-md active:scale-98 ${
                  isDark 
                    ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-amber-400/20" 
                    : "bg-[#7922f5] hover:bg-[#6819d4] text-white shadow-purple-600/20"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Mentor Portal</span>
              </Link>
            )}

            {activeRole === "ADMIN" && (
              <Link
                href="/admin"
                className={`hidden md:flex items-center space-x-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-md active:scale-98 ${
                  isDark 
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-purple-500/20" 
                    : "bg-[#7922f5] hover:bg-[#6819d4] text-white shadow-purple-600/20"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Link>
            )}

            {/* Login / Auth Page Link */}
            <Link
              href="/login"
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isDark
                  ? "border-white/15 text-gray-300 hover:text-white hover:bg-white/10"
                  : "border-[#eaecf2] bg-white text-[#1e2433] hover:border-[#7922f5] hover:text-[#7922f5]"
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-[#7922f5]" />
              <span>Log In</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl border ${
                isDark 
                  ? "bg-white/5 border-white/10 text-gray-300 hover:text-white" 
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900"
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 space-y-3 animate-fadeIn bg-[#131317]">
            <nav className="flex flex-col space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-left hover:bg-white/5 text-emerald-400"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Student Dashboard</span>
              </Link>

              <Link
                href="/mentors"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-left hover:bg-white/5 text-gray-300"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Find Mentors</span>
              </Link>

              <Link
                href="/student/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-left hover:bg-white/5 text-gray-300"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span>My Profile (8 Tabs)</span>
              </Link>

              <Link
                href="/student/sessions"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-left hover:bg-white/5 text-gray-300"
              >
                <CalendarCheck className="w-4 h-4 text-emerald-400" />
                <span>My Sessions</span>
              </Link>

              <Link
                href="/student/saved"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-left hover:bg-white/5 text-gray-300"
              >
                <Bookmark className="w-4 h-4 text-emerald-400" />
                <span>Saved Mentors</span>
              </Link>

              <Link
                href="/student/payments"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-left hover:bg-white/5 text-gray-300"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Payments & Invoices</span>
              </Link>

              <div className="pt-2 border-t border-white/10 my-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">Other Portals</span>
              </div>

              <Link
                href="/mentor/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-left hover:bg-white/5 text-amber-400"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Mentor Operations Portal</span>
              </Link>

              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-left hover:bg-white/5 text-purple-400"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Admin Trust & Verification Console</span>
              </Link>
            </nav>

            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenVerification();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center space-x-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Apply as Mentor (KYC Portal)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
