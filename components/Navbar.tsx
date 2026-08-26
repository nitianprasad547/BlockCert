"use client";

import React, { useState, useEffect } from "react";
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
  Search, 
  Layers, 
  Lock,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { api } from "@/lib/api";
import { firebaseAuthService } from "@/lib/firebase";
import { User } from "@/types";

interface NavbarProps {
  onOpenDemoModal?: () => void;
}

export default function Navbar({ onOpenDemoModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(() => (typeof window !== "undefined" ? api.getCurrentUser() : null));
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const user = api.getCurrentUser();
    setCurrentUser((prev) => (prev?.user_id !== user?.user_id || prev?.name !== user?.name ? user : prev));
  }, [pathname]);

  const handleLogout = () => {
    api.logout();
    firebaseAuthService.logout();
    setCurrentUser(null);
    router.push("/");
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
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-medium text-slate-300">
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

          {/* Role Portals Shortcut Dropdown/Links */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <Link
              href="/institute/dashboard"
              className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                pathname?.startsWith("/institute")
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Institute</span>
              </span>
            </Link>

            <Link
              href="/student/dashboard"
              className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                pathname?.startsWith("/student")
                  ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-bold"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
                <span>Student</span>
              </span>
            </Link>
          </div>
        </nav>

        {/* Action CTAs */}
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
              href="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <UserIcon className="h-3.5 w-3.5 text-emerald-400" />
              <span>Login / Portals</span>
            </Link>
          )}

          {onOpenDemoModal && (
            <button
              id="navbar-schedule-demo-btn"
              type="button"
              onClick={onOpenDemoModal}
              className="group hidden lg:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all cursor-pointer"
            >
              <span>Live Workflow Demo</span>
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
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer"
          >
            <Search className="h-4 w-4 text-emerald-400" />
            <span>Verify Credential</span>
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer"
          >
            How It Works
          </Link>
          <Link
            href="/security"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer"
          >
            Security Specifications
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer"
          >
            About BlockCert
          </Link>

          {onOpenDemoModal && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemoModal();
              }}
              className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm cursor-pointer shadow-md"
            >
              <span>Schedule Registrar Demo</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}

          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
            <Link
              href="/institute/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold cursor-pointer"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Institute Portal</span>
            </Link>
            <Link
              href="/student/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-bold cursor-pointer"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Student Portal</span>
            </Link>
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
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Sign In to BlockCert
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
