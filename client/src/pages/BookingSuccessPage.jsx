import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Loader2
} from 'lucide-react';

export default function BookingSuccessPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        if (response.ok) {
          const data = await response.json();
          setBooking(data);
        }
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

  const handleWhatsAppContact = () => {
    if (!booking) return;
    const clientName = booking.clientDetails?.name || 'Client';
    const serviceTitle = booking.serviceTitle || 'Legal Strategy Consultation';
    const amountStr = booking.currency === 'INR' ? `₹${booking.amount}` : `$${booking.amount} USD`;

    const text = encodeURIComponent(
      `Hello Dr. Karanam Rajesh Kumar,\n\nI have completed my legal service booking!\n\nBooking Ref: ${booking.bookingId}\nClient Name: ${clientName}\nService: ${serviceTitle}\nAmount Paid: ${amountStr}\nPayment Status: COMPLETED\n\nI look forward to our consultation.`
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
                  Ref: <span className="text-white font-bold">{booking.bookingId}</span>
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
                  <span className="text-[10px] text-emerald-400 block font-semibold">Payment Status: COMPLETED</span>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Client Details</span>
                  <span className="font-semibold text-white block">{booking.clientDetails?.name}</span>
                  <span className="text-slate-300 block">{booking.clientDetails?.email}</span>
                  <span className="text-slate-400 block">{booking.clientDetails?.phone}</span>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Region & Date</span>
                  <span className="font-semibold text-white block">
                    {booking.region === 'india' ? '🇮🇳 India Resident (₹499+18% GST)' : '🌐 International Client ($5 USD)'}
                  </span>
                  <span className="text-slate-400 block">Country: {booking.clientDetails?.country}</span>
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

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 border-t border-slate-800">
            <button
              onClick={handleWhatsAppContact}
              className="w-full sm:w-auto flex-1 py-4 px-6 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Connect on WhatsApp with Booking Ref</span>
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto py-4 px-6 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm hover:border-[#D4AF37]/40 hover:text-[#F3D079] transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Home Page</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
