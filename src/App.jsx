import React, { useEffect, useState } from 'react';
import { initSmoothScroll } from './utils/lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutExpert from './components/AboutExpert';
import ServicesShowcase from './components/ServicesShowcase';
import NRISection from './components/NRISection';
import GlobalNetwork from './components/GlobalNetwork';
import InteractiveAssessment from './components/InteractiveAssessment';
import Testimonials from './components/Testimonials';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import ConsultationModal from './components/ConsultationModal';
import { Phone, MessageSquare } from 'lucide-react';

export default function App() {
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const lenis = initSmoothScroll();
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#060B18] text-slate-100 font-sans selection:bg-[#D4AF37] selection:text-[#060B18]">
      
      {/* Sticky Top Navbar */}
      <Navbar onOpenConsultation={() => setConsultationOpen(true)} />

      {/* Main Content Sections */}
      <main>
        <Hero onOpenConsultation={() => setConsultationOpen(true)} />
        <AboutExpert />
        <ServicesShowcase
          onSelectService={(service) => setSelectedService(service)}
          onOpenConsultation={() => setConsultationOpen(true)}
        />
        <NRISection onOpenConsultation={() => setConsultationOpen(true)} />
        <GlobalNetwork onOpenConsultation={() => setConsultationOpen(true)} />
        <InteractiveAssessment onOpenConsultation={() => setConsultationOpen(true)} />
        <Testimonials />
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer onOpenConsultation={() => setConsultationOpen(true)} />

      {/* Modals */}
      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
      />

      {/* Quick Action Floating Bar (Mobile & Desktop sticky bottom-right) */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
        <a
          href="https://wa.me/919573446403?text=Hello%20Dr.%20Karanam%20Rajesh%20Kumar,%20I%20would%20like%20to%20inquire%20about%20your%20International%20Legal%20Services."
          target="_blank"
          rel="noreferrer"
          className="p-3.5 rounded-full bg-emerald-600 text-white shadow-xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
          title="Direct WhatsApp Chat (+91 95734 46403)"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 text-xs font-bold whitespace-nowrap">
            WhatsApp Legal Chat
          </span>
        </a>

        <button
          onClick={() => setConsultationOpen(true)}
          className="px-4 py-3 rounded-full bg-gold-gradient text-slate-950 font-bold text-xs shadow-xl shadow-[#D4AF37]/25 hover:scale-105 transition-transform flex items-center gap-2 border border-[#D4AF37]"
        >
          <Phone className="w-4 h-4" />
          <span className="hidden sm:inline">Book Strategy Call</span>
        </button>
      </div>

    </div>
  );
}
