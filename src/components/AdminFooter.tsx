"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Activity, Lock, Database } from "lucide-react";

export const AdminFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#eaecf2] px-6 sm:px-8 py-4 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9aa0b4]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-[#1e2433] font-medium">
            <ShieldCheck className="w-4 h-4 text-[#7922f5]" />
            <span>Sp!k Admin Console v1.0</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center space-x-1 text-emerald-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All Systems Operational</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/admin/audit" className="hover:text-[#7922f5] transition-colors">
            Audit Trail
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/admin/settings" className="hover:text-[#7922f5] transition-colors">
            Platform Policies
          </Link>
          <span className="text-slate-300">•</span>
          <span>© {new Date().getFullYear()} Sp!k Trust & Safety</span>
        </div>
      </div>
    </footer>
  );
};
