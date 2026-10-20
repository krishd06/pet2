import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  HeartHandshake,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  Sparkles,
  Calendar,
  CheckCircle2,
  Filter,
  ExternalLink,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function AdoptableAnimalsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { guestToken } = useAuth();

  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAssessmentScore, setHasAssessmentScore] = useState(false);

  // Filters
  const searchParams = new URLSearchParams(location.search);
  const initialBreed = searchParams.get('breed') || '';
  const initialCity = searchParams.get('city') || '';

  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [breedFilter, setBreedFilter] = useState(initialBreed);

  // Modal for shelter direct outreach
  const [activeAnimalModal, setActiveAnimalModal] = useState(null);

  useEffect(() => {
    async function loadAnimals() {
      setLoading(true);
      try {
        const params = {};
        if (selectedCity) params.city = selectedCity;
        if (selectedSpecies !== 'all') params.species = selectedSpecies;
        if (breedFilter.trim()) params.breed = breedFilter.trim();
        if (guestToken) params.guestToken = guestToken;

        const res = await api.getAnimals(params);
        setAnimals(res.animals || []);
        setHasAssessmentScore(Boolean(res.hasAssessmentScore));
      } catch (err) {
        console.error('Failed to load animals:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnimals();
  }, [selectedCity, selectedSpecies, breedFilter, guestToken]);

  function resetFilters() {
    setSelectedCity('');
    setSelectedSpecies('all');
    setBreedFilter('');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-sand-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Direct Shelter Outreach</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-sand-900 tracking-tight">
            Adoptable Animals in India
          </h1>
          <p className="text-sm text-sand-800 mt-1">
            Real companion animals ready for loving homes. Connect directly with verified shelters without broker markups.
          </p>
        </div>

        {hasAssessmentScore && (
          <div className="bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Personalized match scores loaded from your latest assessment!</span>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-sand-200 shadow-card flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* City Selector */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs font-bold bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">All Indian Cities</option>
              {['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Species Selector */}
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'dog', label: 'Dogs' },
              { id: 'cat', label: 'Cats' },
              { id: 'small_pet', label: 'Small Pets' }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSpecies(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedSpecies === s.id
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-sand-100 text-sand-800 hover:bg-sand-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Breed text input */}
          <input
            type="text"
            value={breedFilter}
            onChange={(e) => setBreedFilter(e.target.value)}
            placeholder="Filter by breed (e.g. Pariah, Labrador)..."
            className="text-xs bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {(selectedCity || selectedSpecies !== 'all' || breedFilter) && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-bold text-sand-800 hover:text-red-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}

      </div>

      {/* Animal Cards Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-sand-800">Loading adoptable animals from verified shelters...</p>
        </div>
      ) : animals.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-sand-200 space-y-3">
          <HeartHandshake className="w-12 h-12 text-sand-800 mx-auto" />
          <h3 className="font-bold text-lg text-sand-900">No animals matching this filter</h3>
          <p className="text-xs text-sand-800 max-w-sm mx-auto">
            Try resetting your city or breed filters to see more wonderful rescues looking for forever homes.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map((anim) => {
            const hasScore = anim.breedMatchScore !== null && anim.breedMatchScore !== undefined;

            return (
              <div
                key={anim.id}
                className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-card hover:shadow-hover transition-all flex flex-col justify-between group"
              >
                {/* Photo Header */}
                <div className="relative h-48 w-full bg-sand-200 overflow-hidden">
                  <img
                    src={anim.photo_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80'}
                    alt={anim.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-sand-900/80 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-400" />
                      {anim.city}
                    </span>
                    {anim.is_native_breed && (
                      <span className="bg-emerald-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        Native Indie
                      </span>
                    )}
                  </div>

                  {/* Breed Match Score Pill */}
                  {hasScore && (
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl shadow-md text-right border border-sand-200">
                      <span className="text-[10px] text-sand-800 font-bold uppercase block leading-none">Your Match</span>
                      <span className="text-sm font-black text-brand-600">{anim.breedMatchScore}%</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-extrabold text-sand-900">{anim.name}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-sand-100 text-sand-800 capitalize">
                        {anim.gender} • {anim.size}
                      </span>
                    </div>
                    <span className="text-xs text-sand-800 block mt-0.5 font-medium">
                      {anim.breed} • ~{Math.round(anim.age_months / 12 * 10) / 10} yrs old
                    </span>

                    <p className="text-xs text-sand-800 mt-2.5 line-clamp-3 leading-relaxed">
                      {anim.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-sand-100 text-xs">
                    <div className="flex items-center gap-2 text-sand-800">
                      <span className="font-semibold">Shelter:</span>
                      <span className="text-sand-900 truncate">{anim.shelter_name || 'Verified Shelter'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-emerald-800 text-[11px] font-medium">
                      {anim.vaccinated && <span>✓ Vaccinated</span>}
                      {anim.neutered && <span>✓ Spayed/Neutered</span>}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 bg-sand-50 border-t border-sand-200 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveAnimalModal(anim)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-sand-100 border border-sand-300 text-sand-900 text-xs font-bold transition-colors text-center"
                  >
                    Contact Shelter
                  </button>

                  <Link
                    to={`/foster?animalId=${anim.id}&animalName=${encodeURIComponent(anim.name)}`}
                    className="py-2 px-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition-colors text-center flex items-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Plan Foster</span>
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Shelter Contact Modal */}
      {activeAnimalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-sand-200 relative">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Direct Shelter Outreach</span>
                <h3 className="text-2xl font-black text-sand-900">Adopt {activeAnimalModal.name}</h3>
                <p className="text-xs text-sand-800">{activeAnimalModal.breed} in {activeAnimalModal.city}</p>
              </div>
              <button
                onClick={() => setActiveAnimalModal(null)}
                className="p-1.5 rounded-xl hover:bg-sand-100 text-sand-800"
              >
                ✕
              </button>
            </div>

            {/* Shelter Contact Card */}
            <div className="bg-sand-50 rounded-2xl p-5 border border-sand-200 space-y-3.5 text-xs">
              <div className="font-bold text-sm text-sand-900 pb-2 border-b border-sand-200">
                {activeAnimalModal.shelter_name}
              </div>

              {activeAnimalModal.shelter_phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <a
                    href={`tel:${activeAnimalModal.shelter_phone}`}
                    className="text-sand-900 font-bold hover:text-brand-600 text-sm"
                  >
                    {activeAnimalModal.shelter_phone}
                  </a>
                </div>
              )}

              {activeAnimalModal.shelter_email && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <a
                    href={`mailto:${activeAnimalModal.shelter_email}`}
                    className="text-sand-800 font-medium hover:text-brand-600 truncate"
                  >
                    {activeAnimalModal.shelter_email}
                  </a>
                </div>
              )}

              {activeAnimalModal.shelter_website && (
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-sand-800 flex-shrink-0" />
                  <a
                    href={activeAnimalModal.shelter_website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Visit Shelter Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {activeAnimalModal.shelter_address && (
                <div className="pt-2 border-t border-sand-200 text-sand-800">
                  <span className="font-bold text-sand-900 block mb-0.5">Address:</span>
                  <p className="leading-relaxed">{activeAnimalModal.shelter_address}</p>
                </div>
              )}
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-[11px] text-amber-900 leading-relaxed">
              <strong>Zero Application Workflow:</strong> Call or email the shelter directly to coordinate an in-person meeting or arrange a home visit.
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveAnimalModal(null)}
                className="flex-1 py-2.5 text-xs font-bold text-sand-800 bg-sand-100 rounded-xl hover:bg-sand-200"
              >
                Close
              </button>
              <Link
                to={`/foster?animalId=${activeAnimalModal.id}&animalName=${encodeURIComponent(activeAnimalModal.name)}`}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-brand-500 rounded-xl hover:bg-brand-600 text-center shadow-sm"
              >
                Plan a Trial Foster
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
