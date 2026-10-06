"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Layers,
  ArrowLeft,
  Clock,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  Video,
  X,
  Loader2,
} from "lucide-react";
import { useMentorServices, useUpdateMentorServiceMutation } from "@/hooks/useQueries";

interface CustomQuestionItem {
  id?: string;
  question: string;
  type: "SHORT_TEXT" | "LONG_TEXT" | "SINGLE_SELECT" | "MULTI_SELECT" | "NUMBER" | "URL";
  required: boolean;
  options: string[];
}

export default function EditMentorServicePage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id as string;

  const { data: services, isLoading } = useMentorServices();
  const updateServiceMutation = useUpdateMentorServiceMutation();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Engineering & Technology");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [priceINR, setPriceINR] = useState(1500);
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [sessionType, setSessionType] = useState<"VIDEO" | "AUDIO" | "CHAT">("VIDEO");
  const [bookingMode, setBookingMode] = useState<"INSTANT" | "APPROVAL_REQUIRED">("INSTANT");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "PAUSED" | "ARCHIVED">("PUBLISHED");
  const [targetAudience, setTargetAudience] = useState("");

  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [newDeliverable, setNewDeliverable] = useState("");

  const [customQuestions, setCustomQuestions] = useState<CustomQuestionItem[]>([]);

  useEffect(() => {
    if (services && serviceId) {
      const existing = services.find((s: any) => s.id === serviceId);
      if (existing) {
        setTitle(existing.title || "");
        setCategory(existing.category || "Engineering & Technology");
        setDurationMinutes(existing.durationMinutes || 60);
        setPriceINR(existing.priceINR || 1500);
        setDescription(existing.description || "");
        setDetailedDescription(existing.detailedDescription || "");
        setSessionType(existing.sessionType || "VIDEO");
        setBookingMode(existing.bookingMode || "INSTANT");
        setStatus(existing.status || "PUBLISHED");
        setTargetAudience(existing.targetAudience || "");
        setDeliverables(existing.deliverables || []);
        if (existing.serviceQuestions && existing.serviceQuestions.length > 0) {
          setCustomQuestions(
            existing.serviceQuestions.map((q: any) => ({
              id: q.id,
              question: q.question,
              type: q.type,
              required: q.required,
              options: q.options || [],
            }))
          );
        }
      }
    }
  }, [services, serviceId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const addDeliverable = () => {
    if (newDeliverable.trim().length > 0) {
      setDeliverables([...deliverables, newDeliverable.trim()]);
      setNewDeliverable("");
    }
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const addQuestion = () => {
    setCustomQuestions([
      ...customQuestions,
      {
        question: "",
        type: "SHORT_TEXT",
        required: true,
        options: [],
      },
    ]);
  };

  const updateQuestion = (index: number, updated: Partial<CustomQuestionItem>) => {
    setCustomQuestions(
      customQuestions.map((q, i) => (i === index ? { ...q, ...updated } : q))
    );
  };

  const removeQuestion = (index: number) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      showToast("Please enter a service title");
      return;
    }

    try {
      await updateServiceMutation.mutateAsync({
        id: serviceId,
        data: {
          title,
          category,
          durationMinutes,
          priceINR,
          description,
          detailedDescription: detailedDescription || undefined,
          sessionType,
          deliverables,
          targetAudience: targetAudience || undefined,
          bookingMode,
          status,
          customQuestions: customQuestions.filter((q) => q.question.trim().length > 0),
        },
      });

      showToast("Service updated successfully!");
      setTimeout(() => router.push("/mentor/services"), 1000);
    } catch (err: any) {
      showToast(err.message || "Failed to update service");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#7922f5] text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-xs sm:text-sm flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <Link
            href="/mentor/services"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1e2433] tracking-tight">
              Edit Mentorship Offering
            </h1>
            <p className="text-xs text-slate-500">
              Update pricing, deliverables, custom booking questions, and availability rules.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={updateServiceMutation.isPending}
          className="px-6 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
        >
          {updateServiceMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
        <h2 className="text-sm font-bold text-[#1e2433] pb-2 border-b border-slate-100">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Service Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Field Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white"
            >
              {[
                "Engineering & Technology",
                "Commerce & Finance",
                "Design & Creative Arts",
                "Management & Strategy",
                "Law & Legal Studies",
                "Medicine & Healthcare",
                "Science & Research",
                "Humanities & Social Sciences",
                "General Career Strategy",
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white font-bold"
            >
              <option value="PUBLISHED">Published (Bookable)</option>
              <option value="PAUSED">Paused (Temporarily Hidden)</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Short Summary Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
            />
          </div>
        </div>
      </div>

      {/* Duration & Pricing */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
        <h2 className="text-sm font-bold text-[#1e2433] pb-2 border-b border-slate-100">
          Duration & Pricing
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Duration (Minutes)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    durationMinutes === mins
                      ? "bg-[#7922f5] text-white border-[#7922f5]"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fee (₹ INR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                ₹
              </span>
              <input
                type="number"
                min={0}
                step={50}
                value={priceINR}
                onChange={(e) => setPriceINR(Number(e.target.value))}
                className="w-full pl-8 pr-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Deliverables */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
        <h2 className="text-sm font-bold text-[#1e2433] pb-2 border-b border-slate-100">
          Deliverables
        </h2>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {deliverables.map((d, index) => (
              <span
                key={index}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-purple-50 text-[#7922f5] border border-purple-100 text-xs font-semibold"
              >
                <span>✓ {d}</span>
                <button
                  type="button"
                  onClick={() => removeDeliverable(index)}
                  className="hover:text-rose-600 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newDeliverable}
              onChange={(e) => setNewDeliverable(e.target.value)}
              placeholder="e.g. Annotated portfolio critique..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200"
            />
            <button
              type="button"
              onClick={addDeliverable}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
            >
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
        <Link
          href="/mentor/services"
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={updateServiceMutation.isPending}
          className="px-6 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
        >
          {updateServiceMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
