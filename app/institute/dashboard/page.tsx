"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  PlusCircle, 
  Search, 
  ExternalLink, 
  Layers, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { Credential, DiscrepancyReport, Block } from "@/types";
import { api } from "@/lib/api";
import { formatHash } from "@/lib/crypto";

export default function InstituteDashboard() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [reports, setReports] = useState<DiscrepancyReport[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState(() => (typeof window !== "undefined" ? api.getCurrentUser() : null));

  const loadData = async () => {
    try {
      const user = api.getCurrentUser();
      setCurrentUser(user);
      const [creds, reps, blks] = await Promise.all([
        api.getInstitutionCredentials(user?.institution_id || undefined),
        api.getReports(),
        api.getBlockchainBlocks(),
      ]);
      const instCredIds = new Set(creds.map((c) => c.credential_id.toUpperCase()));
      const filteredReports = reps.filter((r) => instCredIds.has(r.credential_id.toUpperCase()));
      setCredentials(creds);
      setReports(filteredReports);
      setBlocks(blks);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load dashboard data.");
      console.error("Dashboard data load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const user = api.getCurrentUser();
    if (isMounted) setCurrentUser(user);

    Promise.all([
      api.getInstitutionCredentials(user?.institution_id || undefined),
      api.getReports(),
      api.getBlockchainBlocks(),
    ])
      .then(([creds, reps, blks]) => {
        if (isMounted) {
          const instCredIds = new Set(creds.map((c) => c.credential_id.toUpperCase()));
          const filteredReports = reps.filter((r) => instCredIds.has(r.credential_id.toUpperCase()));
          setCredentials(creds);
          setReports(filteredReports);
          setBlocks(blks);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setLoadError(err instanceof Error ? err.message : "Failed to load dashboard data.");
          setLoading(false);
        }
      });

    const handleUpdate = () => loadData();
    window.addEventListener("blockcert:credentials-updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("blockcert:credentials-updated", handleUpdate);
    };
  }, []);

  const totalIssued = credentials.length;
  const activeCount = credentials.filter((c) => c.status === "ACTIVE").length;
  const revokedCount = credentials.filter((c) => c.status === "REVOKED").length;
  const pendingReports = reports.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-8 text-left">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <Building2 className="h-3.5 w-3.5" />
            <span>{currentUser?.name || "Institution Registrar"} {currentUser?.institution_id ? `(${currentUser.institution_id})` : ""}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Registrar Command Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative academic credential issuance, version modifications, and ledger event monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/institute/credentials/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Issue New Credential</span>
          </Link>
        </div>
      </div>

      {loadError && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-300 flex items-center justify-between gap-4">
          <span>{loadError}</span>
          <button
            type="button"
            onClick={loadData}
            className="text-emerald-400 font-bold underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Metric Cards Grid (PRD Section 4.2) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="rounded-2xl glass-panel p-5 border border-white/10 bg-slate-900/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Total Issued Credentials</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{totalIssued}</div>
          <div className="text-[11px] text-emerald-400/90 font-mono">Ed25519 Signed &amp; Anchored</div>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-white/10 bg-slate-900/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Active Valid Records</span>
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{activeCount}</div>
          <div className="text-[11px] text-slate-400 font-mono">Ready for instant verification</div>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-white/10 bg-slate-900/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Revoked Credentials</span>
            <ShieldAlert className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400">{revokedCount}</div>
          <div className="text-[11px] text-rose-400/80 font-mono">Invalidated on ledger</div>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-white/10 bg-slate-900/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Pending Discrepancies</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{pendingReports}</div>
          <div className="text-[11px] text-amber-400/80 font-mono">Awaiting registrar review</div>
        </div>

      </div>

      {/* Main Content: Recent Credentials & Recent Hash Chain Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Credentials Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-400" />
              <span>Recently Issued Academic Credentials</span>
            </h3>
            <Link
              href="/institute/credentials"
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              View Full Registry ({credentials.length})
            </Link>
          </div>

          <div className="rounded-3xl glass-panel border border-white/10 bg-slate-900/90 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60">
                    <th className="py-3.5 px-4">Student Graduate</th>
                    <th className="py-3.5 px-4">Permanent ID</th>
                    <th className="py-3.5 px-4">Degree &amp; CGPA</th>
                    <th className="py-3.5 px-4 text-center">Version &amp; Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs font-medium">
                  {credentials.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 px-4 text-center space-y-3">
                        <Award className="h-10 w-10 text-slate-600 mx-auto" />
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-300">0 Credentials Generated</p>
                          <p className="text-xs text-slate-500">Your institution hasn&apos;t issued any academic degrees yet.</p>
                        </div>
                        <Link
                          href="/institute/credentials/new"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                        >
                          <PlusCircle className="h-4 w-4" />
                          <span>Issue First Credential</span>
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    credentials.slice(0, 5).map((cred) => (
                    <tr key={cred.credential_id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                          {(cred.latest_version?.student_name || "S").charAt(0)}
                        </div>
                        <div>
                          <div>{cred.latest_version?.student_name || "Student"}</div>
                          <div className="text-[11px] font-mono text-slate-400">{cred.latest_version?.roll_number || "—"}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-amber-300">
                        {cred.credential_id}
                      </td>
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="text-slate-200 font-semibold">{cred.latest_version?.degree || "Degree"}</div>
                        <div className="text-slate-400 text-[11px]">
                          CGPA: <strong className="text-amber-300">{Number(cred.latest_version?.cgpa || 0).toFixed(2)}</strong>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center space-y-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold block w-fit mx-auto">
                          v{cred.current_version}.0
                        </span>
                        {cred.status === "ACTIVE" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/30">
                            REVOKED
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <Link
                          href={`/institute/credentials/${cred.credential_id}`}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                        >
                          Manage
                        </Link>
                        <Link
                          href={`/verify?id=${cred.credential_id}`}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold"
                          title="Verify in Public Verifier"
                        >
                          Verify
                        </Link>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Hash Chain Feed & Discrepancies */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Discrepancy Alerts Box */}
          <div className="rounded-3xl glass-panel p-6 border border-amber-500/30 bg-slate-900/90 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Open Discrepancy Alerts</span>
              </h4>
              <Link href="/institute/reports" className="text-xs text-amber-400 hover:underline">
                View All
              </Link>
            </div>

            {reports.filter(r => r.status === "PENDING").length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
                No pending discrepancy reports.
              </div>
            ) : (
              <div className="space-y-2.5">
                {reports.filter(r => r.status === "PENDING").slice(0, 2).map((rep) => (
                  <div key={rep.report_id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{rep.reason}</span>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        {rep.credential_id}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2">{rep.description}</p>
                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>By: {rep.reported_by} ({rep.reporter_role})</span>
                      <Link href="/institute/reports" className="text-emerald-400 font-semibold hover:underline">
                        Review &amp; Resolve →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hash Chain Stream */}
          <div className="rounded-3xl glass-panel p-6 border border-white/10 bg-slate-900/90 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span>Single-Node Hash Chain Stream</span>
              </h4>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">
                Chain Valid
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {blocks.slice(-3).reverse().map((b) => (
                <div key={b.block_id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-white">BLOCK #{b.block_id} [{b.event_type}]</span>
                    <span className="text-slate-400 text-[10px]">{new Date(b.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">ID: {b.credential_id} (v{b.version})</div>
                  <div className="text-[10px] text-emerald-400/90 break-all">
                    Hash: {formatHash(b.block_hash, 8)}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
