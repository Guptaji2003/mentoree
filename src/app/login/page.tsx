"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  Sparkles,
  User,
  GraduationCap,
  Briefcase
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authErrorParam = searchParams.get("auth_error");
  const redirectParam = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(authErrorParam);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (authErrorParam) {
      setError(authErrorParam);
    }
  }, [authErrorParam]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to sign in. Please check your credentials.");
      }

      setSuccess("Signed in successfully! Redirecting...");
      
      const role = json.user?.role;
      setTimeout(() => {
        if (role === "ADMIN") {
          router.push("/admin");
        } else if (role === "MENTOR") {
          router.push("/mentor/dashboard");
        } else {
          router.push(redirectParam.startsWith("/") ? redirectParam : "/dashboard");
        }
        router.refresh();
      }, 700);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Quick One-Click Demo Logins
  const handleQuickLogin = async (demoEmail: string, demoRole: string) => {
    setEmail(demoEmail);
    setPassword("MentoreePass123!");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: "MentoreePass123!" }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Demo login failed");
      }

      setSuccess(`Logged in as demo ${demoRole}! Redirecting...`);
      setTimeout(() => {
        if (demoRole === "Admin") {
          router.push("/admin");
        } else if (demoRole === "Mentor") {
          router.push("/mentor/dashboard");
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }, 600);
    } catch (err: any) {
      setError(err.message || "Demo login error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#1e293b] font-sans flex flex-col justify-between selection:bg-purple-100 selection:text-purple-700">
      
      {/* Top Simple Header */}
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
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#7922f5] font-bold hover:underline">
            Sign up
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md bg-white rounded-2xl p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#eef0f6] space-y-6">
          
          {/* Header Title */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#f6f2fe] border border-purple-100 text-[#7922f5] text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secure Authentication</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#1e2433] tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-[#5a627a] font-medium">
              Enter your credentials to access your dashboard and sessions
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

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1e2433] uppercase tracking-wider block">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9aa0b4] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="pt-4 border-t border-[#eaecf2] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#9aa0b4] uppercase tracking-wider">
                ⚡ 1-Click Demo Logins:
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin("pulkit.gupta@stanford.edu", "Student")}
                className="p-2.5 rounded-xl border border-[#eaecf2] bg-[#f8f9fb] hover:bg-purple-50 hover:border-purple-200 text-left transition-all group"
              >
                <div className="flex items-center space-x-1 text-[#7922f5] mb-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">Student</span>
                </div>
                <div className="text-[9px] text-[#9aa0b4] truncate">pulkit.gupta</div>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin("mentor1@openai.com", "Mentor")}
                className="p-2.5 rounded-xl border border-[#eaecf2] bg-[#f8f9fb] hover:bg-purple-50 hover:border-purple-200 text-left transition-all group"
              >
                <div className="flex items-center space-x-1 text-[#7922f5] mb-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">Mentor</span>
                </div>
                <div className="text-[9px] text-[#9aa0b4] truncate">mentor1@openai</div>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin("admin@mentoree.in", "Admin")}
                className="p-2.5 rounded-xl border border-[#eaecf2] bg-[#f8f9fb] hover:bg-purple-50 hover:border-purple-200 text-left transition-all group"
              >
                <div className="flex items-center space-x-1 text-[#7922f5] mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">Admin</span>
                </div>
                <div className="text-[9px] text-[#9aa0b4] truncate">admin@mentoree</div>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-4 text-center text-xs text-[#9aa0b4]">
        © {new Date().getFullYear()} Sp!k Mentorship Platform. All rights reserved.
      </footer>
    </div>
  );
}
