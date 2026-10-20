import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  PawPrint,
  Compass,
  HeartHandshake,
  Calendar,
  Sparkles,
  User,
  ShieldAlert,
  Menu,
  X,
  LogOut,
  Sliders
} from 'lucide-react';

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/quiz', label: 'Match Quiz', icon: Compass },
    { to: '/pets', label: 'Explore Breeds', icon: PawPrint },
    { to: '/adopt', label: 'Adoptable Pets', icon: HeartHandshake },
    { to: '/foster', label: 'Trial Foster', icon: Calendar },
    { to: '/first-30-days', label: 'First 30 Days', icon: Calendar },
    { to: '/advisor', label: 'AI Advisor', icon: Sparkles },
    { to: '/about', label: 'About Us', icon: HeartHandshake }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Prototype Demo Banner */}
      <div className="bg-amber-600 text-amber-50 px-4 py-1.5 text-xs text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-200" />
        <span>
          <strong>PROTOTYPE / DEMO DATA</strong> — Promoting native Indian Indie adoptions & responsible urban pet parenting. Zero paid services.
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div className="glass-nav border-b border-sand-200/80 px-4 sm:px-6 lg:px-8 transition-smooth">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-smooth">
              <PawPrint className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-sand-900 group-hover:text-brand-600 transition-colors">
                  PawMatch
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">
                  India
                </span>
              </div>
              <p className="text-[10px] text-sand-800 -mt-0.5 font-medium">Urban Pet Compatibility</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-smooth ${
                    active
                      ? 'bg-brand-50 text-brand-600 shadow-sm'
                      : 'text-sand-800 hover:text-brand-600 hover:bg-sand-100/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-brand-600' : 'text-sand-800'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-smooth ${
                    isActive('/dashboard')
                      ? 'bg-brand-50 border-brand-200 text-brand-700'
                      : 'border-sand-200 text-sand-800 hover:bg-sand-100'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-brand-600" />
                  <span>{user.name}</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-2 rounded-lg bg-sand-200 text-sand-900 hover:bg-sand-300 transition-smooth"
                    title="Admin Dashboard"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-sand-800 hover:text-red-600 hover:bg-red-50 transition-smooth"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="text-xs font-semibold text-sand-800 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-sand-100 transition-smooth"
                >
                  Sign In
                </Link>
                <Link
                  to="/quiz"
                  className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white shadow-soft transition-smooth hover:shadow-hover"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Find My Match</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {!isAuthenticated && (
              <Link
                to="/auth"
                className="sm:hidden text-xs font-bold px-3 py-1.5 rounded-lg bg-sand-200 text-sand-800"
              >
                Sign In
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-sand-800 hover:bg-sand-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-sand-50 border-b border-sand-200 px-4 pt-3 pb-6 space-y-2 shadow-hover">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  active ? 'bg-brand-50 text-brand-600' : 'text-sand-800 hover:bg-sand-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-sand-200 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-sand-800 hover:bg-sand-100"
                >
                  <User className="w-4 h-4 text-brand-600" />
                  <span>My Dashboard ({user.name})</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-sand-800 hover:bg-sand-100"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="pt-2">
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 text-sm font-semibold border border-sand-300 rounded-lg text-sand-800 hover:bg-sand-100"
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
