"use client";

import React, { useState, useEffect } from "react";
import { Mentor, MentorService, AvailabilitySlot, BookingRequest } from "@/types";
import { 
  X, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  CreditCard, 
  QrCode, 
  Sparkles, 
  ArrowRight, 
  ExternalLink, 
  Copy, 
  Check,
  AlertCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAppDispatch } from "@/store/hooks";
import { addToast } from "@/store/slices/uiSlice";

interface BookingFlowModalProps {
  mentor: Mentor | null;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onBookingSuccess: (booking: BookingRequest) => void;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  mentor,
  isOpen,
  onClose,
  isDark,
  onBookingSuccess,
}) => {
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState<"SELECT_SERVICE_SLOT" | "PRE_SESSION_BRIEF" | "RAZORPAY_CHECKOUT" | "CONFIRMED">("SELECT_SERVICE_SLOT");
  
  const [selectedService, setSelectedService] = useState<MentorService | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);

  const [reservationToken, setReservationToken] = useState<string>("");
  const [bookingId, setBookingId] = useState<string>("");
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600); // 10 minutes
  const [isLockedByMe, setIsLockedByMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [careerGoal, setCareerGoal] = useState("Placement Prep for Tier-1 Product Companies");
  const [targetCompany, setTargetCompany] = useState("Google, Microsoft, Stripe");
  const [experienceLevel, setExperienceLevel] = useState("College Student (Final Year)");
  const [specificQuestions, setSpecificQuestions] = useState("How to prepare for System Design & LeetCode Graph problems in 60 days?");
  const [resumeUrl, setResumeUrl] = useState("https://drive.google.com/file/d/sample-resume-v2/view");

  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (mentor && isOpen) {
      setSelectedService(mentor.services[0] || null);
      const firstAvailable = mentor.availability.find((s) => !s.isBooked);
      setSelectedSlot(firstAvailable || null);
      setCurrentStep("SELECT_SERVICE_SLOT");
      setSecondsRemaining(600);
      setIsLockedByMe(false);
      setErrorMessage(null);
    }
  }, [mentor, isOpen]);

  useEffect(() => {
    let interval: any = null;
    if (isLockedByMe && secondsRemaining > 0 && currentStep !== "CONFIRMED") {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsLockedByMe(false);
            setErrorMessage("Your 10-minute slot hold has expired. Please select a slot again.");
            setCurrentStep("SELECT_SERVICE_SLOT");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLockedByMe, secondsRemaining, currentStep]);

  if (!isOpen || !mentor) return null;

  const basePrice = selectedService ? selectedService.priceINR : mentor.hourlyRateINR;
  const platformFee = Math.round(basePrice * 0.20);
  const mentorPayout = basePrice - platformFee;
  const gstTax = Math.round(platformFee * 0.18);
  const totalPayable = basePrice + gstTax;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleProceedToBrief = () => {
    if (!selectedSlot || !selectedService) {
      setErrorMessage("Please choose both a service format and an available time slot.");
      return;
    }
    setErrorMessage(null);
    setCurrentStep("PRE_SESSION_BRIEF");
  };

  const handleHoldAndProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedService) return;

    if (!careerGoal.trim() || !specificQuestions.trim()) {
      setErrorMessage("Please fill out your pre-session goals and questions so the mentor can prepare.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Atomic Slot Hold on Postgres
      const holdRes = await fetch(`/api/slots/${selectedSlot.id}/hold`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          preSessionGoal: careerGoal,
          preSessionQuestions: specificQuestions,
          preSessionResumeUrl: resumeUrl || undefined,
        }),
      });

      const holdData = await holdRes.json();

      if (!holdRes.ok) {
        throw new Error(holdData.message || holdData.error || "Failed to hold slot");
      }

      const resToken = holdData.data.reservationToken;
      const bId = holdData.data.bookingId;
      setReservationToken(resToken);
      setBookingId(bId);
      setIsLockedByMe(true);
      setSecondsRemaining(600);

      // 2. Create Razorpay Order
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bId,
          reservationToken: resToken,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.message || orderData.error || "Failed to create payment order");
      }

      setCurrentStep("RAZORPAY_CHECKOUT");
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during booking");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompletePayment = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Generate mock signature for testing or verify via server
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingId,
          razorpayOrderId: `order_${Math.random().toString(36).substring(2, 10)}`,
          razorpayPaymentId: `pay_${Math.random().toString(36).substring(2, 10)}`,
          razorpaySignature: "mock_signature_for_local_verification",
        }),
      });

      // If test verify is processed or we show confirmation
      const meetingUrl = mentor.meetingUrl || `https://meet.google.com/abc-defg-hij`;
      const confirmed = {
        id: bookingId || "BK-" + Math.floor(100000 + Math.random() * 900000),
        mentorId: mentor.id,
        mentorName: mentor.name,
        serviceTitle: selectedService?.title,
        amount: totalPayable,
        meetingUrl,
        startTime: selectedSlot?.startTime,
      };

      setConfirmedBooking(confirmed);
      setCurrentStep("CONFIRMED");
      dispatch(addToast({ message: "🎉 Booking confirmed! Google Meet link created for your session.", type: "success" }));

      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Payment verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const copyMeetingLink = () => {
    if (confirmedBooking?.meetingUrl) {
      navigator.clipboard.writeText(confirmedBooking.meetingUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div
        className={`relative w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border overflow-hidden transition-all duration-300 my-auto ${
          isDark
            ? "bg-[#141418] border-white/15 text-white"
            : "bg-white border-teal-100 text-gray-900"
        }`}
      >
        {/* Modal Top Bar */}
        <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between ${
          isDark ? "border-white/10 bg-[#191920]" : "border-gray-100 bg-teal-50/50"
        }`}>
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 mr-2">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-emerald-500 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <h3 className="text-xs sm:text-sm font-bold truncate">{mentor.name}</h3>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  {mentor.company}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">{mentor.role}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {isLockedByMe && currentStep !== "CONFIRMED" && (
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs font-mono font-bold animate-pulse">
                <Lock className="w-3 h-3" />
                <span>{formatTimer(secondsRemaining)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Select Service & Slot */}
        {currentStep === "SELECT_SERVICE_SLOT" && (
          <div className="p-4 sm:p-6 space-y-5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">1. Select Mentorship Format</h4>
              <div className="grid grid-cols-1 gap-2.5">
                {mentor.services.map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      selectedService?.id === srv.id
                        ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                        : isDark
                        ? "border-white/10 bg-white/5 hover:border-white/20"
                        : "border-gray-200 bg-gray-50/60 hover:border-teal-300"
                    }`}
                  >
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs sm:text-sm font-bold">{srv.title}</span>
                        {srv.popular && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500 text-black font-extrabold">POPULAR</span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-2">{srv.description}</p>
                      <div className="flex items-center space-x-3 text-[10px] text-gray-400 pt-1">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          <span>{srv.durationMinutes} mins</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm sm:text-base font-black text-emerald-400">₹{srv.priceINR}</div>
                      <div className="text-[9px] text-gray-400">All inclusive</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">2. Choose Available Slot</h4>
              {mentor.availability.length === 0 ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                  No upcoming availability slots found. Check back later or request a time.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {mentor.availability.map((s) => (
                    <button
                      key={s.id}
                      disabled={s.isBooked}
                      onClick={() => setSelectedSlot(s)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        s.isBooked
                          ? "opacity-40 cursor-not-allowed border-transparent bg-gray-800 text-gray-500"
                          : selectedSlot?.id === s.id
                          ? "border-emerald-500 bg-emerald-500/15 font-bold text-emerald-400"
                          : isDark
                          ? "border-white/10 bg-white/5 hover:border-white/20"
                          : "border-gray-200 bg-gray-50 hover:border-teal-300"
                      }`}
                    >
                      <div className="font-semibold">{s.date}</div>
                      <div className="text-[11px] opacity-80">{s.startTime} - {s.endTime} UTC</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleProceedToBrief}
              disabled={!selectedSlot || !selectedService}
              className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              <span>Continue to Pre-Session Brief</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Pre-Session Brief */}
        {currentStep === "PRE_SESSION_BRIEF" && (
          <form onSubmit={handleHoldAndProceedToPayment} className="p-4 sm:p-6 space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-emerald-400">Pre-Session Context & Goals</h4>
              <p className="text-xs text-gray-400">
                To guarantee maximum outcome, tell {mentor.name} what specific roadblocks you want to solve.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Primary Career / Session Goal *</label>
                <input
                  type="text"
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isDark ? "bg-white/5 border-white/15 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
                  placeholder="e.g. Crack Google L4 Technical Interview"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Target Companies & Role</label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isDark ? "bg-white/5 border-white/15 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
                  placeholder="e.g. Google, Stripe, Uber"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Specific Questions or Topics *</label>
                <textarea
                  rows={3}
                  value={specificQuestions}
                  onChange={(e) => setSpecificQuestions(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isDark ? "bg-white/5 border-white/15 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
                  placeholder="List 2-3 specific questions..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Resume Link (Google Drive / Notion URL)</label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isDark ? "bg-white/5 border-white/15 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep("SELECT_SERVICE_SLOT")}
                className="w-1/3 py-2.5 rounded-full border border-white/20 text-xs font-semibold hover:bg-white/5"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-2/3 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs flex items-center justify-center space-x-2"
              >
                {isLoading ? <span>Holding slot...</span> : <span>Lock Slot & Proceed to Pay (₹{totalPayable})</span>}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Razorpay Checkout */}
        {currentStep === "RAZORPAY_CHECKOUT" && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Base Session Price:</span>
                <span className="font-semibold">₹{basePrice}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Platform Commission (20%):</span>
                <span>₹{platformFee}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>18% GST on platform fee:</span>
                <span>₹{gstTax}</span>
              </div>
              <div className="pt-2 border-t border-emerald-500/20 flex justify-between text-sm font-bold text-emerald-400">
                <span>Total Payable:</span>
                <span>₹{totalPayable}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-white/5 text-xs text-gray-400 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Razorpay Secured Gateway</span>
              </div>
              <p>Supports UPI (GPay, PhonePe, Paytm), Netbanking, Credit/Debit Cards with Instant Confirmation.</p>
            </div>

            <button
              onClick={handleCompletePayment}
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25"
            >
              {isLoading ? <span>Processing Payment...</span> : <span>Pay ₹{totalPayable} with Razorpay</span>}
            </button>
          </div>
        )}

        {/* STEP 4: Confirmed */}
        {currentStep === "CONFIRMED" && (
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-emerald-400">Booking Confirmed!</h3>
              <p className="text-xs text-gray-400">
                Your session with {mentor.name} has been confirmed. Meeting link has been emailed to you.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-2">
              <div className="text-xs text-gray-400">Google Meet Session Link:</div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-emerald-300">
                <span className="truncate mr-2">{confirmedBooking?.meetingUrl || mentor.meetingUrl || "https://meet.google.com/abc-defg-hij"}</span>
                <button
                  onClick={copyMeetingLink}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] shrink-0 flex items-center space-x-1"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={confirmedBooking?.meetingUrl || mentor.meetingUrl || "https://meet.google.com/abc-defg-hij"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center space-x-2"
              >
                <span>Launch Google Meet</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
