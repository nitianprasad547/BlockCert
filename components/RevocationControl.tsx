"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  RotateCcw, 
  ArrowRight,
  Lock,
  Globe
} from "lucide-react";

interface RevocationControlProps {
  onOpenDemoModal: () => void;
}

export default function RevocationControl({ onOpenDemoModal }: RevocationControlProps) {
  const [isRevoked, setIsRevoked] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  const toggleRevocationState = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsRevoked(!isRevoked);
      setIsSimulating(false);
    }, 600);
  };

  return (
    <section id="revocation" className="py-20 bg-slate-950/60 relative overflow-hidden border-t border-white/5">
      
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-rose-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Revocation Simulator Card */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Glowing Backdrop Border */}
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
                    <h3 className="text-lg font-bold text-white">Revocation &amp; Re-issuance</h3>
                    <p className="text-xs text-slate-400">Consensus node instant updates</p>
                  </div>
                </div>

                {/* Interactive State Switch Button */}
                <button
                  onClick={toggleRevocationState}
                  disabled={isSimulating}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    isRevoked
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                  }`}
                >
                  <RotateCcw className={`h-3.5 w-3.5 ${isSimulating ? "animate-spin" : ""}`} />
                  <span>{isRevoked ? "Simulate Re-issue" : "Simulate Revoke"}</span>
                </button>
              </div>

              {/* Card Body Text */}
              <p className="text-sm text-slate-300 leading-relaxed text-left">
                Should credentials need revocation due to ethical violations, corrections, or updates, 
                registrars can sign a revocation transaction. The verification portal instantly flags 
                the certificate as &quot;INVALIDATED&quot; globally across all validation queries.
              </p>

              {/* Dynamic Status Badge Indicator */}
              <div className={`p-4 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
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
                      {isRevoked ? "Status: INVALIDATED / REVOKED" : "Status: ACTIVE / VERIFIED"}
                    </div>
                    <div className="text-[11px] font-mono opacity-80 mt-0.5">
                      {isRevoked
                        ? "Revocation Hash Propagated to Ethereum L2 Nodes"
                        : "Consensus Confirmed across 1,200+ Nodes"}
                    </div>
                  </div>
                </div>

                <span className="font-mono text-[10px] uppercase px-2 py-1 rounded bg-black/40 border border-white/10">
                  Block #1948291
                </span>
              </div>

              {/* Hash Details Footer */}
              <div className="pt-2 text-left space-y-2 border-t border-white/5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Global Consensus Propagation Speed</span>
                  </span>
                  <span className="font-mono font-bold text-white">&lt; 1.2 Seconds</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Explanatory Content & Action Button */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 rounded-md bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-400">
              <Cpu className="h-3.5 w-3.5" />
              <span className="uppercase tracking-wider">REAL-TIME CONSENSUS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Prevent fraudulent degree usage instantly
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Unlike static PDF files that can be edited or shared post-revocation, TrustChain reads status 
              directly from blockchain consensus. Employers validation queries dynamically execute live contract 
              state calls to guarantee authenticity.
            </p>

            {/* Bullet Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-sm text-slate-200">
                <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 mt-0.5">
                  <Lock className="h-4 w-4" />
                </div>
                <span><strong>Zero Static Vulnerabilities:</strong> Credentials cannot be forged or reused after institution revocation.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-200">
                <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 mt-0.5">
                  <Globe className="h-4 w-4" />
                </div>
                <span><strong>Instant Global Sync:</strong> Verification endpoints worldwide receive state updates in under 2 seconds.</span>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="pt-4">
              <button
                onClick={onOpenDemoModal}
                className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-base font-bold text-slate-950 shadow-xl shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all cursor-pointer"
              >
                <span>Try Verification Portal</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
