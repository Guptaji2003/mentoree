"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StudentSidebar } from "@/components/StudentSidebar";
import { 
  Menu, 
  Bell, 
  Search, 
  Compass, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  User,
  GraduationCap
} from "lucide-react";

export default function StudentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#1e293b] flex flex-col font-sans antialiased selection:bg-purple-100 selection:text-purple-700">
      <div className="flex-1 flex flex-row">
        
        {/* Persistent Left Sidebar for Student Portal */}
        <StudentSidebar 
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          completionScore={85}
        />

        {/* Nested Content Container (The Outlet) */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          {/* Top Header Navbar for Student Portal */}
          <header className="bg-white border-b border-[#eaecf2] h-[72px] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:flex items-center bg-[#f8f9fb] border border-[#eaecf2] rounded-xl px-3.5 py-2 w-64 md:w-80 focus-within:border-[#7922f5] focus-within:ring-2 focus-within:ring-[#7922f5]/10 transition-all">
                <Search className="w-4 h-4 text-[#94a3b8] mr-2 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search mentors, skills, topics..."
                  className="bg-transparent text-xs sm:text-sm text-[#1e2433] placeholder-[#94a3b8] focus:outline-none w-full font-medium"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link 
                href="/mentors" 
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-[#7922f5] bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Mentors</span>
              </Link>

              <Link 
                href="/student/notifications" 
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white ring-1 ring-rose-500/20 animate-pulse"></span>
              </Link>

              {/* Student User Avatar & Portal Switcher */}
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2.5 pl-2 pr-1 py-1 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7922f5] to-indigo-500 p-0.5 shadow-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250" 
                      alt="Student" 
                      className="w-full h-full rounded-[10px] object-cover"
                    />
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-[#1e2433] leading-tight">Ananya Roy</div>
                    <div className="text-[10px] text-[#7922f5] font-semibold flex items-center gap-1">
                      <GraduationCap className="w-2.5 h-2.5" />
                      Student Portal
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">Ananya Roy</p>
                      <p className="text-[11px] text-slate-500 truncate">ananya.roy@example.com</p>
                    </div>

                    <div className="py-1">
                      <Link 
                        href="/student/profile" 
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-[#7922f5]"
                      >
                        <User className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        My Profile (8 Tabs)
                      </Link>
                      <Link 
                        href="/student/sessions" 
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-[#7922f5]"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        My Sessions
                      </Link>
                      <Link 
                        href="/student/settings" 
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-[#7922f5]"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        Settings & Privacy
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <Link 
                        href="/mentor/dashboard" 
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        <span>Switch to Mentor Portal</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                      <Link 
                        href="/admin" 
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        <span>Admin Console</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Content Outlet */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
