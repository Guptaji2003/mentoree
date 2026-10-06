"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  GraduationCap,
  Briefcase
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "MENTOR">("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 10) {
      setError("Password must be at least 10 characters long with uppercase, lowercase, and numbers.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to create account.");
      }

      setSuccess("Account created successfully! Redirecting to dashboard...");
      
      setTimeout(() => {
        if (role === "MENTOR") {
          router.push("/mentor/dashboard");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }, 700);
    } catch (err: any) {
      setError(err.message || "An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#1e293b] font-sans flex flex-col justify-between selection:bg-purple-100 selection:text-purple-700">
      
      {/* Top Header */}
      <header className="bg-white border-b border-[#eaecf2] py-4 px-6 sm:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-[#7922f5] flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-purple-600/20">
            S
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#1e2433]">
            Sp<span className="text-[#7922f5]">!</span>k
          </span>
        </Link>

        <div className="text-xs text-[#5a627a]">
          Already registered?{" "}
          <Link href="/login" className="text-[#7922f5] font-bold hover:underline">
            Log in
          </Link>
        </div>
      </header>

      {/* Main Signup Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md bg-white rounded-2xl p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#eef0f6] space-y-6">
          
          <div className="text-center space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#f6f2fe] border border-purple-100 text-[#7922f5] text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Get Started</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight">
              Create Your Account
            </h1>
            <p className="text-xs text-[#5a627a] font-medium">
              Join thousands of learners and verified mentors across domains
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 flex items-start space-x-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center space-x-2.5 text-xs text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Account Role Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1e2433] uppercase tracking-wider block">
              I am joining as a
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${
                  role === "STUDENT"
                    ? "bg-purple-50 border-[#7922f5] text-[#7922f5] font-bold shadow-sm"
                    : "bg-[#f8f9fb] border-[#eaecf2] text-slate-600 hover:border-purple-200"
                }`}
              >
                <GraduationCap className="w-4 h-4 shrink-0" />
                <div>
                  <div className="text-xs">Student</div>
                  <div className="text-[10px] text-[#9aa0b4] font-normal">Book 1:1 sessions</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("MENTOR")}
                className={`p-3 rounded-xl border text-left flex items-center space-x-2.5 transition-all ${
                  role === "MENTOR"
                    ? "bg-purple-50 border-[#7922f5] text-[#7922f5] font-bold shadow-sm"
                    : "bg-[#f8f9fb] border-[#eaecf2] text-slate-600 hover:border-purple-200"
                }`}
              >
                <Briefcase className="w-4 h-4 shrink-0" />
                <div>
                  <div className="text-xs">Mentor</div>
                  <div className="text-[10px] text-[#9aa0b4] font-normal">Offer mentorship</div>
                </div>
              </button>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1e2433] uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#9aa0b4] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full bg-[#f8f9fb] border border-[#eaecf2] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1e2433] placeholder-[#9aa0b4] focus:outline-none focus:border-[#7922f5] focus:bg-white font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1e2433] uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9aa0b4] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-[#f8f9fb] border border-[#eaecf2] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1e2433] placeholder-[#9aa0b4] focus:outline-none focus:border-[#7922f5] focus:bg-white font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1e2433] uppercase tracking-wider block">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9aa0b4] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 10 characters (e.g. StrongPass123!)"
                  required
                  className="w-full bg-[#f8f9fb] border border-[#eaecf2] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1e2433] placeholder-[#9aa0b4] focus:outline-none focus:border-[#7922f5] focus:bg-white font-medium transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#7922f5] hover:bg-[#6819d4] text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create {role === "MENTOR" ? "Mentor" : "Student"} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-4 text-center text-xs text-[#9aa0b4]">
        © {new Date().getFullYear()} Sp!k Mentorship Platform. All rights reserved.
      </footer>
    </div>
  );
}
