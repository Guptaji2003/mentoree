"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, Download, ExternalLink, CheckCircle2, Clock, AlertCircle, Search, ShieldCheck } from "lucide-react";

interface PaymentTransaction {
  id: string;
  orderId: string;
  paymentId: string;
  mentorName: string;
  serviceTitle: string;
  amountINR: number;
  date: string;
  status: "CAPTURED" | "REFUNDED" | "PENDING";
  receiptUrl?: string;
}

export default function StudentPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [transactions] = useState<PaymentTransaction[]>([
    {
      id: "pay-001",
      orderId: "order_Qz981Kla02948",
      paymentId: "pay_Kx98710294821",
      mentorName: "Dr. Alex Kumar",
      serviceTitle: "1:1 Corporate Valuation & DCF Modeling (60 mins)",
      amountINR: 1500,
      date: "Oct 4, 2026, 04:30 PM",
      status: "CAPTURED",
      receiptUrl: "#",
    },
    {
      id: "pay-002",
      orderId: "order_M7711Kla09923",
      paymentId: "pay_Nx88102938172",
      mentorName: "Kathryn Murphy",
      serviceTitle: "Management Consulting Case Interview Prep (60 mins)",
      amountINR: 2000,
      date: "Sep 30, 2026, 06:15 PM",
      status: "CAPTURED",
      receiptUrl: "#",
    },
    {
      id: "pay-003",
      orderId: "order_R5512Kla12345",
      paymentId: "pay_Px12345678901",
      mentorName: "David Chen",
      serviceTitle: "Product Design Portfolio Teardown (60 mins)",
      amountINR: 1200,
      date: "Sep 15, 2026, 02:00 PM",
      status: "REFUNDED",
      receiptUrl: "#",
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filtered = transactions.filter(t => 
    t.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.paymentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#1e293b] font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#7922f5] text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-xs sm:text-sm flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-[#eaecf2] h-[72px] px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1e2433] tracking-tight">
              Payments & Invoices
            </h1>
            <p className="text-xs text-[#94a3b8] font-medium">Verified Razorpay transactions, downloadable receipts & refund status</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-bit SSL Secure Checkout</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-6 sm:p-8 space-y-6">
        
        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-[#eef0f6] shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-400">Total Spent</span>
            <h3 className="text-2xl font-extrabold text-[#1e2433]">₹3,500</h3>
            <span className="text-[11px] text-slate-500 font-medium">Across 2 completed sessions</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#eef0f6] shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-400">Refunds Processed</span>
            <h3 className="text-2xl font-extrabold text-emerald-600">₹1,200</h3>
            <span className="text-[11px] text-slate-500 font-medium">1 cancelled session refunded</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#eef0f6] shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-400">Payment Method</span>
            <h3 className="text-base font-extrabold text-[#7922f5] flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>UPI / Cards (Razorpay)</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Auto-verified server side</span>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-[#1e2433]">Transaction History</h2>
            <div className="relative w-full sm:w-64">
              <input 
                type="text"
                placeholder="Search transaction..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">Mentor & Service</th>
                  <th className="pb-3">Payment ID</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 pr-3">
                      <p className="font-bold text-slate-900">{t.mentorName}</p>
                      <span className="text-[11px] text-slate-500">{t.serviceTitle}</span>
                    </td>
                    <td className="py-4 pr-3 font-mono text-[11px] text-slate-500">
                      {t.paymentId}
                    </td>
                    <td className="py-4 pr-3 text-slate-600">
                      {t.date}
                    </td>
                    <td className="py-4 pr-3 font-bold text-slate-900">
                      ₹{t.amountINR.toLocaleString()}
                    </td>
                    <td className="py-4 pr-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === "CAPTURED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        t.status === "REFUNDED" ? "bg-purple-50 text-[#7922f5] border border-purple-200" :
                        "bg-amber-50 text-amber-700"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => showToast(`Downloading tax invoice for ${t.paymentId}...`)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-[#7922f5] hover:text-[#7922f5] text-slate-500 transition-colors"
                        title="Download Receipt PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
