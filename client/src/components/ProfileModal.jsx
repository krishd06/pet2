import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  User,
  Mail,
  MapPin,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Compass,
  LogOut,
  Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const INDIAN_CITIES = [
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Ahmedabad'
];

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [city, setCity] = useState(user?.city || 'Mumbai');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !user) return null;

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await updateUserProfile({
        name: name.trim(),
        email: email.trim(),
        city,
        password: password.trim() ? password.trim() : undefined
      });
      setSuccessMsg('Profile updated successfully!');
      setPassword('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  function handleSignOut() {
    logout();
    onClose();
    navigate('/');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl border border-sand-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-stone-950 flex items-center justify-center text-xl font-black shadow-lg shadow-amber-500/30">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-white">{user.name}</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {user.role || 'Adopter'}
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">{user.email}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified PawMatch Account</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Edit Profile Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sand-500">
              Personal Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-sand-800 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-sand-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-sand-800 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-sand-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-sand-800 mb-1">Preferred City</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-sand-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    {INDIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-sand-800 mb-1">
                  Change Password (optional)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-sand-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>

          {/* Quick Shortcuts */}
          <div className="pt-4 border-t border-sand-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sand-500 mb-2">
              Quick Shortcuts
            </h4>

            <Link
              to="/dashboard"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl bg-sand-50 hover:bg-sand-100 border border-sand-200 text-xs font-semibold text-sand-900 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-brand-600" />
                <span>My Compatibility Reports & Assessments</span>
              </div>
              <span className="text-brand-600 font-bold">Open →</span>
            </Link>

            <Link
              to="/quiz"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-xl bg-sand-50 hover:bg-sand-100 border border-sand-200 text-xs font-semibold text-sand-900 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Take Lifestyle Compatibility Quiz</span>
              </div>
              <span className="text-amber-600 font-bold">Start →</span>
            </Link>
          </div>

          {/* Sign out */}
          <div className="pt-3 border-t border-sand-200 flex justify-between items-center">
            <span className="text-xs text-sand-500">Finished your session?</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
