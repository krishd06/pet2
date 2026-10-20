import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Award, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Hero / Mission */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 fill-brand-600 text-brand-600" />
          <span>About PawMatch India</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-sand-900 tracking-tight leading-tight">
          Pioneering Honest & Responsible Pet Adoption for Indian Cities
        </h1>
        <p className="text-base sm:text-lg text-sand-800 leading-relaxed">
          PawMatch India was created to tackle the devastating cycle of pet abandonment and impulse buying. We combine an explainable lifestyle compatibility engine with education championing resilient native Indian breeds.
        </p>
      </div>

      {/* Core Values / Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-7 rounded-3xl border border-sand-200 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-sand-900">Zero Guesswork</h3>
          <p className="text-sm text-sand-800 leading-relaxed">
            We evaluate daily routine, work hours, flat size, and budget before recommending any pet—filtering out heartbreak and mismatch upfront.
          </p>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-sand-200 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-sand-900">Native Indie First</h3>
          <p className="text-sm text-sand-800 leading-relaxed">
            Indian Pariah dogs and Desi cats possess natural immunity, climate tolerance, and low maintenance suited for Indian apartments.
          </p>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-sand-200 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-sand-900">Adopter Empowerment</h3>
          <p className="text-sm text-sand-800 leading-relaxed">
            From legal AWBI housing rights to transparent monthly cost projections, we provide the real knowledge every pet parent needs.
          </p>
        </div>
      </div>

      {/* Our Story & AWBI Backing */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-sand-200 shadow-card space-y-6">
        <h2 className="text-2xl font-extrabold text-sand-900">Our Story & Commitment</h2>
        <div className="space-y-4 text-sm sm:text-base text-sand-800 leading-relaxed">
          <p>
            Every year across Indian metro cities like Bengaluru, Mumbai, Delhi-NCR, and Hyderabad, thousands of foreign Arctic and flat-faced breeds are abandoned when families face unexpected medical bills, grooming stress, or severe heat exhaustion.
          </p>
          <p>
            PawMatch India replaces trends with truth. By factoring in real Indian urban conditions—monsoons, summer heat, tight society regulations, and alone hours—we guide adopters to their true lifetime companion.
          </p>
        </div>

        <div className="pt-6 border-t border-sand-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>100% Free educational platform — zero commercial commissions.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Aligned with Animal Welfare Board of India (AWBI) guidelines.</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-soft hover:shadow-hover transition-all"
        >
          <span>Back to Home</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
