"use client";

import React from "react";
import { Quote, Building, Award, Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "BlockCert has transformed our university records office. Using Ed25519 signatures and the permanent QR code, students share verified credentials in seconds without administrative overhead.",
      name: "Dr. Alistair Vance",
      title: "University Registrar, Stanford Alliance",
      institution: "Stanford Alliance",
      badge: "Cryptographic Issuer",
      rating: 5,
    },
    {
      quote: "Our recruiting leads instantly verify candidates using QR codes. The built-in 4-point cryptographic check completely eliminates diploma fraud and background verification delays.",
      name: "Sarah Jenkins",
      title: "Head of Academic Credentialing, Tech Talent Consortium",
      institution: "Tech Talent Consortium",
      badge: "Employer Verification Partner",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background Gradient Circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/5 rounded-full blur-[170px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-md bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-400">
            <Award className="h-3.5 w-3.5" />
            <span className="uppercase tracking-wider">ACADEMIC ECOSYSTEM TESTIMONIALS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for universities, students, and employers
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            The institution issues. The student owns and shares. The employer independently verifies.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="relative rounded-3xl glass-panel p-8 space-y-6 border border-white/10 bg-slate-900/80 glass-panel-hover text-left flex flex-col justify-between"
            >
              {/* Top Quote Icon & Stars */}
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Quote className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* Quote Body */}
              <blockquote className="text-base sm:text-lg text-slate-200 font-medium italic leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 text-sm">
                    {t.name.split(" ")[1]?.charAt(0) || t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.title}</div>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  <Building className="h-3 w-3" />
                  <span>{t.badge}</span>
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
