"use client";

import React, { useState } from "react";
import { Mentor, AuditLog } from "@/types";
import { 
  X, 
  ShieldCheck, 
  Check, 
  FileText, 
  History
} from "lucide-react";

interface AdminVerificationDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  pendingMentors: Mentor[];
  onApproveMentor: (mentorId: string) => void;
  onRejectMentor: (mentorId: string, reason: string) => void;
  auditLogs: AuditLog[];
}

export const AdminVerificationDashboard: React.FC<AdminVerificationDashboardProps> = ({
  isOpen,
  onClose,
  isDark,
  pendingMentors,
  onApproveMentor,
  onRejectMentor,
  auditLogs,
}) => {
  const [activeTab, setActiveTab] = useState<"APPLICANTS" | "AUDIT_LOGS">("APPLICANTS");
  const [selectedApplicant, setSelectedApplicant] = useState<Mentor | null>(pendingMentors[0] || null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);

  if (!isOpen) return null;

  const handleApprove = (mentor: Mentor) => {
    onApproveMentor(mentor.id);
    setSelectedApplicant(null);
  };

  const handleReject = (mentor: Mentor) => {
    if (!rejectionReason.trim()) {
      alert("Please enter a reason for rejecting this verification request.");
      return;
    }
    onRejectMentor(mentor.id, rejectionReason);
    setRejectionReason("");
    setShowRejectBox(false);
    setSelectedApplicant(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div
        className={`relative w-full max-w-5xl rounded-2xl sm:rounded-3xl shadow-2xl border overflow-hidden transition-all duration-300 my-auto ${
          isDark
            ? "bg-[#121217] border-white/15 text-white"
            : "bg-white border-purple-200 text-gray-900"
        }`}
      >
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-gradient-to-r from-purple-950/60 to-[#161620] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center font-black shrink-0">
              🛡️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xs sm:text-base font-bold text-white">
                  Admin Verification & Trust Operations
                </h3>
                <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-purple-500 text-white">
                  ADMIN
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-400">
                Enforces zero-unverified-mentor invariant before public discovery.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
            {/* Tabs */}
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 text-[11px] sm:text-xs">
              <button
                onClick={() => setActiveTab("APPLICANTS")}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === "APPLICANTS"
                    ? "bg-purple-600 text-white shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Queue ({pendingMentors.length})
              </button>
              <button
                onClick={() => setActiveTab("AUDIT_LOGS")}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === "AUDIT_LOGS"
                    ? "bg-purple-600 text-white shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Audit Log ({auditLogs.length})
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === "APPLICANTS" ? (
            pendingMentors.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-base sm:text-lg font-bold text-white">Verification Queue Clear!</h4>
                <p className="text-xs text-gray-400 mt-1">
                  All mentor submissions have been vetted and processed.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                {/* Left: Applicant List */}
                <div className="lg:col-span-5 space-y-2.5 sm:space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Select Applicant to Inspect
                  </span>
                  {pendingMentors.map((m) => {
                    const isSelected = selectedApplicant?.id === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          setSelectedApplicant(m);
                          setShowRejectBox(false);
                        }}
                        className={`p-3 sm:p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3 ${
                          isSelected
                            ? "bg-purple-950/40 border-purple-500 shadow-md"
                            : "bg-[#181820] border-white/10 hover:border-white/20"
                        }`}
                      >
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-white truncate">{m.name}</h5>
                            <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 shrink-0">
                              PENDING
                            </span>
                          </div>
                          <p className="text-[11px] text-purple-300 font-medium truncate">
                            {m.role} @ {m.company}
                          </p>
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            @{m.companyDomain} • {m.experienceYears}y exp
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Inspection & Decision Console */}
                <div className="lg:col-span-7 bg-[#171722] rounded-2xl p-4 sm:p-5 border border-white/10 space-y-3 sm:space-y-4">
                  {selectedApplicant ? (
                    <>
                      <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-white/10">
                        <div className="min-w-0 mr-2">
                          <h4 className="text-sm sm:text-base font-bold text-white truncate">
                            {selectedApplicant.name}
                          </h4>
                          <p className="text-[11px] sm:text-xs text-purple-300 truncate">
                            {selectedApplicant.role} @ {selectedApplicant.company}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10 text-emerald-400 shrink-0">
                          ID: {selectedApplicant.id}
                        </span>
                      </div>

                      {/* Evidence Checklist */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Automated & Manual Evidence
                        </span>
                        
                        <div className="p-2.5 sm:p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs">
                          <span className="text-gray-300">📧 Domain Match:</span>
                          <span className="text-emerald-400 font-semibold font-mono text-[11px]">
                            @{selectedApplicant.companyDomain} (OTP ✓)
                          </span>
                        </div>

                        <div className="p-2.5 sm:p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs">
                          <span className="text-gray-300">📄 Proof Document:</span>
                          <span className="text-blue-400 font-semibold flex items-center space-x-1 cursor-pointer hover:underline text-[11px]">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[140px]">proof_s3_presigned.pdf</span>
                          </span>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="p-3 rounded-xl bg-black/20 text-[11px] text-gray-300">
                        <strong className="text-gray-400 block text-[9px] uppercase mb-1">Statement:</strong>
                        {selectedApplicant.bio}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2">
                        {!showRejectBox ? (
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-3">
                            <button
                              type="button"
                              onClick={() => handleApprove(selectedApplicant)}
                              className="flex-1 py-2.5 sm:py-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg flex items-center justify-center space-x-1.5"
                            >
                              <Check className="w-4 h-4" />
                              <span>Approve & Publish to Marketplace</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowRejectBox(true)}
                              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30"
                            >
                              Reject...
                            </button>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-2">
                            <label className="block text-xs font-bold text-rose-300">
                              Specify Rejection Reason
                            </label>
                            <textarea
                              rows={2}
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="e.g. Uploaded badge does not match name..."
                              className="w-full px-3 py-1.5 rounded-lg text-xs bg-black/50 border border-white/10 text-white focus:outline-none"
                            />
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => handleReject(selectedApplicant)}
                                className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                              >
                                Confirm Rejection
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowRejectBox(false)}
                                className="px-3 py-2 rounded-lg bg-white/10 text-xs text-gray-300"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-400 text-xs">
                      Select an applicant to review proof documents.
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            /* AUDIT LOG TAB */
            <div className="space-y-2.5">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-[#171720] border border-white/5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400">
                        {log.action}
                      </span>
                      <strong className="text-white">{log.mentorName}</strong>
                    </div>
                    <p className="text-gray-400 text-[10px] mt-0.5">{log.details}</p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[9px] font-mono text-gray-500 block">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
