import React, { useState } from 'react';
import { HelpCircle, CheckCircle, ArrowRight, ShieldCheck, FileText, Send, PhoneCall, Sparkles } from 'lucide-react';

const assessmentQuestions = [
  {
    id: "domain",
    title: "1. What is your primary legal objective?",
    options: [
      { label: "NRI Property Protection / Ancestral Land Dispute", val: "nri-property" },
      { label: "International Commercial Contract Drafting & Negotiation", val: "contracts" },
      { label: "Cross-Border Business Entry / Import-Export Trade Law", val: "global-trade" },
      { label: "Matrimonial Asset Division & Family Legal Guidance", val: "family-law" },
      { label: "Overseas Direct Investment & FEMA Compliance", val: "investments" }
    ]
  },
  {
    id: "urgency",
    title: "2. What is the current status or timeline of your matter?",
    options: [
      { label: "Urgent: Active dispute or impending contract signing", val: "urgent" },
      { label: "Medium: Planning upcoming property/business transaction (1-3 months)", val: "planning" },
      { label: "Preventative: Seeking legal due diligence & precautionary audit", val: "preventative" }
    ]
  },
  {
    id: "jurisdiction",
    title: "3. Where are the parties or assets located?",
    options: [
      { label: "India & United States / Canada", val: "us-india" },
      { label: "India & Middle East (UAE, Qatar, Saudi Arabia)", val: "gcc-india" },
      { label: "India & Europe / UK / Australia", val: "eu-india" },
      { label: "Domestic India only with foreign implications", val: "india-only" }
    ]
  }
];

export default function InteractiveAssessment({ onOpenConsultation }) {
  const [answers, setAnswers] = useState({
    domain: assessmentQuestions[0].options[0].val,
    urgency: assessmentQuestions[1].options[0].val,
    jurisdiction: assessmentQuestions[2].options[0].val
  });

  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handleOptionSelect = (key, val) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const getRecommendation = () => {
    switch (answers.domain) {
      case "nri-property":
        return {
          title: "NRI Title Verification & Power of Attorney Package Recommended",
          desc: "We recommend a 30-Year Encumbrance Certificate audit, Embassy Special POA drafting, and local court verification prior to executing deeds.",
          docs: ["Copy of Purchase Deed / Agreement", "Pahani / Revenue Records", "Encumbrance Certificate", "Passport / OCI Details"]
        };
      case "contracts":
        return {
          title: "International Master Services Agreement (MSA) & Arbitration Structuring",
          desc: "We recommend drafting custom choice-of-law and SIAC/LCIA arbitration clauses to prevent cross-border contract repudiation.",
          docs: ["Draft Commercial Term Sheet", "Parties Registration Documents", "Existing SLA / NDA drafts"]
        };
      case "family-law":
        return {
          title: "Holistic Matrimonial Rights & Mutual Consent Settlement Protocol",
          desc: "We recommend evaluating foreign decree enforceability under Section 13 CPC, alimony calculations, and child custody protection deeds.",
          docs: ["Marriage Registration Certificate", "Asset & Property Holdings List", "Child Birth Certificates"]
        };
      default:
        return {
          title: "Cross-Border Regulatory & Strategic Due Diligence Advisory",
          desc: "We recommend a comprehensive FEMA compliance review and FDI legal structuring with Dr. Karanam Rajesh Kumar.",
          docs: ["Incorporation Certificates", "Proposed Capital Investment Structure", "Trade License Details"]
        };
    }
  };

  const rec = getRecommendation();

  return (
    <section id="assessment" className="py-24 relative bg-[#060B18]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-bold text-gold-gradient uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#F3D079]" />
            <span>Interactive Assessment Tool</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white">
            Evaluate Your Legal Requirement
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-light max-w-2xl mx-auto">
            Answer 3 quick questions to receive immediate preliminary guidance and a tailored document checklist for your 1-on-1 consultation with Dr. Karanam Rajesh Kumar.
          </p>
        </div>

        {/* Assessment Form Box */}
        <div className="bg-navy-card rounded-2xl border border-[#D4AF37]/30 p-6 sm:p-10 shadow-2xl relative">
          
          {!completed ? (
            <div className="space-y-8">
              
              {/* Progress indicator */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-4">
                <span className="font-bold text-[#F3D079]">Step {step} of 3</span>
                <span>Select your option below</span>
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    {assessmentQuestions[0].title}
                  </h3>
                  <div className="space-y-3">
                    {assessmentQuestions[0].options.map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => handleOptionSelect("domain", opt.val)}
                        className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between ${
                          answers.domain === opt.val
                            ? "bg-gold-glass border-[#D4AF37] text-white font-bold"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {answers.domain === opt.val && <CheckCircle className="w-4 h-4 text-[#F3D079]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    {assessmentQuestions[1].title}
                  </h3>
                  <div className="space-y-3">
                    {assessmentQuestions[1].options.map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => handleOptionSelect("urgency", opt.val)}
                        className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between ${
                          answers.urgency === opt.val
                            ? "bg-gold-glass border-[#D4AF37] text-white font-bold"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {answers.urgency === opt.val && <CheckCircle className="w-4 h-4 text-[#F3D079]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    {assessmentQuestions[2].title}
                  </h3>
                  <div className="space-y-3">
                    {assessmentQuestions[2].options.map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => handleOptionSelect("jurisdiction", opt.val)}
                        className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between ${
                          answers.jurisdiction === opt.val
                            ? "bg-gold-glass border-[#D4AF37] text-white font-bold"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {answers.jurisdiction === opt.val && <CheckCircle className="w-4 h-4 text-[#F3D079]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    ← Previous Step
                  </button>
                ) : <div></div>}

                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="px-6 py-2.5 rounded-lg bg-gold-gradient text-slate-950 font-bold text-xs shadow-md hover:brightness-110 flex items-center gap-1.5"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setCompleted(true)}
                    className="px-6 py-2.5 rounded-lg bg-gold-gradient text-slate-950 font-bold text-xs shadow-md hover:brightness-110 flex items-center gap-1.5"
                  >
                    <span>Generate Legal Roadmap</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-gold-gradient uppercase tracking-wider">
                    Tailored Legal Evaluation
                  </span>
                  <h3 className="font-cinzel text-xl font-bold text-white mt-1">
                    {rec.title}
                  </h3>
                </div>
                <button
                  onClick={() => setCompleted(false)}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Retake Assessment
                </button>
              </div>

              <p className="text-sm text-slate-300 font-light leading-relaxed">
                {rec.desc}
              </p>

              <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3D079]">
                  Recommended Documents to Prepare for Consultation
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {rec.docs.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-[#F3D079]" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenConsultation}
                  className="px-8 py-4 rounded-xl bg-gold-gradient text-slate-950 font-bold text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  <span>Book Consultation With Your Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://wa.me/919573446403"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-4 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-semibold text-sm hover:bg-emerald-600/30 transition-all flex items-center gap-2"
                >
                  <span>Instant WhatsApp Assessment (+91 95734 46403)</span>
                </a>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
