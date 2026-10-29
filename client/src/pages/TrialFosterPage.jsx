import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  HeartHandshake,
  CreditCard,
  RotateCcw,
  PlusCircle,
  FileText,
  ShieldCheck,
  Award,
  ChevronRight,
  MessageSquare,
  Home
} from 'lucide-react';

export default function TrialFosterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const paramAnimalId = searchParams.get('animalId') || '';
  const paramAnimalName = searchParams.get('animalName') || '';

  // Data State
  const [guide, setGuide] = useState(null);
  const [availablePets, setAvailablePets] = useState([]);
  const [trialBookings, setTrialBookings] = useState([]);
  const [pricingConfig, setPricingConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Flow State
  const [selectedPetId, setSelectedPetId] = useState(paramAnimalId);
  const [selectedDuration, setSelectedDuration] = useState(14); // 7, 14, 30
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentModal, setPaymentModal] = useState(null); // { order, booking }
  const [paymentStatus, setPaymentStatus] = useState(''); // 'ready' | 'processing' | 'success' | 'failed'

  // Active Check-in Modal State
  const [activeCheckInBooking, setActiveCheckInBooking] = useState(null);
  const [checkInDay, setCheckInDay] = useState(3);
  const [checkInNoteText, setCheckInNoteText] = useState('');
  const [submittingCheckIn, setSubmittingCheckIn] = useState(false);

  // Outcome Action State
  const [outcomeBooking, setOutcomeBooking] = useState(null);
  const [outcomeAction, setOutcomeAction] = useState('adopt'); // 'adopt' | 'return'
  const [outcomeFeedback, setOutcomeFeedback] = useState('');
  const [submittingOutcome, setSubmittingOutcome] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [guideRes, animsRes, pricingRes, bookingsRes] = await Promise.all([
          api.getTrialGuide().catch(() => null),
          api.getAnimals().catch(() => ({ animals: [] })),
          api.getPricingPlans().catch(() => null),
          isAuthenticated ? api.getTrialBookings().catch(() => ({ bookings: [] })) : Promise.resolve({ bookings: [] })
        ]);

        if (guideRes) setGuide(guideRes);
        if (animsRes?.animals) setAvailablePets(animsRes.animals);
        if (pricingRes) setPricingConfig(pricingRes);
        if (bookingsRes?.bookings) setTrialBookings(bookingsRes.bookings);

        // Pre-select pet if passed in param
        if (paramAnimalId && animsRes?.animals?.some(a => String(a.id) === String(paramAnimalId))) {
          setSelectedPetId(paramAnimalId);
        } else if (animsRes?.animals?.length > 0 && !selectedPetId) {
          setSelectedPetId(animsRes.animals[0].id);
        }
      } catch (err) {
        console.warn('Failed to load trial foster data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isAuthenticated, paramAnimalId]);

  // Pricing calculations
  const feesMap = pricingConfig?.trial_foster_fees || { 7: 1499, 14: 2499, 30: 4499 };
  const currentFee = feesMap[selectedDuration] || 2499;

  async function handleStartBooking(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/auth?redirect=/foster');
      return;
    }
    if (!selectedPetId) {
      alert('Please select an animal for your trial foster.');
      return;
    }

    setBookingLoading(true);
    try {
      const order = await api.createTrialBookingOrder({
        animalId: selectedPetId,
        durationDays: selectedDuration,
        startDate,
        notes: bookingNotes
      });
      setPaymentModal({ order });
      setPaymentStatus('ready');
    } catch (err) {
      alert('Error creating trial booking: ' + err.message);
    } finally {
      setBookingLoading(false);
    }
  }

  async function handleConfirmMockPayment(shouldSucceed = true) {
    if (!paymentModal) return;
    setPaymentStatus('processing');
    try {
      const res = await api.verifyTrialBookingPayment({
        orderId: paymentModal.order.orderId,
        bookingId: paymentModal.order.bookingId,
        simulateFail: !shouldSucceed
      });

      if (res.success) {
        setPaymentStatus('success');
        // Refresh bookings
        const updated = await api.getTrialBookings();
        setTrialBookings(updated.bookings || []);
      } else {
        setPaymentStatus('failed');
      }
    } catch (err) {
      setPaymentStatus('failed');
    }
  }

  async function handleSubmitCheckIn(e) {
    e.preventDefault();
    if (!activeCheckInBooking || !checkInNoteText.trim()) return;
    setSubmittingCheckIn(true);
    try {
      await api.addTrialCheckInNote(activeCheckInBooking.id, {
        dayNumber: checkInDay,
        note: checkInNoteText.trim()
      });
      // Refresh list
      const updated = await api.getTrialBookings();
      setTrialBookings(updated.bookings || []);
      setActiveCheckInBooking(null);
      setCheckInNoteText('');
    } catch (err) {
      alert('Failed to save check-in: ' + err.message);
    } finally {
      setSubmittingCheckIn(false);
    }
  }

  async function handleSubmitOutcome(e) {
    e.preventDefault();
    if (!outcomeBooking) return;
    setSubmittingOutcome(true);
    try {
      await api.updateTrialBookingOutcome(outcomeBooking.id, {
        outcome: outcomeAction,
        notes: outcomeFeedback
      });
      // Refresh list
      const updated = await api.getTrialBookings();
      setTrialBookings(updated.bookings || []);
      setOutcomeBooking(null);
      setOutcomeFeedback('');
    } catch (err) {
      alert('Failed to update trial outcome: ' + err.message);
    } finally {
      setSubmittingOutcome(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="pb-6 border-b border-sand-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>Foster-to-Adopt Program</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-sand-900 tracking-tight">
          Trial Foster-to-Adopt Experience
        </h1>
        <p className="text-sm text-sand-800 mt-1 max-w-2xl">
          Experience pet parenthood before final adoption. Test apartment dynamics, family allergies, and routine fit with structured milestone support.
        </p>
      </div>

      {/* Main Grid: Booking Form (Left) vs Included Package & Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Booking Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-6">
          <div className="flex items-center gap-2 text-brand-600 font-extrabold text-base">
            <PlusCircle className="w-5 h-5" />
            <span>Book a Supported Foster Trial</span>
          </div>

          <form onSubmit={handleStartBooking} className="space-y-4 text-xs sm:text-sm">
            {/* Pet Selector */}
            <div>
              <label className="block font-bold text-sand-900 mb-1">
                Select Rescue Companion
              </label>
              <select
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
                required
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2.5 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
              >
                <option value="">-- Choose an Adoptable Animal --</option>
                {availablePets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.breed} • {p.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Selector */}
            <div>
              <label className="block font-bold text-sand-900 mb-1">
                Trial Duration & Fee (Configurable)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { days: 7, label: '7 Days', fee: feesMap[7] || 1499 },
                  { days: 14, label: '14 Days', fee: feesMap[14] || 2499 },
                  { days: 30, label: '30 Days', fee: feesMap[30] || 4499 }
                ].map((d) => (
                  <button
                    key={d.days}
                    type="button"
                    onClick={() => setSelectedDuration(d.days)}
                    className={`py-3 px-2 text-center rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 ${
                      selectedDuration === d.days
                        ? 'bg-brand-500 text-white border-brand-500 shadow-soft'
                        : 'bg-sand-50 text-sand-800 border-sand-200 hover:bg-sand-100'
                    }`}
                  >
                    <span>{d.label}</span>
                    <span className={selectedDuration === d.days ? 'text-white/90 text-[11px]' : 'text-brand-600 text-[11px]'}>
                      ₹{d.fee.toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Start Date */}
            <div>
              <label className="block font-bold text-sand-900 mb-1">
                Planned Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2.5 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-medium"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block font-bold text-sand-900 mb-1">
                Household Expectations / Special Notes
              </label>
              <textarea
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                rows="2"
                placeholder="e.g. Need help testing alone time while I work 4 hours from home."
                className="w-full bg-sand-50 border border-sand-300 rounded-xl p-3 text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            {/* Pricing Summary Box */}
            <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-sand-800">Duration:</span>
                <span className="font-bold text-sand-900">{selectedDuration} Days Supported Trial</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sand-800">Total Program Fee:</span>
                <span className="font-extrabold text-brand-600 text-sm">₹{currentFee.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-sand-800 pt-1 border-t border-sand-200">
                Includes matching, structured check-ins, ₹500 vet voucher, and 24/7 care hotline.
              </p>
            </div>

            <button
              type="submit"
              disabled={bookingLoading}
              className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-soft transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>{bookingLoading ? 'Initializing...' : `Proceed to Mock Checkout (₹${currentFee})`}</span>
            </button>
          </form>
        </div>

        {/* Right Column: What's Included & My Trials */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* What's Included Strip */}
          <div className="bg-sand-50/80 rounded-3xl p-6 sm:p-8 border border-sand-200 space-y-4">
            <h3 className="text-base font-extrabold text-sand-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>What Every PawMatch Trial Foster Includes</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-sand-900">
              <div className="bg-white p-3.5 rounded-2xl border border-sand-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-brand-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Shelter Match
                </span>
                <p className="text-sand-800 text-[11px] leading-relaxed">
                  Direct coordination with shelter staff and medical history verification.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-sand-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-brand-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Day 3, 7, 14 Check-ins
                </span>
                <p className="text-sand-800 text-[11px] leading-relaxed">
                  Guided milestone prompts to track appetite, bathroom breaks, and sleep routine.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-sand-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-brand-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ₹500 Partner Vet Voucher
                </span>
                <p className="text-sand-800 text-[11px] leading-relaxed">
                  Placeholder medical credit for health checkup with licensed partner clinics.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-sand-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-brand-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 24/7 Helpline Support
                </span>
                <p className="text-sand-800 text-[11px] leading-relaxed">
                  Direct assistance for behavioral adjustments or unexpected urban flat questions.
                </p>
              </div>
            </div>
          </div>

          {/* Active Bookings & Check-in Timeline */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <h2 className="text-xl font-extrabold text-sand-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" />
                <span>My Trial Foster Bookings ({trialBookings.length})</span>
              </h2>
              <span className="text-xs text-sand-800 font-semibold">Live Milestone Tracker</span>
            </div>

            {trialBookings.length === 0 ? (
              <div className="py-8 text-center text-xs text-sand-800 space-y-2">
                <Clock className="w-8 h-8 text-sand-800 mx-auto" />
                <p>No active trial bookings yet. Select an adoptable animal on the left to start!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {trialBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-3xl border border-sand-200 bg-sand-50/60 space-y-4 text-xs"
                  >
                    {/* Booking Header Strip */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-200 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm sm:text-base text-sand-900">
                            {b.pet_name || 'Rescue Pet'}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              b.status === 'adopted'
                                ? 'bg-emerald-100 text-emerald-900'
                                : b.status === 'returned'
                                ? 'bg-sand-200 text-sand-800'
                                : 'bg-brand-100 text-brand-900'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-sand-800">
                          {b.duration_days} Days • From {new Date(b.start_date).toLocaleDateString()} to {new Date(b.end_date).toLocaleDateString()} • Paid ₹{b.fee}
                        </span>
                      </div>

                      {/* Action buttons if still active */}
                      {b.status === 'active' && (
                        <div className="flex items-center gap-2 pt-1 sm:pt-0">
                          <button
                            onClick={() => {
                              setActiveCheckInBooking(b);
                              setCheckInDay(3);
                              setCheckInNoteText('');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-sand-100 border border-sand-300 text-sand-900 font-bold text-xs transition-colors flex items-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-brand-600" />
                            <span>Log Check-in</span>
                          </button>

                          <button
                            onClick={() => {
                              setOutcomeBooking(b);
                              setOutcomeAction('adopt');
                              setOutcomeFeedback('');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                          >
                            Conclude Trial
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Timeline Check-in Milestones */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-sand-800 uppercase tracking-wider block">
                        Check-in Milestone Timeline:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { day: 3, label: 'Day 3: Decompression' },
                          { day: 7, label: 'Day 7: Routine & Leash' },
                          { day: 14, label: 'Day 14: Fit Evaluation' }
                        ].map((m) => {
                          const existingNote = b.check_in_notes?.find((n) => n.day === m.day);
                          return (
                            <div
                              key={m.day}
                              className={`p-3 rounded-2xl border text-xs space-y-1 ${
                                existingNote
                                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                                  : 'bg-white border-sand-200 text-sand-800'
                              }`}
                            >
                              <div className="flex items-center justify-between font-bold text-[11px]">
                                <span>{m.label}</span>
                                {existingNote ? (
                                  <span className="text-emerald-700 font-black">✓ Completed</span>
                                ) : (
                                  <span className="text-sand-700 font-normal">Pending</span>
                                )}
                              </div>
                              {existingNote && (
                                <p className="text-[11px] text-sand-800 italic line-clamp-2">
                                  "{existingNote.note}"
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Concluded outcome message */}
                    {b.outcome_notes && (
                      <div className="p-3 bg-white rounded-2xl border border-sand-200 text-[11px] text-sand-800">
                        <strong className="text-sand-900 block capitalize">Final Outcome: {b.status}</strong>
                        <p className="italic">"{b.outcome_notes}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mock Payment Checkout Modal */}
      {paymentModal && (
        <div className="fixed inset-0 z-50 bg-sand-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-sand-200">
            <div className="flex items-center justify-between border-b border-sand-200 pb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-600" />
                <h3 className="font-extrabold text-sand-900 text-base">Foster Trial Test Checkout</h3>
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
                <span className="text-sand-800">Duration:</span>
                <span className="font-bold text-sand-900">{paymentModal.order.durationDays || selectedDuration} Days Trial</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sand-800">Total Program Fee:</span>
                <span className="font-extrabold text-brand-600">₹{paymentModal.order.amount} INR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sand-800">Simulation Status:</span>
                <span className="text-emerald-800 font-bold uppercase text-[10px] bg-emerald-100 px-2 py-0.5 rounded-full">
                  Test Sandbox Active
                </span>
              </div>
            </div>

            {paymentStatus === 'processing' && (
              <div className="py-6 text-center space-y-2">
                <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-sand-800">Simulating payment processing...</p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-base font-black text-sand-900">Foster Trial Booked!</h4>
                <p className="text-xs text-sand-800">
                  Your supported trial has been recorded. Check-in milestones are now active on this page.
                </p>
                <button
                  onClick={() => setPaymentModal(null)}
                  className="px-6 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
                >
                  View My Trials
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
                  Transaction simulation was rejected. Try again to simulate success.
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
                  Rule 4: All payments operate in TEST/MOCK mode. Choose which outcome to simulate:
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleConfirmMockPayment(true)}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-soft transition-colors"
                  >
                    Simulate Payment Success (₹{paymentModal.order.amount})
                  </button>
                  <button
                    onClick={() => handleConfirmMockPayment(false)}
                    className="w-full py-2.5 rounded-2xl border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs"
                  >
                    Simulate Payment Failure
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Check-in Note Modal */}
      {activeCheckInBooking && (
        <div className="fixed inset-0 z-50 bg-sand-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-sand-200">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <h3 className="font-extrabold text-sand-900 text-base">
                Submit Milestone Note: {activeCheckInBooking.pet_name}
              </h3>
              <button
                onClick={() => setActiveCheckInBooking(null)}
                className="text-sand-700 hover:text-sand-900 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitCheckIn} className="space-y-3 text-xs">
              <div>
                <label className="block text-sand-800 font-bold mb-1">Select Check-in Milestone</label>
                <select
                  value={checkInDay}
                  onChange={(e) => setCheckInDay(Number(e.target.value))}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900"
                >
                  <option value={3}>Day 3: Initial Decompression & Appetite</option>
                  <option value={7}>Day 7: Routine, Alone-Time & Leash</option>
                  <option value={14}>Day 14: Final Lifestyle Synchronization</option>
                </select>
              </div>

              <div>
                <label className="block text-sand-800 font-bold mb-1">Observation Notes</label>
                <textarea
                  rows="4"
                  required
                  value={checkInNoteText}
                  onChange={(e) => setCheckInNoteText(e.target.value)}
                  placeholder="How is the pet sleeping? Any barking or separation anxiety? How did family members respond?"
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-sand-200">
                <button
                  type="button"
                  onClick={() => setActiveCheckInBooking(null)}
                  className="px-4 py-2 rounded-xl bg-sand-200 text-sand-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCheckIn}
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold"
                >
                  {submittingCheckIn ? 'Saving...' : 'Save Check-in Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Conclusion Outcome Modal (Adopt vs Return) */}
      {outcomeBooking && (
        <div className="fixed inset-0 z-50 bg-sand-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-sand-200">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <h3 className="font-extrabold text-sand-900 text-base">
                Conclude Trial with {outcomeBooking.pet_name}
              </h3>
              <button
                onClick={() => setOutcomeBooking(null)}
                className="text-sand-700 hover:text-sand-900 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitOutcome} className="space-y-4 text-xs">
              <div>
                <label className="block text-sand-800 font-bold mb-2">Final Decision:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOutcomeAction('adopt')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      outcomeAction === 'adopt'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-black shadow-sm'
                        : 'bg-sand-50 border-sand-200 text-sand-800'
                    }`}
                  >
                    <span className="block text-base mb-1">🐾</span>
                    <span>Adopt Permanently</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutcomeAction('return')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      outcomeAction === 'return'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 font-black shadow-sm'
                        : 'bg-sand-50 border-sand-200 text-sand-800'
                    }`}
                  >
                    <span className="block text-base mb-1">🔄</span>
                    <span>Safe Return to Shelter</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sand-800 font-bold mb-1">Feedback & Notes for Shelter Team</label>
                <textarea
                  rows="3"
                  value={outcomeFeedback}
                  onChange={(e) => setOutcomeFeedback(e.target.value)}
                  placeholder="Share details regarding your decision to help the shelter or complete adoption documentation."
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-sand-200">
                <button
                  type="button"
                  onClick={() => setOutcomeBooking(null)}
                  className="px-4 py-2 rounded-xl bg-sand-200 text-sand-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOutcome}
                  className={`px-5 py-2 rounded-xl text-white font-bold ${
                    outcomeAction === 'adopt' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {submittingOutcome ? 'Saving...' : `Confirm ${outcomeAction === 'adopt' ? 'Adoption' : 'Return'}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
