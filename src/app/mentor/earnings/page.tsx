"use client";

import React from "react";
import Link from "next/link";
import { DollarSign, TrendingUp, ShieldCheck, CheckCircle2, Clock } from "lucide-react";

export default function MentorEarningsPage() {
  const payouts = [
    { id: "po-101", amountINR: 1760, grossINR: 2200, mentee: "Pulkit Gupta", status: "ESCROW_LOCKED", date: "Oct 5, 2026" },
    { id: "po-102", amountINR: 1440, grossINR: 1800, mentee: "Jessia Rose", status: "PAID_TO_BANK", date: "Oct 4, 2026" },
    { id: "po-103", amountINR: 1200, grossINR: 1500, mentee: "Aman Gupta", status: "ESCROW_LOCKED", date: "Oct 5, 2026" },
    { id: "po-104", amountINR: 1760, grossINR: 2200, mentee: "Rhea Sen", status: "PAID_TO_BANK", date: "Oct 1, 2026" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
            <Link href="/mentor/dashboard" className="hover:text-[#7922f5]">Mentor</Link>
            <span>/</span>
            <span className="text-[#1e2433] font-semibold">Earnings & Payouts</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            80% Mentor Payout Ledger
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Transparent breakdown of your 80% take per session, escrow releases, and automated bank settlements.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Bank Account Connected</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-1">
          <div className="text-xs font-bold text-[#9aa0b4] uppercase">Total Life Earnings</div>
          <div className="text-2xl font-black text-[#1e2433]">₹84,480</div>
          <div className="text-[11px] text-emerald-600 font-semibold">from 48 completed sessions</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-1">
          <div className="text-xs font-bold text-[#9aa0b4] uppercase">Escrow Held for Upcoming</div>
          <div className="text-2xl font-black text-[#7922f5]">₹2,960</div>
          <div className="text-[11px] text-slate-500">Releases upon call completion</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-1">
          <div className="text-xs font-bold text-[#9aa0b4] uppercase">Next Scheduled Transfer</div>
          <div className="text-2xl font-black text-[#1e2433]">Friday, 10 AM</div>
          <div className="text-[11px] text-slate-500">Auto-settled to HDFC Bank ****4129</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] overflow-hidden">
        <div className="p-4 border-b border-[#eaecf2] font-bold text-xs text-[#1e2433]">
          Recent Session Payout Records
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#eaecf2] bg-[#f8f9fb] text-[#9aa0b4] font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Payout ID</th>
                <th className="py-3 px-4">Mentee Name</th>
                <th className="py-3 px-4 text-center">Session Total</th>
                <th className="py-3 px-4 text-center">Your 80% Take</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf2]">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1e2433]">{p.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#1e2433]">{p.mentee}</td>
                  <td className="py-3.5 px-4 text-center text-[#9aa0b4]">₹{p.grossINR}</td>
                  <td className="py-3.5 px-4 text-center font-black text-[#7922f5]">₹{p.amountINR}</td>
                  <td className="py-3.5 px-4 text-[#9aa0b4]">{p.date}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      p.status === "PAID_TO_BANK" ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-[#7922f5]"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
