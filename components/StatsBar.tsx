"use client";

import React from "react";
import { DollarSign, ShieldCheck, Zap, Award, Layers } from "lucide-react";

export default function StatsBar() {
  const stats = [
    {
      icon: Zap,
      value: "< 2 Secs",
      labelDesktop: "Local Credential Verification Speed",
      labelMobile: "Verification Speed",
      accent: "from-emerald-400 to-teal-300",
    },
    {
      icon: ShieldCheck,
      value: "Ed25519",
      labelDesktop: "Asymmetric Digital Signature Standard",
      labelMobile: "Ed25519 Signatures",
      accent: "from-cyan-400 to-emerald-400",
    },
    {
      icon: Layers,
      value: "SHA-256",
      labelDesktop: "Linear Tamper-Evident Hash Chain",
      labelMobile: "Hash Chain Ledger",
      accent: "from-amber-400 to-orange-400",
    },
    {
      icon: Award,
      value: "100% PII Safe",
      labelDesktop: "Zero Sensitive Student Data on Chain",
      labelMobile: "Zero PII on Chain",
      accent: "from-emerald-400 to-cyan-400",
    },
  ];

  return (
    <section className="relative z-20 -mt-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl bg-slate-950/85">
        
        {/* Desktop 1x4 & Mobile 2x2 Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center lg:items-start text-center lg:text-left ${
                  idx > 0 ? "pt-4 lg:pt-0 lg:pl-6" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className={`text-xl sm:text-2xl font-extrabold bg-gradient-to-r ${stat.accent} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                </div>
                <div className="text-xs font-semibold text-slate-300">
                  <span className="hidden sm:inline">{stat.labelDesktop}</span>
                  <span className="sm:hidden">{stat.labelMobile}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
