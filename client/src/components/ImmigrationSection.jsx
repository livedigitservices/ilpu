import React, { useState, useEffect } from 'react';
import { Plane, Compass, CheckCircle2, ShieldCheck, ArrowRight, Globe, FileText, Award, Tag } from 'lucide-react';
import { getPublicPlanApi, getPublicGstConfigApi } from '../services/api';

export default function ImmigrationSection({ onOpenConsultation }) {
  const [pricing, setPricing] = useState({
    indiaDisplay: '₹499 + 18% GST',
    intlDisplay: '$5 USD',
    ctaText: 'Get Your Personalised 9-Step Roadmap (₹499 / $5 USD)'
  });

  useEffect(() => {
    Promise.all([
      getPublicPlanApi('immigration-roadmap').catch(() => null),
      getPublicGstConfigApi().catch(() => null)
    ]).then(([plan, gst]) => {
      if (plan) {
        const indiaPrice = plan.priceIndia || 499;
        const intlPrice = plan.priceInternational || 5;
        const rate = gst?.gstEnabled ? (gst.defaultRate ?? 18) : 0;
        setPricing({
          indiaDisplay: rate > 0 ? `₹${indiaPrice} + ${rate}% GST` : `₹${indiaPrice}`,
          intlDisplay: `$${intlPrice} USD`,
          ctaText: `Get Your Personalised 9-Step Roadmap (₹${indiaPrice} / $${intlPrice} USD)`
        });
      }
    });
  }, []);

  const roadmapSteps = [
    { num: "1", title: "Goal", desc: "Define your personal, professional or family objective." },
    { num: "2", title: "Country", desc: "Select the optimal jurisdiction (USA, Canada, UK, UAE, EU, Australia)." },
    { num: "3", title: "Category", desc: "Choose appropriate visa (Study, Work, Business, Family, Investor)." },
    { num: "4", title: "Eligibility", desc: "Verify statutory legal & document requirements." },
    { num: "5", title: "Initial Status", desc: "Submit petition & secure entry / initial status." },
    { num: "6", title: "Compliance", desc: "Maintain visa conditions & employment/tax legalities." },
    { num: "7", title: "Extension", desc: "Execute timely extensions & status transitions." },
    { num: "8", title: "Long-Term PR", desc: "Secure Permanent Residency & long-term investor rights." },
    { num: "9", title: "Citizenship", desc: "Execute passport & naturalization applications." }
  ];

  const keyQuestions = [
    "What is my exact legal purpose?",
    "Which visa category fits best?",
    "What certified documents do I need?",
    "What compliance conditions apply?",
    "What happens after my current status?",
    "What are my long-term PR & citizenship options?"
  ];

  return (
    <section id="immigration" className="py-24 relative bg-[#060B18] border-t border-slate-800 overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-400 uppercase tracking-widest">
            <Plane className="w-3.5 h-3.5" />
            <span>New Practice Area: Global Mobility</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            BUILD YOUR IMMIGRATION ROADMAP
          </h2>

          <p className="font-playfair text-lg sm:text-xl text-gold-gradient italic font-semibold">
            "Plan Today. Progress Tomorrow. A Global Future Awaits."
          </p>

          <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
            Don't plan only for initial entry — plan for the full immigration journey. Dr. Karanam Rajesh Kumar provides strategic legal guidance for students, professionals, investors, and families moving from India to the world.
          </p>

          {/* Pricing Highlight Pill */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900 border border-[#D4AF37]/40 text-xs font-bold shadow-lg">
            <Tag className="w-4 h-4 text-[#F3D079]" />
            <span className="text-slate-200">Roadmap Strategy Fee:</span>
            <span className="text-[#F3D079]">{pricing.indiaDisplay} (India)</span>
            <span className="text-slate-500">|</span>
            <span className="text-[#F3D079]">{pricing.intlDisplay} (Other Countries)</span>
          </div>
        </div>

        {/* Banner Graphic & Interactive Step Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Graphic Banner Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl group bg-slate-900">
              <img
                src="/assets/immigration-roadmap-banner.jpg"
                alt="Build Your Immigration Roadmap - Dr. Karanam Rajesh Kumar"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-[#D4AF37]/30 text-xs text-slate-200 font-medium">
                Comprehensive 9-Stage Jurisdictional Guidance • Supreme Court & Global Treaties
              </div>
            </div>
          </div>

          {/* Right: 9 Steps Interactive Map */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                <span>The 9-Step Personalised Legal Blueprint</span>
              </span>
              <h3 className="font-cinzel text-2xl font-bold text-white">
                From Initial Choice to Permanent Global Belonging
              </h3>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {roadmapSteps.map((step) => (
                <div
                  key={step.num}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center font-mono border border-cyan-500/40">
                      {step.num}
                    </span>
                    <span className="font-cinzel font-bold text-xs text-white group-hover:text-cyan-400 transition-colors">
                      {step.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Questions Answered Pill */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F3D079] block">
                Critical Questions Answered in Your Roadmap
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {keyQuestions.map((q, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs sm:text-sm shadow-xl hover:brightness-110 flex items-center justify-center gap-2 border border-[#D4AF37]"
              >
                <span>{pricing.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:+919573446403"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm text-center hover:border-[#D4AF37]/40 hover:text-[#F3D079]"
              >
                Call Chambers: +91 95734 46403
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
