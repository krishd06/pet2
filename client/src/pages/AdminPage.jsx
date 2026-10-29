import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Sliders,
  Award,
  PawPrint,
  HeartHandshake,
  Trash2,
  Edit2,
  Plus,
  AlertCircle,
  CheckCircle2,
  BarChart2,
  Building,
  Users,
  CreditCard,
  MousePointerClick,
  FileSpreadsheet,
  Sparkles,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  ExternalLink
} from 'lucide-react';

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [partners, setPartners] = useState([]);
  const [providers, setProviders] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('revenue'); 
  // 'revenue' | 'shelters' | 'partners' | 'providers' | 'animals' | 'analytics'

  // Modal for creating/editing animal
  const [isAnimalModalOpen, setIsAnimalModalOpen] = useState(false);
  const [animalForm, setAnimalForm] = useState({
    id: null,
    name: '',
    species: 'dog',
    breed: '',
    city: 'Mumbai',
    age_months: 12,
    gender: 'male',
    size: 'medium',
    description: '',
    photo_url: '',
    vaccinated: true,
    neutered: true
  });

  // Modal for creating/editing shelter
  const [isShelterModalOpen, setIsShelterModalOpen] = useState(false);
  const [shelterForm, setShelterForm] = useState({
    id: null,
    name: '',
    city: 'Mumbai',
    phone: '',
    email: '',
    website: '',
    address: '',
    description: ''
  });

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    loadAdminData();
  }, [isAdmin]);

  async function loadAdminData() {
    setLoading(true);
    try {
      const [statsRes, animalsRes, sheltersRes, partnersRes, servicesRes] = await Promise.all([
        api.getAdminStats().catch(() => null),
        api.getAnimals().catch(() => ({ animals: [] })),
        api.getShelters().catch(() => ({ shelters: [] })),
        api.getPartners().catch(() => ({ partners: [] })),
        api.getServices().catch(() => ({ providers: [] }))
      ]);

      if (statsRes) {
        setStats(statsRes);
        if (statsRes.partners) setPartners(statsRes.partners);
        if (statsRes.providers) setProviders(statsRes.providers);
        if (statsRes.serviceLeads?.recentLeads) setLeads(statsRes.serviceLeads.recentLeads);
      }
      if (animalsRes?.animals) setAnimals(animalsRes.animals);
      if (sheltersRes?.shelters) setShelters(sheltersRes.shelters);
      if (partnersRes?.partners && (!statsRes?.partners || statsRes.partners.length === 0)) {
        setPartners(partnersRes.partners);
      }
      if (servicesRes?.providers && (!statsRes?.providers || statsRes.providers.length === 0)) {
        setProviders(servicesRes.providers);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }

  // --- Moderation Handlers ---
  async function handleToggleVerifyShelter(shelterId, currentStatus) {
    try {
      await api.verifyShelter(shelterId, !currentStatus);
      setShelters(prev => prev.map(s => s.id === shelterId ? { ...s, verified: !currentStatus } : s));
    } catch (err) {
      alert('Failed to update shelter verification: ' + err.message);
    }
  }

  async function handleTogglePartnerActive(partnerId, currentStatus) {
    try {
      await api.togglePartner(partnerId, !currentStatus);
      setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, active: !currentStatus } : p));
    } catch (err) {
      alert('Failed to toggle partner: ' + err.message);
    }
  }

  async function handleToggleProviderActive(providerId, currentStatus) {
    try {
      await api.toggleServiceProvider(providerId, !currentStatus);
      setProviders(prev => prev.map(p => p.id === providerId ? { ...p, active: !currentStatus } : p));
    } catch (err) {
      alert('Failed to toggle provider: ' + err.message);
    }
  }

  // --- Animal CRUD handlers ---
  async function handleSaveAnimal(e) {
    e.preventDefault();
    try {
      if (animalForm.id) {
        await api.updateAnimal(animalForm.id, animalForm);
      } else {
        await api.createAnimal(animalForm);
      }
      setIsAnimalModalOpen(false);
      const res = await api.getAnimals();
      setAnimals(res.animals || []);
    } catch (err) {
      alert('Error saving animal: ' + err.message);
    }
  }

  async function handleDeleteAnimal(id) {
    if (window.confirm('Are you sure you want to delete this adoptable animal?')) {
      try {
        await api.deleteAnimal(id);
        setAnimals(animals.filter((a) => a.id !== id));
      } catch (err) {
        alert('Failed to delete animal: ' + err.message);
      }
    }
  }

  // --- Shelter CRUD handlers ---
  async function handleSaveShelter(e) {
    e.preventDefault();
    try {
      if (shelterForm.id) {
        await api.updateShelter(shelterForm.id, shelterForm);
      } else {
        await api.createShelter(shelterForm);
      }
      setIsShelterModalOpen(false);
      const res = await api.getShelters();
      setShelters(res.shelters || []);
    } catch (err) {
      alert('Error saving shelter: ' + err.message);
    }
  }

  async function handleDeleteShelter(id) {
    if (window.confirm('Are you sure you want to delete this shelter?')) {
      try {
        await api.deleteShelter(id);
        setShelters(shelters.filter((s) => s.id !== id));
      } catch (err) {
        alert('Failed to delete shelter: ' + err.message);
      }
    }
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-sand-900">Administrator Access Required</h2>
        <p className="text-xs text-sand-800">
          This portal is reserved for platform administrators to manage verified shelters, partner leads, and mock revenue.
        </p>
        <button
          onClick={() => {
            window.location.href = '/auth';
          }}
          className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
        >
          Sign In as Demo Admin
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Top Banner */}
      <div className="bg-sand-900 rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> PawMatch Master Administration
            </span>
            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">
              Test Sandbox Mode Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Platform Operations & Moderation</h1>
          <p className="text-xs sm:text-sm text-sand-700">
            Monitor mock revenue streams, partner link clicks, shelter verification status, and inbound service quotes.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors self-start md:self-center"
        >
          Refresh Live Metrics
        </button>
      </div>

      {/* Feature H: Top Metrics Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-card space-y-1">
          <span className="text-[10px] font-bold text-sand-800 uppercase tracking-wider block">Total Users</span>
          <div className="text-2xl font-black text-sand-900 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-brand-500" />
            <span>{stats?.totalUsers || 2}</span>
          </div>
          <span className="text-[10px] text-sand-800 block">Adopters & Shelters</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-card space-y-1">
          <span className="text-[10px] font-bold text-sand-800 uppercase tracking-wider block">Total Mock Revenue</span>
          <div className="text-2xl font-black text-emerald-600 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>₹{(stats?.totalMockRevenue || 0).toLocaleString('en-IN')}</span>
          </div>
          <span className="text-[10px] text-sand-800 block">All 3 Revenue Streams</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-card space-y-1">
          <span className="text-[10px] font-bold text-sand-800 uppercase tracking-wider block">Partner Clicks</span>
          <div className="text-2xl font-black text-brand-600 flex items-center gap-1.5">
            <MousePointerClick className="w-4 h-4 text-brand-600" />
            <span>{stats?.partnerClicks?.totalClicks || 0}</span>
          </div>
          <span className="text-[10px] text-sand-800 block">MongoDB Click Events</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-card space-y-1">
          <span className="text-[10px] font-bold text-sand-800 uppercase tracking-wider block">Quote Leads</span>
          <div className="text-2xl font-black text-amber-600 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-amber-600" />
            <span>{stats?.serviceLeads?.totalLeads || 0}</span>
          </div>
          <span className="text-[10px] text-sand-800 block">Vets, Trainers, Groomers</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-card space-y-1">
          <span className="text-[10px] font-bold text-sand-800 uppercase tracking-wider block">Featured Shelters</span>
          <div className="text-2xl font-black text-sand-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{stats?.featuredSheltersCount || 1}</span>
          </div>
          <span className="text-[10px] text-sand-800 block">₹999 / 30-day plans</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-card space-y-1">
          <span className="text-[10px] font-bold text-sand-800 uppercase tracking-wider block">Trial Bookings</span>
          <div className="text-2xl font-black text-sand-900 flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span>{stats?.trialBookingsCount || 0}</span>
          </div>
          <span className="text-[10px] text-sand-800 block">Paid Fosters Booked</span>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-sand-200 pb-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'revenue', label: 'Revenue & Leads' },
            { id: 'shelters', label: `Shelters (${shelters.length})` },
            { id: 'partners', label: `Partners (${partners.length})` },
            { id: 'providers', label: `Service Providers (${providers.length})` },
            { id: 'animals', label: `Animals (${animals.length})` },
            { id: 'analytics', label: 'Match Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-brand-500 text-white shadow-soft'
                  : 'bg-sand-100 text-sand-800 hover:bg-sand-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Revenue Streams & Leads */}
      {activeTab === 'revenue' && (
        <div className="space-y-8">
          
          {/* Revenue Breakdown by Stream */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-sand-200 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-sand-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>Simulated Mock Revenue Streams</span>
                </h3>
                <p className="text-xs text-sand-800">
                  Rule 4: All payment streams running in test/mock mode without processing real money.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-sand-800 uppercase block">Total Simulated</span>
                <span className="text-2xl font-black text-emerald-700">₹{(stats?.totalMockRevenue || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-sand-50 p-5 rounded-2xl border border-sand-200 space-y-2">
                <span className="text-xs font-bold text-sand-800 uppercase tracking-wider block">Adopter Subscriptions</span>
                <div className="text-2xl font-black text-sand-900">₹{(stats?.subscriptionRevenue || 0).toLocaleString('en-IN')}</div>
                <p className="text-[11px] text-sand-800">
                  {stats?.premiumSubscribersCount || 0} active premium adopters (₹299/mo or ₹2,499/yr)
                </p>
              </div>

              <div className="bg-sand-50 p-5 rounded-2xl border border-sand-200 space-y-2">
                <span className="text-xs font-bold text-sand-800 uppercase tracking-wider block">Supported Foster Trials</span>
                <div className="text-2xl font-black text-sand-900">₹{(stats?.trialRevenue || 0).toLocaleString('en-IN')}</div>
                <p className="text-[11px] text-sand-800">
                  {stats?.trialBookingsCount || 0} foster bookings (₹1,499 for 7d, ₹2,499 for 14d, ₹4,499 for 30d)
                </p>
              </div>

              <div className="bg-sand-50 p-5 rounded-2xl border border-sand-200 space-y-2">
                <span className="text-xs font-bold text-sand-800 uppercase tracking-wider block">Shelter Featured Plans</span>
                <div className="text-2xl font-black text-sand-900">₹{(stats?.shelterPlanRevenue || 0).toLocaleString('en-IN')}</div>
                <p className="text-[11px] text-sand-800">
                  {stats?.featuredSheltersCount || 1} featured shelter partners (₹999 per 30 days)
                </p>
              </div>
            </div>
          </div>

          {/* Service Quote Inbound Leads Table */}
          <div className="bg-white rounded-3xl border border-sand-200 shadow-card overflow-hidden">
            <div className="p-6 border-b border-sand-200">
              <h3 className="font-extrabold text-lg text-sand-900">Service Directory Leads ({leads.length})</h3>
              <p className="text-xs text-sand-800">Quotes requested by pet parents for vets, trainers, and sitters.</p>
            </div>

            {leads.length === 0 ? (
              <p className="text-xs text-sand-800 text-center py-8">No service quote leads logged yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-sand-50 border-b border-sand-200 text-sand-800 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-4">Provider</th>
                      <th className="p-4">Adopter Lead</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Message</th>
                      <th className="p-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-sand-50/50">
                        <td className="p-4 font-bold text-sand-900">{l.provider_name || 'Service Provider'}</td>
                        <td className="p-4 font-semibold text-sand-900">{l.adopter_name}</td>
                        <td className="p-4 text-sand-800">{l.adopter_phone} • {l.adopter_email}</td>
                        <td className="p-4 text-sand-800 italic max-w-xs truncate">"{l.message}"</td>
                        <td className="p-4 text-sand-700 text-[11px]">{new Date(l.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 2: Shelters Management & Verification Toggle */}
      {activeTab === 'shelters' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-sand-900">Shelter Verification & Plan Status</h2>
              <p className="text-xs text-sand-800">Toggle "Verified Shelter" badge to instill adopter trust.</p>
            </div>
            <button
              onClick={() => {
                setShelterForm({
                  id: null,
                  name: '',
                  city: 'Mumbai',
                  phone: '',
                  email: '',
                  website: '',
                  address: '',
                  description: ''
                });
                setIsShelterModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Register Shelter</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-sand-200 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-50 border-b border-sand-200 text-sand-800 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-4">Shelter Name</th>
                  <th className="p-4">City & Contact</th>
                  <th className="p-4">Plan Tier</th>
                  <th className="p-4">Verified Status</th>
                  <th className="p-4 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {shelters.map((sh) => (
                  <tr key={sh.id} className="hover:bg-sand-50/50">
                    <td className="p-4">
                      <span className="font-extrabold text-sand-900 text-sm block">{sh.name}</span>
                      <span className="text-[11px] text-sand-800">{sh.address}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-sand-900 block">{sh.city}</span>
                      <span className="text-[11px] text-sand-800">{sh.phone} • {sh.email}</span>
                    </td>
                    <td className="p-4">
                      {sh.plan === 'featured' ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" /> Featured
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-sand-100 text-sand-800 font-semibold text-[10px]">
                          Free Starter
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {sh.verified ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-sand-200 text-sand-700 font-semibold text-[10px]">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleVerifyShelter(sh.id, sh.verified)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                          sh.verified
                            ? 'bg-sand-100 hover:bg-sand-200 text-sand-800'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {sh.verified ? 'Revoke Verification' : 'Mark Verified'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Partners & Affiliates Moderation */}
      {activeTab === 'partners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-sand-900">Affiliate & Brand Partners</h2>
              <p className="text-xs text-sand-800">
                Rule 5: Every partner item displays a "Partner" label with legal affiliate disclosure.
              </p>
            </div>
            <span className="text-xs font-bold text-sand-800 bg-sand-100 px-3 py-1 rounded-xl">
              Total Clicks: {stats?.partnerClicks?.totalClicks || 0}
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-sand-200 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-50 border-b border-sand-200 text-sand-800 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-4">Brand / Partner</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Commission Note</th>
                  <th className="p-4">Clicks (MongoDB)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Toggle Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {partners.map((p) => {
                  const clickCount = stats?.partnerClicks?.byPartner?.[p.id] || 0;
                  return (
                    <tr key={p.id} className="hover:bg-sand-50/50">
                      <td className="p-4">
                        <span className="font-extrabold text-sand-900 text-sm block">{p.name}</span>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-brand-600 hover:underline flex items-center gap-1"
                        >
                          <span>{p.url}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </td>
                      <td className="p-4 capitalize font-semibold text-sand-800">{p.category}</td>
                      <td className="p-4 text-sand-800 text-[11px]">{p.commission_note || 'Standard affiliate'}</td>
                      <td className="p-4 font-black text-brand-600">{clickCount} clicks</td>
                      <td className="p-4">
                        {p.active ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-sand-200 text-sand-700 font-bold text-[10px]">
                            Paused
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleTogglePartnerActive(p.id, p.active)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                            p.active ? 'bg-sand-100 hover:bg-sand-200 text-sand-800' : 'bg-brand-500 hover:bg-brand-600 text-white'
                          }`}
                        >
                          {p.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Service Providers Moderation */}
      {activeTab === 'providers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-sand-900">Service Directory Providers</h2>
              <p className="text-xs text-sand-800">Enable or disable vets, trainers, and sitters appearing in searches.</p>
            </div>
            <span className="text-xs font-bold text-sand-800 bg-sand-100 px-3 py-1 rounded-xl">
              Active Providers: {providers.filter(p => p.active !== false).length}
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-sand-200 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-50 border-b border-sand-200 text-sand-800 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-4">Provider</th>
                  <th className="p-4">Category & City</th>
                  <th className="p-4">Pricing Range</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Toggle Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {providers.map((pr) => (
                  <tr key={pr.id} className="hover:bg-sand-50/50">
                    <td className="p-4">
                      <span className="font-extrabold text-sand-900 text-sm block">{pr.name}</span>
                      <span className="text-[11px] text-sand-800">{pr.address}</span>
                    </td>
                    <td className="p-4">
                      <span className="capitalize font-semibold text-sand-900 block">{pr.category}</span>
                      <span className="text-[11px] text-sand-800">{pr.city}</span>
                    </td>
                    <td className="p-4 text-sand-800 font-medium">{pr.price_range || 'Variable'}</td>
                    <td className="p-4 font-bold text-amber-700">★ {pr.rating || 4.8}</td>
                    <td className="p-4">
                      {pr.active !== false ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-sand-200 text-sand-700 font-bold text-[10px]">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleProviderActive(pr.id, pr.active !== false)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                          pr.active !== false ? 'bg-sand-100 hover:bg-sand-200 text-sand-800' : 'bg-brand-500 hover:bg-brand-600 text-white'
                        }`}
                      >
                        {pr.active !== false ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Animals Inventory */}
      {activeTab === 'animals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-sand-900">Manage Adoptable Animals</h2>
            <button
              onClick={() => {
                setAnimalForm({
                  id: null,
                  name: '',
                  species: 'dog',
                  breed: 'Indian Pariah',
                  city: 'Mumbai',
                  age_months: 12,
                  gender: 'male',
                  size: 'medium',
                  description: '',
                  photo_url: '',
                  vaccinated: true,
                  neutered: true
                });
                setIsAnimalModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-soft transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Animal</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-sand-200 shadow-card overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-50 border-b border-sand-200 text-sand-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 font-bold">Animal</th>
                  <th className="p-4 font-bold">Breed / Species</th>
                  <th className="p-4 font-bold">City</th>
                  <th className="p-4 font-bold">Age</th>
                  <th className="p-4 font-bold">Health</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {animals.map((anim) => (
                  <tr key={anim.id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="p-4 font-bold text-sand-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-sand-200 overflow-hidden flex-shrink-0">
                        {anim.photo_url ? (
                          <img src={anim.photo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <PawPrint className="w-4 h-4 text-sand-800 m-2" />
                        )}
                      </div>
                      <span>{anim.name}</span>
                    </td>
                    <td className="p-4 text-sand-800">{anim.breed} ({anim.species})</td>
                    <td className="p-4 text-sand-800">{anim.city}</td>
                    <td className="p-4 text-sand-800">{Math.round(anim.age_months / 12 * 10) / 10} yrs</td>
                    <td className="p-4">
                      <div className="flex gap-1 text-[10px]">
                        {anim.vaccinated && <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Vax</span>}
                        {anim.neutered && <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Neutered</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setAnimalForm(anim);
                          setIsAnimalModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-sand-100 text-sand-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAnimal(anim.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
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

      {/* Tab 6: Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-card space-y-4">
              <h3 className="font-extrabold text-lg text-sand-900 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-brand-600" />
                <span>Compatibility Tier Distribution</span>
              </h3>
              <div className="space-y-3 text-xs sm:text-sm">
                {Object.entries(stats?.tierDistribution || {}).map(([tier, count]) => (
                  <div key={tier} className="bg-sand-50 p-3 rounded-2xl border border-sand-200 flex justify-between items-center">
                    <span className="font-bold text-sand-900">{tier}</span>
                    <span className="px-3 py-1 rounded-full bg-sand-200 text-sand-900 font-extrabold text-xs">
                      {count} matches
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-card space-y-4">
              <h3 className="font-extrabold text-lg text-sand-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>Most Frequently Matched Breeds</span>
              </h3>
              <div className="space-y-3 text-xs sm:text-sm">
                {(stats?.popularPets || []).length === 0 ? (
                  <p className="text-xs text-sand-800 italic">No assessment history yet.</p>
                ) : (
                  (stats?.popularPets || []).map((p, idx) => (
                    <div key={idx} className="bg-sand-50 p-3 rounded-2xl border border-sand-200 flex justify-between items-center">
                      <span className="font-bold text-sand-900">#{idx + 1} {p.name}</span>
                      <span className="text-xs text-brand-700 font-bold">{p.count} times top match</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animal Add/Edit Modal */}
      {isAnimalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl border border-sand-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-xl text-sand-900">
              {animalForm.id ? 'Edit Adoptable Animal' : 'Add New Adoptable Animal'}
            </h3>

            <form onSubmit={handleSaveAnimal} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-sand-900 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={animalForm.name}
                  onChange={(e) => setAnimalForm({ ...animalForm, name: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-sand-900 mb-1">Species</label>
                  <select
                    value={animalForm.species}
                    onChange={(e) => setAnimalForm({ ...animalForm, species: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                  >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="small_pet">Small Pet</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sand-900 mb-1">Breed</label>
                  <input
                    type="text"
                    required
                    value={animalForm.breed}
                    onChange={(e) => setAnimalForm({ ...animalForm, breed: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-sand-900 mb-1">City</label>
                  <select
                    value={animalForm.city}
                    onChange={(e) => setAnimalForm({ ...animalForm, city: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                  >
                    {['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sand-900 mb-1">Age (Months)</label>
                  <input
                    type="number"
                    value={animalForm.age_months}
                    onChange={(e) => setAnimalForm({ ...animalForm, age_months: Number(e.target.value) })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sand-900 mb-1">Gender</label>
                  <select
                    value={animalForm.gender}
                    onChange={(e) => setAnimalForm({ ...animalForm, gender: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-sand-900 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={animalForm.photo_url}
                  onChange={(e) => setAnimalForm({ ...animalForm, photo_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                />
              </div>

              <div>
                <label className="block font-bold text-sand-900 mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  value={animalForm.description}
                  onChange={(e) => setAnimalForm({ ...animalForm, description: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={animalForm.vaccinated}
                    onChange={(e) => setAnimalForm({ ...animalForm, vaccinated: e.target.checked })}
                    className="accent-brand-500 rounded"
                  />
                  <span className="font-bold text-sand-900">Vaccinated</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={animalForm.neutered}
                    onChange={(e) => setAnimalForm({ ...animalForm, neutered: e.target.checked })}
                    className="accent-brand-500 rounded"
                  />
                  <span className="font-bold text-sand-900">Spayed / Neutered</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-sand-200">
                <button
                  type="button"
                  onClick={() => setIsAnimalModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-sand-100 text-sand-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 text-white font-bold"
                >
                  Save Animal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shelter Add/Edit Modal */}
      {isShelterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl border border-sand-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-xl text-sand-900">
              {shelterForm.id ? 'Edit Shelter' : 'Register New Shelter'}
            </h3>

            <form onSubmit={handleSaveShelter} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-sand-900 mb-1">Shelter Name</label>
                <input
                  type="text"
                  required
                  value={shelterForm.name}
                  onChange={(e) => setShelterForm({ ...shelterForm, name: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-sand-900 mb-1">City</label>
                  <select
                    value={shelterForm.city}
                    onChange={(e) => setShelterForm({ ...shelterForm, city: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                  >
                    {['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sand-900 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={shelterForm.phone}
                    onChange={(e) => setShelterForm({ ...shelterForm, phone: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sand-900 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={shelterForm.email}
                  onChange={(e) => setShelterForm({ ...shelterForm, email: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                />
              </div>

              <div>
                <label className="block font-bold text-sand-900 mb-1">Website</label>
                <input
                  type="url"
                  value={shelterForm.website}
                  onChange={(e) => setShelterForm({ ...shelterForm, website: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                />
              </div>

              <div>
                <label className="block font-bold text-sand-900 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={shelterForm.address}
                  onChange={(e) => setShelterForm({ ...shelterForm, address: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-sand-200">
                <button
                  type="button"
                  onClick={() => setIsShelterModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-sand-100 text-sand-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 text-white font-bold"
                >
                  Save Shelter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
