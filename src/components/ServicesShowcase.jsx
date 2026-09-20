import React, { useState } from 'react';
import { servicesData } from '../data/servicesData';
import { Globe, ShieldCheck, FileText, TrendingUp, HeartHandshake, ArrowRight, CheckCircle, Sparkles, LayoutGrid, SlidersHorizontal, Eye, Plane, Tag, FileCheck } from 'lucide-react';

const iconMap = {
  Globe: Globe,
  ShieldCheck: ShieldCheck,
  FileText: FileText,
  TrendingUp: TrendingUp,
  Plane: Plane,
  HeartHandshake: HeartHandshake,
};

const shortTitles = {
  "international-law-business": "01. International Law",
  "nri-property-protection": "02. NRI Property Protection",
  "contract-drafting": "03. Contract Drafting",
  "investment-opportunities": "04. Global Investments",
  "immigration-roadmap": "05. Immigration Roadmap",
  "life-after-divorce": "06. Family Law & Divorce"
};

export default function ServicesShowcase({ onOpenConsultation }) {
  const [activeTab, setActiveTab] = useState(servicesData[0].id);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'spotlight'

  const activeService = servicesData.find((s) => s.id === activeTab) || servicesData[0];

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-[#060B18]">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-bold text-gold-gradient uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#F3D079]" />
            <span>Core Practice Areas & Advisory</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-white">
            World-Class Legal Practice Domains
          </h2>
          <p className="text-slate-300 text-base font-light">
            Providing legal precision, cross-border protection, immigration roadmaps, and strategic clarity across international trade, real estate, contracts, foreign investment, and family law.
          </p>

          {/* View Mode Toggle Switch */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-gold-gradient text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>All 6 Services Grid</span>
              </button>

              <button
                onClick={() => setViewMode('spotlight')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'spotlight'
                    ? 'bg-gold-gradient text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Interactive Spotlight</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. ALL SERVICES GRID SHOWCASE (Self-contained, expanded cards) */}
        {viewMode === 'grid' && (
          <div className="space-y-12 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesData.map((service, idx) => {
                const Icon = iconMap[service.iconName] || Globe;
                return (
                  <div
                    key={service.id}
                    className="bg-navy-card rounded-2xl border border-slate-800 hover:border-[#D4AF37]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-[#D4AF37]/10"
                  >
                    {/* Card Image Banner */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-[#0A1128]/30 to-transparent"></div>
                      
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#060B18]/90 backdrop-blur-md border border-[#D4AF37]/40 text-[10px] font-bold text-[#F3D079] uppercase tracking-wider">
                        {service.badge}
                      </div>

                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#060B18]/90 backdrop-blur-md border border-emerald-500/40 text-[10px] font-bold text-emerald-400">
                        {service.priceIndia} / {service.priceInternational}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-gold-gradient p-[1px] shadow-md">
                          <div className="w-full h-full bg-[#060B18] rounded-[11px] flex items-center justify-center">
                            <Icon className="w-5 h-5 text-[#F3D079]" />
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-300 font-mono">ILPU 0{idx + 1}</span>
                      </div>
                    </div>

                    {/* Card Content - Complete Self-Contained Scope */}
                    <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="font-cinzel text-xl font-bold text-white group-hover:text-[#F3D079] transition-colors">
                          {service.title}
                        </h3>
                        <p className="font-playfair text-xs text-gold-gradient italic font-medium">
                          "{service.subtitle}"
                        </p>
                        <p className="text-xs text-slate-300 font-light leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Key Features Bullet List */}
                      <div className="space-y-2 pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F3D079] block">
                          Core Practice Offerings
                        </span>
                        <div className="space-y-1.5">
                          {service.features.map((feat, i) => (
                            <div key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
                              <CheckCircle className="w-3.5 h-3.5 text-[#F3D079] shrink-0 mt-0.5" />
                              <span className="leading-tight">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Deliverables Box */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <FileCheck className="w-3 h-3 text-[#F3D079]" />
                          <span>Key Deliverable</span>
                        </span>
                        <p className="text-[11px] text-slate-200 font-medium">
                          {service.deliverables[0]}
                        </p>
                      </div>

                      {/* Direct Booking Action Button (No Popup) */}
                      <div className="pt-2 border-t border-slate-800/80">
                        <button
                          onClick={onOpenConsultation}
                          className="w-full py-3 px-4 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-md border border-[#D4AF37]"
                        >
                          <span>Book Strategy Consultation</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. INTERACTIVE SPOTLIGHT VIEW */}
        {viewMode === 'spotlight' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Fully Wrapped 6-Column Grid Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {servicesData.map((service) => {
                const Icon = iconMap[service.iconName] || Globe;
                const isActive = activeTab === service.id;
                return (
                  <button
                    key={service.id}
                    onClick={() => setActiveTab(service.id)}
                    className={`p-3 rounded-xl font-medium text-xs text-left transition-all duration-300 border flex items-center justify-between ${
                      isActive
                        ? 'bg-gold-gradient text-slate-950 font-bold border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-102'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-slate-950' : 'text-[#F3D079]'}`} />
                      <span className="truncate text-[11px]">{shortTitles[service.id]}</span>
                    </div>
                    {isActive && <Eye className="w-3.5 h-3.5 shrink-0 text-slate-950" />}
                  </button>
                );
              })}
            </div>

            {/* Active Spotlight Card */}
            <div className="bg-navy-card rounded-2xl border border-[#D4AF37]/40 p-6 sm:p-10 shadow-2xl transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                {/* Details */}
                <div className="lg:col-span-7 space-y-6">
                  
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900 text-[#F3D079] border border-[#D4AF37]/30">
                      {activeService.badge}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      Strategy Fee: ₹499 + 18% GST / $5 USD
                    </span>
                  </div>

                  <div>
                    <h3 className="font-cinzel text-2xl sm:text-4xl font-bold text-white leading-tight">
                      {activeService.title}
                    </h3>
                    <p className="font-playfair text-lg text-gold-gradient italic mt-1 font-semibold">
                      "{activeService.subtitle}"
                    </p>
                  </div>

                  <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
                    {activeService.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3D079]">Core Practice Offerings</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeService.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
                          <CheckCircle className="w-4 h-4 text-[#F3D079] shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-200 font-medium leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Single Direct Booking Action Button */}
                  <div className="pt-4">
                    <button
                      onClick={onOpenConsultation}
                      className="px-8 py-4 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:scale-105 transition-all flex items-center gap-2 border border-[#D4AF37]"
                    >
                      <span>Book Legal Strategy Consultation (₹499 + GST / $5 USD)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                {/* Image Graphic */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl group">
                    <img
                      src={activeService.image}
                      alt={activeService.title}
                      className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-transparent to-transparent opacity-60"></div>
                    
                    <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-950/90 backdrop-blur-md rounded-lg border border-[#D4AF37]/30 text-xs flex items-center justify-between">
                      <span className="text-slate-300 font-medium">{activeService.tagline}</span>
                      <span className="text-gold-gradient font-bold">ILPU Certified</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
