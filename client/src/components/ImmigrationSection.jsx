import React from 'react';
import { Plane, Compass, CheckCircle2, ShieldCheck, ArrowRight, Globe, FileText, Award, Tag } from 'lucide-react';

export default function ImmigrationSection({ onOpenConsultation }) {
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
            <span className="text-[#F3D079]">₹499 + 18% GST (India)</span>
            <span className="text-slate-500">|</span>
            <span className="text-[#F3D079]">$5 USD (Other Countries)</span>
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-transparent to-transparent opacity-60"></div>
              
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/90 backdrop-blur-md border border-[#D4AF37]/30 space-y-1">
                <span className="text-[10px] font-bold text-gold-gradient uppercase tracking-widest block">
                  INFORMED DECISIONS • STRONGER PATHWAYS • A GLOBAL TOMORROW
                </span>
                <p className="text-xs text-slate-200 font-medium">
                  ILPU Global Mobility & Emigration Legal Processing Unit
                </p>
              </div>
            </div>
          </div>

          {/* Right: 9-Step Interactive Journey Grid */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#F3D079]" />
                <span>The 9-Step Immigration Journey</span>
              </h3>
              <span className="text-xs font-semibold text-cyan-400">Step-by-Step Legal Protocol</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {roadmapSteps.map((s) => (
                <div
                  key={s.num}
                  className="p-3.5 rounded-xl bg-navy-card border border-slate-800 hover:border-[#D4AF37]/40 transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-gold-gradient text-slate-950 font-bold text-xs flex items-center justify-center">
                      {s.num}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">Phase 0{s.num}</span>
                  </div>
                  <h4 className="font-cinzel text-xs font-bold text-white group-hover:text-[#F3D079] transition-colors">
                    {s.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-light leading-tight">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Key Planning Questions Checklist */}
            <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3D079] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Key Planning Questions Resolved in Consultation</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {keyQuestions.map((q, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F3D079]"></span>
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
                <span>Get Your Personalised 9-Step Roadmap (₹499 / $5 USD)</span>
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
