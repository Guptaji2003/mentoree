"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  CalendarCheck, 
  DollarSign, 
  History, 
  Tag, 
  BarChart3, 
  Settings, 
  X, 
  ExternalLink,
  LogOut,
  AlertCircle,
  GraduationCap,
  Briefcase
} from "lucide-react";

interface AdminSidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  pendingVerificationsCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  pendingVerificationsCount = 3,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      exact: true,
      icon: LayoutDashboard,
    },
    {
      name: "KYC Verifications",
      href: "/admin/verifications",
      icon: ShieldCheck,
      badge: pendingVerificationsCount > 0 ? `${pendingVerificationsCount}` : undefined,
      badgeColor: "bg-rose-500 text-white",
    },
    {
      name: "Students & Users",
      href: "/admin/students",
      icon: Users,
    },
    {
      name: "Mentors Directory",
      href: "/admin/mentors",
      icon: UserCheck,
    },
    {
      name: "Bookings & Sessions",
      href: "/admin/bookings",
      icon: CalendarCheck,
    },
    {
      name: "Payments & Escrow",
      href: "/admin/payments",
      icon: DollarSign,
    },
    {
      name: "Audit & Security Logs",
      href: "/admin/audit",
      icon: History,
    },
    {
      name: "Taxonomy & Skills",
      href: "/admin/taxonomy",
      icon: Tag,
    },
    {
      name: "Platform Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings & Rules",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      router.push("/login");
    }
  };

  const isItemActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }
    return pathname.startsWith(item.href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Brand Header */}
        <div className="h-[72px] px-6 border-b border-[#eaecf2] flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#7922f5] flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-purple-600/20">
              S
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-[#1e2433] leading-none">
                Sp<span className="text-[#7922f5]">!</span>k
              </div>
              <div className="text-[10px] text-[#7922f5] font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5" />
                Admin Console
              </div>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)]">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9aa0b4]">
            Administration
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  active
                    ? "bg-[#7922f5] text-white shadow-sm shadow-purple-600/20"
                    : "text-[#5a627a] hover:bg-purple-50 hover:text-[#7922f5]"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-[#9aa0b4] group-hover:text-[#7922f5]"}`} />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${active ? "bg-white text-[#7922f5]" : item.badgeColor || "bg-purple-100 text-[#7922f5]"}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Switcher & Profile */}
      <div className="p-4 border-t border-[#eaecf2] space-y-2 bg-white">
        {/* Quick Portal Switchers */}
        <div className="grid grid-cols-2 gap-1.5">
          <Link
            href="/dashboard"
            className="px-2 py-1.5 rounded-lg bg-[#f8f9fb] hover:bg-purple-50 hover:text-[#7922f5] text-slate-600 text-[10px] font-bold flex items-center justify-center space-x-1 border border-[#eaecf2] transition-colors"
          >
            <GraduationCap className="w-3 h-3" />
            <span>Student</span>
          </Link>
          <Link
            href="/mentor/dashboard"
            className="px-2 py-1.5 rounded-lg bg-[#f8f9fb] hover:bg-purple-50 hover:text-[#7922f5] text-slate-600 text-[10px] font-bold flex items-center justify-center space-x-1 border border-[#eaecf2] transition-colors"
          >
            <Briefcase className="w-3 h-3" />
            <span>Mentor</span>
          </Link>
        </div>

        {/* Super Admin User Info */}
        <div className="p-2.5 rounded-xl bg-[#f8f9fb] border border-[#eaecf2] flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#7922f5] text-white flex items-center justify-center font-bold text-xs shrink-0">
              A
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#1e2433] truncate">Super Admin</div>
              <div className="text-[10px] text-[#7922f5] font-semibold truncate">admin@mentoree.in</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 text-[#9aa0b4] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-[#eaecf2] sticky top-0 h-screen shrink-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl z-10">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};
