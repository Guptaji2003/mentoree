"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Video, 
  ExternalLink, 
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function VideoRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.id as string;
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooking() {
      try {
        const res = await fetch(`/api/bookings/${roomId}`);
        if (res.ok) {
          const data = await res.json();
          setBooking(data.data?.booking || null);
        }
      } catch (err) {
        console.error("Failed to fetch session:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBooking();
  }, [roomId]);

  const meetingUrl = booking?.meetingUrl || booking?.mentor?.meetingUrl || "https://meet.google.com/new";

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full bg-[#18181f] border border-white/10 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
          <Video className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Mentorship Session</span>
          </div>
          <h1 className="text-2xl font-black text-white">Join Your 1:1 Live Session</h1>
          <p className="text-sm text-gray-400">
            {booking ? `Session with ${booking.mentor?.user?.name || "Mentor"}` : "Direct Google Meet / Zoom connection"}
          </p>
        </div>

        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left space-y-2">
          <div className="text-xs text-gray-400">Direct Meeting URL:</div>
          <a
            href={meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-400 font-mono break-all hover:underline flex items-center space-x-1"
          >
            <span>{meetingUrl}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all"
          >
            <span>Launch Meeting Room</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <Link
            href="/dashboard"
            className="w-full py-3 px-6 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
