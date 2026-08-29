"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoModal, { ModalType } from "@/components/DemoModal";
import EmailVerificationModal from "@/components/EmailVerificationModal";
import { 
  Building2, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  AlertTriangle,
  User as UserIcon,
  RefreshCw,
  LogIn,
  UserPlus
} from "lucide-react";
import { api } from "@/lib/api";
import { firebaseAuthService, isLiveFirebaseConfigured } from "@/lib/firebase";
import { UserRole } from "@/types";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = (searchParams.get("role")?.toUpperCase() as UserRole) || "INSTITUTE";

  const [selectedRole, setSelectedRole] = useState<UserRole>(
    ["INSTITUTE", "STUDENT", "EMPLOYER"].includes(initialRoleParam) ? initialRoleParam : "INSTITUTE"
  );
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("Password123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email verification modal state (for sandbox testing only)
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string>("");
  const [pendingRole, setPendingRole] = useState<UserRole>("STUDENT");
  const [initialOtp, setInitialOtp] = useState<string | undefined>(undefined);

  const personas = [
    {
      role: "INSTITUTE" as UserRole,
      title: "Institution Registrar",
      desc: "Stanford University Alliance",
      email: "registrar@stanford.edu",
      icon: Building2,
      color: "border-emerald-500/40 text-emerald-400 bg-emerald-950/20",
      redirect: "/institute/dashboard",
    },
    {
      role: "STUDENT" as UserRole,
      title: "Student Graduate",
      desc: "Rahul Sharma (B.Tech CS)",
      email: "rahul@student.edu",
      icon: GraduationCap,
      color: "border-cyan-500/40 text-cyan-400 bg-cyan-950/20",
      redirect: "/student/dashboard",
    },
    {
      role: "EMPLOYER" as UserRole,
      title: "Employer Verifier",
      desc: "Public Verification Access",
      email: "recruiter@techcorp.com",
      icon: Briefcase,
      color: "border-amber-500/40 text-amber-400 bg-amber-950/20",
      redirect: "/employer/dashboard",
    },
  ];

  const completeLoginAndRedirect = async (userEmail: string, role: UserRole, customName?: string, userPassword?: string) => {
    try {
      await api.login(userEmail, role, customName || "", userPassword);
      const target = personas.find(p => p.role === role)?.redirect || (role === "STUDENT" ? "/student/dashboard" : role === "EMPLOYER" ? "/employer/dashboard" : "/institute/dashboard");
      router.push(target);
    } catch (err: any) {
      setError(err?.message || "Failed to establish session.");
    }
  };

  const handleQuickLogin = async (persona: typeof personas[0]) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure email is verified in auth store
      firebaseAuthService.instantDemoVerify(persona.email);
      await api.login(persona.email, persona.role, persona.title);
      router.push(persona.redirect);
    } catch (err: any) {
      setError("Quick login error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Email is required."); return; }

    setLoading(true);
    setError(null);
    const targetInput = email.trim();
    if (selectedRole === "STUDENT") {
      try {
        await api.loginWithCredentialId(targetInput.toUpperCase());
        router.push("/student/dashboard");
        return;
      } catch (credErr: any) {
        if (targetInput.toUpperCase().startsWith("CRED-")) {
          setError(credErr.message || "Failed to locate academic record on the ledger.");
          setLoading(false);
          return;
        }
        // If an email was typed, continue to email flow
      }
    }

    const targetEmail = targetInput.toLowerCase();

    try {
      if (isLiveFirebaseConfigured()) {
        const res = await firebaseAuthService.loginWithEmail(targetEmail, password, selectedRole);
        if (!res.success) {
          setError(res.error || "Invalid credentials.");
          setLoading(false);
          return;
        }
        if (!res.isEmailVerified) {
          setPendingEmail(targetEmail);
          setPendingRole(selectedRole);
          setInitialOtp(res.otpCode);
          setIsVerificationModalOpen(true);
          setLoading(false);
          return;
        }
      }
      // Authenticate with backend and redirect
      await completeLoginAndRedirect(targetEmail, selectedRole, undefined, password);
    } catch (err: any) {
      setError(err.message || "Authentication error.");
    } finally {
      setLoading(false);
    }
  };

  const handleTestUnverifiedFlow = (role: UserRole) => {
    const testEmail = `new.${role.toLowerCase()}@university.edu`;
    firebaseAuthService.markAsUnverified(testEmail);
    setEmail(testEmail);
    setSelectedRole(role);
    setPendingEmail(testEmail);
    setPendingRole(role);
    setInitialOtp("920184");
    setIsVerificationModalOpen(true);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      
      {/* 2-Menu Switcher: Sign In vs Sign Up (Account Creation) */}
      <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-lg">
        <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300 shadow-sm">
          <LogIn className="h-4 w-4 text-emerald-400" />
          <span>Sign In / Login</span>
        </div>
        <Link
          href={`/signup?role=${selectedRole}`}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all"
        >
          <UserPlus className="h-4 w-4 text-slate-500" />
          <span>Create Account (Sign Up)</span>
        </Link>
      </div>

      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="uppercase tracking-wider">SECURE FIREBASE AUTHENTICATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Sign In to <span className="text-gradient-emerald">BlockCert</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          All email accounts require verified email status via Firebase before ledger access is granted.
        </p>
      </div>

      {/* 1-Click Quick Demo Persona Cards */}
      <div className="space-y-3 text-left">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>1-Click Verified Personas (Pre-Authenticated):</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {personas.map((p) => {
            const Icon = p.icon;
            const isSelected = selectedRole === p.role;
            return (
              <button
                key={p.role}
                type="button"
                onClick={() => {
                  setSelectedRole(p.role);
                  setEmail(p.email);
                  handleQuickLogin(p);
                }}
                className={`p-4 rounded-2xl glass-panel border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                  isSelected
                    ? `${p.color} ring-1 ring-emerald-500/50 shadow-lg`
                    : "border-white/10 hover:border-slate-700 bg-slate-900/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </span>
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white group-hover:text-emerald-300">
                    {p.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{p.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Sign In Form */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 bg-slate-900/90 shadow-2xl text-left space-y-6">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-white">Sign In with Email</h2>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors border border-emerald-500/30 hover:border-emerald-400/50 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20"
          >
            <Sparkles className="h-3 w-3" />
            Create New Account
          </Link>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
          
          {/* Role Selection */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Select Ecosystem Role</label>
            <select
              value={selectedRole}
              onChange={(e) => {
                const newRole = e.target.value as UserRole;
                setSelectedRole(newRole);
                const persona = personas.find(p => p.role === newRole);
                if (persona) setEmail(persona.email);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="INSTITUTE">🏛️ Institution Registrar (Stanford Alliance)</option>
              <option value="STUDENT">🎓 Student Graduate (Rahul Sharma)</option>
              <option value="EMPLOYER">💼 Employer / Public Verifier</option>
            </select>
          </div>


          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              {selectedRole === "STUDENT" ? "Email Address or Issued Credential ID" : "Email Address"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                {selectedRole === "STUDENT" && email.toUpperCase().startsWith("CRED-") ? (
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
              </div>
              <input
                type={selectedRole === "STUDENT" ? "text" : "email"}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  selectedRole === "INSTITUTE"
                    ? "registrar@stanford.edu"
                    : selectedRole === "STUDENT"
                    ? "rahul@student.edu or CRED-7F83A91"
                    : "recruiter@techcorp.com"
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            {selectedRole === "STUDENT" && (
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span>Enter your permanent <strong className="text-cyan-300 font-mono">Credential ID</strong> (e.g. CRED-7F83A91).</span>
                <Link href="/student/login" className="text-cyan-400 font-bold hover:underline shrink-0 ml-2">
                  Student Portal &amp; QR →
                </Link>
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50 mt-2"
          >
            <span>{loading ? "Signing in..." : "Sign In"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Test Email Verification Simulation Button */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span>Want to test the email verification screen?</span>
          <button
            type="button"
            onClick={() => handleTestUnverifiedFlow(selectedRole)}
            className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
          >
            Trigger Verification Sandbox →
          </button>
        </div>

      </div>

      {/* Interactive Firebase Email Verification Modal */}
      <EmailVerificationModal
        isOpen={isVerificationModalOpen}
        email={pendingEmail}
        userRole={pendingRole}
        initialOtp={initialOtp}
        onVerified={() => {
          setIsVerificationModalOpen(false);
          completeLoginAndRedirect(pendingEmail, pendingRole);
        }}
        onClose={() => setIsVerificationModalOpen(false)}
      />

    </div>
  );
}

export default function LoginPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 bg-grid-pattern relative flex flex-col justify-between">
      <Navbar onOpenDemoModal={() => setActiveModal("demo")} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex-1 flex items-center justify-center">
        <Suspense fallback={<div className="text-slate-400 font-mono text-xs">Loading authentication portal...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer
        onOpenDemoModal={() => setActiveModal("demo")}
        onOpenWhitepaperModal={() => setActiveModal("whitepaper")}
      />
      <DemoModal type={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}
