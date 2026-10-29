import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import {
  PawPrint,
  Compass,
  ArrowRight,
  Award,
  Sparkles,
  Bot,
  IndianRupee,
  Search,
  Filter
} from 'lucide-react';

export default function BreedExplorerSection() {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('all');

  useEffect(() => {
    async function loadPets() {
      try {
        const res = await api.getPets();
        if (res && res.pets) {
          setFeaturedPets(res.pets);
        }
      } catch (err) {
        console.warn('Failed to load pets:', err.message);
      }
    }
    loadPets();
  }, []);

  const filteredPets = featuredPets.filter(pet => {
    const matchesSearch = pet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pet.breed?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = selectedSpecies === 'all' || pet.species?.toLowerCase() === selectedSpecies.toLowerCase();
    return matchesSearch && matchesSpecies;
  });

  return (
    <section className="relative z-20 bg-[#0c0a09] text-stone-100 py-24 border-t border-white/10">
      
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative">
        
        {/* ─── CHAPTER 04 HEADER ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Chapter 04 • The Companion Catalog</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Explore Resilient Profiles
            </h2>
            <p className="text-sm sm:text-base text-stone-400 font-medium">
              Real energy, apartment square footage, heat tolerance, and monthly cost ratings for urban India.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/advisor"
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-amber-300 font-bold text-xs border border-amber-400/30 backdrop-blur-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>Ask AI Pet Advisor</span>
            </Link>

            <Link
              to="/pets"
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <PawPrint className="w-4 h-4" />
              <span>View All Breeds</span>
            </Link>
          </div>
        </div>

        {/* ─── SEARCH & FILTER TABS ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by breed or traits..."
              className="w-full pl-10 pr-4 py-2 bg-transparent text-sm text-white placeholder-stone-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
            {['all', 'dog', 'cat', 'rabbit', 'bird', 'fish'].map((sp) => (
              <button
                key={sp}
                onClick={() => setSelectedSpecies(sp)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold capitalize transition-all whitespace-nowrap ${
                  selectedSpecies === sp
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                    : 'text-stone-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {sp}
              </button>
            ))}
          </div>
        </div>

        {/* ─── BREED CARDS GRID (Luxury Dark Mode) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(filteredPets.length > 0 ? filteredPets.slice(0, 6) : [
            {
              id: 'indie-pariah',
              name: 'Indian Pariah Dog (Desi / Indie)',
              species: 'dog',
              is_native: true,
              size: 'Medium',
              coat_type: 'Short',
              min_space_sqft: 450,
              energy_level: 4,
              heat_tolerance: 5,
              base_monthly_cost_inr: 2500,
              slug: 'indian-pariah-dog'
            },
            {
              id: 'domestic-shorthair',
              name: 'Domestic Shorthair (Indie Cat)',
              species: 'cat',
              is_native: true,
              size: 'Medium',
              coat_type: 'Short',
              min_space_sqft: 350,
              energy_level: 3,
              heat_tolerance: 5,
              base_monthly_cost_inr: 1800,
              slug: 'indian-indie-cat'
            },
            {
              id: 'beagle',
              name: 'Beagle',
              species: 'dog',
              is_native: false,
              size: 'Medium',
              coat_type: 'Short',
              min_space_sqft: 600,
              energy_level: 4,
              heat_tolerance: 3,
              base_monthly_cost_inr: 4500,
              slug: 'beagle'
            },
            {
              id: 'shih-tzu',
              name: 'Shih Tzu',
              species: 'dog',
              is_native: false,
              size: 'Small',
              coat_type: 'Long',
              min_space_sqft: 400,
              energy_level: 2,
              heat_tolerance: 2,
              base_monthly_cost_inr: 4800,
              slug: 'shih-tzu'
            },
            {
              id: 'labrador-retriever',
              name: 'Labrador Retriever',
              species: 'dog',
              is_native: false,
              size: 'Large',
              coat_type: 'Dense',
              min_space_sqft: 800,
              energy_level: 4,
              heat_tolerance: 2,
              base_monthly_cost_inr: 6000,
              slug: 'labrador-retriever'
            },
            {
              id: 'persian-cat',
              name: 'Persian Cat',
              species: 'cat',
              is_native: false,
              size: 'Medium',
              coat_type: 'Longhair',
              min_space_sqft: 400,
              energy_level: 1,
              heat_tolerance: 1,
              base_monthly_cost_inr: 5200,
              slug: 'persian-cat'
            }
          ]).map((pet) => (
            <div
              key={pet.id}
              className="bg-stone-900/70 rounded-3xl border border-white/10 p-6 backdrop-blur-xl shadow-xl hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                    {pet.species}
                  </span>
                  {pet.is_native && (
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <Award className="w-3 h-3 text-emerald-400" />
                      Native Indie
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                  {pet.name}
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  {pet.size} build • {pet.coat_type} coat • Min {pet.min_space_sqft || 400} sq ft
                </p>

                {/* 3 Metrics Badge Grid */}
                <div className="grid grid-cols-3 gap-2 mt-5 text-center text-xs font-mono">
                  <div className="bg-white/5 border border-white/5 p-2 rounded-xl">
                    <span className="block text-[10px] text-stone-500">ENERGY</span>
                    <span className="font-bold text-white">{pet.energy_level || 3}/5</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-2 rounded-xl">
                    <span className="block text-[10px] text-stone-500">HEAT FIT</span>
                    <span className="font-bold text-amber-400">{pet.heat_tolerance || 4}/5</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-2 rounded-xl">
                    <span className="block text-[10px] text-stone-500">MONTHLY</span>
                    <span className="font-bold text-emerald-400">₹{pet.base_monthly_cost_inr || 3000}</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/pets/${pet.slug || 'indian-pariah-dog'}`}
                className="mt-6 w-full py-2.5 text-center text-xs font-mono font-bold text-stone-300 bg-white/5 hover:bg-amber-500 hover:text-black rounded-xl border border-white/10 hover:border-amber-400 transition-all block"
              >
                Inspect Full Profile & Benchmarks
              </Link>
            </div>
          ))}
        </div>

        {/* ─── FINAL CINEMATIC CALL TO ACTION BANNER ─── */}
        <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden border border-amber-500/40 bg-gradient-to-r from-amber-600/30 via-orange-600/20 to-black/80 backdrop-blur-2xl shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-mono uppercase tracking-widest border border-white/10">
                <Compass className="w-3.5 h-3.5" />
                <span>Ready for your lifestyle match?</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                A 15-year happy bond starts with an honest 3-minute quiz.
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Discover if your apartment, work schedule, and monthly budget match an Indian Indie dog, a serene rescue cat, or an exotic companion.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">
              <Link
                to="/quiz"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-extrabold text-base shadow-xl shadow-orange-500/30 hover:scale-105 transition-all block text-center"
              >
                Start Free Compatibility Quiz
              </Link>

              <Link
                to="/advisor"
                className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/20 transition-all flex items-center gap-2"
              >
                <Bot className="w-5 h-5 text-amber-400" />
                <span>AI Advisor</span>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
