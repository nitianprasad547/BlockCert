"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoModal, { ModalType } from "@/components/DemoModal";
import Link from "next/link";
import { 
  FileText, 
  Cpu, 
  Lock, 
  Layers, 
  QrCode, 
  Search, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowDown, 
  Sparkles, 
  ArrowRight,
  Database,
  Key,
  GraduationCap
} from "lucide-react";

export default function HowItWorksPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const pipelineStages = [
    {
      stage: "STAGE 01",
      title: "Student Academic Record Ingestion",
      icon: FileText,
      color: "text-amber-400",
      badge: "FastAPI / Postgres / SQLite",
      desc: "Authorized institution staff enters student name, roll number, degree, department, CGPA, graduation year, and enrollment year into the registrar portal.",
      code: `{
  "student_name": "Rahul Sharma",
  "student_id_roll": "2022-CS-0418",
  "degree": "Bachelor of Technology",
  "department_branch": "Computer Science & Engineering",
  "cgpa": 8.2,
  "graduation_year": 2026,
  "institution_id": "INST-STANFORD-01"
}`,
    },
    {
      stage: "STAGE 02",
      title: "Permanent Credential ID Generation",
      icon: Key,
      color: "text-cyan-400",
      badge: "Cryptographic Salt",
      desc: "The system generates an unpredictable, permanent Credential ID (e.g. CRED-7F83A91). This ID remains completely unchanged even if the credential is later legitimately modified.",
      code: `Credential ID: CRED-7F83A91
Version: 1
Status: ACTIVE
Created: 2026-05-15T09:30:00Z`,
    },
    {
      stage: "STAGE 03",
      title: "Deterministic JSON Canonicalization & SHA-256",
      icon: Cpu,
      color: "text-emerald-400",
      badge: "RFC-8785 Canonical JSON",
      desc: "To avoid key order discrepancies across different systems, the JSON payload is sorted deterministically and hashed via SHA-256 to produce an immutable 64-character digest.",
      code: `SHA-256 Digest:
a71f92e48b11c97a5482e987c61d5203fbc1029384756bca9201948572019485`,
    },
    {
      stage: "STAGE 04",
      title: "Ed25519 Digital Signature via Institution Private Key",
      icon: Lock,
      color: "text-amber-300",
      badge: "Edwards-curve DSA",
      desc: "The backend signs the SHA-256 digest using the institution's Ed25519 private key. The private key remains securely isolated in backend storage and is never exposed.",
      code: `Digital Signature (Base64):
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855...`,
    },
    {
      stage: "STAGE 05",
      title: "Hash Chain Recording (Tamper-Evident Event Block)",
      icon: Layers,
      color: "text-cyan-300",
      badge: "Single-Node Blockchain",
      desc: "An event block is appended to the linear hash chain containing: block_id, timestamp, credential_id, event_type ('ISSUE'), version (1), previous_hash, block_hash, and signature.",
      code: `BLOCK #1:
event_type: ISSUE
previous_hash: 0000000000000000000000000000000000000000000000000000000000000000
block_hash: 9b4f2c018a427de83f60a92fbc947102e85a6b1029c4857291a0293847561029`,
    },
    {
      stage: "STAGE 06",
      title: "Permanent QR Code Generation",
      icon: QrCode,
      color: "text-emerald-400",
      badge: "QR ISO/IEC 18004",
      desc: "A permanent QR code is generated pointing to https://blockcert.verify/verify/CRED-7F83A91. It contains a reference to the Credential ID, preventing public exposure of private student data.",
      code: `QR Payload URL:
https://blockcert.verify/verify/CRED-7F83A91
Permanent QR: STABLE ACROSS VERSION MODIFICATIONS`,
    },
    {
      stage: "STAGE 07",
      title: "Student Portal Access & QR Sharing",
      icon: GraduationCap,
      color: "text-amber-400",
      badge: "Student Ownership",
      desc: "Rahul logs in to the Student Portal to view his authoritative digital certificate, copy his permanent verification link, or provide the QR code directly to hiring managers.",
      code: `Student: Rahul Sharma (STU-RAHUL-01)
Degree: Bachelor of Technology
Status: ACTIVE LEDGER ANCHORED`,
    },
    {
      stage: "STAGE 08",
      title: "Employer 4-Point Verification & Tamper Detection",
      icon: CheckCircle2,
      color: "text-emerald-400",
      badge: "4-Stage Cryptographic Proof",
      desc: "When an employer scans the QR, the backend executes 4 independent checks: (1) Recomputed SHA-256 Hash check, (2) Ed25519 Signature check, (3) Hash-Chain linkage check, (4) Active Status check.",
      code: `[✓] 1. SHA-256 Hash Check: PASSED
[✓] 2. Ed25519 Signature Check: PASSED
[✓] 3. Hash Chain Integrity Check: PASSED
[✓] 4. Revocation Status Check: PASSED
=> VERIFIED`,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 bg-grid-pattern relative flex flex-col justify-between">
      <Navbar onOpenDemoModal={() => setActiveModal("demo")} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16 flex-1">
        
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="uppercase tracking-wider">END-TO-END CRYPTOGRAPHIC PIPELINE</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            How BlockCert Works: <br />
            <span className="text-gradient-emerald">The 8-Stage Architecture</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Follow the complete verifiable credential flow from creation, hashing, and digital signing to single-node hash chain immutability and instant employer verification.
          </p>
        </div>

        {/* Sequential Pipeline Stages */}
        <div className="space-y-6">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div key={idx} className="relative">
                {idx > 0 && (
                  <div className="flex justify-center py-2">
                    <ArrowDown className="h-5 w-5 text-slate-600 animate-bounce" />
                  </div>
                )}

                <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 bg-slate-900/85 hover:border-emerald-500/40 transition-all text-left shadow-xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    
                    {/* Left: Info */}
                    <div className="lg:col-span-7 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {stage.stage}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-mono">
                          {stage.badge}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${stage.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                          {stage.title}
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {stage.desc}
                      </p>
                    </div>

                    {/* Right: Technical Code / Data Proof */}
                    <div className="lg:col-span-5 bg-slate-950 rounded-2xl p-4 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                      <pre className="text-emerald-400/90 whitespace-pre-wrap">{stage.code}</pre>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* What Happens When Someone Tampers? (PRD Section 12) */}
        <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-rose-500/40 bg-rose-950/15 space-y-6 text-left">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">MATHEMATICAL SECURITY PROOF</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What Happens If Data Is Tampered With?</h2>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            If an attacker or student alters a single character (e.g. changing CGPA from 8.2 to 10.0 or editing their degree name), the server-side recomputation generates a completely different SHA-256 hash digest. Because the digital signature is cryptographically bound to the original hash, the verification fails instantly:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-1">
              <span className="text-emerald-400 font-bold block">✓ Authoritative Record (CGPA = 8.2)</span>
              <div className="text-slate-400">SHA-256: a71f92e48b11...</div>
              <div className="text-emerald-400 font-semibold">Signature: VALID under Stanford Ed25519 Key</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/40 space-y-1">
              <span className="text-rose-400 font-bold block">❌ Tampered Record (CGPA = 10.0)</span>
              <div className="text-rose-300">SHA-256: f92c810d7a9b... (MISMATCH)</div>
              <div className="text-rose-400 font-semibold">Signature: INVALID ❌ Credential Integrity Failed</div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/verify?id=CRED-7F83A91"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-400 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="h-4 w-4" />
              <span>Test This Live in the Tamper Simulator</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
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
