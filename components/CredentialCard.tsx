"use client";

import React, { useState } from "react";
import QRCode from "qrcode";
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  QrCode as QrIcon, 
  Copy, 
  Check, 
  Printer, 
  Download, 
  ExternalLink,
  AlertTriangle,
  Lock,
  Layers
} from "lucide-react";
import { CredentialVersion, CredentialStatus } from "@/types";
import { formatHash, copyTextToClipboard } from "@/lib/crypto";

interface CredentialCardProps {
  credential: CredentialVersion;
  status?: CredentialStatus;
  permanentId: string;
  showActions?: boolean;
  onReportDiscrepancy?: () => void;
  onOpenChainExplorer?: () => void;
  isCompact?: boolean;
}

export default function CredentialCard({
  credential,
  status = "ACTIVE",
  permanentId,
  showActions = true,
  onReportDiscrepancy,
  onOpenChainExplorer,
  isCompact = false,
}: CredentialCardProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const verifyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/verify?id=${permanentId}`
    : `https://blockcert.verify/verify?id=${permanentId}`;

  React.useEffect(() => {
    QRCode.toDataURL(verifyUrl, {
      width: 160,
      margin: 1,
      color: {
        dark: "#07090e",
        light: "#ffffff",
      },
    })
      .then(setQrDataUrl)
      .catch((err) => console.error("QR render error", err));
  }, [verifyUrl]);

  const handleCopyLink = async () => {
    const ok = await copyTextToClipboard(verifyUrl);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const isRevoked = status === "REVOKED" || credential.status === "REVOKED";
  const isSuperseded = status === "SUPERSEDED" || credential.status === "SUPERSEDED";

  return (
    <div className="space-y-4">
      {/* Certificate Frame Container */}
      <div className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-10 border transition-all duration-300 shadow-2xl text-left ${
        isRevoked
          ? "bg-slate-950 border-rose-500/50 shadow-rose-950/20"
          : isSuperseded
          ? "bg-slate-950 border-amber-500/40 shadow-amber-950/20 opacity-90"
          : "certificate-frame border-amber-500/40"
      }`}>
        
        {/* Subtle Watermark Crest Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden">
          <Award className="w-[500px] h-[500px] text-white" />
        </div>

        {/* Inner Security Border */}
        <div className="relative border border-amber-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-8">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
            
            {/* Institution Brand & Seal */}
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500/20 via-emerald-500/10 to-slate-900 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
                <Award className="h-7 w-7" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400/90 block">
                  OFFICIAL ACADEMIC CREDENTIAL
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  {credential.issuer_name || "Stanford University & Academic Alliance"}
                </h2>
                <div className="text-[11px] text-slate-400 font-mono">
                  ID: {credential.issuer_id || "INST-STANFORD-01"}
                </div>
              </div>
            </div>

            {/* Status & Version Pill */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-bold">
                v{credential.version_number}.0
              </span>

              {isRevoked ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-extrabold text-rose-400 border border-rose-500/40 animate-pulse-red">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>REVOKED</span>
                </span>
              ) : isSuperseded ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/40">
                  <span>SUPERSEDED</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3.5 py-1 text-xs font-extrabold text-emerald-400 border border-emerald-500/40 animate-pulse-green">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>ACTIVE LEDGER VERIFIED</span>
                </span>
              )}
            </div>

          </div>

          {/* Certificate Conferred Body */}
          <div className="py-8 space-y-6 text-center sm:text-left">
            <div className="text-xs font-serif uppercase tracking-widest text-slate-400">
              This certifies that authoritative credentials have been granted to
            </div>

            {/* Student Name */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight text-gradient-gold">
                {credential.student_name}
              </h1>
              <p className="text-xs sm:text-sm font-mono text-slate-400">
                Student ID / Roll No: <span className="text-slate-200 font-bold">{credential.roll_number}</span>
              </p>
            </div>

            {/* Degree & Honors */}
            <div className="bg-slate-950/60 rounded-xl p-4 sm:p-5 border border-white/5 space-y-3">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                For successful completion of the requirements for
              </div>
              <div className="text-lg sm:text-2xl font-bold text-white">
                {credential.degree}
              </div>
              <div className="text-sm font-medium text-emerald-300">
                Department: {credential.department}
              </div>

              {/* Grid Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Cumulative CGPA</span>
                  <span className="text-base font-extrabold text-amber-300">{Number(credential.cgpa).toFixed(2)} / 10.0</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Graduation Class</span>
                  <span className="text-sm font-bold text-white">Class of {credential.graduation_year}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Enrollment Year</span>
                  <span className="text-sm font-bold text-white">{credential.enrollment_year}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Classification</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {credential.credential_data?.classification || "First Class with Distinction"}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Cryptographic Ledger & Permanent QR Seal Footer */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 border-t border-amber-500/20 items-center">
            
            {/* Cryptographic Proof Data */}
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                <span>Cryptographic Proof &amp; Anchor ID</span>
              </div>

              {/* Permanent Credential ID & SHA-256 Box */}
              <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Permanent Credential ID:</span>
                  <span className="text-amber-300 font-extrabold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    {permanentId}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">SHA-256 Digest:</span>
                  <span className="text-emerald-400/90 font-bold" title={credential.credential_hash}>
                    {formatHash(credential.credential_hash, 10)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
                  <span>Ed25519 Signature:</span>
                  <span className="text-cyan-400/80" title={credential.digital_signature}>
                    {formatHash(credential.digital_signature, 8)}
                  </span>
                </div>
              </div>

              {credential.modification_reason && (
                <div className="text-xs bg-amber-950/40 p-2.5 rounded-lg border border-amber-500/30 text-amber-300">
                  <strong>Version Revision Note:</strong> {credential.modification_reason}
                </div>
              )}
            </div>

            {/* Permanent QR Code Box */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-2">
              <div className="p-1.5 rounded-lg bg-white shadow-md">
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrDataUrl} alt="Permanent Verification QR Code" className="w-24 h-24 sm:w-28 sm:h-28" />
                ) : (
                  <QrIcon className="w-24 h-24 text-slate-900" />
                )}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Scan for instant 4-point verification
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Action Controls Bar */}
      {showActions && (
        <div className="no-print flex flex-wrap items-center justify-between gap-3 pt-2">
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  <span>Copy Verification URL</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-slate-400" />
              <span>Print Official Certificate</span>
            </button>

            {onOpenChainExplorer && (
              <button
                type="button"
                onClick={onOpenChainExplorer}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition-colors cursor-pointer"
              >
                <Layers className="h-3.5 w-3.5 text-emerald-400" />
                <span>Inspect Hash Chain</span>
              </button>
            )}
          </div>

          {onReportDiscrepancy && (
            <button
              type="button"
              onClick={onReportDiscrepancy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-colors cursor-pointer"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Report Discrepancy</span>
            </button>
          )}

        </div>
      )}
    </div>
  );
}
