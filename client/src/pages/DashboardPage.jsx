import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ProfileModal from '../components/ProfileModal.jsx';
import {
  User,
  Compass,
  ArrowRight,
  Mail,
  MapPin,
  ShieldCheck,
  Edit3
} from 'lucide-react';

export default function DashboardPage() {
  const { user, guestToken, isAuthenticated } = useAuth();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const asmRes = await api.getMyAssessments(guestToken).catch(() => ({ assessments: [] }));
        if (asmRes?.assessments) setAssessments(asmRes.assessments);
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
            Track your lifestyle compatibility reports and explore matched pet breeds.
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
            to="/pets"
            className="px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm transition-colors"
          >
            Explore Breeds
          </Link>
        </div>
      </div>

      {/* Account Profile Card (when logged in) */}
      {isAuthenticated && user && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center text-xl font-black shadow-md shadow-amber-500/20 flex-shrink-0">
              {user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-sand-900">{user.name}</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {user.role || 'Adopter'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-sand-700">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-sand-400" />
                  {user.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sand-400" />
                  {user.city || 'Mumbai, India'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Account
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-sand-300 hover:bg-sand-50 text-sand-900 text-xs font-bold transition-colors shadow-sm flex-shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5 text-brand-600" />
            <span>Edit Profile</span>
          </button>
        </div>
      )}

      {/* Compatibility Assessments */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-6">
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

      {/* Edit Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

    </div>
  );
}
