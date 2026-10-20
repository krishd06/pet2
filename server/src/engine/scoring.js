/**
 * Pure Scoring Engine for Pet Lifestyle Compatibility
 * Pure functions: calculates dimension scores (0-100), applies Indian context modifiers,
 * computes weighted average and determines compatibility tiers.
 */

export const DEFAULT_WEIGHTS = {
  space: 15,
  activity: 15,
  time_attention: 15,
  grooming: 8,
  feeding_effort: 5,
  climate_fit: 10,
  budget: 12,
  experience: 10,
  household: 10
};

export const DEFAULT_NATIVE_BONUS = 6;
export const DEFAULT_PENALTY_PER_LEVEL = 25;

/**
 * Compare 1-5 user capacity against 1-5 pet demand
 */
export function scoreGap(userCapacity, petDemand, penaltyPerLevel = DEFAULT_PENALTY_PER_LEVEL) {
  const capacity = Math.max(1, Math.min(5, Number(userCapacity) || 3));
  const demand = Math.max(1, Math.min(5, Number(petDemand) || 3));

  if (capacity >= demand) {
    return 100;
  }
  const gap = demand - capacity;
  return Math.max(0, 100 - gap * penaltyPerLevel);
}

/**
 * Calculate climate fit score based on city zone and pet heat/cold tolerance
 */
export function calculateClimateScore(pet, climateZone = 'composite') {
  const zone = (climateZone || 'composite').toLowerCase();
  const heat = Number(pet.heat_tolerance) || 3;
  const cold = Number(pet.cold_tolerance) || 3;
  const coat = (pet.coat_type || 'short').toLowerCase();

  if (zone === 'hot-humid' || zone === 'hot-dry') {
    // Arctic/thick double coat breeds struggle heavily in Indian hot weather
    if ((coat === 'double' && cold >= 4) || heat <= 1) {
      return 20;
    }
    if (heat >= 4) return 100;
    if (heat === 3) return 80;
    if (heat === 2) return 50;
    return 25;
  }

  if (zone === 'cold') {
    if (cold >= 4) return 100;
    if (cold === 3) return 80;
    if (cold === 2) return 55;
    return 30;
  }

  // Composite / Moderate (Delhi summer/winter, Bengaluru, Pune)
  if (coat === 'double' && cold >= 4 && heat <= 2) {
    return 40; // Needs AC constantly during peak summer
  }
  if (heat >= 3 && cold >= 2) return 100;
  if (heat >= 2) return 75;
  return 50;
}

/**
 * Calculate budget compatibility score
 */
export function calculateBudgetScore(pet, userBudgetInr, cityMultiplier = 1.0) {
  const monthlyCost = Math.round((Number(pet.base_monthly_cost_inr) || 2500) * Number(cityMultiplier));
  const budget = Number(userBudgetInr);

  if (!budget || budget <= 0) {
    return 50; // Neutral fallback if unanswered
  }

  if (budget >= monthlyCost) {
    return 100;
  }

  const ratio = budget / monthlyCost;
  return Math.max(0, Math.min(100, Math.round(ratio * 100)));
}

/**
 * Score all dimensions for a pet given user answers and scoring weights
 */
export function calculateDimensionScores(pet, userAnswers = {}, options = {}) {
  const penalty = options.penaltyPerLevel ?? DEFAULT_PENALTY_PER_LEVEL;
  const cityMultiplier = options.cityMultiplier ?? 1.0;
  const climateZone = userAnswers.city_climate_zone || options.climateZone || 'composite';

  // 1. Space
  const spaceScore = scoreGap(userAnswers.space_capacity ?? 3, pet.space_demand, penalty);

  // 2. Activity / Exercise
  const activityScore = scoreGap(userAnswers.activity_capacity ?? 3, pet.energy_level, penalty);

  // 3. Time & Attention bandwidth
  const timeAttentionScore = scoreGap(userAnswers.time_capacity ?? 3, pet.time_attention_demand, penalty);

  // 4. Grooming tolerance
  const groomingScore = scoreGap(userAnswers.grooming_capacity ?? 3, pet.grooming_demand, penalty);

  // 5. Feeding effort bandwidth (e.g. raw/fresh cooking vs kibble)
  const feedingScore = scoreGap(userAnswers.feeding_capacity ?? 3, pet.feeding_effort, penalty);

  // 6. Climate fit
  const climateScore = calculateClimateScore(pet, climateZone);

  // 7. Budget fit
  const budgetScore = calculateBudgetScore(pet, userAnswers.monthly_budget_inr, cityMultiplier);

  // 8. Experience level
  const experienceScore = scoreGap(userAnswers.experience_capacity ?? 3, pet.experience_level_required, penalty);

  // 9. Household fit (kids, other pets, family harmony)
  const householdScore = scoreGap(userAnswers.household_capacity ?? 3, pet.household_fit, penalty);

  return {
    space: spaceScore,
    activity: activityScore,
    time_attention: timeAttentionScore,
    grooming: groomingScore,
    feeding_effort: feedingScore,
    climate_fit: climateScore,
    budget: budgetScore,
    experience: experienceScore,
    household: householdScore
  };
}

/**
 * Compute the final weighted score, native bonus, and assign tier
 */
export function calculatePetMatchScore(pet, userAnswers = {}, customWeights = {}, options = {}) {
  const weights = { ...DEFAULT_WEIGHTS, ...customWeights };
  const nativeBonus = options.nativeBonus ?? DEFAULT_NATIVE_BONUS;
  const dimensionScores = calculateDimensionScores(pet, userAnswers, options);

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const [dimension, weight] of Object.entries(weights)) {
    if (dimensionScores[dimension] !== undefined) {
      totalWeightedScore += dimensionScores[dimension] * weight;
      totalWeight += weight;
    }
  }

  const baseWeightedAverage = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  
  // Apply Indian native/Indie breed modifier
  let finalScore = baseWeightedAverage;
  const hasNativeBonus = Boolean(pet.is_native);
  if (hasNativeBonus) {
    finalScore += nativeBonus;
  }

  finalScore = Math.max(0, Math.min(100, Math.round(finalScore)));

  // Tier assignment
  let tier = 'Low Match';
  let tierLevel = 3;
  if (finalScore >= 75) {
    tier = 'Highly Compatible';
    tierLevel = 1;
  } else if (finalScore >= 50) {
    tier = 'Consider Carefully';
    tierLevel = 2;
  }

  return {
    petId: pet.id,
    petSlug: pet.slug,
    petName: pet.name,
    isNative: hasNativeBonus,
    finalScore,
    tier,
    tierLevel,
    dimensionScores,
    nativeBonusApplied: hasNativeBonus ? nativeBonus : 0
  };
}
