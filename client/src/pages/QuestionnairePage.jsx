import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Home,
  Activity,
  Clock,
  Sparkles as SparklesIcon,
  MapPin,
  IndianRupee,
  Award,
  Users,
  HeartHandshake
} from 'lucide-react';

const ICON_MAP = {
  Home,
  Activity,
  Clock,
  Sparkles: SparklesIcon,
  MapPin,
  IndianRupee,
  Award,
  Users,
  HeartHandshake
};

const STORAGE_KEY = 'pawmatch_questionnaire_answers';

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const { guestToken } = useAuth();

  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  // 1. Fetch questionnaire definition from API
  useEffect(() => {
    async function fetchDefinition() {
      try {
        const res = await api.getQuestionnaire();
        if (res && res.steps) {
          setSteps(res.steps);
        }
      } catch (err) {
        console.error('Failed to load questionnaire schema:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDefinition();
  }, []);

  // 2. Autosave answers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch (e) {
      console.warn('Autosave error:', e);
    }
  }, [answers]);

  const currentStep = steps[currentStepIndex];

  function handleInputChange(questionId, value) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
    setValidationError('');
  }

  function validateCurrentStep() {
    if (!currentStep) return true;
    for (const q of currentStep.questions) {
      if (q.required) {
        const val = answers[q.id];
        if (val === undefined || val === null || val === '') {
          setValidationError(`Please answer: "${q.text}"`);
          return false;
        }
      }
    }
    setValidationError('');
    return true;
  }

  function handleNext() {
    if (!validateCurrentStep()) return;

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  }

  function handlePrev() {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setValidationError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleReset() {
    if (window.confirm('Reset all answers and start the questionnaire from scratch?')) {
      localStorage.removeItem(STORAGE_KEY);
      setAnswers({});
      setCurrentStepIndex(0);
      setValidationError('');
    }
  }

  async function handleSubmit() {
    if (!validateCurrentStep()) return;
    setSubmitting(true);

    try {
      // Ensure city_climate_zone is present from selected city
      const answersToSubmit = { ...answers };
      if (answersToSubmit.city) {
        const cityMap = {
          Mumbai: 'hot-humid',
          Chennai: 'hot-humid',
          Kolkata: 'hot-humid',
          Hyderabad: 'hot-dry',
          Ahmedabad: 'hot-dry',
          Delhi: 'composite',
          Bengaluru: 'composite',
          Pune: 'composite'
        };
        answersToSubmit.city_climate_zone = cityMap[answersToSubmit.city] || 'composite';
      }

      const res = await api.createAssessment(answersToSubmit, guestToken);
      if (res && res.assessmentId) {
        // If consented, log anonymized aggregate snapshot to MongoDB (non-blocking)
        if (analyticsConsent) {
          try {
            const logFn = api.logQuizSnapshot || api.logConsentedQuizSnapshot;
            if (typeof logFn === 'function') {
              logFn({
                city: answersToSubmit.city || 'Unknown',
                readinessScore: res.readiness?.overallScore || 70,
                readinessBand: res.readiness?.band || 'Ready',
                topPetCategory: answersToSubmit.preferredSpecies || 'dog',
                hasConsent: true,
                answersSnapshot: {
                  homeType: answersToSubmit.homeType,
                  hasBalcony: answersToSubmit.hasBalcony,
                  workHoursAway: answersToSubmit.workHoursAway,
                  experienceLevel: answersToSubmit.experienceLevel
                }
              }).catch((e) => console.warn('Snapshot log ignored:', e));
            }
          } catch (snapshotErr) {
            console.warn('Snapshot logging error ignored:', snapshotErr);
          }
        }

        // Cache assessment in local storage for instant zero-latency loading
        try {
          sessionStorage.setItem('pawmatch_assessment_' + res.assessmentId, JSON.stringify(res));
          localStorage.setItem('pawmatch_last_assessment', JSON.stringify(res));
        } catch (storageErr) {
          console.warn('Local assessment caching note:', storageErr);
        }

        // Clear saved answers on successful submission and navigate to results
        localStorage.removeItem(STORAGE_KEY);
        navigate(`/results/${res.assessmentId}`);
        return;
      }
    } catch (err) {
      console.error('Submission error:', err);
      setValidationError('Failed to submit assessment: ' + err.message);
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-sand-900">Loading Lifestyle Questionnaire...</h2>
        <p className="text-sm text-sand-800">Calibrating Indian urban lifestyle criteria.</p>
      </div>
    );
  }

  if (!steps || steps.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-sand-900">Questionnaire Temporarily Unavailable</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);
  const StepIcon = currentStep?.icon ? ICON_MAP[currentStep.icon] || Compass : Compass;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      
      {/* Top Header & Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="text-xs text-sand-800">• Autosaved</span>
          </div>

          <button
            onClick={handleReset}
            className="text-xs font-medium text-sand-800 hover:text-red-600 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-sand-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Title Header */}
        <div className="flex items-start gap-3.5 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <StepIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-sand-900">
              {currentStep.title}
            </h1>
            <p className="text-xs sm:text-sm text-sand-800 mt-0.5">
              {currentStep.description}
            </p>
          </div>
        </div>
      </div>

      {/* Questions Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-8">
        
        {currentStep.questions.map((q) => {
          const val = answers[q.id];

          return (
            <div key={q.id} className="space-y-3">
              <label className="block text-sm sm:text-base font-bold text-sand-900">
                {q.text} {q.required && <span className="text-brand-600">*</span>}
              </label>

              {q.helpText && (
                <p className="text-xs text-sand-800 -mt-1 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-sand-800 flex-shrink-0" />
                  <span>{q.helpText}</span>
                </p>
              )}

              {/* Number Input */}
              {q.type === 'number' && (
                <div className="relative max-w-xs">
                  <input
                    type="number"
                    min={q.min}
                    max={q.max}
                    value={val !== undefined ? val : ''}
                    onChange={(e) => handleInputChange(q.id, e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder={q.placeholder}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl px-4 py-3 text-sm font-semibold text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>
              )}

              {/* Capacity 1-5 Select Options */}
              {q.type === 'capacity' && (
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isSelected = val === opt.capacityLevel || val === opt.value;
                    return (
                      <button
                        key={opt.capacityLevel || opt.value}
                        type="button"
                        onClick={() => handleInputChange(q.id, opt.capacityLevel || opt.value)}
                        className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-brand-50 border-brand-500 text-brand-900 ring-2 ring-brand-500/20 shadow-sm'
                            : 'bg-sand-50/70 hover:bg-sand-100 border-sand-200 text-sand-800'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ml-3 ${
                            isSelected ? 'bg-brand-500 border-brand-500 text-white' : 'border-sand-300 bg-white'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Standard Select Options */}
              {q.type === 'select' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt) => {
                    const isSelected = val === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleInputChange(q.id, opt.value)}
                        className={`text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-brand-50 border-brand-500 text-brand-900 ring-2 ring-brand-500/20 shadow-sm'
                            : 'bg-sand-50/70 hover:bg-sand-100 border-sand-200 text-sand-800'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ml-2 ${
                            isSelected ? 'bg-brand-500 border-brand-500 text-white' : 'border-sand-300 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Boolean Yes/No Options */}
              {q.type === 'boolean' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt) => {
                    const isSelected = val === opt.value;
                    return (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => handleInputChange(q.id, opt.value)}
                        className={`text-left p-4 rounded-2xl border text-xs sm:text-sm font-bold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-brand-50 border-brand-500 text-brand-900 ring-2 ring-brand-500/20 shadow-sm'
                            : 'bg-sand-50/70 hover:bg-sand-100 border-sand-200 text-sand-800'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ml-2 ${
                            isSelected ? 'bg-brand-500 border-brand-500 text-white' : 'border-sand-300 bg-white'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}

        {/* Validation Error Banner */}
        {validationError && (
          <div className="bg-red-50 border border-red-200 p-3.5 rounded-2xl text-xs text-red-700 flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Feature G: Consented Anonymized Analytics Checkbox (Final Step Only) */}
        {currentStepIndex === steps.length - 1 && (
          <div className="bg-sand-50/90 p-4 rounded-2xl border border-sand-200 animate-in fade-in">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-sand-800 leading-relaxed">
              <input
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                className="accent-brand-500 w-4 h-4 rounded mt-0.5"
              />
              <span>
                <strong>Anonymized Welfare Research Consent:</strong> I agree to contribute my anonymized lifestyle responses (city, apartment type, compatibility band) to urban Indian pet welfare statistics. <em>No names, emails, or personal identifiers are ever stored.</em>
              </span>
            </label>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-sand-200 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIndex === 0 || submitting}
            className={`flex items-center gap-1.5 px-5 py-3 rounded-2xl border text-xs sm:text-sm font-bold transition-colors ${
              currentStepIndex === 0
                ? 'opacity-40 cursor-not-allowed border-sand-200 text-sand-800'
                : 'border-sand-300 text-sand-800 hover:bg-sand-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={submitting}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm sm:text-base shadow-soft hover:shadow-hover transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {submitting ? (
              <span>Evaluating Compatibility...</span>
            ) : currentStepIndex === steps.length - 1 ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>See My Pet Matches</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
