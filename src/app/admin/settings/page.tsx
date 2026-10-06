"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Settings, ShieldCheck, CheckCircle2, Lock } from "lucide-react";

export default function AdminSettingsPage() {
  const [commissionRate, setCommissionRate] = useState(20);
  const [holdMinutes, setHoldMinutes] = useState(10);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
            <Link href="/admin" className="hover:text-[#7922f5]">Admin</Link>
            <span>/</span>
            <span className="text-[#1e2433] font-semibold">Settings & Policies</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Platform Configuration & Protocol Parameters
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Configure platform fees, Redis concurrency lock durations, and trust invariants.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center space-x-2 text-xs text-emerald-700 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Platform parameters updated successfully!</span>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] max-w-2xl space-y-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1e2433] uppercase tracking-wider block">
              Platform Marketplace Commission (%)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="w-full bg-[#f8f9fb] border border-[#eaecf2] rounded-xl px-4 py-2.5 text-xs text-[#1e2433] font-semibold focus:outline-none focus:border-[#7922f5]"
            />
            <p className="text-[11px] text-[#9aa0b4]">Default is 20% platform commission, with 80% escrow-payout to mentor.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1e2433] uppercase tracking-wider block">
              High-Concurrency Slot Hold Duration (Minutes)
            </label>
            <input
              type="number"
              min="3"
              max="30"
              value={holdMinutes}
              onChange={(e) => setHoldMinutes(Number(e.target.value))}
              className="w-full bg-[#f8f9fb] border border-[#eaecf2] rounded-xl px-4 py-2.5 text-xs text-[#1e2433] font-semibold focus:outline-none focus:border-[#7922f5]"
            />
            <p className="text-[11px] text-[#9aa0b4]">Redis key TTL used to prevent double-booking collisions during checkout.</p>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all active:scale-95"
          >
            Save Platform Settings
          </button>
        </form>
      </div>
    </div>
  );
}
