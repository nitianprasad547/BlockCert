"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Award, 
  CheckCircle2, 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  Layers, 
  Edit, 
  ExternalLink, 
  Trash2, 
  RotateCcw,
  Sparkles,
  Lock
} from "lucide-react";
import { Credential } from "@/types";
import { api } from "@/lib/api";
import CredentialCard from "@/components/CredentialCard";
import BlockchainExplorerModal from "@/components/BlockchainExplorerModal";
import { formatHash } from "@/lib/crypto";

export default function InstituteCredentialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "";

  const [credential, setCredential] = useState<Credential | null>(null);
  const [loading, setLoading] = useState(true);

  // Revocation state
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [revocationReason, setRevocationReason] = useState("");
  const [revoking, setRevoking] = useState(false);
  const [revokeError, setRevokeError] = useState<string | null>(null);

  // Chain explorer modal
  const [isChainModalOpen, setIsChainModalOpen] = useState(false);

  const loadCredential = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await api.getCredentialById(id);
      setCredential(data);
    } catch (err) {
      console.error("Error loading credential", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCredential();
  }, [id]);

  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revocationReason.trim() || !credential) return;

    setRevoking(true);
    setRevokeError(null);
    try {
      const updated = await api.revokeCredential({
        credential_id: credential.credential_id,
        reason: revocationReason.trim(),
      });
      setCredential(updated);
      setIsRevokeModalOpen(false);
      setRevocationReason("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to revoke credential.";
      setRevokeError(message);
      console.error("Revocation error", err);
    } finally {
      setRevoking(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center font-mono text-xs text-slate-400">
        Loading credential details...
      </div>
    );
  }

  if (!credential) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Credential not found</h2>
        <Link href="/institute/credentials" className="text-xs text-emerald-400 underline">
          Return to credentials registry
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/institute/credentials"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Registry</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {credential.status === "ACTIVE" && (
            <Link
              href={`/institute/credentials/${credential.credential_id}/modify`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Modify (Issue Version {credential.current_version + 1})</span>
            </Link>
          )}

          {credential.status === "ACTIVE" && (
            <button
              type="button"
              onClick={() => setIsRevokeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Revoke Credential</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsChainModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            <Layers className="h-3.5 w-3.5 text-emerald-400" />
            <span>Inspect Chain</span>
          </button>

          <Link
            href={`/verify?id=${credential.credential_id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Public Verifier</span>
          </Link>
        </div>
      </div>

      {/* Revocation Warning Box if Revoked */}
      {credential.status === "REVOKED" && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-extrabold uppercase tracking-wider text-rose-300">
              OFFICIALLY REVOKED RECORD
            </div>
            <p>
              This credential was revoked on {credential.revoked_at ? new Date(credential.revoked_at).toLocaleDateString() : "ledger"}.
              Reason: <strong>{credential.revocation_reason || "Administrative Revocation"}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Official Certificate Card */}
      <CredentialCard
        credential={credential.latest_version}
        permanentId={credential.credential_id}
        status={credential.status}
        onOpenChainExplorer={() => setIsChainModalOpen(true)}
      />

      {/* Version History Timeline (PRD Section 4.5 & 10) */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 bg-slate-900/80 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-cyan-400" />
              <span>Immutable Version History &amp; Audit Trail</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Every legitimate edit generates a new signed version while preserving older snapshots as SUPERSEDED.
            </p>
          </div>

          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            {credential.history?.length || 1} Total Versions
          </span>
        </div>

        <div className="space-y-4">
          {(credential.history || [credential.latest_version]).map((ver) => (
            <div
              key={ver.version_id}
              className={`p-4 rounded-2xl border text-xs font-mono transition-all ${
                ver.status === "ACTIVE"
                  ? "bg-slate-950 border-emerald-500/40 shadow-inner"
                  : "bg-slate-950/60 border-slate-800 opacity-80"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-white">
                    Version {ver.version_number}.0
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ver.status === "ACTIVE"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : ver.status === "SUPERSEDED"
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-rose-500/20 text-rose-300"
                  }`}>
                    {ver.status}
                  </span>
                  <span className="text-slate-500 text-[11px] font-sans">
                    Issued: {new Date(ver.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="text-slate-400 text-[11px]">
                  CGPA: <strong className="text-amber-300">{Number(ver.cgpa).toFixed(2)}</strong>
                </div>
              </div>

              {ver.modification_reason && (
                <div className="mt-2 text-[11px] text-amber-300 font-sans bg-amber-950/30 p-2 rounded-lg border border-amber-500/20">
                  <strong>Revision Note:</strong> {ver.modification_reason}
                </div>
              )}

              <div className="mt-2 pt-2 border-t border-white/5 flex flex-wrap items-center justify-between text-[10px] text-slate-500 gap-2">
                <div>SHA-256: {formatHash(ver.credential_hash, 10)}</div>
                <div>Ed25519 Sig: {formatHash(ver.digital_signature, 8)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revocation Dialog Modal */}
      {isRevokeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl glass-panel border border-rose-500/40 bg-slate-900/95 p-6 sm:p-8 shadow-2xl space-y-5 text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase">
                <AlertTriangle className="h-4 w-4" />
                <span>CONFIRM CREDENTIAL REVOCATION</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Revoke {credential.credential_id}?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                This action will record a signed <code className="text-rose-400">REVOKE</code> block in the hash chain. Future QR verification queries will display REVOKED.
              </p>
            </div>

            <form onSubmit={handleRevoke} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Mandatory Revocation Reason *
                </label>
                <textarea
                  rows={3}
                  required
                  value={revocationReason}
                  onChange={(e) => setRevocationReason(e.target.value)}
                  placeholder="e.g. Academic code of conduct violation / Administrative degree recall..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                {revokeError && (
                  <p className="flex-1 text-xs text-rose-400">{revokeError}</p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsRevokeModalOpen(false);
                    setRevokeError(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={revoking || !revocationReason.trim()}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {revoking ? "Signing Revocation..." : "Confirm & Sign Revocation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chain Inspector Modal */}
      <BlockchainExplorerModal
        isOpen={isChainModalOpen}
        onClose={() => setIsChainModalOpen(false)}
        selectedCredentialId={credential.credential_id}
      />

    </div>
  );
}
