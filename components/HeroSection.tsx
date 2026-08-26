"use client";

import React, { useState } from "react";
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
  Check
} from "lucide-react";

interface HeroSectionProps {
  onOpenDemoModal: () => void;
  onOpenWhitepaperModal: () => void;
}

export default function HeroSection({ onOpenDemoModal, onOpenWhitepaperModal }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResultState, setSearchResultState] = useState<"idle" | "searching" | "found" | "not_found">("idle");
  const [copiedHash, setCopiedHash] = useState(false);

  const sampleAnchorId = "0x8f2d91a4c9b3e10984f102c34b";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchResultState("searching");
    setTimeout(() => {
      if (
        searchQuery.toLowerCase().includes("evelyn") ||
        searchQuery.toLowerCase().includes("8f2d") ||
        searchQuery.toLowerCase().includes("doc") ||
        searchQuery.toLowerCase().includes("0x") ||
        searchQuery.length > 2
      ) {
        setSearchResultState("found");
      } else {
        setSearchResultState("not_found");
      }
    }, 600);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleAnchorId);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
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
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md shadow-inner shadow-emerald-500/10">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline tracking-wider uppercase text-[11px]">WELCOME TO THE FUTURE OF TRUST</span>
              <span className="sm:hidden tracking-wider uppercase text-[11px]">SECURE END-TO-END CREDENTIALING</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Authoritative academic credentials. <br className="hidden sm:inline" />
              <span className="text-gradient-emerald">Anchored on-chain.</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-slate-300 leading-relaxed">
              Eliminate credential fraud and slow manual background checks instantly. 
              TrustChain allows institutions to issue cryptographically signed, tamper-proof degrees, 
              transcripts, and professional licenses verified by employers in seconds.
            </p>

            {/* Interactive Live Ledger Search Bar */}
            <div className="pt-2 max-w-xl mx-auto lg:mx-0">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (searchResultState !== "idle") setSearchResultState("idle");
                    }}
                    placeholder="Verify Anchor Hash, Student ID or Name (e.g. 0x8f2d...)"
                    className="w-full pl-10 pr-32 py-3.5 text-sm rounded-xl glass-panel text-white placeholder-slate-400 border border-slate-700/60 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-xl transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    {searchResultState === "searching" ? (
                      <span className="animate-spin h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <span>Search</span>
                        <Search className="h-3 w-3" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Search Result Feedback */}
              {searchResultState === "found" && (
                <div className="mt-3 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>Record Found:</strong> Dr. Evelyn Vance — PhD Computer Science (Valid & Anchored)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">0x8f2d...c34b</span>
                </div>
              )}
              {searchResultState === "not_found" && (
                <div className="mt-3 p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <span>No exact anchor match for &quot;{searchQuery}&quot;. Try searching &quot;0x8f2d&quot; or &quot;Evelyn&quot;.</span>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenDemoModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-base font-bold text-slate-950 shadow-xl shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-400 hover:to-teal-400 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Building2 className="h-5 w-5" />
                <span>Enterprise Portal Launch</span>
              </button>

              <button
                onClick={onOpenWhitepaperModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl glass-panel glass-panel-hover px-6 py-3.5 text-base font-semibold text-slate-200 hover:text-white border border-slate-700/80 cursor-pointer"
              >
                <FileCode2 className="h-5 w-5 text-emerald-400" />
                <span>Read Technical Whitepaper</span>
              </button>
            </div>

          </div>

          {/* Right Column: Cryptographic Proof Preview Card */}
          <div className="lg:col-span-5 relative">
            
            {/* Glowing Backdrop Border */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 blur-lg opacity-70 group-hover:opacity-100 transition duration-1000"></div>

            <div className="relative rounded-2xl glass-panel p-6 sm:p-8 space-y-6 border border-emerald-500/30 bg-slate-950/90 shadow-2xl">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">Cryptographic Proof</h3>
                    <p className="text-sm font-semibold text-white">Stanford University Alliance</p>
                  </div>
                </div>
                
                {/* Live Status Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 animate-pulse-green">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  <span>Ledger Anchored</span>
                </div>
              </div>

              {/* Credential Data Fields */}
              <div className="space-y-4 text-left">
                <div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Graduate Student</span>
                  <div className="text-xl font-bold text-white mt-0.5">Dr. Evelyn Vance</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Degree Issued</span>
                    <div className="text-sm font-semibold text-slate-200 mt-0.5">Doctor of Philosophy</div>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Graduation Class</span>
                    <div className="text-sm font-semibold text-slate-200 mt-0.5">Class of 2026</div>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Specialization</span>
                  <div className="text-sm font-semibold text-emerald-300 mt-0.5">
                    Computer Science &amp; Cryptographic Architecture
                  </div>
                </div>

                {/* Blockchain Hash Box */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Lock className="h-3 w-3 text-emerald-400" />
                      <span>Ethereum L2 Anchor ID</span>
                    </span>
                    <button
                      onClick={copyToClipboard}
                      className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-[10px] font-mono cursor-pointer"
                    >
                      {copiedHash ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Check className="h-3 w-3" /> Copied!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Copy className="h-3 w-3" /> Copy Hash
                        </span>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-xs text-emerald-400/90 break-all select-all font-semibold">
                    {sampleAnchorId}
                  </div>
                </div>
              </div>

              {/* Card Footer: Verification QR Code & CTA */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white text-slate-950 shadow-md">
                    <QrCode className="h-7 w-7" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-white">Live Employer Verification</div>
                    <div className="text-slate-400 text-[11px]">Scan QR or query contract</div>
                  </div>
                </div>

                <button
                  onClick={onOpenDemoModal}
                  className="p-2 rounded-xl glass-panel hover:bg-emerald-500/20 text-emerald-400 transition-colors cursor-pointer"
                  title="Verify Record"
                >
                  <ExternalLink className="h-5 w-5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
