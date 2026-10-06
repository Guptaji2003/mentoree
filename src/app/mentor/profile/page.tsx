"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, ShieldCheck, Building2, Mail, CheckCircle2, Award } from "lucide-react";

export default function MentorProfilePage() {
  const [headline, setHeadline] = useState("Staff AI Engineer @ OpenAI • Ex-Google Senior ML Lead");
  const [bio, setBio] = useState("Architecting massive-scale transformer training pipelines, distributed inference clusters, and LLM alignment. 9+ years of industry experience across OpenAI and Google.");
  const [rate, setRate] = useState(2200);
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
            <Link href="/mentor/dashboard" className="hover:text-[#7922f5]">Mentor</Link>
            <span>/</span>
            <span className="text-[#1e2433] font-semibold">My Mentor Profile</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Mentor Identity & Directory Profile
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Manage your public bio, corporate credentials, verified badges, and base hourly pricing.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-purple-50 text-[#7922f5] text-xs font-bold border border-purple-100">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Background Verified</span>
        </div>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center space-x-2 text-xs text-emerald-700 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes updated successfully!</span>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] max-w-2xl space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1e2433] uppercase tracking-wider block">
              Professional Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full bg-[#f8f9fb] border border-[#eaecf2] rounded-xl px-3.5 py-2.5 text-xs text-[#1e2433] font-medium focus:outline-none focus:border-[#7922f5]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1e2433] uppercase tracking-wider block">
              Mentor Bio / Overview
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#f8f9fb] border border-[#eaecf2] rounded-xl p-3 text-xs text-[#1e2433] font-medium focus:outline-none focus:border-[#7922f5]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1e2433] uppercase tracking-wider block">
              Base Session Rate (INR)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full bg-[#f8f9fb] border border-[#eaecf2] rounded-xl px-3.5 py-2.5 text-xs text-[#1e2433] font-bold focus:outline-none focus:border-[#7922f5]"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all active:scale-95"
          >
            Save Profile Updates
          </button>
        </form>
      </div>
    </div>
  );
}
