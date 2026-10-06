"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, CheckCircle2, Calendar, CreditCard, Shield, Trash2, Check } from "lucide-react";

interface NotificationItem {
  id: string;
  type: "BOOKING" | "PAYMENT" | "SESSION" | "SYSTEM";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      type: "BOOKING",
      title: "Booking Confirmed: 1:1 Valuation Session",
      message: "Your session with Dr. Alex Kumar (Goldman Sachs) has been confirmed for tomorrow at 06:00 PM IST.",
      time: "10 mins ago",
      read: false,
      actionUrl: "/student/sessions",
    },
    {
      id: "notif-2",
      type: "PAYMENT",
      title: "Payment Receipt: ₹1,500",
      message: "Razorpay payment (pay_Kx98710294821) successfully processed. Invoice ready for download.",
      time: "25 mins ago",
      read: false,
      actionUrl: "/student/payments",
    },
    {
      id: "notif-3",
      type: "SESSION",
      title: "Action Plan Deliverables Received",
      message: "Kathryn Murphy (McKinsey) uploaded 5 recommended case frameworks to your session history.",
      time: "2 days ago",
      read: true,
      actionUrl: "/student/sessions",
    },
    {
      id: "notif-4",
      type: "SYSTEM",
      title: "Profile Readiness: 85%",
      message: "Add your preferred mentorship budget to boost matching accuracy with domain leaders.",
      time: "4 days ago",
      read: true,
      actionUrl: "/student/profile?tab=mentorship",
    }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
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
              Notifications
            </h1>
            <p className="text-xs text-[#94a3b8] font-medium">Session reminders, booking alerts, and payment confirmations</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={markAllRead}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Mark all read
          </button>
          <button
            onClick={clearAll}
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto p-6 sm:p-8 space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#eef0f6] space-y-3">
            <Bell className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No new notifications</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You're all caught up! Booking updates and session reminders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div 
                key={n.id}
                className={`bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border transition-all flex items-start justify-between gap-4 ${
                  !n.read ? "border-purple-200 bg-[#fbf9fe]" : "border-[#eef0f6]"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    n.type === "BOOKING" ? "bg-[#f6f2fe] text-[#7922f5]" :
                    n.type === "PAYMENT" ? "bg-emerald-50 text-emerald-600" :
                    n.type === "SESSION" ? "bg-blue-50 text-blue-600" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {n.type === "BOOKING" ? <Calendar className="w-5 h-5" /> :
                     n.type === "PAYMENT" ? <CreditCard className="w-5 h-5" /> :
                     n.type === "SESSION" ? <CheckCircle2 className="w-5 h-5" /> :
                     <Bell className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-sm text-[#1e2433]">{n.title}</h3>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#7922f5]" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{n.message}</p>
                    <span className="text-[11px] text-slate-400 block pt-1">{n.time}</span>
                  </div>
                </div>

                {n.actionUrl && (
                  <Link
                    href={n.actionUrl}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#7922f5] hover:text-[#7922f5] text-xs font-bold text-slate-700 transition-all shrink-0"
                  >
                    View
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
