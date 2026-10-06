"use client";

import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";

interface TestimonialsMasonryProps {
  isDark: boolean;
}

const TESTIMONIALS = [
  {
    quote: "I had a fantastic conversation with Kathryn! I learned how to structure my system design answers and received constructive feedback on my portfolio.",
    name: "Maren Rhiel Madsen",
    role: "Participant, University of Victoria",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    mentor: "Kathryn Murphy (Google)",
  },
  {
    quote: "I had an amazing conversation with Alex! I gained valuable insights into the AI/ML design process and received constructive feedback on my research repo.",
    name: "Miracle Saris",
    role: "Enrollee, University of Montreal",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    mentor: "Alex Rivera (OpenAI)",
  },
  {
    quote: "Just had a super fun chat with Menghani! Learned a ton about the design process and got some awesome real-time Figma feedback!",
    name: "Tiana Bergson",
    role: "Attended, University of Quebec",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80",
    mentor: "Menghani Alex (Apple)",
  },
  {
    quote: "Priya gave me a precise 3-month DSA roadmap that helped me crack the Microsoft on-campus placement interview!",
    name: "Phillip Stanton",
    role: "Learner, University of Calgary",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    mentor: "Priya Sharma (Microsoft)",
  },
  {
    quote: "The pre-session context intake and post-session action plan were game changers. We jumped straight into actionable code reviews without wasting a minute.",
    name: "Alfonso Vetrovs",
    role: "Scholar, University of Vancouver",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    mentor: "Rohit Verma (Uber)",
  },
  {
    quote: "The 10-minute slot hold and instant Razorpay payment made the entire booking seamless. Savannah's APM case breakdown was top tier!",
    name: "Chance Saris",
    role: "Pupil, University of Ottawa",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    mentor: "Savannah Nguyen (Stripe)",
  },
];

export const TestimonialsMasonry: React.FC<TestimonialsMasonryProps> = ({ isDark }) => {
  return (
    <section className={`py-16 sm:py-20 transition-colors duration-300 ${
      isDark ? "bg-[#0f0f12] text-white" : "bg-white text-[#1e2433]"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className={`text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full ${
            isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-[#f6f2fe] text-[#7922f5] border border-purple-100"
          }`}>
            Real Student Outcomes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans text-[#1e2433]">
            Stories from Verified Mentee Sessions
          </h2>
          <p className={`text-xs sm:text-sm font-medium ${isDark ? "text-gray-400" : "text-[#5a627a]"}`}>
            See what students and early-career professionals achieve after 1:1 sessions with verified practitioners.
          </p>
        </div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between space-y-5 ${
                isDark
                  ? "bg-[#17171e] border-white/10 hover:border-emerald-500/40"
                  : "bg-white border-[#eef0f6] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-purple-200"
              }`}
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed italic ${
                  isDark ? "text-gray-200" : "text-[#5a627a]"
                }`}>
                  "{t.quote}"
                </p>
              </div>

              <div className={`pt-4 border-t flex items-center justify-between ${
                isDark ? "border-white/10" : "border-slate-100"
              }`}>
                <div className="flex items-center space-x-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-purple-100"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#1e2433]">{t.name}</h4>
                    <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-[#9aa0b4]"}`}>
                      {t.role}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isDark 
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                    : "bg-[#f6f2fe] text-[#7922f5] border border-purple-100"
                }`}>
                  {t.mentor.split(" ")[0]}'s Mentee
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
