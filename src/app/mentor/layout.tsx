"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MentorSidebar } from "@/components/MentorSidebar";
import { MentorFooter } from "@/components/MentorFooter";
import { MentorOutlet } from "@/components/MentorOutlet";
import { 
  Menu, 
  Search, 
  Bell, 
  ShieldCheck, 
  ChevronDown, 
  ExternalLink, 
  User, 
  LogOut, 
  Clock, 
  GraduationCap, 
  Video,
  DollarSign
} from "lucide-react";

export default function MentorPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mentorMenuOpen, setMentorMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#1e293b] flex flex-col font-sans antialiased selection:bg-purple-100 selection:text-purple-700">
      <div className="flex-1 flex flex-row min-h-screen">
        
        {/* Persistent Mentor Sidebar */}
        <MentorSidebar 
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          upcomingSessionsCount={2}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          
          {/* Top Mentor Header Navbar */}
          <header className="bg-white border-b border-[#eaecf2] h-[72px] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
            {/* Left section: mobile hamburger & search bar */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:flex items-center bg-[#f8f9fb] border border-[#eaecf2] rounded-xl px-3.5 py-2 w-64 md:w-80 focus-within:border-[#7922f5] focus-within:ring-2 focus-within:ring-[#7922f5]/10 transition-all">
                <Search className="w-4 h-4 text-[#9aa0b4] mr-2 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search mentees, sessions, topics..."
                  className="bg-transparent text-xs sm:text-sm text-[#1e2433] placeholder-[#9aa0b4] focus:outline-none w-full font-medium"
                />
              </div>
            </div>

            {/* Right section: next session alert, notifications, mentor profile */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              
              {/* Next Call Pill */}
              <Link 
                href="/mentor/sessions"
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-[#7922f5] bg-[#f6f2fe] border border-purple-100 hover:bg-purple-100 rounded-xl transition-colors"
              >
                <Video className="w-3.5 h-3.5 text-[#7922f5]" />
                <span>Next Call: Today, 5:30 PM (Pulkit G.)</span>
              </Link>

              {/* Notification Bell */}
              <Link 
                href="/mentor/dashboard" 
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-purple-600 rounded-full border-2 border-white ring-1 ring-purple-600/20 animate-pulse" />
              </Link>

              {/* Mentor Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setMentorMenuOpen(!mentorMenuOpen)}
                  className="flex items-center space-x-2.5 pl-2 pr-1 py-1 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                >
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
                      alt="Mentor" 
                      className="w-9 h-9 rounded-xl object-cover border border-[#eaecf2]"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#7922f5] text-white rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-white">
                      ✓
                    </div>
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-[#1e2433] leading-tight">Alex Rivera</div>
                    <div className="text-[10px] text-[#7922f5] font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      OpenAI Verified
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {mentorMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-scaleUp">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-[#1e2433]">Alex Rivera</p>
                      <p className="text-[11px] text-[#9aa0b4] truncate">alex.rivera@openai.com</p>
                    </div>

                    <div className="py-1">
                      <Link 
                        href="/mentor/profile" 
                        onClick={() => setMentorMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-[#7922f5]"
                      >
                        <User className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        My Mentor Profile
                      </Link>
                      <Link 
                        href="/mentor/availability" 
                        onClick={() => setMentorMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-[#7922f5]"
                      >
                        <Clock className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        Availability & Slots
                      </Link>
                      <Link 
                        href="/mentor/earnings" 
                        onClick={() => setMentorMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-[#7922f5]"
                      >
                        <DollarSign className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        Earnings (80% Take)
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <Link 
                        href="/dashboard" 
                        onClick={() => setMentorMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        <span className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5" />
                          Student Portal
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                      <Link 
                        href="/mentors" 
                        onClick={() => setMentorMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Marketplace View
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                      
                      <button
                        onClick={() => {
                          setMentorMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <span className="flex items-center gap-1.5">
                          <LogOut className="w-3.5 h-3.5" />
                          Log Out
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </header>

          {/* Nested Sub-route Outlet */}
          <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
            <MentorOutlet>
              {children}
            </MentorOutlet>
          </main>

          {/* Mentor Footer */}
          <MentorFooter />

        </div>
      </div>
    </div>
  );
}
