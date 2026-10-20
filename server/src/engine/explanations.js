/**
 * Natural-Language Match & Friction Explanation Generator
 * Tags dimensions (match >= 80, ok 60-79, friction < 60) and composes top strengths and friction points.
 */

export const DIMENSION_LABELS = {
  space: 'Living Space & Home Environment',
  activity: 'Daily Energy & Exercise Needs',
  time_attention: 'Time & Attention Bandwidth',
  grooming: 'Grooming & Shedding Maintenance',
  feeding_effort: 'Feeding & Dietary Routine',
  climate_fit: 'Indian Climate & Weather Fit',
  budget: 'Monthly Financial Commitment',
  experience: 'Pet Parent Experience Level',
  household: 'Family & Household Compatibility'
};

export const DEFAULT_EXPLANATION_TEMPLATES = {
  space: {
    match: "Your living quarters easily accommodate this pet's spatial and territory needs.",
    ok: "Your home size is workable with regular outdoor strolls and designated pet zones.",
    friction: "This pet requires substantially more living space or dedicated free-movement room than your current setup allows."
  },
  activity: {
    match: "Your daily exercise routine perfectly matches this pet's energetic vitality.",
    ok: "Moderate activity aligns adequately, provided daily walks remain consistent.",
    friction: "High athletic demands exceed your available daily exercise bandwidth, risking pent-up frustration."
  },
  time_attention: {
    match: "Your presence at home gives this social companion the interaction and companionship they crave.",
    ok: "Acceptable daily time commitment, though independent toys and enrichment will help when you are occupied.",
    friction: "Pet would be left alone longer than recommended, which can trigger separation distress."
  },
  grooming: {
    match: "Low-maintenance coat makes grooming hassle-free and easy to manage at home.",
    ok: "Manageable coat care with weekly brush-outs and routine seasonal maintenance.",
    friction: "High grooming and shedding demands require dedicated weekly brushing and professional upkeep."
  },
  feeding_effort: {
    match: "Simple, robust dietary needs with no complicated culinary demands.",
    ok: "Standard balanced diet without specialized feeding regimens.",
    friction: "Demands specialized nutrition, portion control, or high-protein fresh preparation."
  },
  climate_fit: {
    match: "Naturally adapted to Indian temperatures; thrives in local warmth without AC dependency.",
    ok: "Copes well in typical urban conditions with standard shade and fresh water.",
    friction: "Prone to severe heat distress in warm/humid Indian seasons; requires round-the-clock air conditioning."
  },
  budget: {
    match: "Monthly care expenses fall comfortably inside your planned pet budget.",
    ok: "Fits within your budget limits, though an unexpected vet cushion is recommended.",
    friction: "Estimated monthly costs (food, preventive vet care, grooming) exceed your current target budget."
  },
  experience: {
    match: "Forgiving, eager-to-please nature ideal for your level of experience.",
    ok: "Trainable and friendly, benefits from structured basic positive-reinforcement routines.",
    friction: "Needs an experienced handler with confident obedience training and breed familiarity."
  },
  household: {
    match: "Gentle, patient, and exceptionally friendly around children and family members.",
    ok: "Good family fit with gentle supervision and respect for pet rest boundaries.",
    friction: "Delicate build or guarding instincts require older children and quiet surroundings."
  }
};

/**
 * Categorize a score into match, ok, or friction
 */
export function tagDimensionScore(score) {
  if (score >= 80) return 'match';
  if (score >= 60) return 'ok';
  return 'friction';
}

/**
 * Generate structured explanations for a pet's dimension scores
 */
export function generateExplanations(dimensionScores = {}, pet = {}, templates = {}) {
  const mergedTemplates = { ...DEFAULT_EXPLANATION_TEMPLATES, ...templates };

  const dimensions = Object.keys(dimensionScores).map(dim => {
    const score = dimensionScores[dim];
    const tag = tagDimensionScore(score);
    const tmpl = mergedTemplates[dim] || DEFAULT_EXPLANATION_TEMPLATES[dim] || {};
    const text = tmpl[tag] || `${DIMENSION_LABELS[dim] || dim}: scored ${score}/100`;

    return {
      dimension: dim,
      label: DIMENSION_LABELS[dim] || dim,
      score,
      tag,
      explanation: text
    };
  });

  // Strengths: highest scoring dimensions (>= 75 preferred)
  const strengths = dimensions
    .filter(d => d.score >= 60)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(d => ({
      dimension: d.dimension,
      label: d.label,
      score: d.score,
      text: d.explanation
    }));

  // Friction: lowest scoring dimensions (< 80)
  const friction = dimensions
    .filter(d => d.score < 80)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(d => ({
      dimension: d.dimension,
      label: d.label,
      score: d.score,
      text: d.explanation
    }));

  // Special note for native breeds
  let nativeSpotlight = null;
  if (pet.is_native) {
    nativeSpotlight = `As a native Indian breed, ${pet.name} has thousands of years of natural immunity, superior heat tolerance, and resilient digestion suited to local climates.`;
  }

  return {
    dimensions,
    strengths,
    friction,
    nativeSpotlight
  };
}
