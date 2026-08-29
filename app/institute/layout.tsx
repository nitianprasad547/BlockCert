"use client";

import React, { useState, useEffect } from "react";
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
  ShieldCheck,
  LogIn,
  UserPlus
} from "lucide-react";
import { api } from "@/lib/api";
import { User } from "@/types";

export default function InstituteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(() => (typeof window !== "undefined" ? api.getCurrentUser() : null));

  useEffect(() => {
    setCurrentUser(api.getCurrentUser());
    const handleUpdate = () => setCurrentUser(api.getCurrentUser());
    window.addEventListener("blockcert:credentials-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("blockcert:credentials-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const instituteName = (currentUser?.role === "INSTITUTE" && currentUser?.name)
    ? currentUser.name
    : "Stanford University & Academic Alliance";

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
                {instituteName}
              </h2>
            </div>
          </div>

          {/* Right side: Nav Links Tabs and 2-Menu Dual Auth Switcher */}
          <div className="flex flex-wrap items-center gap-3">
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

            {/* 2 Menus: Sign In and Create Account (Sign Up) */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <Link
                href="/login?role=INSTITUTE"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-semibold"
                title="Sign in with an existing Institute account"
              >
                <LogIn className="h-3.5 w-3.5 text-emerald-400" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/signup?role=INSTITUTE"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-colors font-bold"
                title="Create a new Institute account"
              >
                <UserPlus className="h-3.5 w-3.5 text-emerald-400" />
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
