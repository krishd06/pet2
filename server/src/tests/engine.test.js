import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  evaluateDealBreakers,
  filterPetsByDealBreakers
} from '../engine/dealBreakers.js';

import {
  scoreGap,
  calculateClimateScore,
  calculateBudgetScore,
  calculateDimensionScores,
  calculatePetMatchScore
} from '../engine/scoring.js';

import {
  tagDimensionScore,
  generateExplanations
} from '../engine/explanations.js';

import {
  calculateReadiness,
  scoreTimeAvailability,
  scoreFinancialStability,
  scoreHousingStability,
  scoreHouseholdAgreement,
  scoreCommitmentHorizon,
  scoreEmergencyPreparedness,
  READINESS_BANDS
} from '../engine/readiness.js';

import { generateRemediationRoadmap } from '../engine/remediation.js';
import { calculatePetOwnershipCosts } from '../engine/costs.js';
import { evaluateAssessment } from '../engine/index.js';

// Sample mock pets for test assertions
const mockIndieDog = {
  id: 'pet_indie_dog',
  slug: 'indian-pariah-dog',
  name: 'Indian Pariah Dog (Indie)',
  species: 'dog',
  breed: 'Indian Pariah',
  is_native: true,
  size: 'medium',
  adult_weight_kg: 20,
  energy_level: 3,
  space_demand: 3,
  min_space_sqft: 450,
  time_attention_demand: 3,
  grooming_demand: 1,
  feeding_effort: 2,
  max_alone_hours: 6,
  requires_yard: false,
  low_allergen: false,
  kid_safe_min_age: 3,
  heat_tolerance: 5,
  cold_tolerance: 3,
  coat_type: 'short',
  apartment_friendly: true,
  budget_band: 'low',
  base_monthly_cost_inr: 2800,
  upfront_cost_inr: 4500,
  experience_level_required: 1,
  household_fit: 5
};

const mockHusky = {
  id: 'pet_husky',
  slug: 'siberian-husky',
  name: 'Siberian Husky',
  species: 'dog',
  breed: 'Husky',
  is_native: false,
  size: 'large',
  adult_weight_kg: 27,
  energy_level: 5,
  space_demand: 5,
  min_space_sqft: 900,
  time_attention_demand: 5,
  grooming_demand: 5,
  feeding_effort: 4,
  max_alone_hours: 4,
  requires_yard: true,
  low_allergen: false,
  kid_safe_min_age: 6,
  heat_tolerance: 1,
  cold_tolerance: 5,
  coat_type: 'double',
  apartment_friendly: false,
  budget_band: 'very_high',
  base_monthly_cost_inr: 7500,
  upfront_cost_inr: 18000,
  experience_level_required: 4,
  household_fit: 3
};

const mockHypoallergenicCat = {
  id: 'pet_cat_low_allergen',
  slug: 'balinese-cat',
  name: 'Low-Allergen Cat',
  species: 'cat',
  breed: 'Balinese',
  is_native: false,
  size: 'small',
  adult_weight_kg: 4,
  energy_level: 2,
  space_demand: 2,
  min_space_sqft: 350,
  time_attention_demand: 2,
  grooming_demand: 2,
  feeding_effort: 2,
  max_alone_hours: 8,
  requires_yard: false,
  low_allergen: true,
  kid_safe_min_age: 2,
  heat_tolerance: 3,
  cold_tolerance: 3,
  coat_type: 'short',
  apartment_friendly: true,
  budget_band: 'medium',
  base_monthly_cost_inr: 2500,
  upfront_cost_inr: 6000,
  experience_level_required: 1,
  household_fit: 4
};

