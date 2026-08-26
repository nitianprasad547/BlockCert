"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { DiscrepancyReport } from "@/types";
import { api } from "@/lib/api";
import DiscrepancyModal from "@/components/DiscrepancyModal";

export default function StudentReportsTrackerPage() {
  const [reports, setReports] = useState<DiscrepancyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await api.getReports();
      setReports(data);
    } catch (err) {
      console.error("Error loading reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-400" />
            <span>Discrepancy &amp; Correction Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track status of your submitted academic marksheet corrections and fraud alerts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-bold text-xs hover:from-rose-400 hover:to-amber-400 transition-all shadow-md cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Submit New Report</span>
        </button>
      </div>

      {/* Reports List */}
      <div className="rounded-3xl glass-panel border border-white/10 bg-slate-900/90 overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-950/60 border-b border-white/10 text-xs font-semibold text-slate-400 flex items-center justify-between">
          <span>My Submitted Discrepancy Reports</span>
          <span className="text-cyan-400">{reports.length} Reports Tracked</span>
        </div>

        <div className="divide-y divide-white/5">
          {loading ? (
            <div className="py-16 text-center text-xs font-mono text-slate-400">
              Loading report history...
            </div>
          ) : reports.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-xs text-slate-400">No discrepancy reports submitted yet.</p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-xs text-emerald-400 font-semibold underline cursor-pointer"
              >
                Submit your first discrepancy report
              </button>
            </div>
          ) : (
            reports.map((rep) => (
              <div key={rep.report_id} className="p-6 space-y-3 text-xs">
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

                  <span className="font-mono text-slate-400 text-[11px]">
                    ID: <strong className="text-amber-300">{rep.credential_id}</strong>
                  </span>
                </div>

                <p className="text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-white/5 leading-relaxed">
                  &ldquo;{rep.description}&rdquo;
                </p>

                {rep.resolution_notes && (
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px] uppercase tracking-wider">
                        Registrar Resolution Note:
                      </strong>
                      <span>{rep.resolution_notes}</span>
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-slate-500 pt-1">
                  Submitted: {new Date(rep.created_at).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Discrepancy Modal */}
      <DiscrepancyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          loadReports();
        }}
        credentialId="CRED-7F83A91"
        defaultReporterName="Rahul Sharma"
        defaultRole="Student"
      />

    </div>
  );
}
