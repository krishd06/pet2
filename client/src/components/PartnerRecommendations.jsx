import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import {
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Tag,
  Info,
  MapPin,
  Heart
} from 'lucide-react';

export default function PartnerRecommendations({
  species = 'dog',
  size = 'medium',
  firstTime = 'true',
  budget = 'medium',
  city = '',
  sourcePage = 'results',
  limit = 4,
  title = 'Recommended for You & Your Pet',
  subtitle = 'Curated ethical nutrition, insurance, training, and wellness essentials.'
}) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPartners() {
      setLoading(true);
      try {
        const res = await api.getPartners({ species, size, firstTime, budget, city });
        if (res && res.partners) {
          setPartners(res.partners.slice(0, limit));
        }
      } catch (err) {
        console.warn('Failed to load partner recommendations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPartners();
  }, [species, size, firstTime, budget, city, limit]);

  if (loading) {
    return (
      <div className="bg-sand-100/60 rounded-3xl p-6 border border-sand-200 animate-pulse text-center text-xs text-sand-800">
        Loading personalized recommendations...
      </div>
    );
  }

  if (partners.length === 0) return null;

  const sessionId = localStorage.getItem('pawmatch_guest_token') || 'anon_session';
  const apiBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-sand-200">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Partner Recommendations</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-sand-900 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-sand-800 mt-0.5">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-sand-800 bg-sand-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Indian Providers</span>
        </div>
      </div>

      {/* Grid of Partner Offerings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {partners.map((partner) => {
          // Outbound tracking link
          const redirectUrl = `${apiBase}/go/${partner.id}?from=${encodeURIComponent(sourcePage)}&sid=${encodeURIComponent(sessionId)}`;
          const isSponsored = partner.badge_label?.toLowerCase() === 'sponsored';

          return (
            <div
              key={partner.id}
              className="bg-sand-50/70 hover:bg-white rounded-2xl p-5 border border-sand-200/90 shadow-sm hover:shadow-soft transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Badge Row: Category & Partner Label */}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sand-200/80 text-sand-800">
                    {partner.category}
                  </span>
                  
                  {/* Distinct, compulsory Partner / Sponsored badge */}
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isSponsored
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-brand-100 text-brand-800 border-brand-200'
                    }`}
                  >
                    {partner.badge_label || 'Partner'}
                  </span>
                </div>

                {/* Partner Title */}
                <h4 className="font-extrabold text-sand-900 text-sm group-hover:text-brand-600 transition-colors leading-snug">
                  {partner.name}
                </h4>

                {/* Description */}
                <p className="text-xs text-sand-800 line-clamp-3 leading-relaxed">
                  {partner.description}
                </p>

                {/* Geo badge if city specific */}
                {partner.city && (
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-sand-800">
                    <MapPin className="w-3 h-3 text-brand-600" />
                    <span>Available in {partner.city}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-3 border-t border-sand-200/60">
                <a
                  href={redirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-brand-500 hover:text-white text-sand-900 border border-sand-300 hover:border-brand-500 font-bold text-xs shadow-sm transition-all text-center"
                >
                  <span>Explore Partner</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Affiliate Disclosure Note */}
      <div className="pt-2 border-t border-sand-200/60 flex items-start gap-2 text-[11px] text-sand-800 leading-relaxed">
        <Info className="w-3.5 h-3.5 text-sand-800 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Affiliate Disclosure:</strong> PawMatch India collaborates with vetted pet care brands. When you purchase through verified partner links above, we may receive an affiliate referral commission at zero additional cost to you, which directly supports native Indie street rescue and adoption programs.
        </p>
      </div>

    </section>
  );
}
