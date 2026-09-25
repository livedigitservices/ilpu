import React from 'react';
import { X, CheckCircle, ArrowRight, ShieldCheck, FileCheck, Phone, Tag, Sparkles } from 'lucide-react';

export default function ServiceDetailModal({ service, onClose, onOpenConsultation }) {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0A1128] border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900 text-[#F3D079] border border-[#D4AF37]/30">
              {service.badge}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              Strategy Fee: ₹499 + 18% GST (India) / $5 USD (International)
            </span>
          </div>

          <div>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
              {service.title}
            </h3>
            <p className="font-playfair text-base text-gold-gradient italic mt-1 font-semibold">
              "{service.subtitle}"
            </p>
          </div>

          {/* Image preview banner */}
          <div className="rounded-xl overflow-hidden border border-slate-800 max-h-64 relative group">
            <img src={service.image} alt={service.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-950/90 backdrop-blur-md rounded-lg border border-[#D4AF37]/30 text-xs flex items-center justify-between">
              <span className="text-slate-300 font-medium">{service.tagline}</span>
              <span className="text-gold-gradient font-bold">ILPU Certified</span>
            </div>
          </div>

          <p className="text-sm text-slate-300 font-light leading-relaxed">
            {service.description}
          </p>

          {/* Core Legal Offerings Checklist */}
          <div className="space-y-3 bg-slate-900/90 p-5 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3D079] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Core Practice Scope & Legal Offerings</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <CheckCircle className="w-4 h-4 text-[#F3D079] shrink-0 mt-0.5" />
                  <span className="leading-tight">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Deliverables */}
          <div className="space-y-3 bg-slate-950 p-5 rounded-xl border border-[#D4AF37]/30">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-gradient flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              <span>Official Deliverables & Client Documentation</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F3D079] shrink-0 mt-1.5"></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {service.highlights.map((h, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <span className="block text-xs font-bold text-slate-200">{h.title}</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">{h.desc}</span>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <a
              href="tel:+919573446403"
              className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white"
            >
              <Phone className="w-3.5 h-3.5 text-[#F3D079]" />
              <span>Direct Phone: +91 95734 46403</span>
            </a>
            <button
              onClick={() => {
                onClose();
                onOpenConsultation();
              }}
              className="px-6 py-3.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs sm:text-sm shadow-lg hover:brightness-110 flex items-center gap-2 border border-[#D4AF37]"
            >
              <span>Book Strategy Consultation (₹499 + GST / $5 USD)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
