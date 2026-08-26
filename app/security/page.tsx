"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoModal, { ModalType } from "@/components/DemoModal";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  FileCode2, 
  Database, 
  Sparkles, 
  ArrowRight,
  Server,
  EyeOff
} from "lucide-react";

export default function SecurityPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const securityRules = [
    {
      id: "REQ-01",
      title: "Isolated Private Key Architecture",
      desc: "Institution Ed25519 private keys are stored securely server-side only and are NEVER exposed via API responses or frontend code.",
      icon: Lock,
    },
    {
      id: "REQ-02",
      title: "Deterministic JSON Canonicalization",
      desc: "Before SHA-256 hashing, academic records are canonicalized with sorted keys and normalized delimiters to guarantee platform-independent hash equality.",
      icon: Cpu,
    },
    {
      id: "REQ-03",
      title: "Tamper-Evident Hash Chain",
      desc: "Each block links to the previous block's SHA-256 digest. Historical modification alters block hash, instantly breaking chain verification.",
      icon: Layers,
    },
    {
      id: "REQ-04",
      title: "Immutable Credential Versioning",
      desc: "Modifications never overwrite historical data. Legitimate corrections increment the version number, mark older records SUPERSEDED, and append a MODIFY event.",
      icon: Database,
    },
    {
      id: "REQ-05",
      title: "Zero-PII Privacy Protection",
      desc: "To protect student privacy and comply with global privacy standards, unhashed personally identifiable information (PII) is not stored directly on public immutable chains.",
      icon: EyeOff,
    },
    {
      id: "REQ-06",
      title: "Strict Server-Side Verification Decisions",
      desc: "Employer verification decisions (VERIFIED / TAMPERED / REVOKED) are calculated exclusively on the backend crypto engine.",
      icon: Server,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 bg-grid-pattern relative flex flex-col justify-between">
      <Navbar onOpenDemoModal={() => setActiveModal("demo")} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16 flex-1">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1.5 text-xs font-bold text-cyan-400">
            <Lock className="h-3.5 w-3.5" />
            <span className="uppercase tracking-wider">CRYPTOGRAPHIC SPECIFICATIONS</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Cryptographic Integrity &amp; <br />
            <span className="text-gradient-emerald">Security Architecture</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Detailed technical overview of Ed25519 digital signature keys, deterministic payload hashing, single-node hash chain validation, and tamper prevention.
          </p>
        </div>

        {/* Core Cryptographic Spec Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-emerald-500/30 bg-slate-900/80 space-y-4 text-left">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 w-fit">
              <Key className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Ed25519 Key Pairs</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              BlockCert utilizes the <strong>Edwards-curve Digital Signature Algorithm (Ed25519)</strong> over Curve25519. Offering 128-bit security levels with sub-millisecond signing speeds and resistance to side-channel attacks.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400">
              Curve: Ed25519 (RFC 8032)<br />
              Signature Length: 64 bytes<br />
              Public Key: 32 bytes (Raw / Base64)
            </div>
          </div>

          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-cyan-500/30 bg-slate-900/80 space-y-4 text-left">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 w-fit">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">SHA-256 Payload Digest</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every student record is serialized into deterministic canonical JSON (sorted keys, stripped whitespace) before computing the standard 256-bit secure hash algorithm (FIPS 180-4).
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-400">
              Algorithm: SHA-256 (256-bit)<br />
              Format: 64 Hexadecimal Chars<br />
              Collision Resistance: 2¹²⁸ operations
            </div>
          </div>

          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-amber-500/30 bg-slate-900/80 space-y-4 text-left" id="hash-chain">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 w-fit">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Single-Node Hash Chain</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              All credential events (<code>ISSUE</code>, <code>MODIFY</code>, <code>REVOKE</code>) append a sequential block. The block hash incorporates the previous block&apos;s hash, creating an immutable history tree.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-300">
              Genesis PrevHash: 000000...000<br />
              Linkage: block_hash = H(prev_hash + data)<br />
              Tamper Evidence: 100% Deterministic
            </div>
          </div>

        </div>

        {/* PRD Section 27: Security Requirements Grid */}
        <div className="space-y-6 text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>MANDATORY PROTOCOL SPECIFICATIONS</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              PRD Security &amp; Isolation Requirements
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityRules.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.id}
                  className="rounded-2xl glass-panel p-6 border border-white/10 bg-slate-900/70 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h4 className="text-base font-bold text-white">{r.title}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {r.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tamper Detection */}
        <div id="tamper-detection" className="rounded-3xl glass-panel p-8 sm:p-10 border border-rose-500/30 bg-slate-900/90 space-y-4 text-left">
          <h3 className="text-xl font-extrabold text-white">Tamper Detection Engine</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            BlockCert recomputes the canonical SHA-256 digest at verification time and compares it against the signed ledger hash.
            Any mismatch in student name, CGPA, or degree fields triggers an immediate <strong className="text-rose-400">TAMPERED</strong> result.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-white/10 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div>
            <h3 className="text-xl font-extrabold text-white">Verify Cryptographic Proofs in Action</h3>
            <p className="text-xs text-slate-400 mt-1">Test the 4-point cryptographic checks and simulated tamper detection engine now.</p>
          </div>
          <Link
            href="/verify?id=CRED-7F83A91"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center gap-2 flex-shrink-0"
          >
            <span>Launch Live Verifier</span>
            <ArrowRight className="h-4 w-4" />
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
