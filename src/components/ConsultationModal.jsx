import React, { useState } from 'react';
import { X, Send, Phone, MessageSquare, CheckCircle, Scale } from 'lucide-react';

export default function ConsultationModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'United States',
    service: 'NRI Property Protection',
    details: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello Dr. Karanam Rajesh Kumar,\n\nI would like to schedule an International Legal Strategy Consultation.\n\nName: ${formData.name || 'Client'}\nService: ${formData.service}\nLocation: ${formData.country}\nContact: ${formData.phone}`
    );
    window.open(`https://wa.me/919573446403?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0A1128] border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#F3D079]" />
                <span className="text-xs font-bold uppercase tracking-widest text-gold-gradient">
                  Confidential Strategy Call
                </span>
              </div>
              <h3 className="font-cinzel text-2xl font-bold text-white">
                Book Consultation with Dr. Rajesh Kumar
              </h3>
              <p className="text-xs text-slate-300">
                Direct legal guidance for NRIs, international corporations, and global investors.
              </p>
            </div>

            {/* Quick Contact Bar */}
            <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="flex-1 py-2 px-3 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-600/30 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp (+91 95734 46403)</span>
              </button>
              <a
                href="tel:+919573446403"
                className="py-2 px-4 rounded-lg bg-gold-gradient text-slate-950 text-xs font-bold flex items-center gap-1 hover:brightness-110"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:border-[#D4AF37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Service Required</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:border-[#D4AF37] outline-none"
                  >
                    <option value="NRI Property Protection">NRI Property Protection</option>
                    <option value="International Commercial Contracts">International Commercial Contracts</option>
                    <option value="Global Business & Import-Export">Global Business & Import-Export</option>
                    <option value="Life After Divorce & Matrimonial Law">Life After Divorce & Matrimonial Law</option>
                    <option value="Cross-Border Investment & FEMA">Cross-Border Investment & FEMA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Country of Residence</label>
                  <input
                    type="text"
                    placeholder="e.g. USA, UAE, UK, India"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Brief Description of Legal Matter</label>
                <textarea
                  rows="3"
                  placeholder="Describe your case, property location, or contract scope..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:border-[#D4AF37] outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gold-gradient text-slate-950 font-bold text-sm shadow-lg hover:brightness-110 flex items-center justify-center gap-2"
              >
                <span>Request Strategy Call</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-white">
              Consultation Request Received
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Thank you, <span className="font-bold text-white">{formData.name}</span>. Dr. Karanam Rajesh Kumar's executive team will contact you via WhatsApp/Phone within 4 hours to confirm your scheduled slot.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={handleWhatsAppDirect}
                className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open WhatsApp Chat Immediately</span>
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
