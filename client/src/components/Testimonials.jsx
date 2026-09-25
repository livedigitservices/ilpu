import React from 'react';
import { Star, Quote, ShieldCheck, Building2, UserCheck } from 'lucide-react';

const testimonials = [
  {
    name: "Vikramaditya S.",
    role: "NRI Tech Executive (Silicon Valley, USA)",
    domain: "NRI Property Protection",
    text: "Dr. Karanam Rajesh Kumar saved our ancestral land in Hyderabad from illegal encroachers while I was living in San Jose. His team handled the Embassy Power of Attorney, title search, and court litigation seamlessly. Truly an international legal safeguard!",
    rating: 5
  },
  {
    name: "Dr. Ananya M.",
    role: "Managing Director, Global Logistics (Dubai, UAE)",
    domain: "International Contract Drafting",
    text: "Drafting cross-border distribution agreements across India, the UAE, and Singapore required absolute precision. Dr. Rajesh's mastery over international commercial law and arbitration clauses protected our enterprise from millions in potential liability.",
    rating: 5
  },
  {
    name: "Siddharth & Priya K.",
    role: "Cross-Border Founders (London, UK)",
    domain: "International Investment & FDI",
    text: "Navigating RBI guidelines, FEMA compliance, and foreign capital repatriation used to be a nightmare until we consulted ILPU. Dr. Rajesh Kumar provided strategic clarity that allowed us to scale easily.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 relative bg-[#0A1128]/40 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-bold text-gold-gradient uppercase tracking-widest">
            <UserCheck className="w-3.5 h-3.5 text-[#F3D079]" />
            <span>Trusted Worldwide</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-white">
            Client Success Stories
          </h2>
          <p className="text-slate-300 text-base font-light">
            Hear from Non-Resident Indians, international corporate leaders, and cross-border investors who rely on Dr. Karanam Rajesh Kumar.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-navy-card rounded-2xl border border-slate-800 p-8 hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col justify-between space-y-6 relative group"
            >
              <Quote className="w-8 h-8 text-[#D4AF37]/30 absolute top-6 right-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F3D079] text-[#F3D079]" />
                  ))}
                </div>
                <span className="inline-block px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-slate-900 text-[#F3D079] border border-slate-800">
                  {t.domain}
                </span>
                <p className="text-slate-300 text-sm font-light leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <h4 className="font-cinzel text-base font-bold text-white">{t.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
