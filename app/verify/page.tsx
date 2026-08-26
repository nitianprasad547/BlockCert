"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoModal, { ModalType } from "@/components/DemoModal";
import QRScanner from "@/components/QRScanner";
import VerificationResult from "@/components/VerificationResult";
import BlockchainExplorerModal from "@/components/BlockchainExplorerModal";
import DiscrepancyModal from "@/components/DiscrepancyModal";
import { VerificationResult as VerificationResultType, AcademicRecordData } from "@/types";
import { api } from "@/lib/api";
import { ShieldCheck, Search, Sparkles } from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");

  const [currentId, setCurrentId] = useState<string>(queryId || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResultType | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [isSimulatingTamper, setIsSimulatingTamper] = useState(false);

  // Modals
  const [isChainExplorerOpen, setIsChainExplorerOpen] = useState(false);
  const [isDiscrepancyOpen, setIsDiscrepancyOpen] = useState(false);

  const performVerification = async (id: string, simulatedTamper?: Partial<AcademicRecordData> | null) => {
    if (!id.trim()) return;
    setLoading(true);
    setCurrentId(id.trim());
    setVerifyError(null);
    try {
      const res = await api.verifyCredential(id.trim(), simulatedTamper || undefined);
      setResult(res);
      setIsSimulatingTamper(!!simulatedTamper);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed. Please try again.";
      setVerifyError(message);
      setResult(null);
      console.error("Verification error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryId) {
      performVerification(queryId);
    }
  }, [queryId]);

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="uppercase tracking-wider">AUTHORITATIVE EMPLOYER VERIFIER</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Verify Academic <span className="text-gradient-emerald">Credentials Instantly</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Scan a student&apos;s physical or digital QR code, or enter their permanent Credential ID to execute full 4-point cryptographic checks against the BlockCert ledger.
        </p>
      </div>

      {/* Verification Scanner / Input Card */}
      <div className="max-w-3xl mx-auto">
        <QRScanner
          onScanResult={(scannedId) => performVerification(scannedId)}
          isLoading={loading}
        />
      </div>

      {verifyError && (
        <div className="max-w-3xl mx-auto rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300 text-center">
          {verifyError}
        </div>
      )}

      {/* Verification Result Display */}
      {result && (
        <div className="max-w-5xl mx-auto">
          <VerificationResult
            result={result}
            onSimulateTamper={(tamperPayload) => performVerification(currentId, tamperPayload)}
            onReportDiscrepancy={() => setIsDiscrepancyOpen(true)}
            onOpenChainExplorer={() => setIsChainExplorerOpen(true)}
            isSimulatingTamper={isSimulatingTamper}
          />
        </div>
      )}

      {/* Modals */}
      <BlockchainExplorerModal
        isOpen={isChainExplorerOpen}
        onClose={() => setIsChainExplorerOpen(false)}
        selectedCredentialId={currentId}
      />

      <DiscrepancyModal
        isOpen={isDiscrepancyOpen}
        onClose={() => setIsDiscrepancyOpen(false)}
        credentialId={currentId}
        defaultRole="Employer"
      />

    </div>
  );
}

export default function VerifyPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 bg-grid-pattern relative flex flex-col justify-between">
      <Navbar onOpenDemoModal={() => setActiveModal("demo")} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex-1">
        <Suspense fallback={<div className="text-center py-20 font-mono text-slate-400">Loading verification portal...</div>}>
          <VerifyContent />
        </Suspense>
      </main>
      <Footer
        onOpenDemoModal={() => setActiveModal("demo")}
        onOpenWhitepaperModal={() => setActiveModal("whitepaper")}
      />
      <DemoModal type={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}
