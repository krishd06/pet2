import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <div className="pb-6 border-b border-sand-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>User Data Protection & Privacy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-sand-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-sand-800 mt-1">
          Last updated: October 2026 • Compliant with Indian IT Act (Reasonable Security Practices)
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sand-200 shadow-card space-y-6 text-xs sm:text-sm text-sand-800 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-sand-900">1. Overview and Core Commitment</h2>
          <p>
            At PawMatch India ("we", "us", "our"), protecting the privacy of adopters, shelters, and pet care providers is fundamental. We built our platform to foster pet adoption in urban India with full transparency.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-sand-900">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account & Registration Details:</strong> Email address, hashed password (using bcrypt), full name, and shelter verification documents when registering.</li>
            <li><strong>Compatibility Assessment Responses:</strong> Flat square footage, household composition, work hours, and climate preferences used exclusively to generate compatibility match scores.</li>
            <li><strong>Consented Aggregate Analytics:</strong> Only when you explicitly check the consent box on our questionnaire, anonymized lifestyle outcomes are logged without any name, email, or personal identifier.</li>
            <li><strong>Service Quote Requests:</strong> Name, phone, and inquiry details provided voluntarily when requesting estimates from vets, trainers, groomers, or sitters.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-sand-900">3. How Your Information Is Used</h2>
          <p>
            We process your information to deliver matching results, facilitate shelter inquiries, support trial foster check-ins, and manage premium subscriptions. We never sell or rent your personal information to third-party telemarketers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-sand-900">4. Partner Clicks & Outbound Tracking</h2>
          <p>
            When you click an outbound link to one of our vetted partners via <code>/go/:partnerId</code>, we log an anonymized timestamp and source page to monitor category interest. No personal data is attached to these click events.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-sand-900">5. Payment Information & Security</h2>
          <p>
            All payment features operate in test/mock mode using secure sandbox verification. We never store credit card numbers, CVVs, or bank net-banking passwords on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-sand-900">6. Contact Our Grievance Officer</h2>
          <p>
            For privacy inquiries, account data deletion, or questions under Indian data protection regulations, contact our team at:
            <br />
            <strong>Email:</strong> privacy@pawmatch.in • <strong>Location:</strong> Mumbai, Maharashtra, India.
          </p>
        </section>
      </div>
    </div>
  );
}
