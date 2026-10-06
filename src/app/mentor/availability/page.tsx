"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Calendar,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Coffee,
  CalendarDays,
  Settings,
  Sparkles,
  Zap,
  Globe,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Check,
  X,
  Loader2,
} from "lucide-react";
import {
  useMentorWorkingHours,
  useUpdateWorkingHoursMutation,
  useMentorSchedulingRules,
  useUpdateSchedulingRulesMutation,
  useMentorBlockedDates,
  useCreateBlockedDateMutation,
  useDeleteBlockedDateMutation,
  useMentorBreaks,
  useSetMentorBreakMutation,
  useDeleteBreakMutation,
  useMentorCalendarConnections,
  useToggleCalendarSyncMutation,
} from "@/hooks/useQueries";

interface Interval {
  start: string;
  end: string;
}

interface DaySchedule {
  day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
  enabled: boolean;
  intervals: Interval[];
}

const DEFAULT_DAYS: DaySchedule[] = [
  { day: "MONDAY", enabled: true, intervals: [{ start: "10:00", end: "18:00" }] },
  { day: "TUESDAY", enabled: true, intervals: [{ start: "10:00", end: "18:00" }] },
  { day: "WEDNESDAY", enabled: true, intervals: [{ start: "10:00", end: "18:00" }] },
  { day: "THURSDAY", enabled: true, intervals: [{ start: "10:00", end: "18:00" }] },
  { day: "FRIDAY", enabled: true, intervals: [{ start: "10:00", end: "18:00" }] },
  { day: "SATURDAY", enabled: false, intervals: [{ start: "10:00", end: "14:00" }] },
  { day: "SUNDAY", enabled: false, intervals: [{ start: "10:00", end: "14:00" }] },
];

