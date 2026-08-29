"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  X, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  FileText, 
  Lock, 
  Send,
  Sparkles,
  Calendar,
  Clock,
  Video,
  ArrowRight,
  ExternalLink,
  Users,
  Play,
  RotateCcw,
  Cpu,
  Layers,
  QrCode,
  Search,
  Check,
  ChevronRight,
  ChevronLeft,
  KeyRound,
  FileCheck2,
  AlertCircle
} from "lucide-react";
import { api } from "@/lib/api";
import { canonicalizeJson, sha256Client, generateDeterministicSignature, formatHash } from "@/lib/crypto";

export type ModalType = "demo" | "whitepaper" | "contact" | null;

interface DemoModalProps {
  type: ModalType;
  onClose: () => void;
}

export default function DemoModal({ type, onClose }: DemoModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"workflow" | "schedule">("workflow");
  
  // Workflow Simulator State
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [studentName, setStudentName] = useState("Rahul Sharma");
  const [degree, setDegree] = useState("Bachelor of Technology");
  const [cgpa, setCgpa] = useState("8.50");
  const [rollNumber, setRollNumber] = useState("2022-CS-0418");
  
  const [simulatedHash, setSimulatedHash] = useState("");
  const [simulatedSignature, setSimulatedSignature] = useState("");
  const [simulatedBlockHash, setSimulatedBlockHash] = useState("");
  const [loadingSandbox, setLoadingSandbox] = useState(false);

  // Consultation Scheduling State
  const [submittedSchedule, setSubmittedSchedule] = useState(false);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split("T")[0];

  const [scheduleForm, setScheduleForm] = useState({
    name: "",
    email: "",
    institution: "",
    role: "Registrar",
    preferredDate: defaultDate,
    preferredTime: "10:00 AM EST",
  });

  // Calculate live cryptographic values on input change
  useEffect(() => {
    const compute = async () => {
      const payload = {
        student_name: studentName,
        student_id_roll: rollNumber,
        degree: degree,
        department_branch: "Computer Science & Engineering",
        cgpa: parseFloat(cgpa) || 8.5,
        graduation_year: 2026,
        enrollment_year: 2022,
        institution_id: "INST-STANFORD-01",
        institution_name: "Stanford University & Academic Alliance",
        classification: "First Class with Distinction",
        major_specialization: "Distributed Systems & Cryptography",
        issue_date: "2026-05-15",
      };
      const canonical = canonicalizeJson(payload);
      const hash = await sha256Client(canonical);
      const signature = generateDeterministicSignature(hash, "INST-STANFORD-01");
      const blockContent = `1|CRED-7F83A91|ISSUE|1|${hash}|0000000000000000000000000000000000000000000000000000000000000000`;
      const blockHash = await sha256Client(blockContent);

      setSimulatedHash(hash);
      setSimulatedSignature(signature);
      setSimulatedBlockHash(blockHash);
    };
    compute();
  }, [studentName, degree, cgpa, rollNumber]);

  // Auto-play timer for workflow demo
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && activeTab === "workflow") {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 5) {
            setIsPlaying(false);
            return 5;
          }
          return prev + 1;
        });
      }, 3200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeTab]);

  if (!type) return null;

  const handleInstantSandbox = async (role: "INSTITUTE" | "STUDENT" | "EMPLOYER") => {
    setLoadingSandbox(true);
    try {
      if (role === "INSTITUTE") {
        await api.login("registrar@stanford.edu", "INSTITUTE", "Stanford Registrar Office");
        onClose();
        router.push("/institute/dashboard");
      } else if (role === "STUDENT") {
        await api.login("rahul@student.edu", "STUDENT", "Rahul Sharma");
        onClose();
        router.push("/student/dashboard");
      } else {
        onClose();
        router.push("/verify");
      }
    } catch {
      onClose();
      router.push(role === "INSTITUTE" ? "/institute/dashboard" : role === "STUDENT" ? "/student/dashboard" : "/verify");
    } finally {
      setLoadingSandbox(false);
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      try {
        const existing = JSON.parse(localStorage.getItem("blockcert_scheduled_demos") || "[]");
        existing.push({
          ...scheduleForm,
          scheduledAt: new Date().toISOString(),
          id: `DEMO-${Date.now()}`,
        });
        localStorage.setItem("blockcert_scheduled_demos", JSON.stringify(existing));
      } catch (err) {
        console.error(err);
      }
    }
    setSubmittedSchedule(true);
  };

  const resetAndClose = () => {
    setSubmittedSchedule(false);
    setIsPlaying(false);
    setCurrentStep(1);
    onClose();
  };

  const stepsList = [
    { num: 1, label: "1. Canonicalize", icon: FileText, title: "Deterministic Canonical Schema" },
    { num: 2, label: "2. Hash & Sign", icon: Lock, title: "SHA-256 Digest & Ed25519 Signature" },
    { num: 3, label: "3. Hash Chain", icon: Layers, title: "Tamper-Evident Ledger Block Anchor" },
    { num: 4, label: "4. Permanent QR", icon: QrCode, title: "Verifiable Credential & QR Code" },
    { num: 5, label: "5. Verify Audit", icon: CheckCircle2, title: "Instant 4-Point Employer Verification" },
  ];

  return (
    <div 
      id="blockcert-demo-modal-overlay"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) resetAndClose();
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel border border-emerald-500/40 bg-slate-900/95 p-5 sm:p-8 shadow-2xl space-y-6 text-left">
        
        {/* Close Icon */}
        <button
          type="button"
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer z-10"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal: Interactive Workflow Demo or Whitepaper */}
        {(type === "demo" || type === "contact") && (
          <>
            {/* Header with Mode Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="uppercase tracking-wider">LIVE PLATFORM DEMONSTRATION</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  BlockCert Cryptographic Workflow
                </h3>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setActiveTab("workflow"); setIsPlaying(false); }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === "workflow"
                      ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Interactive Simulator
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab("schedule"); setIsPlaying(false); }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === "schedule"
                      ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Book 1-on-1 Call
                </button>
              </div>
            </div>

            {/* TAB 1: INTERACTIVE WORKFLOW SIMULATOR */}
            {activeTab === "workflow" && (
              <div className="space-y-6 animate-fadeIn">

                {/* Step Navigation Pills */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {stepsList.map((st) => {
                    const Icon = st.icon;
                    const isActive = currentStep === st.num;
                    const isCompleted = currentStep > st.num;
                    return (
                      <button
                        key={st.num}
                        type="button"
                        onClick={() => { setCurrentStep(st.num); setIsPlaying(false); }}
                        className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 group ${
                          isActive
                            ? "border-emerald-500 bg-emerald-950/40 text-emerald-400 ring-1 ring-emerald-500/40"
                            : isCompleted
                            ? "border-emerald-500/30 bg-slate-950/80 text-emerald-300"
                            : "border-white/5 bg-slate-950/50 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isActive ? "bg-emerald-500/20 text-emerald-300" : isCompleted ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[10px] font-extrabold hidden sm:block truncate w-full">
                          Step {st.num}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Main Simulator Viewport */}
                <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 sm:p-6 space-y-4 relative overflow-hidden">
                  
                  {/* Step Banner */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-xs border border-emerald-500/30">
                        {currentStep}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        {stepsList[currentStep - 1].title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isPlaying 
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" 
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                        }`}
                      >
                        <Play className={`h-3 w-3 ${isPlaying ? "animate-pulse" : ""}`} />
                        <span>{isPlaying ? "Pause Auto-Run" : "Auto-Play Demo"}</span>
                      </button>
                    </div>
                  </div>

                  {/* STEP 1: CANONICAL JSON */}
                  {currentStep === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                      <p className="text-xs text-slate-300">
                        Registrar inputs the graduate&apos;s academic record. BlockCert sorts dictionary keys alphabetically into deterministic RFC-8785 canonical JSON:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Student Name (Live Editable)</label>
                          <input
                            type="text"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">CGPA / Grade (Live Editable)</label>
                          <input
                            type="text"
                            value={cgpa}
                            onChange={(e) => setCgpa(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-emerald-300 space-y-1 overflow-x-auto">
                        <div className="text-slate-400">
  {"// Deterministic Canonical JSON Payload:"}
</div>
                        <pre className="text-[10px] text-slate-200">
{`{
  "cgpa": ${cgpa || 8.5},
  "degree": "${degree}",
  "department_branch": "Computer Science & Engineering",
  "enrollment_year": 2022,
  "graduation_year": 2026,
  "institution_id": "INST-STANFORD-01",
  "institution_name": "Stanford University & Academic Alliance",
  "issue_date": "2026-05-15",
  "student_id_roll": "${rollNumber}",
  "student_name": "${studentName}"
}`}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: SHA-256 HASH & ED25519 SIGNING */}
                  {currentStep === 2 && (
                    <div className="space-y-4 animate-fadeIn text-xs">
                      <p className="text-slate-300">
                        The canonical payload is digested into a SHA-256 cryptographic hash and digitally signed with the university&apos;s authoritative Ed25519 private key:
                      </p>

                      <div className="space-y-3 font-mono">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <div className="text-slate-400 text-[10px] flex items-center justify-between">
                            <span className="flex items-center gap-1 text-emerald-400 font-bold">
                              <Cpu className="h-3 w-3" /> SHA-256 Payload Hash (Authoritative Fingerprint)
                            </span>
                            <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[9px]">Calculated Live</span>
                          </div>
                          <div className="text-emerald-300 text-xs break-all font-bold">
                            {simulatedHash}
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <div className="text-slate-400 text-[10px] flex items-center justify-between">
                            <span className="flex items-center gap-1 text-cyan-400 font-bold">
                              <Lock className="h-3 w-3" /> Ed25519 Digital Signature (Stanford Alliance Private Key)
                            </span>
                            <span className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded text-[9px]">Non-Repudiable</span>
                          </div>
                          <div className="text-cyan-300 text-[11px] break-all">
                            {simulatedSignature}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: HASH CHAIN ANCHOR */}
                  {currentStep === 3 && (
                    <div className="space-y-4 animate-fadeIn text-xs">
                      <p className="text-slate-300">
                        The signed issuance is appended to the tamper-evident single-node ledger. The block links to the previous block hash:
                      </p>

                      <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-2 font-mono text-[11px]">
                        <div className="flex items-center justify-between text-white font-bold border-b border-white/10 pb-2">
                          <span className="text-emerald-400">BLOCK #1 [EVENT: ISSUE]</span>
                          <span className="text-slate-400 text-[10px]">TIMESTAMP: 2026-05-15 09:30:00Z</span>
                        </div>
                        <div className="text-slate-300">Credential ID: <strong className="text-amber-300">CRED-7F83A91</strong> (Version 1.0)</div>
                        <div className="text-slate-400">Prev Hash: 0000000000000000000000000000000000000000000000000000000000000000</div>
                        <div className="text-emerald-400 break-all">
                          Block Hash: {simulatedBlockHash}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-slate-300 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>Linear hash-chain continuity guarantees any retrospective database tampering is exposed instantly.</span>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: PERMANENT QR ISSUANCE */}
                  {currentStep === 4 && (
                    <div className="space-y-4 animate-fadeIn text-xs">
                      <p className="text-slate-300">
                        The graduate receives a permanent verifiable credential with stable Credential ID and dynamic QR code:
                      </p>

                      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 flex flex-col sm:flex-row items-center gap-4">
                        <div className="p-3 rounded-xl bg-white text-slate-950 shrink-0 shadow-lg">
                          <QrCode className="h-20 w-20" />
                        </div>
                        <div className="space-y-1.5 text-center sm:text-left min-w-0">
                          <div className="text-[10px] font-mono font-bold text-amber-400 uppercase">OFFICIAL ACADEMIC CREDENTIAL</div>
                          <div className="text-base font-extrabold text-white">{studentName}</div>
                          <div className="text-xs text-slate-300">{degree} • CGPA {cgpa}</div>
                          <div className="text-[11px] font-mono text-emerald-400 font-bold">CRED-7F83A91 (Stanford Alliance)</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: EMPLOYER 4-POINT VERIFICATION */}
                  {currentStep === 5 && (
                    <div className="space-y-4 animate-fadeIn text-xs">
                      <p className="text-slate-300">
                        Employers scan the QR or enter ID. BlockCert executes a 4-point cryptographic audit in under 2 seconds:
                      </p>

                      <div className="space-y-2">
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-200">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>1. SHA-256 Payload Hash Integrity Check</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">PASSED</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-200">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>2. Ed25519 Public Key Signature Audit</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">PASSED</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-200">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>3. Single-Node Hash Chain Linkage</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">PASSED</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-200">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>4. Revocation Standing &amp; Active Version Check</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">ACTIVE</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step Control Buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <button
                      type="button"
                      disabled={currentStep === 1}
                      onClick={() => { setCurrentStep((p) => Math.max(1, p - 1)); setIsPlaying(false); }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer flex items-center gap-1"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span>Previous</span>
                    </button>

                    <div className="text-[11px] font-mono text-slate-400">
                      Step {currentStep} of 5
                    </div>

                    {currentStep < 5 ? (
                      <button
                        type="button"
                        onClick={() => { setCurrentStep((p) => Math.min(5, p + 1)); setIsPlaying(false); }}
                        className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 cursor-pointer flex items-center gap-1 shadow-md"
                      >
                        <span>Next Step</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setCurrentStep(1); setIsPlaying(false); }}
                        className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Restart Simulation</span>
                      </button>
                    )}
                  </div>

                </div>

                {/* Instant 1-Click Interactive Live Sandboxes */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Experience Live Working Portals:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleInstantSandbox("INSTITUTE")}
                      disabled={loadingSandbox}
                      className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/30 hover:border-emerald-500/60 transition-all text-left space-y-1 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <Building2 className="h-4 w-4 text-emerald-400" />
                        <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <div className="text-xs font-extrabold text-white">Registrar Command</div>
                      <div className="text-[10px] text-slate-400">Issue credentials with Ed25519</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInstantSandbox("EMPLOYER")}
                      disabled={loadingSandbox}
                      className="p-3 rounded-2xl bg-slate-950 border border-amber-500/30 hover:border-amber-500/60 transition-all text-left space-y-1 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <Search className="h-4 w-4 text-amber-400" />
                        <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <div className="text-xs font-extrabold text-white">Public Verifier</div>
                      <div className="text-[10px] text-slate-400">Instant 4-point verification</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInstantSandbox("STUDENT")}
                      disabled={loadingSandbox}
                      className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/30 hover:border-cyan-500/60 transition-all text-left space-y-1 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <FileCheck2 className="h-4 w-4 text-cyan-400" />
                        <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <div className="text-xs font-extrabold text-white">Student Locker</div>
                      <div className="text-[10px] text-slate-400">Verifiable QR diploma share</div>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: SCHEDULE 1-ON-1 CONSULTATION */}
            {activeTab === "schedule" && (
              <div className="space-y-4 animate-fadeIn">
                {submittedSchedule ? (
                  <div className="py-6 text-center space-y-4 animate-fadeIn">
                    <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="h-9 w-9" />
                    </div>
                    <h4 className="text-2xl font-extrabold text-white">Appointment Scheduled!</h4>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto">
                      Our platform team will meet you on <strong>{scheduleForm.preferredDate} at {scheduleForm.preferredTime}</strong> via Google Meet.
                    </p>
                    <button
                      type="button"
                      onClick={resetAndClose}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Your Full Name</label>
                        <input
                          type="text"
                          required
                          value={scheduleForm.name}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
                          placeholder="Dr. Alistair Vance"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Official Email</label>
                        <input
                          type="email"
                          required
                          value={scheduleForm.email}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, email: e.target.value })}
                          placeholder="registrar@stanford.edu"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Institution Name</label>
                        <input
                          type="text"
                          required
                          value={scheduleForm.institution}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, institution: e.target.value })}
                          placeholder="Stanford University & Academic Alliance"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">Date</label>
                        <input
                          type="date"
                          required
                          value={scheduleForm.preferredDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, preferredDate: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 mt-2"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Confirm 1-on-1 Appointment</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </>
        )}

        {/* Modal: Technical Whitepaper */}
        {type === "whitepaper" && (
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-400">
                <FileText className="h-3.5 w-3.5" />
                <span className="uppercase tracking-wider">BLOCKCERT SPECIFICATION v1.0</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Cryptographic Anchor Architecture
              </h3>
              <p className="text-xs text-slate-400">
                Authoritative Academic Credential Attestation via Ed25519 Digital Signatures and Tamper-Evident Hash Chains.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed max-h-60 overflow-y-auto font-sans">
              <p>
                <strong>1. Executive Summary:</strong> BlockCert provides educational institutions with a cryptographic system to issue tamper-proof degrees, marksheets, and transcripts with permanent Credential IDs and dynamic QR codes.
              </p>
              <p>
                <strong>2. Ed25519 Digital Signatures:</strong> Every credential version is canonicalized into sorted JSON, hashed via SHA-256, and signed server-side using the issuing institution&apos;s Ed25519 private key.
              </p>
              <p>
                <strong>3. Tamper-Evident Single-Node Hash Chain:</strong> All lifecycle events (ISSUE, MODIFY, REVOKE) form a linear hash chain with sequential parent hashing. Any historical modification breaks chain validation instantly.
              </p>
              <p>
                <strong>4. Privacy Architecture:</strong> Credentials are never exposed to public name-based searches. No personal identifiable information (PII) is stored unhashed on the immutable hash chain.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <Lock className="h-3 w-3" /> SHA-256 + Ed25519 Verified
              </span>
              <button
                type="button"
                onClick={resetAndClose}
                className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer"
              >
                Close Specification
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


