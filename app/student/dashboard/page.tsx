"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Lock
} from "lucide-react";
import { Credential } from "@/types";
import { api } from "@/lib/api";
import CredentialCard from "@/components/CredentialCard";
import DiscrepancyModal from "@/components/DiscrepancyModal";

export default function StudentDashboard() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCredForDiscrepancy, setSelectedCredForDiscrepancy] = useState<string | null>(null);

  useEffect(() => {
    api.getStudentCredentials("STU-RAHUL-01").then((data) => {
      setCredentials(data);
      setLoading(false);
    });
  }, []);

  const primaryCred = credentials[0];

  return (
    <div className="space-y-8 text-left">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, Rahul Sharma
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Your permanent academic credentials, cryptographic QR codes, and tamper-proof degrees.
          </p>
        </div>

        <Link
          href="/student/credentials"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-bold transition-all shadow-md"
        >
          <span>View All ({credentials.length}) Credentials</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-slate-400">
          Loading student credentials from ledger...
        </div>
      ) : !primaryCred ? (
        <div className="py-16 text-center text-slate-400">No credentials found.</div>
      ) : (
        <div className="space-y-8">
          
          {/* Featured Primary Credential Card */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" />
                <span>Primary Authoritative Degree Certificate</span>
              </h2>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                Permanent ID: {primaryCred.credential_id}
              </span>
            </div>

            <CredentialCard
              credential={primaryCred.latest_version}
              permanentId={primaryCred.credential_id}
              status={primaryCred.status}
              onReportDiscrepancy={() => setSelectedCredForDiscrepancy(primaryCred.credential_id)}
            />
          </div>

          {/* Quick Sharing & Discrepancy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-white/10 bg-slate-900/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">How to Share with Employers</h3>
                  <p className="text-xs text-slate-400">Instant independent verification</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Provide your permanent QR code or direct link to recruiters and employers. They can independently verify your degree validity, CGPA, and university digital signature without contacting the university registrar.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href={`/verify?id=${primaryCred.credential_id}`}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all"
                >
                  Open in Verifier Portal
                </Link>
                <Link
                  href={`/student/credentials/${primaryCred.credential_id}`}
                  className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Full View &amp; Print
                </Link>
              </div>
            </div>

            <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-white/10 bg-slate-900/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Notice Any Discrepancies?</h3>
                  <p className="text-xs text-slate-400">Student rights under PRD 4.7</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                If your grade was updated, spelling corrected, or degree modified, submit a formal discrepancy report. The registrar will review and issue Version 2.0 with the same permanent ID.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCredForDiscrepancy(primaryCred.credential_id)}
                  className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Report Discrepancy to Registrar
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Discrepancy Modal */}
      <DiscrepancyModal
        isOpen={!!selectedCredForDiscrepancy}
        onClose={() => setSelectedCredForDiscrepancy(null)}
        credentialId={selectedCredForDiscrepancy || primaryCred?.credential_id}
        defaultReporterName="Rahul Sharma"
        defaultRole="Student"
      />

    </div>
  );
}
