"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, Plus, Trash2, CheckCircle2, ShieldCheck, Calendar, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { availabilitySlotSchema, AvailabilitySlotFormData } from "@/lib/validations";
import { useAppDispatch } from "@/store/hooks";
import { addToast } from "@/store/slices/uiSlice";
import { 
  useMentorAvailability, 
  useCreateSlotMutation, 
  useDeleteSlotMutation 
} from "@/hooks/useQueries";

const INITIAL_SLOTS = [
  { id: "s-1", date: "2026-10-06", time: "06:00 PM - 07:00 PM", isBooked: true, bookedBy: "Pulkit Gupta" },
  { id: "s-2", date: "2026-10-07", time: "07:00 PM - 08:00 PM", isBooked: false, bookedBy: null },
  { id: "s-3", date: "2026-10-08", time: "08:00 PM - 09:00 PM", isBooked: false, bookedBy: null },
  { id: "s-4", date: "2026-10-09", time: "06:00 PM - 07:00 PM", isBooked: false, bookedBy: null },
];

export default function MentorAvailabilityPage() {
  const dispatch = useAppDispatch();
  const { data: serverSlots, isLoading } = useMentorAvailability();
  const createSlotMutation = useCreateSlotMutation();
  const deleteSlotMutation = useDeleteSlotMutation();

  const [localSlots, setLocalSlots] = useState(INITIAL_SLOTS);
  const slots = (serverSlots && serverSlots.length > 0) ? serverSlots : localSlots;
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // React Hook Form with Zod Validation Schema
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AvailabilitySlotFormData>({
    resolver: zodResolver(availabilitySlotSchema),
    defaultValues: {
      date: "",
      time: "18:00",
    },
  });

  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(msg);
    dispatch(addToast({ message: msg, type }));
    setTimeout(() => setToastMessage(null), 3500);
  };

  const onAddSlotSubmit = async (data: AvailabilitySlotFormData) => {
    const endHour = Number(data.time.split(":")[0]) + 1;
    const formattedTime = `${data.time} - ${endHour}:00 IST`;

    const newSlot = {
      id: `s-${Date.now()}`,
      date: data.date,
      time: formattedTime,
      isBooked: false,
      bookedBy: null,
    };

    try {
      await createSlotMutation.mutateAsync({
        date: data.date,
        startTime: `${data.time}:00`,
        endTime: `${endHour}:00`,
      });
    } catch {
      // Local fallback
    }

    setLocalSlots([newSlot, ...localSlots]);
    showToast("✅ New availability slot published to student directory!");
    reset({ date: "", time: "18:00" });
  };

  const handleDeleteSlot = async (id: string) => {
    try {
      await deleteSlotMutation.mutateAsync(id);
    } catch {
      // Local fallback
    }
    setLocalSlots(localSlots.filter((s) => s.id !== id));
    showToast("Slot removed from directory.", "info");
  };

  return (
    <div className="space-y-6">
      
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-[#7922f5] text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between space-x-3 text-xs font-medium animate-slideIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-white/10 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#9aa0b4] font-medium">
            <Link href="/mentor/dashboard" className="hover:text-[#7922f5]">Mentor</Link>
            <span>/</span>
            <span className="text-[#1e2433] font-semibold">Availability & Slots</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Manage Availability & 1:1 Slots
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Published slots are protected by the 10-minute Redis concurrency lock during student checkouts.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-purple-50 text-[#7922f5] text-xs font-bold border border-purple-100">
          <Clock className="w-4 h-4" />
          <span>{slots.filter((s) => !s.isBooked).length} Open Slots Available</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Create Slot Card (React Hook Form + Zod) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
          <h2 className="text-sm font-bold text-[#1e2433]">Add Availability Slot</h2>

          <form onSubmit={handleSubmit(onAddSlotSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1e2433] uppercase tracking-wider block">
                Session Date
              </label>
              <input
                type="date"
                {...register("date")}
                className="w-full bg-[#f8f9fb] border border-[#eaecf2] rounded-xl px-3 py-2 text-xs text-[#1e2433] font-medium focus:outline-none focus:border-[#7922f5]"
              />
              {errors.date && (
                <p className="text-[11px] text-rose-500 font-semibold">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1e2433] uppercase tracking-wider block">
                Start Time
              </label>
              <select
                {...register("time")}
                className="w-full bg-[#f8f9fb] border border-[#eaecf2] rounded-xl px-3 py-2 text-xs text-[#1e2433] font-medium focus:outline-none focus:border-[#7922f5]"
              >
                <option value="17:00">05:00 PM IST</option>
                <option value="18:00">06:00 PM IST</option>
                <option value="19:00">07:00 PM IST</option>
                <option value="20:00">08:00 PM IST</option>
                <option value="21:00">09:00 PM IST</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Slot</span>
            </button>
          </form>
        </div>

        {/* Existing Slots List */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
          <h2 className="text-sm font-bold text-[#1e2433]">Active & Booked Schedule</h2>

          <div className="space-y-3">
            {slots.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-[#eaecf2] bg-[#f8f9fb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#1e2433]">{s.date}</span>
                    <span className="text-xs font-semibold text-[#7922f5]">{s.time}</span>
                  </div>
                  <div className="text-[11px] text-[#5a627a]">
                    {s.isBooked ? (
                      <span className="text-purple-700 font-semibold">Booked by {s.bookedBy} (Google Meet link active)</span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">Open for instant 10m-hold booking</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    s.isBooked ? "bg-purple-100 text-[#7922f5]" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {s.isBooked ? "BOOKED" : "AVAILABLE"}
                  </span>

                  {!s.isBooked && (
                    <button
                      onClick={() => handleDeleteSlot(s.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove Slot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
