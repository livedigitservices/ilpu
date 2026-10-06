import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookingByIdApi } from '../services/api';
import {
  CheckCircle,
  Scale,
  MessageSquare,
  ArrowLeft,
  Mail,
  User,
  Phone,
  Globe,
  Tag,
  Calendar,
  FileCheck,
  ShieldCheck,
  Loader2,
  Users,
  Lock,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function BookingSuccessPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchBooking = async () => {
      try {
        const data = await getBookingByIdApi(bookingId);
        setBooking(data);
      } catch (err) {
        console.error("Error fetching booking receipt:", err);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    } else {
      setLoading(false);
    }
  }, [bookingId]);

  const isVerifiedPaid = Boolean(
    booking && (
      booking.status === 'PAID' ||
      booking.status === 'COMPLETED' ||
      booking.webhookVerified === true
    )
  );

  const serviceWhatsAppGroupLink = isVerifiedPaid
    ? (booking?.serviceWhatsAppGroupLink || import.meta.env.VITE_WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/ILPULegalAdvisoryGroup')
    : null;

  const handleWhatsAppContact = () => {
    if (!booking) return;
    const clientName = booking.clientDetails?.name || booking.name || 'Client';
    const serviceTitle = booking.serviceTitle || 'Legal Strategy Consultation';
    const amountStr = booking.currency === 'INR' ? `₹${booking.amount}` : `$${booking.amount} USD`;

    const text = encodeURIComponent(
      `Hello Dr. Karanam Rajesh Kumar,\n\nI have completed my legal service booking!\n\nBooking Ref: ${booking.bookingId || booking.id}\nClient Name: ${clientName}\nService: ${serviceTitle}\nAmount Paid: ${amountStr}\nPayment Status: VERIFIED PAID\n\nI look forward to our consultation.`
    );
    window.open(`https://wa.me/919573446403?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-slate-100 font-sans selection:bg-[#D4AF37] selection:text-[#060B18] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient p-[1.5px] shadow-lg">
              <div className="w-full h-full bg-[#060B18] rounded-[10.5px] flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#F3D079]" />
              </div>
            </div>
            <span className="font-cinzel text-xl font-bold tracking-widest text-gold-gradient">
              ILPU LEGAL EXPERT
            </span>
          </Link>
        </div>

        {/* Success Confirmation Card */}
        <div className="bg-navy-card rounded-3xl border border-emerald-500/40 p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden animate-fadeIn">
          
          {/* Top Banner Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600"></div>

          {/* Success Icon & Heading */}
          <div className="text-center space-y-3 pt-2">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500/50 shadow-xl shadow-emerald-500/10">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h1 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-white">
              Booking & Payment Confirmed!
            </h1>
            <p className="text-slate-300 text-sm sm:text-base font-light max-w-xl mx-auto">
              Your legal service has been booked successfully. A complete summary has been recorded and automatically dispatched to Dr. Karanam Rajesh Kumar's admin email.
            </p>
          </div>

          {/* Admin Email Dispatch Alert Badge */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Admin Email Notification Dispatched Automatically</span>
            </div>
            <span className="font-bold text-[10px] uppercase tracking-wider bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400">
              SUCCESS
            </span>
          </div>

          {/* Receipt Details Box */}
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#F3D079] animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading booking receipt details...</p>
            </div>
          ) : booking ? (
            <div className="space-y-6 pt-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-gradient">
                  Official Transaction Receipt
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Ref: <span className="text-white font-bold">{booking.bookingId || booking.id}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Service Selected</span>
                  <span className="font-semibold text-white text-sm">{booking.serviceTitle}</span>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Amount Paid</span>
                  <span className="font-cinzel text-lg font-bold text-[#F3D079]">
                    {booking.currency === 'INR' ? `₹${booking.amount} INR` : `$${booking.amount}.00 USD`}
                  </span>
                  <span className="text-[10px] text-emerald-400 block font-semibold">Payment Status: VERIFIED PAID</span>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Client Details</span>
                  <span className="font-semibold text-white block">{booking.clientDetails?.name || booking.name}</span>
                  <span className="text-slate-300 block">{booking.clientDetails?.email || booking.email || 'N/A'}</span>
                  <span className="text-slate-400 block">{booking.clientDetails?.phone || booking.phone}</span>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Region & Date</span>
                  <span className="font-semibold text-white block">
                    {booking.region === 'india' ? '🇮🇳 India Resident (₹499+18% GST)' : '🌐 International Client ($5 USD)'}
                  </span>
                  <span className="text-slate-400 block">Country: {booking.clientDetails?.country || booking.country}</span>
                  <span className="text-slate-400 block">
                    {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : new Date().toLocaleString()}
                  </span>
                </div>

              </div>

              {booking.clientDetails?.notes && (
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Case Summary / Client Notes</span>
                  <p className="text-slate-300 font-light italic">"{booking.clientDetails.notes}"</p>
                </div>
              )}

            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              Booking Ref: <span className="font-bold text-white">{bookingId}</span> recorded.
            </div>
          )}

          {/* VERIFIED SERVICE-SPECIFIC WHATSAPP GROUP ACCESS BOX */}
          {isVerifiedPaid ? (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/50 space-y-4 shadow-xl">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Verified Client Exclusive</span>
                    </div>
                    <h3 className="font-cinzel text-lg font-bold text-white">
                      Join {booking?.serviceTitle || 'Service'} WhatsApp Group/Channel
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-light leading-relaxed">
                As a verified paid client for <strong className="text-white">{booking?.serviceTitle || 'your selected service'}</strong>, you are granted exclusive access to join the dedicated WhatsApp group/channel for this specific service.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={serviceWhatsAppGroupLink}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3.5 px-6 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs sm:text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Users className="w-4 h-4" />
                  <span>Join {booking?.serviceTitle ? `"${booking.serviceTitle}"` : ''} WhatsApp Group</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={handleWhatsAppContact}
                  className="py-3.5 px-5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs sm:text-sm hover:bg-slate-850 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>1-on-1 Direct WhatsApp Message</span>
                </button>
              </div>
            </div>
          ) : !loading && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
              <Lock className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                Payment Verification Required: Access to service-specific WhatsApp Groups is restricted to clients with verified completed payments.
              </span>
            </div>
          )}

          {/* Return Home Action CTA */}
          <div className="pt-2 flex justify-end border-t border-slate-800">
            <Link
              to="/"
              className="py-3 px-5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs hover:border-[#D4AF37]/40 hover:text-[#F3D079] transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Practice Areas</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
