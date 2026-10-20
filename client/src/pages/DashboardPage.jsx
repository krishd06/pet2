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
  PawPrint
} from 'lucide-react';
import Animal3DShowcase from '../components/Animal3DShowcase.jsx';

export default function DashboardPage() {
  const { user, guestToken, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [trials, setTrials] = useState([]);
  const [dogProgress, setDogProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [asmRes, trialsRes, dogProgRes] = await Promise.all([
          api.getMyAssessments(guestToken).catch(() => ({ assessments: [] })),
          api.getMyTrials(guestToken).catch(() => ({ trials: [] })),
          api.getOnboardingProgress('dog', guestToken).catch(() => ({ completedItems: [] }))
        ]);

        if (asmRes?.assessments) setAssessments(asmRes.assessments);
        if (trialsRes?.trials) setTrials(trialsRes.trials);
        if (dogProgRes?.completedItems) setDogProgress(dogProgRes.completedItems);
      } catch (err) {
        console.warn('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [guestToken]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Quick Feature Navigation Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2 border border-sand-200 shadow-sm flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        {[
          { to: '/quiz', label: 'Match Quiz', icon: Compass },
          { to: '/pets', label: 'Explore Breeds', icon: PawPrint },
          { to: '/adopt', label: 'Adoptable Pets', icon: HeartHandshake },
          { to: '/foster', label: 'Trial Foster', icon: Calendar },
          { to: '/first-30-days', label: 'First 30 Days', icon: Calendar },
          { to: '/advisor', label: 'AI Advisor', icon: Sparkles }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-sand-800 hover:text-brand-600 hover:bg-sand-100/70 transition-all whitespace-nowrap"
            >
              <Icon className="w-4 h-4 text-brand-500" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

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

        </div>

      </div>

      {/* 3D Interactive Companion Showcase */}
      <div className="pt-4">
        <Animal3DShowcase />
      </div>

    </div>
  );
}
