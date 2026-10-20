import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  HeartHandshake,
  Star,
  RotateCcw,
  PlusCircle,
  FileText
} from 'lucide-react';

export default function TrialFosterPage() {
  const location = useLocation();
  const { guestToken } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const paramAnimalId = searchParams.get('animalId') || '';
  const paramAnimalName = searchParams.get('animalName') || '';

  const [guide, setGuide] = useState(null);
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [animalName, setAnimalName] = useState(paramAnimalName);
  const [durationDays, setDurationDays] = useState(7);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [planningSuccess, setPlanningSuccess] = useState('');

  // Outcome logger modal state
  const [activeTrialLog, setActiveTrialLog] = useState(null);
  const [allergySymptoms, setAllergySymptoms] = useState(false);
  const [fitRating, setFitRating] = useState(5);
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const [guideRes, trialsRes] = await Promise.all([
          api.getTrialGuide().catch(() => null),
          api.getMyTrials(guestToken).catch(() => ({ trials: [] }))
        ]);
        if (guideRes) setGuide(guideRes);
        if (trialsRes?.trials) setTrials(trialsRes.trials);
      } catch (err) {
        console.error('Failed to load trial data:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [guestToken]);

  async function handleCreateTrial(e) {
    e.preventDefault();
    setPlanningSuccess('');

    try {
      const res = await api.createFosterTrial({
        animalId: paramAnimalId || null,
        durationDays,
        startDate,
        notes: `${animalName ? `Trial with: ${animalName}. ` : ''}${notes}`,
        guestToken
      });

      setPlanningSuccess('Foster trial scheduled successfully! Review the preparation checklist below.');
      // Refresh trials list
      const updated = await api.getMyTrials(guestToken);
      setTrials(updated.trials || []);
      setNotes('');
    } catch (err) {
      alert('Error creating trial: ' + err.message);
    }
  }

  async function handleSaveOutcome() {
    if (!activeTrialLog) return;
    setUpdating(true);

    try {
      await api.updateTrialOutcome(activeTrialLog.id, {
        allergySymptoms,
        fitRating,
        notes: outcomeNotes,
        status: 'completed'
      });

      // Refresh list
      const updated = await api.getMyTrials(guestToken);
      setTrials(updated.trials || []);
      setActiveTrialLog(null);
    } catch (err) {
      alert('Failed to log outcome: ' + err.message);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Header */}
      <div className="pb-6 border-b border-sand-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>Risk-Free Compatibility Testing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-sand-900 tracking-tight">
          Self-Managed Foster Trials
        </h1>
        <p className="text-sm text-sand-800 mt-1 max-w-2xl">
          Fostering for 48 hours or 7 to 14 days is the gold standard of responsible adoption. Test household allergies, alone-time barking, and daily routines with zero pressure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Plan a Trial Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-6">
          <div className="flex items-center gap-2 text-brand-600 font-bold text-sm">
            <PlusCircle className="w-5 h-5" />
            <span>Plan Your Foster Trial</span>
          </div>

          <form onSubmit={handleCreateTrial} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-sand-900 mb-1">
                Pet or Rescue Name
              </label>
              <input
                type="text"
                value={animalName}
                onChange={(e) => setAnimalName(e.target.value)}
                placeholder="e.g. Kaju (Indie Pup) or Desi Kitten"
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2.5 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block font-bold text-sand-900 mb-1">
                Trial Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { days: 2, label: '2 Days (Weekend)' },
                  { days: 7, label: '7 Days (1 Week)' },
                  { days: 14, label: '14 Days (2 Weeks)' }
                ].map((d) => (
                  <button
                    key={d.days}
                    type="button"
                    onClick={() => setDurationDays(d.days)}
                    className={`py-2 px-2 text-center rounded-xl border text-xs font-bold transition-colors ${
                      durationDays === d.days
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                        : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-sand-900 mb-1">
                Target Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2.5 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-sand-900 mb-1">
                Personal Notes & Objectives
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="What will you test? (e.g. Check if brother has cat allergies; observe dog calm behavior during afternoon work calls)"
                className="w-full bg-sand-50 border border-sand-300 rounded-xl p-3 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            {planningSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{planningSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm shadow-soft transition-colors"
            >
              Add Trial to My Schedule
            </button>
          </form>
        </div>

        {/* Right: Active & Past Trials */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-4">
            <h2 className="text-xl font-extrabold text-sand-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              <span>Your Trial History ({trials.length})</span>
            </h2>

            {trials.length === 0 ? (
              <div className="py-8 text-center text-xs text-sand-800 space-y-2">
                <Clock className="w-8 h-8 text-sand-800 mx-auto" />
                <p>No active or completed trials yet. Plan one on the left!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trials.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl border border-sand-200 bg-sand-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-sand-900">
                          {t.animal_name || t.pet_name || 'Trial Companion'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            t.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                      <span className="text-sand-800 block">
                        {t.trial_duration_days} Days ({t.start_date} to {t.end_date})
                      </span>
                      {t.notes && <p className="text-sand-800 italic line-clamp-1">"{t.notes}"</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      {t.status !== 'completed' ? (
                        <button
                          onClick={() => {
                            setActiveTrialLog(t);
                            setOutcomeNotes(t.notes || '');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-colors"
                        >
                          Log Outcome
                        </button>
                      ) : (
                        <div className="text-right">
                          <span className="font-bold text-sand-900 flex items-center gap-1 justify-end">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {t.fit_rating || 5}/5 Fit
                          </span>
                          <span className="text-[10px] text-sand-800">
                            {t.allergy_symptoms ? '⚠️ Allergies Noticed' : '✓ No Allergies'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trial Guide & Preparation Checklist */}
          {guide && (
            <div className="bg-sand-50 rounded-3xl p-6 sm:p-8 border border-sand-200 space-y-4 text-xs sm:text-sm">
              <h3 className="text-lg font-extrabold text-sand-900">
                {guide.title}
              </h3>
              <p className="text-sand-800">{guide.subtitle}</p>

              <div className="space-y-2 pt-2">
                <span className="font-bold text-sand-900 uppercase text-xs tracking-wider block">
                  Trial Preparation Checklist
                </span>
                <ul className="space-y-2">
                  {guide.checklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sand-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Outcome Logger Modal */}
      {activeTrialLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl border border-sand-200">
            <h3 className="text-xl font-black text-sand-900">
              Log Foster Trial Outcome
            </h3>
            <p className="text-xs text-sand-800">
              Record your real experience to make an objective, pressure-free adoption decision.
            </p>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Allergy Symptoms Check */}
              <div className="space-y-1.5">
                <label className="block font-bold text-sand-900">
                  Did anyone in your home experience dander/fur allergy symptoms?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAllergySymptoms(false)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                      !allergySymptoms ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-sand-50 border-sand-200 text-sand-800'
                    }`}
                  >
                    No Allergies (Clear)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllergySymptoms(true)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                      allergySymptoms ? 'bg-red-100 border-red-400 text-red-800' : 'bg-sand-50 border-sand-200 text-sand-800'
                    }`}
                  >
                    Yes (Sneezing/Itching)
                  </button>
                </div>
              </div>

              {/* Fit Rating */}
              <div className="space-y-1.5">
                <label className="block font-bold text-sand-900">
                  Overall Lifestyle Fit Rating (1 = high friction, 5 = dream fit):
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setFitRating(stars)}
                      className={`flex-1 py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-1 ${
                        fitRating >= stars
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : 'bg-sand-50 border-sand-200 text-sand-800'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${fitRating >= stars ? 'fill-amber-400 text-amber-500' : 'text-sand-800'}`} />
                      <span>{stars}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reflection Notes */}
              <div className="space-y-1.5">
                <label className="block font-bold text-sand-900">
                  Reflection Notes
                </label>
                <textarea
                  value={outcomeNotes}
                  onChange={(e) => setOutcomeNotes(e.target.value)}
                  rows={3}
                  placeholder="How was the alone time? Walking routine? Family reaction?"
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-3 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-xs"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTrialLog(null)}
                className="flex-1 py-2.5 rounded-xl border border-sand-300 text-xs font-bold text-sand-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveOutcome}
                disabled={updating}
                className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm"
              >
                {updating ? 'Saving...' : 'Save Outcome'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
