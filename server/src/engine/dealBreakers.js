/**
 * Deal-Breaker Filter (Binary, Pre-Scoring)
 * Excludes pets based on non-negotiable living constraints and returns structured exclusion reasons.
 */

export function evaluateDealBreakers(pet, userAnswers = {}) {
  const reasons = [];

  // 1. Pet-dander allergy check
  const hasAllergy = userAnswers.has_pet_allergy === true || 
                     userAnswers.household_allergies === 'yes' ||
                     userAnswers.has_allergies === true;
  if (hasAllergy && !pet.low_allergen) {
    reasons.push(
      `Household has pet-dander allergies, but ${pet.name} is not low-allergen / hypoallergenic.`
    );
  }

  // 2. Landlord / Society max weight restrictions
  const landlordMaxWeight = Number(userAnswers.landlord_max_weight_kg) || 0;
  if (landlordMaxWeight > 0 && pet.adult_weight_kg > landlordMaxWeight) {
    reasons.push(
      `Housing or society rules restrict pets over ${landlordMaxWeight} kg (adult ${pet.name} averages ~${pet.adult_weight_kg} kg).`
    );
  }

  // 3. Home alone hours vs pet max alone capacity
  const homeAloneHours = Number(userAnswers.home_alone_hours) || 0;
  if (homeAloneHours > pet.max_alone_hours) {
    reasons.push(
      `Pet would be left alone for ${homeAloneHours} hrs/day, exceeding the maximum safe threshold of ${pet.max_alone_hours} hrs/day for ${pet.name}.`
    );
  }

  // 4. Balcony / Yard requirements
  const hasOutdoorAccess = userAnswers.has_balcony_or_yard === true || 
                           userAnswers.outdoor_access === 'balcony' || 
                           userAnswers.outdoor_access === 'yard' ||
                           userAnswers.has_yard === true;
  if (!hasOutdoorAccess && pet.requires_yard) {
    reasons.push(
      `${pet.name} requires an enclosed yard or direct outdoor access, which is unavailable in your current residence.`
    );
  }

  // 5. Young children safety age threshold
  const hasKidsUnder5 = userAnswers.has_kids_under_5 === true || 
                        (userAnswers.youngest_kid_age !== undefined && Number(userAnswers.youngest_kid_age) < 5);
  const youngestKidAge = userAnswers.youngest_kid_age !== undefined ? Number(userAnswers.youngest_kid_age) : (hasKidsUnder5 ? 3 : 10);
  if (hasKidsUnder5 && pet.kid_safe_min_age > youngestKidAge) {
    reasons.push(
      `Recommended minimum child age for ${pet.name} is ${pet.kid_safe_min_age} years (youngest child in home is ${youngestKidAge} years).`
    );
  }

  // 6. Living space (sqft) vs pet minimum space
  const livingSpaceSqft = Number(userAnswers.living_space_sqft) || 0;
  if (livingSpaceSqft > 0 && livingSpaceSqft < pet.min_space_sqft) {
    reasons.push(
      `Your living area of ${livingSpaceSqft} sq ft is below the minimum recommended ${pet.min_space_sqft} sq ft for ${pet.name}.`
    );
  }

  return {
    isExcluded: reasons.length > 0,
    reasons
  };
}

export function filterPetsByDealBreakers(pets = [], userAnswers = {}) {
  const eligiblePets = [];
  const excludedPets = [];

  for (const pet of pets) {
    const evaluation = evaluateDealBreakers(pet, userAnswers);
    if (evaluation.isExcluded) {
      excludedPets.push({
        pet,
        reasons: evaluation.reasons
      });
    } else {
      eligiblePets.push(pet);
    }
  }

  return { eligiblePets, excludedPets };
}
