"use client";

import React, { useState } from "react";
import { ShieldCheck, Menu, X, ArrowRight } from "lucide-react";

interface NavbarProps {
  onOpenDemoModal: () => void;
}

export default function Navbar({ onOpenDemoModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 shadow-lg shadow-emerald-500/10">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
              Trust<span className="text-emerald-400">Chain</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-emerald-400/80 font-semibold -mt-1">
              Ledger Protocol
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => scrollToSection("dashboard")}
            className="hover:text-emerald-400 transition-colors py-1 cursor-pointer"
          >
            Institutions
          </button>
          <button
            onClick={() => scrollToSection("revocation")}
            className="hover:text-emerald-400 transition-colors py-1 cursor-pointer"
          >
            Verification Portal
          </button>
          <button
            onClick={() => scrollToSection("hero")}
            className="hover:text-emerald-400 transition-colors py-1 cursor-pointer"
          >
            Tamper-Proof Ledger
          </button>
          <button
            onClick={() => scrollToSection("testimonials")}
            className="hover:text-emerald-400 transition-colors py-1 cursor-pointer"
          >
            Security & Auditing
          </button>
        </nav>

        {/* Action CTA & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDemoModal}
            className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/20 transition-all duration-200 hover:from-emerald-400 hover:to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95 cursor-pointer"
          >
            <span className="hidden sm:inline">Schedule Verification Demo</span>
            <span className="sm:hidden">Demo</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/10 px-4 pt-3 pb-6 space-y-3 bg-slate-950/95">
          <button
            onClick={() => scrollToSection("dashboard")}
            className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400"
          >
            Institutions
          </button>
          <button
            onClick={() => scrollToSection("revocation")}
            className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400"
          >
            Verification Portal
          </button>
          <button
            onClick={() => scrollToSection("hero")}
            className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400"
          >
            Tamper-Proof Ledger
          </button>
          <button
            onClick={() => scrollToSection("testimonials")}
            className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-400"
          >
            Security & Auditing
          </button>
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemoModal();
              }}
              className="w-full text-center rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20"
            >
              Schedule Verification Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
