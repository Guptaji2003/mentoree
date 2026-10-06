"use client";

import React from "react";
import Link from "next/link";
import { Tag, Plus, CheckCircle2 } from "lucide-react";

export default function AdminTaxonomyPage() {
  const categories = [
    { name: "Engineering & Technology", mentorsCount: 6, skills: ["System Design", "Distributed Systems", "Cloud/DevOps", "AI/ML"] },
    { name: "Computer Science & IT", mentorsCount: 5, skills: ["DSA Prep", "Full Stack", "Cybersecurity", "Blockchain"] },
    { name: "Commerce & Finance", mentorsCount: 3, skills: ["Investment Banking", "Quantitative Finance", "Valuations", "CA Prep"] },
    { name: "Business & Management", mentorsCount: 2, skills: ["Product Strategy", "Growth Marketing", "Case Interviews", "B2B SaaS"] },
    { name: "Medical & Healthcare", mentorsCount: 2, skills: ["USMLE Prep", "Clinical Residency", "Neurobiology", "Healthcare AI"] },
    { name: "Law & Legal Studies", mentorsCount: 2, skills: ["Corporate M&A", "Litigation", "IP Law", "Judicial Services"] },
    { name: "Design & Creative Arts", mentorsCount: 2, skills: ["Figma UI/UX", "Design Systems", "Design Roasts", "Visual Branding"] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
            <Link href="/admin" className="hover:text-[#7922f5]">Admin</Link>
            <span>/</span>
            <span className="text-[#1e2433] font-semibold">Taxonomy & Catalog</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Academic & Industry Taxonomy
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Manage field classifications, specializations, and searchable skill tags for accurate mentor discovery.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((c, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1e2433]">{c.name}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f6f2fe] text-[#7922f5] border border-purple-100">
                {c.mentorsCount} Mentors
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {c.skills.map((s, sIdx) => (
                <span key={sIdx} className="px-2.5 py-1 rounded-lg bg-[#f8f9fb] border border-[#eaecf2] text-slate-600 text-xs font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
