import React, { useState } from 'react';
import { Globe, Compass, Building, ShieldCheck, MapPin, ArrowUpRight, Scale } from 'lucide-react';

const globalHubs = [
  {
    id: "india",
    region: "India (Headquarters)",
    city: "Hyderabad & Supreme Court Bar, New Delhi",
    focus: "National & Supreme Court Litigation, NRI Real Estate, RBI/FEMA Regulatory Compliance",
    details: "Direct filing in Supreme Court of India, Telangana & High Courts nationwide. Complete legal management for domestic and foreign entities."
  },
  {
    id: "usa",
    region: "North America (USA & Canada)",
    city: "New York • California • Toronto",
    focus: "Cross-Border FDI, Tech Transfer Contracts, NRI Property Protection & Inheritance Deeds",
    details: "Connecting Indian businesses with US commercial law frameworks, Delaware entity setups, and protecting US-based NRI assets in India."
  },
  {
    id: "uae",
    region: "Middle East & GCC (UAE)",
    city: "Dubai • Abu Dhabi",
    focus: "Import-Export Trade Agreements, DIFC Courts Arbitration, Commercial Maritime Law",
    details: "Assisting UAE-based entrepreneurs, shipping logistics companies, and NRIs with multi-jurisdictional contracts and dispute resolution."
  },
  {
    id: "uk-eu",
    region: "United Kingdom & Europe",
    city: "London • Frankfurt • Singapore",
    focus: "LCIA Arbitration, International Tax Treaties, Overseas Direct Investment (ODI)",
    details: "Aligning cross-border contracts with English Common Law and European commercial regulations for international expansion."
  }
];

export default function GlobalNetwork({ onOpenConsultation }) {
  const [selectedHub, setSelectedHub] = useState(globalHubs[0].id);
  const activeHub = globalHubs.find((h) => h.id === selectedHub) || globalHubs[0];

  return (
    <section id="global-network" className="py-16 sm:py-24 relative bg-[#0A1128]/80 border-t border-slate-800 overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/3 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-bold text-gold-gradient uppercase tracking-widest">
            <Globe className="w-3.5 h-3.5 text-[#F3D079]" />
            <span>Cross-Border Jurisdictional Reach</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-5xl font-extrabold text-white">
            India → Global Markets Network
          </h2>
          <p className="text-slate-300 text-xs sm:text-base font-light">
            "PEOPLE • BUSINESS • LAW WITHOUT BORDERS" — Delivering seamless international legal counsel across major trade corridors.
          </p>
        </div>

        {/* Global Network Visual Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* Hub Selector */}
          <div className="lg:col-span-5 space-y-2.5 sm:space-y-3">
            {globalHubs.map((hub) => {
              const isActive = selectedHub === hub.id;
              return (
                <button
                  key={hub.id}
                  onClick={() => setSelectedHub(hub.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-xl transition-all duration-300 border flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-gold-glass border-[#D4AF37] shadow-lg shadow-[#D4AF37]/15 sm:translate-x-2'
                      : 'bg-navy-card border-slate-800/80 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="space-y-0.5 truncate">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block truncate">
                      {hub.city}
                    </span>
                    <h4 className={`font-cinzel text-sm sm:text-base font-bold truncate ${isActive ? 'text-[#F3D079]' : 'text-slate-200'}`}>
                      {hub.region}
                    </h4>
                  </div>
                  <MapPin className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isActive ? 'text-[#F3D079]' : 'text-slate-500'}`} />
                </button>
              );
            })}
          </div>

          {/* Active Hub Deep-Dive Details */}
          <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-[#D4AF37]/30 p-5 sm:p-8 shadow-2xl space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] sm:text-xs font-bold text-gold-gradient uppercase tracking-widest">
                  Selected Jurisdiction
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-0.5">
                  {activeHub.region}
                </h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#060B18] border border-[#D4AF37]/30 text-xs font-semibold text-[#F3D079]">
                {activeHub.city}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Primary Legal Focus Areas
                </h4>
                <p className="text-xs sm:text-sm font-semibold text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed">
                  {activeHub.focus}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Jurisdictional Operations & Network
                </h4>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {activeHub.details}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Scale className="w-4 h-4 text-[#F3D079] shrink-0" />
                <span>Multijurisdictional Bar Compliance</span>
              </div>
              <button
                onClick={onOpenConsultation}
                className="px-5 py-2.5 rounded-lg bg-gold-gradient text-slate-950 text-xs font-bold hover:brightness-110 flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Schedule Regional Counsel Call</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
