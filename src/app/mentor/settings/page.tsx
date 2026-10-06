"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Settings, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function MentorSettingsPage() {
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST +05:30)");
  const [notifyOnBooking, setNotifyOnBooking] = useState(true);
  const [autoHold, setAutoHold] = useState(true);
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
            <span className="text-[#1e2433] font-semibold">Settings & Notifications</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Account Preferences & Integration
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Configure calendar sync, timezones, and instant WhatsApp / Email booking alerts.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center space-x-2 text-xs text-emerald-700 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] max-w-2xl space-y-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1e2433] uppercase tracking-wider block">
              Default Calendar Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-[#f8f9fb] border border-[#eaecf2] rounded-xl px-3.5 py-2.5 text-xs text-[#1e2433] font-medium focus:outline-none focus:border-[#7922f5]"
            >
              <option value="Asia/Kolkata (IST +05:30)">Asia/Kolkata (IST +05:30)</option>
              <option value="America/New_York (EST -05:00)">America/New_York (EST -05:00)</option>
              <option value="America/Los_Angeles (PST -08:00)">America/Los_Angeles (PST -08:00)</option>
              <option value="Europe/London (GMT +00:00)">Europe/London (GMT +00:00)</option>
            </select>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100 text-xs text-slate-700 font-medium">
            <label className="flex items-center space-x-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notifyOnBooking}
                onChange={(e) => setNotifyOnBooking(e.target.checked)}
                className="w-4 h-4 rounded accent-[#7922f5]"
              />
              <span>Send instant email alerts when a student books a session</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoHold}
                onChange={(e) => setAutoHold(e.target.checked)}
                className="w-4 h-4 rounded accent-[#7922f5]"
              />
              <span>Enable 10-minute hold concurrency lock on my calendar</span>
            </label>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all active:scale-95"
          >
            Save Preferences
          </button>
        </form>
      </div>
    </div>
  );
}
