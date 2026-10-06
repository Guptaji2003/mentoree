"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserCheck, Search, Star, Briefcase, ShieldCheck, DollarSign } from "lucide-react";
import { INITIAL_MENTORS } from "@/data/mockData";

export default function AdminMentorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = INITIAL_MENTORS.filter((m) => {
    if (selectedCategory !== "All" && m.category !== selectedCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q)
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
            <span className="text-[#1e2433] font-semibold">Mentors Directory</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Verified Mentor Catalog Management
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Manage active mentor profiles, verify badges, inspect pricing tiers, and monitor review scores.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-purple-50 text-[#7922f5] text-xs font-bold border border-purple-100">
          <ShieldCheck className="w-4 h-4" />
          <span>{INITIAL_MENTORS.length} Verified Mentors Active</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-[#9aa0b4] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by mentor name, company, role..."
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
                <th className="py-3 px-4">Mentor</th>
                <th className="py-3 px-4">Company & Role</th>
                <th className="py-3 px-4">Field</th>
                <th className="py-3 px-4 text-center">Rating</th>
                <th className="py-3 px-4 text-center">Mentees</th>
                <th className="py-3 px-4 text-right">Base Rate</th>
                <th className="py-3 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf2]">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-9 h-9 rounded-full object-cover border border-[#eaecf2]"
                      />
                      <div>
                        <div className="font-bold text-[#1e2433]">{m.name}</div>
                        <div className="text-[10px] text-[#9aa0b4]">{m.experienceYears} yrs experience</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#1e2433]">{m.company}</div>
                    <div className="text-[11px] text-[#7922f5]">{m.role}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{m.category}</td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center space-x-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{m.ratingAvg}</span>
                      <span className="text-[#9aa0b4] font-normal">({m.totalReviews})</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-[#1e2433]">{m.totalMenteesHelped}</td>
                  <td className="py-3.5 px-4 text-right font-black text-[#1e2433]">₹{m.hourlyRateINR}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      VERIFIED
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
