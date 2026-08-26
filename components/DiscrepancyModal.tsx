"use client";

import React, { useState } from "react";
import { X, AlertTriangle, Send, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

interface DiscrepancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentialId?: string;
  defaultReporterName?: string;
  defaultRole?: string;
}

export default function DiscrepancyModal({
  isOpen,
  onClose,
  credentialId = "",
  defaultReporterName = "",
  defaultRole = "Student",
}: DiscrepancyModalProps) {
  const [formData, setFormData] = useState({
    credential_id: credentialId,
    reported_by: defaultReporterName,
    reporter_role: defaultRole,
    reason: "CGPA Grade Correction",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      credential_id: credentialId || prev.credential_id,
      reported_by: defaultReporterName || prev.reported_by,
      reporter_role: defaultRole || prev.reporter_role,
    }));
  }, [credentialId, defaultReporterName, defaultRole]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.credential_id || !formData.description.trim()) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.submitReport(formData);
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit report. Please try again.";
      setSubmitError(message);
      console.error("Error submitting report", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubmitError(null);
    setFormData({
      credential_id: credentialId,
      reported_by: defaultReporterName,
      reporter_role: defaultRole,
      reason: "CGPA Grade Correction",
      description: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-rose-500/40 bg-slate-900/95 p-6 sm:p-8 shadow-2xl space-y-6 text-left">
        
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-md bg-rose-500/10 border border-rose-500/30 px-3 py-1 text-xs font-bold text-rose-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="uppercase tracking-wider">DISCREPANCY REPORTING</span>
          </div>
          <h3 className="text-2xl font-bold text-white">
            Report Credential Discrepancy
          </h3>
          <p className="text-xs text-slate-400">
            Submit a formal correction or fraud alert to the issuing institution registrar.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-xl font-bold text-white">Report Submitted!</h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Your discrepancy report for <strong>{formData.credential_id}</strong> has been logged in the institution registrar&apos;s review inbox.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Permanent Credential ID</label>
              <input
                type="text"
                required
                value={formData.credential_id}
                onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                placeholder="CRED-7F83A91"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.reported_by}
                  onChange={(e) => setFormData({ ...formData, reported_by: e.target.value })}
                  placeholder="Rahul Sharma / Hiring Lead"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Reporter Role</label>
                <select
                  value={formData.reporter_role}
                  onChange={(e) => setFormData({ ...formData, reporter_role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Student">Student (Owner)</option>
                  <option value="Employer">Employer / Verifier</option>
                  <option value="Auditor">Academic Auditor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Discrepancy Category</label>
              <select
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="CGPA Grade Correction">CGPA / Grade Marksheet Correction</option>
                <option value="Student Name Typo">Student Legal Name Spelling Typo</option>
                <option value="Degree Classification Error">Degree / Major Specialization Error</option>
                <option value="Suspected Fraudulent Clone">Suspected Fraudulent or Cloned Certificate</option>
                <option value="Other">Other Administrative Correction</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Detailed Explanation</label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Explain the specific error, corrected values, and relevant university department reference..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-bold text-sm hover:from-rose-400 hover:to-amber-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{submitting ? "Submitting Report..." : "Transmit Discrepancy Report"}</span>
            </button>

            {submitError && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
                {submitError}
              </div>
            )}
          </form>
        )}

      </div>
    </div>
  );
}
