"use client";

import React, { useState } from "react";
import { 
  Building2, 
  ShieldCheck, 
  Layers, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  Plus, 
  RefreshCw,
  Search,
  Filter,
  Check
} from "lucide-react";

interface RecordItem {
  id: string;
  name: string;
  degree: string;
  hash: string;
  status: "ANCHORED" | "PROCESSING" | "REVOKED";
  timestamp: string;
}

const initialRecords: RecordItem[] = [
  {
    id: "REC-2026-001",
    name: "Jessica Archer",
    degree: "B.Sc. Computer Science",
    hash: "0xfa129b8c32d4e5f67c8",
    status: "ANCHORED",
    timestamp: "2 mins ago"
  },
  {
    id: "REC-2026-002",
    name: "Dr. Evelyn Vance",
    degree: "PhD Mathematics",
    hash: "0x8f2dc34b91a4c9b34bf",
    status: "ANCHORED",
    timestamp: "12 mins ago"
  },
  {
    id: "REC-2026-003",
    name: "Robert Liang",
    degree: "MBA Finance",
    hash: "0xea901af56b7890c1f12d",
    status: "PROCESSING",
    timestamp: "Just now"
  }
];

export default function RegistrarDashboard() {
  const [records, setRecords] = useState<RecordItem[]>(initialRecords);
  const [filter, setFilter] = useState<"ALL" | "ANCHORED" | "PROCESSING">("ALL");
  const [isBatchSigning, setIsBatchSigning] = useState(false);
  const [batchSignedSuccess, setBatchSignedSuccess] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredRecords = records.filter(r => {
    if (filter === "ALL") return true;
    return r.status === filter;
  });

  const handleBatchSign = () => {
    setIsBatchSigning(true);
    setTimeout(() => {
      setRecords(prev => prev.map(r => ({ ...r, status: "ANCHORED" as const })));
      setIsBatchSigning(false);
      setBatchSignedSuccess(true);
      setTimeout(() => setBatchSignedSuccess(false), 3000);
    }, 1200);
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newRec: RecordItem = {
      id: `REC-2026-00${records.length + 1}`,
      name: newStudentName,
      degree: "M.Sc. Data Science & AI",
      hash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
              <Building2 className="h-3.5 w-3.5" />
              <span className="uppercase tracking-wider">ISSUER ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Command center for institutional registrars
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Streamline transcript issuance with batch signing. Upload verified CSV records, 
              instantly compute cryptographic trees, and sign thousands of secure PDFs simultaneously 
              with your hardware security modules (HSM).
            </p>
          </div>

          {/* Compliance Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-xl glass-panel p-3.5 border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-xs font-semibold self-start md:self-auto">
            <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="font-bold text-white">FERPA &amp; GDPR Compliant</div>
              <div className="text-[11px] text-emerald-400/80">Decentralized Zero-Knowledge Verification</div>
            </div>
          </div>
        </div>

        {/* Command Center Dashboard Window */}
        <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden shadow-2xl bg-slate-900/90">
          
          {/* Dashboard Window Header Bar */}
          <div className="bg-slate-950 px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            
            {/* Title & Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-amber-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-400 border-l border-slate-800 pl-4">
                Registrar Node v4.2 · Stanford Alliance
              </span>
            </div>

            {/* Interactive Filters & Actions */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Filter Tabs */}
              <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
                {(["ALL", "ANCHORED", "PROCESSING"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                      filter === tab
                        ? "bg-emerald-500 text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Add Record Trigger */}
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
              >
                <Plus className="h-3.5 w-3.5 text-emerald-400" />
                <span>Add Record</span>
              </button>

              {/* Batch Sign Action Simulator */}
              <button
                onClick={handleBatchSign}
                disabled={isBatchSigning}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                {isBatchSigning ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Signing On-Chain...</span>
                  </>
                ) : batchSignedSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Batch Signed!</span>
                  </>
                ) : (
                  <>
                    <Layers className="h-3.5 w-3.5" />
                    <span>Batch Sign HSM</span>
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
                  placeholder="Enter Student Name (e.g. Alex Morgan)"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full sm:w-80 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 cursor-pointer"
                >
                  Issue &amp; Queue Record
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          {/* Desktop Recipient Table & Mobile Stacked Cards */}
          <div className="p-4 sm:p-6">
            
            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Recipient Graduate</th>
                    <th className="py-3 px-4">Academic Degree</th>
                    <th className="py-3 px-4">On-Chain Anchor Hash</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Time</th>
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
                          <div className="text-[11px] font-mono text-slate-500">{row.id}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-300 font-semibold">{row.degree}</td>
                      <td className="py-4 px-4 font-mono text-xs text-emerald-400/90">{row.hash}</td>
                      <td className="py-4 px-4 text-center">
                        {row.status === "ANCHORED" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>ANCHORED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/30 animate-pulse">
                            <Clock className="h-3.5 w-3.5" />
                            <span>PROCESSING</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right text-xs text-slate-400">{row.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Card View (Visible on mobile) */}
            <div className="md:hidden space-y-4">
              {filteredRecords.map((row) => (
                <div
                  key={row.id}
                  className="rounded-xl glass-panel p-4 border border-white/10 bg-slate-950/60 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-white text-base">{row.name}</div>
                    {row.status === "ANCHORED" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>ANCHORED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-400 border border-amber-500/30">
                        <Clock className="h-3 w-3" />
                        <span>PROCESSING</span>
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-300 font-semibold">{row.degree}</div>
                  
                  <div className="p-2.5 rounded-lg bg-slate-900 font-mono text-[11px] text-emerald-400/90 break-all border border-slate-800">
                    {row.hash}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
