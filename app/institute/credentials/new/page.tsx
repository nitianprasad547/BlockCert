"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  PlusCircle, 
  ArrowLeft, 
  Lock, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  QrCode,
  Award,
  Send
} from "lucide-react";
import { api } from "@/lib/api";
import { canonicalizeJson, sha256Client, formatHash } from "@/lib/crypto";

export default function NewCredentialPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    student_name: "",
    student_id_roll: "",
    degree: "Bachelor of Technology",
    department_branch: "Computer Science & Engineering",
    cgpa: 8.5,
    graduation_year: 2026,
    enrollment_year: 2022,
    classification: "First Class with Distinction",
    major_specialization: "Artificial Intelligence & Distributed Systems",
    additional_notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [liveHash, setLiveHash] = useState("");
  const [successCredId, setSuccessCredId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState(() => (typeof window !== "undefined" ? api.getCurrentUser() : null));

  useEffect(() => {
    setCurrentUser(api.getCurrentUser());
  }, []);

  const effectiveInstId = currentUser?.institution_id || "INST-STANFORD-01";
  const effectiveInstName = (currentUser?.role === "INSTITUTE" && currentUser?.name) ? currentUser.name : "Stanford University & Academic Alliance";

  // Live recalculation of SHA-256 hash as user types
  useEffect(() => {
    const payload = {
      student_name: formData.student_name,
      student_id_roll: formData.student_id_roll,
      degree: formData.degree,
      department_branch: formData.department_branch,
      cgpa: Number(formData.cgpa),
      graduation_year: Number(formData.graduation_year),
      enrollment_year: Number(formData.enrollment_year),
      institution_id: effectiveInstId,
      institution_name: effectiveInstName,
      classification: formData.classification,
      major_specialization: formData.major_specialization,
      issue_date: new Date().toISOString().split("T")[0],
    };

    const canonical = canonicalizeJson(payload);
    sha256Client(canonical).then(setLiveHash);
  }, [formData, effectiveInstId, effectiveInstName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.student_name.trim() || !formData.student_id_roll.trim()) {
      setSubmitError("Student name and roll number are required.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await api.issueCredential(formData);
      setSuccessCredId(created.credential_id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to issue credential. Please try again.";
      setSubmitError(message);
      console.error("Issuance error", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setFormData({
      student_name: "Aarav Mehra",
      student_id_roll: "2022-CS-0899",
      degree: "Bachelor of Technology",
      department_branch: "Computer Science & Engineering",
      cgpa: 8.92,
      graduation_year: 2026,
      enrollment_year: 2022,
      classification: "First Class with Distinction",
      major_specialization: "Quantum Computing & Cryptographic Systems",
      additional_notes: "Honors in Cryptographic Architecture",
    });
  };

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      
      {/* Back link & Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/institute/credentials"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Credentials Registry</span>
        </Link>

        <button
          type="button"
          onClick={handleFillDemo}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Fill Demo Candidate</span>
        </button>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Issue New Academic Credential
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Compute canonical SHA-256 payload digest, digitally sign via Ed25519, and anchor a new block in the hash chain.
        </p>
      </div>

      {successCredId ? (
        <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-emerald-500/40 bg-slate-900/90 text-center space-y-6 animate-fadeIn">
          <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Credential Successfully Issued &amp; Anchored!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Permanent Credential ID generated and signed with {effectiveInstName}&apos;s Ed25519 private key.
            </p>
            <div className="inline-block p-3 rounded-xl bg-slate-950 border border-emerald-500/30 font-mono text-base font-extrabold text-emerald-400">
              {successCredId}
            </div>
          </div>

          {/* Student Account Creation / Access Pass */}
          <div className="max-w-md mx-auto rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Student Onboarding Pass</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                Single-Student Locker Link
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Provide this Credential ID to the student. They will use it to create their student account or sign in directly to their private locker:
            </p>
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="truncate">/signup?role=STUDENT&amp;credential_id={successCredId}</span>
              <Link
                href={`/signup?role=STUDENT&credential_id=${successCredId}`}
                target="_blank"
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 text-[10px] font-bold uppercase shrink-0"
              >
                Open Pass →
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href={`/institute/credentials/${successCredId}`}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg"
            >
              View Official Certificate
            </Link>
            <Link
              href={`/verify?id=${successCredId}`}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold"
            >
              Test Public Verification
            </Link>
            <button
              type="button"
              onClick={() => {
                setSuccessCredId(null);
                setFormData({
                  student_name: "",
                  student_id_roll: "",
                  degree: "Bachelor of Technology",
                  department_branch: "Computer Science & Engineering",
                  cgpa: 8.5,
                  graduation_year: 2026,
                  enrollment_year: 2022,
                  classification: "First Class with Distinction",
                  major_specialization: "",
                  additional_notes: "",
                });
              }}
              className="px-4 py-3 text-xs text-slate-400 hover:text-white cursor-pointer underline underline-offset-4"
            >
              Issue Another Credential
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form (PRD Section 4.3) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 bg-slate-900/90 space-y-5 text-xs">
              
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-400" />
                  <span>Student &amp; Degree Details</span>
                </h3>
              </div>

              {/* Student Name */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Student Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              {/* Roll Number / Student ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Student ID / Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.student_id_roll}
                    onChange={(e) => setFormData({ ...formData, student_id_roll: e.target.value })}
                    placeholder="2022-CS-0418"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Cumulative CGPA (out of 10.0) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-bold text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Degree & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Academic Degree *</label>
                  <input
                    type="text"
                    required
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder="Bachelor of Technology"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Department / Branch *</label>
                  <input
                    type="text"
                    required
                    value={formData.department_branch}
                    onChange={(e) => setFormData({ ...formData, department_branch: e.target.value })}
                    placeholder="Computer Science & Engineering"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>
              </div>

              {/* Enrollment & Graduation Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Enrollment Year</label>
                  <input
                    type="number"
                    required
                    value={formData.enrollment_year}
                    onChange={(e) => setFormData({ ...formData, enrollment_year: parseInt(e.target.value) || 2022 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Graduation Year</label>
                  <input
                    type="number"
                    required
                    value={formData.graduation_year}
                    onChange={(e) => setFormData({ ...formData, graduation_year: parseInt(e.target.value) || 2026 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>
              </div>

              {/* Classification & Specialization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Degree Classification</label>
                  <input
                    type="text"
                    value={formData.classification}
                    onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                    placeholder="First Class with Distinction"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Major Specialization</label>
                  <input
                    type="text"
                    value={formData.major_specialization}
                    onChange={(e) => setFormData({ ...formData, major_specialization: e.target.value })}
                    placeholder="Distributed Systems & Cryptography"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50 mt-4"
              >
                <Send className="h-4 w-4" />
                <span>{submitting ? "Signing On-Chain..." : "Digitally Sign & Issue Credential (v1 ACTIVE)"}</span>
              </button>

              {submitError && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
                  {submitError}
                </div>
              )}
            </form>
          </div>

          {/* Right Live Cryptographic Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl glass-panel p-6 border border-emerald-500/30 bg-slate-900/90 space-y-4 text-left font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-bold text-white flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-emerald-400" />
                  <span>Live Cryptographic Engine</span>
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 animate-pulse">
                  Active Real-Time
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Calculated SHA-256 Digest:</span>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 break-all select-all mt-1">
                    {liveHash ? liveHash : "Awaiting student payload..."}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Issuing Key Authority:</span>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] mt-1 font-mono">
                    {effectiveInstName} (Ed25519 Private Key)
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Target Hash-Chain Event:</span>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 text-[11px] mt-1">
                    Event: ISSUE | Version: 1.0 | Status: ACTIVE
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400 space-y-1 font-sans">
                <p>
                  <strong>PRD Rule 4.4:</strong> A permanent Credential ID is generated upon submission and will remain stable across all future version revisions.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
