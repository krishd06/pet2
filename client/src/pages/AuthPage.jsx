import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  PawPrint,
  Lock,
  Mail,
  User,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, user } = useAuth();

  const [isRegister, setIsRegister] = useState(false);

  // User fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated && user) {
    navigate('/dashboard');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your full name');

        await register({
          name: name.trim(),
          email: email.trim(),
          password,
          role: 'adopter'
        });

        navigate('/dashboard');
      } else {
        await login(email.trim(), password);
        navigate('/dashboard');
      }
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

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 space-y-8">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center mx-auto shadow-soft">
          <PawPrint className="w-6 h-6 fill-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-sand-900 tracking-tight">
          {isRegister ? 'Join PawMatch India' : 'Welcome Back'}
        </h1>
        <p className="text-xs sm:text-sm text-sand-800">
          Responsible pet lifestyle compatibility and native Indie welfare.
        </p>
      </div>

      {/* Demo Credentials Quick Fill Box (Adopter) */}
      <div className="bg-sand-100 p-4 rounded-2xl border border-sand-200 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-sand-900">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Quick Demo One-Click Sign In:</span>
        </div>
        <button
          type="button"
          onClick={fillDemoAdopter}
          className="w-full p-2.5 rounded-xl bg-white hover:bg-brand-50 hover:text-brand-700 text-sand-800 border border-sand-300 font-bold transition-colors flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-brand-100 text-brand-700 text-[10px] font-extrabold uppercase">Adopter</span>
            <span className="font-semibold text-sand-900">adopter@pawmatch.in</span>
          </div>
          <span className="text-brand-600 font-bold text-xs">One-Click Fill →</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-6">
        
        {/* Tab Toggle: Sign In vs Register */}
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
          {/* Full Name */}
          {isRegister && (
            <div>
              <label className="block font-bold text-sand-900 mb-1">
                Full Name
              </label>
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

          {/* Email */}
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

          {/* Password */}
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
            className="w-full py-3 rounded-2xl text-white font-extrabold text-sm shadow-soft transition-colors mt-2 disabled:opacity-50 bg-brand-500 hover:bg-brand-600"
          >
            {loading
              ? 'Authenticating...'
              : isRegister
              ? 'Create Adopter Account'
              : 'Sign In'}
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
