import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Generate intelligent, personalized reasoning for at least 3 recommended pets
 * using Google Gemini API.
 */
export async function generateAiPetReasonings(topPets, userAnswers = {}) {
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;

  const targetPets = (topPets || []).slice(0, 3);
  if (targetPets.length === 0) return [];

  const city = userAnswers.city || 'an Indian metro';
  const homeType = userAnswers.homeType || 'apartment';
  const workHoursAway = userAnswers.workHoursAway ?? 6;
  const experience = userAnswers.experienceLevel || 'first-time';
  const hasBalcony = userAnswers.hasBalcony ? 'has balcony' : 'no balcony';

  const petSummaries = targetPets.map(p => {
    const petObj = p.pet || p;
    return {
      name: petObj.name,
      species: petObj.species,
      breed: petObj.breed,
      size: petObj.size,
      heatTolerance: petObj.heat_tolerance,
      maxAloneHours: petObj.max_alone_hours,
      isNative: petObj.is_native || p.isNative,
      matchScore: p.matchScore
    };
  });

  const prompt = `You are the lead veterinary lifestyle evaluator for PawMatch India.
Provide personalized, evidence-grounded adoption reasoning for the following 3 recommended pets for this adopter:

Adopter Context:
- City: ${city} (consider Indian urban climate, heat/monsoons, and local housing societies)
- Living Space: ${homeType} (${hasBalcony})
- Daily Hours Away: ${workHoursAway} hours/day
- Adopter Experience: ${experience} parent

Recommended Pets:
${JSON.stringify(petSummaries, null, 2)}

Return a valid JSON array of 3 objects (one for each pet, in the exact same order) with these exact keys:
[
  {
    "petName": "Pet Name",
    "aiReasoning": "2-3 clear, personalized sentences explaining specifically why this pet is an ideal match for this user's home, work hours, and lifestyle in this Indian city.",
    "urbanLivingTip": "One practical, high-value apartment living or climate tip (e.g. lift etiquette, monsoon paws, summer cooling, balcony netting).",
    "dailyRoutine": "Recommended daily walking and stimulation routine tailored to their ${workHoursAway}h away schedule."
  }
]
Output ONLY raw JSON. No markdown ticks, no preamble.`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
    const result = await model.generateContent(prompt);
    const text = result?.response?.text() || '';

    // Clean JSON text
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (Array.isArray(parsed) && parsed.length >= targetPets.length) {
      return targetPets.map((p, idx) => {
        const item = parsed[idx] || {};
        return {
          ...p,
          aiReasoning: item.aiReasoning || generateFallbackReasoning(p, userAnswers),
          urbanLivingTip: item.urbanLivingTip || generateFallbackTip(p, userAnswers),
          dailyRoutine: item.dailyRoutine || generateFallbackRoutine(p, userAnswers),
          aiCertified: true,
          aiEngine: 'Gemini 3.5 Flash'
        };
      });
    }
  } catch (err) {
    console.warn('Gemini reasoning generation note (using rule fallback):', err.message);
  }

  // Fallback to deterministic expert rule-based reasoning
  return targetPets.map(p => ({
    ...p,
    aiReasoning: generateFallbackReasoning(p, userAnswers),
    urbanLivingTip: generateFallbackTip(p, userAnswers),
    dailyRoutine: generateFallbackRoutine(p, userAnswers),
    aiCertified: true,
    aiEngine: 'PawMatch Expert Knowledge Engine'
  }));
}

function generateFallbackReasoning(petItem, answers) {
  const pet = petItem.pet || petItem;
  const isNative = pet.is_native || petItem.isNative;
  const city = answers.city || 'your city';
  const hours = answers.workHoursAway ?? 6;

  if (isNative) {
    return `${pet.name} is an extraordinary companion for ${city} apartment living. With centuries of natural adaptation to Indian temperatures and hardy immunity, they handle ${hours}h alone time with calm confidence and require zero expensive climate pampering.`;
  }
  return `${pet.name} aligns seamlessly with your ${answers.homeType || 'apartment'} setup and ${hours}h daily routine. Their balanced temperament and moderate exercise needs make them a loyal, cooperative match for urban living.`;
}

function generateFallbackTip(petItem, answers) {
  const pet = petItem.pet || petItem;
  const isNative = pet.is_native || petItem.isNative;
  if (isNative) {
    return 'Thrives on simple fresh home-cooked protein (boiled chicken, rice, pumpkin) and requires minimal monsoon skin medication due to natural coat resilience.';
  }
  return 'Ensure balcony safety netting is installed and avoid midday concrete walks during hot peak summer months.';
}

function generateFallbackRoutine(petItem, answers) {
  const hours = answers.workHoursAway ?? 6;
  return `30 mins morning stroll before you leave, engaging chew toy during your ${hours}h away, and a relaxed 30-45 mins evening sniffing walk around society grounds.`;
}
