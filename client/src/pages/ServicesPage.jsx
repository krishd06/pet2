import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Sparkles,
  MapPin,
  Star,
  CheckCircle2,
  Phone,
  Mail,
  ShieldCheck,
  RotateCcw,
  Send,
  Building2,
  Stethoscope,
  Scissors,
  Award,
  Users
} from 'lucide-react';

export default function ServicesPage() {
  const { user } = useAuth();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Quote Request Modal State
  const [quoteProvider, setQuoteProvider] = useState(null);
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    consent: false
  });
  const [submittingLead, setSubmittingLead] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  useEffect(() => {
    async function fetchProviders() {
      setLoading(true);
      try {
        const params = {};
        if (selectedCity) params.city = selectedCity;
        if (selectedCategory !== 'all') params.category = selectedCategory;

        const data = await api.getServices(params);
        setProviders(data.providers || []);
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProviders();
  }, [selectedCity, selectedCategory]);

  function openQuoteModal(provider) {
    setQuoteProvider(provider);
    setQuoteSuccess(false);
    setLeadForm({
      name: user?.name || '',
      phone: '',
      email: user?.email || '',
      message: `Hi ${provider.name}, I would like to request an estimate for ${provider.category} services for my pet.`,
      consent: true
    });
  }

  async function handleSendQuote(e) {
    e.preventDefault();
    if (!quoteProvider) return;
    if (!leadForm.consent) {
      alert('Please agree to share your contact details with this provider to receive a quote.');
      return;
    }

    setSubmittingLead(true);
    try {
      await api.requestServiceQuote(quoteProvider.id, leadForm);
      setQuoteSuccess(true);
    } catch (err) {
      alert('Failed to submit quote request: ' + err.message);
    } finally {
      setSubmittingLead(false);
    }
  }

  const categoryLabels = {
    all: 'All Services',
    vet: 'Veterinarians',
    trainer: 'Canine Trainers',
    groomer: 'Grooming Spas',
    sitter: 'Sitters & Boarding'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-sand-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
          <span>Vetted Urban Services Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-sand-900 tracking-tight">
          Pet Care Services & Specialists
        </h1>
        <p className="text-sm text-sand-800 mt-1 max-w-2xl">
          Connect with trusted veterinarians, force-free certified trainers, groomers, and pet sitters across India's major metropolitan areas.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-sand-200 shadow-card flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3">
          {/* City Filter */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs font-bold bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">All Indian Cities</option>
              {['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Chennai', 'Hyderabad'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['all', 'vet', 'trainer', 'groomer', 'sitter'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-sand-100 text-sand-800 hover:bg-sand-200'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>

        {(selectedCity || selectedCategory !== 'all') && (
          <button
            onClick={() => {
              setSelectedCity('');
              setSelectedCategory('all');
            }}
            className="flex items-center gap-1 text-xs font-bold text-sand-800 hover:text-red-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Provider Cards Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-sand-800">Finding verified providers...</p>
        </div>
      ) : providers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-sand-200 space-y-3">
          <Building2 className="w-12 h-12 text-sand-800 mx-auto" />
          <h3 className="font-bold text-lg text-sand-900">No service providers found for this selection</h3>
          <p className="text-xs text-sand-800 max-w-sm mx-auto">
            Try choosing 'All Indian Cities' or clear category filters to view available listings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-card hover:shadow-hover transition-all flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 inline-block mb-1">
                      {p.category}
                    </span>
                    <h3 className="text-lg font-black text-sand-900 leading-snug">{p.name}</h3>
                  </div>

                  <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold flex-shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{p.rating || 4.8}</span>
                  </div>
                </div>

                <p className="text-xs text-sand-800 leading-relaxed line-clamp-3">
                  {p.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-sand-100 text-xs text-sand-800">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                    <span className="truncate">{p.city} • {p.address || 'Urban center'}</span>
                  </div>
                  {p.price_range && (
                    <div className="flex items-center gap-2 font-semibold text-emerald-800">
                      <span>Starting from:</span>
                      <span>{p.price_range}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-sand-50 border-t border-sand-200 flex items-center justify-between gap-3">
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Provider
                </span>
                <button
                  onClick={() => openQuoteModal(p)}
                  className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-soft transition-colors"
                >
                  Request a Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request a Quote Modal */}
      {quoteProvider && (
        <div className="fixed inset-0 z-50 bg-sand-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-sand-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-600 tracking-wider">Free Quote Request</span>
                <h3 className="font-extrabold text-sand-900 text-base">{quoteProvider.name}</h3>
                <span className="text-xs text-sand-800">{quoteProvider.category} • {quoteProvider.city}</span>
              </div>
              <button
                onClick={() => setQuoteProvider(null)}
                className="text-sand-700 hover:text-sand-900 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {quoteSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-base font-black text-sand-900">Quote Request Submitted!</h4>
                <p className="text-xs text-sand-800 leading-relaxed">
                  Your lead details have been securely logged. The team at <strong>{quoteProvider.name}</strong> will review your inquiry and reach out via phone or email shortly.
                </p>
                <button
                  onClick={() => setQuoteProvider(null)}
                  className="px-6 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendQuote} className="space-y-3 text-xs">
                <div>
                  <label className="block text-sand-800 font-bold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900"
                    placeholder="Adopter Name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sand-800 font-bold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sand-800 font-bold mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900"
                      placeholder="name@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sand-800 font-bold mb-1">Message & Pet Details</label>
                  <textarea
                    rows="3"
                    required
                    value={leadForm.message}
                    onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900"
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer text-sand-800 text-[11px] leading-relaxed">
                    <input
                      type="checkbox"
                      checked={leadForm.consent}
                      onChange={(e) => setLeadForm({ ...leadForm, consent: e.target.checked })}
                      className="accent-brand-500 w-4 h-4 rounded mt-0.5"
                    />
                    <span>
                      I consent to sharing my contact details with <strong>{quoteProvider.name}</strong> to receive a quote and consultation under PawMatch's Privacy Policy.
                    </span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-sand-200">
                  <button
                    type="button"
                    onClick={() => setQuoteProvider(null)}
                    className="px-4 py-2 rounded-xl bg-sand-200 text-sand-800 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingLead || !leadForm.consent}
                    className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold"
                  >
                    {submittingLead ? 'Submitting...' : 'Send Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
