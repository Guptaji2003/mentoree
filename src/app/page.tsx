"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mentor, UserRole, AuditLog } from "@/types";
import { Navbar } from "@/components/Navbar";
import { MentorsDarkHero } from "@/components/MentorsDarkHero";
import { MentorDirectory } from "@/components/MentorDirectory";
import { MentorDetailModal } from "@/components/MentorDetailModal";
import { BookingFlowModal } from "@/components/BookingFlowModal";
import { VerificationPortalModal } from "@/components/VerificationPortalModal";
import { AdminVerificationDashboard } from "@/components/AdminVerificationDashboard";
import { StudentCareerLoop } from "@/components/StudentCareerLoop";
import { TestimonialsMasonry } from "@/components/TestimonialsMasonry";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { Footer } from "@/components/Footer";
import { CheckCircle2, Sparkles, X, Loader2, AlertCircle } from "lucide-react";

import { useMentors, useApproveMentorMutation, useRejectMentorMutation } from "@/hooks/useQueries";

export default function Home() {
  const router = useRouter();
  const isDark = false;
  const [activeRole, setActiveRole] = useState<UserRole>("STUDENT");

  // Search & Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // TanStack Query for Mentors Directory
  const { 
    data: mentors = [], 
    isLoading: loadingMentors, 
    error: mentorErrorObj, 
    refetch: fetchMentors 
  } = useMentors({ category: selectedCategory, search: searchTerm });

  const mentorError = mentorErrorObj ? (mentorErrorObj as Error).message : null;

  // Mutations
  const approveMutation = useApproveMentorMutation();
  const rejectMutation = useRejectMentorMutation();

  // Admin verification state
  const [pendingApplicants, setPendingApplicants] = useState<Mentor[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Modals state
  const [inspectingMentor, setInspectingMentor] = useState<Mentor | null>(null);
  const [bookingMentor, setBookingMentor] = useState<Mentor | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isCareerLoopModalOpen, setIsCareerLoopModalOpen] = useState<boolean>(false);

  // Toast Notification banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Remove dark class from root HTML for unified light theme
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleSelectMentorForInspect = (m: Mentor) => {
    setInspectingMentor(m);
  };

  const handleStartBooking = (m: Mentor) => {
    setInspectingMentor(null);
    setBookingMentor(m);
  };

  const handleBookingSuccess = (booking: any) => {
    fetchMentors();
    showToast(`🎉 Booking confirmed! Google Meet link created for your session.`);
  };

  const handleApproveMentor = async (mentorId: string) => {
    try {
      await approveMutation.mutateAsync(mentorId);
      showToast(`✅ Mentor application approved and published!`);
    } catch (err: any) {
      showToast(`⚠️ ${err.message}`);
    }
  };

  const handleRejectMentor = async (mentorId: string, reason: string) => {
    try {
      await rejectMutation.mutateAsync({ mentorId, reason });
      showToast(`⚠️ Rejection notice sent to applicant.`);
    } catch (err: any) {
      showToast(`⚠️ ${err.message}`);
    }
  };

  const scrollToDirectory = () => {
    const element = document.getElementById("mentor-directory-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#1e293b] font-sans antialiased selection:bg-purple-100 selection:text-purple-700">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-[#7922f5] text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between space-x-3 animate-slideIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-white/10 rounded-full text-white/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        isDark={false}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        onOpenVerification={() => setIsVerificationModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenActionPlan={() => setIsCareerLoopModalOpen(true)}
        onScrollToDirectory={scrollToDirectory}
      />

      {/* Sp!k Light Theme Hero Section */}
      <MentorsDarkHero
        isDark={false}
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        onSearch={setSearchTerm}
        onSelectMentor={handleSelectMentorForInspect}
        mentors={mentors}
        onOpenVerification={() => setIsVerificationModalOpen(true)}
        onScrollToDirectory={scrollToDirectory}
      />

      {/* Loading / Error States for Mentor Directory */}
      {loadingMentors ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#7922f5] animate-spin" />
          <p className="text-xs text-[#9aa0b4] font-semibold tracking-wider">Loading verified mentors from database...</p>
        </div>
      ) : mentorError ? (
        <div className="max-w-2xl mx-auto my-12 p-6 rounded-2xl bg-rose-50 border border-rose-100 text-center space-y-3 shadow-sm">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <p className="text-sm font-bold text-rose-700">{mentorError}</p>
          <button
            onClick={() => fetchMentors()}
            className="px-5 py-2 bg-[#7922f5] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#6819d4] transition-colors"
          >
            Retry Loading
          </button>
        </div>
      ) : (
        <MentorDirectory
          mentors={mentors}
          isDark={false}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelectMentor={handleSelectMentorForInspect}
          onQuickBook={handleStartBooking}
        />
      )}

      {/* Outcome Loop Highlight Banner */}
      <section className="py-8 sm:py-12 border-y bg-white border-[#eaecf2] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#f6f2fe] border border-purple-100 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#7922f5]">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Core Marketplace Differentiator</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-extrabold text-[#1e2433] leading-tight">
              “Don't just book a mentor. Build a career path with someone who's already walked it.”
            </h3>
            <p className="text-xs sm:text-sm text-[#5a627a] max-w-2xl leading-relaxed">
              Every 1:1 call includes pre-session context analysis and results in a structured post-session action plan with placement readiness tracking.
            </p>
          </div>

          <button
            onClick={() => setIsCareerLoopModalOpen(true)}
            className="w-full md:w-auto shrink-0 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-[#7922f5] hover:bg-[#6819d4] text-white shadow-md shadow-purple-600/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>Explore Career Outcome Loop</span>
            <span>→</span>
          </button>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorksSection isDark={false} onExplore={() => router.push("/mentors")} />

      {/* Testimonials Masonry Grid */}
      <TestimonialsMasonry isDark={false} />

      {/* Footer */}
      <Footer
        isDark={false}
        onOpenVerification={() => setIsVerificationModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onScrollToTop={scrollToTop}
      />

      {/* MODALS */}
      {/* 1. Mentor Profile Detail Modal */}
      <MentorDetailModal
        mentor={inspectingMentor}
        isOpen={!!inspectingMentor}
        onClose={() => setInspectingMentor(null)}
        isDark={false}
        onBookNow={handleStartBooking}
      />

      {/* 2. High-Concurrency Slot Hold & Razorpay Checkout Modal */}
      <BookingFlowModal
        mentor={bookingMentor}
        isOpen={!!bookingMentor}
        onClose={() => setBookingMentor(null)}
        isDark={false}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* 3. Mentor Verification / KYC Onboarding Modal */}
      <VerificationPortalModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        isDark={false}
        onSubmitApplication={() => {
          showToast("Application submitted! Logged in verification review queue.");
        }}
      />

      {/* 4. Admin Verification & Trust Console */}
      <AdminVerificationDashboard
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isDark={false}
        pendingMentors={pendingApplicants}
        onApproveMentor={handleApproveMentor}
        onRejectMentor={handleRejectMentor}
        auditLogs={auditLogs}
      />

      {/* 5. Student Career Outcome Loop Modal */}
      <StudentCareerLoop
        isOpen={isCareerLoopModalOpen}
        onClose={() => setIsCareerLoopModalOpen(false)}
        isDark={false}
        onExploreMentors={scrollToDirectory}
      />
    </div>
  );
}
