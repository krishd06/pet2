/**
 * Cost-of-Ownership Forecaster for Indian Cities
 * Computes granular upfront and monthly recurring expenses in INR, applying city-specific
 * cost multipliers (vet care, food, living costs) and projecting 1-year and 5-year totals.
 */

export const DEFAULT_CITY_MULTIPLIERS = {
  Mumbai: { cost: 1.25, vet: 1.25, food: 1.15 },
  Delhi: { cost: 1.15, vet: 1.15, food: 1.10 },
  Bengaluru: { cost: 1.20, vet: 1.20, food: 1.15 },
  Pune: { cost: 1.05, vet: 1.05, food: 1.00 },
  Chennai: { cost: 1.10, vet: 1.10, food: 1.05 },
  Hyderabad: { cost: 1.10, vet: 1.10, food: 1.05 },
  Kolkata: { cost: 0.95, vet: 0.95, food: 0.95 },
  Ahmedabad: { cost: 1.00, vet: 1.00, food: 1.00 }
};

/**
 * Calculate detailed cost of ownership
 */
export function calculatePetOwnershipCosts(pet = {}, cityData = null) {
  // Determine city multipliers
  let cityMultiplier = 1.0;
  let vetMultiplier = 1.0;
  let foodMultiplier = 1.0;
  let cityName = 'Metro City Average';

  if (cityData) {
    if (typeof cityData === 'string') {
      cityName = cityData;
      const found = DEFAULT_CITY_MULTIPLIERS[cityData] || DEFAULT_CITY_MULTIPLIERS['Pune'];
      cityMultiplier = found.cost;
      vetMultiplier = found.vet;
      foodMultiplier = found.food;
    } else if (typeof cityData === 'object') {
      cityName = cityData.name || cityName;
      cityMultiplier = Number(cityData.cost_multiplier) || 1.0;
      vetMultiplier = Number(cityData.vet_cost_multiplier) || cityMultiplier;
      foodMultiplier = Number(cityData.food_cost_multiplier) || cityMultiplier;
    }
  }

  const species = (pet.species || 'dog').toLowerCase();
  const isNative = Boolean(pet.is_native);
  const groomingDemand = Number(pet.grooming_demand) || 3;
  const size = (pet.size || 'medium').toLowerCase();

  // 1. Upfront Expenses (INR)
  // Shelter adoption donation: minimal/free for indies, nominal NGO fee for purebreds
  const adoptionFee = isNative ? 1000 : 3000;
  
  // Initial vaccination course (Core Puppy/Kitten shots + Anti-rabies)
  const baseVaccination = species === 'cat' ? 3000 : (species === 'dog' ? 3500 : 1000);
  const initialVaccinations = Math.round(baseVaccination * vetMultiplier);

  // Spay / Neuter procedure (often subsidized for native indies via ABC program)
  const baseSpayNeuter = isNative ? 2000 : (species === 'cat' ? 3500 : 5000);
  const spayNeuter = Math.round(baseSpayNeuter * vetMultiplier);

  // Starter Kit (bed, harness/leash or litter box, stainless bowls, basic toys)
  let baseStarterKit = 3500;
  if (species === 'cat') baseStarterKit = 3000;
  else if (species === 'small_pet' || species === 'bird' || species === 'fish') baseStarterKit = 2000;
  if (size === 'large') baseStarterKit += 1500;
  const starterKit = Math.round(baseStarterKit * cityMultiplier);

  const totalUpfront = adoptionFee + initialVaccinations + spayNeuter + starterKit;

  // 2. Monthly Recurring Expenses (INR)
  // Food: higher for large dogs; lower for small pets and cats
  let baseFood = Number(pet.base_monthly_cost_inr) ? Math.round(pet.base_monthly_cost_inr * 0.55) : 2200;
  if (baseFood < 600) baseFood = 600;
  const monthlyFood = Math.round(baseFood * foodMultiplier);

  // Grooming & coat maintenance (substantially lower for short-coated Indies)
  let baseGrooming = 350;
  if (groomingDemand >= 4) {
    baseGrooming = 1800; // Professional salon baths & dematting
  } else if (groomingDemand === 3) {
    baseGrooming = 750;
  }
  const monthlyGrooming = Math.round(baseGrooming * cityMultiplier);

  // Parasite Prevention (Monthly Tick, Flea & Heartworm preventives essential in India)
  const baseParasite = species === 'dog' ? 850 : (species === 'cat' ? 650 : 200);
  const monthlyParasitePrevention = Math.round(baseParasite * vetMultiplier);

  // Routine Healthcare (Annual checkup, booster shots amortized monthly)
  const baseRoutineVet = species === 'dog' ? 500 : (species === 'cat' ? 400 : 200);
  const monthlyRoutineVet = Math.round(baseRoutineVet * vetMultiplier);

  // Emergency Fund Savings Cushion (Recommended per pet)
  const monthlyEmergencyFund = 1000;

  const totalMonthly = monthlyFood + monthlyGrooming + monthlyParasitePrevention + monthlyRoutineVet + monthlyEmergencyFund;

  // 3. Projections
  const oneYearTotal = totalUpfront + (totalMonthly * 12);
  const fiveYearTotal = totalUpfront + (totalMonthly * 60);

  return {
    petId: pet.id,
    petName: pet.name,
    cityName,
    currency: 'INR',
    multipliers: {
      costMultiplier: cityMultiplier,
      vetMultiplier,
      foodMultiplier
    },
    upfront: {
      adoptionFee,
      initialVaccinations,
      spayNeuter,
      starterKit,
      totalUpfront
    },
    monthly: {
      food: monthlyFood,
      grooming: monthlyGrooming,
      parasitePrevention: monthlyParasitePrevention,
      routineVet: monthlyRoutineVet,
      emergencyFundContribution: monthlyEmergencyFund,
      totalMonthly
    },
    projections: {
      oneYearTotal,
      fiveYearTotal
    }
  };
}
