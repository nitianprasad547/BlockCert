"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoModal, { ModalType } from "@/components/DemoModal";
import {
  Building2,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  User as UserIcon,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  Info,
} from "lucide-react";
import { api } from "@/lib/api";
import { firebaseAuthService, isLiveFirebaseConfigured } from "@/lib/firebase";
import { UserRole } from "@/types";

const roles: {
  value: UserRole;
  label: string;
  emoji: string;
  icon: React.ElementType;
  desc: string;
  redirect: string;
  color: string;
  note?: string;
}[] = [
  {
    value: "INSTITUTE",
    label: "Institution Registrar",
    emoji: "🏛️",
    icon: Building2,
    desc: "Issue & manage academic credentials on the blockchain ledger",
    redirect: "/institute/dashboard",
    color: "text-emerald-400",
    note: "An institutional profile will be auto-created and listed in the public registry.",
  },
  {
    value: "STUDENT",
    label: "Student / Graduate",
    emoji: "🎓",
    icon: GraduationCap,
    desc: "View, share, and request corrections for your credentials",
    redirect: "/student/dashboard",
    color: "text-cyan-400",
  },
  {
    value: "EMPLOYER",
    label: "Employer / Verifier",
    emoji: "💼",
    icon: Briefcase,
    desc: "Verify candidate academic credentials instantly",
    redirect: "/verify",
    color: "text-amber-400",
  },
];

function SignupForm() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<UserRole>("INSTITUTE");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRoleInfo = roles.find((r) => r.value === selectedRole)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) { setError("Full name is required."); return; }
    if (!email.trim()) { setError("Email address is required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      const targetEmail = email.trim().toLowerCase();

      if (isLiveFirebaseConfigured()) {
        const res = await firebaseAuthService.registerWithEmail(
          targetEmail,
          password,
          name.trim(),
          selectedRole
        );
        if (!res.success) {
          setError(res.error || "Registration failed. Please try again.");
          setLoading(false);
          return;
        }
      }

      // Persist to backend DB (falls back to local if backend is down)
      firebaseAuthService.instantDemoVerify(targetEmail);
      await api.register(name.trim(), targetEmail, password, selectedRole);

      // Go straight to the dashboard
      router.push(selectedRoleInfo.redirect);
    } catch (err: any) {
      if (err?.code === "EMAIL_EXISTS") {
        setError(
          "An account with this email already exists. Please sign in instead or use a different email."
        );
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
      setLoading(false);
    }
  };

  const RoleIcon = selectedRoleInfo.icon;

  return (
    <div className="w-full max-w-lg mx-auto space-y-8">

      {/* Back link */}
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors font-semibold"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Sign In
      </Link>

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="uppercase tracking-wider">Create BlockCert Account</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Join <span className="text-gradient-emerald">BlockCert</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Choose your role, fill in your details, and get instant access.
        </p>
      </div>

      {/* Role Dropdown Selector */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Your Role</p>

        {/* Dropdown */}
        <div className="relative">
          <select
            id="signup-role-select"
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value as UserRole);
              setError(null);
            }}
            className="w-full appearance-none pl-11 pr-10 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.emoji}  {r.label}
              </option>
            ))}
          </select>
          {/* Left icon */}
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center">
            <RoleIcon className="h-4 w-4 text-slate-400" />
          </div>
          {/* Right chevron */}
          <div className="pointer-events-none absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        {/* Role context card */}
        <div className={`rounded-2xl border px-4 py-3.5 flex items-start gap-3 transition-all ${
          selectedRole === "INSTITUTE"
            ? "border-emerald-500/30 bg-emerald-950/20"
            : selectedRole === "STUDENT"
            ? "border-cyan-500/30 bg-cyan-950/20"
            : "border-amber-500/30 bg-amber-950/20"
        }`}>
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 mt-0.5 shrink-0">
            <RoleIcon className={`h-4 w-4 ${selectedRoleInfo.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className={`text-xs font-extrabold ${selectedRoleInfo.color}`}>{selectedRoleInfo.label}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{selectedRoleInfo.desc}</div>
            {selectedRoleInfo.note && (
              <div className="mt-2 flex items-start gap-1.5 text-[11px] text-slate-300">
                <Info className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                <span>{selectedRoleInfo.note}</span>
              </div>
            )}
          </div>
          <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${selectedRoleInfo.color}`} />
        </div>
      </div>

      {/* Form */}
      <div className="rounded-3xl bg-slate-900/90 border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5">

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
            {error.includes("already exists") && (
              <Link href="/login" className="ml-1 text-emerald-400 font-bold hover:underline whitespace-nowrap">
                Sign in →
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">

          {/* Full Name */}
          <div>
            <label htmlFor="signup-name" className="block font-semibold text-slate-300 mb-1">
              {selectedRole === "INSTITUTE" ? "Institution / Registrar Name" : "Full Name"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <UserIcon className="h-4 w-4" />
              </div>
              <input
                id="signup-name"
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  selectedRole === "INSTITUTE"
                    ? "e.g. MIT Department of Engineering"
                    : selectedRole === "STUDENT"
                    ? "e.g. Rahul Sharma"
                    : "e.g. Tech Corp HR"
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="signup-email" className="block font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  selectedRole === "INSTITUTE"
                    ? "registrar@youruni.edu"
                    : selectedRole === "STUDENT"
                    ? "you@student.edu"
                    : "recruiter@company.com"
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="signup-password" className="block font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="signup-confirm" className="block font-semibold text-slate-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="signup-confirm"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="signup-submit-btn"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50 mt-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>{loading ? "Creating your account..." : "Create Account & Sign In"}</span>
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-500 pt-2 border-t border-white/5">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-bold underline">
            Sign in here
          </Link>
        </p>
      </div>

    </div>
  );
}

export default function SignupPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 bg-grid-pattern relative flex flex-col justify-between">
      <Navbar onOpenDemoModal={() => setActiveModal("demo")} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex-1 flex items-center justify-center">
        <SignupForm />
      </main>
      <Footer
        onOpenDemoModal={() => setActiveModal("demo")}
        onOpenWhitepaperModal={() => setActiveModal("whitepaper")}
      />
      <DemoModal type={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}

