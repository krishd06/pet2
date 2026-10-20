/**
 * Lifestyle & Adoption Readiness Assessment Engine (Independent of Pet)
 * Computes 0-100 readiness score across 7 urban Indian pet-parenting categories,
 * assigns bands (Ready, Almost Ready, Not Yet), and details category breakdowns.
 */

export const READINESS_BANDS = {
  READY: 'Ready',
  ALMOST_READY: 'Almost Ready',
  NOT_YET: 'Not Yet'
};

export const READINESS_CATEGORY_WEIGHTS = {
  time_availability: 15,
  financial_stability: 15,
  housing_stability: 15,
  household_agreement: 15,
  commitment_horizon: 20,
  emergency_preparedness: 10,
  experience_readiness: 10
};

/**
 * Compute Time Availability (0-100)
 */
export function scoreTimeAvailability(answers = {}) {
  const hours = Number(answers.daily_available_hours ?? answers.time_capacity_hours ?? 3);
  if (hours >= 4) return 100;
  if (hours >= 3) return 85;
  if (hours >= 2) return 65;
  if (hours >= 1) return 45;
  return 25;
}

/**
 * Compute Financial Stability for Recurring Costs (0-100)
 */
export function scoreFinancialStability(answers = {}) {
  const budget = Number(answers.monthly_budget_inr ?? 3000);
  if (budget >= 7000) return 100;
  if (budget >= 5000) return 88;
  if (budget >= 3500) return 75;
  if (budget >= 2000) return 60;
  if (budget >= 1000) return 40;
  return 20;
}

/**
 * Compute Housing Permission & Stability (0-100)
 */
export function scoreHousingStability(answers = {}) {
  const housingType = (answers.housing_type || 'rental').toLowerCase();
  const landlordPermission = (answers.landlord_permission || 'written').toLowerCase();
  const societyRules = (answers.society_rules || 'friendly').toLowerCase();

  if (housingType === 'owned') {
    if (societyRules === 'friendly' || societyRules === 'allowed') return 100;
    if (societyRules === 'disputes') return 70;
    return 85;
  }

  // Rental
  if (landlordPermission === 'written' && societyRules !== 'banned') return 90;
  if (landlordPermission === 'verbal') return 65;
  if (landlordPermission === 'pending') return 50;
  if (landlordPermission === 'none' || societyRules === 'banned') return 20;
  return 70;
}

/**
 * Compute Household Agreement (0-100)
 */
export function scoreHouseholdAgreement(answers = {}) {
  const agreement = (answers.family_agreement || 'all_enthusiastic').toLowerCase();
  if (agreement === 'all_enthusiastic' || agreement === 'unanimous') return 100;
  if (agreement === 'majority_positive' || agreement === 'accepted') return 75;
  if (agreement === 'one_hesitant' || agreement === 'reluctant') return 45;
  if (agreement === 'opposed' || agreement === 'disagreement') return 20;
  return 80;
}

/**
 * Commitment Horizon Quiz (3 questions about 10-15 year horizon)
 */
export function scoreCommitmentHorizon(answers = {}) {
  // Q1: Moving / relocation policy
  const relocation = (answers.horizon_relocation || 'take_pet').toLowerCase();
  let q1 = 50;
  if (relocation === 'take_pet' || relocation === 'always_accompany') q1 = 100;
  else if (relocation === 'temporary_foster') q1 = 60;
  else if (relocation === 'leave_behind' || relocation === 'rehome') q1 = 20;

  // Q2: Life changes (marriage, career, kids)
  const lifeMilestone = (answers.horizon_milestones || 'non_negotiable').toLowerCase();
  let q2 = 50;
  if (lifeMilestone === 'non_negotiable' || lifeMilestone === 'family_member') q2 = 100;
  else if (lifeMilestone === 'will_manage') q2 = 70;
  else if (lifeMilestone === 'unsure') q2 = 30;

  // Q3: Lifespan realization (12-16 years)
  const lifespanAwareness = (answers.horizon_lifespan_acknowledged ?? true);
  const q3 = lifespanAwareness ? 100 : 35;

  return Math.round((q1 + q2 + q3) / 3);
}

/**
 * Emergency Preparedness (vet buffer & contingency)
 */
export function scoreEmergencyPreparedness(answers = {}) {
  const hasSavings = (answers.has_emergency_vet_fund || 'yes_savings').toLowerCase();
  if (hasSavings === 'yes_savings' || hasSavings === 'dedicated_fund') return 100;
  if (hasSavings === 'credit_or_salary') return 75;
  if (hasSavings === 'limited_cushion') return 50;
  if (hasSavings === 'none') return 25;
  return 70;
}

/**
 * Pet Care Experience Readiness
 */
export function scoreExperienceReadiness(answers = {}) {
  const exp = (answers.experience_history || 'researched_first_timer').toLowerCase();
  if (exp === 'experienced_owner' || exp === 'current_owner') return 100;
  if (exp === 'had_family_pets') return 85;
  if (exp === 'researched_first_timer' || exp === 'first_time') return 70;
  if (exp === 'casual_interest') return 45;
  return 65;
}

/**
 * Master Readiness Calculator
 */
export function calculateReadiness(userAnswers = {}, customWeights = {}) {
  const weights = { ...READINESS_CATEGORY_WEIGHTS, ...customWeights };

  const breakdown = {
    time_availability: scoreTimeAvailability(userAnswers),
    financial_stability: scoreFinancialStability(userAnswers),
    housing_stability: scoreHousingStability(userAnswers),
    household_agreement: scoreHouseholdAgreement(userAnswers),
    commitment_horizon: scoreCommitmentHorizon(userAnswers),
    emergency_preparedness: scoreEmergencyPreparedness(userAnswers),
    experience_readiness: scoreExperienceReadiness(userAnswers)
  };

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const [category, weight] of Object.entries(weights)) {
    if (breakdown[category] !== undefined) {
      totalWeightedScore += breakdown[category] * weight;
      totalWeight += weight;
    }
  }

  const overallScore = Math.max(0, Math.min(100, Math.round(totalWeightedScore / totalWeight)));

  let band = READINESS_BANDS.NOT_YET;
  if (overallScore >= 75) {
    band = READINESS_BANDS.READY;
  } else if (overallScore >= 50) {
    band = READINESS_BANDS.ALMOST_READY;
  }

  return {
    overallScore,
    band,
    categoryBreakdown: breakdown
  };
}
