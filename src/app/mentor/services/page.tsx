"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Clock,
  DollarSign,
  CheckCircle2,
  PauseCircle,
  Archive,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  Check,
  X,
  AlertCircle,
  Sparkles,
  HelpCircle,
  Zap,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import {
  useMentorServices,
  useChangeServiceStatusMutation,
  useDeleteMentorServiceMutation,
} from "@/hooks/useQueries";

export default function MentorServicesPage() {
  const { data: services, isLoading } = useMentorServices();
  const changeStatusMutation = useChangeServiceStatusMutation();
  const deleteMutation = useDeleteMentorServiceMutation();

  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "PAUSED" | "DRAFT" | "ARCHIVED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    serviceId: string | null;
    serviceTitle: string;
  }>({
    isOpen: false,
    serviceId: null,
    serviceTitle: "",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "PUBLISHED" ? "PAUSED" : "PUBLISHED";
    try {
      await changeStatusMutation.mutateAsync({ id, status: newStatus });
      showToast(`Service status updated to ${newStatus}`);
    } catch (err: any) {
      showToast(err.message || "Failed to update status");
    }
  };

  const handleDeleteService = async () => {
    if (!deleteModal.serviceId) return;
    try {
      const res = await deleteMutation.mutateAsync(deleteModal.serviceId);
      showToast(res.message || "Service deleted/archived successfully");
      setDeleteModal({ isOpen: false, serviceId: null, serviceTitle: "" });
    } catch (err: any) {
      showToast(err.message || "Failed to delete service");
    }
  };

  // Fallback data
  const defaultServices = services || [
    {
      id: "srv-101",
      title: "1:1 Corporate Valuation & DCF Modeling",
      category: "Finance & Banking",
      durationMinutes: 60,
      priceINR: 1500,
      description: "Deep dive into financial modeling, sensitivity tables, and pitch-deck valuation casing.",
      bookingMode: "INSTANT",
      status: "PUBLISHED",
      popular: true,
      deliverables: ["DCF Template (.xlsx)", "M&A Case Feedback Notes"],
      _count: { bookings: 18 },
      serviceQuestions: [
        { id: "q1", question: "What valuation methods have you used before?", type: "SHORT_TEXT", required: true },
      ],
    },
    {
      id: "srv-102",
      title: "Management Consulting Case Interview Prep",
      category: "Management & Consulting",
      durationMinutes: 45,
      priceINR: 2000,
      description: "Interactive mock casing with structured market entry and profitability frameworks.",
      bookingMode: "APPROVAL_REQUIRED",
      status: "PUBLISHED",
      popular: false,
      deliverables: ["Framework Cheatsheet", "Recorded Case Critique"],
      _count: { bookings: 12 },
      serviceQuestions: [],
    },
    {
      id: "srv-103",
      title: "Resume & Portfolio Teardown",
      category: "Design & Product",
      durationMinutes: 45,
      priceINR: 999,
      description: "Comprehensive line-by-line review of your resume, ATS formatting, and case studies.",
      bookingMode: "INSTANT",
      status: "PAUSED",
      popular: false,
      deliverables: ["Annotated PDF Feedback"],
      _count: { bookings: 6 },
      serviceQuestions: [],
    },
  ];

  const filteredServices = defaultServices.filter((s: any) => {
    const matchesFilter = statusFilter === "ALL" || s.status === statusFilter;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
            <span className="text-[#1e2433] font-semibold">Services & Offerings</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight mt-1">
            Mentorship Services Catalog
          </h1>
          <p className="text-xs text-[#5a627a] mt-0.5">
            Configure 1:1 consultation offerings, durations, pricing, deliverables, custom booking questions, and booking modes.
          </p>
        </div>

        <Link
          href="/mentor/services/new"
          className="px-5 py-2.5 rounded-2xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Service</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-2 sm:pb-0">
          {[
            { id: "ALL", label: "All Offerings" },
            { id: "PUBLISHED", label: "Published" },
            { id: "PAUSED", label: "Paused" },
            { id: "DRAFT", label: "Drafts" },
            { id: "ARCHIVED", label: "Archived" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? "bg-[#7922f5] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search services by topic, title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#7922f5]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#eef0f6] space-y-3">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No {statusFilter.toLowerCase()} services found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create structured mentorship packages like resume teardowns, mock interviews, or career path consultation.
          </p>
          <Link
            href="/mentor/services/new"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#7922f5] text-white font-bold text-xs shadow-md shadow-purple-600/20 hover:bg-[#6819d4]"
          >
            Create Your First Service →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service: any) => {
            const isPublished = service.status === "PUBLISHED";
            const isPaused = service.status === "PAUSED";
            const isDraft = service.status === "DRAFT";
            const isArchived = service.status === "ARCHIVED";

            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#eef0f6] hover:border-purple-200 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Top: Category, Badges, & Status */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#7922f5] bg-purple-50 px-2.5 py-0.5 rounded-md">
                      {service.category}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isPublished
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : isPaused
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : isDraft
                          ? "bg-slate-100 text-slate-600"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#1e2433] leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {service.description}
                  </p>
                </div>

                {/* Middle: Duration, Price, Booking Mode */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5 text-slate-600 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#7922f5]" />
                      <span>{service.durationMinutes} minutes</span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-[#1e2433]">
                        ₹{service.priceINR.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl">
                    <span className="flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>
                        Mode:{" "}
                        <strong className="text-slate-800">
                          {service.bookingMode === "INSTANT"
                            ? "Instant Booking"
                            : "Approval Required"}
                        </strong>
                      </span>
                    </span>
                    <span>{service._count?.bookings || 0} Bookings</span>
                  </div>

                  {/* Deliverables tags */}
                  {service.deliverables && service.deliverables.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Includes:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {service.deliverables.map((d: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                          >
                            ✓ {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom: Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center space-x-2">
                    {/* Pause / Publish Toggle */}
                    {!isArchived && (
                      <button
                        onClick={() => handleToggleStatus(service.id, service.status)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                          isPublished
                            ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {isPublished ? "Pause" : "Publish"}
                      </button>
                    )}

                    <Link
                      href={`/mentor/services/${service.id}/edit`}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#7922f5] hover:bg-purple-50 transition-colors"
                      title="Edit Service"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>

                  {!isArchived && (
                    <button
                      onClick={() =>
                        setDeleteModal({
                          isOpen: true,
                          serviceId: service.id,
                          serviceTitle: service.title,
                        })
                      }
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete or Archive Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE / ARCHIVE MODAL                                                    */}
      {/* ========================================================================= */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Delete or Archive Service?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-slate-800">{deleteModal.serviceTitle}</span>?
                If historical bookings exist, the service will be safely archived to preserve past records.
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, serviceId: null, serviceTitle: "" })}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50"
              >
                Keep Service
              </button>
              <button
                type="button"
                onClick={handleDeleteService}
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Processing..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
