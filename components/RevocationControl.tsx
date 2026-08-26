"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  RotateCcw, 
  ArrowRight,
  Lock,
  Globe,
  Layers
} from "lucide-react";

interface RevocationControlProps {
  onOpenDemoModal?: () => void;
}

export default function RevocationControl({ onOpenDemoModal }: RevocationControlProps) {
  const [isRevoked, setIsRevoked] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  const toggleRevocationState = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsRevoked(!isRevoked);
      setIsSimulating(false);
    }, 500);
  };

  return (
    <section id="revocation" className="py-20 bg-slate-950/60 relative overflow-hidden border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-rose-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Revocation Simulator Card */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className={`relative rounded-3xl glass-panel p-6 sm:p-8 space-y-6 border transition-all duration-500 shadow-2xl bg-slate-900/90 ${
              isRevoked ? "border-rose-500/40 shadow-rose-950/20" : "border-emerald-500/40 shadow-emerald-950/20"
            }`}>
              
              {/* Card Title Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${
                    isRevoked 
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/30" 
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  }`}>
                    {isRevoked ? <ShieldAlert className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-white">Revocation &amp; Re-issuance Engine</h3>
                    <p className="text-xs text-slate-400">Single-node hash chain event propagation</p>
                  </div>
                </div>

                {/* Interactive State Switch Button */}
                <button
                  type="button"
                  onClick={toggleRevocationState}
                  disabled={isSimulating}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    isRevoked
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                  }`}
                >
                  <RotateCcw className={`h-3.5 w-3.5 ${isSimulating ? "animate-spin" : ""}`} />
                  <span>{isRevoked ? "Simulate Re-issue (v2 ACTIVE)" : "Simulate Revocation Event"}</span>
                </button>
              </div>

              {/* Card Body Text */}
              <p className="text-sm text-slate-300 leading-relaxed text-left">
                When credentials require revocation due to disciplinary action or replacement, registrars 
                record a signed <code className="text-emerald-400 font-mono text-xs">REVOKE</code> block in 
                the hash chain. The permanent QR code and Credential ID dynamically resolve to 
                <strong className="text-rose-400"> REVOKED</strong> across all employer queries.
              </p>

              {/* Dynamic Status Badge Indicator */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all ${
                isRevoked
                  ? "bg-rose-950/40 border-rose-500/50 text-rose-300 animate-pulse-red"
                  : "bg-emerald-950/40 border-emerald-500/50 text-emerald-300 animate-pulse-green"
              }`}>
                <div className="flex items-center gap-2.5">
                  {isRevoked ? (
                    <AlertTriangle className="h-5 w-5 text-rose-400 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  )}
                  <div>
                    <div className="font-extrabold uppercase tracking-wider text-xs">
                      {isRevoked ? "Status: REVOKED (Block #3 EVENT)" : "Status: ACTIVE (Block #2 EVENT)"}
                    </div>
                    <div className="text-[11px] font-mono opacity-80 mt-0.5">
                      {isRevoked
                        ? "Event Type: REVOKE | Digital Signature Confirmed"
                        : "Event Type: MODIFY | Version 2.0 Supercedes v1.0"}
                    </div>
                  </div>
                </div>

                <span className="font-mono text-[10px] uppercase px-2 py-1 rounded bg-black/40 border border-white/10">
                  {isRevoked ? "Block #3" : "Block #2"}
                </span>
              </div>

              {/* Hash Details Footer */}
              <div className="pt-2 text-left space-y-2 border-t border-white/5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Permanent Credential ID</span>
                  </span>
                  <span className="font-bold text-amber-300">CRED-7F83A91 (Stable across lifecycle)</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Explanatory Content & Action Button */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 rounded-md bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-400">
              <Cpu className="h-3.5 w-3.5" />
              <span className="uppercase tracking-wider">IMMUTABLE LIFECYCLE AUDITING</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Prevent fraudulent certificate reuse permanently
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Unlike static PDF files that can be duplicated or printed after being rescinded, BlockCert reads status 
              directly from the tamper-evident hash chain. Employer verification queries always execute server-side 
              status and cryptographic checks in real time.
            </p>

            {/* Bullet Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-sm text-slate-200">
                <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 mt-0.5">
                  <Lock className="h-4 w-4" />
                </div>
                <span><strong>No Silently Overwritten Records:</strong> Legitimate corrections create Version 2 and preserve Version 1 as SUPERSEDED.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-200">
                <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 mt-0.5">
                  <Globe className="h-4 w-4" />
                </div>
                <span><strong>Permanent QR Continuity:</strong> The student&apos;s physical and digital QR code never needs replacement after legitimate grade modifications.</span>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/verify?id=CRED-7F83A91"
                className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-base font-bold text-slate-950 shadow-xl shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all cursor-pointer"
              >
                <span>Try Verification Portal</span>
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/security"
                className="inline-flex items-center gap-2 rounded-xl glass-panel px-5 py-3.5 text-sm font-semibold text-slate-300 hover:text-white"
              >
                <span>Read Cryptographic Specs</span>
              </Link>

              {onOpenDemoModal && (
                <button
                  type="button"
                  onClick={onOpenDemoModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 px-5 py-3.5 text-sm font-semibold text-amber-300 hover:text-amber-200 cursor-pointer"
                >
                  <span>Schedule Registrar Demo</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
