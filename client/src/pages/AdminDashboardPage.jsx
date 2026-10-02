import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listBookingsApi, deleteBookingApi, createManualBookingApi } from '../services/api';
import {
  Scale,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Trash2,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  DollarSign,
  Calendar,
  FileSpreadsheet,
  Loader2,
  X,
  CreditCard,
  UserCheck
} from 'lucide-react';

const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'ilpu2026';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('ilpu_admin_authed') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL'); // ALL, india, international
  const [providerFilter, setProviderFilter] = useState('ALL'); // ALL, RAZORPAY_UPI, DIRECT_UPI, PAYPAL
  const [sortOrder, setSortOrder] = useState('NEWEST'); // NEWEST, OLDEST

  // Modals & Drawers
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBookingData, setNewBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'India',
    serviceTitle: '1-on-1 International Legal Strategy Consultation',
    region: 'india',
    amount: 589,
    notes: ''
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listBookingsApi();
      setBookings(data);
    } catch (err) {
      setError(err.message || 'Failed to load bookings database');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode.trim() === ADMIN_PASSCODE) {
      sessionStorage.setItem('ilpu_admin_authed', 'true');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Passcode. Please verify and try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ilpu_admin_authed');
    setIsAuthenticated(false);
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm(`Are you sure you want to delete booking ref ${bookingId}?`)) return;
    setDeletingId(bookingId);
    try {
      await deleteBookingApi(bookingId);
      setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId && b.id !== bookingId));
      if (selectedBooking && (selectedBooking.bookingId === bookingId || selectedBooking.id === bookingId)) {
        setSelectedBooking(null);
      }
    } catch (err) {
      alert(err.message || 'Error deleting booking');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateManualBooking = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await createManualBookingApi({
        serviceId: 'general-consultation',
        serviceTitle: newBookingData.serviceTitle,
        region: newBookingData.region,
        amount: newBookingData.region === 'india' ? 589 : 5,
        currency: newBookingData.region === 'india' ? 'INR' : 'USD',
        clientDetails: {
          name: newBookingData.name,
          email: newBookingData.email,
          phone: newBookingData.phone,
          country: newBookingData.country,
          notes: newBookingData.notes
        }
      });
      if (res.success) {
        setShowCreateModal(false);
        fetchBookings();
      }
    } catch (err) {
      alert(err.message || 'Error creating manual booking');
    } finally {
      setCreating(false);
    }
  };

  // Filter & Search Computation
  const filteredBookings = bookings
    .filter((b) => {
      const term = searchTerm.toLowerCase();
      const nameMatch = (b.clientDetails?.name || b.name || '').toLowerCase().includes(term);
      const emailMatch = (b.clientDetails?.email || b.email || '').toLowerCase().includes(term);
      const phoneMatch = (b.clientDetails?.phone || b.phone || '').toLowerCase().includes(term);
      const refMatch = (b.bookingId || b.id || '').toLowerCase().includes(term);
      const txnMatch = (b.transactionId || b.paypalOrderId || '').toLowerCase().includes(term);
      return nameMatch || emailMatch || phoneMatch || refMatch || txnMatch;
    })
    .filter((b) => {
      if (regionFilter === 'ALL') return true;
      return (b.region || 'india').toLowerCase() === regionFilter.toLowerCase();
    })
    .filter((b) => {
      if (providerFilter === 'ALL') return true;
      const prov = b.paymentProvider || (b.paypalOrderId?.startsWith('PAYPAL') ? 'PAYPAL' : 'DIRECT_UPI');
      return prov.toUpperCase().includes(providerFilter.toUpperCase());
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortOrder === 'NEWEST' ? dateB - dateA : dateA - dateB;
    });

  // Export CSV Helper
  const exportToCSV = () => {
    if (filteredBookings.length === 0) return;
    const headers = ['Booking Ref', 'Date', 'Client Name', 'Email', 'Phone', 'Country', 'Service Title', 'Region', 'Amount', 'Currency', 'Provider', 'Transaction ID', 'Status'];
    const rows = filteredBookings.map((b) => [
      `"${b.bookingId || b.id}"`,
      `"${b.createdAt ? new Date(b.createdAt).toLocaleString() : ''}"`,
      `"${b.clientDetails?.name || b.name || ''}"`,
      `"${b.clientDetails?.email || b.email || ''}"`,
      `"${b.clientDetails?.phone || b.phone || ''}"`,
      `"${b.clientDetails?.country || b.country || ''}"`,
      `"${b.serviceTitle || ''}"`,
      `"${b.region || ''}"`,
      `"${b.amount || ''}"`,
      `"${b.currency || ''}"`,
      `"${b.paymentProvider || 'PAYPAL'}"`,
      `"${b.transactionId || b.paypalOrderId || ''}"`,
      `"${b.status || 'PAID'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ILPU_Bookings_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics calculation
  const totalRevenueINR = bookings.filter((b) => (b.currency || 'INR') === 'INR').reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const totalRevenueUSD = bookings.filter((b) => b.currency === 'USD').reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060B18] text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-navy-card rounded-3xl border border-[#D4AF37]/40 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gold-gradient p-[1px] mx-auto">
              <div className="w-full h-full bg-[#060B18] rounded-[15px] flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#F3D079]" />
              </div>
            </div>
            <h2 className="font-cinzel text-2xl font-bold text-white">Chambers Admin Portal</h2>
            <p className="text-xs text-slate-400">Restricted access for Dr. Karanam Rajesh Kumar's executive office.</p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Enter Admin Passcode</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:border-[#D4AF37] outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-sm hover:brightness-110 transition-all border border-[#D4AF37]"
            >
              Authenticate & Unlock Admin Dashboard
            </button>
          </form>

          <div className="text-center">
            <Link to="/" className="text-xs text-slate-400 hover:text-[#F3D079] transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Site</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060B18] text-slate-100 font-sans selection:bg-[#D4AF37] selection:text-[#060B18] pb-24">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#060B18]/90 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-gradient p-[1px]">
              <div className="w-full h-full bg-[#060B18] rounded-[11px] flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#F3D079]" />
              </div>
            </div>
            <div>
              <span className="font-cinzel text-lg font-bold text-gold-gradient tracking-widest block leading-none">
                ILPU ADMIN DASHBOARD
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Live Booking & Revenue Control Center</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-2 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:brightness-110 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Client Record</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs hover:text-red-400 transition-colors"
            >
              Lock / Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-navy-card rounded-2xl border border-slate-800 p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Total Bookings</span>
              <Calendar className="w-4 h-4 text-[#F3D079]" />
            </div>
            <div className="font-cinzel text-3xl font-extrabold text-white">
              {bookings.length}
            </div>
            <span className="text-[10px] text-emerald-400 block">100% DB Synced</span>
          </div>

          <div className="bg-navy-card rounded-2xl border border-slate-800 p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Revenue (INR)</span>
              <span className="text-emerald-400 font-bold text-base">₹</span>
            </div>
            <div className="font-cinzel text-3xl font-extrabold text-emerald-400">
              ₹{totalRevenueINR.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400 block">India Resident Payments</span>
          </div>

          <div className="bg-navy-card rounded-2xl border border-slate-800 p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Revenue (USD)</span>
              <DollarSign className="w-4 h-4 text-[#F3D079]" />
            </div>
            <div className="font-cinzel text-3xl font-extrabold text-[#F3D079]">
              ${totalRevenueUSD.toLocaleString()} USD
            </div>
            <span className="text-[10px] text-slate-400 block">International PayPal Payments</span>
          </div>

          <div className="bg-navy-card rounded-2xl border border-slate-800 p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Active Verified Gateways</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs font-bold text-slate-200 space-y-0.5 pt-1">
              <span className="block text-emerald-400">✓ UPI (GPay, PhonePe, Paytm)</span>
              <span className="block text-emerald-400">✓ Razorpay Gateway</span>
              <span className="block text-emerald-400">✓ PayPal REST API v2</span>
            </div>
          </div>

        </div>

        {/* Filter & Action Toolbar */}
        <div className="bg-navy-card rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search Client Name, Email, Phone, Booking Ref..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              
              <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-xs">
                <Filter className="w-3.5 h-3.5 text-[#F3D079]" />
                <span className="text-slate-400">Region:</span>
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="bg-transparent text-white font-semibold outline-none cursor-pointer"
                >
                  <option value="ALL">All Regions</option>
                  <option value="india">India Resident</option>
                  <option value="international">International</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400">Provider:</span>
                <select
                  value={providerFilter}
                  onChange={(e) => setProviderFilter(e.target.value)}
                  className="bg-transparent text-white font-semibold outline-none cursor-pointer"
                >
                  <option value="ALL">All Gateways</option>
                  <option value="RAZORPAY">Razorpay</option>
                  <option value="DIRECT_UPI">UPI (GPay/PhonePe)</option>
                  <option value="PAYPAL">PayPal</option>
                  <option value="MANUAL">Manual</option>
                </select>
              </div>

              <button
                onClick={fetchBookings}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Refresh Records"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={exportToCSV}
                className="px-4 py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-600/30 transition-all"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export CSV</span>
              </button>

            </div>

          </div>
        </div>

        {/* Data Table */}
        <div className="bg-navy-card rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#F3D079] animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Fetching live database records...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400 text-xs space-y-2">
              <AlertCircle className="w-6 h-6 mx-auto" />
              <p>{error}</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs space-y-2">
              <UserCheck className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="font-semibold text-slate-300">No booking records match your filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-4">Ref ID / Date</th>
                    <th className="p-4">Client Name & Contact</th>
                    <th className="p-4">Service Selected</th>
                    <th className="p-4">Payment & Provider</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredBookings.map((b) => {
                    const client = b.clientDetails || {};
                    const name = client.name || b.name || 'Client';
                    const email = client.email || b.email || '';
                    const phone = client.phone || b.phone || '';
                    const provider = b.paymentProvider || (b.paypalOrderId?.startsWith('PAYPAL') ? 'PAYPAL' : 'DIRECT_UPI');

                    return (
                      <tr key={b.id || b.bookingId} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-4 font-mono">
                          <span className="font-bold text-white block">{b.bookingId || b.id}</span>
                          <span className="text-[10px] text-slate-400">
                            {b.createdAt ? new Date(b.createdAt).toLocaleString() : 'N/A'}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="font-bold text-slate-100 block">{name}</span>
                          <span className="text-[11px] text-slate-400 block">{email}</span>
                          <span className="text-[11px] text-slate-400 block">{phone}</span>
                        </td>

                        <td className="p-4 max-w-xs">
                          <span className="font-semibold text-slate-200 block truncate">{b.serviceTitle}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">{b.region === 'india' ? '🇮🇳 India Resident' : '🌐 International'}</span>
                        </td>

                        <td className="p-4 font-mono text-[11px]">
                          <span className="px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] bg-slate-900 border border-slate-700 text-[#F3D079] inline-block mb-1">
                            {provider}
                          </span>
                          <span className="text-slate-400 block text-[10px] truncate max-w-[140px]" title={b.transactionId || b.paypalOrderId}>
                            Ref: {b.transactionId || b.paypalOrderId}
                          </span>
                        </td>

                        <td className="p-4 font-cinzel text-sm font-extrabold text-[#F3D079]">
                          {b.currency === 'INR' ? `₹${b.amount} INR` : `$${b.amount} USD`}
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/40 text-emerald-400">
                            {b.status || 'PAID'}
                          </span>
                        </td>

                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-[#F3D079] hover:bg-slate-800 transition-colors"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleDelete(b.bookingId || b.id)}
                            disabled={deletingId === (b.bookingId || b.id)}
                            className="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            {deletingId === (b.bookingId || b.id) ? '...' : <Trash2 className="w-3.5 h-3.5 inline" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Detail Drawer Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#0A1128] border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#F3D079]">
                Ref: {selectedBooking.bookingId || selectedBooking.id}
              </span>
              <h3 className="font-cinzel text-xl font-bold text-white">Client Booking & Legal Details</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Client Name</span>
                <span className="text-sm font-bold text-white block">{selectedBooking.clientDetails?.name || selectedBooking.name}</span>
                <span className="text-slate-300 block">{selectedBooking.clientDetails?.email || selectedBooking.email}</span>
                <span className="text-slate-300 block">{selectedBooking.clientDetails?.phone || selectedBooking.phone}</span>
                <span className="text-slate-400 block">Country: {selectedBooking.clientDetails?.country || selectedBooking.country}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Service Requested</span>
                <span className="text-sm font-semibold text-[#F3D079] block">{selectedBooking.serviceTitle}</span>
                <span className="text-slate-300 block">Pricing Tier: {selectedBooking.pricingTier || selectedBooking.amountPaid}</span>
              </div>

              {selectedBooking.clientDetails?.notes && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">Case Notes / Brief Summary</span>
                  <p className="text-slate-200 font-light italic">"{selectedBooking.clientDetails.notes}"</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Create Manual Booking Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0A1128] border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="font-cinzel text-xl font-bold text-white">Manual Client Booking</h3>
              <p className="text-xs text-slate-400">Record a offline / direct chamber legal booking.</p>
            </div>

            <form onSubmit={handleCreateManualBooking} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Sharma"
                  value={newBookingData.name}
                  onChange={(e) => setNewBookingData({ ...newBookingData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={newBookingData.email}
                    onChange={(e) => setNewBookingData({ ...newBookingData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={newBookingData.phone}
                    onChange={(e) => setNewBookingData({ ...newBookingData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Region</label>
                <select
                  value={newBookingData.region}
                  onChange={(e) => setNewBookingData({ ...newBookingData, region: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-[#D4AF37]"
                >
                  <option value="india">India Resident (₹589 INR)</option>
                  <option value="international">International ($5 USD)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Case Summary / Notes</label>
                <textarea
                  rows="2"
                  placeholder="Direct chamber consultation notes..."
                  value={newBookingData.notes}
                  onChange={(e) => setNewBookingData({ ...newBookingData, notes: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-[#D4AF37]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-xs hover:brightness-110 border border-[#D4AF37] flex items-center justify-center gap-2"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Record Manual Booking</span>}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
