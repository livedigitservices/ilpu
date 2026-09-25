import React, { useState } from 'react';
import { Shield, Home, FileCheck, Gavel, Users, Lock, ArrowRight, CheckCircle2, AlertTriangle, Sparkles, Building, PhoneCall, Award, FileText } from 'lucide-react';

export default function NRISection({ onOpenConsultation }) {
  const [activeTab, setActiveTab] = useState('pillars');
  const [selectedRiskScenario, setSelectedRiskScenario] = useState(null);

  const nriPillars = [
    {
      step: "01",
      icon: Home,
      title: "Property Purchase & Legal Due Diligence",
      tag: "Pre-Purchase Audit",
      desc: "Verifying physical land boundaries, builder credentials, municipal approvals, and RERA compliance before you transfer funds.",
    },
    {
      step: "02",
      icon: FileCheck,
      title: "Title Verification & Risk Assessment",
      tag: "Title Defense",
      desc: "Comprehensive 30+ year historical encumbrance search to eliminate risks of revenue litigation or illegal mortgages.",
    },
    {
      step: "03",
      icon: Gavel,
      title: "NRI Inheritance & Succession Deeds",
      tag: "Estate Planning",
      desc: "Navigating partition deeds, legal heir certificates, and probate execution across Indian Revenue Courts seamlessly.",
    },
    {
      step: "04",
      icon: Shield,
      title: "Dispute Resolution & Encroachment Defense",
      tag: "Litigation Shield",
      desc: "Aggressive defense against illegal encroachment, fraudulent power-of-attorneys, and tenant land grabbing.",
    },
    {
      step: "05",
      icon: Users,
      title: "End-to-End Assistance & Embassy POA",
      tag: "Zero Travel Legal",
      desc: "Drafting Embassy-certified Power of Attorney (POA) so your legal affairs in India are handled without overseas travel.",
    }
  ];

  const riskScenarios = [
    {
      id: "vacant-land",
      title: "Vacant Ancestral Land / Plot",
      risk: "HIGH RISK",
      color: "border-red-500/50 bg-red-500/10 text-red-400",
      vulnerability: "Highly vulnerable to adverse possession, fake title deeds, and illegal boundary encroachment if unattended for over 12 months.",
      action: "Requires 30-Year Revenue Survey Check + Boundary Fence Legal Notice + Special POA Execution."
    },
    {
      id: "builder-delay",
      title: "Under-Construction Builder Flat",
      risk: "MEDIUM RISK",
      color: "border-amber-500/50 bg-amber-500/10 text-amber-400",
      vulnerability: "Risk of delayed possession, unapproved floor plans, RERA non-compliance, or developer insolvency.",
      action: "Requires RERA Tribunal Notice + Builder Agreement Audit + Compensation Filing."
    },
    {
      id: "tenant-dispute",
      title: "Rented Commercial / Residential Property",
      risk: "MEDIUM RISK",
      color: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
      vulnerability: "Risk of tenants refusing eviction, forging lease deeds, or claiming long-term occupancy rights.",
      action: "Requires Registered Eviction Notice + Rent Agreement Legal Audit + Revenue Court Summary Petition."
    },
    {
      id: "joint-family",
      title: "Joint Family Property Partition",
      risk: "HIGH RISK",
      color: "border-red-500/50 bg-red-500/10 text-red-400",
      vulnerability: "Risk of local relatives selling joint ancestral property without NRI co-owner consent or forged partition deeds.",
      action: "Requires Partition Suit Filing + Stay Order Application + Revenue Record Mutation."
    }
  ];

  return (
    <section id="nri-section" className="py-24 relative bg-[#060B18] border-t border-slate-800/80 overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-bold text-gold-gradient uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5 text-[#F3D079]" />
            <span>Specialized Non-Resident Legal Protection</span>
          </div>
          
          <h2 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            NRI Property Protection & Legal Shield
          </h2>

          <p className="text-slate-300 text-base font-light leading-relaxed">
            "Your Property • Our Priority" — Complete legal safeguarding for Non-Resident Indians holding real estate in India. Eliminate risks of title fraud, illegal encroachment, and inheritance disputes without overseas travel.
          </p>

          {/* Highlights Badges */}
   
        </div>

        {/* Hero Visual & Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Premium Photography Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl group">
              <img
                src="/assets/nri-property-real.jpg"
                alt="NRI Luxury Property Legal Defense"
                className="w-full h-[520px] object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-[#060B18]/30 to-transparent"></div>
              
              {/* Top Floating Badge */}
              <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-xl bg-[#060B18]/90 backdrop-blur-md border border-[#D4AF37]/40 text-xs font-bold text-[#F3D079] flex items-center gap-2 shadow-lg">
                <Award className="w-4 h-4 text-[#F3D079]" />
                <span>Consulate & Revenue Court Certified</span>
              </div>

              {/* Bottom Quote Banner */}
              <div className="absolute bottom-5 left-5 right-5 z-20 p-5 rounded-xl bg-[#0A1128]/95 backdrop-blur-xl border border-[#D4AF37]/30 space-y-2 shadow-xl">
                <span className="text-[10px] font-bold text-gold-gradient uppercase tracking-widest block">
                  SAFE INVESTMENTS • SECURE OWNERSHIP • GLOBAL SUPPORT
                </span>
                <p className="font-playfair text-xs sm:text-sm italic text-slate-200">
                  "Protecting Your International Investments in India, Today and Tomorrow."
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[11px]">
                  <span className="text-slate-400">Dr. Karanam Rajesh Kumar</span>
                  <span className="text-gold-gradient font-bold">+91 95734 46403</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 5 Core Protection Pillars List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-cinzel text-xl font-bold text-white">
                5-Pillar Protection Framework for NRIs
              </h3>
              <span className="text-xs font-semibold text-[#F3D079]">ILPU Protocol</span>
            </div>

            <div className="space-y-3">
              {nriPillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-navy-card border border-slate-800 hover:border-[#D4AF37]/40 transition-all duration-300 group hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gold-gradient p-[1px] shrink-0">
                        <div className="w-full h-full bg-[#060B18] rounded-[11px] flex items-center justify-center font-cinzel text-xs font-bold text-[#F3D079]">
                          {pillar.step}
                        </div>
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-cinzel text-base font-bold text-slate-100 group-hover:text-[#F3D079] transition-colors">
                            {pillar.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-900 text-[#F3D079] border border-slate-800">
                            {pillar.tag}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 font-light leading-relaxed">
                          {pillar.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Interactive NRI Risk Assessment Tool Box */}
        <div className="bg-navy-card rounded-2xl border border-[#D4AF37]/30 p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-gold-gradient uppercase tracking-wider">
                  Interactive Risk Self-Checker
                </span>
              </div>
              <h3 className="font-cinzel text-2xl font-bold text-white mt-1">
                Select Your Property Scenario in India
              </h3>
            </div>
            <span className="text-xs text-slate-400">Click any scenario to see vulnerability & defense action</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {riskScenarios.map((scen) => {
              const isSelected = selectedRiskScenario === scen.id;
              return (
                <button
                  key={scen.id}
                  onClick={() => setSelectedRiskScenario(isSelected ? null : scen.id)}
                  className={`text-left p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-gold-glass border-[#D4AF37] scale-102 shadow-lg shadow-[#D4AF37]/15'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${scen.color}`}>
                      {scen.risk}
                    </span>
                    <h4 className="font-cinzel text-sm font-bold text-white">{scen.title}</h4>
                  </div>
                  <span className="text-[11px] text-[#F3D079] font-medium underline">
                    {isSelected ? "Hide Legal Action" : "Analyze Risk →"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Risk Scenario Details Box */}
          {selectedRiskScenario && (
            <div className="p-6 rounded-xl bg-slate-950 border border-[#D4AF37]/40 space-y-4 animate-fadeIn">
              {(() => {
                const activeScen = riskScenarios.find((s) => s.id === selectedRiskScenario);
                return (
                  <>
                    <div className="flex items-center justify-between">
                      <h4 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[#F3D079]" />
                        <span>Legal Analysis: {activeScen.title}</span>
                      </h4>
                      <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${activeScen.color}`}>
                        {activeScen.risk}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-1">
                        <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">
                          Primary Vulnerability
                        </span>
                        <p className="text-xs text-slate-300 font-light leading-relaxed">
                          {activeScen.vulnerability}
                        </p>
                      </div>

                      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-1">
                        <span className="text-xs font-bold text-[#F3D079] uppercase tracking-wider block">
                          Recommended Protection Action
                        </span>
                        <p className="text-xs text-slate-300 font-light leading-relaxed">
                          {activeScen.action}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={onOpenConsultation}
                        className="px-6 py-2.5 rounded-lg bg-gold-gradient text-slate-950 text-xs font-bold hover:brightness-110 flex items-center gap-1.5 shadow-md"
                      >
                        <span>Schedule Priority Strategy for this Scenario</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
