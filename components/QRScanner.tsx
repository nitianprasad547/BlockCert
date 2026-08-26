"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  Upload,
  Search,
  QrCode,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { extractCredentialId } from "@/lib/crypto";

interface QRScannerProps {
  onScanResult: (credentialId: string) => void;
  isLoading?: boolean;
}

type BarcodeDetectorLike = {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>>;
};

async function decodeQrFromFile(file: File): Promise<string | null> {
  const fromFilename = extractCredentialId(file.name);

  if (typeof window === "undefined") {
    return fromFilename;
  }

  const BarcodeDetectorCtor = (window as Window & { BarcodeDetector?: new (opts: { formats: string[] }) => BarcodeDetectorLike }).BarcodeDetector;
  if (!BarcodeDetectorCtor) {
    return fromFilename;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = async () => {
      try {
        const detector = new BarcodeDetectorCtor({ formats: ["qr_code"] });
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        const barcodes = await detector.detect(canvas);
        const text = barcodes[0]?.rawValue || "";
        resolve(extractCredentialId(text) || fromFilename);
      } catch {
        resolve(fromFilename);
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(fromFilename);
    };

    img.src = url;
  });
}

export default function QRScanner({ onScanResult, isLoading = false }: QRScannerProps) {
  const [activeMode, setActiveMode] = useState<"id" | "camera" | "upload">("id");
  const [manualId, setManualId] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanIntervalRef = useRef<number | null>(null);

  const samplePresets = [
    {
      id: "CRED-7F83A91",
      label: "Rahul Sharma (B.Tech CS - Active)",
      badge: "Hackathon Flow",
    },
    {
      id: "CRED-9E24B10",
      label: "Dr. Evelyn Vance (PhD - Active)",
      badge: "Cryptographic Proof",
    },
    {
      id: "CRED-4D88A12",
      label: "Ananya Patel (M.Sc. AI - Active)",
      badge: "New Issue",
    },
  ];

  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) {
      window.clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = manualId.trim();
    if (!clean) return;
    const idToVerify = extractCredentialId(clean) || clean;
    onScanResult(idToVerify);
  };

  const handlePresetSelect = (id: string) => {
    setManualId(id);
    onScanResult(id);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadError(null);
    setUploadSuccess(false);
    e.target.value = "";

    const credentialId = await decodeQrFromFile(file);
    if (credentialId) {
      setUploadSuccess(true);
      onScanResult(credentialId);
    } else {
      setUploadError("Could not read a Credential ID from this image. Try a sample preset or enter the ID manually.");
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera access is not supported by your browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (!videoRef.current) return;

      videoRef.current.srcObject = stream;
      setIsCameraActive(true);

      const BarcodeDetectorCtor = (window as Window & { BarcodeDetector?: new (opts: { formats: string[] }) => BarcodeDetectorLike }).BarcodeDetector;
      if (!BarcodeDetectorCtor) {
        setCameraError("Live QR decoding needs Chrome/Edge. Use sample presets or upload a QR image.");
        return;
      }

      const detector = new BarcodeDetectorCtor({ formats: ["qr_code"] });
      scanIntervalRef.current = window.setInterval(async () => {
        if (!videoRef.current) return;
        try {
          const barcodes = await detector.detect(videoRef.current);
          const text = barcodes[0]?.rawValue;
          const id = text ? extractCredentialId(text) : null;
          if (id) {
            stopCamera();
            onScanResult(id);
          }
        } catch {
          // Ignore per-frame decode errors
        }
      }, 750);
    } catch {
      setCameraError("Camera stream unavailable. Upload a QR image or use a sample preset below.");
    }
  };

  const switchMode = (mode: "id" | "camera" | "upload") => {
    if (mode !== "camera") {
      stopCamera();
    }
    setActiveMode(mode);
    setUploadError(null);
    setUploadSuccess(false);
  };

  return (
    <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl bg-slate-900/90 space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Credential Verification Input</h3>
            <p className="text-[11px] text-slate-400">Enter ID, scan QR, or upload certificate image</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
          4-Point Check Ready
        </span>
      </div>

      <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold w-full sm:w-auto">
        {([
          { key: "id" as const, label: "Credential ID", icon: Search },
          { key: "camera" as const, label: "Camera Scan", icon: Camera },
          { key: "upload" as const, label: "Upload QR", icon: Upload },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => switchMode(key)}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all cursor-pointer ${
              activeMode === key
                ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {activeMode === "id" && (
        <div className="space-y-4">
          <form onSubmit={handleManualSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              placeholder="CRED-7F83A91 or paste verify URL"
              className="w-full pl-10 pr-36 py-3.5 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? "Verifying..." : "Verify"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Sample Hackathon Presets</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {samplePresets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePresetSelect(p.id)}
                  className="text-left p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-amber-300">{p.id}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {p.badge}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 group-hover:text-slate-300">{p.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeMode === "camera" && (
        <div className="space-y-4">
          <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-8 border-2 border-emerald-400/60 rounded-xl pointer-events-none animate-pulse">
              <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
              <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
              <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
            </div>

            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />

            {!isCameraActive && (
              <div className="space-y-2 z-10 text-center">
                <Camera className="h-10 w-10 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">Camera preview inactive</p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold cursor-pointer"
                >
                  Start Camera
                </button>
              </div>
            )}

            {cameraError && (
              <div className="absolute inset-4 bg-slate-950/95 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2 z-20">
                <AlertCircle className="h-6 w-6 text-amber-400" />
                <p className="text-xs text-slate-300">{cameraError}</p>
                <button
                  type="button"
                  onClick={() => handlePresetSelect("CRED-7F83A91")}
                  className="px-3 py-1 rounded bg-emerald-500 text-slate-950 text-xs font-bold cursor-pointer"
                >
                  Use Sample: CRED-7F83A91
                </button>
              </div>
            )}
          </div>

          {isCameraActive && !cameraError && (
            <p className="text-xs text-center text-emerald-400 font-mono">
              Point camera at BlockCert QR code — auto-detecting...
            </p>
          )}
        </div>
      )}

      {activeMode === "upload" && (
        <div className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-12 px-6 rounded-2xl border-2 border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-950/50 hover:bg-emerald-950/10 transition-all text-center cursor-pointer space-y-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {uploadedFileName ? uploadedFileName : "Click or drag QR certificate image"}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, or WEBP with BlockCert QR code</p>
            </div>
            {uploadSuccess && (
              <div className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Credential ID extracted — verifying...</span>
              </div>
            )}
            {uploadError && (
              <div className="inline-flex items-center gap-1 text-xs text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/30">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
