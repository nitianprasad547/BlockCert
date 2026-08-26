"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoModal, { ModalType } from "@/components/DemoModal";
import Link from "next/link";
import { 
  ShieldCheck, 
  Award, 
  Lock, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  GraduationCap, 
  Users, 
  Globe2, 
  Zap,
  FileCheck
} from "lucide-react";

export default function AboutPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 bg-grid-pattern relative flex flex-col justify-between">
      <Navbar onOpenDemoModal={() => setActiveModal("demo")} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-20 flex-1">
        
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="uppercase tracking-wider">ABOUT BLOCKCERT</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            The Trust Infrastructure for <span className="text-gradient-emerald">Academic Credentials</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Eliminating degree forgery and administrative verification friction through Ed25519 digital signatures, deterministic SHA-256 canonicalization, and linear hash chain ledgers.
          </p>
        </div>

        {/* Problem & Solution Grid (PRD Section 1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-rose-500/30 bg-slate-900/80 space-y-4 text-left">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 w-fit">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">The Problem</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Academic credentials such as degrees, marksheets, certificates, and transcripts are vulnerable to forgery, visual manipulation, and unauthorized tampering.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Employers must wait weeks for manual registrar verification responses.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Static PDF diplomas can be altered with standard graphics software.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Revoked credentials continue to be shared without real-time state flags.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-emerald-500/30 bg-slate-900/80 space-y-4 text-left">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">The BlockCert Solution</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              BlockCert equips educational institutions with server-side asymmetric cryptographic identity to digitally sign canonical credential records onto a tamper-evident hash chain.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Permanent Credential ID &amp; QR:</strong> Stays constant across legitimate version modifications.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Instant Sub-Second Verification:</strong> Independent verification without university back-and-forth.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Tamper-Evident Auditing:</strong> Any single-character alteration immediately breaks the hash and signature.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Product Philosophy Statement (PRD Section 33) */}
        <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-amber-500/30 bg-slate-900/90 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 text-xs font-bold text-amber-400">
            <Award className="h-3.5 w-3.5" />
            <span>PRD PRODUCT PHILOSOPHY</span>
          </div>

          <blockquote className="text-xl sm:text-3xl font-extrabold text-white max-w-3xl mx-auto leading-snug">
            &ldquo;The institution issues the credential. The student owns and shares it. The employer verifies it independently. The hash chain preserves evidence of its history.&rdquo;
          </blockquote>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Blockchain, hashing, and digital signatures are the underlying trust technology; the product itself is instant, independent, tamper-evident academic credential verification.
          </p>
        </div>

        {/* Privacy & Compliance (PRD Section 15) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="rounded-2xl glass-panel p-6 border border-white/10 bg-slate-900/60 space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase font-mono">Zero Public PII</div>
            <h4 className="text-base font-bold text-white">No Public Name Search</h4>
            <p className="text-xs text-slate-400">
              Credentials can only be looked up via authorized permanent Credential IDs or physical QR scans, preventing scraping.
            </p>
          </div>

          <div className="rounded-2xl glass-panel p-6 border border-white/10 bg-slate-900/60 space-y-2">
            <div className="text-xs font-bold text-cyan-400 uppercase font-mono">Linear Hash Chain</div>
            <h4 className="text-base font-bold text-white">Single-Node Ledger</h4>
            <p className="text-xs text-slate-400">
              Deterministic previous-hash linkage ensures that altering any historical record invalidates the entire chain.
            </p>
          </div>

          <div className="rounded-2xl glass-panel p-6 border border-white/10 bg-slate-900/60 space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase font-mono">Server-Side Security</div>
            <h4 className="text-base font-bold text-white">Isolated Private Keys</h4>
            <p className="text-xs text-slate-400">
              Private signing keys never leave the backend crypto engine and are never exposed to browsers or API responses.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/verify"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-xl"
          >
            <span>Test Live Credential Verification</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl glass-panel px-7 py-3.5 text-sm font-semibold text-slate-300 hover:text-white"
          >
            <span>View 8-Stage Architecture</span>
          </Link>
        </div>

      </main>

      <Footer
        onOpenDemoModal={() => setActiveModal("demo")}
        onOpenWhitepaperModal={() => setActiveModal("whitepaper")}
      />
      <DemoModal type={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}
