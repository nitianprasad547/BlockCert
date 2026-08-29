"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  QrCode, 
  AlertTriangle, 
  Lock, 
  Award,
  CheckCircle2
} from "lucide-react";
import { api } from "@/lib/api";
import QRScanner from "@/components/QRScanner";

function StudentLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCredId = searchParams.get("credential_id") || "";

  const [credentialId, setCredentialId] = useState(initialCredId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  useEffect(() => {
    if (initialCredId) {
      setCredentialId(initialCredId);
    }
  }, [initialCredId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = credentialId.trim().toUpperCase();
    if (!cleanId) {
      setError("Please enter your permanent Credential ID.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.loginWithCredentialId(cleanId);
      router.push("/student/dashboard");
    } catch (err: any) {
      setError(err?.message || "Failed to locate academic record on the ledger.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setCredentialId("CRED-7F83A91");
    setError(null);
  };

  const handleScanSuccess = (decodedText: string) => {
    setIsQrScannerOpen(false);
    // Extract credential_id if URL or raw ID was scanned
    let extractedId = decodedText.trim();
    if (extractedId.includes("id=")) {
      const match = extractedId.match(/[?&]id=([^&]+)/);
      if (match && match[1]) {
        extractedId = match[1];
      }
    } else if (extractedId.includes("/verify/")) {
      const parts = extractedId.split("/verify/");
      if (parts[1]) extractedId = parts[1].split("?")[0];
    }
    setCredentialId(extractedId.toUpperCase());
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6 text-left">
      
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
          <GraduationCap className="h-4 w-4" />
          <span>STUDENT SCORECARD PORTAL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Access Your Academic Scorecard
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Enter the permanent Credential ID provided by your university to access your official degree, grade scorecard, and blockchain attestation.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="rounded-3xl bg-slate-900/90 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 space-y-6">
        
        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 animate-fadeIn">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">{error}</p>
              <p className="text-[11px] text-rose-400/80">
                Tip: Contact your university registrar if you haven&apos;t received your issued Credential ID yet.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="credential-id-input" className="block font-bold text-slate-200">
                Permanent Credential ID *
              </label>
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="h-3 w-3" />
                <span>Fill Demo ID</span>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
              </div>
              <input
                id="credential-id-input"
                type="text"
                required
                autoFocus
                value={credentialId}
                onChange={(e) => {
                  setCredentialId(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="CRED-7F83A91"
                className="w-full pl-10 pr-24 py-3 rounded-xl bg-slate-950 border border-cyan-500/40 text-white font-mono font-bold text-sm tracking-wider placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors uppercase"
              />
              <button
                type="button"
                onClick={() => setIsQrScannerOpen(true)}
                className="absolute inset-y-1.5 right-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Scan Certificate QR Code"
              >
                <QrCode className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Scan QR</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              Permanent identifiers follow the standard format: <span className="font-mono text-cyan-300 font-semibold">CRED-XXXXXXX</span>.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !credentialId.trim()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            <span>{loading ? "Validating On-Chain..." : "Access My Official Scorecard"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Security & Privacy Guarantee */}
        <div className="pt-4 border-t border-white/10 space-y-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold">
            <Lock className="h-3.5 w-3.5" />
            <span>Strict Student Privacy Enforced</span>
          </div>
          <p className="leading-relaxed">
            In accordance with institutional credential privacy standards, entering your Credential ID authorizes access <strong className="text-slate-200">only to your own academic scorecard</strong> and degree certificate.
          </p>
        </div>

      </div>

      {/* Alternative Links */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2">
        <Link href="/" className="hover:text-white transition-colors">
          ← Back to Homepage
        </Link>
        <Link href="/login?role=INSTITUTE" className="text-emerald-400 hover:underline">
          Institute Registrar Login →
        </Link>
      </div>

      {/* QR Scanner Modal */}
      {isQrScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                <QrCode className="h-4 w-4 text-cyan-400" />
                <span>Scan Degree Certificate QR</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsQrScannerOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close ✕
              </button>
            </div>
            <QRScanner onScanResult={handleScanSuccess} />
          </div>
        </div>
      )}

    </div>
  );
}

export default function StudentLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
          <div className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span>Loading Student Portal...</span>
        </div>
      }
    >
      <StudentLoginForm />
    </Suspense>
  );
}
