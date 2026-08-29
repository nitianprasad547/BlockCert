"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  QrCode,
  ExternalLink,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  ChevronDown,
  Sparkles,
  Layers,
  CheckCircle2,
  Lock
} from "lucide-react";
import { Credential } from "@/types";
import { api } from "@/lib/api";
import CredentialCard from "@/components/CredentialCard";
import DiscrepancyModal from "@/components/DiscrepancyModal";
import BlockchainExplorerModal from "@/components/BlockchainExplorerModal";

export default function StudentDashboard() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedCredForDiscrepancy, setSelectedCredForDiscrepancy] = useState<string | null>(null);
  const [isChainOpen, setIsChainOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => (typeof window !== "undefined" ? api.getCurrentUser() : null));
  const [claimInput, setClaimInput] = useState("");
  const [claimStatus, setClaimStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [claiming, setClaiming] = useState(false);

  const loadCredentials = () => {
    const user = api.getCurrentUser();
    setCurrentUser(user);

    api
      .getStudentCredentials(
        user?.student_id || undefined, 
        user?.name || undefined, 
        undefined, 
        user?.credential_id || undefined
      )
      .then((data) => {
        setCredentials(data);
        setLoadError(null);
        if (data.length > 0) {
          setSelectedIndex(0);
        }
      })
      .catch((err) => {
        setLoadError(err instanceof Error ? err.message : "Failed to load credentials.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let isMounted = true;
    const user = api.getCurrentUser();
    if (isMounted) setCurrentUser(user);

    api
      .getStudentCredentials(
        user?.student_id || undefined, 
        user?.name || undefined, 
        undefined, 
        user?.credential_id || undefined
      )
      .then((data) => {
        if (isMounted) {
          setCredentials(data);
          setLoadError(null);
          if (data.length > 0) {
            setSelectedIndex(0);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setLoadError(err instanceof Error ? err.message : "Failed to load credentials.");
          setLoading(false);
        }
      });

    const handleUpdate = () => loadCredentials();
    window.addEventListener("blockcert:credentials-updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("blockcert:credentials-updated", handleUpdate);
    };
  }, []);

  const handleClaimCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimInput.trim()) return;
    setClaiming(true);
    setClaimStatus(null);
    try {
      const updated = api.claimCredential(claimInput.trim());
      if (updated) {
        setClaimStatus({ type: "success", message: `Credential ${claimInput.trim().toUpperCase()} linked successfully!` });
        setClaimInput("");
        loadCredentials();
      } else {
        setClaimStatus({ type: "error", message: "Failed to link credential. Please ensure you are logged in." });
      }
    } catch (err: any) {
      setClaimStatus({ type: "error", message: err.message || "Could not link credential." });
    } finally {
      setClaiming(false);
    }
  };

  const activeCred = credentials[0];
  const displayName = currentUser?.name || activeCred?.latest_version?.student_name || "Student Graduate";

  return (
    <div className="space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-2">
            <UserCheck className="h-3.5 w-3.5" />
            <span>VERIFIED STUDENT SCORECARD &amp; LOCKER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {displayName}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Your authoritative academic degree, official grades scorecard, and tamper-proof blockchain attestations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {activeCred && (
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-3.5 py-2 rounded-xl border border-cyan-500/30 font-bold">
              ID: {activeCred.credential_id}
            </span>
          )}
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-bold transition-all shadow-md"
          >
            <span>Public Verifier</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
          <div className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span>Loading student credentials from ledger...</span>
        </div>
      ) : loadError ? (
        <div className="py-16 text-center space-y-3">
          <p className="text-rose-300 text-sm">{loadError}</p>
          <button
            type="button"
            onClick={loadCredentials}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : !activeCred ? (
        <div className="py-12 space-y-6 rounded-3xl glass-panel border border-cyan-500/30 bg-slate-900/80 p-8 max-w-xl mx-auto text-center">
          <div className="h-14 w-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">No Scorecard Linked to This Session</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Please enter the permanent <strong className="text-cyan-300">Credential ID</strong> issued to you by your institution to access your academic scorecard.
            </p>
          </div>

          <form onSubmit={handleClaimCredential} className="space-y-3 text-left">
            <div className="relative">
              <input
                type="text"
                value={claimInput}
                onChange={(e) => setClaimInput(e.target.value)}
                placeholder="e.g. CRED-7F83A91"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-200 placeholder-slate-500 uppercase font-mono font-bold text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              disabled={claiming || !claimInput.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{claiming ? "Verifying On-Chain..." : "Access My Scorecard"}</span>
            </button>
          </form>

          {claimStatus && (
            <div
              className={`p-3 rounded-xl text-xs ${
                claimStatus.type === "success"
                  ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                  : "bg-rose-950/60 border border-rose-500/40 text-rose-300"
              }`}
            >
              {claimStatus.message}
            </div>
          )}

          <div className="pt-2">
            <Link href="/student/login" className="text-xs text-cyan-400 hover:underline">
              Or use the Dedicated Student Login Portal →
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Authoritative Academic Scorecard Card */}
          {activeCred.latest_version && (
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-cyan-500/40 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-cyan-950/30 space-y-6 shadow-2xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shadow-lg">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono font-extrabold tracking-widest text-cyan-400">
                      OFFICIAL ACADEMIC SCORECARD &amp; AUDIT
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      {activeCred.latest_version.degree}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Department of {activeCred.latest_version.department}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-extrabold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>LEDGER VERIFIED</span>
                  </span>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700 font-bold">
                    v{activeCred.current_version}.0 ACTIVE
                  </span>
                </div>
              </div>

              {/* Scorecard Key Performance Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Cumulative CGPA</span>
                  <div className="text-2xl font-black text-amber-300">
                    {Number(activeCred.latest_version.cgpa).toFixed(2)}
                    <span className="text-xs font-normal text-slate-400 ml-1">/ 10.0</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 block">
                    {activeCred.latest_version.credential_data?.classification || "First Class with Distinction"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidate Identity</span>
                  <div className="text-sm font-extrabold text-white truncate">
                    {activeCred.latest_version.student_name}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block truncate">
                    Roll: {activeCred.latest_version.roll_number}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Timeline</span>
                  <div className="text-sm font-extrabold text-white">
                    Class of {activeCred.latest_version.graduation_year}
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Enrolled: {activeCred.latest_version.enrollment_year}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Issuing Authority</span>
                  <div className="text-sm font-extrabold text-white truncate">
                    {activeCred.institution_name}
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 block truncate">
                    {activeCred.institution_id}
                  </span>
                </div>
              </div>

              {/* Cryptographic Ledger Proof Details */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 text-xs font-mono">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Immutable Blockchain Ledger Proof:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="truncate">
                    <span className="text-slate-500">SHA-256 Digest: </span>
                    <span className="text-emerald-400">{activeCred.latest_version.credential_hash}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-slate-500">Authority Signature: </span>
                    <span className="text-cyan-300">{activeCred.latest_version.digital_signature}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Official Academic Degree Certificate Display */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" />
                <span>Full Digital Academic Diploma</span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  Permanent ID: {activeCred.credential_id}
                </span>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                  Version {activeCred.current_version}.0
                </span>
              </div>
            </div>

            {activeCred.latest_version && (
              <CredentialCard
                credential={activeCred.latest_version}
                permanentId={activeCred.credential_id}
                status={activeCred.status}
                onReportDiscrepancy={() => setSelectedCredForDiscrepancy(activeCred.credential_id)}
                onOpenChainExplorer={() => setIsChainOpen(true)}
              />
            )}
          </div>

          {/* Quick Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Share Card */}
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
                Provide your permanent QR code or direct link to recruiters. They can independently verify your degree validity, CGPA, and university digital signature in under 2 seconds.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={`/verify?id=${activeCred.credential_id}`}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open in Verifier Portal</span>
                </Link>
                <Link
                  href={`/student/credentials/${activeCred.credential_id}`}
                  className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Full View &amp; Print
                </Link>
              </div>
            </div>

            {/* Discrepancy Card */}
            <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-white/10 bg-slate-900/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Notice Any Discrepancies?</h3>
                  <p className="text-xs text-slate-400">Student rights under PRD Section 4.7</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                If your grade was updated or spelling corrected, submit a formal discrepancy report. The registrar will review and issue Version {activeCred.current_version + 1}.0 with the same permanent ID.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCredForDiscrepancy(activeCred.credential_id)}
                  className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Report Discrepancy to Registrar
                </button>
                <Link
                  href="/student/reports"
                  className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  View Tracker
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modals */}
      <DiscrepancyModal
        isOpen={!!selectedCredForDiscrepancy}
        onClose={() => setSelectedCredForDiscrepancy(null)}
        credentialId={selectedCredForDiscrepancy || activeCred?.credential_id}
        defaultReporterName={displayName}
        defaultRole="Student"
      />

      <BlockchainExplorerModal
        isOpen={isChainOpen}
        onClose={() => setIsChainOpen(false)}
        selectedCredentialId={activeCred?.credential_id}
      />
    </div>
  );
}
