import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import {
  PawPrint,
  Award,
  Sun,
  IndianRupee,
  Home,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  HeartHandshake,
  Compass,
  Sparkles,
  Info
} from 'lucide-react';

export default function PetDetailPage() {
  const { slug } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cost forecaster state
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [costForecast, setCostForecast] = useState(null);

  useEffect(() => {
    async function loadPetDetails() {
      setLoading(true);
      try {
        const res = await api.getPetBySlug(slug);
        if (res && res.pet) {
          setPet(res.pet);
          // Fetch initial cost
          const costs = await api.getCostForecast(res.pet.id, selectedCity);
          setCostForecast(costs);
        } else {
          setError('Pet not found');
        }
      } catch (err) {
        setError('Failed to load pet: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPetDetails();
  }, [slug]);

  // Update cost when city changes
  useEffect(() => {
    if (!pet) return;
    async function updateCost() {
      try {
        const costs = await api.getCostForecast(pet.id, selectedCity);
        setCostForecast(costs);
      } catch (e) {
        console.warn('Cost fetch error:', e);
      }
    }
    updateCost();
  }, [selectedCity, pet]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-sand-800">Loading companion care guide...</p>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-sand-900">{error || 'Pet not found'}</h2>
        <Link
          to="/pets"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Breeds</span>
        </Link>
      </div>
    );
  }

  const rich = pet.richContent || {};
  const care = rich.careGuide || {};

  const traitMeters = [
    { label: 'Energy & Exercise Needs', value: pet.energy_level, max: 5 },
    { label: 'Living Space Demand', value: pet.space_demand, max: 5 },
    { label: 'Time & Attention Demand', value: pet.time_attention_demand, max: 5 },
    { label: 'Grooming & Shedding', value: pet.grooming_demand, max: 5 },
    { label: 'Indian Heat Tolerance', value: pet.heat_tolerance, max: 5, highlight: true },
    { label: 'Cold Tolerance', value: pet.cold_tolerance, max: 5 },
    { label: 'Handling Experience Needed', value: pet.experience_level_required, max: 5 },
    { label: 'Household & Kid Friendliness', value: pet.household_fit, max: 5 }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      
      {/* Back link */}
      <div>
        <Link
          to="/pets"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-sand-800 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pet Directory</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sand-200 shadow-card grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        <div className="md:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {pet.is_native && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5 shadow-sm">
                <Award className="w-4 h-4" /> Native Indian Breed
              </span>
            )}
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-sand-100 text-sand-800 capitalize">
              {pet.species} • {pet.size} Build
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-sand-100 text-sand-800">
              Min {pet.min_space_sqft} sq ft
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-sand-900 tracking-tight">
            {pet.name}
          </h1>

          <p className="text-base text-sand-800 leading-relaxed font-medium">
            {rich.tagline || rich.about || 'A companion profile with realistic ratings for Indian urban pet parents.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs sm:text-sm shadow-soft transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Test Lifestyle Match</span>
            </Link>

            <Link
              to={`/adopt?breed=${encodeURIComponent(pet.breed)}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-sand-100 hover:bg-sand-200 text-sand-900 font-bold text-xs sm:text-sm transition-colors"
            >
              <HeartHandshake className="w-4 h-4 text-brand-600" />
              <span>Adoptable Animals</span>
            </Link>
          </div>
        </div>

        {/* Quick Highlights Card */}
        <div className="md:col-span-4 bg-sand-50 rounded-2xl p-5 border border-sand-200 space-y-3 text-xs">
          <h4 className="font-bold text-sand-900 uppercase tracking-wider text-[11px] pb-2 border-b border-sand-200">
            Key Breed Stats
          </h4>
          <div className="flex justify-between py-0.5">
            <span className="text-sand-800">Adult Weight:</span>
            <span className="font-bold text-sand-900">~{pet.adult_weight_kg} kg</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-sand-800">Max Alone Hours:</span>
            <span className="font-bold text-sand-900">{pet.max_alone_hours} hrs/day</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-sand-800">Coat Type:</span>
            <span className="font-bold text-sand-900 capitalize">{pet.coat_type}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-sand-800">Apartment Safe:</span>
            <span className="font-bold text-sand-900">{pet.apartment_friendly ? 'Yes' : 'Requires Yard'}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-sand-800">Low-Allergen:</span>
            <span className="font-bold text-sand-900">{pet.low_allergen ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-sand-200 font-bold text-sand-900 text-sm">
            <span>Base Monthly Cost:</span>
            <span className="text-emerald-700">₹{pet.base_monthly_cost_inr}</span>
          </div>
        </div>

      </div>

      {/* Trait Meters */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-sand-900">Behavioral & Environmental Trait Meters</h2>
          <p className="text-xs text-sand-800">Rated on a standardized 1 to 5 scale.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {traitMeters.map((meter, idx) => (
            <div key={idx} className="space-y-1.5 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-sand-800">{meter.label}</span>
                <span className="text-sand-900 font-bold">{meter.value} / {meter.max}</span>
              </div>
              <div className="w-full bg-sand-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    meter.highlight && meter.value >= 4 ? 'bg-emerald-500' : 'bg-brand-500'
                  }`}
                  style={{ width: `${(meter.value / meter.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rich Guide: About, Climate & Heritage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Heritage & Temperament */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-4">
          <div className="flex items-center gap-2 text-brand-600 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Heritage & Origin</span>
          </div>
          <h3 className="text-xl font-extrabold text-sand-900">Background & Personality</h3>
          <p className="text-xs sm:text-sm text-sand-800 leading-relaxed">
            {rich.historyAndOrigin || rich.about || 'A loyal companion with deep roots in domestic animal history.'}
          </p>

          <div className="pt-3 border-t border-sand-100">
            <h4 className="font-bold text-xs text-sand-900 uppercase tracking-wider mb-1">Temperament Overview</h4>
            <p className="text-xs sm:text-sm text-sand-800 leading-relaxed">
              {rich.temperamentOverview || 'Affectionate, alert, and responsive to consistent gentle training.'}
            </p>
          </div>
        </div>

        {/* Indian Climate Care Guide */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-4">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
            <Sun className="w-4 h-4" />
            <span>Indian Climate Care</span>
          </div>
          <h3 className="text-xl font-extrabold text-sand-900">Seasonal Weather Fit</h3>
          <p className="text-xs sm:text-sm text-sand-800 leading-relaxed">
            {rich.climateCareGuide || 'Ensure clean fresh water, shaded relaxation spaces, and avoid walking during peak afternoon sun in Indian summers.'}
          </p>

          {rich.commonHealthIssues && (
            <div className="pt-3 border-t border-sand-100 space-y-1.5">
              <h4 className="font-bold text-xs text-sand-900 uppercase tracking-wider mb-1">Health Considerations</h4>
              <ul className="text-xs text-sand-800 space-y-1 list-disc pl-4">
                {rich.commonHealthIssues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>

      {/* Daily Care Playbook */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-sand-900">Daily Care & Management Playbook</h2>
          <p className="text-xs text-sand-800">Essential routines for urban Indian homes.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200 space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">Exercise</span>
            <p className="text-xs text-sand-800 leading-relaxed">
              {care.exerciseTips || 'Two brisk walks daily (30-45 mins total) plus indoor enrichment games.'}
            </p>
          </div>

          <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200 space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">Nutrition</span>
            <p className="text-xs text-sand-800 leading-relaxed">
              {care.nutritionGuide || 'Balanced veterinary-approved kibble combined with cooked chicken, eggs, and rice.'}
            </p>
          </div>

          <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200 space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">Grooming</span>
            <p className="text-xs text-sand-800 leading-relaxed">
              {care.groomingGuide || 'Routine brushing, monthly baths, and regular ear and nail checkups.'}
            </p>
          </div>

          <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200 space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">Training</span>
            <p className="text-xs text-sand-800 leading-relaxed">
              {care.trainingTips || 'Positive reinforcement with treats and praise. Consistency and patience are key.'}
            </p>
          </div>
        </div>
      </section>

      {/* Myths vs Facts */}
      {rich.mythsAndFacts && rich.mythsAndFacts.length > 0 && (
        <section className="bg-sand-100/70 rounded-3xl p-6 sm:p-8 border border-sand-200 space-y-4">
          <h2 className="text-xl font-extrabold text-sand-900">Common Breed Myths vs Facts</h2>
          <div className="space-y-3">
            {rich.mythsAndFacts.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm space-y-1.5 text-xs">
                <p className="text-red-700 font-bold">Myth: {item.myth}</p>
                <p className="text-emerald-800 font-medium">Fact: {item.fact}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cost Forecast Section with City Switcher */}
      {costForecast && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">INR Cost Estimator</span>
              <h3 className="text-xl font-extrabold text-sand-900">
                Estimated Ownership Costs in {selectedCity}
              </h3>
            </div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs font-bold bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900"
            >
              {['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
            <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200">
              <span className="block text-sand-800 uppercase font-bold text-[10px] mb-1">Upfront Total</span>
              <span className="text-2xl font-black text-sand-900">
                ₹{costForecast.upfront.totalUpfront.toLocaleString('en-IN')}
              </span>
              <span className="block text-[10px] text-sand-800 mt-1">Vaccines, spay/neuter, gear</span>
            </div>

            <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200">
              <span className="block text-sand-800 uppercase font-bold text-[10px] mb-1">Monthly Recurring</span>
              <span className="text-2xl font-black text-emerald-700">
                ₹{costForecast.monthly.totalMonthly.toLocaleString('en-IN')}/mo
              </span>
              <span className="block text-[10px] text-sand-800 mt-1">Food, tick meds, vet buffer</span>
            </div>

            <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200">
              <span className="block text-sand-800 uppercase font-bold text-[10px] mb-1">5-Year Lifetime Total</span>
              <span className="text-2xl font-black text-brand-600">
                ₹{costForecast.projections.fiveYearTotal.toLocaleString('en-IN')}
              </span>
              <span className="block text-[10px] text-sand-800 mt-1">Realistic 5-year budget</span>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
