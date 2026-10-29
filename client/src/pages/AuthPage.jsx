import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  PawPrint,
  Lock,
  Mail,
  User,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Building,
  Phone,
  MapPin,
  FileText
} from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, user } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('adopter'); // 'adopter' | 'shelter'

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Shelter specific fields
  const [shelterName, setShelterName] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated && user) {
    if (user.role === 'shelter') {
      navigate('/shelter-dashboard');
    } else if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your full name or contact name');
        if (role === 'shelter' && !shelterName.trim()) {
          throw new Error('Please enter your shelter or rescue organization name');
        }

        const registeredUser = await register({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          shelterName: shelterName.trim(),
          city,
          phone: phone.trim(),
          address: address.trim()
        });

        if (registeredUser?.role === 'shelter') {
          navigate('/shelter-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        const loggedUser = await login(email.trim(), password);
        if (loggedUser?.role === 'shelter') {
          navigate('/shelter-dashboard');
        } else if (loggedUser?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
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

  function fillDemoShelter() {
    setIsRegister(false);
    setEmail('shelter@pawmatch.in');
    setPassword('ShelterPass123!');
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
          {isRegister ? 'Join PawMatch India' : 'Welcome Back'}
        </h1>
        <p className="text-xs sm:text-sm text-sand-800">
          Responsible pet compatibility, shelter management, and native Indie welfare.
        </p>
      </div>

      {/* Demo Credentials Quick Fill Box (Adopter, Shelter, Admin) */}
      <div className="bg-sand-100 p-4 rounded-2xl border border-sand-200 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-sand-900">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Quick Demo One-Click Sign In:</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={fillDemoAdopter}
            className="p-2 rounded-xl bg-white hover:bg-brand-50 hover:text-brand-700 text-sand-800 border border-sand-300 font-bold transition-colors text-left"
          >
            <span className="block text-[10px] uppercase text-brand-600 font-extrabold">Adopter</span>
            <span className="truncate block font-semibold text-[11px]">adopter@</span>
          </button>
          <button
            type="button"
            onClick={fillDemoShelter}
            className="p-2 rounded-xl bg-white hover:bg-brand-50 hover:text-brand-700 text-sand-800 border border-sand-300 font-bold transition-colors text-left"
          >
            <span className="block text-[10px] uppercase text-emerald-600 font-extrabold">Shelter</span>
            <span className="truncate block font-semibold text-[11px]">shelter@</span>
          </button>
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="p-2 rounded-xl bg-white hover:bg-brand-50 hover:text-brand-700 text-sand-800 border border-sand-300 font-bold transition-colors text-left"
          >
            <span className="block text-[10px] uppercase text-sand-900 font-extrabold">Admin</span>
            <span className="truncate block font-semibold text-[11px]">admin@</span>
          </button>
        </div>
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

        {/* If registering, choose role: Adopter vs Shelter */}
        {isRegister && (
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-sand-900">Account Type</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setRole('adopter')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  role === 'adopter'
                    ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                    : 'border-sand-200 bg-sand-50 text-sand-800 hover:bg-sand-100'
                }`}
              >
                <User className="w-4 h-4 mb-1 text-brand-600" />
                <span className="block">Adopter</span>
                <span className="text-[10px] font-normal text-sand-800">Looking for a companion pet</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('shelter')}
                className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                  role === 'shelter'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                    : 'border-sand-200 bg-sand-50 text-sand-800 hover:bg-sand-100'
                }`}
              >
                <Building className="w-4 h-4 mb-1 text-emerald-600" />
                <span className="block">Shelter / NGO</span>
                <span className="text-[10px] font-normal text-sand-800">List animals & handle inquiries</span>
              </button>
            </div>
          </div>
        )}

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
                {role === 'shelter' ? 'Contact Person Name' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-sand-800 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'shelter' ? 'e.g. Dr. Priya Rao' : 'e.g. Aarav Sharma'}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-10 pr-4 py-2.5 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          )}

          {/* Shelter specific fields */}
          {isRegister && role === 'shelter' && (
            <>
              <div>
                <label className="block font-bold text-sand-900 mb-1">Shelter / Organization Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-sand-800 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={shelterName}
                    onChange={(e) => setShelterName(e.target.value)}
                    placeholder="e.g. SaveOurStrays Sanctuary"
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-10 pr-4 py-2.5 text-sand-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-sand-900 mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2.5 text-sand-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-semibold"
                  >
                    {['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sand-900 mb-1">Helpline Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2.5 text-sand-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sand-900 mb-1">Facility Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Survey No. 42, Khar West, Mumbai"
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2.5 text-sand-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </>
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
            className={`w-full py-3 rounded-2xl text-white font-extrabold text-sm shadow-soft transition-colors mt-2 disabled:opacity-50 ${
              isRegister && role === 'shelter'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-brand-500 hover:bg-brand-600'
            }`}
          >
            {loading
              ? 'Authenticating...'
              : isRegister
              ? role === 'shelter'
                ? 'Create Shelter Partner Account'
                : 'Create Adopter Account'
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
