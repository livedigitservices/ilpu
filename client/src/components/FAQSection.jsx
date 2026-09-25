import React, { useState } from 'react';
import { FAQs } from '../data/servicesData';
import { ChevronDown, HelpCircle, Search, MessageSquare, Phone, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function FAQSection({ onOpenConsultation }) {
  const [openIndex, setOpenIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'NRI Property', 'International Contracts', 'Global Business', 'Family Law', 'Investments'];

  const filteredFAQs = FAQs.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 relative bg-[#060B18]">
      {/* Ambient background lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-bold text-gold-gradient uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5 text-[#F3D079]" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-5xl font-extrabold text-white">
            International Legal FAQs
          </h2>
          <p className="text-slate-300 text-xs sm:text-base font-light max-w-2xl mx-auto leading-relaxed">
            Direct answers to key legal questions regarding NRI property rights, cross-border contract enforceability, foreign exchange laws, and matrimonial advisory.
          </p>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search legal questions (e.g., POA, title, contracts, divorce, FEMA)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-[#D4AF37] outline-none transition-colors"
            />
          </div>

          {/* Category Filter Pills (Horizontal wrapped) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gold-gradient text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-navy-card border-[#D4AF37]/40 shadow-xl shadow-[#D4AF37]/10'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full text-left p-4 sm:p-6 flex items-start justify-between gap-3 sm:gap-4 group"
                  >
                    <div className="space-y-2 flex-1">
                      {/* Top Meta Bar */}
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-950 text-[#F3D079] border border-[#D4AF37]/30">
                          {faq.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">Q.0{idx + 1}</span>
                      </div>

                      {/* Question Title */}
                      <h3 className="font-cinzel text-sm sm:text-lg font-bold text-slate-100 group-hover:text-[#F3D079] transition-colors leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    {/* Chevron Toggle Badge */}
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-gold-gradient text-slate-950 border-[#D4AF37] rotate-180'
                        : 'bg-slate-900 border-slate-800 text-[#F3D079]'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Expanded Answer Content */}
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-0 space-y-4 border-t border-slate-800/80 animate-fadeIn">
                      <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed pt-3">
                        {faq.answer}
                      </p>

                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
              <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No matching questions found</p>
              <p className="text-xs text-slate-500">Try searching with a different term or clear the filter.</p>
            </div>
          )}
        </div>

        {/* Still Have Questions CTA Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0A1128] to-slate-900 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center sm:text-left">
            <h4 className="font-cinzel text-lg sm:text-xl font-bold text-white">
              Have a Specific Legal Question?
            </h4>
            <p className="text-xs text-slate-300 font-light">
              Get confidential, tailored advice directly from Dr. Karanam Rajesh Kumar's chambers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href="https://wa.me/919573446403"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-emerald-600/30 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>

            <button
              onClick={onOpenConsultation}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:brightness-110 transition-all shadow-md"
            >
              <span>Schedule Strategy Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
