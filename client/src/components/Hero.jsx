import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Scale, Globe, Shield, ArrowRight, Phone, Award, FileText, Sparkles, Lock, ArrowUpRight, CheckCircle2, Gavel } from 'lucide-react';
import { clientStats } from '../data/servicesData';

export default function Hero({ onOpenConsultation }) {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const badgeRef = useRef(null);
  const cardStackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro animations
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );

      gsap.fromTo(
        titleRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
      );

      if (cardStackRef.current) {
        gsap.fromTo(
          cardStackRef.current,
          { opacity: 0, scale: 0.95, y: 40 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.4 }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const quickLaunchDomains = [
    { label: "International Law", href: "#services", icon: Globe },
    { label: "NRI Property Defense", href: "#nri-section", icon: Lock },
    { label: "Contract Drafting", href: "#services", icon: FileText },
    { label: "FEMA & FDI Investment", href: "#global-network", icon: Scale },
    { label: "Family Law & Divorce", href: "#services", icon: Shield }
  ];

  return (
    <section ref={heroRef} className="relative min-h-[92vh] pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden flex flex-col justify-center items-center">
      {/* Background Lighting Beam & Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#D4AF37]/15 via-blue-600/5 to-transparent rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:36px_36px] opacity-25 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full space-y-12 sm:space-y-16">
        
        {/* 1. Centered Flagship Hero Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Floating Pill Badge */}
          <div ref={badgeRef} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-[#D4AF37]/40 shadow-xl shadow-black/50">
            <span className="w-2 h-2 rounded-full bg-[#F3D079] animate-ping shrink-0"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-gradient">
              INDIA <span className="text-slate-400">→</span> GLOBAL MARKETS
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-semibold text-slate-200">International Legal Processing Unit</span>
          </div>

          {/* Main Title & Editorial Subtitle */}
          <div ref={titleRef} className="space-y-4">
            <h1 className="font-cinzel text-3xl sm:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.15]">
              PRECISION LEGAL COUNSEL FOR <br />
              <span className="text-gold-gradient">GLOBAL OPPORTUNITIES</span>
            </h1>

            <p className="font-playfair text-xl sm:text-3xl text-slate-200 font-semibold italic">
              Dr. Karanam Rajesh Kumar
            </p>

            <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
              International Lawyer & Legal Expert • Empowering NRIs, global corporations, and investors with bulletproof legal protection across international jurisdictions.
            </p>
          </div>

          {/* Action Button Cluster */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <button
              onClick={onOpenConsultation}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-[#D4AF37]/20 hover:scale-105 transition-all flex items-center justify-center gap-2 border border-[#D4AF37]"
            >
              <span>Book 1-on-1 Legal Strategy</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#assessment"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm text-center hover:border-[#D4AF37]/40 hover:text-[#F3D079] transition-all"
            >
              60-Sec Legal Risk Checker
            </a>
          </div>

          {/* Interactive Quick-Launch Practice Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5">
            {quickLaunchDomains.map((dom, i) => {
              const Icon = dom.icon;
              return (
                <a
                  key={i}
                  href={dom.href}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 hover:border-[#D4AF37]/40 hover:text-[#F3D079] hover:bg-slate-900 transition-all flex items-center gap-2"
                >
                  <Icon className="w-3.5 h-3.5 text-[#F3D079]" />
                  <span>{dom.label}</span>
                </a>
              );
            })}
          </div>

        </div>

        {/* 2. Flagship Centerpiece: Floating Author Portrait Card Stack & Metrics Floating Orbs */}
        <div ref={cardStackRef} className="relative max-w-4xl mx-auto">
          
          {/* Main Card Container */}
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-[#0A1128] to-slate-900 border border-[#D4AF37]/40 p-6 sm:p-10 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Column inside card: Profile Info & Value Pillars */}
            <div className="md:col-span-7 space-y-6 order-2 md:order-1">
              <div className="space-y-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#F3D079] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#F3D079]" />
                  <span>Director | International Legal Processing Unit (ILPU)</span>
                </span>
                <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
                  Law • Business • Global Reach
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  "Helping businesses and NRIs understand the legal side of going global. Comprehensive representation in Indian courts & international arbitration centers."
                </p>
              </div>

              {/* Core Credentials Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                  <span className="block text-xs font-bold text-slate-200">50+ Global Markets</span>
                  <span className="block text-[10px] text-slate-400">USA, UAE, UK, EU</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <a
                  href="tel:+919573446403"
                  className="px-4 py-2.5 rounded-lg bg-gold-gradient text-slate-950 text-xs font-bold flex items-center gap-2 hover:brightness-110 shadow-md"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Direct Chambers: +91 95734 46403</span>
                </a>
              </div>
            </div>

            {/* Right Column inside card: Author Portrait Frame */}
            <div className="md:col-span-5 relative order-1 md:order-2">
              <div className="relative w-full aspect-[3/4] max-w-[280px] mx-auto rounded-2xl overflow-hidden border border-[#D4AF37]/50 shadow-2xl bg-slate-900 group">
                <img
                  src="/assets/dr-karanam-rajesh-kumar.png"
                  alt="Dr. Karanam Rajesh Kumar"
                  className="w-full h-full object-cover object-top filter contrast-[1.06] brightness-[1.04] saturate-[1.05] transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-transparent to-transparent opacity-70"></div>
                <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-lg bg-[#060B18]/90 backdrop-blur-md border border-[#D4AF37]/40 text-[10px] font-bold text-[#F3D079] text-center truncate">
                  Dr. Karanam Rajesh Kumar
                </div>
              </div>
            </div>

          </div>

          {/* Floating Metric Badge 2 (Bottom Right) */}
          <div className="hidden lg:flex items-center gap-3 p-3.5 rounded-2xl bg-[#0A1128]/95 backdrop-blur-xl border border-[#D4AF37]/40 shadow-2xl absolute -bottom-6 -right-10 animate-float" style={{ animationDelay: '2s' }}>
            <div className="w-10 h-10 rounded-xl bg-gold-gradient p-[1px]">
              <div className="w-full h-full bg-[#060B18] rounded-[11px] flex items-center justify-center font-cinzel text-xs font-bold text-[#F3D079]">
                99.4%
              </div>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-100">Success Rate</span>
              <span className="block text-[10px] text-slate-400">NRI Title & Contracts</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
