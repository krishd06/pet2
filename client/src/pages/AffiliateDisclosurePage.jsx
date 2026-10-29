import React from 'react';
import { Award, Sparkles, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <div className="pb-6 border-b border-sand-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>Transparency & Affiliate Ethics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-sand-900 tracking-tight">
          Affiliate & Partner Disclosure
        </h1>
        <p className="text-xs text-sand-800 mt-1">
          Last updated: October 2026 • In accordance with ASCI Guidelines for Digital Content
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sand-200 shadow-card space-y-6 text-xs sm:text-sm text-sand-800 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-sand-900">1. Our Independence & Ethics Policy</h2>
          <p>
            At PawMatch India, our primary mission is animal welfare, promoting native Indian Indie dogs and cats, and encouraging responsible lifetime adoption. We never compromise our algorithmic compatibility scores for advertising revenue.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-sand-900">2. How Partner Links Work</h2>
          <p>
            Throughout our platform—including the Quiz Results page, the Cost-of-Ownership forecaster, and the First 30 Days onboarding guide—you will see recommended brands, insurance providers, veterinarians, and accessories.
          </p>
          <p>
            Every sponsored or partner recommendation is clearly tagged with a <strong>"Partner"</strong> or <strong>"Sponsored"</strong> label. If you click on these outbound links (routed via <code>/go/:partnerId</code>) and complete a purchase, PawMatch India may earn a small referral commission at no additional cost to you.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-sand-900">3. Vetting Standards</h2>
          <p>
            We only recommend products and services that align with ethical animal care:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Force-free, positive reinforcement training methods (no aversive tools like choke chains or shock collars).</li>
            <li>Nutritious, high-quality dog and cat foods formulated for tropical Indian climates.</li>
            <li>Transparent pet health insurance providers covering critical illnesses and accident emergencies.</li>
            <li>Durable, escape-proof harnesses and crates suitable for urban apartment living.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-sand-900">4. Editorial & Algorithmic Integrity</h2>
          <p>
            Our lifestyle compatibility calculations, binary deal-breaker exclusions, and breed suitability rankings are strictly unbiased and driven by veterinary data, apartment dimensions, and exercise needs. Commercial partners cannot pay to boost compatibility scores.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-extrabold text-sand-900">5. Questions or Partner Inquiries</h2>
          <p>
            If you are a certified veterinarian, cruelty-free brand, or pet care professional interested in ethical partnership, please contact our team via the <a href="/for-partners" className="text-brand-600 font-bold underline">For Partners</a> page.
          </p>
        </section>
      </div>
    </div>
  );
}
