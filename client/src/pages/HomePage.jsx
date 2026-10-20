import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import AntigravityScene, { ANIMAL_MODELS } from '../components/three/AntigravityScene.jsx';
import {
  Compass,
  PawPrint,
  Heart,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronRight,
  Sun,
  IndianRupee,
  Home,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Activity,
  Calendar,
  Layers,
  Eye,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export default function HomePage() {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [activeMythTab, setActiveMythTab] = useState(0);
  const [activeAnimal, setActiveAnimal] = useState('flamingo');
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.getPets();
        if (res && res.pets) {
          // Highlight native indies first
          setFeaturedPets(res.pets.slice(0, 6));
        }
      } catch (err) {
        console.warn('Failed to load featured pets:', err.message);
      }
    }
    loadFeatured();
  }, []);

  const myths = [
    {
      myth: '“Indie dogs are aggressive street dogs and cannot live in apartment flats.”',
      fact: 'Indies are exceptionally calm indoor sleepers when given 40 minutes of daily walking. They are clean, rarely bark without reason, and house-train faster than most imported breeds.',
      badge: 'Urban Living'
    },
    {
      myth: '“Huskies and Saint Bernards will adapt just fine to Indian summers with ice cubes.”',
      fact: 'Arctic breeds possess heavy insulating double coats built for -40°C tundras. In 40°C Indian heat and humidity, they suffer chronic heat stress, dehydration, and eczema.',
      badge: 'Climate Health'
    },
    {
      myth: '“Housing Societies and RWAs can legally ban pet dogs or cats.”',
      fact: 'False. Under statutory guidelines from the Animal Welfare Board of India (AWBI) and Supreme Court rulings, housing societies cannot ban companion animals or impose discriminatory bylaws.',
      badge: 'Adopter Rights'
    },
    {
      myth: '“Buying a purebred puppy from an online shop or market is safe and legal.”',
      fact: 'Commercial puppy mills in India frequently subject mother dogs to cruel continuous breeding in wire cages, producing puppies with severe inbreeding defects and parvo vulnerabilities.',
      badge: 'Responsible Welfare'
    }
  ];

  return (
    <div id="home-scroll-root" className="relative min-h-screen">
      
      {/* ─── 3D ANTIGRAVITY IMMERSIVE CANVAS (Fixed in background) ─── */}
      <AntigravityScene
        scrollContainerId="home-scroll-root"
        activeAnimal={activeAnimal}
      />

      {/* ─── DOCKED 3D ANIMAL TASKBAR CONTROLLER ─── */}
      <aside aria-label="3D Animal Controls" className="fixed bottom-4 left-4 sm:left-6 z-40 pointer-events-auto">
        {!isSwitcherOpen ? (
          <button
            id="open-animal-switcher"
            onClick={() => setIsSwitcherOpen(true)}
            className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-stone-900/90 hover:bg-stone-900 backdrop-blur-xl border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-xl shadow-black/50 transition-all hover:scale-105 hover:border-amber-400"
            title="Open 3D Animal Switcher"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-bold text-[11px] tracking-wide">3D Model</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-[10px] text-amber-200 uppercase font-mono">
              {ANIMAL_MODELS[activeAnimal]?.name.split(' ')[1] || activeAnimal}
            </span>
            <ChevronUp className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-300 transition-transform group-hover:-translate-y-0.5" />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-stone-900/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl shadow-black/60 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-1.5 pl-3 pr-2 text-xs font-bold text-amber-300/90 tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">3D Model:</span>
            </div>

            <div
              className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {Object.values(ANIMAL_MODELS).map((animal) => {
                const isSelected = activeAnimal === animal.id;
                return (
                  <button
                    key={animal.id}
                    onClick={() => setActiveAnimal(animal.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/30 scale-105'
                        : 'text-stone-300 hover:text-white hover:bg-white/10'
                    }`}
                    title={`Switch to ${animal.name}`}
                  >
                    <span>{animal.badge}</span>
                    <span className="inline">{animal.name.split(' ')[1] || animal.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-1 pl-2 pr-2 text-[10px] text-stone-400 font-medium border-l border-white/10">
              <span>Scroll to orbit</span>
            </div>

            <button
              id="close-animal-switcher"
              onClick={() => setIsSwitcherOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors ml-1"
              title="Minimize to taskbar"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>

      {/* ─── SCROLLABLE CONTENT OVERLAY ─── */}
      <div className="relative z-10 space-y-24 pb-28">

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
          {/* Subtle decorative background gradient circles */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-brand-200/40 via-amber-100/30 to-emerald-100/30 blur-3xl -z-10 rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100/90 backdrop-blur-sm border border-brand-200 text-brand-800 text-xs font-bold uppercase tracking-wider shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Award className="w-4 h-4 text-brand-600" />
              <span>Built for Urban Indian Lifestyles</span>
            </div>

            {/* Headline */}
            <div className="max-w-4xl mx-auto space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-sand-900 tracking-tight leading-[1.12]">
                Find a pet that matches your <span className="text-brand-600 underline decoration-brand-300 decoration-wavy decoration-2">real lifestyle</span>, not just trends.
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-sand-800 max-w-2xl mx-auto leading-relaxed">
                Skip impulse buying and heartbreak. Our explainable rule-based engine evaluates your apartment size, work hours, Indian city climate, and budget to connect you with resilient native Indies and compatible companions.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/quiz"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-base shadow-soft hover:shadow-hover transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                <span>Find My Match in 3 Minutes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/pets"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/90 hover:bg-white text-sand-800 font-bold text-base border border-sand-300 shadow-sm transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <PawPrint className="w-5 h-5 text-brand-600" />
                <span>Explore 22 Breeds</span>
              </Link>
            </div>

            {/* Value Props Strip */}
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="bg-white/85 backdrop-blur-md p-4 rounded-2xl border border-sand-200/80 shadow-card">
                <ShieldCheck className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-sm text-sand-900">Zero Guesswork</h4>
                <p className="text-xs text-sand-800 mt-0.5">Strict deal-breakers filter out pets that don't fit.</p>
              </div>
              <div className="bg-white/85 backdrop-blur-md p-4 rounded-2xl border border-sand-200/80 shadow-card">
                <Sun className="w-6 h-6 text-brand-500 mb-2" />
                <h4 className="font-bold text-sm text-sand-900">Climate Fit First</h4>
                <p className="text-xs text-sand-800 mt-0.5">Rated for tropical Indian heat and urban humidity.</p>
              </div>
              <div className="bg-white/85 backdrop-blur-md p-4 rounded-2xl border border-sand-200/80 shadow-card">
                <Award className="w-6 h-6 text-brand-600 mb-2" />
                <h4 className="font-bold text-sm text-sand-900">Native Indie Focus</h4>
                <p className="text-xs text-sand-800 mt-0.5">Desi dogs and cats get a well-deserved priority bonus.</p>
              </div>
              <div className="bg-white/85 backdrop-blur-md p-4 rounded-2xl border border-sand-200/80 shadow-card">
                <IndianRupee className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-sm text-sand-900">True Cost Forecast</h4>
                <p className="text-xs text-sand-800 mt-0.5">1-year and 5-year vet and food forecaster.</p>
              </div>
            </div>

          </div>
        </section>

      {/* 3-Step How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Simple & Transparent</span>
          <h2 className="text-3xl font-extrabold text-sand-900">How PawMatch India Works</h2>
          <p className="text-sm text-sand-800">
            No black-box algorithms or aesthetic impulse swipes. Every recommendation is completely explainable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-card relative flex flex-col items-start">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-black text-lg mb-5">
              1
            </div>
            <h3 className="font-bold text-lg text-sand-900 mb-2">Tell Us Your Real Routine</h3>
            <p className="text-sm text-sand-800 leading-relaxed">
              Answer quick questions about your home footprint, daily alone hours, landlord rules, budget, and local city climate.
            </p>
            <div className="mt-4 pt-4 border-t border-sand-100 text-xs font-medium text-brand-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Guest mode enabled (no signup required)
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-card relative flex flex-col items-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg mb-5">
              2
            </div>
            <h3 className="font-bold text-lg text-sand-900 mb-2">We Run the Compatibility Engine</h3>
            <p className="text-sm text-sand-800 leading-relaxed">
              Binary deal-breakers exclude incompatible pets with clear reasons. Remaining pets are scored across 9 weighted dimensions.
            </p>
            <div className="mt-4 pt-4 border-t border-sand-100 text-xs font-medium text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Top 3 strengths & top 3 friction points
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-card relative flex flex-col items-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg mb-5">
              3
            </div>
            <h3 className="font-bold text-lg text-sand-900 mb-2">Adopt Responsibly</h3>
            <p className="text-sm text-sand-800 leading-relaxed">
              Connect directly with verified shelters, start a self-managed trial foster, and follow our 3-3-3 rule onboarding roadmap.
            </p>
            <div className="mt-4 pt-4 border-t border-sand-100 text-xs font-medium text-amber-800 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Zero adoption markup or broker fees
            </div>
          </div>

        </div>
      </section>

      {/* Spotlight on Native Indies & Myths vs Facts */}
      <section className="bg-gradient-to-b from-brand-50/70 to-sand-100/50 py-16 border-y border-sand-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Native Advantage</span>
              </div>
              <h2 className="text-3xl font-extrabold text-sand-900">
                Why Native Indian Breeds (Indies) Win Urban Hearts
              </h2>
              <p className="text-sm text-sand-800">
                Thousands of years of natural selection make Indian Pariah dogs and Indie cats the healthiest, most resilient companions for our climate.
              </p>
            </div>

            <Link
              to="/pets/indian-pariah-dog"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 bg-white px-5 py-2.5 rounded-xl border border-brand-200 shadow-sm transition-colors flex-shrink-0"
            >
              <span>Read Full Indie Guide</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Comparison Cards: Indie vs Imported */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* The Indie Way */}
            <div className="bg-white p-7 rounded-3xl border-2 border-emerald-500/30 shadow-card space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Recommended Choice</span>
                  <h3 className="text-xl font-extrabold text-sand-900">Native Indian Indie Dogs & Cats</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <ul className="space-y-3 text-sm text-sand-800">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Naturally Immune:</strong> Rare genetic diseases. No congenital hip dysplasia or breathing distress.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Zero AC Dependency:</strong> Short coats naturally disperse heat, keeping them comfortable in Indian summers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Low-Maintenance Coat:</strong> Virtually self-grooming with no unpleasant doggy odor; minimal shedding.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Saves a Life:</strong> Adopting an Indie stops commercial mill exploitation and gives a loving home.</span>
                </li>
              </ul>
            </div>

            {/* Imported High-Maintenance Breeds */}
            <div className="bg-white p-7 rounded-3xl border border-sand-200 shadow-card space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Consider Carefully</span>
                  <h3 className="text-xl font-extrabold text-sand-900">Foreign / Arctic Imports (Husky, Pug, Persian)</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>

              <ul className="space-y-3 text-sm text-sand-800">
                <li className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Heat Distress:</strong> Arctic double coats or flat brachycephalic faces lead to heat exhaustion and breathing collapse.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span><strong>High Financial Burden:</strong> Frequent vet visits, skin allergy meds, and professional grooming salon expenses (₹6,000 - ₹9,000+/mo).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span><strong>High Rehoming Rates:</strong> Hundreds of Huskies, Pugs, and Labradors are abandoned in India every year when owners realize the upkeep.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Interactive Myths vs Facts Carousel */}
          <div className="bg-white p-8 rounded-3xl border border-sand-200 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-sand-900">Pet Adoption Myths Debunked</h3>
                <p className="text-xs text-sand-800">Click a myth to uncover the biological and legal facts.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {myths.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveMythTab(idx)}
                  className={`text-left p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                    activeMythTab === idx
                      ? 'bg-brand-500 text-white border-brand-500 shadow-soft'
                      : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100'
                  }`}
                >
                  <span className="block text-[10px] opacity-80 uppercase tracking-wider mb-1">{item.badge}</span>
                  <span className="line-clamp-2">{item.myth}</span>
                </button>
              ))}
            </div>

            <div className="bg-sand-50 p-6 rounded-2xl border border-sand-200 space-y-3">
              <div className="flex items-center gap-2 text-brand-600 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>The Reality & Fact:</span>
              </div>
              <p className="text-sand-900 font-medium text-sm sm:text-base leading-relaxed">
                {myths[activeMythTab].fact}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Explore Pets Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Catalog Preview</span>
            <h2 className="text-3xl font-extrabold text-sand-900">Explore Pet Profiles</h2>
            <p className="text-sm text-sand-800">22 companion types with realistic energy, space, and care ratings.</p>
          </div>
          <Link
            to="/pets"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            <span>View all 22 breeds</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-card hover:shadow-hover transition-all flex flex-col group"
            >
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-sand-800 capitalize">{pet.species}</span>
                    {pet.is_native && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <Award className="w-3 h-3" /> Native Indie
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-lg text-sand-900 group-hover:text-brand-600 transition-colors">
                    {pet.name}
                  </h3>
                  <p className="text-xs text-sand-800 mt-1 line-clamp-2">
                    {pet.size} build • {pet.coat_type} coat • Min {pet.min_space_sqft} sq ft
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-sand-100 grid grid-cols-3 gap-2 text-center text-xs">
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

                <Link
                  to={`/pets/${pet.slug}`}
                  className="mt-4 w-full py-2.5 text-center text-xs font-bold text-sand-800 bg-sand-100 hover:bg-brand-50 hover:text-brand-600 rounded-xl transition-colors block"
                >
                  View Profile & Care Tips
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 rounded-3xl p-8 sm:p-12 text-white shadow-hover flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              Ready to find your match?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              A 15-year happy bond starts with an honest 3-minute quiz.
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              Find out if your apartment, schedule, and budget match an Indian Indie, a calm cat, or a small pet.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              to="/quiz"
              className="px-8 py-4 rounded-2xl bg-white text-brand-700 hover:bg-sand-50 font-extrabold text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-105 block text-center"
            >
              Start Free Questionnaire
            </Link>
          </div>

        </div>
      </section>

      </div>
    </div>
  );
}

