import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Check,
  Sparkles,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  HelpCircle,
  IndianRupee,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function PricingPage() {
  const { user, isPremium, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [plansConfig, setPlansConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentModal, setPaymentModal] = useState(null); // { order, plan }
  const [paymentStatus, setPaymentStatus] = useState(''); // 'processing' | 'success' | 'failed'
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPricing() {
      try {
        const data = await api.getPricingPlans();
        setPlansConfig(data);
      } catch (err) {
        console.warn('Failed to load dynamic pricing:', err);
      }
    }
    loadPricing();
  }, []);

  const monthlyPrice = plansConfig?.user_premium?.monthly || 299;
  const yearlyPrice = plansConfig?.user_premium?.yearly || 2499;
  const currentPrice = billingCycle === 'monthly' ? monthlyPrice : yearlyPrice;

  async function handleStartUpgrade() {
    if (!user) {
      navigate('/auth?redirect=/pricing');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const order = await api.createSubscriptionOrder(billingCycle);
      setPaymentModal({ order, plan: billingCycle });
      setPaymentStatus('ready');
    } catch (err) {
      setError(err.message || 'Failed to initialize subscription checkout');
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmMockPayment(shouldSucceed = true) {
    if (!paymentModal) return;
    setPaymentStatus('processing');

    try {
      const res = await api.verifySubscription({
        orderId: paymentModal.order.orderId,
        plan: paymentModal.plan,
        simulateFail: !shouldSucceed
      });

      if (res.success) {
        setPaymentStatus('success');
        await refreshUser();
      } else {
        setPaymentStatus('failed');
      }
    } catch (err) {
      setPaymentStatus('failed');
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent Indian Pet Parenting</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-sand-900 tracking-tight">
          Choose Your Adoption Journey Tier
        </h1>
        <p className="text-sm sm:text-base text-sand-800">
          Adoption matching and basic shelter listings will always remain free. Premium unlocks unlimited AI consultation and post-adoption medical tracking.
        </p>

        {/* Billing Toggle */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-sand-900' : 'text-sand-700'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-12 h-6 bg-sand-200 rounded-full p-0.5 transition-colors relative"
            aria-label="Toggle Monthly or Yearly"
          >
            <div
              className={`w-5 h-5 rounded-full bg-brand-500 shadow-sm transform transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold ${billingCycle === 'yearly' ? 'text-sand-900' : 'text-sand-700'}`}>
              Yearly (Save 30%)
            </span>
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
              Best Value
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
        
        {/* Free Plan */}
        <div className="bg-white rounded-3xl p-8 border border-sand-200 shadow-card flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-sand-800">Lifelong Free</span>
              <h3 className="text-2xl font-black text-sand-900">Adopter Starter</h3>
              <p className="text-xs text-sand-800">
                Essential algorithmic lifestyle matching and basic cost forecaster for first-time adopters.
              </p>
            </div>

            <div className="pt-2">
              <span className="text-4xl font-black text-sand-900">₹0</span>
              <span className="text-xs text-sand-800 ml-1">/ forever</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-sand-100 text-xs text-sand-800">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Full lifestyle compatibility assessment & quiz</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>3-Tier match ranking & binary deal-breaker explanations</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Standard cost-of-ownership forecaster</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Up to 5 AI Pet Advisor questions per day</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Browse verified shelter adoptable pets</span>
              </div>
            </div>
          </div>

          <Link
            to="/quiz"
            className="w-full text-center py-3 rounded-2xl border border-sand-300 hover:bg-sand-50 text-sand-800 font-bold text-xs transition-colors block"
          >
            Take Free Quiz
          </Link>
        </div>

        {/* Premium Plan */}
        <div className="bg-brand-50/40 rounded-3xl p-8 border-2 border-brand-500 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-brand-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            Most Popular
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Dedicated Care</span>
              <h3 className="text-2xl font-black text-sand-900">PawMatch Premium</h3>
              <p className="text-xs text-sand-800">
                Actionable readiness remediation, custom budgets, unlimited AI advisor, and post-adoption tracking.
              </p>
            </div>

            <div className="pt-2">
              <span className="text-4xl font-black text-sand-900">₹{currentPrice.toLocaleString('en-IN')}</span>
              <span className="text-xs text-sand-800 ml-1">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-brand-200 text-xs text-sand-900">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Unlimited 24/7 AI Pet Advisor queries (no daily cap)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Interactive 4-Week Readiness Remediation Roadmap</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Personalised Cost Plan & customizable Indian pet budget</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Post-Adoption Reminders Tracker (vaccines, deworming, vet checkups)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Priority response on Trial Foster-to-Adopt requests</span>
              </div>
            </div>
          </div>

          <div>
            {isPremium ? (
              <div className="w-full text-center py-3 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                ✓ Active Premium Subscriber
              </div>
            ) : (
              <button
                onClick={handleStartUpgrade}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs sm:text-sm shadow-soft transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Initializing...' : `Upgrade for ₹${currentPrice.toLocaleString('en-IN')}`}</span>
              </button>
            )}
            <p className="text-[11px] text-center text-sand-800 mt-2">
              Instant activation. 100% test & sandbox mode enabled.
            </p>
          </div>
        </div>

      </div>

      {/* Trust & FAQ Strip */}
      <div className="bg-sand-50 rounded-3xl p-6 sm:p-8 border border-sand-200 max-w-4xl mx-auto space-y-4">
        <h4 className="font-bold text-sand-900 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Payment Transparency & Security</span>
        </h4>
        <p className="text-xs text-sand-800 leading-relaxed">
          PawMatch currently processes payments in <strong>Test / Mock Simulation Mode</strong>. No real credit card or bank credentials are required or debited. Subscriptions allow you to unlock advanced roadmaps and medical reminders immediately.
        </p>
      </div>

      {/* Mock Payment Simulation Modal */}
      {paymentModal && (
        <div className="fixed inset-0 z-50 bg-sand-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-sand-200 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-sand-200 pb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-600" />
                <h3 className="font-extrabold text-sand-900 text-base">
                  {paymentModal.order.provider === 'razorpay' ? 'Razorpay Test Checkout' : 'PawMatch Mock Payment Sandbox'}
                </h3>
              </div>
              <button
                onClick={() => setPaymentModal(null)}
                className="text-sand-700 hover:text-sand-900 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-sand-800">Plan:</span>
                <span className="font-bold text-sand-900 capitalize">Premium ({paymentModal.plan})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sand-800">Total Amount:</span>
                <span className="font-extrabold text-brand-600">₹{paymentModal.order.amount} INR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sand-800">Simulation Status:</span>
                <span className="text-emerald-700 font-bold uppercase text-[10px] bg-emerald-100 px-2 py-0.5 rounded-full">
                  Test Sandbox Active
                </span>
              </div>
            </div>

            {paymentStatus === 'processing' && (
              <div className="py-6 text-center space-y-2">
                <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-sand-800">Verifying simulated transaction token...</p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-base font-black text-sand-900">Upgrade Successful!</h4>
                <p className="text-xs text-sand-800">
                  You now have PawMatch Premium access with unlimited AI consultation, full remediation roadmaps, and pet health trackers.
                </p>
                <button
                  onClick={() => {
                    setPaymentModal(null);
                    navigate('/dashboard');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
                >
                  Go to Dashboard
                </button>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
                  ✕
                </div>
                <h4 className="text-base font-black text-sand-900">Simulated Payment Failed</h4>
                <p className="text-xs text-sand-800">
                  This test transaction was rejected as simulated. Try again to simulate successful authorization.
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleConfirmMockPayment(true)}
                    className="px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs"
                  >
                    Simulate Success
                  </button>
                  <button
                    onClick={() => setPaymentModal(null)}
                    className="px-4 py-2 rounded-xl bg-sand-200 text-sand-800 font-bold text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {paymentStatus === 'ready' && (
              <div className="space-y-3">
                <p className="text-xs text-sand-800 leading-relaxed text-center">
                  Rule 4: All payments operate in TEST/MOCK mode. Choose which test result you want to simulate:
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleConfirmMockPayment(true)}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-soft transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Simulate Payment Success (₹{paymentModal.order.amount})</span>
                  </button>
                  <button
                    onClick={() => handleConfirmMockPayment(false)}
                    className="w-full py-2.5 rounded-2xl border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs transition-colors"
                  >
                    Simulate Payment Failure
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
