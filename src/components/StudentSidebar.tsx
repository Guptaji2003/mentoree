"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home,
  GraduationCap,
  Users,
  Search,
  Video,
  Bookmark,
  CreditCard,
  Bell,
  Settings,
  Shield,
  Target,
  X,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
  Layers,
  Calendar
} from "lucide-react";

interface StudentSidebarProps {
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
  completionScore?: number;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  mobileMenuOpen = false,
  setMobileMenuOpen,
  completionScore = 85,
}) => {
  const pathname = usePathname();
  const [isStudentsExpanded, setIsStudentsExpanded] = useState(true);

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/student/dashboard",
      icon: Home,
      exact: true,
    },
    {
      id: "find-mentors",
      label: "Find Mentors",
      href: "/mentors",
      icon: Search,
    },
    {
      id: "student-profile",
      label: "My Profile (8 Tabs)",
      href: "/student/profile",
      icon: GraduationCap,
    },
    {
      id: "career-goals",
      label: "Career Goals",
      href: "/student/profile?tab=goals",
      icon: Target,
    },
    {
      id: "sessions",
      label: "My Sessions",
      href: "/student/sessions",
      icon: Video,
    },
    {
      id: "saved",
      label: "Saved Mentors",
      href: "/student/saved",
      icon: Bookmark,
    },
    {
      id: "payments",
      label: "Payments & Invoices",
      href: "/student/payments",
      icon: CreditCard,
    },
    {
      id: "notifications",
      label: "Notifications",
      href: "/student/notifications",
      icon: Bell,
    },
    {
      id: "settings",
      label: "Settings & Privacy",
      href: "/student/settings",
      icon: Settings,
    },
  ];

  const isLinkActive = (href: string, exact: boolean = false) => {
    if (exact || href === "/student/dashboard") {
      return pathname === "/student/dashboard" || pathname === "/dashboard";
    }
    if (href.includes("?")) {
      const basePath = href.split("?")[0];
      return pathname === basePath;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#eaecf2] transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto ${
        mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col justify-between overflow-y-auto">
        {/* Top Logo & Header */}
        <div>
          <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100/80">
            <Link href="/student/dashboard" className="flex items-center space-x-2.5 group">
              <div className="flex items-center justify-center text-[#7922f5]">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 40 40">
                  <path d="M20 4 C18.5 12, 18.5 20, 20 26 C21.5 20, 21.5 12, 20 4 Z" fill="#7922f5" />
                  <path d="M12 9 C13 16, 16 22, 20 26 C17 21, 13 16, 12 9 Z" fill="#7922f5" />
                  <path d="M28 9 C27 16, 24 22, 20 26 C23 21, 27 16, 28 9 Z" fill="#7922f5" />
                  <circle cx="8" cy="18" r="2.8" fill="#7922f5" />
                  <circle cx="32" cy="18" r="2.8" fill="#7922f5" />
                  <path d="M17 27 C19 28.5, 21 28.5, 23 27 C22 31, 18 31, 17 27 Z" fill="#7922f5" />
                </svg>
              </div>
              <span className="font-extrabold text-[26px] tracking-tight text-[#7922f5] font-sans">
                sp!k
              </span>
            </Link>

            {setMobileMenuOpen && (
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-3 space-y-1 text-[13px] font-medium text-[#5a627a]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isLinkActive(item.href, item.exact);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all relative ${
                    active
                      ? "text-[#7922f5] bg-[#f6f2fe] font-bold shadow-sm before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3.5px] before:bg-[#7922f5] before:rounded-r-md"
                      : "text-[#5a627a] hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-[#7922f5]" : "text-[#8e95a5]"}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}

            {/* Portal Switcher Divider */}
            <div className="pt-4 pb-1 border-t border-slate-100 my-2">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Switch Portals
              </span>
            </div>

            {/* Mentor Portal */}
            <Link
              href="/mentor/dashboard"
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-purple-700 bg-purple-50/70 hover:bg-purple-100 font-semibold transition-colors"
            >
              <Users className="w-[18px] h-[18px] text-[#7922f5] shrink-0" />
              <span className="truncate">Mentor Portal</span>
            </Link>

            {/* Admin Console */}
            <Link
              href="/admin"
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold transition-colors"
            >
              <Shield className="w-[18px] h-[18px] text-slate-600 shrink-0" />
              <span className="truncate">Admin Console</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Profile Completion Widget */}
        <div className="p-4 m-3 rounded-2xl bg-[#f6f2fe]/90 border border-purple-100/70">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-purple-950">Profile Readiness</span>
            <span className="font-extrabold text-[#7922f5]">{completionScore}%</span>
          </div>
          <div className="w-full h-1.5 bg-purple-200/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#7922f5] rounded-full transition-all duration-500"
              style={{ width: `${completionScore}%` }}
            />
          </div>
          <Link
            href="/student/profile"
            className="mt-2 block text-center text-[11px] font-bold text-[#7922f5] hover:underline"
          >
            Manage 8 Profile Tabs →
          </Link>
        </div>
      </div>
    </aside>
  );
};
