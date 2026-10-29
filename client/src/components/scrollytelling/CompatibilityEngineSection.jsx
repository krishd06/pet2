import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sliders,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  ArrowRight,
  Sun,
  Home,
  Clock,
  AlertTriangle,
  Award,
  Zap,
  Info
} from 'lucide-react';

export default function CompatibilityEngineSection() {
  const [activeStep, setActiveStep] = useState(1);
  const [apartmentSize, setApartmentSize] = useState(850);
  const [aloneHours, setAloneHours] = useState(5);
  const [selectedCity, setSelectedCity] = useState('Delhi (Hot Summers)');

  // Dynamic live calculation based on interactive demo sliders
  const isHighAlone = aloneHours > 7;
  const isSmallSpace = apartmentSize < 600;

  const indieMatchScore = Math.max(88, Math.min(98, Math.round(96 - (aloneHours > 8 ? 4 : 0) - (apartmentSize < 500 ? 3 : 0))));
  const catMatchScore = Math.max(90, Math.min(99, Math.round(94 + (aloneHours >= 6 ? 4 : 0) + (apartmentSize < 600 ? 3 : 0))));

  const steps = [
    {
      id: 1,
      number: '01',
      title: 'Apartment & Routine Context',
      subtitle: 'Real constraints, zero sugarcoating',
      desc: 'Input your exact apartment square footage, daily alone hours, Indian city climate zone, RWA housing society bylaws, and realistic 5-year vet care budget.',
      tag: 'Zero Sign-Up Required',
      features: [
        'Precise square footage vs balcony access',
        'Daily alone hours (0 to 10+ hrs)',
        'Indian city climate & summer heat index',
        'Realistic monthly maintenance & vet forecast'
      ]
    },
    {
      id: 2,
      number: '02',
      title: '9-Dimension Compatibility Engine',
      subtitle: 'Hard deal-breakers filter out dangerous fits',
      desc: 'Our deterministic algorithm evaluates each companion across heat tolerance, exercise demand, sociability, shedding, and alone-time tolerance. Zero generic advice.',
      tag: 'Deterministic AI Rules',
      features: [
        'Instant exclusion of thermal stress breeds (e.g. Arctic breeds in non-AC flats)',
        'Alone-time threshold gating to prevent severe separation anxiety',
        'RWA legal pet bylaw compliance checking',
        'Native Indian Indie resilience scoring boost'
      ]
    },
    {
      id: 3,
      number: '03',
      title: 'Adopt Responsibly & 3-3-3 Roadmap',
      subtitle: 'Verified shelters, zero broker markups',
      desc: 'Connect directly with verified non-profit shelters, start a self-managed trial foster, and execute the scientifically backed 3-3-3 rule onboarding roadmap.',
      tag: 'Zero Commercial Broker Fees',
      features: [
        'Direct connection to verified local shelters',
        'Legal AWBI adopter rights advisory',
        'Self-managed trial foster before permanent adoption',
        'Day 3 / Week 3 / Month 3 onboarding roadmap'
      ]
    }
  ];

  return (
    <section className="relative w-full py-24 sm:py-32 bg-[#0c0a09] text-white overflow-hidden border-t border-b border-white/5">
      {/* Ambient Radial Gradient Backdrops (Subtle & clean, NO particles) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-24 right-0 w-[500px] h-[500px] bg-amber-600/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase shadow-lg shadow-black/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chapter 02 • Explainable Compatibility Engine</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            NOT AN INSTAGRAM FILTER. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              A SCIENTIFIC FIT ENGINE.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-stone-300 font-medium leading-relaxed">
            33% of pets in Indian cities are abandoned due to space constraints, heat stroke, or barking complaints. 
            PawMatch solves this before adoption happens.
          </p>
        </div>

        {/* Step Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-12 mb-12">
          {steps.map((step) => {
            const isSelected = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold font-mono transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-lg shadow-amber-500/25 scale-105'
                    : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-white/10 hover:border-white/20'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  isSelected ? 'bg-black text-amber-400' : 'bg-white/10 text-stone-400'
                }`}>
                  {step.number}
                </span>
                <span>{step.title}</span>
              </button>
            );
          })}
        </div>

        {/* 3 Editorial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {steps.map((step) => {
            const isSelected = activeStep === step.id;
            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-b from-stone-900/90 to-stone-950/90 border-2 border-amber-500/60 shadow-2xl shadow-amber-500/10 -translate-y-2'
                    : 'bg-stone-900/50 hover:bg-stone-900/80 border border-white/10 hover:border-white/20'
                }`}
              >
                {/* Top Badge */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-3xl font-black text-stone-500 group-hover:text-amber-400 transition-colors">
                      {step.number}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono font-semibold text-amber-300">
                      {step.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1.5 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-amber-400/90 font-mono mb-3 font-medium">
                    {step.subtitle}
                  </p>
                  <p className="text-stone-300 text-sm leading-relaxed mb-6">
                    {step.desc}
                  </p>
                </div>

                {/* Feature Checklist */}
                <div className="pt-4 border-t border-white/10 space-y-2.5">
                  {step.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-stone-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── LIVE INTERACTIVE RULE-BASED SIMULATOR WIDGET ─── */}
        <div className="mt-16 rounded-3xl bg-gradient-to-b from-stone-900/90 to-stone-950/95 border border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase mb-2">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Interactive Live Preview</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Simulate Your Apartment Parameters
              </h3>
              <p className="text-stone-400 text-sm mt-1">
                Adjust the sliders below to see our deterministic algorithm calculate real-time compatibility scores.
              </p>
            </div>

            <Link
              to="/quiz"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 shrink-0 transition-transform hover:scale-105"
            >
              <span>Take Full 12-Question Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Interactive Controls & Live Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            
            {/* Left Controls: Sliders */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Slider 1: Apartment Size */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-stone-300 font-bold flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-amber-400" />
                    Apartment Carpet Area
                  </span>
                  <span className="text-amber-400 font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    {apartmentSize} sq.ft
                  </span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="2500"
                  step="50"
                  value={apartmentSize}
                  onChange={(e) => setApartmentSize(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                  <span>1 BHK (400 sq.ft)</span>
                  <span>2 BHK (950 sq.ft)</span>
                  <span>Villa (2500 sq.ft)</span>
                </div>
              </div>

              {/* Slider 2: Alone Time */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-stone-300 font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-orange-400" />
                    Daily Pet Alone Time
                  </span>
                  <span className="text-orange-400 font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    {aloneHours} hours / day
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={aloneHours}
                  onChange={(e) => setAloneHours(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer h-2 bg-stone-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                  <span>Work from Home (1-2 hrs)</span>
                  <span>Standard Hybrid (4-6 hrs)</span>
                  <span>Long Office Hours (8-10 hrs)</span>
                </div>
              </div>

              {/* Dropdown 3: City Climate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-stone-300 font-bold flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-emerald-400" />
                    City Heat & Climate Zone
                  </span>
                </div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-stone-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
                >
                  <option value="Delhi (Hot Summers)">Delhi NCR (44°C Peak Summer Heat)</option>
                  <option value="Mumbai (High Humidity)">Mumbai / Chennai (Tropical Coastal Humidity)</option>
                  <option value="Bengaluru (Moderate)">Bengaluru / Pune (Moderate Plateau)</option>
                  <option value="Kolkata (Humid Summer)">Kolkata (Humid Subtropical)</option>
                </select>
              </div>

            </div>

            {/* Right Output: Real-time Algorithm Output Cards */}
            <div className="lg:col-span-6 space-y-3.5">
              <div className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold mb-1">
                Real-Time Compatibility Verdict
              </div>

              {/* Card 1: Indian Pariah Dog */}
              <div className="p-4 rounded-2xl bg-stone-900/90 border border-emerald-500/30 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">Indian Indie / Pariah Dog</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-300">
                    Naturally adapted to {selectedCity}. Natural short coat, resilient immune system, low genetic disease risk.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {indieMatchScore}%
                  </div>
                  <div className="text-[9px] text-stone-400 font-mono">FIT SCORE</div>
                </div>
              </div>

              {/* Card 2: Domestic Rescue Cat */}
              <div className="p-4 rounded-2xl bg-stone-900/90 border border-amber-500/30 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">Domestic Rescue Cat (Indie DSH)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/30">
                      Apartment Star
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-300">
                    Thrives in {apartmentSize} sq.ft. Independent temperament handles {aloneHours}h alone with zero barking complaints.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {catMatchScore}%
                  </div>
                  <div className="text-[9px] text-stone-400 font-mono">FIT SCORE</div>
                </div>
              </div>

              {/* Card 3: Arctic Breed (Hard Deal-Breaker Demonstration) */}
              <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-200 text-sm">Siberian Husky / St. Bernard</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-semibold border border-red-500/40">
                      Hard Deal-Breaker
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Heavy double coat designed for -40°C. Suffer chronic dehydration, eczema, and heat stress in {selectedCity}.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-black text-red-400 font-mono">
                    0%
                  </div>
                  <div className="text-[9px] text-red-300 font-mono">EXCLUDED</div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
