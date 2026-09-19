import React from 'react';
import { Scale, Phone, MapPin, Mail, ArrowUp, Globe, Shield } from 'lucide-react';

export default function Footer({ onOpenConsultation }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#040813] text-slate-400 text-xs border-t border-slate-800/80 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient p-[1px]">
                <div className="w-full h-full bg-[#060B18] rounded-[11px] flex items-center justify-center">
                  <Scale className="w-5 h-5 text-[#F3D079]" />
                </div>
              </div>
              <div>
                <span className="font-cinzel text-xl font-bold tracking-wider text-gold-gradient block">
                  ILPU
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  International Legal Processing Unit
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs font-light leading-relaxed">
              Led by **Dr. Karanam Rajesh Kumar**, ILPU provides world-class legal counsel, cross-border due diligence, NRI property defense, and commercial contract drafting.
            </p>

            <div className="pt-2">
              <span className="block text-[11px] font-bold text-slate-200 uppercase tracking-widest">
                LAW • BUSINESS • GLOBAL OPPORTUNITIES
              </span>
              <span className="text-[10px] text-slate-400 italic">
                "Helping businesses understand the legal side of going global."
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">
              Practice Domains
            </h4>
            <ul className="space-y-2">
              <li><a href="#services" className="hover:text-[#F3D079] transition-colors">International Law</a></li>
              <li><a href="#nri-section" className="hover:text-[#F3D079] transition-colors">NRI Property Defense</a></li>
              <li><a href="#services" className="hover:text-[#F3D079] transition-colors">Contract Drafting</a></li>
              <li><a href="#global-network" className="hover:text-[#F3D079] transition-colors">FEMA & FDI Investment</a></li>
              <li><a href="#services" className="hover:text-[#F3D079] transition-colors">Matrimonial & Family Law</a></li>
            </ul>
          </div>

          {/* Office Contact */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">
              Direct Chambers Contact
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-[#F3D079] shrink-0" />
                <a href="tel:+919573446403" className="font-semibold hover:text-[#F3D079]">
                  +91 95734 46403
                </a>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-[#F3D079] shrink-0 mt-0.5" />
                <span>Hyderabad, Telangana, India (Supreme Court & High Court Bar Chambers)</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Globe className="w-4 h-4 text-[#F3D079] shrink-0" />
                <span>Global Practice Network: India, USA, UAE, UK, EU</span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="lg:col-span-3 space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            <h4 className="font-cinzel text-sm font-bold text-white">
              Schedule Legal Consultation
            </h4>
            <p className="text-[11px] text-slate-300">
              Get immediate, confidential legal strategy directly from Dr. Karanam Rajesh Kumar.
            </p>
            <button
              onClick={onOpenConsultation}
              className="w-full py-3 rounded-lg bg-gold-gradient text-slate-950 font-bold text-xs shadow-md hover:brightness-110 transition-all"
            >
              Book 1-on-1 Strategy Call
            </button>
          </div>

        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-8 border-t border-slate-800/60 text-[10px] text-slate-400 space-y-2 leading-relaxed">
          <p>
            <strong className="text-slate-300">Bar Council Disclaimer:</strong> As per the rules of the Bar Council of India, advocates and legal firms are restricted from soliciting work or advertising in any public manner. This website is intended solely to provide general informational material about Dr. Karanam Rajesh Kumar and the International Legal Processing Unit (ILPU).
          </p>
          <p>
            By exploring this website, the user acknowledges that there has been no advertisement, personal communication, solicitation, or invitation of any kind. All information provided herein is for informational purposes only.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} International Legal Processing Unit (ILPU). All Rights Reserved.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-[#F3D079] hover:underline"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

      </div>
    </footer>
  );
}
