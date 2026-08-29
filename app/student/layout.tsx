"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoModal, { ModalType } from "@/components/DemoModal";
import { api } from "@/lib/api";
import { 
  GraduationCap, 
  LayoutDashboard, 
  Award, 
  AlertTriangle, 
  ShieldCheck, 
  QrCode,
  LogIn,
  UserPlus 
} from "lucide-react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [studentLabel] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const user = api.getCurrentUser();
      if (user?.name) return `${user.name} · Student Portal`;
    }
    return "Student Credential Locker";
  });

  const navItems = [
    {
      label: "My Locker",
      href: "/student/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Academic Credentials",
      href: "/student/credentials",
      icon: Award,
    },
    {
      label: "Discrepancy Tracker",
      href: "/student/reports",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 bg-grid-pattern relative flex flex-col justify-between">
      <Navbar onOpenDemoModal={() => setActiveModal("demo")} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Top Sub-Nav Bar */}
        <div className="rounded-2xl glass-panel p-4 border border-cyan-500/30 bg-slate-900/90 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-400">
                STUDENT CREDENTIAL LOCKER
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                {studentLabel}
              </h2>
            </div>
          </div>

          {/* Right side: Nav Links Tabs and 2-Menu Dual Auth Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            <nav className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/student/dashboard" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                      isActive
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Access with Credential ID */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <Link
                href="/student/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 transition-colors font-bold"
                title="Access with Credential ID provided by your institute"
              >
                <LogIn className="h-3.5 w-3.5 text-cyan-400" />
                <span>Access with Credential ID</span>
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
