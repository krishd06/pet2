/**
 * Remediation Roadmap Generator
 * Builds actionable, supportive roadmaps for any low readiness areas (< 70 score).
 * Never hard-disqualifies; provides realistic next steps and Indian-context alternatives.
 */

export const DEFAULT_REMEDIATION_CATALOG = {
  time_availability: {
    category: 'Time & Daily Availability',
    threshold: 70,
    actions: [
      {
        title: 'Hire a Verified Neighborhood Dog Walker',
        description: 'Engage a local dog walker or building helper for 45-minute midday walks while you are at work in metro cities.',
        alternative: 'Consider an independent adult Indian Indie cat who thrives with morning and evening companionship.'
      },
      {
        title: 'Start with a Weekend Trial Foster',
        description: 'Test your daily routine with a 48-hour or 7-day foster arrangement before committing to permanent adoption.',
        alternative: 'Opt for an adult or senior pet with established calm habits rather than a high-demanding puppy.'
      }
    ]
  },
  financial_stability: {
    category: 'Financial Planning & Recurring Costs',
    threshold: 70,
    actions: [
      {
        title: 'Choose a Resilient Native Indian Breed (Indie)',
        description: 'Indie dogs and cats have robust natural immunity, rare genetic disorders, and minimal grooming salon costs compared to purebred imports.',
        alternative: 'Adopting from a shelter carries near-zero adoption fees compared to commercial breeders.'
      },
      {
        title: 'Build a ₹15,000 Starter Pet Emergency Cushion',
        description: 'Open a separate digital savings pocket or UPI sub-account and set aside ₹1,500/month for 10 months prior to adoption.',
        alternative: 'Research Indian pet insurance plans (e.g. Digit, Bajaj Allianz) for hospitalization coverage.'
      }
    ]
  },
  housing_stability: {
    category: 'Housing & Society Permissions',
    threshold: 70,
    actions: [
      {
        title: 'Obtain Written Landlord & RWA NOC',
        description: 'Get an explicit pet permission clause in your registered rental lease and obtain a No-Objection Certificate (NOC) from your Resident Welfare Association.',
        alternative: 'Note: Under Animal Welfare Board of India (AWBI) guidelines, Resident Welfare Associations cannot legally ban companion pets.'
      },
      {
        title: 'Cat-Proof Balconies with Pigeon Netting',
        description: 'Install durable nylon safety netting across all open balconies and high windows before bringing a pet home.',
        alternative: 'Look into ground-floor units or societies with designated canine walking zones.'
      }
    ]
  },
  household_agreement: {
    category: 'Household Consensus',
    threshold: 75,
    actions: [
      {
        title: 'Host a Family Pet Responsibility Meeting',
        description: 'Sit down with all roommates or family members and create a shared duty roster: morning walk, feeding, litter cleaning, and vet visits.',
        alternative: 'Visit a local animal shelter together to interact with calm rescue pets and ease anxieties.'
      }
    ]
  },
  commitment_horizon: {
    category: 'Long-Term (10-15 Year) Commitment',
    threshold: 70,
    actions: [
      {
        title: 'Plan Pet Logistics for Future Relocations',
        description: 'Familiarize yourself with domestic train travel policies (First Class Coupe bookings allow dogs) and pet passport documentation for potential overseas moves.',
        alternative: 'If your 5-year outlook involves unpredictable international relocations, consider short-term shelter fostering.'
      }
    ]
  },
  emergency_preparedness: {
    category: 'Veterinary Emergency Preparedness',
    threshold: 70,
    actions: [
      {
        title: 'Save Emergency 24/7 Vet Contacts on Speed Dial',
        description: 'Identify the two closest 24x7 animal hospitals in your city (e.g. BSPCA Mumbai, DCC Delhi, Cessna Bengaluru) and save their emergency triage numbers.',
        alternative: 'Maintain a home pet first-aid kit with antiseptic, gauze, digital thermometer, and electrolyte sachets.'
      }
    ]
  },
  experience_readiness: {
    category: 'Pet Parenting Experience',
    threshold: 70,
    actions: [
      {
        title: 'Adopt an Adult or Pre-Trained Shelter Pet',
        description: 'Adult dogs and cats (1.5+ years) are often already house-trained and past the destructive teething phase, making them dream companions for first-time owners.',
        alternative: 'Connect with a certified positive-reinforcement force-free canine trainer before adoption day.'
      }
    ]
  }
};

/**
 * Generate remediation steps based on category breakdown
 */
export function generateRemediationRoadmap(categoryBreakdown = {}, customTemplates = {}) {
  const roadmap = [];

  for (const [key, score] of Object.entries(categoryBreakdown)) {
    const config = customTemplates[key] || DEFAULT_REMEDIATION_CATALOG[key];
    if (config && score < config.threshold) {
      roadmap.push({
        categoryKey: key,
        categoryName: config.category,
        currentScore: score,
        threshold: config.threshold,
        status: score < 45 ? 'Urgent Focus' : 'Recommended Step',
        actions: config.actions
      });
    }
  }

  return roadmap;
}
