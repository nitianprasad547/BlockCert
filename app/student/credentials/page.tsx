"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Award, ExternalLink, Copy, Check, Eye } from "lucide-react";
import { Credential } from "@/types";
import { api } from "@/lib/api";
import { formatHash, copyTextToClipboard } from "@/lib/crypto";

function getStudentId(): string {
  return api.getCurrentUser()?.student_id || "STU-RAHUL-01";
}

export default function StudentCredentialsListPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadCredentials = () => {
    setLoading(true);
    setLoadError(null);
    api
      .getStudentCredentials(getStudentId())
      .then((data) => setCredentials(data))
      .catch((err) => {
        setLoadError(err instanceof Error ? err.message : "Failed to load credentials.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCredentials();
    const handleUpdate = () => loadCredentials();
    window.addEventListener("blockcert:credentials-updated", handleUpdate);
    return () => window.removeEventListener("blockcert:credentials-updated", handleUpdate);
  }, []);

  const handleCopy = async (id: string) => {
    const ok = await copyTextToClipboard(id);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Academic Credentials</h1>
        <p className="text-xs text-slate-400 mt-1">
          Cryptographically signed degrees and academic attestations issued to your student identity.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-slate-400">Loading credentials...</div>
      ) : loadError ? (
        <div className="py-16 text-center space-y-3">
          <p className="text-rose-300 text-sm">{loadError}</p>
          <button
            type="button"
            onClick={loadCredentials}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {credentials.map((cred) => (
            <div
              key={cred.credential_id}
              className="rounded-3xl glass-panel p-6 sm:p-7 border border-white/10 bg-slate-900/90 hover:border-cyan-500/40 transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400">{cred.institution_name}</span>
                      <div className="text-sm font-extrabold text-white">{cred.latest_version.degree}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                    v{cred.current_version}.0 {cred.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="text-slate-300 font-medium">
                    Department: <strong className="text-white">{cred.latest_version.department}</strong>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-400 pt-1">
                    <div>
                      <span>Cumulative CGPA: </span>
                      <strong className="text-amber-300 font-bold">{Number(cred.latest_version.cgpa).toFixed(2)}</strong>
                    </div>
                    <div>
                      <span>Graduation: </span>
                      <strong className="text-white">Class of {cred.latest_version.graduation_year}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Permanent Credential ID:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(cred.credential_id)}
                      className="text-amber-300 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
                    >
                      {cred.credential_id}
                      {copiedId === cred.credential_id ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3 text-slate-500" />
                      )}
                    </button>
                  </div>
                  <div className="text-slate-500 text-[10px]">
                    SHA-256: {formatHash(cred.latest_version.credential_hash, 8)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <Link
                  href={`/student/credentials/${cred.credential_id}`}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Official Diploma</span>
                </Link>
                <Link
                  href={`/verify?id=${cred.credential_id}`}
                  className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Public Verifier</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
