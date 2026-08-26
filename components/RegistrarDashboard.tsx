"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Plus, 
  RefreshCw,
  Search,
  Filter,
  Check,
  ExternalLink,
  Lock,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface RecordItem {
  id: string;
  name: string;
  degree: string;
  hash: string;
  version: number;
  status: "ACTIVE" | "PROCESSING" | "REVOKED";
  timestamp: string;
}

const initialRecords: RecordItem[] = [
  {
    id: "CRED-7F83A91",
    name: "Rahul Sharma",
    degree: "B.Tech Computer Science",
    hash: "a71f92e48b11c97a5482e987c61d5203",
    version: 1,
    status: "ACTIVE",
    timestamp: "2 mins ago"
  },
  {
    id: "CRED-9E24B10",
    name: "Dr. Evelyn Vance",
    degree: "PhD Computer Science & Cryptography",
    hash: "f3c8091a45b76e820194857620194857",
    version: 1,
    status: "ACTIVE",
    timestamp: "15 mins ago"
  },
  {
    id: "CRED-4D88A12",
    name: "Ananya Patel",
    degree: "M.Sc. Artificial Intelligence",
    hash: "0xea901af56b7890c1f12d849201948571",
    version: 1,
    status: "PROCESSING",
    timestamp: "Just now"
  }
];

export default function RegistrarDashboard() {
  const [records, setRecords] = useState<RecordItem[]>(initialRecords);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "PROCESSING">("ALL");
  const [isSigning, setIsSigning] = useState(false);
  const [signedSuccess, setSignedSuccess] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredRecords = records.filter(r => {
    if (filter === "ALL") return true;
    return r.status === filter;
  });

  const handleBatchSign = () => {
    setIsSigning(true);
    setTimeout(() => {
      setRecords(prev => prev.map(r => ({ ...r, status: "ACTIVE" as const })));
      setIsSigning(false);
      setSignedSuccess(true);
      setTimeout(() => setSignedSuccess(false), 3000);
    }, 1000);
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newStudentName.trim() || "New Graduate Recipient";

    const newRec: RecordItem = {
      id: `CRED-${Math.random().toString(16).substring(2, 9).toUpperCase()}`,
      name: name,
      degree: "B.Tech Electrical & Computer Eng",
      hash: `bc${Math.random().toString(16).substring(2, 18)}`,
      version: 1,
      status: "PROCESSING",
      timestamp: "Just now"
    };

    setRecords([newRec, ...records]);
    setNewStudentName("");
    setShowAddForm(false);
  };

  return (
    <section id="dashboard" className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="uppercase tracking-wider">LIVE REGISTRAR COMMAND CENTER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Academic Authority Issuance Engine
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Stanford University Registrar interactive terminal. Issue verifiable credentials, batch sign event blocks via Ed25519, and append state changes to the tamper-evident hash chain.
          </p>
        </div>

        {/* Interactive Dashboard Container */}
        <div className="rounded-3xl glass-panel border border-white/10 shadow-2xl bg-slate-900/90 overflow-hidden text-left">
          
          {/* Dashboard Header Bar */}
          <div className="p-4 sm:p-6 bg-slate-950/60 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Institutional Registrar Console</h3>
                <p className="text-xs text-slate-400">Ed25519 Authority Key: STANFORD-AA-KEY-01</p>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-400 border-l border-slate-800 pl-4">
                BlockCert Registrar Node · Stanford University Alliance
              </span>
            </div>

            {/* Interactive Filters & Actions */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Filter Tabs */}
              <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
                {(["ALL", "ACTIVE", "PROCESSING"] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFilter(tab)}
                    className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                      filter === tab
                        ? "bg-emerald-500 text-slate-950 shadow-sm font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Add Record Trigger */}
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
              >
                <Plus className="h-3.5 w-3.5 text-emerald-400" />
                <span>Issue Single</span>
              </button>

              {/* Sign Action Simulator */}
              <button
                type="button"
                onClick={handleBatchSign}
                disabled={isSigning}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                {isSigning ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Signing Ed25519...</span>
                  </>
                ) : signedSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Signed On-Chain!</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    <span>Sign Hash Chain</span>
                  </>
                )}
              </button>

            </div>

          </div>

          {/* Quick Add Form Drawer (Interactive) */}
          {showAddForm && (
            <div className="bg-slate-950/80 p-4 border-b border-emerald-500/30 animate-fadeIn">
              <form onSubmit={handleAddRecord} className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Enter Student Name (e.g. Rahul Sharma)"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full sm:w-80 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 cursor-pointer"
                >
                  Generate &amp; Sign Credential
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          {/* Recipient Table */}
          <div className="p-4 sm:p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Graduate Recipient</th>
                    <th className="py-3 px-4">Permanent ID</th>
                    <th className="py-3 px-4">Degree</th>
                    <th className="py-3 px-4">SHA-256 Digest</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm font-medium">
                  {filteredRecords.map((row) => (
                    <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                          {row.name.charAt(0)}
                        </div>
                        <div>
                          <div>{row.name}</div>
                          <div className="text-[11px] text-slate-400 font-normal">v{row.version}.0 Active</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-amber-300 font-bold">{row.id}</td>
                      <td className="py-4 px-4 text-slate-300 text-xs font-semibold">{row.degree}</td>
                      <td className="py-4 px-4 font-mono text-xs text-emerald-400/90">{row.hash}...</td>
                      <td className="py-4 px-4 text-center">
                        {row.status === "ACTIVE" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>ACTIVE</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/30 animate-pulse">
                            <Clock className="h-3.5 w-3.5" />
                            <span>PROCESSING</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/verify?id=${row.id}`}
                          className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline font-semibold"
                        >
                          <span>Verify</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
