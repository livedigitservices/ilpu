import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { servicesData, PRICING_INFO } from '../data/servicesData';
import {
  createPayPalOrderApi,
  capturePayPalOrderApi,
  createRazorpayOrderApi,
  verifyRazorpayPaymentApi,
  verifyDirectUpiPaymentApi
} from '../services/api';
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
  Sparkles,
  QrCode,
  Smartphone,
  ExternalLink,
  ShieldAlert,
  Zap
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

// Dynamically load Razorpay SDK script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
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

  // India Payment Method selection: 'UPI_APPS' | 'RAZORPAY' | 'UPI_QR'
  const [indiaPaymentTab, setIndiaPaymentTab] = useState('UPI_APPS');
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [upiUtr, setUpiUtr] = useState('');

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
  const totalAmount = region === 'india' ? 589 : 5;
  const currencyCode = region === 'india' ? 'INR' : 'USD';

  // UPI Deep Link String for Google Pay, PhonePe, Paytm, BHIM
  const upiId = 'mtharun342@okicici';
  const upiPayeeName = 'Dr Karanam Rajesh Kumar';
  const upiNote = `ILPU Legal Strategy - ${service.title}`;
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiPayeeName)}&am=589&cu=INR&tn=${encodeURIComponent(upiNote)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiDeepLink)}&color=060B18&bgcolor=FFFFFF`;

  // 1. Razorpay Payment Handler (India UPI, Cards, Netbanking)
  const handleRazorpayPayment = async () => {
    if (!validateForm()) {
      setPaymentError('Please complete all required fields (Name, Email, Phone, Country) in Step 2 above before proceeding to payment.');
      return;
    }

    setProcessing(true);
    setPaymentError(null);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      const orderData = await createRazorpayOrderApi({
        serviceId: service.id,
        serviceTitle: service.title,
        region,
        amount: 589,
        currency: 'INR',
        clientDetails: formData,
      });

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || orderData.keyId || 'rzp_test_ILPULegal2026';

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'ILPU Legal Expert',
        description: `Strategy Session - ${service.title}`,
        order_id: orderData.orderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#D4AF37',
        },
        handler: async function (response) {
          try {
            const verification = await verifyRazorpayPaymentApi({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentMethod: 'RAZORPAY_UPI',
              serviceId: service.id,
              serviceTitle: service.title,
              region,
              amount: 589,
              currency: 'INR',
              clientDetails: formData,
            });

            if (verification.success) {
              navigate(`/booking-success/${verification.bookingId}`);
            } else {
              throw new Error(verification.error || 'Razorpay payment verification failed');
            }
          } catch (err) {
            setProcessing(false);
            setPaymentError(err.message || 'Error verifying Razorpay payment');
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      setProcessing(false);
      setPaymentError(err.message || 'Error initiating Razorpay checkout.');
    }
  };

  // 2. Direct UPI Payment Handler (Google Pay / PhonePe / Paytm / BHIM)
  const handleDirectUpiPayment = async () => {
    if (!validateForm()) {
      setPaymentError('Please complete all required fields (Name, Email, Phone, Country) in Step 2 above before proceeding.');
      return;
    }

    setProcessing(true);
    setPaymentError(null);

    try {
      const data = await verifyDirectUpiPaymentApi({
        utr: upiUtr.trim() || `UPI-REF-${Date.now()}`,
        upiApp: selectedUpiApp,
        serviceId: service.id,
        serviceTitle: service.title,
        region,
        amount: 589,
        currency: 'INR',
        clientDetails: formData,
      });

      if (data.success) {
        navigate(`/booking-success/${data.bookingId}`);
      } else {
        throw new Error(data.error || 'UPI Payment processing failed');
      }
    } catch (err) {
      setProcessing(false);
      setPaymentError(err.message || 'Error completing UPI booking payment.');
    }
  };

  // 3. International PayPal Payment Handlers
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
        amount: 5,
        currency: 'USD',
        clientDetails: formData,
      });

      return orderID;
    } catch (err) {
      setPaymentError(err.message || 'Error creating PayPal payment order');
      throw err;
    }
  };

  const onPayPalApprove = async (data) => {
    setProcessing(true);
    setPaymentError(null);

    try {
      const captureData = await capturePayPalOrderApi({
        orderID: data.orderID,
        serviceId: service.id,
        serviceTitle: service.title,
        region,
        amount: 5,
        currency: 'USD',
        clientDetails: formData,
      });

      navigate(`/booking-success/${captureData.bookingId}`);
    } catch (err) {
      setProcessing(false);
      setPaymentError(err.message || 'Error capturing PayPal payment order');
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
            <span>Back to Practice Areas</span>
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
            <span>Multi-Gateway Secure Legal Booking</span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-white">
            Book Legal Consultation
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-light max-w-3xl">
            Select your region to access local UPI options (Google Pay, PhonePe, Paytm, BHIM) or PayPal international payment options.
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

          {/* Right Column: Multi-Payment Gateway Booking Form (7 cols) */}
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
                      <span className="text-base">🇮🇳</span> India Resident (UPI / Cards)
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
                    Supports Google Pay, PhonePe, Paytm, BHIM UPI & Cards.
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
                      <span className="text-base">🌐</span> International Client (PayPal)
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
                    Supports PayPal Balance & International Cards globally.
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

                {/* Case Summary */}
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

            {/* Payment Summary & Gateway Box */}
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

              {/* Multi-Payment Gateway Selector */}
              {processing ? (
                <div className="py-12 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-[#F3D079] animate-spin mx-auto" />
                  <p className="text-xs text-slate-300 font-semibold">
                    Processing Payment & Dispatching Admin Notification...
                  </p>
                </div>
              ) : region === 'india' ? (
                /* INDIA REGION PAYMENT GATEWAYS (UPI: GPay, PhonePe, Paytm, BHIM & Razorpay) */
                <div className="space-y-6">
                  
                  {/* India Sub-Payment Method Switcher */}
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setIndiaPaymentTab('UPI_APPS')}
                      className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        indiaPaymentTab === 'UPI_APPS'
                          ? 'bg-gold-gradient text-slate-950 font-bold shadow-md'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>UPI Apps & QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIndiaPaymentTab('RAZORPAY')}
                      className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        indiaPaymentTab === 'RAZORPAY'
                          ? 'bg-gold-gradient text-slate-950 font-bold shadow-md'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Razorpay (UPI / Cards)</span>
                    </button>
                  </div>

                  {/* TAB 1: UPI APPS & DYNAMIC QR CODE */}
                  {indiaPaymentTab === 'UPI_APPS' && (
                    <div className="space-y-5 animate-fadeIn">
                      
                      {/* UPI App Selection Pills */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-300 block">
                          Select UPI Payment App:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { name: 'Google Pay', icon: '🟢', color: 'border-emerald-500/50 bg-emerald-950/20' },
                            { name: 'PhonePe', icon: '🟣', color: 'border-purple-500/50 bg-purple-950/20' },
                            { name: 'Paytm', icon: '🔵', color: 'border-sky-500/50 bg-sky-950/20' },
                            { name: 'BHIM UPI', icon: '🟧', color: 'border-amber-500/50 bg-amber-950/20' },
                          ].map((app) => (
                            <button
                              key={app.name}
                              type="button"
                              onClick={() => setSelectedUpiApp(app.name)}
                              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                                selectedUpiApp === app.name
                                  ? 'border-[#D4AF37] bg-gold-glass text-[#F3D079] ring-1 ring-[#D4AF37]'
                                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <span>{app.icon}</span>
                              <span>{app.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tap to Pay & QR Code Display Box */}
                      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-center">
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                          
                          {/* QR Code Container */}
                          <div className="bg-white p-3 rounded-xl border-2 border-[#D4AF37] shadow-xl shrink-0">
                            <img
                              src={qrCodeUrl}
                              alt="ILPU Merchant UPI QR Code"
                              className="w-40 h-40 object-contain mx-auto"
                            />
                            <span className="text-[10px] font-bold font-mono text-slate-900 block mt-1">
                              Scan with Any UPI App
                            </span>
                          </div>

                          {/* Direct Mobile UPI App Link */}
                          <div className="space-y-3 text-left max-w-xs">
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold text-[#F3D079] uppercase tracking-wider block">
                                Pay ₹589 via {selectedUpiApp}
                              </span>
                              <p className="text-[11px] text-slate-300 font-light">
                                Scan the QR code using Google Pay, PhonePe, Paytm, or BHIM. On mobile, tap the direct link below.
                              </p>
                            </div>

                            <a
                              href={upiDeepLink}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all w-full shadow-lg"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open {selectedUpiApp} App</span>
                            </a>

                            <div className="text-[10px] text-slate-400 font-mono bg-slate-950 p-2 rounded border border-slate-800/80">
                              UPI VPA: <span className="text-white font-bold">{upiId}</span>
                            </div>
                          </div>

                        </div>

                        {/* UTR / Transaction Reference Input */}
                        <div className="pt-4 border-t border-slate-800 space-y-3 text-left">
                          <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
                            <span>UPI Ref / UTR No. (Optional for Instant Confirm)</span>
                            <span className="text-[10px] text-slate-400 font-mono">12-digit number</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="e.g. 326718293014"
                              value={upiUtr}
                              onChange={(e) => setUpiUtr(e.target.value)}
                              className="flex-1 bg-slate-950 border border-slate-800 focus:border-[#D4AF37] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleDirectUpiPayment}
                              className="px-5 py-2.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs hover:brightness-110 transition-all border border-[#D4AF37] shrink-0"
                            >
                              Confirm Payment
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* TAB 2: RAZORPAY GATEWAY */}
                  {indiaPaymentTab === 'RAZORPAY' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-gold-gradient p-[1px] mx-auto">
                          <div className="w-full h-full bg-[#060B18] rounded-[15px] flex items-center justify-center text-[#F3D079]">
                            <Zap className="w-6 h-6" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-cinzel text-base font-bold text-white">
                            Razorpay Multi-Method Checkout
                          </h4>
                          <p className="text-xs text-slate-300 font-light max-w-md mx-auto">
                            Pay securely using Google Pay, PhonePe, Paytm, BHIM, Debit/Credit Cards, or Indian NetBanking with instant signature verification.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleRazorpayPayment}
                          className="w-full py-4 rounded-xl bg-gold-gradient text-slate-950 font-bold text-sm shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 border border-[#D4AF37]"
                        >
                          <Zap className="w-4 h-4 fill-slate-950" />
                          <span>Launch Razorpay Gateway (₹589 INR)</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                /* INTERNATIONAL REGION PAYMENT GATEWAYS (PayPal & Credit/Debit Cards) */
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    PayPal International Gateway ($5.00 USD):
                  </span>

                  <div className="space-y-3">
                    <PayPalScriptProvider
                      options={{
                        "client-id": paypalClientId,
                        currency: 'USD',
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
                        onCancel={() => setProcessing(false)}
                        onError={(err) => {
                          setProcessing(false);
                          console.log("PayPal SDK Error:", err);
                          setPaymentError("PayPal checkout notice: Please verify your credentials or click Direct Confirmation below.");
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                </div>
              )}

              {/* Fallback Direct Booking Trigger */}
              <div className="pt-3 border-t border-slate-800 text-center space-y-2">
                <p className="text-[11px] text-slate-400">
                  Prefer direct priority verification without gateway popups?
                </p>
                <button
                  type="button"
                  onClick={handleDirectUpiPayment}
                  className="w-full py-3.5 rounded-xl bg-slate-900 text-slate-200 hover:text-white font-bold text-xs shadow-md hover:border-[#D4AF37] transition-all flex items-center justify-center gap-2 border border-slate-800"
                >
                  <CreditCard className="w-4 h-4 text-[#F3D079]" />
                  <span>Confirm Booking & Notify Admin ({region === 'india' ? '₹589' : '$5 USD'})</span>
                </button>
              </div>

              {/* Email dispatch notice */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  After successful payment, full booking details and receipt will be dispatched automatically to the admin email ({import.meta.env.VITE_ADMIN_EMAIL || 'mtharun342@gmail.com'}).
                </span>
              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
