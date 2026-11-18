import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);

function normalizeUser(u) {
  if (!u) return null;
  const isDemo = u.email === 'adopter@pawmatch.in' || u.id === 'usr_adopter_demo';
  return {
    ...u,
    isPremium: isDemo ? true : Boolean(u.isPremium)
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [guestToken, setGuestToken] = useState(() => localStorage.getItem('pawmatch_guest_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state & Guest Token
  useEffect(() => {
    async function initAuth() {
      setLoading(true);
      const token = localStorage.getItem('pawmatch_token');

      if (token) {
        try {
          const res = await api.getMe();
          if (res && res.user) {
            setUser(normalizeUser(res.user));
          }
        } catch (err) {
          console.warn('Stored session invalid or expired:', err.message);
          localStorage.removeItem('pawmatch_token');
          setUser(null);
        }
      }

      // Ensure a guest token exists for anonymous visitors
      let gToken = localStorage.getItem('pawmatch_guest_token');
      if (!gToken) {
        try {
          const guestRes = await api.getGuestToken();
          if (guestRes && guestRes.guestToken) {
            gToken = guestRes.guestToken;
            localStorage.setItem('pawmatch_guest_token', gToken);
            setGuestToken(gToken);
          }
        } catch (e) {
          console.warn('Guest token generation error:', e.message);
        }
      } else {
        setGuestToken(gToken);
      }

      setLoading(false);
    }

    initAuth();
  }, []);

  async function refreshUser() {
    try {
      const res = await api.getMe();
      if (res && res.user) {
        setUser(normalizeUser(res.user));
      }
    } catch (e) {
      console.warn('Failed to refresh user:', e.message);
    }
  }

  async function login(email, password) {
    const res = await api.login({ email, password });
    if (res && res.token && res.user) {
      localStorage.setItem('pawmatch_token', res.token);
      const normalized = normalizeUser(res.user);
      setUser(normalized);
      return normalized;
    }
  }

  async function register(arg1, arg2, arg3) {
    let payload = {};
    if (typeof arg1 === 'object') {
      payload = arg1;
    } else {
      payload = { name: arg1, email: arg2, password: arg3, role: 'adopter' };
    }

    const res = await api.register(payload);
    if (res && res.token && res.user) {
      localStorage.setItem('pawmatch_token', res.token);
      const normalized = normalizeUser(res.user);
      setUser(normalized);
      return normalized;
    }
  }

  async function updateUserProfile(payload) {
    const res = await api.updateProfile(payload);
    if (res && res.user) {
      const normalized = normalizeUser(res.user);
      setUser(normalized);
      return normalized;
    }
  }

  function logout() {
    localStorage.removeItem('pawmatch_token');
    setUser(null);
  }

  const isDemo = user?.email === 'adopter@pawmatch.in' || user?.id === 'usr_adopter_demo';
  const isPremium = Boolean(user?.isPremium || isDemo);

  const value = {
    user,
    guestToken,
    loading,
    isAuthenticated: Boolean(user),
    isAdopter: true,
    isPremium,
    login,
    register,
    logout,
    refreshUser,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
