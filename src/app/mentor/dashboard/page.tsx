"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Star, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Award,
  ChevronRight,
  Layers
} from "lucide-react";

export default function MentorDashboardOverview() {
  const [stats, setStats] = useState({
    upcomingCalls: 2,
    completedSessions: 48,
    totalEarningsINR: 84480, // 80% take
    avgRating: 4.98,
    totalReviews: 24,
    actionPlansSynthesized: 47,
  });

  const nextSession = {
    id: "bk-101",
    studentName: "Pulkit Gupta",
    studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    studentEmail: "pulkit.gupta@stanford.edu",
    time: "Today, 05:30 PM - 06:30 PM IST",
    topic: "System Design & AI Architecture for Tier-1 Tech Placement",
    serviceTitle: "1:1 Live System Design Teardown",
    priceINR: 2200,
    mentorTakeINR: 1760, // 80%
    meetUrl: "https://meet.google.com/abc-defg-hij",
    hasContextNotes: true,
  };

  const upcomingSessions = [
    {
      id: "bk-103",
      studentName: "Aman Gupta",
      studentEmail: "aman.g@iitd.ac.in",
      time: "Tomorrow, 07:00 PM IST",
      topic: "High-Throughput Backend Engineering & Concurrency",
      serviceTitle: "Mock Technical Interview",
      amountINR: 1500,
      mentorTakeINR: 1200,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
            <Link href="/mentor/dashboard" className="hover:text-[#7922f5]">Mentor Portal</Link>
            <span>/</span>
            <span className="text-[#1e2433] font-semibold">Dashboard Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Welcome back, Alex Rivera 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#5a627a] mt-0.5">
            Staff AI Engineer @ OpenAI • Verified Corporate Practitioner
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/mentor/availability"
            className="px-4 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all active:scale-95 flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Open New Availability Slots</span>
          </Link>
        </div>
      </div>

      {/* 4 Core Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* KPI 1: Net Earnings */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#9aa0b4] uppercase tracking-wider">Your Net Earnings (80%)</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7922f5] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1e2433]">₹{stats.totalEarningsINR.toLocaleString()}</div>
          <div className="flex items-center space-x-1 text-[11px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.2% vs last month</span>
          </div>
        </div>

        {/* KPI 2: Completed Sessions */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#9aa0b4] uppercase tracking-wider">Sessions Delivered</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1e2433]">{stats.completedSessions}</div>
          <div className="text-[11px] text-[#9aa0b4]">2 upcoming booked this week</div>
        </div>

        {/* KPI 3: Mentee Rating */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#9aa0b4] uppercase tracking-wider">Mentee Rating</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1e2433]">★ {stats.avgRating}</div>
          <div className="text-[11px] text-slate-500 font-medium">from {stats.totalReviews} verified student reviews</div>
        </div>

        {/* KPI 4: Action Plans Created */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#9aa0b4] uppercase tracking-wider">Post-Session Plans</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1e2433]">{stats.actionPlansSynthesized}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">98% on-time roadmap delivery</div>
        </div>

      </div>

      {/* Main Focus: Next Upcoming Call Spotlight Card */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-sm font-bold text-[#1e2433]">Next 1:1 Live Session</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#f6f2fe] text-[#7922f5] text-[10px] font-bold border border-purple-100">
              Starts in ~3 Hours
            </span>
          </div>

          <div className="text-xs font-bold text-[#7922f5]">
            Net Payout: ₹{nextSession.mentorTakeINR} (80%)
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <img
              src={nextSession.studentAvatar}
              alt={nextSession.studentName}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-purple-50"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-[#1e2433]">{nextSession.studentName}</h3>
                <span className="text-[10px] font-semibold text-[#9aa0b4]">{nextSession.studentEmail}</span>
              </div>
              <p className="text-xs font-semibold text-[#7922f5]">{nextSession.topic}</p>
              <div className="flex items-center space-x-2 text-xs text-[#5a627a] pt-0.5">
                <Clock className="w-3.5 h-3.5 text-[#7922f5]" />
                <span>{nextSession.time}</span>
              </div>
            </div>
          </div>

          {/* Join Actions */}
          <div className="flex items-center space-x-3 w-full lg:w-auto">
            <a
              href={nextSession.meetUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 lg:flex-none px-5 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <Video className="w-4 h-4" />
              <span>Join Google Meet Call</span>
            </a>
            
            <Link
              href="/mentor/sessions"
              className="px-4 py-2.5 rounded-xl border border-[#eaecf2] hover:bg-slate-50 text-xs font-semibold text-slate-700"
            >
              Session Context
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/mentor/availability"
          className="p-5 bg-white rounded-2xl border border-[#eef0f6] hover:border-purple-200 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-[#7922f5]">
            <Clock className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-sm font-bold text-[#1e2433]">Availability & Slots</h3>
          <p className="text-xs text-[#5a627a]">Manage weekly recurring hours and customize 10-min hold slots.</p>
        </Link>

        <Link
          href="/mentor/services"
          className="p-5 bg-white rounded-2xl border border-[#eef0f6] hover:border-purple-200 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-[#7922f5]">
            <Layers className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-sm font-bold text-[#1e2433]">Services & Pricing</h3>
          <p className="text-xs text-[#5a627a]">Configure 1:1 roadmap calls, mock interviews, and pricing INR.</p>
        </Link>

        <Link
          href="/mentor/earnings"
          className="p-5 bg-white rounded-2xl border border-[#eef0f6] hover:border-purple-200 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-[#7922f5]">
            <DollarSign className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-sm font-bold text-[#1e2433]">Earnings & Payouts</h3>
          <p className="text-xs text-[#5a627a]">Track 80% escrow releases, Razorpay Route settlements, and bank details.</p>
        </Link>

        <Link
          href="/mentor/reviews"
          className="p-5 bg-white rounded-2xl border border-[#eef0f6] hover:border-purple-200 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between text-[#7922f5]">
            <Star className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-sm font-bold text-[#1e2433]">Mentee Reviews</h3>
          <p className="text-xs text-[#5a627a]">Read verified feedback from student roadmap sessions.</p>
        </Link>
      </div>

    </div>
  );
}
