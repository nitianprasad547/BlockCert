"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Edit, 
  Layers, 
  Lock, 
  Cpu, 
  CheckCircle2, 
  Sparkles, 
  Send 
} from "lucide-react";
import { Credential } from "@/types";
import { api } from "@/lib/api";
import { canonicalizeJson, sha256Client, formatHash } from "@/lib/crypto";

export default function ModifyCredentialPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "";

  const [credential, setCredential] = useState<Credential | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    student_name: "",
    student_id_roll: "",
    degree: "",
    department_branch: "",
    cgpa: 8.7,
    graduation_year: 2026,
    enrollment_year: 2022,
    classification: "First Class with Distinction",
    major_specialization: "",
    modification_reason: "Semester VIII re-evaluation updated CGPA from 8.2 to 8.7",
  });

  const [liveHash, setLiveHash] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getCredentialById(id).then((data) => {
      if (data) {
        setCredential(data);
        const v = data.latest_version;
        setFormData({
          student_name: v.student_name,
          student_id_roll: v.roll_number,
          degree: v.degree,
          department_branch: v.department,
          cgpa: v.cgpa === 8.2 ? 8.7 : v.cgpa,
          graduation_year: v.graduation_year,
          enrollment_year: v.enrollment_year,
          classification: v.credential_data?.classification || "First Class with Distinction",
          major_specialization: v.credential_data?.major_specialization || "",
          modification_reason: "Semester VIII transcript re-evaluation grade update",
        });
      }
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!credential) return;
    const payload = {
      student_name: formData.student_name,
      student_id_roll: formData.student_id_roll,
      degree: formData.degree,
      department_branch: formData.department_branch,
      cgpa: Number(formData.cgpa),
      graduation_year: Number(formData.graduation_year),
      enrollment_year: Number(formData.enrollment_year),
      institution_id: credential.institution_id,
      institution_name: credential.institution_name,
      classification: formData.classification,
      major_specialization: formData.major_specialization,
      modification_reason: formData.modification_reason,
      issue_date: new Date().toISOString().split("T")[0],
    };
    const canonical = canonicalizeJson(payload);
    sha256Client(canonical).then(setLiveHash);
  }, [formData, credential]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credential || !formData.modification_reason.trim()) return;

    setSubmitting(true);
    try {
      await api.modifyCredential({
        credential_id: credential.credential_id,
        ...formData,
      });
      router.push(`/institute/credentials/${credential.credential_id}`);
    } catch (err) {
      console.error("Modification error", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-xs font-mono text-slate-400">Loading credential...</div>;
  }

  if (!credential) {
    return <div className="py-20 text-center text-white">Credential not found.</div>;
  }

  const nextVersionNum = credential.current_version + 1;

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/institute/credentials/${credential.credential_id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Cancel and Return to Credential Detail</span>
        </Link>
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-md bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-400">
          <Layers className="h-3.5 w-3.5" />
          <span>PRD VERSION REVISION PROTOCOL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Legitimate Modification: Create Version {nextVersionNum}.0
        </h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          The permanent Credential ID (<strong className="text-amber-300 font-mono">{credential.credential_id}</strong>) and permanent QR code remain unchanged. 
          Version {credential.current_version}.0 will be preserved as <span className="text-amber-400 font-bold">SUPERSEDED</span> in history, and Version {nextVersionNum}.0 will become <span className="text-emerald-400 font-bold">ACTIVE</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="rounded-3xl glass-panel p-6 sm:p-8 border border-cyan-500/30 bg-slate-900/90 space-y-4 text-xs">
            
            {/* Mandatory Reason */}
            <div className="bg-cyan-950/30 p-4 rounded-2xl border border-cyan-500/30 space-y-1.5">
              <label className="block font-bold text-cyan-300">
                Official Reason for Record Modification *
              </label>
              <input
                type="text"
                required
                value={formData.modification_reason}
                onChange={(e) => setFormData({ ...formData, modification_reason: e.target.value })}
                placeholder="e.g. Grade re-evaluation correction"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-400 block">
                This reason is permanently recorded on the immutable ledger version snapshot.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Student Full Name</label>
              <input
                type="text"
                required
                value={formData.student_name}
                onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Student Roll Number</label>
                <input
                  type="text"
                  required
                  value={formData.student_id_roll}
                  onChange={(e) => setFormData({ ...formData, student_id_roll: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Corrected CGPA *</label>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Degree</label>
                <input
                  type="text"
                  required
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={formData.department_branch}
                  onChange={(e) => setFormData({ ...formData, department_branch: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !formData.modification_reason.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-emerald-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 mt-4"
            >
              <Send className="h-4 w-4" />
              <span>{submitting ? "Signing New Version On-Chain..." : `Digitally Sign & Issue Version ${nextVersionNum}.0`}</span>
            </button>
          </form>
        </div>

        {/* Right Info Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl glass-panel p-6 border border-white/10 bg-slate-900/90 space-y-4 text-left font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-bold text-white flex items-center gap-2">
                <Cpu className="h-4 w-4 text-cyan-400" />
                <span>Version {nextVersionNum}.0 Digest Preview</span>
              </span>
              <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                MODIFY Event
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Permanent QR &amp; ID:</span>
                <div className="text-amber-300 font-bold">{credential.credential_id} (Unchanged)</div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Previous Version SHA-256:</span>
                <div className="text-slate-400">{formatHash(credential.latest_version.credential_hash, 10)}</div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">New Version {nextVersionNum}.0 SHA-256:</span>
                <div className="text-emerald-400 font-bold break-all select-all">
                  {liveHash}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] font-sans text-slate-300">
              Upon submission, a <code className="text-cyan-400">MODIFY</code> block is appended to the hash chain. Employers scanning the QR will instantly see Version {nextVersionNum}.0.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
