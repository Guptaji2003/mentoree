"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Shield, Bell, Eye, Trash2, CheckCircle2, AlertTriangle, KeyRound } from "lucide-react";

export default function StudentSettingsPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [profileVisibility, setProfileVisibility] = useState<"PUBLIC" | "MENTORS_ONLY" | "PRIVATE">("MENTORS_ONLY");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [marketingUpdates, setMarketingUpdates] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match.");
      return;
    }
    showToast("Password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSavePrivacy = () => {
    showToast(`Privacy settings updated: Visibility is now ${profileVisibility.replace("_", " ")}.`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#1e293b] font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#7922f5] text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-xs sm:text-sm flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-[#eaecf2] h-[72px] px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1e2433] tracking-tight">
              Settings & Privacy
            </h1>
            <p className="text-xs text-[#94a3b8] font-medium">Manage your security credentials, notifications, and profile visibility</p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto p-6 sm:p-8 space-y-6">
        
        {/* 1. Profile Visibility & Privacy */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <Eye className="w-5 h-5 text-[#7922f5]" />
            <div>
              <h2 className="text-base font-bold text-[#1e2433]">Profile Visibility</h2>
              <p className="text-xs text-slate-400">Control who can discover and view your academic & career goals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "PUBLIC", title: "Public", desc: "Visible to all students, mentors & guests" },
              { id: "MENTORS_ONLY", title: "Mentors Only", desc: "Only verified mentors can view details (Recommended)" },
              { id: "PRIVATE", title: "Private", desc: "Only visible to you until you book a session" }
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => setProfileVisibility(opt.id as any)}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-1 ${
                  profileVisibility === opt.id
                    ? "border-[#7922f5] bg-[#f6f2fe]/60 ring-2 ring-purple-100"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <span className="font-bold text-xs text-slate-900 block">{opt.title}</span>
                <p className="text-[11px] text-slate-500">{opt.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSavePrivacy}
              className="px-5 py-2 rounded-xl bg-[#7922f5] text-white font-bold text-xs hover:bg-[#6819d4]"
            >
              Save Visibility
            </button>
          </div>
        </div>

        {/* 2. Notification Preferences */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-[#7922f5]" />
            <div>
              <h2 className="text-base font-bold text-[#1e2433]">Notification Preferences</h2>
              <p className="text-xs text-slate-400">Configure email and platform alert triggers</p>
            </div>
          </div>

          <div className="space-y-3 divide-y divide-slate-100 text-xs">
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="font-bold text-slate-900 block">Session Reminders</span>
                <p className="text-slate-500">Receive email alerts 1 hour and 15 minutes before your call</p>
              </div>
              <input 
                type="checkbox" 
                checked={sessionReminders} 
                onChange={(e) => setSessionReminders(e.target.checked)}
                className="w-4 h-4 rounded text-[#7922f5] focus:ring-0 cursor-pointer" 
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="font-bold text-slate-900 block">Booking & Payment Receipts</span>
                <p className="text-slate-500">Instant email notifications when booking is confirmed or receipt is ready</p>
              </div>
              <input 
                type="checkbox" 
                checked={emailNotifications} 
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-[#7922f5] focus:ring-0 cursor-pointer" 
              />
            </div>
          </div>
        </div>

        {/* 3. Password & Authentication */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <Lock className="w-5 h-5 text-[#7922f5]" />
            <div>
              <h2 className="text-base font-bold text-[#1e2433]">Security & Password</h2>
              <p className="text-xs text-slate-400">Change your password and secure your session token</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
              <input 
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
              <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
                required
              />
            </div>

            <div className="sm:col-span-3 flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-black"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>

        {/* 4. Danger Zone */}
        <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-200 space-y-3">
          <div className="flex items-center space-x-2 text-rose-700 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Danger Zone</span>
          </div>
          <p className="text-xs text-rose-600">
            Permanently delete your student profile, career goals, and session history. This action cannot be reversed.
          </p>
          <button
            onClick={() => {
              if (confirm("Are you absolutely sure you want to delete your student account?")) {
                showToast("Account deletion requested.");
              }
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm"
          >
            Delete Account
          </button>
        </div>

      </main>
    </div>
  );
}
