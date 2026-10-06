"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  Calendar,
  CreditCard,
  Download,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ChevronRight,
  TrendingUp,
  Building2,
  Loader2,
} from "lucide-react";
import { useMentorEarnings } from "@/hooks/useQueries";

export default function MentorEarningsPage() {
  const { data: earningsData, isLoading } = useMentorEarnings();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PAID" | "PENDING" | "REFUNDED">("ALL");

  // Fallback financial data
  const data = earningsData || {
    overview: {
      grossEarningsINR: 48000,
      platformFeesINR: 9600,
      netMentorEarningsINR: 38400,
      availableForPayoutINR: 14400,
      pendingPayoutINR: 6400,
      paidPayoutsINR: 24000,
      completedSessionsCount: 24,
    },
    transactions: [
      {
        id: "tx-901",
        bookingId: "bk-101",
        studentName: "Pulkit Gupta",
        serviceTitle: "1:1 Corporate Valuation & DCF Modeling",
        grossAmount: 2000,
        platformFee: 400,
        mentorAmount: 1600,
        currency: "INR",
        status: "PAID",
        date: new Date().toISOString(),
      },
      {
        id: "tx-902",
        bookingId: "bk-102",
        studentName: "Kathryn Murphy",
        serviceTitle: "Management Consulting Case Prep",
        grossAmount: 2500,
        platformFee: 500,
        mentorAmount: 2000,
        currency: "INR",
        status: "PAID",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "tx-903",
        bookingId: "bk-103",
        studentName: "Savannah Nguyen",
        serviceTitle: "System Design Mock: Microservices",
        grossAmount: 1800,
        platformFee: 360,
        mentorAmount: 1440,
        currency: "INR",
        status: "PAID",
        date: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "tx-904",
        bookingId: "bk-104",
        studentName: "David Chen",
        serviceTitle: "Product Design Portfolio Teardown",
        grossAmount: 1500,
        platformFee: 300,
        mentorAmount: 1200,
        currency: "INR",
        status: "PENDING",
        date: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
      },
    ],
    payouts: [
      {
        id: "po-101",
        amount: 24000,
        status: "PAID",
        paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "po-102",
        amount: 14400,
        status: "PENDING",
        paidAt: null,
        createdAt: new Date().toISOString(),
      },
    ],
  };

  const filteredTransactions = data.transactions.filter((t: any) => {
    const matchesStatus = filterStatus === "ALL" || t.status === filterStatus;
    const matchesSearch =
      t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
            <Link href="/mentor/dashboard" className="hover:text-[#7922f5]">Mentor</Link>
            <span>/</span>
            <span className="text-[#1e2433] font-semibold">Earnings & Financials</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Earnings & Payout Ledger
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Transparent 80% mentor revenue share, fee breakdowns, and automated payout disbursement cycles.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-purple-50 text-[#7922f5] text-xs font-bold border border-purple-100 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>80% Verified Mentor Revenue Share</span>
        </div>
      </div>

      {/* Summary Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available for Payout */}
        <div className="bg-gradient-to-br from-[#7922f5] to-[#9333ea] rounded-3xl p-6 text-white shadow-xl shadow-purple-600/15 space-y-2">
          <div className="flex items-center justify-between text-purple-100">
            <span className="text-xs font-bold uppercase tracking-wider">Available Balance</span>
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-black">
            ₹{data.overview.availableForPayoutINR.toLocaleString()}
          </p>
          <p className="text-[11px] text-purple-200">
            Ready for automated bank disbursement
          </p>
        </div>

        {/* Card 2: Total Net Earnings */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Net Mentor Take (80%)</span>
            <TrendingUp className="w-5 h-5 text-[#7922f5]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#1e2433]">
            ₹{data.overview.netMentorEarningsINR.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">
            From {data.overview.completedSessionsCount} delivered sessions
          </p>
        </div>

        {/* Card 3: Platform Fees */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Commission (20%)</span>
            <Building2 className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#1e2433]">
            ₹{data.overview.platformFeesINR.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">
            Includes Razorpay gateway & hosting
          </p>
        </div>

        {/* Card 4: Gross Session Volume */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Student Paid</span>
            <CreditCard className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#1e2433]">
            ₹{data.overview.grossEarningsINR.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">Total transaction volume</p>
        </div>
      </div>

      {/* Transactions & Payouts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Detailed Transaction Ledger */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-[#1e2433]">Session Transactions</h2>
                <p className="text-xs text-slate-500">Every completed booking with 80/20 revenue split.</p>
              </div>

              {/* Status Tabs */}
              <div className="flex items-center space-x-1">
                {["ALL", "PAID", "PENDING"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st as any)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      filterStatus === st
                        ? "bg-[#7922f5] text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Transactions List */}
            {filteredTransactions.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">No transactions found.</p>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((tx: any) => (
                  <div
                    key={tx.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#1e2433]">{tx.studentName}</span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            tx.status === "PAID"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{tx.serviceTitle}</p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(tx.date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="text-right sm:self-center">
                      <p className="text-xs font-extrabold text-[#7922f5]">
                        +₹{tx.mentorAmount.toLocaleString()} (Net Take)
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Gross: ₹{tx.grossAmount.toLocaleString()} • Fee: -₹{tx.platformFee.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Payout Disbursements History */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
            <h3 className="text-base font-bold text-[#1e2433] pb-2 border-b border-slate-100">
              Payout Disbursements
            </h3>

            <div className="space-y-3">
              {data.payouts.map((po: any) => (
                <div
                  key={po.id}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      ₹{po.amount.toLocaleString()}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        po.status === "PAID"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {po.status === "PAID" ? "Disbursed" : "In Processing"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {po.id}</p>
                  <p className="text-[11px] text-slate-500">
                    {po.paidAt
                      ? `Paid on ${new Date(po.paidAt).toLocaleDateString("en-IN")}`
                      : "Processing for next cycle"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
