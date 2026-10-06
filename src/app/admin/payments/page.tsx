"use client";

import React from "react";
import Link from "next/link";
import { DollarSign, TrendingUp, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AdminPaymentsPage() {
  const transactions = [
    {
      id: "txn-901",
      bookingId: "bk-101",
      payerName: "Pulkit Gupta",
      recipientMentor: "Alex Rivera (OpenAI)",
      totalAmountINR: 2200,
      platformCommissionINR: 440, // 20%
      mentorPayoutINR: 1760, // 80%
      gateway: "Razorpay Standard",
      status: "ESCROW_LOCKED",
      date: "Oct 5, 2026, 01:14 PM",
    },
    {
      id: "txn-902",
      bookingId: "bk-102",
      payerName: "Jessia Rose",
      recipientMentor: "Kathryn Murphy (Google)",
      totalAmountINR: 1800,
      platformCommissionINR: 360,
      mentorPayoutINR: 1440,
      gateway: "Razorpay Route Escrow",
      status: "PAYOUT_COMPLETED",
      date: "Oct 4, 2026, 03:50 PM",
    },
    {
      id: "txn-903",
      bookingId: "bk-103",
      payerName: "Aman Gupta",
      recipientMentor: "Rohit Verma (Uber)",
      totalAmountINR: 1500,
      platformCommissionINR: 300,
      mentorPayoutINR: 1200,
      gateway: "Razorpay UPI",
      status: "ESCROW_LOCKED",
      date: "Oct 5, 2026, 11:30 AM",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
            <Link href="/admin" className="hover:text-[#7922f5]">Admin</Link>
            <span>/</span>
            <span className="text-[#1e2433] font-semibold">Payments & Escrow</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Financial Ledger & Payout Routing
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Automatic 80% mentor payout splitting, 20% platform take, and Razorpay escrow custody locks.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          <span>Razorpay Escrow Guard Active</span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-1">
          <div className="text-xs font-bold text-[#9aa0b4] uppercase">Total Gross GMV</div>
          <div className="text-2xl font-black text-[#1e2433]">₹1,28,400</div>
          <div className="text-[11px] text-emerald-600 font-semibold">100% processed via Razorpay</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-1">
          <div className="text-xs font-bold text-[#9aa0b4] uppercase">Net Platform Revenue (20%)</div>
          <div className="text-2xl font-black text-[#7922f5]">₹25,680</div>
          <div className="text-[11px] text-slate-500">Collected from completed sessions</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-1">
          <div className="text-xs font-bold text-[#9aa0b4] uppercase">Mentor Payouts Released (80%)</div>
          <div className="text-2xl font-black text-[#1e2433]">₹1,02,720</div>
          <div className="text-[11px] text-slate-500">Direct NEFT/UPI bank settlement</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] overflow-hidden">
        <div className="p-4 border-b border-[#eaecf2] font-bold text-xs text-[#1e2433]">
          Recent Escrow Ledger Entries
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#eaecf2] bg-[#f8f9fb] text-[#9aa0b4] font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Payer / Student</th>
                <th className="py-3 px-4">Recipient / Mentor</th>
                <th className="py-3 px-4 text-center">Gross Amount</th>
                <th className="py-3 px-4 text-center">Platform Fee (20%)</th>
                <th className="py-3 px-4 text-center">Mentor Share (80%)</th>
                <th className="py-3 px-4 text-right">Escrow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf2]">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1e2433]">{t.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#1e2433]">{t.payerName}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#7922f5]">{t.recipientMentor}</td>
                  <td className="py-3.5 px-4 text-center font-black text-[#1e2433]">₹{t.totalAmountINR}</td>
                  <td className="py-3.5 px-4 text-center text-[#7922f5] font-bold">₹{t.platformCommissionINR}</td>
                  <td className="py-3.5 px-4 text-center text-emerald-700 font-bold">₹{t.mentorPayoutINR}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === "PAYOUT_COMPLETED" 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                        : "bg-purple-50 text-[#7922f5] border border-purple-100"
                    }`}>
                      {t.status}
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
