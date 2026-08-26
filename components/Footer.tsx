"use client";

import React from "react";
import { ShieldCheck, ExternalLink, Globe, Share2, Code } from "lucide-react";

interface FooterProps {
  onOpenDemoModal: () => void;
  onOpenWhitepaperModal: () => void;
}

export default function Footer({ onOpenDemoModal, onOpenWhitepaperModal }: FooterProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 border-t border-white/10 text-slate-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Grid: Mobile 2x2 / Desktop 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Info Column (Spans 2 columns on desktop) */}
          <div className="col-span-2 space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Trust<span className="text-emerald-400">Chain</span>
              </span>
            </div>
            
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Cryptographic standard for academic and professional credential verification. 
              Eliminating diploma fraud with tamper-proof blockchain consensus.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors" aria-label="Developer Docs">
                <Code className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors" aria-label="Global Network">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors" aria-label="Share">
                <Share2 className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation Column 1: Platform */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => scrollToSection("hero")} className="hover:text-emerald-400 transition-colors">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("revocation")} className="hover:text-emerald-400 transition-colors">
                  Verification Portal
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("dashboard")} className="hover:text-emerald-400 transition-colors">
                  Issuer Command Center
                </button>
              </li>
              <li>
                <button onClick={onOpenDemoModal} className="hover:text-emerald-400 transition-colors">
                  Interactive Demo
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Security */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Security</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenWhitepaperModal} className="hover:text-emerald-400 transition-colors">
                  Security Specs
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("hero")} className="hover:text-emerald-400 transition-colors">
                  Cryptographic Proof
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("revocation")} className="hover:text-emerald-400 transition-colors">
                  L2 Consensus Nodes
                </button>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">FERPA &amp; GDPR Compliance</span>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3: Documentation & Contact */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Documentation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenWhitepaperModal} className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>Technical Whitepaper</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </li>
              <li>
                <button onClick={onOpenDemoModal} className="hover:text-emerald-400 transition-colors">
                  API &amp; SDK Guides
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("dashboard")} className="hover:text-emerald-400 transition-colors">
                  HSM Module Docs
                </button>
              </li>
              <li>
                <button onClick={onOpenDemoModal} className="hover:text-emerald-400 transition-colors">
                  Support Portal
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} TrustChain Protocol Inc. All rights reserved. SIH-2026 Authoritative Standard.
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Security Audit</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
