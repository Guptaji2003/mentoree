"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Layers,
  ArrowLeft,
  Clock,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Zap,
  ShieldCheck,
  Video,
  ListPlus,
  FileText,
  MessageSquare,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { useCreateMentorServiceMutation } from "@/hooks/useQueries";

interface CustomQuestionItem {
  id?: string;
  question: string;
  type: "SHORT_TEXT" | "LONG_TEXT" | "SINGLE_SELECT" | "MULTI_SELECT" | "NUMBER" | "URL";
  required: boolean;
  options: string[];
}

export default function CreateMentorServicePage() {
  const router = useRouter();
  const createServiceMutation = useCreateMentorServiceMutation();

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
  const [targetAudience, setTargetAudience] = useState("");

  // Deliverables & Topics tag inputs
  const [deliverables, setDeliverables] = useState<string[]>([
    "Actionable roadmap & next steps",
    "Written notes & resource links",
  ]);
  const [newDeliverable, setNewDeliverable] = useState("");

  const [topicsCovered, setTopicsCovered] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState("");

  // Custom Pre-Session Booking Questions
  const [customQuestions, setCustomQuestions] = useState<CustomQuestionItem[]>([
    {
      question: "What is your main goal for this session?",
      type: "LONG_TEXT",
      required: true,
      options: [],
    },
    {
      question: "What is your current academic/career situation?",
      type: "SHORT_TEXT",
      required: true,
      options: [],
    },
  ]);

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

  const addTopic = () => {
    if (newTopic.trim().length > 0) {
      setTopicsCovered([...topicsCovered, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const removeTopic = (index: number) => {
    setTopicsCovered(topicsCovered.filter((_, i) => i !== index));
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

  const handleSubmit = async (status: "PUBLISHED" | "DRAFT") => {
    if (!title.trim()) {
      showToast("Please enter a service title");
      return;
    }
    if (!description.trim() || description.length < 10) {
      showToast("Please provide a short description of at least 10 characters");
      return;
    }

    try {
      await createServiceMutation.mutateAsync({
        title,
        category,
        durationMinutes,
        priceINR,
        currency: "INR",
        description,
        detailedDescription: detailedDescription || undefined,
        sessionType,
        deliverables,
        topicsCovered,
        targetAudience: targetAudience || undefined,
        bookingMode,
        status,
        popular: false,
        customQuestions: customQuestions.filter((q) => q.question.trim().length > 0),
      });

      showToast(`Service ${status === "PUBLISHED" ? "published" : "saved as draft"} successfully!`);
      setTimeout(() => router.push("/mentor/services"), 1000);
    } catch (err: any) {
      showToast(err.message || "Failed to create service");
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
              Create Mentorship Offering
            </h1>
            <p className="text-xs text-slate-500">
              Define your session details, what mentees will get, pre-session brief questions, and booking mode.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => handleSubmit("DRAFT")}
            disabled={createServiceMutation.isPending}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={createServiceMutation.isPending}
            className="px-5 py-2 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all disabled:opacity-50 flex items-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{createServiceMutation.isPending ? "Publishing..." : "Publish Service"}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: BASIC INFORMATION                                              */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7922f5] flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h2 className="text-sm font-bold text-[#1e2433]">Basic Information</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Service Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 1:1 Corporate Valuation & DCF Modeling, Resume Teardown"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Domain / Field Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5] bg-white"
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
              Who is this session for?
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Undergrads preparing for placement case studies"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Short Summary Description <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="1-2 sentences highlighting the focus of this 1:1 session..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Description & Agenda (Optional)
            </label>
            <textarea
              rows={3}
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              placeholder="Detailed breakdown of how the call will be structured..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: SESSION & PRICING                                              */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7922f5] flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h2 className="text-sm font-bold text-[#1e2433]">Session Duration & Pricing</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              Session Fee (₹ INR) <span className="text-rose-500">*</span>
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
            <p className="text-[10px] text-slate-400 mt-1">
              You receive 80% net take (₹{Math.round(priceINR * 0.8).toLocaleString()})
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Session Format
            </label>
            <div className="flex items-center space-x-2 py-1">
              <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-[#7922f5] font-bold text-xs flex items-center space-x-1 border border-purple-100">
                <Video className="w-3.5 h-3.5" />
                <span>Google Meet 1:1 Call</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: WHAT THE STUDENT GETS                                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7922f5] flex items-center justify-center font-bold text-xs">
            3
          </div>
          <h2 className="text-sm font-bold text-[#1e2433]">What Students Get / Deliverables</h2>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            Included Deliverables & Takeaways
          </label>
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
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDeliverable())}
              placeholder="e.g. Annotated portfolio critique, Framework cheat sheet..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
            />
            <button
              type="button"
              onClick={addDeliverable}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: BOOKING PREFERENCES & MODE                                     */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7922f5] flex items-center justify-center font-bold text-xs">
            4
          </div>
          <h2 className="text-sm font-bold text-[#1e2433]">Booking Mode & Acceptance</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Instant Booking */}
          <div
            onClick={() => setBookingMode("INSTANT")}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
              bookingMode === "INSTANT"
                ? "border-[#7922f5] bg-purple-50/40"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 font-bold text-xs text-[#1e2433]">
                <Zap className="w-4 h-4 text-[#7922f5]" />
                <span>Instant Booking (Recommended)</span>
              </span>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  bookingMode === "INSTANT"
                    ? "border-[#7922f5] bg-[#7922f5]"
                    : "border-slate-300"
                }`}
              >
                {bookingMode === "INSTANT" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Students choose an available slot in your calendar, payment is verified, and the booking is instantly confirmed.
            </p>
          </div>

          {/* Mentor Approval Required */}
          <div
            onClick={() => setBookingMode("APPROVAL_REQUIRED")}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
              bookingMode === "APPROVAL_REQUIRED"
                ? "border-[#7922f5] bg-purple-50/40"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 font-bold text-xs text-[#1e2433]">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Mentor Approval Required</span>
              </span>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  bookingMode === "APPROVAL_REQUIRED"
                    ? "border-[#7922f5] bg-[#7922f5]"
                    : "border-slate-300"
                }`}
              >
                {bookingMode === "APPROVAL_REQUIRED" && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Students submit their session goals and slot request. You review the mentee's brief and explicitly approve or decline before confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 5: CUSTOM PRE-SESSION QUESTIONS BUILDER                           */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7922f5] flex items-center justify-center font-bold text-xs">
              5
            </div>
            <h2 className="text-sm font-bold text-[#1e2433]">Pre-Session Mentee Questions</h2>
          </div>

          <button
            type="button"
            onClick={addQuestion}
            className="px-3 py-1.5 rounded-xl border border-purple-200 text-[#7922f5] hover:bg-purple-50 font-bold text-xs transition-colors flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Gather critical background context from the student before the video call begins.
        </p>

        <div className="space-y-3">
          {customQuestions.map((q, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Question #{index + 1}
                </span>

                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-1.5 text-xs text-slate-600 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) => updateQuestion(index, { required: e.target.checked })}
                      className="rounded text-[#7922f5] focus:ring-[#7922f5]"
                    />
                    <span>Required</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => updateQuestion(index, { question: e.target.value })}
                    placeholder="e.g. What specific topic or interview framework do you want to practice?"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5] bg-white"
                  />
                </div>

                <div>
                  <select
                    value={q.type}
                    onChange={(e) => updateQuestion(index, { type: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5] bg-white font-medium"
                  >
                    <option value="SHORT_TEXT">Short Text</option>
                    <option value="LONG_TEXT">Long Text (Textarea)</option>
                    <option value="URL">Resume / Portfolio URL</option>
                    <option value="NUMBER">Number</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
        <Link
          href="/mentor/services"
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={() => handleSubmit("PUBLISHED")}
          disabled={createServiceMutation.isPending}
          className="px-6 py-2.5 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
        >
          {createServiceMutation.isPending ? "Creating Service..." : "Publish Mentorship Offering"}
        </button>
      </div>
    </div>
  );
}
