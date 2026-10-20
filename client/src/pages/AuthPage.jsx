import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { PawPrint, Lock, Mail, User, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/dashboard');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your full name');
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  }

  function fillDemoAdopter() {
    setIsRegister(false);
    setEmail('adopter@pawmatch.in');
    setPassword('Password123!');
    setError('');
  }

  function fillDemoAdmin() {
    setIsRegister(false);
    setEmail('admin@pawmatch.in');
    setPassword('AdminSecret123!');
    setError('');
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 space-y-8">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center mx-auto shadow-soft">
          <PawPrint className="w-6 h-6 fill-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-sand-900 tracking-tight">
          {isRegister ? 'Create Your Account' : 'Welcome to PawMatch India'}
        </h1>
        <p className="text-xs sm:text-sm text-sand-800">
          Save your compatibility assessments, plan foster trials, and track onboarding.
        </p>
      </div>

      {/* Demo Credentials Quick Fill Box */}
      <div className="bg-sand-100 p-4 rounded-2xl border border-sand-200 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-sand-900">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>One-Click Demo Credentials:</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={fillDemoAdopter}
            className="p-2 rounded-xl bg-white hover:bg-brand-50 hover:text-brand-700 text-sand-800 border border-sand-300 font-bold transition-colors text-left"
          >
            <span className="block text-[10px] uppercase opacity-75">Role: Adopter</span>
            <span className="truncate block font-semibold">adopter@pawmatch.in</span>
          </button>
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="p-2 rounded-xl bg-white hover:bg-brand-50 hover:text-brand-700 text-sand-800 border border-sand-300 font-bold transition-colors text-left"
          >
            <span className="block text-[10px] uppercase opacity-75">Role: Admin</span>
            <span className="truncate block font-semibold">admin@pawmatch.in</span>
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-6">
        
        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-sand-100 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
            className={`py-2 rounded-xl transition-all ${
              !isRegister ? 'bg-white text-sand-900 shadow-sm' : 'text-sand-800 hover:text-sand-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
            className={`py-2 rounded-xl transition-all ${
              isRegister ? 'bg-white text-sand-900 shadow-sm' : 'text-sand-800 hover:text-sand-900'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-2xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {isRegister && (
            <div>
              <label className="block font-bold text-sand-900 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-sand-800 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-10 pr-4 py-2.5 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-sand-900 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-sand-800 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-10 pr-4 py-2.5 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-sand-900 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-sand-800 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-10 pr-4 py-2.5 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-extrabold text-sm shadow-soft transition-colors mt-2"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Create Adopter Account' : 'Sign In'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-sand-800">
          <span>Taking the questionnaire? </span>
          <Link to="/quiz" className="font-bold text-brand-600 hover:underline">
            Take quiz anonymously in Guest Mode
          </Link>
        </div>

      </div>

    </div>
  );
}
