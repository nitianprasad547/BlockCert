"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Menu, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  GraduationCap, 
  Briefcase,
  Search, 
  Layers, 
  Lock,
  LogOut,
  User as UserIcon,
  ChevronDown,
  LogIn,
  UserPlus,
  LayoutDashboard
} from "lucide-react";
import { api } from "@/lib/api";
import { firebaseAuthService } from "@/lib/firebase";
import { User } from "@/types";

interface NavbarProps {
  onOpenDemoModal?: () => void;
}

export default function Navbar({ onOpenDemoModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"INSTITUTE" | "STUDENT" | "EMPLOYER" | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(() => (typeof window !== "undefined" ? api.getCurrentUser() : null));
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = api.getCurrentUser();
    setCurrentUser((prev) => (prev?.user_id !== user?.user_id || prev?.name !== user?.name ? user : prev));
  }, [pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    api.logout();
    firebaseAuthService.logout();
    setCurrentUser(null);
    router.push("/");
  };

  const toggleDropdown = (role: "INSTITUTE" | "STUDENT" | "EMPLOYER") => {
    setActiveDropdown((prev) => (prev === role ? null : role));
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-amber-500/10 border border-emerald-500/40 shadow-lg shadow-emerald-500/10 group-hover:border-emerald-400/70 transition-all">
            <ShieldCheck className="h-6 w-6 text-emerald-400 group-hover:scale-105 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
              Block<span className="text-emerald-400">Cert</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-emerald-400/80 font-semibold -mt-1">
              Cryptographic Trust Ledger
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-5 lg:space-x-7 text-sm font-medium text-slate-300">
          <Link
            href="/verify"
            className={`flex items-center gap-1.5 hover:text-emerald-400 transition-colors py-1 ${
              pathname?.startsWith("/verify") ? "text-emerald-400 font-semibold" : ""
            }`}
          >
            <Search className="h-4 w-4" />
            <span>Verify Credential</span>
          </Link>

          <Link
            href="/how-it-works"
            className={`hover:text-emerald-400 transition-colors py-1 ${
              pathname === "/how-it-works" ? "text-emerald-400 font-semibold" : ""
            }`}
          >
            How It Works
          </Link>

          <Link
            href="/security"
            className={`flex items-center gap-1 hover:text-emerald-400 transition-colors py-1 ${
              pathname === "/security" ? "text-emerald-400 font-semibold" : ""
            }`}
          >
            <Lock className="h-3.5 w-3.5 text-cyan-400" />
            <span>Security Specs</span>
          </Link>

          <Link
            href="/about"
            className={`hover:text-emerald-400 transition-colors py-1 ${
              pathname === "/about" ? "text-emerald-400 font-semibold" : ""
            }`}
          >
            About
          </Link>

          {/* 3 Core Roles with 2-Menu Dropdowns (Sign In & Sign Up) */}
          <div ref={dropdownRef} className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            
            {/* 1. INSTITUTE */}
            <div className="relative">
              <div className="inline-flex rounded-lg border border-emerald-500/30 bg-slate-900 p-0.5 shadow-sm">
                <Link
                  href="/signup?role=INSTITUTE"
                  id="institute-direct-link"
                  className={`text-xs px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                    pathname?.startsWith("/institute")
                      ? "bg-emerald-500/25 text-emerald-300 font-bold"
                      : "text-emerald-300 hover:text-white hover:bg-emerald-500/10"
                  }`}
                  title="Institute Portal (Click to Sign Up / Create Account)"
                >
                  <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Institute</span>
                </Link>
                <button
                  type="button"
                  id="institute-menu-trigger"
                  onClick={() => toggleDropdown("INSTITUTE")}
                  className={`px-1.5 py-1 rounded-md hover:bg-emerald-500/10 text-emerald-400 transition-colors cursor-pointer ${
                    activeDropdown === "INSTITUTE" ? "bg-emerald-500/20" : ""
                  }`}
                  aria-label="Institute Authentication Menu"
                >
                  <ChevronDown className={`h-3 w-3 transition-transform ${activeDropdown === "INSTITUTE" ? "rotate-180" : ""}`} />
                </button>
              </div>

              {activeDropdown === "INSTITUTE" && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl bg-slate-900 border border-emerald-500/30 p-1.5 shadow-xl shadow-black/60 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider border-b border-white/5 mb-1">
                    Institute Portal
                  </div>
                  <Link
                    href="/login?role=INSTITUTE"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors"
                  >
                    <LogIn className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Sign In / Login</span>
                  </Link>
                  <Link
                    href="/signup?role=INSTITUTE"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors"
                  >
                    <UserPlus className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Create Account (Sign Up)</span>
                  </Link>
                  <div className="my-1 border-t border-white/5" />
                  <Link
                    href="/institute/dashboard"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <LayoutDashboard className="h-3 w-3" />
                    <span>Go to Dashboard</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 2. STUDENT */}
            <div className="relative">
              <div className="inline-flex rounded-lg border border-cyan-500/30 bg-slate-900 p-0.5 shadow-sm">
                <Link
                  href="/student/login"
                  id="student-direct-link"
                  className={`text-xs px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                    pathname?.startsWith("/student")
                      ? "bg-cyan-500/25 text-cyan-300 font-bold"
                      : "text-cyan-300 hover:text-white hover:bg-cyan-500/10"
                  }`}
                  title="Student Scorecard Portal (Access with Credential ID)"
                >
                  <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Student</span>
                </Link>
                <button
                  type="button"
                  id="student-menu-trigger"
                  onClick={() => toggleDropdown("STUDENT")}
                  className={`px-1.5 py-1 rounded-md hover:bg-cyan-500/10 text-cyan-400 transition-colors cursor-pointer ${
                    activeDropdown === "STUDENT" ? "bg-cyan-500/20" : ""
                  }`}
                  aria-label="Student Scorecard Menu"
                >
                  <ChevronDown className={`h-3 w-3 transition-transform ${activeDropdown === "STUDENT" ? "rotate-180" : ""}`} />
                </button>
              </div>

              {activeDropdown === "STUDENT" && (
                <div className="absolute left-0 mt-2 w-52 rounded-xl bg-slate-900 border border-cyan-500/30 p-1.5 shadow-xl shadow-black/60 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-cyan-400 uppercase tracking-wider border-b border-white/5 mb-1">
                    Student Scorecard Portal
                  </div>
                  <Link
                    href="/student/login"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors"
                  >
                    <LogIn className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Access with Credential ID</span>
                  </Link>
                  <div className="my-1 border-t border-white/5" />
                  <Link
                    href="/student/dashboard"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <LayoutDashboard className="h-3 w-3" />
                    <span>My Locker &amp; Scorecard</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. EMPLOYER (Changed from Login / Portals, direct redirect to Employer signup) */}
            <div className="relative">
              <div className="inline-flex rounded-lg border border-amber-500/30 bg-slate-900 p-0.5 shadow-sm">
                <Link
                  href="/signup?role=EMPLOYER"
                  id="employer-direct-link"
                  className={`text-xs px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                    pathname?.startsWith("/employer")
                      ? "bg-amber-500/25 text-amber-300 font-bold"
                      : "text-amber-300 hover:text-white hover:bg-amber-500/10"
                  }`}
                  title="Employer Portal (Click to Sign Up)"
                >
                  <Briefcase className="h-3.5 w-3.5 text-amber-400" />
                  <span>Employer</span>
                </Link>
                <button
                  type="button"
                  id="employer-menu-trigger"
                  onClick={() => toggleDropdown("EMPLOYER")}
                  className={`px-1.5 py-1 rounded-md hover:bg-amber-500/10 text-amber-400 transition-colors cursor-pointer ${
                    activeDropdown === "EMPLOYER" ? "bg-amber-500/20" : ""
                  }`}
                  aria-label="Employer Authentication Menu"
                >
                  <ChevronDown className={`h-3 w-3 transition-transform ${activeDropdown === "EMPLOYER" ? "rotate-180" : ""}`} />
                </button>
              </div>

              {activeDropdown === "EMPLOYER" && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-amber-500/30 p-1.5 shadow-xl shadow-black/60 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider border-b border-white/5 mb-1">
                    Employer Verifier
                  </div>
                  <Link
                    href="/login?role=EMPLOYER"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:bg-amber-500/10 hover:text-amber-300 transition-colors"
                  >
                    <LogIn className="h-3.5 w-3.5 text-amber-400" />
                    <span>Sign In / Login</span>
                  </Link>
                  <Link
                    href="/signup?role=EMPLOYER"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:bg-amber-500/10 hover:text-amber-300 transition-colors"
                  >
                    <UserPlus className="h-3.5 w-3.5 text-amber-400" />
                    <span>Create Account (Sign Up)</span>
                  </Link>
                  <div className="my-1 border-t border-white/5" />
                  <Link
                    href="/employer/dashboard"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <LayoutDashboard className="h-3 w-3 text-amber-400" />
                    <span>Employer Dashboard</span>
                  </Link>
                </div>
              )}
            </div>

          </div>
        </nav>

        {/* Action CTAs / User Profile Status */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-white leading-tight">{currentUser.name}</span>
                <span className="text-[10px] text-emerald-400 uppercase font-mono">{currentUser.role}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-400 transition-colors cursor-pointer"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Get Started</span>
            </Link>
          )}

          {onOpenDemoModal && (
            <button
              id="navbar-schedule-demo-btn"
              type="button"
              onClick={onOpenDemoModal}
              className="group hidden lg:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all cursor-pointer"
            >
              <span>Live Demo</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/10 px-4 pt-3 pb-6 space-y-3 bg-slate-950/95">
          <Link
            href="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer"
          >
            <Search className="h-4 w-4 text-emerald-400" />
            <span>Verify Credential</span>
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer"
          >
            How It Works
          </Link>
          <Link
            href="/security"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer"
          >
            Security Specifications
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer"
          >
            About BlockCert
          </Link>

          {/* Role Portals & Auth Menus */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Role Access &amp; Portals
            </div>

            {/* Institute section */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-2.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Institute</span>
                </span>
                <Link
                  href="/institute/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[10px] text-emerald-300 hover:underline"
                >
                  Dashboard →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <Link
                  href="/login?role=INSTITUTE"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 text-center rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 hover:bg-emerald-500/10"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup?role=INSTITUTE"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 text-center rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300"
                >
                  Create Account
                </Link>
              </div>
            </div>

            {/* Student section */}
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-2.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>Student</span>
                </span>
                <Link
                  href="/student/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[10px] text-cyan-300 hover:underline"
                >
                  Locker →
                </Link>
              </div>
                <Link
                  href="/student/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-xs font-bold text-cyan-300 flex items-center justify-center gap-1.5"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Access with Credential ID</span>
                </Link>
            </div>

            {/* Employer section */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-2.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Employer</span>
                </span>
                <Link
                  href="/employer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[10px] text-amber-300 hover:underline"
                >
                  Dashboard →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <Link
                  href="/login?role=EMPLOYER"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 text-center rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 hover:bg-amber-500/10"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup?role=EMPLOYER"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 text-center rounded-lg bg-amber-500/20 border border-amber-500/40 text-xs font-bold text-amber-300"
                >
                  Create Account
                </Link>
              </div>
            </div>

          </div>

          <div className="pt-2">
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center rounded-xl bg-slate-900 border border-slate-800 py-2.5 text-sm font-semibold text-rose-400 cursor-pointer"
              >
                Log Out ({currentUser.name})
              </button>
            ) : (
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Get Started with BlockCert
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
