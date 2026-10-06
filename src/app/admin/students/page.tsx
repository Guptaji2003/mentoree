"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Search, GraduationCap, Building2, Calendar, CheckCircle2, UserX, UserCheck } from "lucide-react";

export default function AdminStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const [students, setStudents] = useState([
    {
      id: "std-1",
      name: "Pulkit Gupta",
      email: "pulkit.gupta@stanford.edu",
      field: "Engineering & Technology",
      specialization: "Distributed Systems & Full Stack",
      targetRole: "Senior Software Engineer",
      completionScore: 90,
      sessionsBooked: 4,
      joinedDate: "Sep 15, 2026",
      status: "ACTIVE",
    },
    {
      id: "std-2",
      name: "Jessia Rose",
      email: "jessia.rose@harvard.edu",
      field: "Commerce & Finance",
      specialization: "Investment Banking & Private Equity",
      targetRole: "Private Equity Analyst",
      completionScore: 85,
      sessionsBooked: 3,
      joinedDate: "Sep 20, 2026",
      status: "ACTIVE",
    },
    {
      id: "std-3",
      name: "Aman Gupta",
      email: "aman.g@iitd.ac.in",
      field: "Computer Science & Engineering",
      specialization: "Cloud Infrastructure",
      targetRole: "Staff Platform Engineer",
      completionScore: 78,
      sessionsBooked: 2,
      joinedDate: "Sep 24, 2026",
      status: "ACTIVE",
    },
    {
      id: "std-4",
      name: "Rhea Sen",
      email: "rhea.sen@nift.ac.in",
      field: "Design & Creative Arts",
      specialization: "UI/UX & Product Design",
      targetRole: "Lead Product Designer",
      completionScore: 92,
      sessionsBooked: 5,
      joinedDate: "Sep 28, 2026",
      status: "ACTIVE",
    },
  ]);

  const filtered = students.filter((s) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.field.toLowerCase().includes(q) ||
        s.targetRole.toLowerCase().includes(q)
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
            <span className="text-[#1e2433] font-semibold">Students & Users</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Enrolled Student Directory
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Monitor student career profiles, profile completion metrics, and booking histories.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-purple-50 text-[#7922f5] text-xs font-bold border border-purple-100">
          <Users className="w-4 h-4" />
          <span>{students.length} Registered Students</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] flex items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-[#9aa0b4] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, college, email..."
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
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Field & Specialization</th>
                <th className="py-3 px-4">Target Role</th>
                <th className="py-3 px-4 text-center">Profile Completion</th>
                <th className="py-3 px-4 text-center">Sessions</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf2]">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#1e2433]">{s.name}</div>
                    <div className="text-[11px] text-[#9aa0b4]">{s.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <div className="font-semibold text-[#1e2433]">{s.field}</div>
                    <div className="text-[10px] text-[#9aa0b4]">{s.specialization}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#7922f5]">{s.targetRole}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                      {s.completionScore}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-[#1e2433]">{s.sessionsBooked}</td>
                  <td className="py-3.5 px-4 text-[#9aa0b4]">{s.joinedDate}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {s.status}
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
