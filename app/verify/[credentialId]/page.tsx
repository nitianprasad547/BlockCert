"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VerificationResult from "@/components/VerificationResult";
import BlockchainExplorerModal from "@/components/BlockchainExplorerModal";
import DiscrepancyModal from "@/components/DiscrepancyModal";
import { VerificationResult as VerificationResultType, AcademicRecordData } from "@/types";
import { api } from "@/lib/api";
import { ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";

export default function DirectVerifyPage() {
  const params = useParams();
  const router = useRouter();
  const credentialId = (params?.credentialId as string) || "";

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerificationResultType | null>(null);
  const [isSimulatingTamper, setIsSimulatingTamper] = useState(false);

  // Modals
  const [isChainExplorerOpen, setIsChainExplorerOpen] = useState(false);
  const [isDiscrepancyOpen, setIsDiscrepancyOpen] = useState(false);

  const performVerification = async (tamperPayload?: Partial<AcademicRecordData> | null) => {
    if (!credentialId) return;
    setLoading(true);
    try {
      const res = await api.verifyCredential(credentialId, tamperPayload || undefined);
      setResult(res);
      setIsSimulatingTamper(!!tamperPayload);
    } catch (err) {
      console.error("Direct verification error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (credentialId) {
      performVerification();
    }
  }, [credentialId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 bg-grid-pattern relative flex flex-col justify-between">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex-1 space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to QR Scanner &amp; Lookup</span>
          </Link>

          <button
            type="button"
            onClick={() => performVerification(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-emerald-400 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Re-query Ledger</span>
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center space-y-4">
            <RefreshCw className="h-10 w-10 text-emerald-400 animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Executing 4-Point Cryptographic Proof Checks</h3>
              <p className="text-xs text-slate-400 font-mono">
                Verifying SHA-256 hash, Ed25519 digital signature, and linear hash chain...
              </p>
            </div>
          </div>
        ) : result ? (
          <div className="max-w-5xl mx-auto">
            <VerificationResult
              result={result}
              onSimulateTamper={(tamperPayload) => performVerification(tamperPayload)}
              onReportDiscrepancy={() => setIsDiscrepancyOpen(true)}
              onOpenChainExplorer={() => setIsChainExplorerOpen(true)}
              isSimulatingTamper={isSimulatingTamper}
            />
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400">
            <p>Could not verify credential. Please try again.</p>
          </div>
        )}

        {/* Modals */}
        <BlockchainExplorerModal
          isOpen={isChainExplorerOpen}
          onClose={() => setIsChainExplorerOpen(false)}
          selectedCredentialId={credentialId}
        />

        <DiscrepancyModal
          isOpen={isDiscrepancyOpen}
          onClose={() => setIsDiscrepancyOpen(false)}
          credentialId={credentialId}
          defaultRole="Employer"
        />

      </main>

      <Footer />
    </div>
  );
}
