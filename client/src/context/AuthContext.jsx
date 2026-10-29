import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);

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
            setUser(res.user);
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
        setUser(res.user);
      }
    } catch (e) {
      console.warn('Failed to refresh user:', e.message);
    }
  }

  async function login(email, password) {
    const res = await api.login({ email, password });
    if (res && res.token && res.user) {
      localStorage.setItem('pawmatch_token', res.token);
      setUser(res.user);
      return res.user;
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
      setUser(res.user);
      return res.user;
    }
  }

  function logout() {
    localStorage.removeItem('pawmatch_token');
    setUser(null);
  }

  const value = {
    user,
    guestToken,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    isShelter: user?.role === 'shelter',
    isAdopter: user?.role === 'adopter',
    isPremium: Boolean(user?.isPremium),
    login,
    register,
    logout,
    refreshUser
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
