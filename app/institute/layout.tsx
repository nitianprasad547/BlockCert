"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoModal, { ModalType } from "@/components/DemoModal";
import { 
  Building2, 
  LayoutDashboard, 
  FileCheck, 
  PlusCircle, 
  AlertTriangle, 
  Settings, 
  Key, 
  ExternalLink,
  ShieldCheck
} from "lucide-react";

export default function InstituteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const navItems = [
    {
      label: "Dashboard",
      href: "/institute/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Credentials Registry",
      href: "/institute/credentials",
      icon: FileCheck,
    },
    {
      label: "Issue New Credential",
      href: "/institute/credentials/new",
      icon: PlusCircle,
    },
    {
      label: "Discrepancy Inbox",
      href: "/institute/reports",
      icon: AlertTriangle,
    },
    {
      label: "Institution Keys & Settings",
      href: "/institute/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 bg-grid-pattern relative flex flex-col justify-between">
      <Navbar onOpenDemoModal={() => setActiveModal("demo")} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Top Sub-Nav Bar */}
        <div className="rounded-2xl glass-panel p-4 border border-emerald-500/30 bg-slate-900/90 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400">
                INSTITUTION REGISTRAR PORTAL
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                Stanford University &amp; Academic Alliance
              </h2>
            </div>
          </div>

          {/* Nav Links Tabs */}
          <nav className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/institute/dashboard" && pathname?.startsWith(item.href) && item.href !== "/institute/credentials/new");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

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
