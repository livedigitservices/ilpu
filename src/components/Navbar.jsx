import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, ArrowUpRight, Scale, ShieldCheck } from 'lucide-react';

export default function Navbar({ onOpenConsultation }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About Dr. Rajesh', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'NRI Protection', href: '#nri-section' },
    { name: 'Global Network', href: '#global-network' },
    { name: 'Assessment', href: '#assessment' },
    { name: 'FAQs', href: '#faq' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-3 sm:px-6 py-3">
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-500 ${
          scrolled
            ? 'bg-[#060B18]/90 backdrop-blur-2xl border border-[#D4AF37]/30 shadow-2xl shadow-black/80 px-4 sm:px-6 py-3'
            : 'bg-[#0A1128]/60 backdrop-blur-md border border-slate-800/80 px-4 sm:px-6 py-4'
        }`}
      >
        <div className="flex items-center justify-between">
          
          {/* 1. Brand Logo & Authority Badge */}
          <a href="#" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient p-[1.5px] shadow-lg shadow-[#D4AF37]/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#060B18] rounded-[10.5px] flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#F3D079]" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-lg font-bold tracking-widest text-gold-gradient leading-none">
                  ILPU
                </span>
                <span className="hidden xl:inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#F3D079] border border-[#D4AF37]/30 rounded-md">
                  Global Reach
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5">
                International Legal Processing Unit
              </span>
            </div>
          </a>

          {/* 2. Desktop Navigation Center Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-slate-950/70 p-1.5 rounded-full border border-slate-800/80">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-[#F3D079] hover:bg-slate-900 rounded-full transition-all duration-200 whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* 3. Action CTAs */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <a
              href="tel:+919573446403"
              className="flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-[#F3D079] bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800 hover:border-[#D4AF37]/40 transition-all duration-300 h-10"
            >
              <Phone className="w-3.5 h-3.5 text-[#F3D079]" />
              <span className="font-mono text-xs">+91 95734 46403</span>
            </a>

            <button
              onClick={onOpenConsultation}
              className="px-4 py-2 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs shadow-lg shadow-[#D4AF37]/20 hover:scale-105 transition-all duration-300 flex items-center gap-1.5 h-10 border border-[#D4AF37]"
            >
              <span>Book Strategy Call</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4. Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenConsultation}
              className="md:hidden px-3 py-1.5 text-xs font-bold rounded-lg bg-gold-gradient text-slate-950"
            >
              Consult
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto bg-[#0A1128]/95 backdrop-blur-2xl border border-[#D4AF37]/30 rounded-2xl p-5 mt-2 space-y-3 shadow-2xl animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-200 hover:text-[#F3D079] border-b border-slate-800/60"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="tel:+919573446403"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-[#F3D079]" />
              <span>Call +91 95734 46403</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs shadow-md"
            >
              Book 1-on-1 Legal Strategy Call
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
