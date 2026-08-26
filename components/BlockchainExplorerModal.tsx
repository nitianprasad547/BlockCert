"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  ArrowDown, 
  RefreshCw, 
  Lock, 
  Calendar,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { Block } from "@/types";
import { api } from "@/lib/api";
import { formatHash } from "@/lib/crypto";

interface BlockchainExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCredentialId?: string;
}

export default function BlockchainExplorerModal({
  isOpen,
  onClose,
  selectedCredentialId,
}: BlockchainExplorerModalProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ is_valid: boolean; total_blocks: number } | null>(null);

  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const data = await api.getBlockchainBlocks();
      setBlocks(data);
      const val = await api.validateBlockchain();
      setValidationResult(val);
    } catch (err) {
      console.error("Error loading blocks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBlocks();
    }
  }, [isOpen]);

  const handleValidateNow = async () => {
    setValidating(true);
    try {
      const val = await api.validateBlockchain();
      setValidationResult(val);
    } finally {
      setTimeout(() => setValidating(false), 500);
    }
  };

  if (!isOpen) return null;

  const filteredBlocks = selectedCredentialId
    ? blocks.filter((b) => b.credential_id.toLowerCase() === selectedCredentialId.toLowerCase())
    : blocks;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl glass-panel border border-emerald-500/40 bg-slate-950/95 shadow-2xl overflow-hidden text-left">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span>Tamper-Evident Hash Chain Inspector</span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Single-Node Ledger
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Live block lineage verification. Altering any historic block invalidates downstream block hashes.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chain Validation Status Sub-header */}
        <div className="px-6 py-3.5 bg-slate-900/40 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {validationResult?.is_valid ? (
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Chain Integrity 100% VALID ({blocks.length} Blocks Verified)</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Chain Broken / Tampering Detected</span>
              </div>
            )}

            {selectedCredentialId && (
              <span className="text-xs text-slate-400">
                Filtered to ID: <strong className="text-emerald-300 font-mono">{selectedCredentialId}</strong>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleValidateNow}
            disabled={validating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${validating ? "animate-spin" : ""}`} />
            <span>Re-verify Chain Integrity</span>
          </button>
        </div>

        {/* Modal Body: Sequential Blocks Tree */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Traversing single-node blockchain blocks...</p>
            </div>
          ) : filteredBlocks.length === 0 ? (
            <div className="py-16 text-center space-y-2 text-slate-400">
              <p>No blocks recorded yet for this query.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBlocks.map((block, idx) => (
                <div key={block.block_id} className="relative">
                  {idx > 0 && (
                    <div className="flex justify-center py-2">
                      <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400/80 bg-slate-900 px-3 py-0.5 rounded-full border border-emerald-500/30">
                        <ArrowDown className="h-3.5 w-3.5" />
                        <span>previous_hash link confirmed</span>
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl glass-panel p-5 border border-white/10 bg-slate-900/80 hover:border-emerald-500/40 transition-all text-xs font-mono space-y-3">
                    
                    {/* Block Title Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-white">
                          BLOCK #{block.block_id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          block.event_type === "ISSUE"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : block.event_type === "MODIFY"
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        }`}>
                          EVENT: {block.event_type}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          v{block.version}.0
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(block.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Hashes Data Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-slate-400 block text-[10px] uppercase">Permanent Credential ID</span>
                        <span className="text-amber-300 font-bold">{block.credential_id}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-slate-400 block text-[10px] uppercase">Payload SHA-256 Digest</span>
                        <span className="text-emerald-400 break-all" title={block.credential_hash}>
                          {formatHash(block.credential_hash, 12)}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-slate-400 block text-[10px] uppercase">Previous Block Hash (Parent Link)</span>
                        <span className="text-slate-300 break-all" title={block.previous_hash}>
                          {formatHash(block.previous_hash, 12)}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1">
                        <span className="text-slate-400 block text-[10px] uppercase">Calculated Block Hash</span>
                        <span className="text-emerald-300 font-bold break-all" title={block.block_hash}>
                          {formatHash(block.block_hash, 12)}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>BlockCert Single-Node Tamper-Evident Chain Specification</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold cursor-pointer"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
