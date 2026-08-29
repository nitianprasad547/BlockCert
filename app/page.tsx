"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import RegistrarDashboard from "@/components/RegistrarDashboard";
import RevocationControl from "@/components/RevocationControl";
import Testimonials from "@/components/Testimonials";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import DemoModal, { ModalType } from "@/components/DemoModal";
import Link from "next/link";
import { 
  ShieldCheck, 
  Search, 
  Lock, 
  Layers, 
  QrCode, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  FileText, 
  Building2, 
  GraduationCap, 
  Briefcase 
} from "lucide-react";

export default function Home() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const steps = [
    {
      step: "01",
      title: "Data Canonicalization",
      desc: "Student marks, degree, and identification are formatted into deterministic JSON schema.",
      icon: FileText,
      color: "text-amber-400",
    },
    {
      step: "02",
      title: "SHA-256 Hashing",
      desc: "A cryptographic 256-bit hash digest is generated from the canonical payload.",
      icon: Cpu,
      color: "text-emerald-400",
    },
    {
      step: "03",
      title: "Ed25519 Signing",
      desc: "The institution's private key signs the hash digest server-side in secure storage.",
      icon: Lock,
      color: "text-cyan-400",
    },
    {
      step: "04",
      title: "Hash Chain Recording",
      desc: "An immutable block is linked to previous hashes, creating a tamper-evident single-node ledger.",
      icon: Layers,
      color: "text-amber-300",
    },
    {
      step: "05",
      title: "Permanent QR Issuance",
      desc: "Permanent Credential ID and QR code are issued, remaining stable across version revisions.",
      icon: QrCode,
      color: "text-emerald-400",
    },
    {
      step: "06",
      title: "Employer 4-Point Check",
      desc: "Employers verify hash integrity, signature validity, chain continuity, and revocation status in under 2 seconds.",
      icon: CheckCircle2,
      color: "text-cyan-300",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 bg-grid-pattern relative">
      
      {/* Primary Navigation Bar */}
      <Navbar onOpenDemoModal={() => setActiveModal("demo")} />

      {/* Main Content Area */}
      <main className="relative">
        
        {/* 1. Hero Section & Digital Academic Certificate Preview */}
        <HeroSection
          onOpenDemoModal={() => setActiveModal("demo")}
          onOpenWhitepaperModal={() => setActiveModal("whitepaper")}
        />

        {/* 2. Key Cryptographic Statistics Bar */}
        <StatsBar />

        {/* 3. Three-Sided Role Ecosystem Overview (Product Philosophy) */}
        <section className="py-20 bg-slate-950 relative border-t border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 rounded-md bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-400">
                <Building2 className="h-3.5 w-3.5" />
                <span className="uppercase tracking-wider">PRODUCT PHILOSOPHY</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                One unified ledger for the whole ecosystem
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                The institution issues. The student owns and shares. The employer verifies independently.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Institution Card */}
              <div className="rounded-3xl glass-panel p-8 border border-emerald-500/30 bg-slate-900/80 space-y-5 text-left flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 w-fit">
                    <Building2 className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">1. Institution Portal</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Registrars digitally sign and issue credentials using Ed25519 private keys. Manage legitimate version corrections and revocations on-chain.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>One-click credential issuance</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Audit trail &amp; discrepancy inbox</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Cryptographic key management</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/institute/dashboard"
                  className="w-full text-center py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all"
                >
                  Enter Institute Portal
                </Link>
              </div>

              {/* Student Card */}
              <div className="rounded-3xl glass-panel p-8 border border-cyan-500/30 bg-slate-900/80 space-y-5 text-left flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 w-fit">
                    <GraduationCap className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">2. Student Portal</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Students access their permanent digital certificates, download verifiable QR codes, copy instant verification links, and report mark discrepancies.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Permanent digital diploma locker</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Shareable QR code &amp; verification link</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Discrepancy reporting to registrar</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/student/dashboard"
                  className="w-full text-center py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all"
                >
                  Enter Student Portal
                </Link>
              </div>

              {/* Employer Card */}
              <div className="rounded-3xl glass-panel p-8 border border-amber-500/30 bg-slate-900/80 space-y-5 text-left flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 w-fit">
                    <Briefcase className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">3. Employer Verifier</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Employers and recruiters verify credentials instantly without account creation or contacting the university. Complete 4-stage cryptographic proof.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                      <span>Instant QR camera / file scan</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                      <span>4-point cryptographic integrity proof</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                      <span>Tamper-detection sandbox testing</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/verify"
                  className="w-full text-center py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all"
                >
                  Launch Verification Portal
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* 4. How It Works Pipeline Overview (Cryptographic Lifecycle) */}
        <section className="py-20 bg-slate-950/70 relative border-t border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span className="uppercase tracking-wider">CRYPTOGRAPHIC LIFECYCLE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                How BlockCert guarantees absolute authenticity
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                From academic marksheet generation to instant employer validation in 6 automated cryptographic steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-3xl glass-panel p-6 border border-white/10 bg-slate-900/70 hover:border-emerald-500/40 glass-panel-hover text-left space-y-4 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-extrabold text-slate-700">
                        {s.step}
                      </span>
                      <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${s.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-white">{s.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Explore Full 8-Stage Interactive Lifecycle &amp; Security Specs</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Registrar Command Center Dashboard Section */}
        <RegistrarDashboard />

        {/* 6. Real-time Revocation & Reissuance Control */}
        <RevocationControl onOpenDemoModal={() => setActiveModal("demo")} />

        {/* 7. Testimonials & Social Proof */}
        <Testimonials />

        {/* 8. Call to Action */}
        <CtaSection
          onOpenDemoModal={() => setActiveModal("demo")}
          onOpenContactModal={() => setActiveModal("contact")}
        />

      </main>

      {/* Global Footer */}
      <Footer
        onOpenDemoModal={() => setActiveModal("demo")}
        onOpenWhitepaperModal={() => setActiveModal("whitepaper")}
      />

      {/* Interactive Modals */}
      <DemoModal type={activeModal} onClose={() => setActiveModal(null)} />

    </div>
  );
}
