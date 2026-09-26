import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { servicesData, PRICING_INFO } from '../data/servicesData';
import { createPayPalOrderApi, capturePayPalOrderApi } from '../services/api';
import {
  Scale,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
  Lock,
  Tag,
  CreditCard,
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  MessageSquare,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const defaultService = {
  id: "general-consultation",
  title: "1-on-1 International Legal Strategy Consultation",
  subtitle: "Direct Confidential Legal Counsel with Dr. Karanam Rajesh Kumar",
  badge: "Priority Advisory",
  tagline: "NRI Rights • International Business • Immigration Roadmaps",
  image: "/assets/service-global-trade.jpg",
  description: "Comprehensive 1-on-1 legal strategy session for non-resident Indians, international businesses, global investors, and immigrants. Get clear legal clarity on title defense, contracts, FEMA, and cross-border mobility.",
  features: [
    "30-Minute 1-on-1 Legal Strategy Session with Dr. Karanam Rajesh Kumar",
    "Complete Legal Risk Audit & Key Document Assessment",
    "Jurisdictional Alignment under Indian & International Law",
    "Actionable Legal Next Steps & Embassy / Court Protocol"
  ],
  deliverables: [
    "Custom Legal Opinion & Strategy Summary Document",
    "Embassy / Court Filing Checklist & Template Guidance",
    "Direct Priority Follow-Up Protocol"
  ]
};

export default function ServiceBookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const service = servicesData.find((s) => s.id === serviceId) || defaultService;

  const [region, setRegion] = useState('india'); // 'india' or 'international'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'India',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  const handleRegionSelect = (selectedRegion) => {
    setRegion(selectedRegion);
    setFormData((prev) => ({
      ...prev,
      country: selectedRegion === 'india' ? 'India' : 'United States'
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid email address is required';
    if (!formData.phone.trim()) errors.phone = 'Phone / WhatsApp number is required';
    if (!formData.country.trim()) errors.country = 'Country is required';

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    return true;
  };

  const isFormFilled = formData.name.trim() && formData.email.trim() && formData.phone.trim() && formData.country.trim();

  const currentPricing = region === 'india' ? PRICING_INFO.india : PRICING_INFO.international;
  const totalAmount = region === 'india' ? 7 : 5;
  const currencyCode = 'USD';

  // Create PayPal Order API call (Keep buttons mounted!)
  const createPayPalOrder = async () => {
    if (!validateForm()) {
      setPaymentError('Please complete all required fields (Name, Email, Phone, Country) in Step 2 above before proceeding to payment.');
      throw new Error('Form validation failed');
    }

    setPaymentError(null);

    try {
      const orderID = await createPayPalOrderApi({
        serviceId: service.id,
        serviceTitle: service.title,
        region,
        amount: totalAmount,
        currency: 'USD',
        clientDetails: formData,
      });

      return orderID;
    } catch (err) {
      setPaymentError(err.message || 'Error creating payment order');
      throw err;
    }
  };

  // Capture PayPal Order API call (Triggers when user completes payment in PayPal modal)
  const onPayPalApprove = async (data) => {
    setProcessing(true);
    setPaymentError(null);

    try {
      const captureData = await capturePayPalOrderApi({
        orderID: data.orderID,
        serviceId: service.id,
        serviceTitle: service.title,
        region,
        amount: totalAmount,
        currency: currencyCode,
        clientDetails: formData,
      });

      // Navigate to booking success receipt page
      navigate(`/booking-success/${captureData.bookingId}`);
    } catch (err) {
      setProcessing(false);
      setPaymentError(err.message || 'Error capturing payment order');
    }
  };

  // Direct Confirmation Handler (Instant Backup Payment)
  const handleSimulatePayment = async () => {
    if (!validateForm()) {
      setPaymentError('Please fill in all required client details in Step 2 before proceeding.');
      return;
    }

    setProcessing(true);
    setPaymentError(null);

    try {
      const orderID = await createPayPalOrderApi({
        serviceId: service.id,
        serviceTitle: service.title,
        region,
        amount: totalAmount,
        currency: currencyCode,
        clientDetails: formData,
      });

      const captureData = await capturePayPalOrderApi({
        orderID,
        serviceId: service.id,
        serviceTitle: service.title,
        region,
        amount: totalAmount,
        currency: currencyCode,
        clientDetails: formData,
      });

      if (captureData.success) {
        navigate(`/booking-success/${captureData.bookingId}`);
      } else {
        throw new Error(captureData.error || 'Payment capture failed');
      }
    } catch (err) {
      setProcessing(false);
      setPaymentError(err.message || 'An error occurred during booking payment simulation.');
    }
  };

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';

  return (
    <div className="min-h-screen bg-[#060B18] text-slate-100 font-sans selection:bg-[#D4AF37] selection:text-[#060B18] pb-24">
      
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-[#060B18]/90 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group text-xs font-bold text-slate-300 hover:text-[#F3D079] transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#F3D079] group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Practice Areas</span>
          </Link>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold-gradient p-[1px]">
              <div className="w-full h-full bg-[#060B18] rounded-[7px] flex items-center justify-center">
                <Scale className="w-4 h-4 text-[#F3D079]" />
              </div>
            </div>
            <span className="font-cinzel text-base font-bold text-gold-gradient tracking-widest hidden sm:inline">
              ILPU LEGAL EXPERT
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/919573446403"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-600/30 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+91 95734 46403</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Page Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Page Title */}
        <div className="space-y-3 mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs font-bold text-gold-gradient uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#F3D079]" />
            <span>Secure Legal Booking Portal</span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-white">
            Book Strategy Service
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-light max-w-3xl">
            Confirm your booking and secure direct legal consultation with Dr. Karanam Rajesh Kumar. Select your region, enter your details, and complete your secure payment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Service Details & Scope Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-navy-card rounded-2xl border border-[#D4AF37]/40 p-6 shadow-2xl space-y-6 sticky top-24">
              
              {/* Badge & Price tag */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900 text-[#F3D079] border border-[#D4AF37]/30">
                  {service.badge}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  {currentPricing.display}
                </span>
              </div>

              {/* Service Title */}
              <div>
                <h2 className="font-cinzel text-2xl font-bold text-white">
                  {service.title}
                </h2>
                <p className="font-playfair text-sm text-gold-gradient italic font-medium mt-1">
                  "{service.subtitle}"
                </p>
              </div>

              {/* Image Banner */}
              <div className="rounded-xl overflow-hidden border border-slate-800 relative h-48 group">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-3 left-3 right-3 text-[10px] text-slate-300 font-medium bg-slate-950/80 backdrop-blur-md p-2 rounded border border-[#D4AF37]/30 truncate">
                  {service.tagline}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                {service.description}
              </p>

              {/* Scope Features */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F3D079] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Included Consultation Scope</span>
                </h3>
                <div className="space-y-2">
                  {service.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-[#F3D079] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gold-gradient">
                  Official Deliverables
                </h3>
                <div className="space-y-1.5">
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F3D079]"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badge Footer */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
                <Lock className="w-4 h-4 text-[#F3D079] shrink-0" />
                <span>100% Confidential • Direct Legal Counsel • Guaranteed Chambers Response</span>
              </div>

            </div>
          </div>

          {/* Right Column: Booking & PayPal Payment Form (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Region & Pricing Selector */}
            <div className="bg-navy-card rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-gold-gradient text-slate-950 font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    Select Your Region & Pricing Tier
                  </h3>
                </div>
                <span className="text-xs text-[#F3D079] font-mono">Step 1 of 2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* India Pricing Option */}
                <div
                  onClick={() => handleRegionSelect('india')}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    region === 'india'
                      ? 'bg-gold-glass border-[#D4AF37] ring-1 ring-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="text-base">🇮🇳</span> India Resident
                    </span>
                    {region === 'india' && <CheckCircle2 className="w-4 h-4 text-[#F3D079]" />}
                  </div>
                  <div className="font-cinzel text-2xl font-extrabold text-[#F3D079]">
                    ₹499 <span className="text-xs font-normal text-slate-300">+ 18% GST</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Total Amount: <span className="text-slate-200 font-bold">₹589 INR</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
                    For clients residing in India / Indian billing addresses.
                  </p>
                </div>

                {/* International Pricing Option */}
                <div
                  onClick={() => handleRegionSelect('international')}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    region === 'international'
                      ? 'bg-gold-glass border-[#D4AF37] ring-1 ring-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="text-base">🌐</span> International Client (NRIs)
                    </span>
                    {region === 'international' && <CheckCircle2 className="w-4 h-4 text-[#F3D079]" />}
                  </div>
                  <div className="font-cinzel text-2xl font-extrabold text-[#F3D079]">
                    $5 USD
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Total Amount: <span className="text-slate-200 font-bold">$5.00 USD</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
                    For clients residing outside India (USA, UAE, UK, Canada, EU).
                  </p>
                </div>

              </div>
            </div>

            {/* Step 2: Client Details Form */}
            <div ref={formRef} className="bg-navy-card rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-gold-gradient text-slate-950 font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    Client Information & Case Details
                  </h3>
                </div>
                <span className="text-xs text-[#F3D079] font-mono">Step 2 of 2</span>
              </div>

              <div className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#F3D079]" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Sharma"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                    }}
                    className={`w-full bg-slate-900 border rounded-xl p-3.5 text-sm text-slate-100 outline-none transition-colors ${
                      formErrors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800 focus:border-[#D4AF37]'
                    }`}
                  />
                  {formErrors.name && <p className="text-[11px] text-red-400 mt-1">{formErrors.name}</p>}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#F3D079]" />
                      <span>Email Address *</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (formErrors.email) setFormErrors({ ...formErrors, email: null });
                      }}
                      className={`w-full bg-slate-900 border rounded-xl p-3.5 text-sm text-slate-100 outline-none transition-colors ${
                        formErrors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800 focus:border-[#D4AF37]'
                      }`}
                    />
                    {formErrors.email && <p className="text-[11px] text-red-400 mt-1">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#F3D079]" />
                      <span>Phone / WhatsApp Number *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210 or +1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (formErrors.phone) setFormErrors({ ...formErrors, phone: null });
                      }}
                      className={`w-full bg-slate-900 border rounded-xl p-3.5 text-sm text-slate-100 outline-none transition-colors ${
                        formErrors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800 focus:border-[#D4AF37]'
                      }`}
                    />
                    {formErrors.phone && <p className="text-[11px] text-red-400 mt-1">{formErrors.phone}</p>}
                  </div>
                </div>

                {/* Country of Residence */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#F3D079]" />
                    <span>Country of Residence *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. India, USA, United Arab Emirates, UK, Canada"
                    value={formData.country}
                    onChange={(e) => {
                      setFormData({ ...formData, country: e.target.value });
                      if (formErrors.country) setFormErrors({ ...formErrors, country: null });
                    }}
                    className={`w-full bg-slate-900 border rounded-xl p-3.5 text-sm text-slate-100 outline-none transition-colors ${
                      formErrors.country ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800 focus:border-[#D4AF37]'
                    }`}
                  />
                  {formErrors.country && <p className="text-[11px] text-red-400 mt-1">{formErrors.country}</p>}
                </div>

                {/* Specific Notes / Case Summary */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#F3D079]" />
                    <span>Brief Case Summary / Notes (Optional)</span>
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Briefly state your query, property location, visa goal, or contract terms..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-[#D4AF37] rounded-xl p-3.5 text-sm text-slate-100 outline-none"
                  ></textarea>
                </div>

              </div>
            </div>

            {/* Payment Summary & PayPal Checkout Box */}
            <div className="bg-navy-card rounded-2xl border border-[#D4AF37]/40 p-6 sm:p-8 space-y-6 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-gold-gradient uppercase tracking-widest block">
                    Final Checkout Summary
                  </span>
                  <h3 className="font-cinzel text-xl font-bold text-white mt-0.5">
                    Pay & Confirm Booking
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Payable</span>
                  <span className="font-cinzel text-2xl font-extrabold text-[#F3D079]">
                    {region === 'india' ? '₹589 INR' : '$5.00 USD'}
                  </span>
                </div>
              </div>

              {/* Error Message Display */}
              {paymentError && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-3 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Action Required:</span>
                    <span>{paymentError}</span>
                  </div>
                </div>
              )}

              {!isFormFilled && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Please complete your Name, Email, Phone, and Country in Step 2 above before paying.</span>
                </div>
              )}

              {/* PayPal Smart Payment Buttons */}
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Select Payment Method (Secure PayPal Gateway):
                </span>

                {processing ? (
                  <div className="py-8 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-3">
                    <Loader2 className="w-8 h-8 text-[#F3D079] animate-spin mx-auto" />
                    <p className="text-xs text-slate-300 font-semibold">
                      Processing Payment Capture & Dispatching Admin Notification...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <PayPalScriptProvider
                      options={{
                        "client-id": paypalClientId,
                        currency: currencyCode,
                        components: "buttons"
                      }}
                    >
                      <PayPalButtons
                        style={{
                          layout: "vertical",
                          color: "gold",
                          shape: "rect",
                          label: "pay"
                        }}
                        createOrder={createPayPalOrder}
                        onApprove={onPayPalApprove}
                        onCancel={() => {
                          setProcessing(false);
                        }}
                        onError={(err) => {
                          setProcessing(false);
                          console.log("PayPal SDK Error:", err);
                          if (err && err.message && err.message.includes("Form validation failed")) {
                            setPaymentError("Please fill in all required client details (Name, Email, Phone, Country) in Step 2 above before proceeding to payment.");
                          } else {
                            setPaymentError("PayPal checkout notice: Please verify your credentials or click Direct Confirmation below.");
                          }
                        }}
                      />
                    </PayPalScriptProvider>

                    {/* Fallback / Instant Booking Trigger */}
                    <div className="pt-2 border-t border-slate-800/80 text-center space-y-2">
                      <p className="text-[11px] text-slate-400">
                        Prefer instant verification or testing without PayPal popups?
                      </p>
                      <button
                        type="button"
                        onClick={handleSimulatePayment}
                        className="w-full py-3.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 border border-[#D4AF37]"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Confirm Booking & Send Details to Admin ({region === 'india' ? '₹589' : '$5 USD'})</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Email dispatch notice */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  After successful payment, full booking details and receipt will be dispatched automatically to the admin email configured in environment variables.
                </span>
              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
