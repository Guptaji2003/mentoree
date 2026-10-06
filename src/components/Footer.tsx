"use client";

import React from "react";
import { ShieldCheck, Heart, Github, Twitter, Linkedin, ExternalLink } from "lucide-react";

interface FooterProps {
  isDark: boolean;
  onOpenVerification: () => void;
  onOpenAdmin: () => void;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  isDark = false,
  onOpenVerification,
  onOpenAdmin,
  onScrollToTop,
}) => {
  return (
    <footer className={`border-t transition-colors duration-300 ${
      isDark
        ? "bg-[#0a0a0c] border-white/10 text-gray-400"
        : "bg-white border-[#eaecf2] text-[#5a627a]"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={onScrollToTop}>
              <div className="w-8 h-8 rounded-xl bg-[#7922f5] flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-purple-600/20">
                S
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-[#1e2433] font-sans">
                Sp<span className="text-[#7922f5]">!</span>k
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#5a627a]">
              The verified, goal-driven career guidance marketplace where access to senior practitioners is only the first step.
            </p>
            <div className="flex items-center space-x-2 pt-1 text-[#7922f5] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Corporate Proofs</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? "text-white" : "text-[#1e2433]"}`}>
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={onScrollToTop} className="hover:text-[#7922f5] transition-colors">Browse All Mentors</button></li>
              <li><button onClick={onOpenVerification} className="hover:text-[#7922f5] transition-colors">Become a Mentor (80% Payout)</button></li>
              <li><button onClick={onOpenAdmin} className="hover:text-[#7922f5] transition-colors">Admin Trust Verification Console</button></li>
              <li><a href="#mentor-directory-section" className="hover:text-[#7922f5] transition-colors">Placement Prep Specialists</a></li>
            </ul>
          </div>

          {/* Trust & Guarantees */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? "text-white" : "text-[#1e2433]"}`}>
              Architecture & Guarantees
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span>🔒 10-min Redis Hold Concurrency Lock</span></li>
              <li><span>🛡️ Escrow Payouts via Razorpay Route</span></li>
              <li><span>📄 Post-Session Action Plan Guarantee</span></li>
              <li><span>⏱️ Encrypted WebRTC / LiveKit Video</span></li>
            </ul>
          </div>

          {/* Target Audience */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? "text-white" : "text-[#1e2433]"}`}>
              Target Audience
            </h4>
            <p className="text-xs leading-relaxed text-[#5a627a]">
              Designed specifically for college students and professionals preparing for high-value campus & off-campus career milestones.
            </p>
            <div className="mt-3 text-[11px] text-[#9aa0b4]">
              Built with Next.js, TypeScript, and Tailwind CSS.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#eaecf2] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9aa0b4] gap-4">
          <div>
            © {new Date().getFullYear()} Sp!k Mentorship. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={onOpenVerification} className="hover:text-[#7922f5] transition-colors">Mentor Verification Protocol</button>
            <span>•</span>
            <button onClick={onOpenAdmin} className="hover:text-[#7922f5] transition-colors">Admin Audit Logs</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
