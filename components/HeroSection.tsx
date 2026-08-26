"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  QrCode, 
  ExternalLink, 
  Sparkles, 
  FileCode2, 
  Lock, 
  Building2,
  Copy,
  Check,
  ArrowRight,
  Award
} from "lucide-react";
import { formatHash, copyTextToClipboard } from "@/lib/crypto";

interface HeroSectionProps {
  onOpenDemoModal?: () => void;
  onOpenWhitepaperModal?: () => void;
}

export default function HeroSection({ onOpenDemoModal, onOpenWhitepaperModal }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedHash, setCopiedHash] = useState(false);
  const router = useRouter();

  const samplePermanentId = "CRED-7F83A91";
  const sampleHash = "a71f92e48b11c97a5482e987c61d5203fbc1029384756bca9201948572019485";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim() || samplePermanentId;
    router.push(`/verify?id=${encodeURIComponent(query)}`);
  };

  const copyToClipboard = async () => {
    const ok = await copyTextToClipboard(samplePermanentId);
    if (ok) {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <section id="hero" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-radial-gradient">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Content & Search */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Pill Badge matching PRD */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md shadow-inner shadow-emerald-500/10">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span className="tracking-wider uppercase text-[11px]">SECURE ACADEMIC CREDENTIALS</span>
            </div>

            {/* Main Headline matching PRD Section 24 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Verify academic credentials <br className="hidden sm:inline" />
              <span className="text-gradient-emerald">without the paperwork.</span>
            </h1>

            {/* Subtitle matching PRD */}
            <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-slate-300 leading-relaxed">
              Institution-issued, digitally signed credentials with tamper-evident verification.
              Eliminate diploma forgery and manual delays with Ed25519 digital signatures, 
              permanent QR codes, and linear hash chain integrity checks.
            </p>

            {/* Live Credential Search Bar */}
            <div className="pt-2 max-w-xl mx-auto lg:mx-0">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter Credential ID (e.g. CRED-7F83A91 or CRED-9E24B10)"
                    className="w-full pl-10 pr-36 py-3.5 text-sm rounded-xl glass-panel text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono shadow-xl transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    <span>Verify ID</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>

              {/* Quick sample link */}
              <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-400">
                <span>Try sample IDs:</span>
                <Link
                  href="/verify?id=CRED-7F83A91"
                  className="font-mono text-emerald-400 hover:underline"
                >
                  CRED-7F83A91 (Rahul Sharma)
                </Link>
                <span>•</span>
                <Link
                  href="/verify?id=CRED-9E24B10"
                  className="font-mono text-emerald-400 hover:underline"
                >
                  CRED-9E24B10 (Dr. Evelyn)
                </Link>
              </div>
            </div>

            {/* CTAs matching PRD Section 24: [ Verify a Credential ] [ Institution Login ] */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/verify"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-base font-bold text-slate-950 shadow-xl shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-400 hover:to-teal-400 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Search className="h-5 w-5" />
                <span>Verify a Credential</span>
              </Link>

              <Link
                href="/login?role=INSTITUTE"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl glass-panel glass-panel-hover px-6 py-3.5 text-base font-semibold text-slate-200 hover:text-white border border-slate-700/80 cursor-pointer"
              >
                <Building2 className="h-5 w-5 text-emerald-400" />
                <span>Institution Login</span>
              </Link>

              {onOpenDemoModal && (
                <button
                  type="button"
                  onClick={onOpenDemoModal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 px-5 py-3.5 text-sm font-semibold text-amber-300 hover:text-amber-200 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Schedule Demo</span>
                </button>
              )}

              {onOpenWhitepaperModal && (
                <button
                  type="button"
                  onClick={onOpenWhitepaperModal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 px-5 py-3.5 text-sm font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  <FileCode2 className="h-4 w-4 text-cyan-400" />
                  <span>Technical Whitepaper</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Realistic Academic Certificate Preview Card (PRD Section 24) */}
          <div className="lg:col-span-5 relative">
            
            {/* Glowing Backdrop Border */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/30 via-emerald-500/30 to-cyan-500/30 blur-lg opacity-70 pointer-events-none group-hover:opacity-100 transition duration-1000"></div>

            <div className="relative rounded-3xl certificate-frame p-6 sm:p-7 space-y-5 border border-amber-500/40 bg-slate-950/95 shadow-2xl text-left">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400">OFFICIAL BLOCKCERT PROOF</span>
                    <p className="text-xs font-extrabold text-white">Stanford University Alliance</p>
                  </div>
                </div>
                
                {/* Live Status Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 animate-pulse-green">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>ACTIVE / VERIFIED</span>
                </div>
              </div>

              {/* Credential Content */}
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Conferred Graduate</span>
                  <div className="text-xl font-extrabold text-white text-gradient-gold">Rahul Sharma</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Degree Conferred</span>
                    <div className="text-xs font-bold text-slate-200 mt-0.5">Bachelor of Technology</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Cumulative CGPA</span>
                    <div className="text-xs font-bold text-amber-300 mt-0.5">8.2 / 10.0 (Distinction)</div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Department / Specialization</span>
                  <div className="text-xs font-medium text-emerald-300 mt-0.5">
                    Computer Science &amp; Engineering (Distributed Systems)
                  </div>
                </div>

                {/* Permanent Credential ID & SHA-256 Box */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 font-mono">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Lock className="h-3 w-3 text-emerald-400" />
                      <span>Permanent ID</span>
                    </span>
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-[10px] cursor-pointer"
                    >
                      {copiedHash ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Check className="h-3 w-3" /> Copied
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Copy className="h-3 w-3" /> Copy
                        </span>
                      )}
                    </button>
                  </div>
                  <div className="text-xs text-amber-300 font-extrabold">
                    {samplePermanentId}
                  </div>
                  <div className="text-[10px] text-slate-400 break-all pt-1 border-t border-slate-800/60">
                    SHA-256: <span className="text-emerald-400/90">{formatHash(sampleHash, 10)}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Permanent QR Code & Instant Verify CTA */}
              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-white text-slate-950 shadow-md">
                    <QrCode className="h-7 w-7" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-white">Permanent QR Seal</div>
                    <div className="text-slate-400 text-[10px]">Unchanged across version revisions</div>
                  </div>
                </div>

                <Link
                  href={`/verify?id=${samplePermanentId}`}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors cursor-pointer"
                  title="Run Full 4-Point Cryptographic Check"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
