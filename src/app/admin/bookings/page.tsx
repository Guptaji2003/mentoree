"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CalendarCheck, Search, Video, Clock, DollarSign, CheckCircle2 } from "lucide-react";

export default function AdminBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const bookings = [
    {
      id: "bk-101",
      studentName: "Pulkit Gupta",
      studentEmail: "pulkit.gupta@stanford.edu",
      mentorName: "Alex Rivera",
      mentorCompany: "OpenAI",
      topic: "System Design & AI Architecture",
      date: "Oct 5, 2026",
      time: "05:30 PM - 06:30 PM",
      amountINR: 2200,
      escrowStatus: "HELD_IN_ESCROW",
      status: "CONFIRMED",
      meetUrl: "https://meet.google.com/abc-defg-hij",
    },
    {
      id: "bk-102",
      studentName: "Jessia Rose",
      studentEmail: "jessia.rose@harvard.edu",
      mentorName: "Kathryn Murphy",
      mentorCompany: "Google",
      topic: "Campus Placement Mock Interview",
      date: "Oct 4, 2026",
      time: "03:00 PM - 03:45 PM",
      amountINR: 1800,
      escrowStatus: "RELEASED_TO_MENTOR",
      status: "COMPLETED",
      meetUrl: "https://meet.google.com/xyz-uvwx-rst",
    },
    {
      id: "bk-103",
      studentName: "Aman Gupta",
      studentEmail: "aman.g@iitd.ac.in",
      mentorName: "Rohit Verma",
      mentorCompany: "Uber",
      topic: "High-Throughput Backend Engineering",
      date: "Oct 6, 2026",
      time: "07:00 PM - 08:00 PM",
      amountINR: 1500,
      escrowStatus: "HELD_IN_ESCROW",
      status: "CONFIRMED",
      meetUrl: "https://meet.google.com/pqr-stuv-wxy",
    },
  ];

  const filtered = bookings.filter((b) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        b.studentName.toLowerCase().includes(q) ||
        b.mentorName.toLowerCase().includes(q) ||
        b.topic.toLowerCase().includes(q)
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
            <span className="text-[#1e2433] font-semibold">Bookings & Sessions</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Live Sessions & Escrow Protection
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Real-time session status, 10-minute hold lock verification, Google Meet links, and escrow release ledger.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-purple-50 text-[#7922f5] text-xs font-bold border border-purple-100">
          <CalendarCheck className="w-4 h-4" />
          <span>{bookings.length} Tracked Sessions</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6]">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-[#9aa0b4] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, mentor, or session topic..."
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
                <th className="py-3 px-4">Booking ID & Topic</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Mentor</th>
                <th className="py-3 px-4">Scheduled Time</th>
                <th className="py-3 px-4 text-center">Amount</th>
                <th className="py-3 px-4 text-center">Escrow State</th>
                <th className="py-3 px-4 text-right">Session Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf2]">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#1e2433]">{b.topic}</div>
                    <div className="text-[10px] text-[#9aa0b4] font-mono">{b.id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#1e2433]">{b.studentName}</div>
                    <div className="text-[10px] text-[#9aa0b4]">{b.studentEmail}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#1e2433]">{b.mentorName}</div>
                    <div className="text-[10px] text-[#7922f5]">{b.mentorCompany}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <div>{b.date}</div>
                    <div className="text-[10px] text-[#9aa0b4]">{b.time}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-black text-[#1e2433]">₹{b.amountINR}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-50 text-[#7922f5] border border-purple-100">
                      {b.escrowStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      b.status === "COMPLETED" 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {b.status}
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
