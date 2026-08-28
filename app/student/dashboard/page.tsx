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
  Layers
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

  const loadCredentials = () => {
    const user = api.getCurrentUser();
    setCurrentUser(user);

    api
      .getStudentCredentials(user?.student_id || undefined, user?.name || undefined)
      .then((data) => {
        setCredentials(data);
        setLoadError(null);
        if (data.length > 0) {
          const idx = data.findIndex(
            (c) =>
              c.latest_version?.student_name.toLowerCase() === user?.name?.toLowerCase() ||
              c.student_id === user?.student_id
          );
          if (idx !== -1) {
            setSelectedIndex(idx);
          }
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
      .getStudentCredentials(user?.student_id || undefined, user?.name || undefined)
      .then((data) => {
        if (isMounted) {
          setCredentials(data);
          setLoadError(null);
          if (data.length > 0) {
            const idx = data.findIndex(
              (c) =>
                c.latest_version?.student_name.toLowerCase() === user?.name?.toLowerCase() ||
                c.student_id === user?.student_id
            );
            if (idx !== -1) {
              setSelectedIndex(idx);
            }
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

  const activeCred = credentials[selectedIndex] || credentials[0];
  const displayName = currentUser?.name || activeCred?.latest_version?.student_name || "Rahul Sharma";

  return (
    <div className="space-y-8 text-left">
      
      {/* Header & Student Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-2">
            <UserCheck className="h-3.5 w-3.5" />
            <span>VERIFIED STUDENT LOCKER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {displayName}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Your permanent academic credentials, cryptographic QR codes, and tamper-proof degrees anchored on BlockCert.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {credentials.length > 1 && (
            <div className="relative">
              <select
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(Number(e.target.value))}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold focus:outline-none cursor-pointer pr-8 shadow-md"
              >
                {credentials.map((cred, idx) => (
                  <option key={cred.credential_id} value={idx}>
                    📜 {cred.latest_version?.student_name} ({cred.credential_id})
                  </option>
                ))}
              </select>
            </div>
          )}

          <Link
            href="/student/credentials"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-bold transition-all shadow-md"
          >
            <span>View All ({credentials.length}) Records</span>
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
        <div className="py-16 text-center space-y-4 rounded-3xl glass-panel border border-white/10 bg-slate-900/80 p-8">
          <GraduationCap className="h-12 w-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Credentials Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No academic certificates have been issued yet. Head over to the Institute Registrar portal to issue a new credential.
          </p>
          <Link
            href="/institute/credentials/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>Issue New Credential</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Active Degree Certificate Display */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" />
                <span>Authoritative Academic Degree Certificate</span>
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
