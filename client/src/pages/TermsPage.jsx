import React from 'react';
import { FileText, Shield, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <div className="pb-6 border-b border-sand-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-2">
          <FileText className="w-3.5 h-3.5" />
          <span>Platform Terms of Service</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-sand-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-sand-800 mt-1">
          Effective Date: October 2026 • Governing law: Courts of Mumbai, India
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sand-200 shadow-card space-y-6 text-xs sm:text-sm text-sand-800 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-sand-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using PawMatch India, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-sand-900">2. Free Access & Adoption Integrity</h2>
          <p>
            Core compatibility quizzes, breed profiles, and basic shelter rescue listings are lifelong free. We prohibit illegal pet commercial breeding, unauthorized puppy mills, and fraudulent adoption fees.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-sand-900">3. Veterinary Medical Disclaimer</h2>
          <p>
            PawMatch India provides algorithmic compatibility matching and general routine guidance. It does <strong>not</strong> provide veterinary medical diagnosis, surgical consultation, or drug prescription. Always consult a licensed veterinarian in emergencies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-sand-900">4. Foster-to-Adopt Trials</h2>
          <p>
            Trial fosters are intended to assess household compatibility. Adopters agree to treat trial pets with humane care, adhere to the 3-3-3 decompression guidelines, and coordinate any return responsibly with the shelter partner.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-sand-900">5. Test Sandbox Payments</h2>
          <p>
            All monetary features (subscriptions, featured shelter badges, foster booking fees) currently run in test/mock mode without processing real credit cards. Subscriptions can be canceled at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-sand-900">6. Limitation of Liability</h2>
          <p>
            PawMatch India facilitates matching and connects adopters with independent shelters and service providers. We are not liable for actions, contracts, or services provided directly by third-party entities.
          </p>
        </section>
      </div>
    </div>
  );
}
