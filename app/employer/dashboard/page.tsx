"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  QrCode, 
  Hash, 
  Key, 
  Layers, 
  UserCheck,
  RefreshCw,
  Award
} from "lucide-react";
import { api } from "@/lib/api";
import { Credential, User } from "@/types";
import { formatHash } from "@/lib/crypto";

export default function EmployerDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "ACTIVE" | "REVOKED">("ALL");

  useEffect(() => {
    const user = api.getCurrentUser();
    setCurrentUser(user);

    api.getCredentials()
      .then((data) => {
        setCredentials(data);
      })
      .catch((err) => {
        console.error("Failed to load credentials for employer dashboard", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredCredentials = credentials.filter((c) => {
    const matchesFilter = selectedFilter === "ALL" || c.status === selectedFilter;
    const studentName = c.latest_version?.student_name || "";
    const degree = c.latest_version?.degree || "";
    const matchesSearch = !searchId.trim() || 
      c.credential_id.toLowerCase().includes(searchId.toLowerCase()) ||
      studentName.toLowerCase().includes(searchId.toLowerCase()) ||
      degree.toLowerCase().includes(searchId.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const verifiedCount = credentials.filter(c => c.status === "ACTIVE").length;
  const revokedCount = credentials.filter(c => c.status === "REVOKED").length;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-slate-950/80 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Authoritative Background Verification Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, {currentUser?.name || "Enterprise Verifier"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Conduct instant 4-point cryptographic audits on student degrees, verify Ed25519 digital signatures, and audit permanent blockchain hash chain history.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Search className="h-4 w-4" />
              <span>Verify New Candidate</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4-Point Cryptographic Verification Specs Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-emerald-500/30 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Hash className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">Stage 1</span>
          </div>
          <div className="text-xs font-bold text-white">SHA-256 Hash Matching</div>
          <p className="text-[11px] text-slate-400">
            Recomputes canonical JSON hash and matches against issued ledger block.
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-cyan-500/30 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Key className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase font-mono">Stage 2</span>
          </div>
          <div className="text-xs font-bold text-white">Ed25519 Signature Check</div>
          <p className="text-[11px] text-slate-400">
            Cryptographically validates registrar signature against official public key.
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-amber-500/30 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">Stage 3</span>
          </div>
          <div className="text-xs font-bold text-white">Hash Chain Continuity</div>
          <p className="text-[11px] text-slate-400">
            Audits previous block hashes to ensure zero broken links or deletions.
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-purple-500/30 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-purple-400 uppercase font-mono">Stage 4</span>
          </div>
          <div className="text-xs font-bold text-white">Revocation Ledger Check</div>
          <p className="text-[11px] text-slate-400">
            Scans active status and checks for disciplinary or superseded revocation events.
          </p>
        </div>
      </div>

      {/* Quick Lookup & Filter Search Bar */}
      <div className="rounded-2xl glass-panel p-4 border border-white/10 bg-slate-900/80 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search candidate name, credential ID, or degree..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === "ALL"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            All Candidates ({credentials.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("ACTIVE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === "ACTIVE"
                ? "bg-emerald-500 text-slate-950 font-bold"
                : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Verified Active ({verifiedCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("REVOKED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === "REVOKED"
                ? "bg-rose-500 text-white font-bold"
                : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Revoked ({revokedCount})
          </button>
        </div>
      </div>

      {/* Candidate Credentials Verification Registry */}
      <div className="rounded-3xl glass-panel border border-white/10 bg-slate-900/90 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Registered Academic Credentials for Verification</h2>
          </div>
          <span className="text-xs text-slate-400">
            Showing {filteredCredentials.length} of {credentials.length} credentials
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-amber-400" />
            <span>Connecting to ledger registry...</span>
          </div>
        ) : filteredCredentials.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <Award className="h-8 w-8 mx-auto text-slate-600" />
            <div className="text-sm font-semibold">No credentials found</div>
            <p className="text-xs text-slate-500">Try adjusting your search query or filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-white/5 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Candidate &amp; Degree</th>
                  <th className="py-3 px-4">Credential ID</th>
                  <th className="py-3 px-4">Cryptographic Hash</th>
                  <th className="py-3 px-4">Ledger Status</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCredentials.map((cred) => {
                  const isActive = cred.status === "ACTIVE";
                  return (
                    <tr key={cred.credential_id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{cred.latest_version?.student_name || "Enrolled Student"}</div>
                        <div className="text-[11px] text-slate-400">
                          {cred.latest_version?.degree || "Academic Degree"} · {cred.latest_version?.department || cred.institution_name}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                        {cred.credential_id}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                        {formatHash(cred.latest_version?.credential_hash || "")}
                      </td>
                      <td className="py-3.5 px-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>VERIFIED ACTIVE</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400">
                            <AlertTriangle className="h-3 w-3" />
                            <span>REVOKED</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/verify?id=${cred.credential_id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-amber-300 font-bold text-xs transition-all shadow-sm"
                        >
                          <span>Run 4-Point Audit</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
