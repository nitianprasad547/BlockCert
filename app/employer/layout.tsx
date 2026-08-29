"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoModal, { ModalType } from "@/components/DemoModal";
import { 
  Briefcase, 
  LayoutDashboard, 
  Search, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  QrCode,
  FileCheck2
} from "lucide-react";
import { api } from "@/lib/api";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const currentUser = typeof window !== "undefined" ? api.getCurrentUser() : null;

  const navItems = [
    {
      label: "Verifier Dashboard",
      href: "/employer/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Instant QR & Hash Verifier",
      href: "/verify",
      icon: Search,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 bg-grid-pattern relative flex flex-col justify-between">
      <Navbar onOpenDemoModal={() => setActiveModal("demo")} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Top Sub-Nav Bar */}
        <div className="rounded-2xl glass-panel p-4 border border-amber-500/30 bg-slate-900/90 flex flex-wrap items-center justify-between gap-4">
          
          {/* Header Identity */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400">
                EMPLOYER &amp; VERIFIER PORTAL
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                {currentUser?.role === "EMPLOYER" ? currentUser.name : "Enterprise Verification Hub"}
              </h2>
            </div>
          </div>

          {/* Right Area: Nav Links & 2-Menu Dual Auth Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Nav Links Tabs */}
            <nav className="flex items-center gap-1.5 text-xs font-semibold">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                      isActive
                        ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 2 Menus: Sign In and Create Account (Sign Up) */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <Link
                href="/login?role=EMPLOYER"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-semibold"
                title="Sign in with an existing Employer account"
              >
                <LogIn className="h-3.5 w-3.5 text-amber-400" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/signup?role=EMPLOYER"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition-colors font-bold"
                title="Create a new Employer account"
              >
                <UserPlus className="h-3.5 w-3.5 text-amber-400" />
                <span>Create Account</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Page Content */}
        <div>{children}</div>

      </div>

      <Footer
        onOpenDemoModal={() => setActiveModal("demo")}
        onOpenWhitepaperModal={() => setActiveModal("whitepaper")}
      />
      <DemoModal type={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}
