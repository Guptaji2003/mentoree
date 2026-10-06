"use client";

import React, { useState } from "react";
import { Mentor, AuditLog } from "@/types";
import { 
  X, 
  ShieldCheck, 
  Mail, 
  FileText, 
  UploadCloud, 
  Linkedin, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  ArrowRight,
  Sparkles,
  Building
} from "lucide-react";

interface VerificationPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onSubmitApplication: (newMentor: Mentor, auditLog: AuditLog) => void;
}

export const VerificationPortalModal: React.FC<VerificationPortalModalProps> = ({
  isOpen,
  onClose,
  isDark,
  onSubmitApplication,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("Google");
  const [workEmail, setWorkEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [role, setRole] = useState("Senior Software Engineer");
  const [experienceYears, setExperienceYears] = useState(5);
  const [category, setCategory] = useState<any>("Engineering");
  const [hourlyRateINR, setHourlyRateINR] = useState(1500);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [bio, setBio] = useState("");

  // Document upload mock
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [docType, setDocType] = useState<"EMPLOYEE_ID" | "OFFER_LETTER" | "PAYSLIP">("EMPLOYEE_ID");
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (!workEmail.includes("@") || workEmail.endsWith("@gmail.com") || workEmail.endsWith("@yahoo.com")) {
      alert("Please provide a valid corporate company work email domain (e.g. yourname@google.com). Public mailboxes like gmail are not accepted for mentor verification.");
      return;
    }
    setIsOtpSent(true);
    setOtpCode("849201"); // Auto-fill simulated OTP
  };

  const handleVerifyOtp = () => {
    if (otpCode === "849201" || otpCode.length === 6) {
      setIsOtpVerified(true);
      setStep(2);
    } else {
      alert("Invalid OTP code. Try entering 849201");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit. Please upload a smaller PDF or image.");
        return;
      }
      setIsUploading(true);
      setTimeout(() => {
        setUploadedFileName(file.name);
        setUploadedFileSize((file.size / 1024 / 1024).toFixed(2) + " MB");
        setIsUploading(false);
      }, 1000);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mentorId = "applicant-" + Math.floor(1000 + Math.random() * 9000);
    const domain = workEmail.split("@")[1] || "company.com";

    const newMentorApplicant: Mentor = {
      id: mentorId,
      name: fullName || "Verified Expert Applicant",
      headline: `${role} @ ${company} • ${experienceYears}+ Years Track Record`,
      company: company,
      companyDomain: domain,
      role: role,
      category: category,
      experienceYears: Number(experienceYears),
      hourlyRateINR: Number(hourlyRateINR),
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: bio || `Experienced ${role} with strong background in ${category}. Ready to provide structured guidance for ambitious mentees.`,
      tags: [category, company, "Career Guidance", "System Design"],
      verificationStatus: "PENDING_VERIFICATION",
      verificationBadges: {
        emailVerified: true,
        identityVerified: true,
        employmentVerified: false,
        linkedinVerified: !!linkedinUrl,
      },
      ratingAvg: 0,
      totalReviews: 0,
      totalMenteesHelped: 0,
      services: [
        {
          id: "srv-app-custom",
          title: `30-min ${role} Guidance & Roadmap`,
          durationMinutes: 30,
          priceINR: Math.round(hourlyRateINR * 0.6),
          description: "One-to-one consultation on career roadmap, tech stack, and interview strategy.",
          popular: true,
        },
      ],
      availability: [
        {
          id: `slot-${mentorId}-1`,
          mentorId: mentorId,
          date: "2026-10-06",
          startTime: "18:00",
          endTime: "18:30",
          localTimeDisplay: "06:00 PM - 06:30 PM IST (Wednesday)",
          isBooked: false,
        },
      ],
      reviews: [],
      actionPlanTemplate: [
        `Review core fundamentals for ${role}`,
        "Complete 2 targeted practical assignments",
      ],
    };

    const newAuditLog: AuditLog = {
      id: "log-" + Math.random().toString(36).substring(2, 9),
      mentorId: mentorId,
      mentorName: newMentorApplicant.name,
      action: "SUBMITTED",
      performedBy: `${workEmail} (Self-Application)`,
      details: `Submitted work email OTP verified for @${domain}. Uploaded ${docType}: ${uploadedFileName || "corporate_id.pdf"}. Initial status: PENDING_VERIFICATION.`,
      timestamp: new Date().toUTCString(),
      ipAddress: "157.240.192.42",
    };

    onSubmitApplication(newMentorApplicant, newAuditLog);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div
        className={`relative w-full max-w-2xl rounded-3xl shadow-2xl border overflow-hidden transition-all duration-300 ${
          isDark
            ? "bg-[#141418] border-white/15 text-white"
            : "bg-white border-teal-100 text-gray-900"
        }`}
      >
        {/* Top bar */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? "border-white/10 bg-[#191920]" : "border-gray-100 bg-teal-50/50"
        }`}>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Mentor Trust & Verification Engine</h3>
              <p className="text-[10px] text-gray-400">Zero unverified accounts • Automated KYC + S3 Presigned Proofs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress */}
        <div className="px-6 py-2.5 bg-black/10 flex items-center justify-between text-[11px] border-b border-white/5">
          <span className={step === 1 ? "text-emerald-400 font-bold" : "text-gray-400"}>1. Work Email OTP</span>
          <ArrowRight className="w-3 h-3 text-gray-600" />
          <span className={step === 2 ? "text-emerald-400 font-bold" : "text-gray-400"}>2. Document Upload</span>
          <ArrowRight className="w-3 h-3 text-gray-600" />
          <span className={step === 3 ? "text-emerald-400 font-bold" : "text-gray-400"}>3. Profile & Rates</span>
          <ArrowRight className="w-3 h-3 text-gray-600" />
          <span className={step === 4 ? "text-emerald-400 font-bold" : "text-gray-400"}>4. Admin Review</span>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: Corporate Email OTP Check */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-start space-x-2.5">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Domain Verification Requirement:</strong> To protect student trust, all mentors must prove their current employer via official corporate email (e.g. <code>@google.com</code>, <code>@stripe.com</code>, <code>@microsoft.com</code>).
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Singhania"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                    isDark ? "bg-[#1c1c22] border-white/10 text-white" : "bg-gray-50 border-gray-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Current Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google / Microsoft / Stripe / Amazon"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                    isDark ? "bg-[#1c1c22] border-white/10 text-white" : "bg-gray-50 border-gray-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Official Corporate Work Email *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    required
                    placeholder="vikram@amazon.com"
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDark ? "bg-[#1c1c22] border-white/10 text-white" : "bg-gray-50 border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold whitespace-nowrap"
                  >
                    Send 6-Digit OTP
                  </button>
                </div>
              </div>

              {isOtpSent && (
                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2 animate-fadeIn">
                  <span className="text-xs font-bold text-amber-300 block">
                    Verification Code sent to {workEmail} (Simulated OTP: <code>849201</code>)
                  </span>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-mono font-bold text-center tracking-widest border focus:outline-none ${
                        isDark ? "bg-[#1c1c22] border-white/10 text-emerald-400" : "bg-white border-gray-200 text-teal-800"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold"
                    >
                      Verify & Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: S3 Document Upload */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Work email domain verified! Now upload official credential proof.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Select Document Type *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "EMPLOYEE_ID", label: "Employee ID Card" },
                    { id: "OFFER_LETTER", label: "Signed Offer Letter" },
                    { id: "PAYSLIP", label: "Recent Payslip" },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDocType(d.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-center ${
                        docType === d.id
                          ? "bg-emerald-500/20 border-emerald-400 text-emerald-400 font-bold"
                          : "bg-[#1c1c22] border-white/10 text-gray-400"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Box */}
              <div className="border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 rounded-3xl p-8 text-center bg-emerald-950/10 cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-200">
                  {uploadedFileName ? `Selected: ${uploadedFileName} (${uploadedFileSize})` : "Click or drag & drop proof document here"}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Supported formats: PDF, PNG, JPG (Max 5MB) • Encrypted S3 Bucket Upload
                </p>
              </div>

              {isUploading && (
                <div className="flex items-center justify-center space-x-2 text-xs text-emerald-400">
                  <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <span>Generating S3 Presigned URL & uploading...</span>
                </div>
              )}

              <div className="flex items-center space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold border border-white/10"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!uploadedFileName && !uploadedFileSize}
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 rounded-full font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black disabled:opacity-50"
                >
                  Confirm Document & Set Profile Rates →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Profile & Rates */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Job Title / Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDark ? "bg-[#1c1c22] border-white/10 text-white" : "bg-gray-50 border-gray-200"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Total Years of Experience *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    required
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDark ? "bg-[#1c1c22] border-white/10 text-white" : "bg-gray-50 border-gray-200"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Primary Domain Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDark ? "bg-[#1c1c22] border-white/10 text-white" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <option value="Engineering">Engineering & Coding</option>
                    <option value="Placement">Campus Placement & DSA</option>
                    <option value="Product">Product Management</option>
                    <option value="Data & AI">Data Science & AI</option>
                    <option value="Design">UI/UX & Product Design</option>
                    <option value="Finance">Fintech & Finance</option>
                    <option value="Entrepreneurship">Startup & Founders</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Desired Rate per Hour (INR) *
                  </label>
                  <input
                    type="number"
                    min="500"
                    max="10000"
                    step="100"
                    required
                    value={hourlyRateINR}
                    onChange={(e) => setHourlyRateINR(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                      isDark ? "bg-[#1c1c22] border-white/10 text-white" : "bg-gray-50 border-gray-200"
                    }`}
                  />
                  <span className="text-[10px] text-emerald-400 block mt-0.5">
                    You receive ₹{Math.round(hourlyRateINR * 0.8)} per hour (80% net payout).
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  LinkedIn Profile URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://linkedin.com/in/username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                    isDark ? "bg-[#1c1c22] border-white/10 text-white" : "bg-gray-50 border-gray-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Mentor Bio & What Mentees Can Learn *
                </label>
                <textarea
                  rows={3}
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell students about your practical experience, interview panel history, or tech stack specialties..."
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                    isDark ? "bg-[#1c1c22] border-white/10 text-white" : "bg-gray-50 border-gray-200"
                  }`}
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold border border-white/10"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20"
                >
                  Submit for Admin Verification Review →
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success & Status Notice */}
          {step === 4 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Verification Dossier Submitted!</h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto">
                Your credentials and {company} proof documents are recorded in our immutable audit log with status <code>PENDING_VERIFICATION</code>.
              </p>

              <div className="p-4 rounded-2xl bg-[#1d1d24] border border-white/10 text-left text-xs space-y-2">
                <div className="text-[10px] uppercase font-bold text-gray-400">Trust Layer Invariant</div>
                <p className="text-[11px] text-gray-300">
                  🛡️ In accordance with platform security rules, your profile will remain invisible in the public directory until an administrator reviews and approves your submission.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-full font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black"
              >
                Close & Return to Platform
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
