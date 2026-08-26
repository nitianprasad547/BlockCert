"use client";

import React, { useState } from "react";
import { 
  X, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  FileText, 
  Lock, 
  Send,
  Sparkles
} from "lucide-react";

export type ModalType = "demo" | "whitepaper" | "contact" | null;

interface DemoModalProps {
  type: ModalType;
  onClose: () => void;
}

export default function DemoModal({ type, onClose }: DemoModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    role: "Registrar",
  });

  if (!type) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel border border-emerald-500/40 bg-slate-900/95 p-6 sm:p-8 shadow-2xl space-y-6 text-left">
        
        {/* Close Icon */}
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal: Schedule Verification Demo or Contact */}
        {(type === "demo" || type === "contact") && (
          <>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span className="uppercase tracking-wider">
                  {type === "demo" ? "INSTITUTIONAL REGISTRAR DEMO" : "SECURITY ENGINEERING CONTACT"}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                {type === "demo" ? "Schedule Live Onboarding Demo" : "Contact TrustChain Security Engineers"}
              </h3>
              <p className="text-xs text-slate-400">
                Experience batch credential signing, cryptographic zero-knowledge verification, and HSM integration.
              </p>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-4 animate-fadeIn">
                <div className="h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Request Confirmed!</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Our security integration engineering team will reach out to <strong>{formData.email || "your email"}</strong> within 4 business hours.
                </p>
                <button
                  onClick={resetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer"
                >
                  Close Confirmation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. Alistair Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Institutional Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="registrar@stanford.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">University / Organization</label>
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="Stanford University Alliance"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Institutional Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Registrar">University Registrar / Academic Records</option>
                    <option value="CTO">Chief Information Officer / CTO</option>
                    <option value="Licensing">Professional Licensing Board</option>
                    <option value="Employer">Employer Verification Partner</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Demo Request</span>
                </button>
              </form>
            )}
          </>
        )}

        {/* Modal: Whitepaper */}
        {type === "whitepaper" && (
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-md bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-400">
                <FileText className="h-3.5 w-3.5" />
                <span className="uppercase tracking-wider">TECHNICAL WHITEPAPER v4.2</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Cryptographic Anchor Architecture
              </h3>
              <p className="text-xs text-slate-400">
                Authoritative Degree Attestation via Ethereum Layer-2 Rollups &amp; Zero-Knowledge Proofs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed max-h-60 overflow-y-auto">
              <p>
                <strong>1. Executive Summary:</strong> TrustChain establishes a decentralized cryptographic ledger 
                where educational institutions sign Merkle roots of issued credentials directly using Hardware Security Modules (HSM).
              </p>
              <p>
                <strong>2. Revocation Consensus:</strong> Unlike static PDF certificates, instant revocation status 
                is queried live against Ethereum L2 smart contracts with sub-second latency.
              </p>
              <p>
                <strong>3. Privacy &amp; FERPA Compliance:</strong> Zero-Knowledge proofs enable employers to verify 
                degree authenticity without exposing student personal identifiable information (PII) on public ledgers.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <Lock className="h-3 w-3" /> SHA256 Verified Document
              </span>
              <button
                onClick={resetAndClose}
                className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer"
              >
                Close Specification
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
