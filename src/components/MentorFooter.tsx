"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, DollarSign, Clock, HelpCircle } from "lucide-react";

export const MentorFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#eaecf2] px-6 sm:px-8 py-4 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9aa0b4]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-[#1e2433] font-medium">
            <ShieldCheck className="w-4 h-4 text-[#7922f5]" />
            <span>Sp!k Verified Mentor Guarantee</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center space-x-1 text-emerald-600 font-semibold">
            <DollarSign className="w-3.5 h-3.5" />
            <span>80% Direct Escrow Payouts</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/mentor/availability" className="hover:text-[#7922f5] transition-colors">
            Manage Slots
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/mentor/earnings" className="hover:text-[#7922f5] transition-colors">
            Payout Ledger
          </Link>
          <span className="text-slate-300">•</span>
          <span>© {new Date().getFullYear()} Sp!k Mentorship</span>
        </div>
      </div>
    </footer>
  );
};
