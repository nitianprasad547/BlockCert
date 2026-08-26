"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink, Globe, Share2, Code, Lock, Cpu, Sparkles } from "lucide-react";

interface FooterProps {
  onOpenDemoModal?: () => void;
  onOpenWhitepaperModal?: () => void;
}

export default function Footer({ onOpenDemoModal, onOpenWhitepaperModal }: FooterProps) {
  return (
    <footer className="bg-slate-950 border-t border-white/10 text-slate-400 text-sm relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-48 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Main Grid: Mobile 2x2 / Desktop 5 columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Info Column (Spans 2 columns on desktop) */}
          <div className="col-span-2 space-y-4 text-left">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Block<span className="text-emerald-400">Cert</span>
              </span>
            </Link>
            
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Decentralized standard for academic and institutional credential verification. 
              Eliminating diploma fraud with Ed25519 digital signatures and tamper-evident hash chains.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                <span>SHA-256 + Ed25519 Core</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <Lock className="h-3.5 w-3.5 text-cyan-400" />
                <span>Zero PII on Chain</span>
              </span>
            </div>
          </div>

          {/* Navigation Column 1: Portals */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-emerald-400 font-medium">
                  <span>Employer Verification</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/institute/dashboard" className="hover:text-emerald-400 transition-colors">
                  Institution Command Center
                </Link>
              </li>
              <li>
                <Link href="/student/dashboard" className="hover:text-emerald-400 transition-colors">
                  Student Credential Locker
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors">
                  Role Portals Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Security & Architecture */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-400 transition-colors">
                  8-Stage Issuance Pipeline
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-emerald-400 transition-colors">
                  Cryptographic Integrity
                </Link>
              </li>
              <li>
                <Link href="/security#tamper-detection" className="hover:text-emerald-400 transition-colors">
                  Tamper Detection Engine
                </Link>
              </li>
              <li>
                <Link href="/security#hash-chain" className="hover:text-emerald-400 transition-colors">
                  Single-Node Hash Chain
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  Standards Compliance
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3: Documentation & Actions */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li>
                {onOpenWhitepaperModal ? (
                  <button
                    type="button"
                    onClick={onOpenWhitepaperModal}
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Technical Whitepaper</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                ) : (
                  <Link href="/security" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                    <span>Technical Whitepaper</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </li>
              <li>
                {onOpenDemoModal ? (
                  <button
                    type="button"
                    onClick={onOpenDemoModal}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    Schedule Registrar Demo
                  </button>
                ) : (
                  <Link href="/login?role=INSTITUTE" className="hover:text-emerald-400 transition-colors">
                    Schedule Registrar Demo
                  </Link>
                )}
              </li>
              <li>
                <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>FastAPI OpenAPI Docs</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <Link href="/verify?id=CRED-7F83A91" className="hover:text-emerald-400 transition-colors">
                  Sample Verification Demo
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} BlockCert Platform. Hackathon Edition.
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/about" className="hover:text-slate-400">About</Link>
            <Link href="/security" className="hover:text-slate-400">Security Policy</Link>
            <Link href="/how-it-works" className="hover:text-slate-400">Protocol</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
