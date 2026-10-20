import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import {
  PawPrint,
  Search,
  Filter,
  Award,
  Sun,
  IndianRupee,
  Home,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export default function ExplorePetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [species, setSpecies] = useState('all');
  const [isNativeOnly, setIsNativeOnly] = useState(false);
  const [apartmentOnly, setApartmentOnly] = useState(false);
  const [budgetBand, setBudgetBand] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadPets() {
      setLoading(true);
      try {
        const params = {};
        if (species !== 'all') params.species = species;
        if (isNativeOnly) params.isNative = 'true';
        if (apartmentOnly) params.apartmentFriendly = 'true';
        if (budgetBand !== 'all') params.budgetBand = budgetBand;
        if (search.trim()) params.search = search.trim();

        const res = await api.getPets(params);
        setPets(res.pets || []);
      } catch (err) {
        console.error('Failed to load pets:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPets();
  }, [species, isNativeOnly, apartmentOnly, budgetBand, search]);

  function resetFilters() {
    setSpecies('all');
    setIsNativeOnly(false);
    setApartmentOnly(false);
    setBudgetBand('all');
    setSearch('');
  }

  const speciesOptions = [
    { id: 'all', label: 'All Species' },
    { id: 'dog', label: 'Dogs' },
    { id: 'cat', label: 'Cats' },
    { id: 'small_pet', label: 'Small Pets' },
    { id: 'bird', label: 'Birds' },
    { id: 'fish', label: 'Aquarium' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-sand-200">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Breeds & Species</span>
          <h1 className="text-3xl sm:text-4xl font-black text-sand-900 tracking-tight">
            Explore 22 Pet Profiles
          </h1>
          <p className="text-sm text-sand-800 mt-1">
            Compare behavioral demands, Indian climate resilience, and realistic ownership budgets.
          </p>
        </div>

        <Link
          to="/quiz"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-soft transition-colors flex-shrink-0"
        >
          <span>Take Lifestyle Match Quiz</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-sand-200 shadow-card space-y-4">
        
        {/* Search input & reset */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-sand-800 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by breed name (e.g. Indie, Labrador, Mudhol, Persian)..."
              className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {(species !== 'all' || isNativeOnly || apartmentOnly || budgetBand !== 'all' || search) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs font-bold text-sand-800 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-sand-100 transition-colors flex-shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-sand-100">
          
          {/* Species Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {speciesOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSpecies(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  species === opt.id
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-sand-100 text-sand-800 hover:bg-sand-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-sand-200 hidden sm:block mx-1" />

          {/* Toggle Native Indie */}
          <button
            onClick={() => setIsNativeOnly(!isNativeOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              isNativeOnly
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-white text-sand-800 border-sand-300 hover:bg-sand-100'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Native Indies Only</span>
          </button>

          {/* Toggle Apartment Friendly */}
          <button
            onClick={() => setApartmentOnly(!apartmentOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              apartmentOnly
                ? 'bg-brand-100 text-brand-800 border-brand-300'
                : 'bg-white text-sand-800 border-sand-300 hover:bg-sand-100'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-brand-600" />
            <span>Apartment Friendly</span>
          </button>

        </div>
      </div>

      {/* Grid of Pets */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-sand-800">Filtering breed catalog...</p>
        </div>
      ) : pets.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-sand-200 space-y-3">
          <PawPrint className="w-12 h-12 text-sand-800 mx-auto" />
          <h3 className="font-bold text-lg text-sand-900">No matching pets found</h3>
          <p className="text-xs text-sand-800 max-w-sm mx-auto">
            Try adjusting your search criteria or reset filters to view all 22 companion profiles.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs"
          >
            Show All Pets
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-card hover:shadow-hover transition-all flex flex-col justify-between group"
            >
              <div className="p-6 space-y-4">
                
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      {pet.is_native && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <Award className="w-3 h-3" /> Native Indie
                        </span>
                      )}
                      <span className="text-xs text-sand-800 capitalize font-medium">{pet.species}</span>
                    </div>
                    <h3 className="text-lg font-black text-sand-900 group-hover:text-brand-600 transition-colors">
                      {pet.name}
                    </h3>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-sand-100 text-sand-800 flex-shrink-0">
                    {pet.size}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-sand-50 p-2 rounded-xl">
                    <span className="block text-[10px] text-sand-800">Energy</span>
                    <span className="font-bold text-sand-900">{pet.energy_level}/5</span>
                  </div>
                  <div className="bg-sand-50 p-2 rounded-xl">
                    <span className="block text-[10px] text-sand-800">Heat Fit</span>
                    <span className="font-bold text-sand-900">{pet.heat_tolerance}/5</span>
                  </div>
                  <div className="bg-sand-50 p-2 rounded-xl">
                    <span className="block text-[10px] text-sand-800">Est. Cost</span>
                    <span className="font-bold text-emerald-700">₹{pet.base_monthly_cost_inr}/mo</span>
                  </div>
                </div>

                <div className="text-xs text-sand-800 space-y-1">
                  <div className="flex justify-between">
                    <span>Min Living Space:</span>
                    <span className="font-semibold text-sand-900">{pet.min_space_sqft} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Alone Time:</span>
                    <span className="font-semibold text-sand-900">{pet.max_alone_hours} hrs/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coat Type:</span>
                    <span className="font-semibold text-sand-900 capitalize">{pet.coat_type}</span>
                  </div>
                </div>

              </div>

              <div className="p-4 bg-sand-50 border-t border-sand-200">
                <Link
                  to={`/pets/${pet.slug}`}
                  className="w-full py-2.5 text-center text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors block shadow-sm"
                >
                  View Profile & Indian Care Guide
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
