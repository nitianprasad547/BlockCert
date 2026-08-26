"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Cpu, 
  Layers, 
  FileText, 
  RotateCcw, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Building2,
  ExternalLink,
  Flame
} from "lucide-react";
import { VerificationResult as VerificationResultType, AcademicRecordData } from "@/types";
import { formatHash, copyTextToClipboard } from "@/lib/crypto";
import CredentialCard from "@/components/CredentialCard";

interface VerificationResultProps {
  result: VerificationResultType;
  onSimulateTamper?: (tamperedFields: Partial<AcademicRecordData> | null) => void;
  onReportDiscrepancy?: () => void;
  onOpenChainExplorer?: () => void;
  isSimulatingTamper?: boolean;
}

export default function VerificationResult({
  result,
  onSimulateTamper,
  onReportDiscrepancy,
  onOpenChainExplorer,
  isSimulatingTamper = false,
}: VerificationResultProps) {
  const [expandedCheckId, setExpandedCheckId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"checks" | "certificate" | "raw">("checks");
  const [copiedId, setCopiedId] = useState(false);

  const toggleCheck = (id: string) => {
    setExpandedCheckId(expandedCheckId === id ? null : id);
  };

  const isVerified = result.is_valid && result.status === "ACTIVE";
  const isTampered = result.status === "TAMPERED" || (!result.hash_check && result.status !== "NOT_FOUND");
  const isRevoked = result.status === "REVOKED";
  const isNotFound = result.status === "NOT_FOUND";

  const handleCopyId = async () => {
    const ok = await copyTextToClipboard(result.credential_id);
    if (ok) {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      
      {/* Top Banner Status Header */}
      <div className={`relative rounded-3xl p-6 sm:p-8 border transition-all duration-300 shadow-2xl overflow-hidden ${
        isVerified
          ? "bg-emerald-950/40 border-emerald-500/50 shadow-emerald-950/30"
          : isTampered
          ? "bg-rose-950/40 border-rose-500/60 shadow-rose-950/30"
          : isRevoked
          ? "bg-amber-950/40 border-amber-500/50 shadow-amber-950/30"
          : "bg-slate-900/60 border-slate-700 shadow-slate-950/30"
      }`}>
        
        {/* Ambient Glow */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[130px] pointer-events-none ${
          isVerified ? "bg-emerald-500/15" : isTampered ? "bg-rose-500/20" : isRevoked ? "bg-amber-500/15" : "bg-slate-500/10"
        }`} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Main Status Information */}
          <div className="flex items-start gap-4">
            <div className={`p-3.5 rounded-2xl border flex items-center justify-center flex-shrink-0 shadow-lg ${
              isVerified
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse-green"
                : isTampered
                ? "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse-red"
                : isRevoked
                ? "bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse-amber"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}>
              {isVerified && <CheckCircle2 className="h-8 w-8" />}
              {isTampered && <ShieldAlert className="h-8 w-8" />}
              {isRevoked && <AlertTriangle className="h-8 w-8" />}
              {isNotFound && <XCircle className="h-8 w-8" />}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isVerified
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : isTampered
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                    : isRevoked
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "bg-slate-800 text-slate-300 border-slate-700"
                }`}>
                  {isVerified && "✓ VERIFIED ON-CHAIN"}
                  {isTampered && "❌ INTEGRITY FAILED / TAMPERED"}
                  {isRevoked && "⚠️ CREDENTIAL REVOKED"}
                  {isNotFound && "❌ RECORD NOT FOUND"}
                </span>

                <span className="text-xs text-slate-400 font-mono">
                  {new Date(result.timestamp).toLocaleTimeString()} UTC
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {isVerified && "Authoritative Academic Credential Validated"}
                {isTampered && "Cryptographic Tampering Detected!"}
                {isRevoked && "Credential Status Revoked by Institution"}
                {isNotFound && "Credential ID Does Not Exist on Ledger"}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {isVerified && "All 4 independent cryptographic checks passed. Signature and hash chain linkages match the registered institution's private key issuance."}
                {isTampered && "The payload hash or digital signature does not match the authoritative ledger block. One or more fields have been unauthorizedly altered."}
                {isRevoked && "This credential has been officially invalidated or superseded by the issuing registrar. Details below."}
                {isNotFound && `The queried identifier "${result.credential_id}" could not be located in the BlockCert registry.`}
              </p>
            </div>
          </div>

          {/* Quick Identifier Pill */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-white/10 space-y-2 flex-shrink-0 text-left min-w-[220px]">
            <div className="text-[10px] uppercase font-bold text-slate-400">Queried Credential ID</div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-extrabold text-emerald-400">
                {result.credential_id}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Copy Credential ID"
              >
                {copiedId ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-white/5">
              Verification ID: {result.verification_id}
            </div>
          </div>

        </div>

        {/* Hackathon Interactive Tamper Simulation Sandbox Toolbar */}
        {onSimulateTamper && !isNotFound && (
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-amber-500/20 text-amber-400">
                <Flame className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-200">
                Hackathon Tamper Detection Sandbox:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onSimulateTamper({ cgpa: 10.0 })}
                className="px-3 py-1.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Flame className="h-3.5 w-3.5 text-rose-400" />
                <span>Simulate Altered CGPA (8.2 → 10.0)</span>
              </button>

              <button
                type="button"
                onClick={() => onSimulateTamper({ student_name: "Rahul S. (Forged Name)" })}
                className="px-3 py-1.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Flame className="h-3.5 w-3.5 text-rose-400" />
                <span>Simulate Altered Student Name</span>
              </button>

              {isSimulatingTamper && (
                <button
                  type="button"
                  onClick={() => onSimulateTamper(null)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Restore Original Valid Data</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Navigation View Switcher */}
      {!isNotFound && (
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-3 text-xs sm:text-sm font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("checks")}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "checks"
                  ? "bg-slate-900 text-emerald-400 border border-emerald-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>4-Point Cryptographic Proofs</span>
            </button>

            {result.credential && (
              <button
                type="button"
                onClick={() => setActiveTab("certificate")}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "certificate"
                    ? "bg-slate-900 text-emerald-400 border border-emerald-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Authoritative Certificate</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab("raw")}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "raw"
                  ? "bg-slate-900 text-emerald-400 border border-emerald-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Raw Ledger Block &amp; Hashes</span>
            </button>
          </div>

          {onReportDiscrepancy && (
            <button
              type="button"
              onClick={onReportDiscrepancy}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5 cursor-pointer py-1"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Report Issue</span>
            </button>
          )}
        </div>
      )}

      {/* Tab 1: 4-Point Cryptographic Check Breakdown */}
      {activeTab === "checks" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.checks.map((check) => {
              const isPassed = check.status === "PASSED";
              const isExpanded = expandedCheckId === check.id;
              return (
                <div
                  key={check.id}
                  className={`rounded-2xl glass-panel p-5 border transition-all ${
                    isPassed
                      ? "border-emerald-500/30 bg-slate-900/80"
                      : "border-rose-500/40 bg-rose-950/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl border mt-0.5 ${
                        isPassed
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}>
                        {isPassed ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{check.name}</h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-extrabold ${
                            isPassed ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                          }`}>
                            {check.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{check.description}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleCheck(check.id)}
                      className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Expandable Details */}
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-2 text-xs">
                    <div className={`p-2.5 rounded-lg font-medium leading-relaxed ${
                      isPassed ? "bg-slate-950 text-slate-300" : "bg-rose-950/50 text-rose-200"
                    }`}>
                      {check.details}
                    </div>

                    {isExpanded && (
                      <div className="space-y-1 font-mono text-[11px] bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                        {check.expected && (
                          <div className="text-slate-400">
                            <strong>Expected:</strong> <span className="text-emerald-400">{check.expected}</span>
                          </div>
                        )}
                        {check.actual && (
                          <div className="text-slate-400">
                            <strong>Computed:</strong> <span className={isPassed ? "text-emerald-400" : "text-rose-400 font-bold"}>{check.actual}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Issuing Institution Verification Summary */}
          {result.institution && (
            <div className="rounded-2xl glass-panel p-5 border border-white/10 bg-slate-900/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-slate-400">Issuing Educational Authority</div>
                  <div className="text-sm font-extrabold text-white">{result.institution.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Public Key:</span>
                <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800" title={result.institution.public_key}>
                  {formatHash(result.institution.public_key, 8)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Certificate View */}
      {activeTab === "certificate" && result.credential && (
        <CredentialCard
          credential={result.credential as any}
          permanentId={result.credential_id}
          status={result.status as any}
          onReportDiscrepancy={onReportDiscrepancy}
          onOpenChainExplorer={onOpenChainExplorer}
        />
      )}

      {/* Tab 3: Raw Ledger Block & Hashes */}
      {activeTab === "raw" && (
        <div className="space-y-4">
          <div className="rounded-2xl glass-panel p-6 border border-white/10 bg-slate-900/90 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-400" />
                <span>Cryptographic Digest Specifications</span>
              </h4>
              {onOpenChainExplorer && (
                <button
                  type="button"
                  onClick={onOpenChainExplorer}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold cursor-pointer"
                >
                  Open Chain Inspector
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-slate-400 block text-[11px]">Authoritative SHA-256 Digest:</span>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 break-all select-all mt-1">
                  {result.stored_hash || result.credential?.credential_hash || "N/A"}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Live Recomputed SHA-256:</span>
                <div className={`p-2.5 rounded-lg bg-slate-950 border text-xs break-all select-all mt-1 ${
                  result.hash_check ? "border-emerald-500/40 text-emerald-300" : "border-rose-500/40 text-rose-300 font-bold"
                }`}>
                  {result.computed_hash || "N/A"}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Ed25519 Digital Signature:</span>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 break-all select-all mt-1">
                  {result.credential?.digital_signature || "N/A"}
                </div>
              </div>

              {result.latest_block && (
                <div>
                  <span className="text-slate-400 block text-[11px]">Hash Chain Block Reference:</span>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 break-all mt-1">
                    Block #{result.latest_block.block_id} [{result.latest_block.event_type}] — Hash: {result.latest_block.block_hash}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
