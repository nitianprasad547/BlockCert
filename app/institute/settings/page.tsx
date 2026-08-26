"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Key, 
  Lock, 
  ShieldCheck, 
  Copy, 
  Check, 
  RefreshCw,
  Server,
  Sparkles
} from "lucide-react";
import { Institution } from "@/types";
import { api } from "@/lib/api";
import { copyTextToClipboard } from "@/lib/crypto";

export default function InstituteSettingsPage() {
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getInstitution().then((data) => {
      setInstitution(data);
      setLoading(false);
    });
  }, []);

  const handleCopyKey = async () => {
    if (institution?.public_key) {
      const ok = await copyTextToClipboard(institution.public_key);
      if (ok) {
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
      }
    }
  };

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Institution Profile &amp; Cryptographic Identity
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Registered authority parameters, public key certificates, and cryptographic signature policies.
        </p>
      </div>

      {loading || !institution ? (
        <div className="py-20 text-center text-xs font-mono text-slate-400">
          Loading institution parameters...
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Institutional Metadata Card (PRD Section 4.1) */}
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 bg-slate-900/90 space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Official Institutional Identity</h3>
                  <p className="text-[11px] text-slate-400">Registered authority profile</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Authority</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block font-semibold mb-1">Institution Legal Name</span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold">
                  {institution.name}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-1">Permanent Institution ID</span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-mono font-bold">
                  {institution.institution_id}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-1">Official Academic Email</span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
                  {institution.official_email}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-1">Official Domain</span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-mono">
                  {institution.domain || "stanford.edu"}
                </div>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-400 block font-semibold mb-1">Campus Address</span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  {institution.address}
                </div>
              </div>
            </div>
          </div>

          {/* Cryptographic Keypair Specs (PRD Section 7) */}
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-emerald-500/30 bg-slate-900/90 space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Ed25519 Cryptographic Identity</h3>
                  <p className="text-[11px] text-slate-400">Used by verifiers to mathematically validate degree signatures</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyKey}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700"
              >
                {copiedKey ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Public Key</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3 font-mono">
              <div>
                <span className="text-slate-400 block text-[11px] mb-1 font-sans">
                  Ed25519 Public Key (Raw Base64):
                </span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 break-all select-all">
                  {institution.public_key}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-sans">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Lock className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Security &amp; Private Key Isolation (PRD Requirement 34 &amp; 35):</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  The institution&apos;s Ed25519 private key is held exclusively in encrypted backend storage and is used solely by the server-side crypto engine. Neither employers nor frontend clients ever receive the private signing key.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
