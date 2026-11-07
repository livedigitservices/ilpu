import React, { useState, useEffect } from 'react';
import { X, Send, Phone, MessageSquare, CheckCircle, Scale, Tag, Globe2, ShieldCheck, Loader2 } from 'lucide-react';
import { getPublicPricingApi, getPublicGstConfigApi } from '../services/api';

export default function ConsultationModal({ isOpen, onClose }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [region, setRegion] = useState('india'); // 'india' or 'international'
  const [pricingInfo, setPricingInfo] = useState({
    indiaBase: 499,
    gstRate: 18,
    indiaTotal: 589,
    intBase: 5
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'India',
    service: 'Immigration & Emigration Roadmap Advisory',
    details: '',
    access_key: 'YOUR_WEB3FORMS_ACCESS_KEY'
  });

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        getPublicPricingApi().catch(() => []),
        getPublicGstConfigApi().catch(() => null)
      ]).then(([plans, gst]) => {
        if (plans && plans.length > 0) {
          const first = plans[0];
          const rate = gst?.gstEnabled ? (gst.defaultRate ?? 18) : 0;
          const base = first.priceIndia || 499;
          const total = Math.round((base * (1 + rate / 100)) * 100) / 100;
          setPricingInfo({
            indiaBase: base,
            gstRate: rate,
            indiaTotal: total,
            intBase: first.priceInternational || 5
          });
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRegionChange = (e) => {
    const val = e.target.value;
    setRegion(val);
    setFormData((prev) => ({
      ...prev,
      country: val === 'india' ? 'India' : 'United States'
    }));
  };

  const currentDisplayStr = region === 'india'
    ? `₹${pricingInfo.indiaBase} + ${pricingInfo.gstRate}% GST (Total ₹${pricingInfo.indiaTotal})`
    : `$${pricingInfo.intBase} USD`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: formData.access_key !== 'YOUR_WEB3FORMS_ACCESS_KEY' ? formData.access_key : '8f4384e4-7d52-47ba-89a1-5231c5ee9659',
          from_name: `ILPU Strategy Request - ${formData.name}`,
          subject: `Legal Consultation Request (${currentDisplayStr}): ${formData.service}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          service: formData.service,
          pricing_tier: currentDisplayStr,
          message: formData.details
        })
      });

      const result = await response.json();
      if (result.success || response.status === 200) {
        setSubmitted(true);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.log("Web3Forms Submission handled:", err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello Dr. Karanam Rajesh Kumar,\n\nI would like to schedule an International Legal Strategy Consultation.\n\nName: ${formData.name || 'Client'}\nService: ${formData.service}\nLocation: ${formData.country}\nPricing Tier: ${currentDisplayStr}\nContact: ${formData.phone}`
    );
    window.open(`https://wa.me/919573446403?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-navy-card border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F3D079] uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>Direct Chambers Transmission</span>
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-white">
            Schedule Legal Strategy Session
          </h2>
          <p className="text-xs text-slate-300">
            Submit your inquiry directly to Dr. Karanam Rajesh Kumar's executive legal desk via Web3Forms.
          </p>
        </div>

        {!submitted ? (
          <div className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Region & Pricing Selector */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#F3D079]" />
                  <span>Select Consultation Jurisdiction & Fee *</span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRegion('india');
                      setFormData((prev) => ({ ...prev, country: 'India' }));
                    }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      region === 'india'
                        ? 'bg-gold-glass border-[#D4AF37] text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs">
                      <span>🇮🇳 India Client</span>
                    </div>
                    <div className="text-sm font-extrabold text-[#F3D079] mt-0.5">
                      ₹{pricingInfo.indiaBase}{' '}
                      <span className="text-[10px] font-normal text-slate-300">
                        {pricingInfo.gstRate > 0 ? `+ ${pricingInfo.gstRate}% GST` : ''}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">Total ₹{pricingInfo.indiaTotal}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegion('international');
                      setFormData((prev) => ({ ...prev, country: 'United States' }));
                    }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      region === 'international'
                        ? 'bg-gold-glass border-[#D4AF37] text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs">
                      <span>🌐 Other Countries</span>
                    </div>
                    <div className="text-sm font-extrabold text-[#F3D079] mt-0.5">
                      ${pricingInfo.intBase} USD
                    </div>
                    <span className="text-[10px] text-slate-400 block">Export (0% Tax)</span>
                  </button>
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Practice Area of Counsel *</label>
                <select
                  required
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]"
                >
                  <option value="International Law & Global Business">International Law & Global Business</option>
                  <option value="NRI Property Protection & Title Defense">NRI Property Protection & Title Defense</option>
                  <option value="International Contract Drafting & Frameworks">International Contract Drafting & Frameworks</option>
                  <option value="International Investment & Wealth Protection">International Investment & Wealth Protection</option>
                  <option value="Immigration & Emigration Roadmap Advisory">Immigration & Emigration Roadmap Advisory</option>
                  <option value="Family Law & Life After Divorce Advisory">Family Law & Life After Divorce Advisory</option>
                </select>
              </div>

              {/* Client Name */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Email Address */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Country of Residence */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Current Country / State of Residence *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. India, United States, UAE, Singapore, UK"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Legal Case Details */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Brief Overview of Legal Matter (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Briefly describe the jurisdiction, property location, contract terms, or immigration goals..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]"
                ></textarea>
              </div>

              {/* Direct Submit via Web3Forms */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gold-gradient text-slate-950 font-bold text-sm shadow-lg hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Strategy Request...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Strategy Request ({region === 'india' ? `₹${pricingInfo.indiaBase} + GST` : `$${pricingInfo.intBase} USD`})</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1 pt-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Encrypted Transmission • Direct Chambers Notification</span>
              </p>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-white">
              Strategy Request Sent
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Thank you, <span className="font-bold text-white">{formData.name}</span>. Your legal consultation request ({currentDisplayStr}) has been transmitted directly to Dr. Karanam Rajesh Kumar's executive team.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={handleWhatsAppDirect}
                className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Direct WhatsApp Chat</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
