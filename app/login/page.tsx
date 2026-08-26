"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  RefreshCw
} from "lucide-react";
import { api } from "@/lib/api";
import { firebaseAuthService, isLiveFirebaseConfigured } from "@/lib/firebase";
import { UserRole } from "@/types";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as UserRole) || "INSTITUTE";

  const [authMode, setAuthMode] = useState<"SIGNIN" | "REGISTER">("SIGNIN");
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("Password123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email verification modal state
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
      redirect: "/verify",
    },
  ];

  const completeLoginAndRedirect = async (userEmail: string, role: UserRole) => {
    try {
      await api.login(userEmail, role);
      const target = personas.find(p => p.role === role)?.redirect || "/institute/dashboard";
      router.push(target);
    } catch (err: any) {
      setError("Failed to establish session after verification.");
    }
  };

  const handleQuickLogin = async (persona: typeof personas[0]) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure email is verified in auth store
      firebaseAuthService.instantDemoVerify(persona.email);
      await api.login(persona.email, persona.role);
      router.push(persona.redirect);
    } catch (err: any) {
      setError("Quick login error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    const userRole = selectedRole;
    const targetEmail = email.trim().toLowerCase();

    try {
      if (authMode === "REGISTER") {
        // Register with Firebase
        const res = await firebaseAuthService.registerWithEmail(
          targetEmail,
          password,
          name || targetEmail.split("@")[0],
          userRole
        );

        if (!res.success) {
          setError(res.error || "Registration failed.");
          setLoading(false);
          return;
        }

        if (!res.isEmailVerified) {
          // Open verification modal
          setPendingEmail(targetEmail);
          setPendingRole(userRole);
          setInitialOtp(res.otpCode);
          setIsVerificationModalOpen(true);
          setLoading(false);
          return;
        }

        // If immediately verified
        await completeLoginAndRedirect(targetEmail, userRole);
      } else {
        // Sign in with Firebase
        const res = await firebaseAuthService.loginWithEmail(
          targetEmail,
          password,
          userRole
        );

        if (!res.success) {
          setError(res.error || "Invalid credentials.");
          setLoading(false);
          return;
        }

        if (!res.isEmailVerified) {
          // Trigger email verification requirement
          setPendingEmail(targetEmail);
          setPendingRole(userRole);
          setInitialOtp(res.otpCode);
          setIsVerificationModalOpen(true);
          setLoading(false);
          return;
        }

        // Email is verified! Grant access
        await completeLoginAndRedirect(targetEmail, userRole);
      }
    } catch (err: any) {
      setError(err.message || "Authentication error occurred.");
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
    <div className="w-full max-w-xl mx-auto space-y-8">
      
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

      {/* Main Form Box: Sign In / Create Account with Firebase Email Verification */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 bg-slate-900/90 shadow-2xl text-left space-y-6">
        
        {/* Toggle Sign In / Register Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMode("SIGNIN")}
            className={`py-2.5 rounded-xl transition-all cursor-pointer ${
              authMode === "SIGNIN"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In with Email
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("REGISTER")}
            className={`py-2.5 rounded-xl transition-all cursor-pointer ${
              authMode === "REGISTER"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Create New Account
          </button>
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
                if (persona && authMode === "SIGNIN") setEmail(persona.email);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="INSTITUTE">🏛️ Institution Registrar (Stanford Alliance)</option>
              <option value="STUDENT">🎓 Student Graduate (Rahul Sharma)</option>
              <option value="EMPLOYER">💼 Employer / Public Verifier</option>
            </select>
          </div>

          {authMode === "REGISTER" && (
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Legal Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Arthur Pendelton"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === "INSTITUTE" ? "registrar@stanford.edu" : selectedRole === "STUDENT" ? "rahul@student.edu" : "recruiter@techcorp.com"}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
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
            <span>
              {loading 
                ? "Connecting with Firebase..." 
                : authMode === "REGISTER" 
                ? "Create Account & Send Verification Email" 
                : "Sign In (Verify Email Status)"
              }
            </span>
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
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 bg-grid-pattern relative flex flex-col justify-between">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex-1 flex items-center justify-center">
        <Suspense fallback={<div className="text-slate-400 font-mono text-xs">Loading authentication portal...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
