"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  ExternalLink, 
  ArrowRight,
  MessageSquare,
  Sparkles,
  ShieldAlert
} from "lucide-react";
import { DiscrepancyReport } from "@/types";
import { api } from "@/lib/api";

export default function InstituteReportsPage() {
  const [reports, setReports] = useState<DiscrepancyReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<DiscrepancyReport | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolving, setResolving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [resolveError, setResolveError] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.getReports();
      setReports(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load reports.");
      console.error("Error loading reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || !resolutionNotes.trim()) return;

    setResolving(true);
    setResolveError(null);
    try {
      await api.resolveReport(selectedReport.report_id, resolutionNotes.trim());
      await fetchReports();
      setSelectedReport(null);
      setResolutionNotes("");
    } catch (err) {
      setResolveError(err instanceof Error ? err.message : "Failed to resolve report.");
      console.error("Error resolving report", err);
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-amber-400" />
          <span>Discrepancy Review Inbox</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review and resolve discrepancy alerts and modification requests submitted by students and employers.
        </p>
      </div>

      {/* Reports List */}
      <div className="rounded-3xl glass-panel border border-white/10 bg-slate-900/90 overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-950/60 border-b border-white/10 flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>{reports.length} Total Reports Received</span>
          <span className="text-amber-400">
            {reports.filter(r => r.status === "PENDING").length} Awaiting Resolution
          </span>
        </div>

        <div className="divide-y divide-white/5">
          {loading ? (
            <div className="py-16 text-center text-xs font-mono text-slate-400">
              Loading discrepancy reports...
            </div>
          ) : loadError ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-xs text-rose-300">{loadError}</p>
              <button
                type="button"
                onClick={fetchReports}
                className="text-xs text-emerald-400 font-semibold underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : reports.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No discrepancy reports submitted.
            </div>
          ) : (
            reports.map((rep) => (
              <div
                key={rep.report_id}
                className="p-6 hover:bg-white/[0.02] transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      rep.status === "PENDING"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}>
                      {rep.status}
                    </span>
                    <h3 className="text-sm font-bold text-white">{rep.reason}</h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-400">Credential ID:</span>
                    <Link
                      href={`/institute/credentials/${rep.credential_id}`}
                      className="text-emerald-400 hover:underline font-bold"
                    >
                      {rep.credential_id}
                    </Link>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-white/5">
                  &ldquo;{rep.description}&rdquo;
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs">
                  <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                    <span>Reported by: <strong className="text-white">{rep.reported_by}</strong> ({rep.reporter_role})</span>
                    <span>•</span>
                    <span>Date: {new Date(rep.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {rep.status === "PENDING" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedReport(rep)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-sm"
                        >
                          Resolve Report
                        </button>
                        <Link
                          href={`/institute/credentials/${rep.credential_id}/modify`}
                          className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 text-cyan-300 font-bold text-xs"
                        >
                          Modify &amp; Reissue
                        </Link>
                      </>
                    ) : (
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Resolved ({rep.resolution_notes || "Resolved by registrar"})</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* Resolution Dialog Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl glass-panel border border-emerald-500/40 bg-slate-900/95 p-6 sm:p-8 shadow-2xl space-y-5 text-left">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                DISCREPANCY RESOLUTION WORKFLOW
              </span>
              <h3 className="text-xl font-bold text-white">
                Resolve Report: {selectedReport.reason}
              </h3>
              <p className="text-xs text-slate-400">
                Target Credential ID: <strong className="text-white font-mono">{selectedReport.credential_id}</strong>
              </p>
            </div>

            <form onSubmit={handleResolve} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Registrar Resolution Notes / Action Taken *
                </label>
                <textarea
                  rows={3}
                  required
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="e.g. Verified official mark records and updated CGPA via Version 2 reissuance."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                {resolveError && (
                  <p className="flex-1 text-xs text-rose-400">{resolveError}</p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedReport(null);
                    setResolveError(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resolving || !resolutionNotes.trim()}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold disabled:opacity-50 cursor-pointer"
                >
                  {resolving ? "Saving Resolution..." : "Mark as Resolved"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
