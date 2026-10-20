/**
 * PawMatch India Compatibility & Readiness Engine Orchestrator
 * Pure functions: runs deal-breaker exclusion, multi-dimensional scoring, natural-language
 * explanations, readiness scoring, remediation roadmap, and cost forecasts.
 */

import { filterPetsByDealBreakers, evaluateDealBreakers } from './dealBreakers.js';
import { calculatePetMatchScore, DEFAULT_WEIGHTS, DEFAULT_NATIVE_BONUS } from './scoring.js';
import { generateExplanations } from './explanations.js';
import { calculateReadiness } from './readiness.js';
import { generateRemediationRoadmap } from './remediation.js';
import { calculatePetOwnershipCosts } from './costs.js';

export {
  evaluateDealBreakers,
  filterPetsByDealBreakers,
  calculatePetMatchScore,
  DEFAULT_WEIGHTS,
  DEFAULT_NATIVE_BONUS,
  generateExplanations,
  calculateReadiness,
  generateRemediationRoadmap,
  calculatePetOwnershipCosts
};

/**
 * Execute complete assessment pipeline
 * @param {Array} allPets - list of all pet profiles from database
 * @param {Object} userAnswers - questionnaire answers provided by user/guest
 * @param {Object} options - custom options (scoring weights, city data, native bonus, templates)
 */
export function evaluateAssessment(allPets = [], userAnswers = {}, options = {}) {
  // 1. Evaluate general adopter readiness (independent of any specific pet)
  const readiness = calculateReadiness(userAnswers, options.readinessWeights);

  // 2. Generate remediation roadmap for any weak readiness categories (< 70)
  const remediationRoadmap = generateRemediationRoadmap(
    readiness.categoryBreakdown,
    options.remediationTemplates
  );

  // 3. Deal-breaker binary filter (runs BEFORE scoring)
  const { eligiblePets, excludedPets } = filterPetsByDealBreakers(allPets, userAnswers);

  // 4. Score each eligible pet
  const scoredPets = eligiblePets.map(pet => {
    const match = calculatePetMatchScore(
      pet,
      userAnswers,
      options.scoringWeights,
      {
        nativeBonus: options.nativeBonus,
        penaltyPerLevel: options.penaltyPerLevel,
        cityMultiplier: options.cityCostMultiplier,
        climateZone: userAnswers.city_climate_zone || options.climateZone
      }
    );

    // Natural-language explanation
    const explanation = generateExplanations(
      match.dimensionScores,
      pet,
      options.explanationTemplates
    );

    // Cost preview for this pet
    const costs = calculatePetOwnershipCosts(pet, options.cityData || userAnswers.city);

    return {
      pet,
      petId: pet.id,
      petSlug: pet.slug,
      petName: pet.name,
      matchScore: match.finalScore,
      tier: match.tier,
      tierLevel: match.tierLevel,
      isNative: match.isNative,
      nativeBonusApplied: match.nativeBonusApplied,
      dimensionScores: match.dimensionScores,
      strengths: explanation.strengths,
      friction: explanation.friction,
      nativeSpotlight: explanation.nativeSpotlight,
      dimensionsWithTags: explanation.dimensions,
      costs
    };
  });

  // Sort eligible pets by match score descending
  scoredPets.sort((a, b) => b.matchScore - a.matchScore);

  // 5. Group into three clean tiers
  const highlyCompatible = scoredPets.filter(p => p.tierLevel === 1);
  const considerCarefully = scoredPets.filter(p => p.tierLevel === 2);
  const lowMatch = scoredPets.filter(p => p.tierLevel === 3);

  // 6. Format excluded pets for the "Why not shown" panel
  const whyNotShown = excludedPets.map(item => ({
    petId: item.pet.id,
    petSlug: item.pet.slug,
    petName: item.pet.name,
    species: item.pet.species,
    breed: item.pet.breed,
    reasons: item.reasons
  }));

  return {
    readiness,
    remediationRoadmap,
    totalPetsEvaluated: allPets.length,
    eligibleCount: eligiblePets.length,
    excludedCount: excludedPets.length,
    tiers: {
      highlyCompatible,
      considerCarefully,
      lowMatch
    },
    rankedMatches: scoredPets,
    topMatch: scoredPets[0] || null,
    whyNotShown
  };
}
