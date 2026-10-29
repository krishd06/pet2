import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  User,
  Compass,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  HeartHandshake,
  PawPrint,
  Lock
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isPremium, guestToken, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [trials, setTrials] = useState([]);
  const [dogProgress, setDogProgress] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderPet, setNewReminderPet] = useState('');
  const [newReminderDate, setNewReminderDate] = useState('');
  const [newReminderCategory, setNewReminderCategory] = useState('vaccination');
  const [addingReminder, setAddingReminder] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [asmRes, trialsRes, dogProgRes, remRes] = await Promise.all([
          api.getMyAssessments(guestToken).catch(() => ({ assessments: [] })),
          api.getMyTrials(guestToken).catch(() => ({ trials: [] })),
          api.getOnboardingProgress('dog', guestToken).catch(() => ({ completedItems: [] })),
          isPremium ? api.getReminders().catch(() => ({ reminders: [] })) : Promise.resolve({ reminders: [] })
        ]);

        if (asmRes?.assessments) setAssessments(asmRes.assessments);
        if (trialsRes?.trials) setTrials(trialsRes.trials);
        if (dogProgRes?.completedItems) setDogProgress(dogProgRes.completedItems);
        if (remRes?.reminders) setReminders(remRes.reminders);
      } catch (err) {
        console.warn('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [guestToken, isPremium]);

  async function handleAddReminder(e) {
    e.preventDefault();
    if (!newReminderTitle || !newReminderDate) return;
    setAddingReminder(true);
    try {
      const created = await api.saveReminder({
        petName: newReminderPet || 'My Pet',
        title: newReminderTitle,
        dueDate: newReminderDate,
        category: newReminderCategory
      });
      setReminders((prev) => [created, ...prev]);
      setNewReminderTitle('');
      setNewReminderPet('');
      setNewReminderDate('');
    } catch (err) {
      console.error('Failed to add reminder:', err);
    } finally {
      setAddingReminder(false);
    }
  }

  async function handleToggleReminder(remId, currentCompleted) {
    try {
      await api.toggleReminder(remId, !currentCompleted);
      setReminders((prev) =>
        prev.map((r) => ((r.id || r._id) === remId ? { ...r, completed: !currentCompleted } : r))
      );
    } catch (err) {
      console.error('Toggle reminder error:', err);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 rounded-3xl p-6 sm:p-10 text-white shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
            <User className="w-3.5 h-3.5" />
            <span>{isAuthenticated ? `${user.role} Dashboard` : 'Guest Visitor Dashboard'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome, {user ? user.name : 'Adopter Friend'}!
          </h1>
          <p className="text-white/90 text-xs sm:text-sm max-w-xl">
            Track your lifestyle compatibility reports, scheduled trial fosters, and pet-proofing checklist progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/quiz"
            className="px-5 py-3 rounded-2xl bg-white text-brand-700 hover:bg-sand-50 font-extrabold text-xs sm:text-sm shadow-md transition-colors"
          >
            Take New Quiz
          </Link>
          <Link
            to="/adopt"
            className="px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm transition-colors"
          >
            Browse Animals
          </Link>
        </div>
      </div>

      {/* Main Grid: Assessments, Trials, Onboarding */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Past Compatibility Assessments */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-brand-600" />
              <h2 className="text-xl font-extrabold text-sand-900">
                Compatibility Reports ({assessments.length})
              </h2>
            </div>
            <Link to="/quiz" className="text-xs font-bold text-brand-600 hover:underline">
              + New Assessment
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-sand-800">Loading assessments...</div>
          ) : assessments.length === 0 ? (
            <div className="py-12 text-center text-xs text-sand-800 space-y-3">
              <Compass className="w-10 h-10 text-sand-800 mx-auto" />
              <p>You haven't run any compatibility assessments yet.</p>
              <Link
                to="/quiz"
                className="inline-block px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
              >
                Take the 3-Minute Compatibility Quiz
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {assessments.map((asm) => (
                <div
                  key={asm.id}
                  className="p-4 rounded-2xl border border-sand-200 bg-sand-50 flex items-center justify-between gap-4 hover:border-brand-300 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sand-900 text-sm">
                        Readiness: {asm.readinessScore}/100
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          asm.readinessBand === 'Ready'
                            ? 'bg-emerald-100 text-emerald-800'
                            : asm.readinessBand === 'Almost Ready'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {asm.readinessBand}
                      </span>
                    </div>
                    <span className="text-[11px] text-sand-800 block">
                      Assessed on {new Date(asm.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link
                    to={`/results/${asm.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-brand-50 hover:text-brand-700 text-sand-900 border border-sand-300 text-xs font-bold transition-colors shadow-sm"
                  >
                    <span>View Matches</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Active Trials & Onboarding Progress */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Scheduled Trials Card */}
          <div className="bg-white rounded-3xl p-6 border border-sand-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-extrabold text-sand-900">
                  Foster Trials ({trials.length})
                </h3>
              </div>
              <Link to="/foster" className="text-xs font-bold text-brand-600 hover:underline">
                Plan Trial
              </Link>
            </div>

            {trials.length === 0 ? (
              <p className="text-xs text-sand-800">No scheduled trials. Start a 48-hour or 7-day trial before adopting.</p>
            ) : (
              <div className="space-y-2.5">
                {trials.slice(0, 3).map((t) => (
                  <div key={t.id} className="p-3 rounded-xl bg-sand-50 border border-sand-200 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sand-900">{t.animal_name || 'Foster Pet'}</span>
                      <span className="text-[10px] uppercase font-bold text-brand-700">{t.status}</span>
                    </div>
                    <span className="text-sand-800 text-[11px] block">{t.trial_duration_days} Days ({t.start_date})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Onboarding Checklist Progress */}
          <div className="bg-white rounded-3xl p-6 border border-sand-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-sand-900">
                  First 30 Days Checklist
                </h3>
              </div>
              <Link to="/first-30-days" className="text-xs font-bold text-brand-600 hover:underline">
                Open Guide
              </Link>
            </div>

            <p className="text-xs text-sand-800">
              You have completed <strong>{dogProgress.length} items</strong> on your home safety and pet-proofing checklist.
            </p>

            <Link
              to="/first-30-days"
              className="w-full py-2.5 text-center text-xs font-bold text-sand-800 bg-sand-100 hover:bg-sand-200 rounded-xl transition-colors block"
            >
              Continue 3-3-3 Rule Checklist
            </Link>
          </div>

          {/* Feature E: Post-Adoption Reminders Tracker */}
          <div className="bg-white rounded-3xl p-6 border border-sand-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-extrabold text-sand-900">
                  Pet Medical Reminders ({reminders.length})
                </h3>
              </div>
              {isPremium ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Premium
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sand-200 text-sand-700 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              )}
            </div>

            {isPremium ? (
              <div className="space-y-4">
                {/* Add Reminder Form */}
                <form onSubmit={handleAddReminder} className="space-y-2 bg-sand-50 p-3 rounded-2xl border border-sand-200 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Pet Name (e.g. Bruno)"
                      value={newReminderPet}
                      onChange={(e) => setNewReminderPet(e.target.value)}
                      className="bg-white border border-sand-300 rounded-xl px-2.5 py-1.5 text-xs text-sand-900"
                    />
                    <select
                      value={newReminderCategory}
                      onChange={(e) => setNewReminderCategory(e.target.value)}
                      className="bg-white border border-sand-300 rounded-xl px-2.5 py-1.5 text-xs text-sand-900"
                    >
                      <option value="vaccination">Vaccination</option>
                      <option value="deworming">Deworming</option>
                      <option value="checkup">Vet Checkup</option>
                      <option value="grooming">Grooming</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Title (e.g. Rabies Booster)"
                      value={newReminderTitle}
                      onChange={(e) => setNewReminderTitle(e.target.value)}
                      className="bg-white border border-sand-300 rounded-xl px-2.5 py-1.5 text-xs text-sand-900"
                      required
                    />
                    <input
                      type="date"
                      value={newReminderDate}
                      onChange={(e) => setNewReminderDate(e.target.value)}
                      className="bg-white border border-sand-300 rounded-xl px-2.5 py-1.5 text-xs text-sand-900"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={addingReminder}
                    className="w-full py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-colors"
                  >
                    {addingReminder ? 'Adding...' : '+ Add Medical Reminder'}
                  </button>
                </form>

                {/* Reminders List */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {reminders.length === 0 ? (
                    <p className="text-xs text-sand-800 text-center py-2">
                      No reminders scheduled. Add your puppy or Indie's next vaccination date above!
                    </p>
                  ) : (
                    reminders.map((rem) => {
                      const id = rem.id || rem._id;
                      return (
                        <div
                          key={id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                            rem.completed ? 'bg-sand-100 border-sand-200 opacity-60' : 'bg-sand-50 border-sand-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!rem.completed}
                              onChange={() => handleToggleReminder(id, rem.completed)}
                              className="accent-brand-500 w-4 h-4 rounded"
                            />
                            <div>
                              <span className={`font-bold block ${rem.completed ? 'line-through text-sand-700' : 'text-sand-900'}`}>
                                {rem.title} ({rem.petName || 'Pet'})
                              </span>
                              <span className="text-[10px] text-sand-800">
                                Due: {rem.dueDate ? new Date(rem.dueDate).toLocaleDateString() : 'Pending'}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sand-200 text-sand-800">
                            {rem.category}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200 text-center space-y-2">
                <Lock className="w-6 h-6 text-brand-600 mx-auto" />
                <h4 className="text-xs font-bold text-sand-900">Post-Adoption Vaccine & Vet Log</h4>
                <p className="text-[11px] text-sand-800 leading-relaxed">
                  Track recurring rabies boosters, tick treatments, and vet consultations with automatic alerts.
                </p>
                <Link
                  to="/pricing"
                  className="inline-block px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-soft transition-colors mt-1"
                >
                  Unlock with Premium (₹299/mo)
                </Link>
              </div>
            )}
          </div>

        </div>

      </div>


    </div>
  );
}
