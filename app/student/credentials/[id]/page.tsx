"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Credential } from "@/types";
import { api } from "@/lib/api";
import CredentialCard from "@/components/CredentialCard";
import DiscrepancyModal from "@/components/DiscrepancyModal";
import BlockchainExplorerModal from "@/components/BlockchainExplorerModal";

function getStudentName(): string {
  return api.getCurrentUser()?.name || "Rahul Sharma";
}

export default function StudentCredentialDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "";

  const [credential, setCredential] = useState<Credential | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDiscrepancyOpen, setIsDiscrepancyOpen] = useState(false);
  const [isChainOpen, setIsChainOpen] = useState(false);
  const [studentName] = useState(() => (typeof window !== "undefined" ? api.getCurrentUser()?.name || "Rahul Sharma" : "Rahul Sharma"));

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    api
      .getCredentialById(id)
      .then((data) => {
        if (isMounted) {
          setCredential(data);
          setLoadError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setLoadError(err instanceof Error ? err.message : "Failed to load credential.");
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <div className="py-24 text-center font-mono text-xs text-slate-400">Loading certificate...</div>;
  }

  if (loadError) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-rose-300">{loadError}</p>
        <Link href="/student/credentials" className="text-xs text-cyan-400 underline">
          Back to credentials
        </Link>
      </div>
    );
  }

  if (!credential) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-xl font-bold text-white">Credential not found</h2>
        <Link href="/student/credentials" className="text-xs text-cyan-400 underline">
          Back to credentials
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/student/credentials"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Credentials</span>
        </Link>

        <Link
          href={`/verify?id=${credential.credential_id}`}
          className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold hover:underline"
        >
          <span>Open Public Verifier View</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <CredentialCard
        credential={credential.latest_version}
        permanentId={credential.credential_id}
        status={credential.status}
        onReportDiscrepancy={() => setIsDiscrepancyOpen(true)}
        onOpenChainExplorer={() => setIsChainOpen(true)}
      />

      <DiscrepancyModal
        isOpen={isDiscrepancyOpen}
        onClose={() => setIsDiscrepancyOpen(false)}
        credentialId={credential.credential_id}
        defaultReporterName={studentName}
        defaultRole="Student"
      />

      <BlockchainExplorerModal
        isOpen={isChainOpen}
        onClose={() => setIsChainOpen(false)}
        selectedCredentialId={credential.credential_id}
      />
    </div>
  );
}
