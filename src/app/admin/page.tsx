"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Users, 
  UserCheck, 
  CalendarCheck, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles,
  ExternalLink,
  History,
  FileText,
  Lock,
  ChevronRight
} from "lucide-react";

export default function AdminOverviewDashboard() {
  const [stats, setStats] = useState({
    registeredStudents: 48,
    verifiedMentors: 20,
    pendingVerifications: 3,
    activeBookings: 8,
    completedSessions: 32,
    totalGMVINR: 128400,
    platformRevenueINR: 25680, // 20% fee
    escrowHeldINR: 14400,
    conversionRate: "18.4%",
    repeatBookingRate: "42.0%",
  });

  const pendingApplicants = [
    {
      id: "app-1",
      name: "Dr. Anirudh Sen",
      email: "anirudh.sen@aiims.edu",
      role: "Chief Resident / Neurobiology",
      company: "AIIMS Delhi",
      category: "Medical & Healthcare",
      appliedAt: "2 hours ago",
      docs: ["Official Work ID", "Degree Certificate"],
    },
    {
      id: "app-2",
      name: "Sanya Malhotra",
      email: "sanya.m@trilegal.com",
      role: "Senior Associate, Corporate M&A",
      company: "Trilegal",
      category: "Law & Legal Studies",
      appliedAt: "5 hours ago",
      docs: ["Bar Council ID", "Corporate Email Verified"],
    },
    {
      id: "app-3",
      name: "Rohan Varma",
      email: "rohan.v@goldmansachs.com",
      role: "VP Quantitative Strategy",
      company: "Goldman Sachs",
      category: "Commerce & Finance",
      appliedAt: "Yesterday",
      docs: ["Employment Proof", "Government ID"],
    },
  ];

  const recentSessions = [
    {
      id: "bk-101",
      studentName: "Pulkit Gupta",
      mentorName: "Alex Rivera",
      mentorCompany: "OpenAI",
      topic: "System Design & AI Architecture",
      amountINR: 2200,
      status: "CONFIRMED",
      time: "Today, 5:30 PM",
    },
    {
      id: "bk-102",
      studentName: "Jessia Rose",
      mentorName: "Kathryn Murphy",
      mentorCompany: "Google",
      topic: "Campus Placement Mock Interview",
      amountINR: 1800,
      status: "COMPLETED",
      time: "Yesterday, 3:00 PM",
    },
    {
      id: "bk-103",
      studentName: "Aman Gupta",
      mentorName: "Rohit Verma",
      mentorCompany: "Uber",
      topic: "High-Throughput Backend Engineering",
      amountINR: 1500,
      status: "ESCROW_HELD",
      time: "Tomorrow, 7:00 PM",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
            <Link href="/admin" className="hover:text-[#7922f5]">Admin Console</Link>
            <span>/</span>
            <span className="text-[#1e2433] font-semibold">Overview & KPIs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Platform Master Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#5a627a] mt-0.5">
            Real-time telemetry, verification queues, escrow balances, and marketplace metrics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/verifications"
            className="px-4 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all active:scale-95 flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Review KYC Applications (3)</span>
          </Link>
        </div>
      </div>

      {/* 4 Core KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* KPI 1: Total GMV */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#9aa0b4] uppercase tracking-wider">Gross Booking Volume</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7922f5] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1e2433]">₹{stats.totalGMVINR.toLocaleString()}</div>
          <div className="flex items-center space-x-1 text-[11px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.5% vs last month</span>
          </div>
        </div>

        {/* KPI 2: Platform Revenue (20%) */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#9aa0b4] uppercase tracking-wider">Platform Take (20%)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1e2433]">₹{stats.platformRevenueINR.toLocaleString()}</div>
          <div className="text-[11px] text-[#9aa0b4]">Escrow held: ₹{stats.escrowHeldINR.toLocaleString()}</div>
        </div>

        {/* KPI 3: Verified Mentors */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#9aa0b4] uppercase tracking-wider">Verified Mentors</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1e2433]">{stats.verifiedMentors}</div>
          <div className="flex items-center space-x-1 text-[11px] text-amber-600 font-bold">
            <span>3 KYC Reviews Pending</span>
          </div>
        </div>

        {/* KPI 4: Total Registered Students */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#9aa0b4] uppercase tracking-wider">Registered Students</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1e2433]">{stats.registeredStudents}</div>
          <div className="text-[11px] text-slate-500 font-medium">32 Completed 1:1 Sessions</div>
        </div>

      </div>

      {/* Main Grid: Pending KYC Queue & Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: KYC Verification Queue Preview */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#7922f5]" />
              <h2 className="text-sm font-bold text-[#1e2433]">Pending KYC Review Queue</h2>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-100">
                {pendingApplicants.length} Action Needed
              </span>
            </div>
            <Link
              href="/admin/verifications"
              className="text-xs text-[#7922f5] font-bold hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingApplicants.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl border border-[#eaecf2] bg-[#f8f9fb] hover:bg-white hover:border-purple-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-bold text-[#1e2433]">{app.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#f6f2fe] text-[#7922f5] border border-purple-100">
                      {app.company}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5a627a]">{app.role}</p>
                  <div className="flex items-center space-x-2 text-[10px] text-[#9aa0b4] pt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {app.appliedAt}
                    </span>
                    <span>•</span>
                    <span>Docs: {app.docs.join(", ")}</span>
                  </div>
                </div>

                <Link
                  href="/admin/verifications"
                  className="shrink-0 px-3.5 py-1.5 rounded-xl bg-white border border-[#e2e8f0] group-hover:border-[#7922f5] text-xs font-semibold text-[#1e2433] group-hover:text-[#7922f5] transition-colors"
                >
                  Review Application
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Live & Confirmed Bookings */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <CalendarCheck className="w-4 h-4 text-[#7922f5]" />
              <h2 className="text-sm font-bold text-[#1e2433]">Recent Sessions & Escrow</h2>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs text-[#7922f5] font-bold hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentSessions.map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl border border-[#eaecf2] bg-[#f8f9fb] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1e2433]">{s.studentName} → {s.mentorName}</span>
                  <span className="text-xs font-black text-[#1e2433]">₹{s.amountINR}</span>
                </div>
                <div className="text-[11px] text-[#5a627a] line-clamp-1">{s.topic}</div>
                <div className="flex items-center justify-between text-[10px] text-[#9aa0b4] pt-1 border-t border-slate-100">
                  <span>{s.time}</span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#7922f5] font-bold">
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
