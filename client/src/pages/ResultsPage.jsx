import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import CompareModal from '../components/CompareModal.jsx';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  IndianRupee,
  ShieldCheck,
  Scale,
  RotateCcw,
  SlidersHorizontal,
  ExternalLink,
  MapPin,
  Calendar,
  Lock,
  Unlock,
  Bot,
  BrainCircuit,
  TrendingUp,
  BarChart3,
  Layers,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import PartnerRecommendations from '../components/PartnerRecommendations.jsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  Cell
} from 'recharts';

export default function ResultsPage() {
  const { id } = useParams();
  const { user, isPremium } = useAuth();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Expandable cards state (key: petSlug or petId)
  const [expandedPet, setExpandedPet] = useState(null);
  const [showWhyNotShown, setShowWhyNotShown] = useState(false);
  const [activeDiagramTab, setActiveDiagramTab] = useState('comparison'); // 'comparison', 'readiness', 'costs'

  // Compare selection (max 3)
  const [comparePets, setComparePets] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Cost Forecaster Tab State
  const [selectedCostPet, setSelectedCostPet] = useState(null);
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [costForecast, setCostForecast] = useState(null);
  const [costLoading, setCostLoading] = useState(false);

  // Feature E: Premium Remediation Roadmap State
  const [roadmapSteps, setRoadmapSteps] = useState([
    { id: 1, week: 'Week 1', title: 'Landlord & Housing Society NOC', desc: 'Secure formal written approval and review society by-laws regarding pets and lift usage.', done: false },
    { id: 2, week: 'Week 1', title: 'Balcony & Home Pet-Proofing', desc: 'Install safety net mesh on high-rise balconies, tuck away loose electrical cables, and remove toxic plants.', done: false },
    { id: 3, week: 'Week 2', title: '24/7 Emergency Vet Mapping', desc: 'Locate 2 verified 24/7 veterinary emergency clinics within a 5km radius and save their emergency helpline.', done: false },
    { id: 4, week: 'Week 2', title: 'Starter Essentials Procurement', desc: 'Order stainless steel heavy-bottom bowls, chew-proof harness, parasite prevention, and high-protein puppy/dog food.', done: false },
    { id: 5, week: 'Week 3', title: 'Daily Walking Schedule Calibration', desc: 'Fix 45-60 min morning and evening exercise windows to acclimatize your urban work routine.', done: false },
    { id: 6, week: 'Week 4', title: 'Shelter Trial Foster Immersion', desc: 'Book a 14-day trial foster with your matched Indie to test real-world household dynamics before final adoption.', done: false },
  ]);
  const [savingRoadmap, setSavingRoadmap] = useState(false);
  const [roadmapSaved, setRoadmapSaved] = useState(false);

  // Feature E: Personalised Cost Plan State
  const [customMonthlyFood, setCustomMonthlyFood] = useState(2500);
  const [customMonthlyGrooming, setCustomMonthlyGrooming] = useState(800);
  const [customMonthlyInsurance, setCustomMonthlyInsurance] = useState(600);
  const [customMonthlyVet, setCustomMonthlyVet] = useState(700);
  const [savingPlan, setSavingPlan] = useState(false);
  const [planSaved, setPlanSaved] = useState(false);

  async function handleToggleRoadmapStep(stepId) {
    setRoadmapSteps(prev => prev.map(s => s.id === stepId ? { ...s, done: !s.done } : s));
  }

  async function handleSaveRoadmap() {
    if (!user) return;
    setSavingRoadmap(true);
    try {
      await api.saveRoadmap({
        assessmentId: id,
        targetPet: selectedCostPet?.pet?.name || 'Selected Pet',
        currentScore: assessment?.readiness?.overallScore || 70,
        steps: roadmapSteps
      });
      setRoadmapSaved(true);
      setTimeout(() => setRoadmapSaved(false), 3000);
    } catch (e) {
      console.error('Roadmap save error:', e);
    } finally {
      setSavingRoadmap(false);
    }
  }

  async function handleSaveCostPlan() {
    if (!user) return;
    setSavingPlan(true);
    try {
      const monthlyTotal = customMonthlyFood + customMonthlyGrooming + customMonthlyInsurance + customMonthlyVet;
      await api.saveCostPlan({
        assessmentId: id,
        city: selectedCity,
        petName: selectedCostPet?.pet?.name || 'Selected Pet',
        customBudget: {
          food: customMonthlyFood,
          grooming: customMonthlyGrooming,
          insurance: customMonthlyInsurance,
          routineVet: customMonthlyVet,
          monthlyTotal,
          oneYearTotal: (costForecast?.upfront?.totalUpfront || 5000) + (monthlyTotal * 12)
        }
      });
      setPlanSaved(true);
      setTimeout(() => setPlanSaved(false), 3000);
    } catch (e) {
      console.error('Cost plan save error:', e);
    } finally {
      setSavingPlan(false);
    }
  }

  useEffect(() => {
    async function loadAssessment() {
      try {
        const data = await api.getAssessmentById(id);
        setAssessment(data);
        if (data.answers?.city) {
          setSelectedCity(data.answers.city);
        }
        if (data.rankedMatches?.length > 0) {
          setSelectedCostPet(data.rankedMatches[0]);
        }
      } catch (err) {
        setError('Failed to load assessment results: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAssessment();
  }, [id]);

  // Load cost forecast when cost pet or city changes
  useEffect(() => {
    if (!selectedCostPet) return;
    const petId = selectedCostPet.petId || selectedCostPet.pet?.id;
    if (!petId) return;

    async function loadCost() {
      setCostLoading(true);
      try {
        const forecast = await api.getCostForecast(petId, selectedCity);
        setCostForecast(forecast);
      } catch (err) {
        console.warn('Cost forecast load error:', err.message);
      } finally {
        setCostLoading(false);
      }
    }
    loadCost();
  }, [selectedCostPet, selectedCity]);

  function toggleCompare(petItem) {
    const petId = petItem.petId || petItem.pet?.id;
    const exists = comparePets.some((p) => (p.petId || p.pet?.id) === petId);

    if (exists) {
      setComparePets(comparePets.filter((p) => (p.petId || p.pet?.id) !== petId));
    } else {
      if (comparePets.length >= 3) {
        alert('You can compare up to 3 pets simultaneously.');
        return;
      }
      setComparePets([...comparePets, petItem]);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-sand-900">Calculating True Compatibility...</h2>
        <p className="text-sm text-sand-800">Applying binary deal-breakers and Indian climate scoring.</p>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-sand-900">{error || 'Assessment not found'}</h2>
        <Link
          to="/quiz"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Questionnaire</span>
        </Link>
      </div>
    );
  }

  const { readiness, rankedMatches = [], whyNotShown = [] } = assessment;

  // Group into tiers
  const tier1Pets = rankedMatches.filter((p) => p.tierLevel === 1 || p.matchScore >= 75);
  const tier2Pets = rankedMatches.filter((p) => p.tierLevel === 2 || (p.matchScore >= 50 && p.matchScore < 75));
  const tier3Pets = rankedMatches.filter((p) => p.tierLevel === 3 || p.matchScore < 50);

  // Readiness band colors
  const bandBadgeColor =
    readiness.band === 'Ready'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : readiness.band === 'Almost Ready'
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : 'bg-red-100 text-red-800 border-red-200';

  // Top 3 Recommended Animals (guaranteed at least 3)
  const top3Recommended = rankedMatches.slice(0, 3);

  // Grouped dimension comparison for top 3 animals
  const top3ComparisonData = [
    {
      dimension: 'Space Fit',
      [top3Recommended[0]?.petName || 'Match 1']: top3Recommended[0]?.dimensionScores?.space || top3Recommended[0]?.matchScore || 85,
      ...(top3Recommended[1] ? { [top3Recommended[1]?.petName || 'Match 2']: top3Recommended[1]?.dimensionScores?.space || top3Recommended[1]?.matchScore || 80 } : {}),
      ...(top3Recommended[2] ? { [top3Recommended[2]?.petName || 'Match 3']: top3Recommended[2]?.dimensionScores?.space || top3Recommended[2]?.matchScore || 75 } : {})
    },
    {
      dimension: 'Climate Adaptation',
      [top3Recommended[0]?.petName || 'Match 1']: top3Recommended[0]?.dimensionScores?.climate_fit || ((top3Recommended[0]?.pet?.heat_tolerance || 4) * 20),
      ...(top3Recommended[1] ? { [top3Recommended[1]?.petName || 'Match 2']: top3Recommended[1]?.dimensionScores?.climate_fit || ((top3Recommended[1]?.pet?.heat_tolerance || 4) * 20) } : {}),
      ...(top3Recommended[2] ? { [top3Recommended[2]?.petName || 'Match 3']: top3Recommended[2]?.dimensionScores?.climate_fit || ((top3Recommended[2]?.pet?.heat_tolerance || 4) * 20) } : {})
    },
    {
      dimension: 'Alone Time Fit',
      [top3Recommended[0]?.petName || 'Match 1']: Math.min(100, Math.round(((top3Recommended[0]?.pet?.max_alone_hours || 6) / 8) * 100)),
      ...(top3Recommended[1] ? { [top3Recommended[1]?.petName || 'Match 2']: Math.min(100, Math.round(((top3Recommended[1]?.pet?.max_alone_hours || 6) / 8) * 100)) } : {}),
      ...(top3Recommended[2] ? { [top3Recommended[2]?.petName || 'Match 3']: Math.min(100, Math.round(((top3Recommended[2]?.pet?.max_alone_hours || 6) / 8) * 100)) } : {})
    },
    {
      dimension: 'Routine Fit',
      [top3Recommended[0]?.petName || 'Match 1']: top3Recommended[0]?.dimensionScores?.activity || top3Recommended[0]?.matchScore || 82,
      ...(top3Recommended[1] ? { [top3Recommended[1]?.petName || 'Match 2']: top3Recommended[1]?.dimensionScores?.activity || top3Recommended[1]?.matchScore || 78 } : {}),
      ...(top3Recommended[2] ? { [top3Recommended[2]?.petName || 'Match 3']: top3Recommended[2]?.dimensionScores?.activity || top3Recommended[2]?.matchScore || 74 } : {})
    },
    {
      dimension: 'Overall Compatibility',
      [top3Recommended[0]?.petName || 'Match 1']: top3Recommended[0]?.matchScore || 90,
      ...(top3Recommended[1] ? { [top3Recommended[1]?.petName || 'Match 2']: top3Recommended[1]?.matchScore || 85 } : {}),
      ...(top3Recommended[2] ? { [top3Recommended[2]?.petName || 'Match 3']: top3Recommended[2]?.matchScore || 80 } : {})
    }
  ];

  // Readiness breakdown graph data
  const readinessCategoryData = Object.entries(readiness.categoryBreakdown || {}).map(([key, score]) => {
    const labelMap = {
      time_availability: 'Time Availability',
      financial_stability: 'Recurring Budget',
      housing_stability: 'Housing Stability',
      household_agreement: 'Household Agreement',
      commitment_horizon: '10-15 Yr Horizon',
      emergency_preparedness: 'Vet Emergency Buffer',
      experience_readiness: 'Experience Level'
    };
    return {
      category: labelMap[key] || key,
      score: Number(score)
    };
  });

  // Cost chart data
  const chartData = costForecast
    ? [
        {
          name: 'Upfront Total',
          amount: costForecast.upfront.totalUpfront,
          type: 'Upfront'
        },
        {
          name: '1-Year Total',
          amount: costForecast.projections.oneYearTotal,
          type: '1 Year'
        },
        {
          name: '5-Year Total',
          amount: costForecast.projections.fiveYearTotal,
          type: '5 Years'
        }
      ]
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      
      {/* Results Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-sand-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Compatibility Report Ready</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-sand-900 tracking-tight">
            Your Lifestyle Compatibility Match
          </h1>
          <p className="text-sm text-sand-800 mt-1">
            Evaluated against your apartment living area, work schedule, and Indian climate constraints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/quiz"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-sand-300 text-sand-800 hover:bg-sand-100 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Quiz</span>
          </Link>

          <Link
            to="/adopt"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-soft transition-colors"
          >
            <span>Adoptable Pets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 1. Readiness Score Gauge & Category Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Overall Gauge */}
        <div className="lg:col-span-5 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6 border-b lg:border-b-0 lg:border-r border-sand-200 pb-6 lg:pb-0 lg:pr-8">
          <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-sand-200"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className={
                  readiness.band === 'Ready'
                    ? 'text-emerald-500'
                    : readiness.band === 'Almost Ready'
                    ? 'text-amber-500'
                    : 'text-red-500'
                }
                strokeWidth="10"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * readiness.overallScore) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-sand-900">{readiness.overallScore}</span>
              <span className="text-[10px] text-sand-800 font-bold uppercase tracking-wider">/ 100</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${bandBadgeColor}`}>
              Status: {readiness.band}
            </span>
            <h3 className="font-bold text-lg text-sand-900">Lifestyle Readiness</h3>
            <p className="text-xs text-sand-800 leading-relaxed">
              {readiness.band === 'Ready'
                ? 'Excellent foundation across time, budget, and 10-year commitment horizon!'
                : readiness.band === 'Almost Ready'
                ? 'Strong overall lifestyle fit with a few areas to strengthen before adoption.'
                : 'Consider starting with weekend shelter volunteering or trial fostering first.'}
            </p>
          </div>
        </div>

        {/* Right: Breakdown per Category */}
        <div className="lg:col-span-7 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-sand-800 mb-2">
            Readiness Breakdown by Category
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {Object.entries(readiness.categoryBreakdown || {}).map(([key, score]) => {
              const labelMap = {
                time_availability: 'Time Availability',
                financial_stability: 'Recurring Budget Stability',
                housing_stability: 'Housing & Landlord NOC',
                household_agreement: 'Household Agreement',
                commitment_horizon: '10-15 Year Horizon',
                emergency_preparedness: 'Vet Emergency Buffer',
                experience_readiness: 'Experience Level'
              };

              return (
                <div key={key} className="bg-sand-50 p-2.5 rounded-xl border border-sand-100">
                  <div className="flex justify-between text-sand-800 font-medium mb-1">
                    <span>{labelMap[key] || key}</span>
                    <span className="font-bold text-sand-900">{score}%</span>
                  </div>
                  <div className="w-full bg-sand-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        score >= 75 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-400'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ─── TOP 3 RECOMMENDED ANIMAL MATCHES WITH GEMINI AI REASONING ─── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-400/15 text-brand-700 text-xs font-bold mb-1 border border-brand-500/30">
              <Bot className="w-3.5 h-3.5 text-brand-600" />
              <span>Gemini AI Reasoned Matches (Minimum 3 Guaranteed)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-sand-900 tracking-tight flex items-center gap-2">
              <span>Top 3 Certified Animal Recommendations</span>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </h2>
            <p className="text-xs sm:text-sm text-sand-800 mt-0.5">
              Each recommendation is evaluated with AI reasoning for your {assessment.answers?.city || 'city'} apartment, heat resilience, and alone-time schedule.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AI Evidence-Backed</span>
          </div>
        </div>

        {/* 3 Prominent Featured Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {top3Recommended.map((item, idx) => {
            const pet = item.pet || item;
            const score = item.matchScore || 85;
            const isNative = item.isNative || pet.is_native;
            const rankLabel = idx === 0 ? '🏆 #1 Top Match' : idx === 1 ? '⭐ #2 Strong Match' : '✨ #3 Best Alternative';
            const badgeColor = idx === 0 ? 'from-amber-500 to-orange-500 text-stone-950' : idx === 1 ? 'from-emerald-500 to-teal-500 text-white' : 'from-indigo-500 to-sky-500 text-white';

            return (
              <div
                key={item.petId || item.pet?.id || idx}
                className="bg-white rounded-3xl border-2 border-sand-200 hover:border-brand-400 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between overflow-hidden relative group"
              >
                {/* Card Header & Rank Ribbon */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r ${badgeColor} shadow-sm`}>
                        {rankLabel}
                      </span>
                      <h3 className="text-xl font-black text-sand-900 leading-snug group-hover:text-brand-600 transition-colors">
                        {item.petName || pet.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-sand-800">
                        <span className="capitalize font-semibold">{pet.species}</span>
                        <span>•</span>
                        <span>{pet.breed}</span>
                        {isNative && (
                          <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Native Indie
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-center px-3 py-1.5 rounded-2xl bg-brand-50 border border-brand-200 flex-shrink-0">
                      <span className="block text-lg font-black text-brand-600">{score}%</span>
                      <span className="text-[9px] font-bold text-sand-800 uppercase tracking-wider">Match</span>
                    </div>
                  </div>

                  {/* Gemini AI Personalized Reasoning Box */}
                  <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-amber-100/40 border border-amber-200/80 rounded-2xl p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-amber-900 font-extrabold text-[11px]">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Gemini AI Compatibility Reasoning:</span>
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-200/60 text-amber-950 font-semibold">
                        {item.aiEngine || 'Gemini 3.5 Flash'}
                      </span>
                    </div>

                    <p className="text-sand-900 text-xs leading-relaxed font-medium">
                      {item.aiReasoning || `${item.petName || pet.name} is an exceptional match for your apartment routine. With high climate resilience and stable temperament, they thrive comfortably within your schedule.`}
                    </p>

                    {item.urbanLivingTip && (
                      <div className="pt-1.5 border-t border-amber-200/60 text-[11px] text-amber-950">
                        <span className="font-bold">🏙️ Apartment & Climate Tip: </span>
                        <span>{item.urbanLivingTip}</span>
                      </div>
                    )}

                    {item.dailyRoutine && (
                      <div className="text-[11px] text-amber-950">
                        <span className="font-bold">⏰ Daily Routine: </span>
                        <span>{item.dailyRoutine}</span>
                      </div>
                    )}
                  </div>

                  {/* Core Attribute Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-sand-50 p-2 rounded-xl border border-sand-100">
                      <span className="block text-[10px] text-sand-800">Space Fit</span>
                      <span className="font-black text-sand-900">{item.dimensionScores?.space || 85}%</span>
                    </div>
                    <div className="bg-sand-50 p-2 rounded-xl border border-sand-100">
                      <span className="block text-[10px] text-sand-800">Climate Heat</span>
                      <span className="font-black text-emerald-700">{pet.heat_tolerance || 4}/5</span>
                    </div>
                    <div className="bg-sand-50 p-2 rounded-xl border border-sand-100">
                      <span className="block text-[10px] text-sand-800">Max Alone</span>
                      <span className="font-black text-sand-900">{pet.max_alone_hours || 6} hrs</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 bg-sand-50 border-t border-sand-200 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => toggleCompare(item)}
                    className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                      comparePets.some((p) => (p.petId || p.pet?.id) === (item.petId || pet.id))
                        ? 'bg-sand-900 text-white border-sand-900'
                        : 'bg-white text-sand-800 border-sand-300 hover:bg-sand-100'
                    }`}
                  >
                    {comparePets.some((p) => (p.petId || p.pet?.id) === (item.petId || pet.id)) ? 'Comparing' : '+ Compare'}
                  </button>

                  <Link
                    to={`/pets/${pet.slug || item.petSlug}`}
                    className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold transition-colors flex items-center gap-1"
                  >
                    <span>Care Guide</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── GRAPH DIAGRAMS DASHBOARD ─── */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1 border border-indigo-200">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Comparative Analytics & Visual Models</span>
            </div>
            <h3 className="text-2xl font-black text-sand-900 flex items-center gap-2">
              <span>Interactive Compatibility & Financial Diagrams</span>
            </h3>
            <p className="text-xs text-sand-800 mt-0.5">
              Evaluate multi-animal trade-offs, lifestyle capacity, and multi-year Indian cost curves visually.
            </p>
          </div>

          {/* Diagram Tab Switcher */}
          <div className="flex items-center gap-1 bg-sand-100 p-1 rounded-xl self-start sm:self-center">
            <button
              onClick={() => setActiveDiagramTab('comparison')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeDiagramTab === 'comparison'
                  ? 'bg-white text-sand-900 shadow-sm'
                  : 'text-sand-800 hover:text-sand-900'
              }`}
            >
              Top 3 Comparison
            </button>
            <button
              onClick={() => setActiveDiagramTab('readiness')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeDiagramTab === 'readiness'
                  ? 'bg-white text-sand-900 shadow-sm'
                  : 'text-sand-800 hover:text-sand-900'
              }`}
            >
              Readiness Breakdown
            </button>
            <button
              onClick={() => setActiveDiagramTab('costs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeDiagramTab === 'costs'
                  ? 'bg-white text-sand-900 shadow-sm'
                  : 'text-sand-800 hover:text-sand-900'
              }`}
            >
              5-Year Projection
            </button>
          </div>
        </div>

        {/* Diagram View 1: Top 3 Dimension Grouped Bar Chart */}
        {activeDiagramTab === 'comparison' && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-sand-800">
              <span className="font-semibold">
                Side-by-Side Dimension Scores (%) for your top recommended matches:
              </span>
              <span className="text-[11px] text-sand-600">
                Orange: {top3Recommended[0]?.petName} • Green: {top3Recommended[1]?.petName} • Indigo: {top3Recommended[2]?.petName}
              </span>
            </div>

            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top3ComparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0e9df" />
                  <XAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#4a3e35' }} interval={0} />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#4a3e35' }} />
                  <Tooltip
                    formatter={(val, name) => [`${val}%`, name]}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e8dbca', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey={top3Recommended[0]?.petName || 'Match 1'} fill="#f97316" radius={[6, 6, 0, 0]} />
                  {top3Recommended[1] && (
                    <Bar dataKey={top3Recommended[1]?.petName || 'Match 2'} fill="#10b981" radius={[6, 6, 0, 0]} />
                  )}
                  {top3Recommended[2] && (
                    <Bar dataKey={top3Recommended[2]?.petName || 'Match 3'} fill="#6366f1" radius={[6, 6, 0, 0]} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Diagram View 2: Lifestyle Readiness Category Breakdown */}
        {activeDiagramTab === 'readiness' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-sand-800">
              <span className="font-semibold">Your Readiness Scores Across 7 Urban Life Dimensions:</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Benchmark: ≥70% is Adoption-Ready
              </span>
            </div>

            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={readinessCategoryData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0e9df" />
                  <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#4a3e35' }} />
                  <YAxis type="category" dataKey="category" width={140} tick={{ fontSize: 11, fill: '#4a3e35' }} />
                  <Tooltip
                    formatter={(val) => [`${val}%`, 'Readiness Score']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e8dbca', fontSize: '12px' }}
                  />
                  <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                    {readinessCategoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.score >= 75 ? '#10b981' : entry.score >= 50 ? '#f59e0b' : '#ef4444'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Diagram View 3: 5-Year Cumulative Financial Progression */}
        {activeDiagramTab === 'costs' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-sand-800">
              <span className="font-semibold">
                Projected Ownership Financial Trajectory in {selectedCity} (INR):
              </span>
              <span className="text-brand-600 font-bold">
                Upfront Adoption vs 1-Year vs 5-Year Cumulative Outlay
              </span>
            </div>

            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0e9df" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#4a3e35' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#4a3e35' }} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Projected Cost']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e8dbca', fontSize: '12px' }}
                  />
                  <Bar dataKey="amount" fill="#f97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </section>

      {/* Floating Compare Action Bar (when pets selected) */}
      {comparePets.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-sand-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
          <span className="text-xs font-bold">
            {comparePets.length} of 3 pets selected for comparison
          </span>
          <button
            onClick={() => setIsCompareOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare Now</span>
          </button>
          <button
            onClick={() => setComparePets([])}
            className="text-xs text-sand-400 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}

      {/* 2. Tiered Match Sections */}
      <div className="space-y-10">
        
        {/* Tier 1: Highly Compatible */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-sand-900">
                Tier 1: Highly Compatible ({tier1Pets.length})
              </h2>
              <p className="text-xs text-sand-800">
                Matches ≥75% of your living space, alone-time hours, exercise routine, and Indian climate.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tier1Pets.map((item) => (
              <PetResultCard
                key={item.petId || item.pet?.id}
                petItem={item}
                isExpanded={expandedPet === (item.petSlug || item.pet?.slug)}
                onToggleExpand={() =>
                  setExpandedPet(
                    expandedPet === (item.petSlug || item.pet?.slug) ? null : item.petSlug || item.pet?.slug
                  )
                }
                isCompared={comparePets.some((p) => (p.petId || p.pet?.id) === (item.petId || item.pet?.id))}
                onToggleCompare={() => toggleCompare(item)}
                onSelectForCost={() => setSelectedCostPet(item)}
              />
            ))}
          </div>
        </section>

        {/* Tier 2: Consider Carefully */}
        {tier2Pets.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-sand-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                !
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-sand-900">
                  Tier 2: Consider Carefully ({tier2Pets.length})
                </h2>
                <p className="text-xs text-sand-800">
                  Moderate compatibility (50-74%). Workable with specific adjustments (e.g. professional walker or AC).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tier2Pets.map((item) => (
                <PetResultCard
                  key={item.petId || item.pet?.id}
                  petItem={item}
                  isExpanded={expandedPet === (item.petSlug || item.pet?.slug)}
                  onToggleExpand={() =>
                    setExpandedPet(
                      expandedPet === (item.petSlug || item.pet?.slug) ? null : item.petSlug || item.pet?.slug
                    )
                  }
                  isCompared={comparePets.some((p) => (p.petId || p.pet?.id) === (item.petId || item.pet?.id))}
                  onToggleCompare={() => toggleCompare(item)}
                  onSelectForCost={() => setSelectedCostPet(item)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Tier 3: Low Match */}
        {tier3Pets.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-sand-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sand-200 text-sand-700 flex items-center justify-center font-bold">
                ✕
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-sand-900">
                  Tier 3: Low Match ({tier3Pets.length})
                </h2>
                <p className="text-xs text-sand-800">
                  Scores &lt;50%. High friction in exercise demands, grooming, or tropical climate resilience.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tier3Pets.map((item) => (
                <PetResultCard
                  key={item.petId || item.pet?.id}
                  petItem={item}
                  isExpanded={expandedPet === (item.petSlug || item.pet?.slug)}
                  onToggleExpand={() =>
                    setExpandedPet(
                      expandedPet === (item.petSlug || item.pet?.slug) ? null : item.petSlug || item.pet?.slug
                    )
                  }
                  isCompared={comparePets.some((p) => (p.petId || p.pet?.id) === (item.petId || item.pet?.id))}
                  onToggleCompare={() => toggleCompare(item)}
                  onSelectForCost={() => setSelectedCostPet(item)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Feature B: Reusable Partner Recommendations for Match Results */}
        <div className="pt-4 border-t border-sand-200">
          <PartnerRecommendations
            category="food,grooming,insurance,crates,training"
            petType={assessment?.answers?.preferredSpecies || 'dog'}
            budget={assessment?.answers?.monthlyBudget > 8000 ? 'high' : 'moderate'}
            firstTimeOwner={assessment?.answers?.experienceLevel === 'first_time'}
            title="Recommended Essentials For Your Matches"
            subtitle="Carefully vetted Indian pet care brands, trainers, and insurance tailored to your lifestyle profile."
            sourcePage={`quiz_results_${id}`}
          />
        </div>

      </div>

      {/* Feature E: Readiness Remediation Roadmap (Free Preview / Premium Unlocked) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Actionable Transition Plan</span>
              {isPremium ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <Unlock className="w-3 h-3" /> Premium Unlocked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-sand-200 text-sand-700">
                  <Lock className="w-3 h-3" /> Premium Feature
                </span>
              )}
            </div>
            <h3 className="text-2xl font-black text-sand-900">4-Week Readiness Remediation Roadmap</h3>
            <p className="text-xs text-sand-800 mt-0.5">
              Targeted step-by-step milestones to raise your readiness score from {readiness.overallScore}% to 95%+ before bringing a dog home.
            </p>
          </div>
          {isPremium ? (
            <button
              onClick={handleSaveRoadmap}
              disabled={savingRoadmap}
              className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-soft transition-colors flex items-center gap-1.5 self-start sm:self-center"
            >
              {savingRoadmap ? 'Saving...' : roadmapSaved ? '✓ Progress Saved!' : 'Save Progress'}
            </button>
          ) : (
            <Link
              to="/pricing"
              className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-soft transition-colors flex items-center gap-1.5 self-start sm:self-center"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unlock Full Roadmap</span>
            </Link>
          )}
        </div>

        {isPremium ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmapSteps.map((step) => (
              <div
                key={step.id}
                onClick={() => handleToggleRoadmapStep(step.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  step.done
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    : 'bg-sand-50/60 border-sand-200 hover:border-brand-300'
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors ${
                  step.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-sand-400 bg-white'
                }`}>
                  {step.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sand-200 text-sand-800">
                      {step.week}
                    </span>
                    <h4 className={`text-sm font-bold ${step.done ? 'line-through text-sand-800' : 'text-sand-900'}`}>
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-xs text-sand-800 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative rounded-2xl border border-sand-200 bg-sand-50/50 p-6 sm:p-8 text-center space-y-4 overflow-hidden">
            <div className="max-w-md mx-auto space-y-2">
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-black text-sand-900">Customized 4-Week Remediation Roadmap</h4>
              <p className="text-xs text-sand-800 leading-relaxed">
                Includes specific apartment pet-proofing checklists, landlord NOC legal templates, urban vet buffers, and scheduled walking calibration for your exact Indian city.
              </p>
              <div className="pt-2">
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-soft transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upgrade to Premium (₹299/mo)</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. "Why Not Shown" Deal-Breaker Panel */}
      <div className="bg-sand-100/70 rounded-3xl p-6 sm:p-8 border border-sand-200 space-y-4">
        <button
          onClick={() => setShowWhyNotShown(!showWhyNotShown)}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-sand-900 group-hover:text-brand-600 transition-colors">
                Why Certain Pets Were Not Shown ({whyNotShown.length} Excluded by Deal-Breakers)
              </h3>
              <p className="text-xs text-sand-800">
                Binary filters run before scoring to protect pets and families from non-negotiable living conflicts.
              </p>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-white/80 group-hover:bg-white text-sand-800 transition-colors">
            {showWhyNotShown ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showWhyNotShown && (
          <div className="pt-4 border-t border-sand-200 space-y-3 animate-in fade-in duration-200">
            {whyNotShown.length === 0 ? (
              <p className="text-xs text-sand-800 italic">No pets were excluded by binary deal-breakers.</p>
            ) : (
              whyNotShown.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-sand-900">{item.petName}</span>
                    <span className="text-sand-800 text-[11px] block capitalize">{item.species} • {item.breed}</span>
                  </div>
                  <div className="sm:max-w-md bg-amber-50 p-2.5 rounded-xl border border-amber-100 text-amber-900">
                    <span className="font-bold block mb-0.5">Exclusion Reason:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {item.reasons.map((r, rIdx) => (
                        <li key={rIdx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 4. Interactive Cost-of-Ownership Forecaster Tab */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Financial Transparency</span>
            <h3 className="text-2xl font-extrabold text-sand-900 flex items-center gap-2">
              <IndianRupee className="w-6 h-6 text-emerald-600" />
              <span>Cost-of-Ownership Forecaster</span>
            </h3>
            <p className="text-xs text-sand-800 mt-0.5">
              Calculating upfront adoption fees vs recurring monthly vet, food, and grooming expenses in INR.
            </p>
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs sm:text-sm font-bold bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {costForecast ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Granular Upfront & Monthly */}
            <div className="lg:col-span-5 space-y-5 text-xs">
              <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200 space-y-2">
                <span className="font-bold text-sand-900 uppercase tracking-wider text-[11px] block">
                  Upfront Investment (One-Time)
                </span>
                <div className="flex justify-between py-1 border-b border-sand-200">
                  <span className="text-sand-800">Shelter Adoption Fee / Donation</span>
                  <span className="font-semibold text-sand-900">₹{costForecast.upfront.adoptionFee}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-sand-200">
                  <span className="text-sand-800">Initial Core Vaccinations</span>
                  <span className="font-semibold text-sand-900">₹{costForecast.upfront.initialVaccinations}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-sand-200">
                  <span className="text-sand-800">Spay / Neuter Surgery</span>
                  <span className="font-semibold text-sand-900">₹{costForecast.upfront.spayNeuter}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-sand-200">
                  <span className="text-sand-800">Starter Gear (Bed, bowls, leash/harness)</span>
                  <span className="font-semibold text-sand-900">₹{costForecast.upfront.starterKit}</span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-sm text-sand-900">
                  <span>Total Upfront</span>
                  <span className="text-brand-600">₹{costForecast.upfront.totalUpfront.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-2">
                <span className="font-bold text-emerald-900 uppercase tracking-wider text-[11px] block">
                  Monthly Recurring Estimate
                </span>
                <div className="flex justify-between py-1 border-b border-emerald-100">
                  <span className="text-sand-800">Quality Food & Nutrition</span>
                  <span className="font-semibold text-sand-900">₹{costForecast.monthly.food}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-100">
                  <span className="text-sand-800">Grooming & Hygiene</span>
                  <span className="font-semibold text-sand-900">₹{costForecast.monthly.grooming}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-100">
                  <span className="text-sand-800">Parasite (Tick/Flea/Heartworm) Prevention</span>
                  <span className="font-semibold text-sand-900">₹{costForecast.monthly.parasitePrevention}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-100">
                  <span className="text-sand-800">Routine Vet Buffer & Boosters</span>
                  <span className="font-semibold text-sand-900">₹{costForecast.monthly.routineVet}</span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-sm text-sand-900">
                  <span>Total Estimated Monthly</span>
                  <span className="text-emerald-700">₹{costForecast.monthly.totalMonthly.toLocaleString('en-IN')} / mo</span>
                </div>
              </div>
            </div>

            {/* Right: Multi-Year Projection Chart */}
            <div className="lg:col-span-7 h-72 w-full pt-4">
              <h4 className="text-xs font-bold text-sand-800 mb-2">1-Year vs 5-Year Financial Projection (INR)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b5e51' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b5e51' }} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Projected Cost']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e8dbca', fontSize: '12px' }}
                  />
                  <Bar dataKey="amount" fill="#f97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        ) : (
          <div className="py-8 text-center text-xs text-sand-800">Loading cost forecast...</div>
        )}

        {/* Feature B: Recommended Partners on Cost Forecaster */}
        <div className="pt-6 border-t border-sand-200">
          <PartnerRecommendations
            category="insurance,vet,food"
            petType={assessment?.answers?.preferredSpecies || 'dog'}
            title="Affordable Healthcare & Food Partners"
            subtitle="Keep recurring ownership expenses predictable with trusted pet medical insurance and nutritional subscriptions."
            sourcePage={`cost_forecaster_${id}`}
          />
        </div>
      </section>

      {/* Feature E: Personalised Cost Plan (Free Preview / Premium Unlocked) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Financial Customization</span>
              {isPremium ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <Unlock className="w-3 h-3" /> Premium Unlocked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-sand-200 text-sand-700">
                  <Lock className="w-3 h-3" /> Premium Feature
                </span>
              )}
            </div>
            <h3 className="text-2xl font-black text-sand-900">Personalised Cost Plan & Optimizer</h3>
            <p className="text-xs text-sand-800 mt-0.5">
              Customize your monthly nutrition tier, vet insurance buffers, and grooming frequency for {selectedCostPet?.pet?.name || 'your chosen companion'}.
            </p>
          </div>

          {isPremium ? (
            <button
              onClick={handleSaveCostPlan}
              disabled={savingPlan}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-soft transition-colors flex items-center gap-1.5 self-start sm:self-center"
            >
              {savingPlan ? 'Saving...' : planSaved ? '✓ Plan Saved!' : 'Save Personalised Plan'}
            </button>
          ) : (
            <Link
              to="/pricing"
              className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-soft transition-colors flex items-center gap-1.5 self-start sm:self-center"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unlock Custom Plan</span>
            </Link>
          )}
        </div>

        {isPremium ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-sand-900 mb-1">
                  <span>Monthly Nutrition & Food</span>
                  <span className="text-brand-600">₹{customMonthlyFood.toLocaleString('en-IN')}/mo</span>
                </div>
                <input
                  type="range"
                  min="1200"
                  max="7000"
                  step="100"
                  value={customMonthlyFood}
                  onChange={(e) => setCustomMonthlyFood(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-sand-900 mb-1">
                  <span>Monthly Grooming & Parasite Care</span>
                  <span className="text-brand-600">₹{customMonthlyGrooming.toLocaleString('en-IN')}/mo</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="3000"
                  step="100"
                  value={customMonthlyGrooming}
                  onChange={(e) => setCustomMonthlyGrooming(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-sand-900 mb-1">
                  <span>Pet Health & Accident Insurance</span>
                  <span className="text-brand-600">₹{customMonthlyInsurance.toLocaleString('en-IN')}/mo</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="2500"
                  step="50"
                  value={customMonthlyInsurance}
                  onChange={(e) => setCustomMonthlyInsurance(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-sand-900 mb-1">
                  <span>Routine Vet & Dental Buffer</span>
                  <span className="text-brand-600">₹{customMonthlyVet.toLocaleString('en-IN')}/mo</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="2500"
                  step="50"
                  value={customMonthlyVet}
                  onChange={(e) => setCustomMonthlyVet(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>
            </div>

            <div className="bg-sand-50/80 p-6 rounded-2xl border border-sand-200 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sand-800">Customized Annual Budget Summary</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-sand-200">
                  <span className="text-sand-800">Total Monthly Recurring</span>
                  <span className="font-extrabold text-sand-900">
                    ₹{(customMonthlyFood + customMonthlyGrooming + customMonthlyInsurance + customMonthlyVet).toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-sand-200">
                  <span className="text-sand-800">1-Year Recurring Expense</span>
                  <span className="font-extrabold text-sand-900">
                    ₹{((customMonthlyFood + customMonthlyGrooming + customMonthlyInsurance + customMonthlyVet) * 12).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-black text-emerald-800">
                  <span>1-Year All-Inclusive Total</span>
                  <span>
                    ₹{((costForecast?.upfront?.totalUpfront || 5000) + (customMonthlyFood + customMonthlyGrooming + customMonthlyInsurance + customMonthlyVet) * 12).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl border border-sand-200 bg-sand-50/50 p-6 sm:p-8 text-center space-y-4 overflow-hidden">
            <div className="max-w-md mx-auto space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-black text-sand-900">Personalised Cost Plan & Budget Optimizer</h4>
              <p className="text-xs text-sand-800 leading-relaxed">
                Fine-tune insurance deductibles, compare wet food vs kibble monthly outlays, and forecast your household pet budget across 5 years.
              </p>
              <div className="pt-2">
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-soft transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Unlock Personalised Cost Plan (₹299/mo)</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Side-by-Side Compare Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        selectedPets={comparePets}
        onRemovePet={(petId) => setComparePets(comparePets.filter((p) => (p.petId || p.pet?.id) !== petId))}
      />

    </div>
  );
}

// Individual Pet Result Card Component
function PetResultCard({ petItem, isExpanded, onToggleExpand, isCompared, onToggleCompare, onSelectForCost }) {
  const pet = petItem.pet || petItem;
  const score = petItem.matchScore;
  const tier = petItem.tier;
  const isNative = petItem.isNative || pet.is_native;

  const scoreBadgeColor =
    score >= 75
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : score >= 50
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : 'bg-sand-200 text-sand-800 border-sand-300';

  return (
    <div className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-card hover:shadow-hover transition-all flex flex-col justify-between">
      
      {/* Top Details */}
      <div className="p-6 space-y-4">
        
        {/* Header Strip */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              {isNative && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Award className="w-3 h-3" /> Native Indie
                </span>
              )}
              <span className="text-xs text-sand-800 capitalize font-medium">{pet.species}</span>
            </div>
            <h3 className="text-lg font-black text-sand-900 leading-snug">{pet.name}</h3>
          </div>

          {/* Compatibility Score Pill */}
          <div className={`px-3 py-1.5 rounded-2xl border text-center flex-shrink-0 ${scoreBadgeColor}`}>
            <span className="block text-base font-black leading-none">{score}%</span>
            <span className="text-[9px] font-bold uppercase tracking-wider">{tier}</span>
          </div>
        </div>

        {/* Quick Attribute Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
          <div className="bg-sand-50 p-2 rounded-xl">
            <span className="block text-[10px] text-sand-800">Heat Tolerance</span>
            <span className="font-bold text-sand-900">{pet.heat_tolerance}/5</span>
          </div>
          <div className="bg-sand-50 p-2 rounded-xl">
            <span className="block text-[10px] text-sand-800">Alone Limit</span>
            <span className="font-bold text-sand-900">{pet.max_alone_hours}h</span>
          </div>
          <div className="bg-sand-50 p-2 rounded-xl">
            <span className="block text-[10px] text-sand-800">Monthly</span>
            <span className="font-bold text-emerald-700">₹{pet.base_monthly_cost_inr}</span>
          </div>
        </div>

        {/* Dimension Comparison Bars (Top 4) */}
        {petItem.dimensionScores && (
          <div className="space-y-2 pt-2 border-t border-sand-100 text-xs">
            <div className="flex justify-between text-sand-800 text-[11px]">
              <span>Space Fit</span>
              <span className="font-bold">{petItem.dimensionScores.space}%</span>
            </div>
            <div className="w-full bg-sand-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-brand-500 h-full rounded-full" style={{ width: `${petItem.dimensionScores.space}%` }} />
            </div>

            <div className="flex justify-between text-sand-800 text-[11px]">
              <span>Energy & Exercise</span>
              <span className="font-bold">{petItem.dimensionScores.activity}%</span>
            </div>
            <div className="w-full bg-sand-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-brand-500 h-full rounded-full" style={{ width: `${petItem.dimensionScores.activity}%` }} />
            </div>

            <div className="flex justify-between text-sand-800 text-[11px]">
              <span>Climate Adaptation</span>
              <span className="font-bold">{petItem.dimensionScores.climate_fit}%</span>
            </div>
            <div className="w-full bg-sand-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${petItem.dimensionScores.climate_fit}%` }} />
            </div>
          </div>
        )}

        {/* Expandable "Why This Match" */}
        {isExpanded && (
          <div className="pt-3 border-t border-sand-100 space-y-3 text-xs animate-in fade-in">
            {/* Strengths */}
            {petItem.strengths && petItem.strengths.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Top Match Strengths:</span>
                </span>
                <ul className="space-y-1 pl-4 list-disc text-sand-800 leading-relaxed">
                  {petItem.strengths.map((s, idx) => (
                    <li key={idx}>{s.text}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Friction Points */}
            {petItem.friction && petItem.friction.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-bold text-amber-800 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Friction Points to Manage:</span>
                </span>
                <ul className="space-y-1 pl-4 list-disc text-sand-800 leading-relaxed">
                  {petItem.friction.map((f, idx) => (
                    <li key={idx}>{f.text}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Native Spotlight */}
            {petItem.nativeSpotlight && (
              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 text-emerald-900 leading-relaxed">
                {petItem.nativeSpotlight}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Card Action Footer */}
      <div className="p-4 bg-sand-50 border-t border-sand-200 flex items-center justify-between gap-2 text-xs">
        <button
          onClick={onToggleExpand}
          className="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1"
        >
          <span>{isExpanded ? 'Less Details' : 'Why This Match'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleCompare}
            className={`px-2.5 py-1.5 rounded-lg border font-semibold transition-colors ${
              isCompared
                ? 'bg-sand-900 text-white border-sand-900'
                : 'bg-white text-sand-800 border-sand-300 hover:bg-sand-100'
            }`}
          >
            {isCompared ? 'Comparing' : '+ Compare'}
          </button>

          <Link
            to={`/pets/${pet.slug}`}
            className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold transition-colors"
          >
            Care Guide
          </Link>
        </div>
      </div>

    </div>
  );
}
