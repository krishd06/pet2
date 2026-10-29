import React, { useState } from 'react';
import { api } from '../lib/api.js';
import {
  Building2,
  Users,
  Award,
  Sparkles,
  ShieldCheck,
  Send,
  CheckCircle2,
  HeartHandshake,
  ArrowRight
} from 'lucide-react';

export default function ForPartnersPage() {
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    organizationType: 'housing_society',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitB2BInquiry(formData);
      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit partner inquiry: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold">
          <Building2 className="w-3.5 h-3.5" />
          <span>B2B Institutional Solutions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-sand-900 tracking-tight">
          Readiness Programs for Societies, Corporates & Brands
        </h1>
        <p className="text-sm sm:text-base text-sand-800 leading-relaxed">
          Bringing data-driven pet lifestyle compatibility to housing complexes, workplaces, and ethical Indian pet care organizations.
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pillar 1: Housing Societies */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-sand-900">Housing Societies & RWAs</h3>
          <p className="text-xs text-sand-800 leading-relaxed">
            Eliminate neighbor disputes and illegal pet bans. We provide scientific tenant readiness audits, pet registration frameworks, lift etiquette training, and AWBI-compliant community guidelines.
          </p>
          <ul className="text-xs text-sand-700 space-y-2 pt-2 border-t border-sand-100">
            <li className="flex items-center gap-2">✓ Objective living area compatibility</li>
            <li className="flex items-center gap-2">✓ Landlord NOC template standardizations</li>
            <li className="flex items-center gap-2">✓ Barking & routine remediation roadmap</li>
          </ul>
        </div>

        {/* Pillar 2: Corporate Wellness */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-sand-900">Corporate Employee Wellness</h3>
          <p className="text-xs text-sand-800 leading-relaxed">
            Support hybrid and remote employees adopting pets. Offer PawMatch Premium employee benefit subscriptions, lunch-and-learn adoption webinars, and shelter volunteer days.
          </p>
          <ul className="text-xs text-sand-700 space-y-2 pt-2 border-t border-sand-100">
            <li className="flex items-center gap-2">✓ "Paw-ternity" transition roadmaps</li>
            <li className="flex items-center gap-2">✓ Unlimited AI Pet Advisor team accounts</li>
            <li className="flex items-center gap-2">✓ Sponsored shelter adoption drives</li>
          </ul>
        </div>

        {/* Pillar 3: Ethical Brands & Clinics */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-sand-900">Clinics & Pet Care Brands</h3>
          <p className="text-xs text-sand-800 leading-relaxed">
            Reach verified adopters at the exact moment of need. Context-aware recommendations for food, insurance, and grooming without invasive user tracking or third-party cookies.
          </p>
          <ul className="text-xs text-sand-700 space-y-2 pt-2 border-t border-sand-100">
            <li className="flex items-center gap-2">✓ Clear "Partner" tagged placement</li>
            <li className="flex items-center gap-2">✓ Anonymized click performance metrics</li>
            <li className="flex items-center gap-2">✓ Direct quote inquiries from pet parents</li>
          </ul>
        </div>

      </div>

      {/* Inquiry Form Card */}
      <div className="bg-sand-50 rounded-3xl p-6 sm:p-10 border border-sand-200 max-w-2xl mx-auto shadow-sm space-y-6">
        <div className="space-y-1 text-center">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Get in Touch</span>
          <h2 className="text-2xl font-black text-sand-900">Partner With PawMatch India</h2>
          <p className="text-xs text-sand-800">
            Fill out this brief inquiry and our team will get in touch within 24 business hours.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3 bg-white p-6 rounded-2xl border border-sand-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h3 className="text-lg font-black text-sand-900">Inquiry Received!</h3>
            <p className="text-xs text-sand-800 leading-relaxed max-w-md mx-auto">
              Thank you for reaching out, <strong>{formData.contactPerson}</strong>. Our partnerships coordinator has logged your details in Neon SQL and will reach out to <strong>{formData.email}</strong> shortly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  organizationName: '',
                  contactPerson: '',
                  email: '',
                  phone: '',
                  organizationType: 'housing_society',
                  message: ''
                });
              }}
              className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-sand-900 mb-1">Organization / Society Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Palm Meadows RWA or Tech Corp"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  className="w-full bg-white border border-sand-300 rounded-xl px-3.5 py-2.5 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-sand-900 mb-1">Contact Person</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma (Secretary / Lead)"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full bg-white border border-sand-300 rounded-xl px-3.5 py-2.5 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-sand-900 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  placeholder="contact@organization.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-sand-300 rounded-xl px-3.5 py-2.5 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-sand-900 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white border border-sand-300 rounded-xl px-3.5 py-2.5 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-sand-900 mb-1">Partnership Category</label>
              <select
                value={formData.organizationType}
                onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                className="w-full bg-white border border-sand-300 rounded-xl px-3.5 py-2.5 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="housing_society">Housing Society / RWA / Resident Committee</option>
                <option value="corporate">Corporate Employer / HR Wellness</option>
                <option value="brand">Pet Care Brand / Veterinary Network</option>
                <option value="shelter_ngo">Shelter / Animal Welfare NGO</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-sand-900 mb-1">Collaboration Objectives / Requirements</label>
              <textarea
                rows="4"
                required
                placeholder="Share your requirements (e.g. Society pet registration policy audit for 300 flats in Bengaluru; corporate employee discounts on trial fosters)..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white border border-sand-300 rounded-xl p-3 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-soft transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Partnership Inquiry'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