export default function MentorAvailabilityPage() {
  const [activeTab, setActiveTab] = useState<
    "HOURS" | "RULES" | "BLOCKED" | "BREAK" | "CALENDAR"
  >("HOURS");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Queries & Mutations
  const { data: workingHoursData, isLoading: hoursLoading } = useMentorWorkingHours();
  const updateHoursMutation = useUpdateWorkingHoursMutation();

  const { data: rulesData, isLoading: rulesLoading } = useMentorSchedulingRules();
  const updateRulesMutation = useUpdateSchedulingRulesMutation();

  const { data: blockedDatesData } = useMentorBlockedDates();
  const createBlockedDateMutation = useCreateBlockedDateMutation();
  const deleteBlockedDateMutation = useDeleteBlockedDateMutation();

  const { data: breaksData } = useMentorBreaks();
  const setBreakMutation = useSetMentorBreakMutation();
  const deleteBreakMutation = useDeleteBreakMutation();

  const { data: calendarConnections } = useMentorCalendarConnections();
  const toggleCalendarMutation = useToggleCalendarSyncMutation();

  // Tab 1 State: Working Hours
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_DAYS);

  // Tab 2 State: Scheduling Rules
  const [minNoticeHours, setMinNoticeHours] = useState(12);
  const [maxFutureBookingDays, setMaxFutureBookingDays] = useState(30);
  const [bufferBeforeMinutes, setBufferBeforeMinutes] = useState(0);
  const [bufferAfterMinutes, setBufferAfterMinutes] = useState(15);
  const [slotIntervalMinutes, setSlotIntervalMinutes] = useState(30);
  const [maxBookingsPerDay, setMaxBookingsPerDay] = useState(4);

  // Tab 3 State: Blocked Dates Form
  const [blockedStartDate, setBlockedStartDate] = useState("");
  const [blockedEndDate, setBlockedEndDate] = useState("");
  const [blockedStartTime, setBlockedStartTime] = useState("");
  const [blockedEndTime, setBlockedEndTime] = useState("");
  const [blockedReason, setBlockedReason] = useState("VACATION");
  const [blockedNotes, setBlockedNotes] = useState("");

  // Tab 4 State: Break Mode Form
  const [breakStartDate, setBreakStartDate] = useState("");
  const [breakEndDate, setBreakEndDate] = useState("");
  const [breakReason, setBreakReason] = useState("");

  useEffect(() => {
    if (workingHoursData) {
      if (workingHoursData.timezone) setTimezone(workingHoursData.timezone);
      if (workingHoursData.weeklySchedule) setSchedule(workingHoursData.weeklySchedule as any);
    }
  }, [workingHoursData]);

  useEffect(() => {
    if (rulesData) {
      setMinNoticeHours(rulesData.minNoticeHours ?? 12);
      setMaxFutureBookingDays(rulesData.maxFutureBookingDays ?? 30);
      setBufferBeforeMinutes(rulesData.bufferBeforeMinutes ?? 0);
      setBufferAfterMinutes(rulesData.bufferAfterMinutes ?? 15);
      setSlotIntervalMinutes(rulesData.slotIntervalMinutes ?? 30);
      setMaxBookingsPerDay(rulesData.maxBookingsPerDay ?? 4);
    }
  }, [rulesData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Day Schedule Handlers
  const toggleDayEnabled = (dayIndex: number) => {
    setSchedule(
      schedule.map((d, i) => (i === dayIndex ? { ...d, enabled: !d.enabled } : d))
    );
  };

  const addIntervalToDay = (dayIndex: number) => {
    setSchedule(
      schedule.map((d, i) =>
        i === dayIndex
          ? {
              ...d,
              intervals: [...d.intervals, { start: "14:00", end: "18:00" }],
            }
          : d
      )
    );
  };

  const updateInterval = (
    dayIndex: number,
    intervalIndex: number,
    field: "start" | "end",
    val: string
  ) => {
    setSchedule(
      schedule.map((d, i) =>
        i === dayIndex
          ? {
              ...d,
              intervals: d.intervals.map((inv, idx) =>
                idx === intervalIndex ? { ...inv, [field]: val } : inv
              ),
            }
          : d
      )
    );
  };

  const removeIntervalFromDay = (dayIndex: number, intervalIndex: number) => {
    setSchedule(
      schedule.map((d, i) =>
        i === dayIndex
          ? {
              ...d,
              intervals: d.intervals.filter((_, idx) => idx !== intervalIndex),
            }
          : d
      )
    );
  };

  const handleSaveWorkingHours = async () => {
    try {
      await updateHoursMutation.mutateAsync({
        timezone,
        weeklySchedule: schedule,
      });
      showToast("Working hours & timezone saved successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to save working hours");
    }
  };

  const handleSaveRules = async () => {
    try {
      await updateRulesMutation.mutateAsync({
        minNoticeHours,
        maxFutureBookingDays,
        bufferBeforeMinutes,
        bufferAfterMinutes,
        slotIntervalMinutes,
        maxBookingsPerDay,
      });
      showToast("Scheduling rules updated successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to save scheduling rules");
    }
  };

  const handleCreateBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockedStartDate || !blockedEndDate) {
      showToast("Please specify both start and end date");
      return;
    }
    try {
      await createBlockedDateMutation.mutateAsync({
        startDate: blockedStartDate,
        endDate: blockedEndDate,
        startTime: blockedStartTime || null,
        endTime: blockedEndTime || null,
        reason: blockedReason as any,
        notes: blockedNotes || null,
      });
      showToast("Blocked period added successfully!");
      setBlockedStartDate("");
      setBlockedEndDate("");
      setBlockedStartTime("");
      setBlockedEndTime("");
      setBlockedNotes("");
    } catch (err: any) {
      showToast(err.message || "Failed to add blocked date");
    }
  };

  const handleDeleteBlockedDate = async (id: string) => {
    try {
      await deleteBlockedDateMutation.mutateAsync(id);
      showToast("Blocked period removed");
    } catch (err: any) {
      showToast(err.message || "Failed to remove blocked date");
    }
  };

  const handleSetBreak = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!breakStartDate || !breakEndDate) {
      showToast("Please specify break start and end date");
      return;
    }
    try {
      await setBreakMutation.mutateAsync({
        startDate: breakStartDate,
        endDate: breakEndDate,
        reason: breakReason || "Vacation & Personal Time Off",
        breakType: "VACATION",
        isActive: true,
      });
      showToast("Break scheduled! New bookings will be paused during this period.");
      setBreakStartDate("");
      setBreakEndDate("");
      setBreakReason("");
    } catch (err: any) {
      showToast(err.message || "Failed to set break");
    }
  };

  const handleDeleteBreak = async (id: string) => {
    try {
      await deleteBreakMutation.mutateAsync(id);
      showToast("Break mode removed. Slots are active again.");
    } catch (err: any) {
      showToast(err.message || "Failed to remove break");
    }
  };

  const handleToggleCalendarSync = async (connectionId: string, currentVal: boolean) => {
    try {
      await toggleCalendarMutation.mutateAsync({
        connectionId,
        syncEnabled: !currentVal,
      });
      showToast(`Calendar sync ${!currentVal ? "enabled" : "disabled"}`);
    } catch (err: any) {
      showToast(err.message || "Failed to toggle calendar sync");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#7922f5] text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-xs sm:text-sm flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
            <Link href="/mentor/dashboard" className="hover:text-[#7922f5]">Mentor</Link>
            <span>/</span>
            <span className="text-[#1e2433] font-semibold">Availability Hub</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Global Availability & Scheduling Rules
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Manage your weekly working hours, timezone, buffers, blocked vacation dates, and calendar integration.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold text-[#7922f5] bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100 flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span>{timezone}</span>
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] flex items-center space-x-1 overflow-x-auto">
        {[
          { id: "HOURS", label: "Working Hours", icon: Clock },
          { id: "RULES", label: "Scheduling Rules", icon: Settings },
          { id: "BLOCKED", label: "Blocked Dates", icon: CalendarDays },
          { id: "BREAK", label: "Take a Break", icon: Coffee },
          { id: "CALENDAR", label: "Calendar Sync", icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                active
                  ? "bg-[#7922f5] text-white shadow-sm shadow-purple-600/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: WORKING HOURS & TIMEZONE                                           */}
      {/* ========================================================================= */}
      {activeTab === "HOURS" && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#1e2433]">Weekly Schedule</h2>
              <p className="text-xs text-slate-500">
                Set regular recurring availability intervals. Students will only be able to book within these active blocks.
              </p>
            </div>

            {/* Timezone selector */}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-[#7922f5]" />
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5] bg-white"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST UTC+5:30)</option>
                <option value="America/New_York">America/New_York (EST UTC-5)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST UTC-8)</option>
                <option value="Europe/London">Europe/London (GMT UTC+0)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT UTC+8)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST UTC+4)</option>
              </select>
            </div>
          </div>

          {/* Days List */}
          <div className="space-y-4">
            {schedule.map((dayConfig, dayIdx) => (
              <div
                key={dayConfig.day}
                className={`p-4 rounded-2xl border transition-all ${
                  dayConfig.enabled
                    ? "bg-white border-slate-200 shadow-sm"
                    : "bg-slate-50/60 border-slate-100 opacity-60"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Day & Toggle */}
                  <div className="flex items-center space-x-3 w-40 shrink-0">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dayConfig.enabled}
                        onChange={() => toggleDayEnabled(dayIdx)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7922f5]" />
                    </label>

                    <span className="text-xs font-bold text-[#1e2433]">
                      {dayConfig.day}
                    </span>
                  </div>

                  {/* Middle: Intervals */}
                  <div className="flex-1 space-y-2">
                    {dayConfig.enabled ? (
                      dayConfig.intervals.map((inv, invIdx) => (
                        <div key={invIdx} className="flex items-center space-x-2">
                          <input
                            type="time"
                            value={inv.start}
                            onChange={(e) =>
                              updateInterval(dayIdx, invIdx, "start", e.target.value)
                            }
                            className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                          />
                          <span className="text-xs text-slate-400 font-bold">–</span>
                          <input
                            type="time"
                            value={inv.end}
                            onChange={(e) =>
                              updateInterval(dayIdx, invIdx, "end", e.target.value)
                            }
                            className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
                          />

                          {dayConfig.intervals.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeIntervalFromDay(dayIdx, invIdx)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Unavailable</span>
                    )}
                  </div>

                  {/* Right: Add Interval button */}
                  {dayConfig.enabled && (
                    <button
                      type="button"
                      onClick={() => addIntervalToDay(dayIdx)}
                      className="px-3 py-1.5 rounded-xl border border-purple-200 text-[#7922f5] hover:bg-purple-50 text-[11px] font-bold flex items-center space-x-1 shrink-0 self-start sm:self-center"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Interval</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSaveWorkingHours}
              disabled={updateHoursMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
            >
              {updateHoursMutation.isPending ? "Saving..." : "Save Working Hours"}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SCHEDULING RULES                                                   */}
      {/* ========================================================================= */}
      {activeTab === "RULES" && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-[#1e2433]">Booking Constraints & Buffer Rules</h2>
            <p className="text-xs text-slate-500">
              Configure minimum lead notice, maximum future booking window, preparation buffers, and daily limits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Minimum Notice */}
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Minimum Notice Required
              </label>
              <p className="text-[11px] text-slate-500">
                Prevent surprise last-minute bookings. Mentees cannot book slots sooner than this threshold.
              </p>
              <select
                value={minNoticeHours}
                onChange={(e) => setMinNoticeHours(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white"
              >
                <option value={1}>1 hour in advance</option>
                <option value={6}>6 hours in advance</option>
                <option value={12}>12 hours in advance (Recommended)</option>
                <option value={24}>24 hours in advance (1 day)</option>
                <option value={48}>48 hours in advance (2 days)</option>
              </select>
            </div>

            {/* Maximum Future Booking Window */}
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Maximum Future Booking Window
              </label>
              <p className="text-[11px] text-slate-500">
                How far into the future students can schedule a mentorship session.
              </p>
              <select
                value={maxFutureBookingDays}
                onChange={(e) => setMaxFutureBookingDays(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white"
              >
                <option value={7}>7 days (1 week)</option>
                <option value={14}>14 days (2 weeks)</option>
                <option value={30}>30 days (1 month - Recommended)</option>
                <option value={60}>60 days (2 months)</option>
                <option value={90}>90 days (3 months)</option>
              </select>
            </div>

            {/* Buffer After Session */}
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Buffer Time After Session
              </label>
              <p className="text-[11px] text-slate-500">
                Automatic break window to synthesize notes and avoid back-to-back fatigue.
              </p>
              <select
                value={bufferAfterMinutes}
                onChange={(e) => setBufferAfterMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white"
              >
                <option value={0}>0 minutes (Back-to-back)</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes (Recommended)</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>

            {/* Slot Interval */}
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Slot Start Time Increments
              </label>
              <p className="text-[11px] text-slate-500">
                Frequency of candidate slot start times displayed to mentees.
              </p>
              <select
                value={slotIntervalMinutes}
                onChange={(e) => setSlotIntervalMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white"
              >
                <option value={15}>Every 15 minutes (e.g. 5:00, 5:15, 5:30)</option>
                <option value={30}>Every 30 minutes (e.g. 5:00, 5:30 - Recommended)</option>
                <option value={60}>Every 60 minutes (e.g. 5:00, 6:00)</option>
              </select>
            </div>

            {/* Max Bookings Per Day */}
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800">
                Maximum Sessions Per Day
              </label>
              <p className="text-[11px] text-slate-500">
                Cap daily workload to protect your focus and quality of mentorship.
              </p>
              <input
                type="number"
                min={1}
                max={12}
                value={maxBookingsPerDay}
                onChange={(e) => setMaxBookingsPerDay(Number(e.target.value))}
                className="w-full sm:w-64 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSaveRules}
              disabled={updateRulesMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
            >
              {updateRulesMutation.isPending ? "Saving..." : "Save Scheduling Rules"}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BLOCKED DATES & TIME OVERRIDES                                      */}
      {/* ========================================================================= */}
      {activeTab === "BLOCKED" && (
        <div className="space-y-6">
          {/* Add Blocked Date Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
            <h2 className="text-base font-bold text-[#1e2433] pb-2 border-b border-slate-100">
              Block Unavailable Dates or Hours
            </h2>

            <form onSubmit={handleCreateBlockedDate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={blockedStartDate}
                    onChange={(e) => setBlockedStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={blockedEndDate}
                    onChange={(e) => setBlockedEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reason
                  </label>
                  <select
                    value={blockedReason}
                    onChange={(e) => setBlockedReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="VACATION">Vacation / Travel</option>
                    <option value="PERSONAL">Personal Commitment</option>
                    <option value="HOLIDAY">Public Holiday</option>
                    <option value="WORK">Work / Company Duty</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={createBlockedDateMutation.isPending}
                    className="w-full py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
                  >
                    {createBlockedDateMutation.isPending ? "Adding..." : "Block Time"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Active Blocked Dates List */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
            <h3 className="text-sm font-bold text-[#1e2433]">Active Blocked Periods</h3>

            {(!blockedDatesData || blockedDatesData.length === 0) ? (
              <div className="text-center py-8 text-xs text-slate-400 space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="font-bold text-slate-600">No dates currently blocked</p>
                <p>Your calendar is open according to your weekly working hours.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {blockedDatesData.map((bd: any) => (
                  <div
                    key={bd.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#1e2433]">
                          {new Date(bd.startDate).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          –{" "}
                          {new Date(bd.endDate).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          {bd.reason}
                        </span>
                      </div>
                      {bd.notes && <p className="text-xs text-slate-500">{bd.notes}</p>}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteBlockedDate(bd.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TAKE A BREAK / PAUSE AVAILABILITY                                   */}
      {/* ========================================================================= */}
      {activeTab === "BREAK" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
              <Coffee className="w-5 h-5 text-[#7922f5]" />
              <h2 className="text-base font-bold text-[#1e2433]">Take a Break / Vacation Mode</h2>
            </div>

            <p className="text-xs text-slate-500">
              Temporarily pause all incoming bookings while you are away or on leave. Existing confirmed sessions will remain intact, and availability will automatically resume once the break ends.
            </p>

            <form onSubmit={handleSetBreak} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Break Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={breakStartDate}
                    onChange={(e) => setBreakStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Break End Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={breakEndDate}
                    onChange={(e) => setBreakEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reason Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={breakReason}
                    onChange={(e) => setBreakReason(e.target.value)}
                    placeholder="e.g. Annual Leave, Family Vacation"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={setBreakMutation.isPending}
                className="px-6 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
              >
                {setBreakMutation.isPending ? "Scheduling..." : "Schedule Break Period"}
              </button>
            </form>
          </div>

          {/* Active Breaks */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
            <h3 className="text-sm font-bold text-[#1e2433]">Scheduled Break History</h3>

            {(!breaksData || breaksData.length === 0) ? (
              <p className="text-xs text-slate-400">No breaks currently scheduled.</p>
            ) : (
              <div className="space-y-3">
                {breaksData.map((b: any) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {new Date(b.startDate).toLocaleDateString("en-IN")} –{" "}
                        {new Date(b.endDate).toLocaleDateString("en-IN")}
                      </p>
                      <p className="text-[11px] text-slate-500">{b.reason || "Vacation Time"}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteBreak(b.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                    >
                      End Break
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: CALENDAR INTEGRATION & SYNC                                        */}
      {/* ========================================================================= */}
      {activeTab === "CALENDAR" && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-[#1e2433]">External Calendar Sync</h2>
            <p className="text-xs text-slate-500">
              Connect your Google Calendar or Microsoft Outlook to automatically block out busy events and prevent double-booking.
            </p>
          </div>

          <div className="space-y-4">
            {(calendarConnections || [
              { id: "cal-google", provider: "GOOGLE_CALENDAR", email: "mentor@company.com", syncEnabled: true },
            ]).map((conn: any) => (
              <div
                key={conn.id}
                className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7922f5] flex items-center justify-center font-bold">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1e2433]">
                      {conn.provider === "GOOGLE_CALENDAR" ? "Google Calendar" : "Microsoft Outlook"}
                    </h4>
                    <p className="text-[11px] text-slate-500">{conn.email || "Connected account"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      conn.syncEnabled
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {conn.syncEnabled ? "2-Way Sync Active" : "Sync Paused"}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleCalendarSync(conn.id, conn.syncEnabled)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-100"
                  >
                    {conn.syncEnabled ? "Pause Sync" : "Enable Sync"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
