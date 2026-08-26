"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Mail, Building2, Search } from "lucide-react";

interface CtaSectionProps {
  onOpenDemoModal?: () => void;
  onOpenContactModal?: () => void;
}

export default function CtaSection({ onOpenDemoModal, onOpenContactModal }: CtaSectionProps) {
  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-radial-gradient opacity-80 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl glass-panel p-8 sm:p-14 border border-emerald-500/30 bg-slate-900/90 text-center space-y-8 shadow-2xl">
          
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 text-xs font-bold text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span className="uppercase tracking-wider">SECURE CREDENTIALING PLATFORM</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Ready to secure your institution&apos;s academic credentials?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Deploy authoritative digital credentialing with Ed25519 digital signatures, tamper-evident hash chains, and permanent QR verification.
          </p>

          {/* Action CTAs Stack */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/verify"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-base font-extrabold text-slate-950 shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Search className="h-5 w-5" />
              <span>Verify Any Credential</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/login?role=INSTITUTE"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl glass-panel glass-panel-hover px-8 py-4 text-base font-semibold text-slate-200 hover:text-white border border-slate-700 cursor-pointer"
            >
              <Building2 className="h-5 w-5 text-emerald-400" />
              <span>Access Institution Portal</span>
            </Link>
          </div>

          {/* Secondary Action Triggers */}
          {(onOpenDemoModal || onOpenContactModal) && (
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-400">
              {onOpenDemoModal && (
                <button
                  type="button"
                  onClick={onOpenDemoModal}
                  className="hover:text-emerald-400 underline underline-offset-4 cursor-pointer font-medium"
                >
                  Schedule Registrar Demo →
                </button>
              )}
              {onOpenDemoModal && onOpenContactModal && <span>•</span>}
              {onOpenContactModal && (
                <button
                  type="button"
                  onClick={onOpenContactModal}
                  className="hover:text-cyan-400 underline underline-offset-4 cursor-pointer font-medium"
                >
                  Contact Security Engineering →
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