describe('PawMatch India Compatibility Engine Test Suite', () => {

  // --- DEAL-BREAKER TESTS (A) ---
  describe('Deal-Breaker Filters (Pre-Scoring)', () => {
    it('1. should exclude non-hypoallergenic pet when user has pet-dander allergy', () => {
      const result = evaluateDealBreakers(mockIndieDog, { has_pet_allergy: true });
      assert.equal(result.isExcluded, true);
      assert.ok(result.reasons[0].includes('allergies'));
    });

    it('2. should permit low-allergen pet even if user has pet-dander allergy', () => {
      const result = evaluateDealBreakers(mockHypoallergenicCat, { has_pet_allergy: true });
      assert.equal(result.isExcluded, false);
      assert.equal(result.reasons.length, 0);
    });

    it('3. should exclude pet when adult weight exceeds landlord/society maximum restriction', () => {
      const result = evaluateDealBreakers(mockHusky, { landlord_max_weight_kg: 15 });
      assert.equal(result.isExcluded, true);
      assert.ok(result.reasons[0].includes('restrict pets over 15 kg'));
    });

    it('4. should permit pet when adult weight is under landlord maximum restriction', () => {
      const result = evaluateDealBreakers(mockIndieDog, { landlord_max_weight_kg: 25 });
      assert.equal(result.isExcluded, false);
    });

    it('5. should exclude pet when daily alone hours exceed pet maximum alone tolerance', () => {
      const result = evaluateDealBreakers(mockHusky, { home_alone_hours: 7 }); // Husky max is 4
      assert.equal(result.isExcluded, true);
      assert.ok(result.reasons[0].includes('alone for 7 hrs/day'));
    });

    it('6. should permit pet when daily alone hours are within limits', () => {
      const result = evaluateDealBreakers(mockIndieDog, { home_alone_hours: 5 }); // Indie max is 6
      assert.equal(result.isExcluded, false);
    });

    it('7. should exclude yard-requiring pet if living quarters have no yard or outdoor access', () => {
      const result = evaluateDealBreakers(mockHusky, { has_balcony_or_yard: false });
      assert.equal(result.isExcluded, true);
      assert.ok(result.reasons[0].includes('requires an enclosed yard'));
    });

    it('8. should permit yard-requiring pet if living quarters have yard or balcony', () => {
      const result = evaluateDealBreakers(mockHusky, {
        has_balcony_or_yard: true,
        living_space_sqft: 1200,
        home_alone_hours: 2,
        landlord_max_weight_kg: 40
      });
      assert.equal(result.isExcluded, false);
    });

    it('9. should exclude pet if youngest kid is below pet safe minimum age', () => {
      const result = evaluateDealBreakers(mockHusky, { has_kids_under_5: true, youngest_kid_age: 2, has_balcony_or_yard: true }); // Husky min 6
      assert.equal(result.isExcluded, true);
      assert.ok(result.reasons.some(r => r.includes('minimum child age')));
    });

    it('10. should exclude pet if living space sq ft is below required minimum', () => {
      const result = evaluateDealBreakers(mockHusky, { living_space_sqft: 500, has_balcony_or_yard: true }); // Husky min 900
      assert.equal(result.isExcluded, true);
      assert.ok(result.reasons.some(r => r.includes('below the minimum recommended 900 sq ft')));
    });

    it('11. should return multiple deal-breaker reasons when multiple constraints fail', () => {
      const result = evaluateDealBreakers(mockHusky, {
        living_space_sqft: 400,
        home_alone_hours: 9,
        has_balcony_or_yard: false
      });
      assert.equal(result.isExcluded, true);
      assert.ok(result.reasons.length >= 3);
    });

    it('12. filterPetsByDealBreakers cleanly partitions eligible vs excluded pets', () => {
      const all = [mockIndieDog, mockHusky, mockHypoallergenicCat];
      const { eligiblePets, excludedPets } = filterPetsByDealBreakers(all, {
        living_space_sqft: 600, // Excludes Husky (min 900)
        has_balcony_or_yard: false
      });
      assert.equal(eligiblePets.length, 2);
      assert.equal(excludedPets.length, 1);
      assert.equal(excludedPets[0].pet.slug, 'siberian-husky');
    });
  });

  // --- SCORING & MODIFIER TESTS (B) ---
  describe('Weighted Compatibility Scoring & Indian Context Modifiers', () => {
    it('13. scoreGap yields 100 when capacity is greater than or equal to demand', () => {
      assert.equal(scoreGap(5, 3), 100);
      assert.equal(scoreGap(3, 3), 100);
    });

    it('14. scoreGap subtracts penalty per level for deficit and floors at 0', () => {
      assert.equal(scoreGap(2, 3, 25), 75); // 1 deficit
      assert.equal(scoreGap(1, 3, 25), 50); // 2 deficit
      assert.equal(scoreGap(1, 5, 25), 0);  // 4 deficit: 100 - 100 = 0
    });

    it('15. climate score heavily penalizes double-coat Arctic breeds in hot-humid or hot-dry Indian climates', () => {
      const huskyHotHumid = calculateClimateScore(mockHusky, 'hot-humid');
      assert.equal(huskyHotHumid, 20);

      const huskyHotDry = calculateClimateScore(mockHusky, 'hot-dry');
      assert.equal(huskyHotDry, 20);
    });

    it('16. climate score gives top marks (100) to heat-adapted native Indian breeds in hot climates', () => {
      const indieScore = calculateClimateScore(mockIndieDog, 'hot-humid');
      assert.equal(indieScore, 100);
    });

    it('17. budget scoring yields 100 when user budget >= pet monthly cost', () => {
      const score = calculateBudgetScore(mockIndieDog, 5000, 1.0); // Indie cost 2800
      assert.equal(score, 100);
    });

    it('18. budget scoring penalizes proportionally when user budget < monthly cost', () => {
      const score = calculateBudgetScore(mockHusky, 3750, 1.0); // Husky cost 7500, ratio 50%
      assert.equal(score, 50);
    });

    it('19. native breed receives native bonus (+6) in final match calculation', () => {
      const answers = {
        space_capacity: 4,
        activity_capacity: 4,
        time_capacity: 4,
        grooming_capacity: 4,
        feeding_capacity: 4,
        experience_capacity: 4,
        household_capacity: 4,
        monthly_budget_inr: 8000,
        city_climate_zone: 'composite'
      };
      const match = calculatePetMatchScore(mockIndieDog, answers);
      assert.equal(match.isNative, true);
      assert.equal(match.nativeBonusApplied, 6);
      assert.ok(match.finalScore >= 75);
      assert.equal(match.tier, 'Highly Compatible');
    });

    it('20. non-native breed receives 0 native bonus', () => {
      const answers = { space_capacity: 3 };
      const match = calculatePetMatchScore(mockHypoallergenicCat, answers);
      assert.equal(match.isNative, false);
      assert.equal(match.nativeBonusApplied, 0);
    });

    it('21. assigns correct compatibility tiers based on final score cutoffs', () => {
      // Tier 1: >= 75 -> Highly Compatible
      // Tier 2: 50 - 74 -> Consider Carefully
      // Tier 3: < 50 -> Low Match
      const perfectAnswers = {
        space_capacity: 5,
        activity_capacity: 5,
        time_capacity: 5,
        grooming_capacity: 5,
        feeding_capacity: 5,
        experience_capacity: 5,
        household_capacity: 5,
        monthly_budget_inr: 10000,
        city_climate_zone: 'composite'
      };
      const highMatch = calculatePetMatchScore(mockIndieDog, perfectAnswers);
      assert.equal(highMatch.tier, 'Highly Compatible');

      const poorAnswers = {
        space_capacity: 1,
        activity_capacity: 1,
        time_capacity: 1,
        grooming_capacity: 1,
        feeding_capacity: 1,
        experience_capacity: 1,
        household_capacity: 1,
        monthly_budget_inr: 1000,
        city_climate_zone: 'hot-humid'
      };
      const lowMatch = calculatePetMatchScore(mockHusky, poorAnswers);
      assert.equal(lowMatch.tier, 'Low Match');
    });
  });

  // --- EXPLANATION GENERATOR TESTS (C) ---
  describe('Natural-Language Match & Friction Explanations', () => {
    it('22. tagDimensionScore categorizes match, ok, and friction correctly', () => {
      assert.equal(tagDimensionScore(85), 'match');
      assert.equal(tagDimensionScore(80), 'match');
      assert.equal(tagDimensionScore(75), 'ok');
      assert.equal(tagDimensionScore(60), 'ok');
      assert.equal(tagDimensionScore(59), 'friction');
      assert.equal(tagDimensionScore(20), 'friction');
    });

    it('23. generateExplanations extracts top 3 strengths and top 3 friction points', () => {
      const dimensionScores = {
        space: 100,
        activity: 95,
        climate_fit: 90,
        time_attention: 75,
        budget: 50,
        grooming: 30,
        feeding_effort: 20
      };
      const result = generateExplanations(dimensionScores, mockIndieDog);
      assert.equal(result.strengths.length, 3);
      assert.equal(result.friction.length, 3);
      assert.equal(result.strengths[0].dimension, 'space');
      assert.equal(result.friction[0].dimension, 'feeding_effort');
      assert.ok(result.nativeSpotlight.includes('native Indian breed'));
    });
  });

  // --- READINESS & REMEDIATION TESTS (D & E) ---
  describe('Adopter Readiness Score & Remediation Roadmap', () => {
    it('24. scores high readiness when user is prepared across all 7 categories', () => {
      const readyUser = {
        daily_available_hours: 4,
        monthly_budget_inr: 8000,
        housing_type: 'owned',
        society_rules: 'friendly',
        family_agreement: 'all_enthusiastic',
        horizon_relocation: 'take_pet',
        horizon_milestones: 'non_negotiable',
        horizon_lifespan_acknowledged: true,
        has_emergency_vet_fund: 'yes_savings',
        experience_history: 'experienced_owner'
      };
      const readiness = calculateReadiness(readyUser);
      assert.ok(readiness.overallScore >= 80);
      assert.equal(readiness.band, READINESS_BANDS.READY);
    });

    it('25. scores low readiness band "Not Yet" when user has severe constraints', () => {
      const unpreparedUser = {
        daily_available_hours: 0.5,
        monthly_budget_inr: 800,
        housing_type: 'rental',
        landlord_permission: 'none',
        society_rules: 'banned',
        family_agreement: 'opposed',
        horizon_relocation: 'leave_behind',
        horizon_milestones: 'unsure',
        horizon_lifespan_acknowledged: false,
        has_emergency_vet_fund: 'none',
        experience_history: 'casual_interest'
      };
      const readiness = calculateReadiness(unpreparedUser);
      assert.ok(readiness.overallScore < 50);
      assert.equal(readiness.band, READINESS_BANDS.NOT_YET);
    });

    it('26. generateRemediationRoadmap attaches constructive actions for weak areas (< 70)', () => {
      const breakdown = {
        time_availability: 45, // < 70
        financial_stability: 40, // < 70
        housing_stability: 85,
        household_agreement: 100,
        commitment_horizon: 90,
        emergency_preparedness: 50, // < 70
        experience_readiness: 85
      };
      const roadmap = generateRemediationRoadmap(breakdown);
      assert.equal(roadmap.length, 3);
      const categories = roadmap.map(r => r.categoryKey);
      assert.ok(categories.includes('time_availability'));
      assert.ok(categories.includes('financial_stability'));
      assert.ok(categories.includes('emergency_preparedness'));
      assert.ok(roadmap[0].actions.length > 0);
    });
  });

  // --- COST FORECASTER TESTS (F) ---
  describe('Cost-of-Ownership Forecaster Math', () => {
    it('27. computes 1-year and 5-year totals accurately: 1yr = Upfront + (Monthly * 12)', () => {
      const costs = calculatePetOwnershipCosts(mockIndieDog, 'Pune');
      const expected1Year = costs.upfront.totalUpfront + (costs.monthly.totalMonthly * 12);
      const expected5Year = costs.upfront.totalUpfront + (costs.monthly.totalMonthly * 60);

      assert.equal(costs.projections.oneYearTotal, expected1Year);
      assert.equal(costs.projections.fiveYearTotal, expected5Year);
      assert.ok(costs.upfront.totalUpfront > 0);
      assert.ok(costs.monthly.totalMonthly > 0);
    });

    it('28. scales veterinary and living costs using city multiplier (Mumbai > Kolkata)', () => {
      const mumbaiCosts = calculatePetOwnershipCosts(mockIndieDog, 'Mumbai');
      const kolkataCosts = calculatePetOwnershipCosts(mockIndieDog, 'Kolkata');

      assert.ok(mumbaiCosts.upfront.initialVaccinations > kolkataCosts.upfront.initialVaccinations);
      assert.ok(mumbaiCosts.monthly.totalMonthly > kolkataCosts.monthly.totalMonthly);
    });
  });

  // --- FULL ORCHESTRATION PIPELINE TESTS ---
  describe('Full Assessment Pipeline', () => {
    it('29. evaluateAssessment returns partitioned tiers, readiness, whyNotShown, and costs', () => {
      const pets = [mockIndieDog, mockHusky, mockHypoallergenicCat];
      const userAnswers = {
        living_space_sqft: 600, // Deal breaker for Husky (min 900)
        has_balcony_or_yard: true,
        home_alone_hours: 4,
        monthly_budget_inr: 5000,
        space_capacity: 4,
        activity_capacity: 4,
        time_capacity: 4,
        grooming_capacity: 4,
        city_climate_zone: 'composite'
      };

      const result = evaluateAssessment(pets, userAnswers, { cityData: 'Bengaluru' });

      assert.equal(result.totalPetsEvaluated, 3);
      assert.equal(result.eligibleCount, 2);
      assert.equal(result.excludedCount, 1);
      assert.equal(result.whyNotShown.length, 1);
      assert.equal(result.whyNotShown[0].petSlug, 'siberian-husky');
      assert.ok(result.readiness.overallScore > 0);
      assert.ok(Array.isArray(result.rankedMatches));
      assert.ok(result.rankedMatches[0].costs.projections.oneYearTotal > 0);
    });

    it('30. deal breaker panel accurately details reason for exclusion in pipeline', () => {
      const pets = [mockIndieDog];
      const userAnswers = { has_pet_allergy: true }; // Indie is not low_allergen
      const result = evaluateAssessment(pets, userAnswers);

      assert.equal(result.eligibleCount, 0);
      assert.equal(result.excludedCount, 1);
      assert.ok(result.whyNotShown[0].reasons[0].includes('allergies'));
    });
  });

});
