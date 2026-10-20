import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Calendar,
  CheckCircle2,
  Phone,
  MapPin,
  AlertCircle,
  Sparkles,
  ShieldAlert,
  Clock,
  Heart,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function First30DaysPage() {
  const { guestToken } = useAuth();
  const [species, setSpecies] = useState('dog');
  const [plan, setPlan] = useState(null);
  const [completedItems, setCompletedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Vet directory
  const [vets, setVets] = useState([]);
  const [selectedVetCity, setSelectedVetCity] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [planRes, progRes, vetsRes] = await Promise.all([
          api.getOnboardingPlan(species).catch(() => null),
          api.getOnboardingProgress(species, guestToken).catch(() => ({ completedItems: [] })),
          api.getVets(selectedVetCity).catch(() => ({ vets: [] }))
        ]);

        if (planRes?.plan) setPlan(planRes.plan);
        if (progRes?.completedItems) setCompletedItems(progRes.completedItems);
        if (vetsRes?.vets) setVets(vetsRes.vets);
      } catch (err) {
        console.error('Failed to load onboarding data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [species, selectedVetCity, guestToken]);

  async function toggleChecklistItem(itemId) {
    const isCompleted = completedItems.includes(itemId);
    const newStatus = !isCompleted;

    // Optimistic UI update
    setCompletedItems((prev) =>
      newStatus ? [...prev, itemId] : prev.filter((id) => id !== itemId)
    );

    try {
      await api.updateOnboardingProgress({
        species,
        checklistItemId: itemId,
        completed: newStatus,
        guestToken
      });
    } catch (e) {
      console.warn('Failed to update progress on server:', e);
    }
  }

  const rule333 = plan?.rule333 || {};
  const checklist = plan?.petProofingChecklist || [];
  const vetChecklist = plan?.firstVetVisitChecklist || [];

  const completedCount = checklist.filter((item) => completedItems.includes(item.id)).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-sand-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Post-Adoption Roadmap</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-sand-900 tracking-tight">
            The First 30 Days & 3-3-3 Rule
          </h1>
          <p className="text-sm text-sand-800 mt-1">
            Understanding pet decompression, pet-proofing Indian apartments, and emergency vet triage.
          </p>
        </div>

        {/* Species Switcher */}
        <div className="flex items-center bg-sand-100 p-1.5 rounded-2xl border border-sand-200">
          <button
            onClick={() => setSpecies('dog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              species === 'dog' ? 'bg-white text-sand-900 shadow-sm' : 'text-sand-800 hover:text-sand-900'
            }`}
          >
            Dog Onboarding
          </button>
          <button
            onClick={() => setSpecies('cat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              species === 'cat' ? 'bg-white text-sand-900 shadow-sm' : 'text-sand-800 hover:text-sand-900'
            }`}
          >
            Cat Onboarding
          </button>
        </div>
      </div>

      {/* 1. The 3-3-3 Rule Timeline */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Adjustment Science</span>
          <h2 className="text-2xl font-extrabold text-sand-900">
            The 3-3-3 Rescue Decompression Timeline
          </h2>
          <p className="text-xs sm:text-sm text-sand-800 mt-0.5">
            Rescue pets need time to reset their nervous system before revealing their true, relaxed personality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 3 Days */}
          <div className="bg-white rounded-3xl p-6 border-2 border-brand-500/20 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-brand-600 uppercase tracking-wider">Phase 1</span>
              <span className="text-xl font-black text-brand-600">3 Days</span>
            </div>
            <h3 className="font-extrabold text-lg text-sand-900">Decompression & Rest</h3>
            <p className="text-xs text-sand-800 leading-relaxed">
              Pet feels overwhelmed, scared, or shuts down. May refuse to eat or hide under beds.
            </p>
            <ul className="space-y-2 text-xs text-sand-800 pt-2 border-t border-sand-100">
              {(rule333.day1to3 || []).map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3 Weeks */}
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-500/20 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">Phase 2</span>
              <span className="text-xl font-black text-amber-700">3 Weeks</span>
            </div>
            <h3 className="font-extrabold text-lg text-sand-900">Learning Household Routine</h3>
            <p className="text-xs text-sand-800 leading-relaxed">
              Pet begins to realize this might be home. Fixed feeding times, walking cues, and house rules click.
            </p>
            <ul className="space-y-2 text-xs text-sand-800 pt-2 border-t border-sand-100">
              {(rule333.week1to3 || []).map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3 Months */}
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500/20 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Phase 3</span>
              <span className="text-xl font-black text-emerald-700">3 Months</span>
            </div>
            <h3 className="font-extrabold text-lg text-sand-900">Full Trust & Belonging</h3>
            <p className="text-xs text-sand-800 leading-relaxed">
              Pet feels secure, shows full affection, and forms permanent, deep family bonds.
            </p>
            <ul className="space-y-2 text-xs text-sand-800 pt-2 border-t border-sand-100">
              {(rule333.month1to3 || []).map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* 2. Interactive Persistent Pet-Proofing Checklist */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Persistent Safety Checklist</span>
            <h2 className="text-2xl font-extrabold text-sand-900">
              Apartment Pet-Proofing ({completedCount}/{checklist.length} Completed)
            </h2>
            <p className="text-xs text-sand-800 mt-0.5">
              Ticked items are automatically saved to your profile.
            </p>
          </div>

          <div className="w-48 bg-sand-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {checklist.map((item) => {
            const isDone = completedItems.includes(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleChecklistItem(item.id)}
                className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3.5 ${
                  isDone
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-sm'
                    : 'bg-sand-50/70 hover:bg-sand-100 border-sand-200 text-sand-900'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-sand-300 bg-white'
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sand-900">{item.label}</span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-sand-200 text-sand-800">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-sand-800">{item.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* First Vet Visit Checklist */}
        {vetChecklist.length > 0 && (
          <div className="pt-6 border-t border-sand-200 space-y-3">
            <h3 className="font-bold text-sm text-sand-900 uppercase tracking-wider">
              First Vet Visit Health Checklist
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {vetChecklist.map((tip, idx) => (
                <div key={idx} className="bg-sand-50 p-3 rounded-xl border border-sand-200 flex items-center gap-2 text-sand-800">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. Emergency 24x7 Vet Directory */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Life-Saving Directory</span>
            <h2 className="text-2xl font-extrabold text-sand-900 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-600" />
              <span>Emergency 24x7 Vet Hospitals</span>
            </h2>
            <p className="text-xs text-sand-800 mt-0.5">
              Keep these numbers saved on your phone speed dial prior to adoption day.
            </p>
          </div>

          {/* City selector */}
          <select
            value={selectedVetCity}
            onChange={(e) => setSelectedVetCity(e.target.value)}
            className="text-xs font-bold bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-sand-900"
          >
            <option value="">All Major Cities</option>
            {['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Chennai', 'Hyderabad'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vets.map((v) => (
            <div
              key={v.id}
              className="bg-sand-50 p-5 rounded-2xl border border-sand-200 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-600">{v.city} • {v.area}</span>
                  {v.emergency_24x7 && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700 animate-pulse">
                      24x7 Emergency
                    </span>
                  )}
                </div>
                <h4 className="font-extrabold text-base text-sand-900">{v.clinic_name}</h4>
                <p className="text-xs text-sand-800">{v.address}</p>
              </div>

              <div className="pt-3 border-t border-sand-200 flex items-center justify-between">
                <span className="text-xs text-sand-800 font-semibold">Doctor: {v.name}</span>
                <a
                  href={`tel:${v.phone}`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Emergency</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
