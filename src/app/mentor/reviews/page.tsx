"use client";

import React from "react";
import Link from "next/link";
import { Star, ShieldCheck, Quote } from "lucide-react";

export default function MentorReviewsPage() {
  const reviews = [
    {
      id: "rev-1",
      mentee: "Pulkit Gupta (Stanford University)",
      rating: 5,
      date: "Oct 5, 2026",
      session: "1:1 Live System Design Teardown",
      comment: "Alex is truly in a league of his own! The architecture breakdown on event-driven queues gave me extreme clarity for staff-level interview loops.",
    },
    {
      id: "rev-2",
      mentee: "Jessia Rose (Harvard University)",
      rating: 5,
      date: "Oct 4, 2026",
      session: "Mock Technical Interview",
      comment: "Very realistic mock round and the structured feedback PDF pinpointed exactly where my algorithmic optimizations needed work.",
    },
    {
      id: "rev-3",
      mentee: "Rhea Sen (NIFT)",
      rating: 5,
      date: "Sep 28, 2026",
      session: "Resume & Portfolio Roast",
      comment: "Actionable, precise, and encouraging. The 10-minute slot hold and instant Google Meet link made the experience effortless.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
            <Link href="/mentor/dashboard" className="hover:text-[#7922f5]">Mentor</Link>
            <span>/</span>
            <span className="text-[#1e2433] font-semibold">Mentee Reviews</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Verified Student Ratings & Testimonials
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Reviews can only be submitted by students who completed a verified 1:1 video session.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>★ 4.98 Avg Rating (24 Reviews)</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1e2433]">{r.mentee}</h3>
                <p className="text-xs text-[#7922f5] font-semibold">{r.session}</p>
              </div>
              <div className="flex items-center space-x-1 text-amber-500">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
            </div>

            <p className="text-xs text-[#5a627a] leading-relaxed italic bg-[#f8f9fb] p-3.5 rounded-xl border border-[#eaecf2]">
              "{r.comment}"
            </p>

            <div className="text-[10px] text-[#9aa0b4] text-right">
              Verified Session Completed on {r.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
