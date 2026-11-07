import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  adminLoginApi,
  verifyAdminSessionApi,
  adminLogout,
  listBookingsApi,
  deleteBookingApi,
  createManualBookingApi,
  listServiceConfigsApi,
  updateServiceConfigApi,
  resetServiceConfigApi,
  listAllPricingAdminApi,
  createPricingPlanApi,
  updatePricingPlanApi,
  togglePlanStatusApi,
  reorderPricingPlansApi,
  deletePricingPlanApi,
  getGstConfigAdminApi,
  updateGstConfigAdminApi,
  getAuditLogsApi
} from '../services/api';
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
  UserCheck,
  Users,
  Link2,
  Save,
  RotateCcw,
  Check,
  ExternalLink,
  Sparkles,
  Tag,
  Percent,
  History,
  Eye,
  ArrowUp,
  ArrowDown,
  Edit2,
  Calculator,
  ShieldAlert
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(sessionStorage.getItem('ilpu_admin_token') && sessionStorage.getItem('ilpu_admin_authed') === 'true');
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);

  // Active Tab: 'bookings' | 'pricing' | 'gst' | 'whatsapp' | 'audit'
  const [activeTab, setActiveTab] = useState('bookings');

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL'); // ALL, india, international
  const [providerFilter, setProviderFilter] = useState('ALL'); // ALL, RAZORPAY, DIRECT_UPI, MANUAL
  const [sortOrder, setSortOrder] = useState('NEWEST'); // NEWEST, OLDEST

  // Service WhatsApp Configs State
  const [serviceConfigs, setServiceConfigs] = useState([]);
  const [loadingConfigs, setLoadingConfigs] = useState(false);
  const [savingServiceId, setSavingServiceId] = useState(null);
  const [configSaveNotice, setConfigSaveNotice] = useState(null);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newServiceConfigData, setNewServiceConfigData] = useState({
    serviceId: '',
    serviceTitle: '',
    whatsappGroupLink: '',
    whatsappChannelName: ''
  });
  const [creatingServiceConfig, setCreatingServiceConfig] = useState(false);

  // Dynamic Pricing State
  const [pricingPlans, setPricingPlans] = useState([]);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null); // null = not editing, object = plan being edited
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [previewPlanModal, setPreviewPlanModal] = useState(null);
  const [previewRegion, setPreviewRegion] = useState('india');

  const defaultPlanFormData = {
    planId: '',
    serviceId: '',
    name: '',
    subtitle: '',
    description: '',
    pricingType: 'one-time',
    billingInterval: null,
    priceIndia: 499,
    originalPriceIndia: 1999,
    priceInternational: 5,
    originalPriceInternational: 25,
    featuresText: '',
    deliverablesText: '',
    badge: 'Priority Advisory',
    isActive: true,
    applicableGstRate: ''
  };
  const [planFormData, setPlanFormData] = useState(defaultPlanFormData);

  // Dynamic GST State
  const [gstConfig, setGstConfig] = useState({
    gstEnabled: true,
    defaultRate: 18,
    isInclusive: false,
    hsnSacCode: '998211',
    taxName: 'GST',
    description: 'Goods and Services Tax on legal consultancy'
  });
  const [gstHistory, setGstHistory] = useState([]);
  const [loadingGst, setLoadingGst] = useState(false);
  const [savingGst, setSavingGst] = useState(false);
  const [testBaseAmount, setTestBaseAmount] = useState(10000);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Booking Modals & Drawers
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBookingData, setNewBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'India',
    serviceTitle: '1-on-1 International Legal Strategy Consultation',
    serviceId: 'general-consultation',
    region: 'india',
    amount: 589,
    notes: ''
  });
  const [creating, setCreating] = useState(false);

  // Verify session on mount
  useEffect(() => {
    const token = sessionStorage.getItem('ilpu_admin_token');
    if (token) {
      verifyAdminSessionApi()
        .then(() => {
          setIsAuthenticated(true);
        })
        .catch(() => {
          adminLogout();
          setIsAuthenticated(false);
        });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllAdminData();
    }
  }, [isAuthenticated]);

  const fetchAllAdminData = () => {
    fetchBookings();
    fetchServiceConfigs();
    fetchPricingPlans();
    fetchGstConfig();
    fetchAuditLogs();
  };

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

  const fetchServiceConfigs = async () => {
    setLoadingConfigs(true);
    try {
      const configs = await listServiceConfigsApi();
      setServiceConfigs(configs);
    } catch (err) {
      console.error('Error loading service WhatsApp configs:', err);
    } finally {
      setLoadingConfigs(false);
    }
  };

  const fetchPricingPlans = async () => {
    setLoadingPricing(true);
    try {
      const res = await listAllPricingAdminApi();
      setPricingPlans(res.plans);
    } catch (err) {
      console.error('Error loading pricing plans:', err);
    } finally {
      setLoadingPricing(false);
    }
  };

  const fetchGstConfig = async () => {
    setLoadingGst(true);
    try {
      const res = await getGstConfigAdminApi();
      if (res.config) {
        setGstConfig(res.config);
      }
      setGstHistory(res.changeHistory || []);
    } catch (err) {
      console.error('Error loading GST settings:', err);
    } finally {
      setLoadingGst(false);
    }
  };

  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const logs = await getAuditLogsApi(100);
      setAuditLogs(logs);
    } catch (err) {
      console.error('Error loading audit logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const [isPendingDeploy, setIsPendingDeploy] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthenticating(true);
    setAuthError('');
    try {
      const res = await adminLoginApi(passcode);
      if (res.isPendingDeployment) {
        setIsPendingDeploy(true);
      }
      setIsAuthenticated(true);
      setPasscode('');
    } catch (err) {
      setAuthError(err.message || 'Invalid Admin Passcode. Please try again.');
    } finally {
      setAuthenticating(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
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
      alert('Delete failed: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateManualBooking = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await createManualBookingApi(newBookingData);
      setBookings((prev) => [res.booking, ...prev]);
      setShowCreateModal(false);
      setNewBookingData({
        name: '',
        email: '',
        phone: '',
        country: 'India',
        serviceTitle: '1-on-1 International Legal Strategy Consultation',
        serviceId: 'general-consultation',
        region: 'india',
        amount: 589,
        notes: ''
      });
      alert('Manual booking successfully recorded and verified!');
    } catch (err) {
      alert('Failed to create manual booking: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  // WhatsApp Config Handlers
  const handleServiceConfigChange = (serviceId, field, value) => {
    setServiceConfigs((prev) =>
      prev.map((cfg) => (cfg.serviceId === serviceId ? { ...cfg, [field]: value } : cfg))
    );
  };

  const handleSaveServiceConfig = async (serviceId) => {
    const configToSave = serviceConfigs.find((c) => c.serviceId === serviceId);
    if (!configToSave) return;

    setSavingServiceId(serviceId);
    try {
      await updateServiceConfigApi(serviceId, configToSave);
      setConfigSaveNotice(`WhatsApp link saved and synced for "${configToSave.serviceTitle}"`);
      setTimeout(() => setConfigSaveNotice(null), 4000);
    } catch (err) {
      alert(`Save failed for ${serviceId}: ${err.message}`);
    } finally {
      setSavingServiceId(null);
    }
  };

  const handleResetServiceConfig = async (serviceId) => {
    if (!window.confirm(`Reset WhatsApp link for "${serviceId}" back to default?`)) return;
    setSavingServiceId(serviceId);
    try {
      const res = await resetServiceConfigApi(serviceId);
      setServiceConfigs((prev) =>
        prev.map((c) => (c.serviceId === serviceId ? { ...c, whatsappGroupLink: res.whatsappGroupLink } : c))
      );
      setConfigSaveNotice(`WhatsApp link reset to default for "${serviceId}"`);
      setTimeout(() => setConfigSaveNotice(null), 4000);
    } catch (err) {
      alert(`Reset failed: ${err.message}`);
    } finally {
      setSavingServiceId(null);
    }
  };

  const handleCreateServiceConfig = async (e) => {
    e.preventDefault();
    setCreatingServiceConfig(true);
    try {
      const sanitizedId = newServiceConfigData.serviceId.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
      const payload = {
        ...newServiceConfigData,
        serviceId: sanitizedId
      };
      await updateServiceConfigApi(sanitizedId, payload);
      await fetchServiceConfigs();
      setShowAddServiceModal(false);
      setNewServiceConfigData({
        serviceId: '',
        serviceTitle: '',
        whatsappGroupLink: '',
        whatsappChannelName: ''
      });
      setConfigSaveNotice(`Successfully added practice area "${payload.serviceTitle}"`);
      setTimeout(() => setConfigSaveNotice(null), 4000);
    } catch (err) {
      alert(`Error creating service WhatsApp link: ${err.message}`);
    } finally {
      setCreatingServiceConfig(false);
    }
  };

  // Pricing Plan CRUD Handlers
  const handleOpenAddPlan = () => {
    setEditingPlan(null);
    setPlanFormData(defaultPlanFormData);
    setShowPlanModal(true);
  };

  const handleOpenEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanFormData({
      planId: plan.planId,
      serviceId: plan.serviceId,
      name: plan.name,
      subtitle: plan.subtitle || '',
      description: plan.description || '',
      pricingType: plan.pricingType || 'one-time',
      billingInterval: plan.billingInterval || null,
      priceIndia: plan.priceIndia,
      originalPriceIndia: plan.originalPriceIndia || '',
      priceInternational: plan.priceInternational,
      originalPriceInternational: plan.originalPriceInternational || '',
      featuresText: Array.isArray(plan.features) ? plan.features.join('\n') : '',
      deliverablesText: Array.isArray(plan.deliverables) ? plan.deliverables.join('\n') : '',
      badge: plan.badge || '',
      isActive: plan.isActive !== false,
      applicableGstRate: plan.applicableGstRate !== null && plan.applicableGstRate !== undefined ? plan.applicableGstRate : ''
    });
    setShowPlanModal(true);
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    setSavingPlan(true);

    const features = planFormData.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const deliverables = planFormData.deliverablesText
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    const payload = {
      serviceId: planFormData.serviceId.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-'),
      name: planFormData.name.trim(),
      subtitle: planFormData.subtitle.trim(),
      description: planFormData.description.trim(),
      pricingType: planFormData.pricingType,
      billingInterval: planFormData.pricingType === 'recurring' ? (planFormData.billingInterval || 'monthly') : null,
      priceIndia: Number(planFormData.priceIndia),
      originalPriceIndia: planFormData.originalPriceIndia ? Number(planFormData.originalPriceIndia) : null,
      priceInternational: Number(planFormData.priceInternational),
      originalPriceInternational: planFormData.originalPriceInternational ? Number(planFormData.originalPriceInternational) : null,
      features,
      deliverables,
      badge: planFormData.badge.trim(),
      isActive: Boolean(planFormData.isActive),
      applicableGstRate: planFormData.applicableGstRate !== '' ? Number(planFormData.applicableGstRate) : null
    };

    try {
      if (editingPlan) {
        await updatePricingPlanApi(editingPlan.planId, payload);
        setConfigSaveNotice(`Pricing plan "${payload.name}" updated successfully`);
      } else {
        await createPricingPlanApi(payload);
        setConfigSaveNotice(`New pricing plan "${payload.name}" created successfully`);
      }
      setShowPlanModal(false);
      await fetchPricingPlans();
      await fetchAuditLogs();
      setTimeout(() => setConfigSaveNotice(null), 4000);
    } catch (err) {
      alert(`Failed to save plan: ${err.message}`);
    } finally {
      setSavingPlan(false);
    }
  };

  const handleTogglePlanStatus = async (planId, currentStatus) => {
    try {
      await togglePlanStatusApi(planId, !currentStatus);
      setPricingPlans((prev) =>
        prev.map((p) => (p.planId === planId ? { ...p, isActive: !currentStatus } : p))
      );
      setConfigSaveNotice(`Plan ${planId} is now ${!currentStatus ? 'Active' : 'Deactivated'}`);
      await fetchAuditLogs();
      setTimeout(() => setConfigSaveNotice(null), 3000);
    } catch (err) {
      alert(`Failed to toggle plan status: ${err.message}`);
    }
  };

  const handleDeletePlan = async (planId, planName) => {
    if (!window.confirm(`Permanently delete pricing plan "${planName}" (${planId})?`)) return;
    try {
      await deletePricingPlanApi(planId);
      setPricingPlans((prev) => prev.filter((p) => p.planId !== planId));
      setConfigSaveNotice(`Pricing plan "${planName}" deleted`);
      await fetchAuditLogs();
      setTimeout(() => setConfigSaveNotice(null), 3000);
    } catch (err) {
      alert(`Delete plan error: ${err.message}`);
    }
  };

  const handleMovePlanOrder = async (index, direction) => {
    const newPlans = [...pricingPlans];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newPlans.length) return;

    const temp = newPlans[index];
    newPlans[index] = newPlans[targetIdx];
    newPlans[targetIdx] = temp;

    setPricingPlans(newPlans);

    const orderedIds = newPlans.map((p) => p.planId);
    try {
      await reorderPricingPlansApi(orderedIds);
      await fetchAuditLogs();
    } catch (err) {
      console.error('Reorder error:', err);
      fetchPricingPlans();
    }
  };

  // GST Settings Handlers
  const handleSaveGstConfig = async (e) => {
    e.preventDefault();
    setSavingGst(true);
    try {
      await updateGstConfigAdminApi({
        gstEnabled: Boolean(gstConfig.gstEnabled),
        defaultRate: Number(gstConfig.defaultRate),
        isInclusive: Boolean(gstConfig.isInclusive),
        hsnSacCode: String(gstConfig.hsnSacCode).trim(),
        taxName: String(gstConfig.taxName).trim(),
        description: String(gstConfig.description).trim()
      });
      setConfigSaveNotice('GST configuration updated and applied sitewide!');
      await fetchGstConfig();
      await fetchPricingPlans(); // Recalculate plans
      await fetchAuditLogs();
      setTimeout(() => setConfigSaveNotice(null), 4000);
    } catch (err) {
      alert(`Failed to update GST config: ${err.message}`);
    } finally {
      setSavingGst(false);
    }
  };

  // Live GST Test Calculations
  const calcTestGst = () => {
    const amount = Number(testBaseAmount) || 0;
    const rate = gstConfig.gstEnabled ? Number(gstConfig.defaultRate) || 0 : 0;
    if (!gstConfig.gstEnabled || rate === 0) {
      return { base: amount, gst: 0, total: amount };
    }
    if (gstConfig.isInclusive) {
      const base = Math.round((amount / (1 + rate / 100)) * 100) / 100;
      const gst = Math.round((amount - base) * 100) / 100;
      return { base, gst, total: amount };
    } else {
      const gst = Math.round(((amount * rate) / 100) * 100) / 100;
      const total = Math.round((amount + gst) * 100) / 100;
      return { base: amount, gst, total };
    }
  };

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const term = searchTerm.toLowerCase();
    const clientName = (b.clientDetails?.name || b.name || '').toLowerCase();
    const clientEmail = (b.clientDetails?.email || b.email || '').toLowerCase();
    const clientPhone = (b.clientDetails?.phone || b.phone || '').toLowerCase();
    const serviceTitle = (b.serviceTitle || '').toLowerCase();
    const refId = (b.bookingId || b.id || '').toLowerCase();

    const matchesSearch =
      clientName.includes(term) ||
      clientEmail.includes(term) ||
      clientPhone.includes(term) ||
      serviceTitle.includes(term) ||
      refId.includes(term);

    const matchesRegion = regionFilter === 'ALL' || b.region === regionFilter;
    const matchesProvider = providerFilter === 'ALL' || b.paymentProvider === providerFilter;

    return matchesSearch && matchesRegion && matchesProvider;
  }).sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return sortOrder === 'NEWEST' ? timeB - timeA : timeA - timeB;
  });

  const totalRevenueINR = bookings
    .filter((b) => b.currency === 'INR' && b.status === 'PAID')
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  const totalRevenueUSD = bookings
    .filter((b) => b.currency === 'USD' && b.status === 'PAID')
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060B18] text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-navy-card rounded-2xl border border-slate-800 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-gold-gradient p-[1px] mx-auto">
              <div className="w-full h-full bg-[#060B18] rounded-[11px] flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#F3D079]" />
              </div>
            </div>
            <h1 className="font-cinzel text-xl font-bold text-white tracking-wider">
              ILPU EXECUTIVE PORTAL
            </h1>
            <p className="text-xs text-slate-400">
              Authenticated Admin Access • Dynamic Pricing & System Security
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Administrator Passcode
              </label>
              <input
                type="password"
                required
                autoFocus
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter secret administrator passcode"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-[#D4AF37] font-mono tracking-widest"
              />
            </div>
            <button
              type="submit"
              disabled={authenticating}
              className="w-full py-3.5 rounded-xl bg-gold-gradient text-slate-950 font-bold text-sm hover:brightness-110 transition-all border border-[#D4AF37] flex items-center justify-center gap-2 shadow-lg"
            >
              {authenticating ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Authenticate & Unlock Admin Portal</span>}
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
                ILPU ADMIN PORTAL
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Dynamic Pricing • GST • Security Control</span>
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
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'bookings'
                ? 'bg-gold-gradient text-slate-950 shadow-lg shadow-[#D4AF37]/20 border border-[#D4AF37]'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Bookings ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'pricing'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 border border-amber-300'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Dynamic Pricing ({pricingPlans.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gst')}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'gst'
                ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/20 border border-blue-400'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>GST Settings ({gstConfig.gstEnabled ? `${gstConfig.defaultRate}%` : 'Off'})</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 border border-emerald-400'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>WhatsApp Groups ({serviceConfigs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'audit'
                ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/20 border border-purple-400'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Logs ({auditLogs.length})</span>
          </button>
        </div>

        {/* Global Save Notice Banner */}
        {configSaveNotice && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{configSaveNotice}</span>
          </div>
        )}

        {/* Remote Render Deployment Pending Notice */}
        {isPendingDeploy && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs flex items-start sm:items-center justify-between gap-3 animate-fadeIn shadow-lg">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold block">Render Remote Backend Pending Deployment</span>
                <span className="text-[11px] text-slate-300 block mt-0.5">
                  Your live Render service (<code>ilpu.onrender.com</code>) is still running your previous deployment. Run <code>git push origin main</code> from your terminal to activate the new backend endpoints.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsPendingDeploy(false)}
              className="text-amber-400 hover:text-white p-1"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TAB 1: CLIENT BOOKINGS & REVENUE */}
        {activeTab === 'bookings' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-navy-card p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Total Bookings</span>
                <span className="font-cinzel text-3xl font-bold text-white block">{bookings.length}</span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified paid sessions
                </span>
              </div>

              <div className="bg-navy-card p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">India Domestic Revenue</span>
                <span className="font-cinzel text-3xl font-bold text-[#F3D079] block">₹{totalRevenueINR.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-slate-400">Total INR consultations booked</span>
              </div>

              <div className="bg-navy-card p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">International Revenue</span>
                <span className="font-cinzel text-3xl font-bold text-blue-400 block">${totalRevenueUSD.toLocaleString()} USD</span>
                <span className="text-[11px] text-slate-400">Global diaspora & foreign ventures</span>
              </div>

              <div className="bg-navy-card p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Active Services</span>
                <span className="font-cinzel text-3xl font-bold text-emerald-400 block">{serviceConfigs.length}</span>
                <span className="text-[11px] text-slate-400">All configured with private WhatsApp channels</span>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-navy-card p-4 rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
                
                <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by client name, email, phone or booking ref..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-[#D4AF37]"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3 text-slate-500 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                  
                  <select
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-[#D4AF37]"
                  >
                    <option value="ALL">All Regions</option>
                    <option value="india">India (Domestic)</option>
                    <option value="international">International (USD)</option>
                  </select>

                  <select
                    value={providerFilter}
                    onChange={(e) => setProviderFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-[#D4AF37]"
                  >
                    <option value="ALL">All Gateways</option>
                    <option value="RAZORPAY">Razorpay</option>
                    <option value="DIRECT_UPI">Direct UPI</option>
                    <option value="MANUAL_ADMIN">Manual / Chamber</option>
                  </select>

                  <button
                    onClick={fetchBookings}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                    title="Reload Database"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>

                </div>

              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-navy-card rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
              {loading ? (
                <div className="py-16 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-[#F3D079] animate-spin mx-auto" />
                  <p className="text-xs text-slate-400 font-mono">Fetching database records...</p>
                </div>
              ) : error ? (
                <div className="py-12 text-center text-red-400 text-xs space-y-2">
                  <AlertCircle className="w-6 h-6 mx-auto text-red-400" />
                  <span>{error}</span>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="py-16 text-center space-y-3 text-slate-400">
                  <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold">No booking records found matching your filter.</p>
                  <span className="text-xs text-slate-500 block">Try clearing your search term or region filters.</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-4 px-4">Ref ID & Date</th>
                        <th className="py-4 px-4">Client Info</th>
                        <th className="py-4 px-4">Service & Region</th>
                        <th className="py-4 px-4">Amount & Tax</th>
                        <th className="py-4 px-4">Provider</th>
                        <th className="py-4 px-4 text-center">Status</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredBookings.map((b) => {
                        const clientName = b.clientDetails?.name || b.name || 'Client';
                        const clientEmail = b.clientDetails?.email || b.email || 'N/A';
                        const clientPhone = b.clientDetails?.phone || b.phone || 'N/A';
                        const country = b.clientDetails?.country || b.country || 'N/A';

                        return (
                          <tr key={b.bookingId || b.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="py-4 px-4">
                              <span className="font-mono font-bold text-white block text-xs">
                                {b.bookingId || b.id}
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {b.createdAt ? new Date(b.createdAt).toLocaleString() : 'Recent'}
                              </span>
                            </td>

                            <td className="py-4 px-4">
                              <span className="font-semibold text-slate-200 block text-xs">{clientName}</span>
                              <span className="text-[11px] text-slate-400 block">{clientEmail}</span>
                              <span className="text-[11px] text-slate-400 block">{clientPhone}</span>
                            </td>

                            <td className="py-4 px-4 max-w-xs">
                              <span className="font-medium text-slate-200 block truncate" title={b.serviceTitle}>
                                {b.serviceTitle || 'Legal Strategy Consultation'}
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {b.region === 'india' ? '🇮🇳 India Resident' : '🌐 International Client'} • {country}
                              </span>
                            </td>

                            <td className="py-4 px-4 font-mono font-bold text-[#F3D079]">
                              <div>{b.currency === 'INR' ? `₹${b.amount}` : `$${b.amount} USD`}</div>
                              {b.gstAmount ? (
                                <div className="text-[10px] text-slate-400 font-normal">
                                  Base: ₹{b.basePrice} + GST: ₹{b.gstAmount} ({b.gstRate}%)
                                </div>
                              ) : null}
                            </td>

                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 uppercase">
                                {b.paymentProvider || 'RAZORPAY'}
                              </span>
                            </td>

                            <td className="py-4 px-4 text-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>PAID</span>
                              </span>
                            </td>

                            <td className="py-4 px-4 text-right space-x-2">
                              <button
                                onClick={() => setSelectedBooking(b)}
                                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
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
          </div>
        )}

        {/* TAB 2: DYNAMIC PRICING PLANS */}
        {activeTab === 'pricing' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-navy-card rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Tag className="w-6 h-6 text-amber-400" />
                  <h2 className="font-cinzel text-xl font-bold text-white">Dynamic Pricing Management</h2>
                </div>
                <p className="text-xs text-slate-300 font-light mt-1 max-w-2xl leading-relaxed">
                  Manage all service pricing, discounts, one-time vs recurring structures, and deliverables. All updates are stored securely and immediately reflect sitewide.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenAddPlan}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-300 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Pricing Plan</span>
                </button>
                <button
                  onClick={fetchPricingPlans}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  title="Reload Plans"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingPricing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {loadingPricing ? (
              <div className="py-16 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-mono">Loading pricing plans...</p>
              </div>
            ) : (
              <div className="bg-navy-card rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-4 px-3 text-center">Order</th>
                        <th className="py-4 px-4">Plan Name & Service</th>
                        <th className="py-4 px-4">India Pricing (INR)</th>
                        <th className="py-4 px-4">International (USD)</th>
                        <th className="py-4 px-4">Type</th>
                        <th className="py-4 px-4 text-center">Status</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {pricingPlans.map((p, idx) => (
                        <tr key={p.planId} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-4 px-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <button
                                onClick={() => handleMovePlanOrder(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-[10px] font-mono text-slate-500">{p.sortOrder || idx + 1}</span>
                              <button
                                onClick={() => handleMovePlanOrder(idx, 'down')}
                                disabled={idx === pricingPlans.length - 1}
                                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          <td className="py-4 px-4 max-w-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs">{p.name}</span>
                              {p.badge && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#D4AF37]/10 text-[#F3D079] border border-[#D4AF37]/30">
                                  {p.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 block line-clamp-1 mt-0.5">
                              {p.subtitle || p.description}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 block mt-1">
                              Slug: {p.serviceId} • ID: {p.planId}
                            </span>
                          </td>

                          <td className="py-4 px-4 font-mono">
                            <div className="font-bold text-[#F3D079] text-sm">₹{p.priceIndia}</div>
                            {p.originalPriceIndia && (
                              <div className="text-[10px] text-slate-500 line-through">₹{p.originalPriceIndia}</div>
                            )}
                            <div className="text-[10px] text-slate-400">
                              {p.calculations?.india?.formattedTotal || `+ ${gstConfig.defaultRate}% GST`}
                            </div>
                          </td>

                          <td className="py-4 px-4 font-mono">
                            <div className="font-bold text-blue-400 text-sm">${p.priceInternational} USD</div>
                            {p.originalPriceInternational && (
                              <div className="text-[10px] text-slate-500 line-through">${p.originalPriceInternational}</div>
                            )}
                            <div className="text-[10px] text-slate-400">0% Export GST</div>
                          </td>

                          <td className="py-4 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 border border-slate-800 text-slate-300 uppercase">
                              {p.pricingType || 'one-time'}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleTogglePlanStatus(p.planId, p.isActive !== false)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                                p.isActive !== false
                                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                  : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              {p.isActive !== false ? 'Active' : 'Disabled'}
                            </button>
                          </td>

                          <td className="py-4 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => setPreviewPlanModal(p)}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                              title="Live Preview"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditPlan(p)}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 hover:bg-amber-400/10 transition-colors"
                              title="Edit Plan"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePlan(p.planId, p.name)}
                              className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                              title="Delete Plan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DYNAMIC GST MANAGEMENT */}
        {activeTab === 'gst' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-navy-card rounded-2xl border border-slate-800 p-6 shadow-xl">
              <div className="flex items-center gap-2">
                <Percent className="w-6 h-6 text-blue-400" />
                <h2 className="font-cinzel text-xl font-bold text-white">Dynamic GST & Tax Management</h2>
              </div>
              <p className="text-xs text-slate-300 font-light mt-1 max-w-2xl leading-relaxed">
                Configure GST taxation rules dynamically. Switch between tax-inclusive and tax-exclusive pricing, set applicable HSN/SAC codes, and simulate calculations in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form Config */}
              <div className="lg:col-span-2 bg-navy-card rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
                <form onSubmit={handleSaveGstConfig} className="space-y-5 text-xs">
                  
                  {/* Enable GST Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <span className="font-semibold text-white block">Enable GST Calculations</span>
                      <span className="text-[11px] text-slate-400 block">
                        If disabled, all consultations will be charged at base price without tax.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gstConfig.gstEnabled}
                        onChange={(e) => setGstConfig({ ...gstConfig, gstEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Default GST Percentage (%) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        required
                        value={gstConfig.defaultRate}
                        onChange={(e) => setGstConfig({ ...gstConfig, defaultRate: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white font-mono text-sm outline-none focus:border-blue-400"
                      />
                      <span className="text-[10px] text-slate-500 block mt-1">Standard legal consulting rate is 18.00%</span>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        HSN / SAC Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={gstConfig.hsnSacCode || ''}
                        onChange={(e) => setGstConfig({ ...gstConfig, hsnSacCode: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white font-mono text-sm outline-none focus:border-blue-400"
                      />
                      <span className="text-[10px] text-slate-500 block mt-1">998211: Legal advisory and documentation</span>
                    </div>
                  </div>

                  {/* Pricing Mode: Inclusive vs Exclusive */}
                  <div className="space-y-2">
                    <label className="block text-slate-300 font-semibold">
                      Tax Pricing Computation Model *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label
                        onClick={() => setGstConfig({ ...gstConfig, isInclusive: false })}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                          !gstConfig.isInclusive
                            ? 'bg-blue-600/10 border-blue-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="taxMode"
                          checked={!gstConfig.isInclusive}
                          onChange={() => {}}
                          className="mt-1"
                        />
                        <div>
                          <span className="font-bold text-xs block text-white">Tax-Exclusive (Default)</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Price is base amount. GST is added on top. (e.g. ₹499 + 18% GST = ₹588.82)
                          </span>
                        </div>
                      </label>

                      <label
                        onClick={() => setGstConfig({ ...gstConfig, isInclusive: true })}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                          gstConfig.isInclusive
                            ? 'bg-blue-600/10 border-blue-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="taxMode"
                          checked={gstConfig.isInclusive}
                          onChange={() => {}}
                          className="mt-1"
                        />
                        <div>
                          <span className="font-bold text-xs block text-white">Tax-Inclusive</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Displayed price already includes GST. (e.g. ₹499 total, base ₹422.88 + ₹76.12 GST)
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Tax Label / Name</label>
                      <input
                        type="text"
                        value={gstConfig.taxName || ''}
                        onChange={(e) => setGstConfig({ ...gstConfig, taxName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Official Description</label>
                      <input
                        type="text"
                        value={gstConfig.description || ''}
                        onChange={(e) => setGstConfig({ ...gstConfig, description: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={savingGst}
                      className="px-6 py-3 rounded-xl bg-blue-500 text-slate-950 font-bold text-xs hover:bg-blue-400 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                      {savingGst ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>Save & Apply Sitewide GST Settings</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Live Calculator Sandbox */}
              <div className="bg-navy-card rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Calculator className="w-5 h-5 text-blue-400" />
                  <h3 className="font-cinzel text-base font-bold text-white">Interactive Tax Sandbox</h3>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Test Price / Amount (₹ INR)</label>
                  <input
                    type="number"
                    value={testBaseAmount}
                    onChange={(e) => setTestBaseAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white font-mono font-bold text-base outline-none focus:border-blue-400"
                  />
                  <div className="flex gap-2 pt-1">
                    {[499, 1999, 4999, 10000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTestBaseAmount(amt)}
                        className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 hover:text-white"
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculation Output Card */}
                {(() => {
                  const result = calcTestGst();
                  return (
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Base Price:</span>
                        <span className="text-white font-bold">₹{result.base.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>GST ({gstConfig.gstEnabled ? `${gstConfig.defaultRate}%` : '0%'}):</span>
                        <span className="text-blue-400 font-bold">₹{result.gst.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="border-t border-slate-800 pt-2 flex justify-between text-sm">
                        <span className="text-white font-bold">Final Payable:</span>
                        <span className="text-[#F3D079] font-bold text-base">₹{result.total.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-sans italic pt-1">
                        Mode: {gstConfig.isInclusive ? 'GST Inclusive in price' : 'GST Added to base price'} • HSN: {gstConfig.hsnSacCode}
                      </div>
                    </div>
                  );
                })()}

                {/* GST History Preview */}
                {gstHistory.length > 0 && (
                  <div className="space-y-2 border-t border-slate-800 pt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Recent GST Changes ({gstHistory.length})
                    </span>
                    <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                      {gstHistory.slice(0, 5).map((h, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px]">
                          <div className="flex justify-between text-slate-300">
                            <span className="font-semibold">{h.changeSummary || 'GST Updated'}</span>
                            <span className="text-slate-500">{new Date(h.timestamp).toLocaleDateString()}</span>
                          </div>
                          <span className="text-slate-500 block mt-0.5">By {h.changedBy || 'Admin'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: SERVICE-SPECIFIC WHATSAPP GROUPS & CHANNELS */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-navy-card rounded-2xl border border-slate-800 p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-emerald-400" />
                  <h2 className="font-cinzel text-xl font-bold text-white">
                    Service-Specific WhatsApp Groups & Channels
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddServiceModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Service WhatsApp Link</span>
                  </button>
                  <button
                    onClick={fetchServiceConfigs}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                    title="Reload Configs"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingConfigs ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-light leading-relaxed max-w-3xl">
                Configure distinct WhatsApp Group / Channel join links for each individual practice area. When a client successfully completes payment for a specific service, the system verifies their payment and grants access <strong>strictly</strong> to that service's WhatsApp channel.
              </p>
            </div>

            {loadingConfigs ? (
              <div className="py-16 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#F3D079] animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-mono">Loading service WhatsApp links database...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {serviceConfigs.map((cfg) => {
                  const isSaving = savingServiceId === cfg.serviceId;

                  return (
                    <div
                      key={cfg.serviceId}
                      className="bg-navy-card rounded-2xl border border-slate-800 p-6 space-y-5 shadow-xl hover:border-[#D4AF37]/40 transition-colors"
                    >
                      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                        <div>
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 text-[#F3D079] uppercase block w-fit mb-1">
                            ID: {cfg.serviceId}
                          </span>
                          <h3 className="font-cinzel text-base font-bold text-white">
                            {cfg.serviceTitle}
                          </h3>
                        </div>

                        <a
                          href={cfg.whatsappGroupLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-1 shrink-0"
                          title="Test Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Test</span>
                        </a>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp Group / Channel Invite Link *</span>
                        </label>
                        <input
                          type="url"
                          required
                          placeholder="https://chat.whatsapp.com/..."
                          value={cfg.whatsappGroupLink || ''}
                          onChange={(e) => handleServiceConfigChange(cfg.serviceId, 'whatsappGroupLink', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 outline-none focus:border-emerald-400 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#F3D079]" />
                          <span>Channel / Group Display Title</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ILPU Global Business Channel"
                          value={cfg.whatsappChannelName || ''}
                          onChange={(e) => handleServiceConfigChange(cfg.serviceId, 'whatsappChannelName', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleResetServiceConfig(cfg.serviceId)}
                          disabled={isSaving}
                          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSaveServiceConfig(cfg.serviceId)}
                          disabled={isSaving}
                          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 border border-emerald-400"
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>Save & Update Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-navy-card rounded-2xl border border-slate-800 p-6 shadow-xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <History className="w-6 h-6 text-purple-400" />
                  <h2 className="font-cinzel text-xl font-bold text-white">Pricing & GST Audit Trail</h2>
                </div>
                <p className="text-xs text-slate-300 font-light mt-1">
                  Immutable chronological audit logs tracking every change made to pricing plans and GST tax configurations.
                </p>
              </div>
              <button
                onClick={fetchAuditLogs}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                title="Reload Audit Logs"
              >
                <RefreshCw className={`w-4 h-4 ${loadingLogs ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loadingLogs ? (
              <div className="py-16 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-mono">Fetching audit trail logs...</p>
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="bg-navy-card rounded-2xl border border-slate-800 p-12 text-center text-slate-400 space-y-2">
                <History className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-sm font-semibold">No audit logs recorded yet.</p>
                <span className="text-xs text-slate-500">Any modifications to pricing plans or GST will automatically generate entries here.</span>
              </div>
            ) : (
              <div className="bg-navy-card rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-4 px-4">Timestamp</th>
                        <th className="py-4 px-4">Action Type</th>
                        <th className="py-4 px-4">Entity</th>
                        <th className="py-4 px-4">Summary</th>
                        <th className="py-4 px-4">Admin User</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {auditLogs.map((log) => (
                        <tr key={log.auditId || log._id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-4 px-4 font-mono text-[11px] text-slate-300">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 border border-purple-500/30 text-purple-300">
                              {log.changeType}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-semibold text-white">
                            {log.entityName || log.entityId}
                          </td>
                          <td className="py-4 px-4 text-slate-300 max-w-md">
                            {log.changeSummary}
                          </td>
                          <td className="py-4 px-4 font-mono text-slate-400">
                            {log.changedBy || 'Admin'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* PLAN ADD / EDIT MODAL */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#0A1128] border border-amber-400/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setShowPlanModal(false)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                {editingPlan ? 'Edit Pricing Plan' : 'Create New Pricing Plan'}
              </span>
              <h3 className="font-cinzel text-xl font-bold text-white">
                {editingPlan ? editingPlan.name : 'Configure Service Pricing'}
              </h3>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Plan Display Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. International Commercial Arbitration Plan"
                    value={planFormData.name}
                    onChange={(e) => setPlanFormData({ ...planFormData, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Service Identifier / Slug *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingPlan}
                    placeholder="e.g. international-arbitration"
                    value={planFormData.serviceId}
                    onChange={(e) => setPlanFormData({ ...planFormData, serviceId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-400 font-mono disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Cross-Border Dispute Representation & Enforcement"
                  value={planFormData.subtitle}
                  onChange={(e) => setPlanFormData({ ...planFormData, subtitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Detailed breakdown of what this strategy consultation covers..."
                  value={planFormData.description}
                  onChange={(e) => setPlanFormData({ ...planFormData, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-400"
                ></textarea>
              </div>

              {/* Pricing Grid */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <span className="font-bold text-white block text-[11px] uppercase tracking-wider text-amber-400">
                  Regional Pricing Tiers
                </span>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">India Base Price (₹ INR) *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={planFormData.priceIndia}
                      onChange={(e) => setPlanFormData({ ...planFormData, priceIndia: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-sm outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">India Original Price (Strikethrough)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 1999"
                      value={planFormData.originalPriceIndia}
                      onChange={(e) => setPlanFormData({ ...planFormData, originalPriceIndia: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-sm outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">International Price ($ USD) *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={planFormData.priceInternational}
                      onChange={(e) => setPlanFormData({ ...planFormData, priceInternational: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-sm outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Int'l Original Price ($ USD)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 25"
                      value={planFormData.originalPriceInternational}
                      onChange={(e) => setPlanFormData({ ...planFormData, originalPriceInternational: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-sm outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pricing Model</label>
                  <select
                    value={planFormData.pricingType}
                    onChange={(e) => setPlanFormData({ ...planFormData, pricingType: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-400"
                  >
                    <option value="one-time">One-Time Fee</option>
                    <option value="recurring">Recurring Retainer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Most Popular or Priority Advisory"
                    value={planFormData.badge}
                    onChange={(e) => setPlanFormData({ ...planFormData, badge: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Features (One bullet point per line)
                </label>
                <textarea
                  rows="3"
                  placeholder="30-Minute 1-on-1 Legal Strategy Session&#10;Complete Legal Risk Audit&#10;Jurisdictional Alignment Protocol"
                  value={planFormData.featuresText}
                  onChange={(e) => setPlanFormData({ ...planFormData, featuresText: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-400 font-mono text-[11px]"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Deliverables (One item per line)
                </label>
                <textarea
                  rows="2"
                  placeholder="Custom Legal Opinion & Strategy Summary Document&#10;Embassy / Court Filing Checklist"
                  value={planFormData.deliverablesText}
                  onChange={(e) => setPlanFormData({ ...planFormData, deliverablesText: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-400 font-mono text-[11px]"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="planIsActive"
                  checked={planFormData.isActive}
                  onChange={(e) => setPlanFormData({ ...planFormData, isActive: e.target.checked })}
                  className="rounded border-slate-800 bg-slate-900 text-amber-400"
                />
                <label htmlFor="planIsActive" className="text-slate-300 font-semibold">
                  Publish Plan Immediately (Active & Visible on Frontend)
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingPlan}
                  className="w-full py-3.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20"
                >
                  {savingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{editingPlan ? 'Save & Update Pricing Plan' : 'Publish New Pricing Plan'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* PLAN LIVE PREVIEW MODAL */}
      {previewPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0A1128] border border-[#D4AF37]/50 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <button
              onClick={() => setPreviewPlanModal(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#F3D079] uppercase tracking-wider block">Live Public Preview</span>
                <h3 className="font-cinzel text-lg font-bold text-white">{previewPlanModal.name}</h3>
              </div>
              <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setPreviewRegion('india')}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold ${
                    previewRegion === 'india' ? 'bg-[#D4AF37] text-slate-950' : 'text-slate-400'
                  }`}
                >
                  🇮🇳 India
                </button>
                <button
                  onClick={() => setPreviewRegion('international')}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold ${
                    previewRegion === 'international' ? 'bg-[#D4AF37] text-slate-950' : 'text-slate-400'
                  }`}
                >
                  🌐 Global
                </button>
              </div>
            </div>

            {/* Preview Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111A38] to-[#0A1128] border border-[#D4AF37]/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#F3D079] border border-[#D4AF37]/40">
                  {previewPlanModal.badge || 'Priority Advisory'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {previewPlanModal.pricingType === 'recurring' ? 'Retainer' : 'One-Time Session'}
                </span>
              </div>

              <div>
                <h4 className="font-cinzel text-lg font-bold text-white">{previewPlanModal.name}</h4>
                <p className="text-xs text-slate-300 mt-1">{previewPlanModal.subtitle}</p>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-cinzel text-3xl font-bold text-[#F3D079]">
                    {previewRegion === 'india' ? `₹${previewPlanModal.priceIndia}` : `$${previewPlanModal.priceInternational} USD`}
                  </span>
                  {previewRegion === 'india' && previewPlanModal.originalPriceIndia && (
                    <span className="text-xs text-slate-500 line-through">₹{previewPlanModal.originalPriceIndia}</span>
                  )}
                  {previewRegion === 'international' && previewPlanModal.originalPriceInternational && (
                    <span className="text-xs text-slate-500 line-through">${previewPlanModal.originalPriceInternational}</span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400">
                  {previewRegion === 'india' ? (
                    gstConfig.isInclusive
                      ? `Includes ${gstConfig.defaultRate}% GST (SAC: ${gstConfig.hsnSacCode})`
                      : `+ ${gstConfig.defaultRate}% GST (Total ₹${Math.round(previewPlanModal.priceIndia * (1 + gstConfig.defaultRate / 100))})`
                  ) : (
                    'Export of Legal Services (0% Indian Tax)'
                  )}
                </div>
              </div>

              {/* Features List */}
              {previewPlanModal.features && previewPlanModal.features.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Features</span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {previewPlanModal.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#F3D079] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewPlanModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

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
                {selectedBooking.gstAmount ? (
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 mt-2">
                    Base: ₹{selectedBooking.basePrice} • GST: ₹{selectedBooking.gstAmount} ({selectedBooking.gstRate}%) • Total: ₹{selectedBooking.amount}
                  </div>
                ) : null}
              </div>

              {selectedBooking.whatsappGroupLink && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                  <span className="text-emerald-400 uppercase font-bold text-[10px] block">Assigned WhatsApp Channel</span>
                  <a
                    href={selectedBooking.whatsappGroupLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-white underline break-all block font-mono"
                  >
                    {selectedBooking.whatsappGroupLink}
                  </a>
                </div>
              )}

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
              <p className="text-xs text-slate-400">Record an offline / direct chamber legal booking.</p>
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
                  <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
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
                <label className="block text-slate-300 font-semibold mb-1">Practice Area Service</label>
                <select
                  value={newBookingData.serviceId}
                  onChange={(e) => {
                    const sel = pricingPlans.find((p) => p.serviceId === e.target.value);
                    setNewBookingData({
                      ...newBookingData,
                      serviceId: e.target.value,
                      serviceTitle: sel ? sel.name : e.target.value
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-[#D4AF37]"
                >
                  {pricingPlans.map((p) => (
                    <option key={p.planId} value={p.serviceId}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Region</label>
                <select
                  value={newBookingData.region}
                  onChange={(e) => setNewBookingData({ ...newBookingData, region: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-[#D4AF37]"
                >
                  <option value="india">India Resident (₹ INR)</option>
                  <option value="international">International ($ USD)</option>
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

      {/* Add New Service WhatsApp Link Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0A1128] border border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <button
              onClick={() => setShowAddServiceModal(false)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Practice Area Configuration
              </span>
              <h3 className="font-cinzel text-xl font-bold text-white">Add WhatsApp Link for Service</h3>
            </div>

            <form onSubmit={handleCreateServiceConfig} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service ID / Slug *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. cyber-law-advisory or maritime-disputes"
                  value={newServiceConfigData.serviceId}
                  onChange={(e) => setNewServiceConfigData({ ...newServiceConfigData, serviceId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-emerald-400 font-mono"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Unique Identifier matching service ID (spaces automatically hypenated)</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Display Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyber Law & Digital Assets Advisory"
                  value={newServiceConfigData.serviceTitle}
                  onChange={(e) => setNewServiceConfigData({ ...newServiceConfigData, serviceTitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">WhatsApp Group / Channel Invite Link *</label>
                <input
                  type="url"
                  required
                  placeholder="https://chat.whatsapp.com/..."
                  value={newServiceConfigData.whatsappGroupLink}
                  onChange={(e) => setNewServiceConfigData({ ...newServiceConfigData, whatsappGroupLink: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Group / Channel Display Title</label>
                <input
                  type="text"
                  placeholder="e.g. ILPU Cyber Law Advisory Group"
                  value={newServiceConfigData.whatsappChannelName}
                  onChange={(e) => setNewServiceConfigData({ ...newServiceConfigData, whatsappChannelName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                disabled={creatingServiceConfig}
                className="w-full py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 border border-emerald-400 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 mt-2"
              >
                {creatingServiceConfig ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save & Create Service Link</span>}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
