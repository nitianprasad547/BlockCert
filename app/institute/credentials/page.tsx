"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Award, 
  Search, 
  Filter, 
  PlusCircle, 
  CheckCircle2, 
  ShieldAlert, 
  ExternalLink, 
  Clock, 
  Layers,
  Edit,
  Eye,
  FileCheck,
  Building2,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { Credential, Institution } from "@/types";
import { api } from "@/lib/api";
import { formatHash } from "@/lib/crypto";

export default function InstituteCredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "REVOKED">("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [creds, insts] = await Promise.all([
          api.getCredentials(),
          api.getInstitutions(),
        ]);
        setCredentials(creds);
        setInstitutions(insts);
      } catch (err) {
        console.error("Failed to load registry data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("blockcert:credentials-updated", handleUpdate);
    return () => window.removeEventListener("blockcert:credentials-updated", handleUpdate);
  }, []);

  const filtered = credentials.filter((c) => {
    const name = c.latest_version?.student_name || "";
    const roll = c.latest_version?.roll_number || "";
    const degree = c.latest_version?.degree || "";
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      c.credential_id.toLowerCase().includes(q) ||
      name.toLowerCase().includes(q) ||
      roll.toLowerCase().includes(q) ||
      degree.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 text-left">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Authoritative Academic Credentials Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete database of institution-issued credentials anchored on the BlockCert ledger.
          </p>
        </div>

        <Link
          href="/institute/credentials/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Issue New Credential</span>
        </Link>
      </div>

      {/* Registered Institutions Network Panel */}
      {institutions.length > 0 && (
        <div className="rounded-3xl glass-panel p-5 sm:p-6 border border-emerald-500/20 bg-slate-900/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Building2 className="h-5 w-5 text-emerald-400" />
              <div>
                <h2 className="text-sm font-extrabold text-white">
                  Registered Issuing Institutions ({institutions.length})
                </h2>
                <p className="text-[11px] text-slate-400">
                  Institutions with authorized Ed25519 signing keys anchored in the network database
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-3 w-3" />
              Live DB Synced
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {institutions.map((inst) => (
              <div
                key={inst.institution_id}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 hover:border-emerald-500/30 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate" title={inst.name}>
                      {inst.name}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 font-semibold">
                      {inst.institution_id} • {inst.code}
                    </div>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    VERIFIED
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 truncate font-mono">
                  {inst.official_email}
                </div>

                {inst.public_key && (
                  <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <KeyRound className="h-3 w-3 text-slate-400" />
                      Key:
                    </span>
                    <span className="text-slate-300" title={inst.public_key}>
                      {inst.public_key.substring(0, 14)}...
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="rounded-2xl glass-panel p-4 border border-white/10 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll number, or Credential ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end text-xs font-semibold">
          <span className="text-slate-400 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </span>
          {(["ALL", "ACTIVE", "REVOKED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-emerald-500 text-slate-950 font-bold"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Credentials Table */}
      <div className="rounded-3xl glass-panel border border-white/10 bg-slate-900/90 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/70">
                <th className="py-4 px-4">Graduate Student</th>
                <th className="py-4 px-4">Permanent Credential ID</th>
                <th className="py-4 px-4">Degree Conferred</th>
                <th className="py-4 px-4">CGPA / Class</th>
                <th className="py-4 px-4 text-center">Version &amp; Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    Loading credentials registry...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No matching credentials found for &quot;{searchQuery}&quot;.
                  </td>
                </tr>
              ) : (
                filtered.map((cred) => (
                  <tr key={cred.credential_id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                        {(cred.latest_version?.student_name || "S").charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{cred.latest_version?.student_name || "Unnamed Student"}</div>
                        <div className="text-[11px] font-mono text-slate-400">{cred.latest_version?.roll_number || "—"}</div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono font-extrabold text-amber-300">
                      {cred.credential_id}
                    </td>

                    <td className="py-4 px-4 space-y-0.5">
                      <div className="text-slate-200 font-semibold">{cred.latest_version?.degree || "Degree"}</div>
                      <div className="text-slate-400 text-[11px]">{cred.latest_version?.department || "Department"}</div>
                    </td>

                    <td className="py-4 px-4 font-semibold">
                      <div className="text-amber-300 font-bold text-xs">
                        {Number(cred.latest_version?.cgpa || 0).toFixed(2)} / 10.0
                      </div>
                      <div className="text-[10px] text-slate-400">Class of {cred.latest_version?.graduation_year || 2026}</div>
                    </td>

                    <td className="py-4 px-4 text-center space-y-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold block w-fit mx-auto">
                        v{cred.current_version}.0
                      </span>
                      {cred.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>ACTIVE</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/30">
                          <ShieldAlert className="h-3 w-3" />
                          <span>REVOKED</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/institute/credentials/${cred.credential_id}`}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                          title="View Details &amp; History"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {cred.status === "ACTIVE" && (
                          <Link
                            href={`/institute/credentials/${cred.credential_id}/modify`}
                            className="p-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30"
                            title="Legitimate Modification (v2 ACTIVE)"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        )}
                        <Link
                          href={`/verify?id=${cred.credential_id}`}
                          className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
                          title="Verify in Public Verifier"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
