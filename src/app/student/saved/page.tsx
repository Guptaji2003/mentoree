"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star, Heart, Bookmark, ExternalLink, Trash2, Calendar, ShieldCheck } from "lucide-react";

export default function SavedMentorsPage() {
  const [savedMentors, setSavedMentors] = useState([
    {
      id: "m1",
      name: "Dr. Alex Kumar",
      headline: "Vice President • Quantitative Valuation & Equity Research @ Goldman Sachs",
      company: "Goldman Sachs",
      category: "Commerce & Finance",
      ratingAvg: 4.95,
      totalReviews: 38,
      hourlyRateINR: 1500,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      tags: ["DCF Valuation", "M&A", "Investment Banking", "Equity Research"],
    },
    {
      id: "m2",
      name: "Kathryn Murphy",
      headline: "Senior Strategy Consultant • Corporate Finance @ McKinsey & Company",
      company: "McKinsey & Company",
      category: "Business & Consulting",
      ratingAvg: 4.98,
      totalReviews: 54,
      hourlyRateINR: 2000,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      tags: ["Management Consulting", "Case Interview", "Business Strategy"],
    },
    {
      id: "m3",
      name: "Savannah Nguyen",
      headline: "Staff Software Engineer • High-Scale Systems @ Stripe",
      company: "Stripe",
      category: "Engineering",
      ratingAvg: 5.0,
      totalReviews: 42,
      hourlyRateINR: 1800,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      tags: ["Distributed Systems", "FinTech", "System Design"],
    }
  ]);

  const handleRemove = (id: string) => {
    setSavedMentors(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#1e293b] font-sans antialiased">
      {/* Header */}
      <header className="bg-white border-b border-[#eaecf2] h-[72px] px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1e2433] tracking-tight">
              Saved Mentors ({savedMentors.length})
            </h1>
            <p className="text-xs text-[#94a3b8] font-medium">Quick access to bookmarked industry mentors</p>
          </div>
        </div>

        <Link
          href="/mentors"
          className="px-5 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/20"
        >
          Discover More Mentors
        </Link>
      </header>

      {/* Main List */}
      <main className="max-w-6xl mx-auto p-6 sm:p-8">
        {savedMentors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#eef0f6] space-y-3">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No saved mentors yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Browse mentors in your domain and tap the bookmark icon to save them for later booking.
            </p>
            <Link
              href="/mentors"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#7922f5] text-white font-bold text-xs"
            >
              Browse Mentors →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedMentors.map((m) => (
              <div 
                key={m.id}
                className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] hover:border-purple-200 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3.5">
                      <img 
                        src={m.avatar} 
                        alt={m.name} 
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-100 shadow-sm"
                      />
                      <div>
                        <h3 className="font-bold text-base text-[#1e2433] leading-tight">{m.name}</h3>
                        <p className="text-xs font-semibold text-[#7922f5] mt-0.5">{m.company}</p>
                        <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold mt-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{m.ratingAvg}</span>
                          <span className="text-slate-400 font-normal">({m.totalReviews})</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(m.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-4 leading-relaxed font-medium">
                    {m.headline}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {m.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Session from</span>
                    <span className="text-sm font-extrabold text-slate-900">₹{m.hourlyRateINR.toLocaleString()}</span>
                  </div>

                  <Link
                    href={`/mentors?search=${encodeURIComponent(m.name)}`}
                    className="px-4 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-sm flex items-center space-x-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Slot</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
