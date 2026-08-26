"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import RegistrarDashboard from "@/components/RegistrarDashboard";
import RevocationControl from "@/components/RevocationControl";
import Testimonials from "@/components/Testimonials";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import DemoModal, { ModalType } from "@/components/DemoModal";

export default function Home() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 bg-grid-pattern relative">
      
      {/* Primary Navigation Bar */}
      <Navbar onOpenDemoModal={() => setActiveModal("demo")} />

      {/* Main Content Area */}
      <main className="relative">
        
        {/* Hero Section & Cryptographic Proof Preview Card */}
        <HeroSection
          onOpenDemoModal={() => setActiveModal("demo")}
          onOpenWhitepaperModal={() => setActiveModal("whitepaper")}
        />

        {/* Dynamic Statistics Bar / Grid */}
        <StatsBar />

        {/* Registrar Command Center Dashboard Section */}
        <RegistrarDashboard />

        {/* Real-time Revocation Control Simulator */}
        <RevocationControl onOpenDemoModal={() => setActiveModal("demo")} />

        {/* Registrar Testimonials & Social Proof */}
        <Testimonials />

        {/* High-Impact Call to Action */}
        <CtaSection
          onOpenDemoModal={() => setActiveModal("demo")}
          onOpenContactModal={() => setActiveModal("contact")}
        />

      </main>

      {/* Global Footer */}
      <Footer
        onOpenDemoModal={() => setActiveModal("demo")}
        onOpenWhitepaperModal={() => setActiveModal("whitepaper")}
      />

      {/* Interactive Modals */}
      <DemoModal type={activeModal} onClose={() => setActiveModal(null)} />

    </div>
  );
}
