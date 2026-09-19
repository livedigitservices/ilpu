import React from 'react';
import { Scale, Globe, ShieldCheck, CheckCircle2, Award, Building2, FileCheck, Compass, Sparkles } from 'lucide-react';

export default function AboutExpert() {
  const credentials = [
    { title: 'Supreme Court & High Court Practice', desc: 'Representing clients across Indian judicial bodies and international arbitration hubs.' },
    { title: 'International Legal Processing Unit (ILPU)', desc: 'Director & Lead Strategist for cross-border documentation, compliance & governance.' },
    { title: 'NRI Property & Investment Defense', desc: 'Specialized in protecting non-resident assets, title verification & inheritance claims.' },
    { title: 'Cross-Border Commercial Trade Law', desc: 'Advising import-export enterprises, logistics, and foreign direct investments (FDI).' }
  ];

  return (
    <section id="about" className="py-16 sm:py-24 relative bg-[#0A1128]/60 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Author Enhanced Portrait & Authority Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#0A1128] to-[#060B18] border border-[#D4AF37]/40 p-5 sm:p-6 shadow-2xl space-y-5 overflow-hidden">
              
              {/* Outer Glow Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none"></div>

              {/* Author Portrait Image Frame with Aspect 3:4 */}
              <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-xl group">
                <img
                  src="/assets/dr-karanam-rajesh-kumar.png"
                  alt="Dr. Karanam Rajesh Kumar - Author & International Legal Expert"
                  className="w-full h-full object-cover object-center filter contrast-[1.06] brightness-[1.04] saturate-[1.05] transform group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Vignette Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-transparent to-transparent opacity-80"></div>
                
                {/* Bottom Tag */}
                <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-[#060B18]/90 backdrop-blur-md border border-[#D4AF37]/40 text-xs font-bold text-[#F3D079] flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F3D079]" />
                    <span>Dr. Karanam Rajesh Kumar</span>
                  </div>
                  <span className="text-[10px] text-slate-300 font-mono">Supreme Court Advocate</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#F3D079]">
                  FOUNDER & DIRECTOR — ILPU
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
                  Dr. Karanam Rajesh Kumar
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  International Lawyer & International Law Expert
                </p>
              </div>

              <blockquote className="italic text-xs sm:text-sm text-slate-300 border-l-2 border-[#D4AF37] pl-3.5 py-1 leading-relaxed">
                "Global trade and cross-border investments require proactive legal frameworks. Our goal at ILPU is to bridge judicial systems so that our clients succeed seamlessly everywhere."
              </blockquote>

              <div className="pt-3 border-t border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#F3D079] shrink-0" />
                  <span>Licensed International Legal Practitioner</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#F3D079] shrink-0" />
                  <span>Admitted to Supreme Court Bar & International Panels</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#F3D079] shrink-0" />
                  <span>Hyderabad, India Head Office with Global Partner Chambers</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Detailed Narrative & Core Focus */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-2 sm:space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-gold-gradient">
                EXCELLENCE IN CROSS-BORDER JURISDICTION
              </span>
              <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-white">
                Bridging Indian Law & Global Markets
              </h2>
              <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
                Under the leadership of <strong className="text-white">Dr. Karanam Rajesh Kumar</strong>, the <strong className="text-white">International Legal Processing Unit (ILPU)</strong> has established itself as a beacon of legal clarity for international corporate clients, Non-Resident Indians (NRIs), and global investors.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-1">
              {credentials.map((cred, idx) => (
                <div
                  key={idx}
                  className="bg-navy-card p-4 sm:p-5 rounded-xl border border-slate-800 hover:border-[#D4AF37]/30 transition-all duration-300 space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#F3D079] shrink-0" />
                    <h4 className="font-cinzel text-xs sm:text-sm font-bold text-slate-100">{cred.title}</h4>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-light leading-relaxed">{cred.desc}</p>
                </div>
              ))}
            </div>

            {/* Core Values / Vision Chips */}
            <div className="p-4 sm:p-6 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#F3D079] shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-slate-200">Global Reach</span>
                  <span className="block text-[11px] text-slate-400">USA • UK • UAE • EU • Asia-Pacific</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-[#F3D079] shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-slate-200">Corporate & Individual</span>
                  <span className="block text-[11px] text-slate-400">Tailored Advisory for every scale</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
