"use client";

import React from "react";
import Link from "next/link";
import { BarChart3, TrendingUp, Users, CalendarCheck, Award, Sparkles } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
            <Link href="/admin" className="hover:text-[#7922f5]">Admin</Link>
            <span>/</span>
            <span className="text-[#1e2433] font-semibold">Analytics</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Marketplace Analytics & Conversion Telemetry
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Funnel conversions, session completion rates, mentor utilization, and demand heatmaps.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-1">
          <div className="text-xs font-bold text-[#9aa0b4] uppercase">Discovery to Booking Rate</div>
          <div className="text-2xl font-black text-[#1e2433]">18.4%</div>
          <div className="text-[11px] text-emerald-600 font-semibold">+3.2% vs last month</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-1">
          <div className="text-xs font-bold text-[#9aa0b4] uppercase">Repeat Booking Rate</div>
          <div className="text-2xl font-black text-[#7922f5]">42.0%</div>
          <div className="text-[11px] text-slate-500">Mentees booking &gt;1 session</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-1">
          <div className="text-xs font-bold text-[#9aa0b4] uppercase">Avg Session Rating</div>
          <div className="text-2xl font-black text-[#1e2433]">★ 4.96</div>
          <div className="text-[11px] text-amber-600 font-bold">100% verified review invariant</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-1">
          <div className="text-xs font-bold text-[#9aa0b4] uppercase">Action Plan Delivery</div>
          <div className="text-2xl font-black text-emerald-600">98.5%</div>
          <div className="text-[11px] text-slate-500">Synthesized post-call roadmap</div>
        </div>
      </div>
    </div>
  );
}
