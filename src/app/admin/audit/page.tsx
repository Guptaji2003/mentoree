"use client";

import React, { useState } from "react";
import Link from "next/link";
import { History, ShieldCheck, Search, Filter, Lock } from "lucide-react";

export default function AdminAuditPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const auditLogs = [
    {
      id: "log-501",
      action: "MENTOR_APPROVED",
      actor: "admin@mentoree.in",
      target: "Alex Rivera (OpenAI)",
      details: "KYC credentials verified against official OpenAI domain email and ID.",
      ipAddress: "192.168.1.1",
      timestamp: "Oct 5, 2026, 12:45 PM",
      status: "SUCCESS",
    },
    {
      id: "log-502",
      action: "SLOT_HOLD_ACQUIRED",
      actor: "pulkit.gupta@stanford.edu",
      target: "Slot #4092 (Oct 5, 5:30 PM)",
      details: "Acquired high-concurrency 10-minute hold lock.",
      ipAddress: "103.21.124.5",
      timestamp: "Oct 5, 2026, 01:10 PM",
      status: "SUCCESS",
    },
    {
      id: "log-503",
      action: "PAYMENT_CAPTURED",
      actor: "pulkit.gupta@stanford.edu",
      target: "Booking #bk-101 (₹2,200)",
      details: "Razorpay order payment captured and locked in escrow.",
      ipAddress: "103.21.124.5",
      timestamp: "Oct 5, 2026, 01:14 PM",
      status: "SUCCESS",
    },
    {
      id: "log-504",
      action: "ADMIN_LOGIN_SUCCESS",
      actor: "admin@mentoree.in",
      target: "Admin Console",
      details: "Super Admin authenticated via Argon2id + Jose JWT.",
      ipAddress: "127.0.0.1",
      timestamp: "Oct 5, 2026, 02:00 PM",
      status: "SUCCESS",
    },
  ];

  const filtered = auditLogs.filter((l) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        l.action.toLowerCase().includes(q) ||
        l.actor.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
            <Link href="/admin" className="hover:text-[#7922f5]">Admin</Link>
            <span>/</span>
            <span className="text-[#1e2433] font-semibold">Audit & Security Logs</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            System Security & Compliance Ledger
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Tamper-evident chronological record of all administrative overrides, logins, slot holds, and transactions.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-purple-50 text-[#7922f5] text-xs font-bold border border-purple-100">
          <Lock className="w-4 h-4" />
          <span>Immutable Audit Log</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6]">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-[#9aa0b4] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by action, actor, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#f8f9fb] border border-[#eaecf2] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1e2433] placeholder-[#9aa0b4] focus:outline-none focus:border-[#7922f5] font-medium"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#eaecf2] bg-[#f8f9fb] text-[#9aa0b4] font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Log ID & Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf2]">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#7922f5] font-mono text-[11px] block">{l.action}</span>
                    <span className="text-[10px] text-[#9aa0b4] font-mono">{l.id}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#1e2433]">{l.actor}</td>
                  <td className="py-3.5 px-4 text-slate-700">{l.target}</td>
                  <td className="py-3.5 px-4 text-[#5a627a] max-w-xs leading-relaxed">{l.details}</td>
                  <td className="py-3.5 px-4 font-mono text-[#9aa0b4]">{l.ipAddress}</td>
                  <td className="py-3.5 px-4 text-right text-[#9aa0b4] whitespace-nowrap">{l.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
