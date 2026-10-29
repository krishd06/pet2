import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  PawPrint,
  Compass,
  HeartHandshake,
  User,
  Menu,
  X,
  LogOut,
  Sliders,
  Building2,
  Sparkles,
  Calendar,
  Building
} from 'lucide-react';

export default function Header() {
  const { user, isAuthenticated, isAdmin, isShelter, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';

  // 3 Primary Features strictly kept in main header as requested
  const coreFeatures = [
    { to: '/quiz', label: 'Match Quiz', icon: Compass },
    { to: '/pets', label: 'Explore Breeds', icon: PawPrint },
    { to: '/adopt', label: 'Adoptable Pets', icon: HeartHandshake }
  ];

  // Secondary pages available in drawer for comprehensive site navigation
  const secondaryLinks = [
    { to: '/foster', label: 'Trial Foster', icon: Calendar },
    { to: '/first-30-days', label: 'First 30 Days Roadmap', icon: Calendar },
    { to: '/advisor', label: 'AI Pet Advisor', icon: Sparkles },
    { to: '/services', label: 'Veterinary & Services', icon: Building },
    { to: '/about', label: 'About Us', icon: HeartHandshake }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`w-full transition-all duration-300 ${
        isHome
          ? 'fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-none border-b border-transparent'
          : 'sticky top-0 z-40 bg-[#0c0a09] border-b border-white/10 shadow-xl'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center text-stone-950 shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform duration-300">
              <PawPrint className="w-5 h-5 fill-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  PawMatch
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  India
                </span>
                <span className="hidden md:inline-block text-[9px] font-mono text-stone-400 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                  DEMO DATA
                </span>
              </div>
              <p className="text-[10px] text-stone-400 -mt-0.5 font-medium tracking-wide">
                Urban Pet Compatibility
              </p>
            </div>
          </Link>

          {/* 3 Important Features Only (Centered Navigation) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-xl shadow-black/40">
            {coreFeatures.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md shadow-amber-500/30'
                      : 'text-stone-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-stone-950' : 'text-amber-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Controls & CTA */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border transition-all ${
                    isActive('/dashboard')
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'border-white/15 bg-black/30 text-stone-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>{user.name}</span>
                </Link>

                {isShelter && (
                  <Link
                    to="/shelter/dashboard"
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
                    title="Shelter Portal"
                  >
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden lg:inline">Shelter</span>
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-full bg-white/10 text-stone-200 border border-white/10 hover:bg-white/20"
                    title="Admin"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">Admin</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="p-2 rounded-full text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="text-xs font-semibold text-stone-300 hover:text-white px-3.5 py-2 rounded-full hover:bg-white/5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/quiz"
                  className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 shadow-lg shadow-amber-500/25 transition-transform hover:scale-105"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Start Quiz</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/quiz"
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-500 text-stone-950 font-mono uppercase"
            >
              Quiz
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0a09]/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-4 pb-6 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold px-3 mb-1">
            Core Features
          </div>
          {coreFeatures.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-white/10 space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold px-3 mb-1">
              More Services
            </div>
            {secondaryLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-white/5"
                >
                  <Icon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-stone-200 hover:bg-white/5"
                >
                  <User className="w-4 h-4 text-amber-400" />
                  <span>My Dashboard ({user.name})</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="pt-1 flex flex-col gap-2">
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 text-sm font-semibold border border-white/10 rounded-xl text-stone-200 hover:bg-white/10"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
