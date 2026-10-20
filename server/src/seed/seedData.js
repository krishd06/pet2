/**
 * PawMatch India Seed Data
 * Contains realistic data for 22 pet profiles, 8 Indian cities, 6 demo shelters,
 * 30 adoptable animals, vet clinics, scoring weights, demo accounts, and MongoDB rich content.
 */

import bcrypt from 'bcryptjs';

// Pre-hashed passwords:
// Password123! -> $2a$10$w...
// AdminSecret123! -> $2a$10$w...
export const DEMO_USERS = [
  {
    id: 'usr_adopter_demo',
    email: 'adopter@pawmatch.in',
    password: 'Password123!',
    password_hash: bcrypt.hashSync('Password123!', 10),
    role: 'adopter',
    name: 'Aarav Sharma'
  },
  {
    id: 'usr_admin_demo',
    email: 'admin@pawmatch.in',
    password: 'AdminSecret123!',
    password_hash: bcrypt.hashSync('AdminSecret123!', 10),
    role: 'admin',
    name: 'PawMatch Admin'
  }
];

export const CITIES = [
  { id: 'city_mumbai', name: 'Mumbai', climate_zone: 'hot-humid', cost_multiplier: 1.25, vet_cost_multiplier: 1.25, food_cost_multiplier: 1.15 },
  { id: 'city_delhi', name: 'Delhi', climate_zone: 'composite', cost_multiplier: 1.15, vet_cost_multiplier: 1.15, food_cost_multiplier: 1.10 },
  { id: 'city_bengaluru', name: 'Bengaluru', climate_zone: 'composite', cost_multiplier: 1.20, vet_cost_multiplier: 1.20, food_cost_multiplier: 1.15 },
  { id: 'city_pune', name: 'Pune', climate_zone: 'composite', cost_multiplier: 1.05, vet_cost_multiplier: 1.05, food_cost_multiplier: 1.00 },
  { id: 'city_chennai', name: 'Chennai', climate_zone: 'hot-humid', cost_multiplier: 1.10, vet_cost_multiplier: 1.10, food_cost_multiplier: 1.05 },
  { id: 'city_hyderabad', name: 'Hyderabad', climate_zone: 'hot-dry', cost_multiplier: 1.10, vet_cost_multiplier: 1.10, food_cost_multiplier: 1.05 },
  { id: 'city_kolkata', name: 'Kolkata', climate_zone: 'hot-humid', cost_multiplier: 0.95, vet_cost_multiplier: 0.95, food_cost_multiplier: 0.95 },
  { id: 'city_ahmedabad', name: 'Ahmedabad', climate_zone: 'hot-dry', cost_multiplier: 1.00, vet_cost_multiplier: 1.00, food_cost_multiplier: 1.00 }
];

export const SCORING_WEIGHTS = [
  { dimension: 'space', weight: 15, description: 'Living space and home area compatibility' },
  { dimension: 'activity', weight: 15, description: 'Daily exercise and physical activity stamina' },
  { dimension: 'time_attention', weight: 15, description: 'Daily companionship hours and separation tolerance' },
  { dimension: 'grooming', weight: 8, description: 'Coat brushing, shedding tolerance and salon visits' },
  { dimension: 'feeding_effort', weight: 5, description: 'Dietary complexity, preparation and portion routines' },
  { dimension: 'climate_fit', weight: 10, description: 'Adaptation to Indian heat, humidity and seasonal weather' },
  { dimension: 'budget', weight: 12, description: 'Monthly recurring food, preventive vet care and supplies' },
  { dimension: 'experience', weight: 10, description: 'Handling skill and trainability required' },
  { dimension: 'household', weight: 10, description: 'Compatibility with children, elders and multi-pet homes' }
];

// 22 Pets with realistic 1-5 attribute ratings
export const PETS = [
  {
    id: 'pet_indie_dog',
    slug: 'indian-pariah-dog',
    name: 'Indian Pariah Dog (Desi / Indie)',
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
    base_monthly_cost_inr: 2600,
    upfront_cost_inr: 4000,
    experience_level_required: 1,
    household_fit: 5
  },
  {
    id: 'pet_indie_cat',
    slug: 'indian-indie-cat',
    name: 'Indian Indie Cat (Desi Billi)',
    species: 'cat',
    breed: 'Indian Shorthair (Indie)',
    is_native: true,
    size: 'small',
    adult_weight_kg: 4,
    energy_level: 2,
    space_demand: 1,
    min_space_sqft: 300,
    time_attention_demand: 2,
    grooming_demand: 1,
    feeding_effort: 1,
    max_alone_hours: 8,
    requires_yard: false,
    low_allergen: false,
    kid_safe_min_age: 2,
    heat_tolerance: 5,
    cold_tolerance: 3,
    coat_type: 'short',
    apartment_friendly: true,
    budget_band: 'low',
    base_monthly_cost_inr: 1800,
    upfront_cost_inr: 3500,
    experience_level_required: 1,
    household_fit: 4
  },
  {
    id: 'pet_labrador',
    slug: 'labrador-retriever',
    name: 'Labrador Retriever',
    species: 'dog',
    breed: 'Labrador Retriever',
    is_native: false,
    size: 'large',
    adult_weight_kg: 32,
    energy_level: 4,
    space_demand: 4,
    min_space_sqft: 750,
    time_attention_demand: 4,
    grooming_demand: 3,
    feeding_effort: 3,
    max_alone_hours: 5,
    requires_yard: false,
    low_allergen: false,
    kid_safe_min_age: 3,
    heat_tolerance: 3,
    cold_tolerance: 4,
    coat_type: 'double',
    apartment_friendly: true,
    budget_band: 'medium',
    base_monthly_cost_inr: 4500,
    upfront_cost_inr: 10000,
    experience_level_required: 2,
    household_fit: 5
  },
  {
    id: 'pet_golden_retriever',
    slug: 'golden-retriever',
    name: 'Golden Retriever',
    species: 'dog',
    breed: 'Golden Retriever',
    is_native: false,
    size: 'large',
    adult_weight_kg: 30,
    energy_level: 4,
    space_demand: 4,
    min_space_sqft: 800,
    time_attention_demand: 5,
    grooming_demand: 4,
    feeding_effort: 3,
    max_alone_hours: 4,
    requires_yard: false,
    low_allergen: false,
    kid_safe_min_age: 3,
    heat_tolerance: 2,
    cold_tolerance: 4,
    coat_type: 'long',
    apartment_friendly: true,
    budget_band: 'high',
    base_monthly_cost_inr: 5200,
    upfront_cost_inr: 12000,
    experience_level_required: 2,
    household_fit: 5
  },
  {
    id: 'pet_german_shepherd',
    slug: 'german-shepherd',
    name: 'German Shepherd',
    species: 'dog',
    breed: 'German Shepherd Dog',
    is_native: false,
    size: 'large',
    adult_weight_kg: 35,
    energy_level: 5,
    space_demand: 4,
    min_space_sqft: 850,
    time_attention_demand: 4,
    grooming_demand: 4,
    feeding_effort: 3,
    max_alone_hours: 4,
    requires_yard: false,
    low_allergen: false,
    kid_safe_min_age: 5,
    heat_tolerance: 2,
    cold_tolerance: 4,
    coat_type: 'double',
    apartment_friendly: false,
    budget_band: 'high',
    base_monthly_cost_inr: 5500,
    upfront_cost_inr: 13000,
    experience_level_required: 4,
    household_fit: 4
  },
  {
    id: 'pet_beagle',
    slug: 'beagle',
    name: 'Beagle',
    species: 'dog',
    breed: 'Beagle',
    is_native: false,
    size: 'small',
    adult_weight_kg: 12,
    energy_level: 4,
    space_demand: 3,
    min_space_sqft: 500,
    time_attention_demand: 4,
    grooming_demand: 2,
    feeding_effort: 2,
    max_alone_hours: 4,
    requires_yard: false,
    low_allergen: false,
    kid_safe_min_age: 4,
    heat_tolerance: 3,
    cold_tolerance: 3,
    coat_type: 'short',
    apartment_friendly: true,
    budget_band: 'medium',
    base_monthly_cost_inr: 3500,
    upfront_cost_inr: 8000,
    experience_level_required: 3,
    household_fit: 4
  },
  {
    id: 'pet_pug',
    slug: 'pug',
    name: 'Pug',
    species: 'dog',
    breed: 'Pug',
    is_native: false,
    size: 'small',
    adult_weight_kg: 8,
    energy_level: 2,
    space_demand: 2,
    min_space_sqft: 380,
    time_attention_demand: 4,
    grooming_demand: 3,
    feeding_effort: 2,
    max_alone_hours: 4,
    requires_yard: false,
    low_allergen: false,
    kid_safe_min_age: 4,
    heat_tolerance: 1, // Brachycephalic (flat faced) - struggles severely in Indian heat
    cold_tolerance: 2,
    coat_type: 'short',
    apartment_friendly: true,
    budget_band: 'medium',
    base_monthly_cost_inr: 3800,
    upfront_cost_inr: 8500,
    experience_level_required: 2,
    household_fit: 4
  },
  {
    id: 'pet_shih_tzu',
    slug: 'shih-tzu',
    name: 'Shih Tzu',
    species: 'dog',
    breed: 'Shih Tzu',
    is_native: false,
    size: 'small',
    adult_weight_kg: 6,
    energy_level: 2,
    space_demand: 2,
    min_space_sqft: 350,
    time_attention_demand: 3,
    grooming_demand: 5, // High maintenance long coat
    feeding_effort: 2,
    max_alone_hours: 5,
    requires_yard: false,
    low_allergen: true,
    kid_safe_min_age: 5,
    heat_tolerance: 2,
    cold_tolerance: 3,
    coat_type: 'long',
    apartment_friendly: true,
    budget_band: 'high',
    base_monthly_cost_inr: 4500,
    upfront_cost_inr: 10000,
    experience_level_required: 2,
    household_fit: 4
  },
  {
    id: 'pet_husky',
    slug: 'siberian-husky',
    name: 'Siberian Husky',
    species: 'dog',
    breed: 'Siberian Husky',
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
    heat_tolerance: 1, // Suffers in tropical climates
    cold_tolerance: 5,
    coat_type: 'double',
    apartment_friendly: false,
    budget_band: 'very_high',
    base_monthly_cost_inr: 7800,
    upfront_cost_inr: 18000,
    experience_level_required: 4,
    household_fit: 3
  },
  {
    id: 'pet_rajapalayam',
    slug: 'rajapalayam',
    name: 'Rajapalayam (Indian Sight Hound)',
    species: 'dog',
    breed: 'Rajapalayam',
    is_native: true,
    size: 'large',
    adult_weight_kg: 28,
    energy_level: 4,
    space_demand: 4,
    min_space_sqft: 750,
    time_attention_demand: 3,
    grooming_demand: 1,
    feeding_effort: 2,
    max_alone_hours: 6,
    requires_yard: false,
    low_allergen: false,
    kid_safe_min_age: 5,
    heat_tolerance: 5,
    cold_tolerance: 2,
    coat_type: 'short',
    apartment_friendly: true,
    budget_band: 'low',
    base_monthly_cost_inr: 3200,
    upfront_cost_inr: 5000,
    experience_level_required: 3,
    household_fit: 4
  },
  {
    id: 'pet_mudhol_hound',
    slug: 'mudhol-hound',
    name: 'Mudhol Hound (Caravan Hound)',
    species: 'dog',
    breed: 'Mudhol Hound',
    is_native: true,
    size: 'large',
    adult_weight_kg: 26,
    energy_level: 5,
    space_demand: 4,
    min_space_sqft: 700,
    time_attention_demand: 3,
    grooming_demand: 1,
    feeding_effort: 2,
    max_alone_hours: 5,
    requires_yard: false,
    low_allergen: false,
    kid_safe_min_age: 5,
    heat_tolerance: 5,
    cold_tolerance: 2,
    coat_type: 'short',
    apartment_friendly: true,
    budget_band: 'low',
    base_monthly_cost_inr: 3000,
    upfront_cost_inr: 4800,
    experience_level_required: 3,
    household_fit: 3
  },
  {
    id: 'pet_chippiparai',
    slug: 'chippiparai',
    name: 'Chippiparai (Tamil Nadu Sight Hound)',
    species: 'dog',
    breed: 'Chippiparai',
    is_native: true,
    size: 'medium',
    adult_weight_kg: 20,
    energy_level: 4,
    space_demand: 3,
    min_space_sqft: 500,
    time_attention_demand: 3,
    grooming_demand: 1,
    feeding_effort: 2,
    max_alone_hours: 6,
    requires_yard: false,
    low_allergen: false,
    kid_safe_min_age: 4,
    heat_tolerance: 5,
    cold_tolerance: 2,
    coat_type: 'short',
    apartment_friendly: true,
    budget_band: 'low',
    base_monthly_cost_inr: 2800,
    upfront_cost_inr: 4500,
    experience_level_required: 2,
    household_fit: 4
  },
  {
    id: 'pet_lhasa_apso',
    slug: 'lhasa-apso',
    name: 'Lhasa Apso',
    species: 'dog',
    breed: 'Lhasa Apso',
    is_native: false,
    size: 'small',
    adult_weight_kg: 7,
    energy_level: 2,
    space_demand: 2,
    min_space_sqft: 350,
    time_attention_demand: 3,
    grooming_demand: 4,
    feeding_effort: 2,
    max_alone_hours: 5,
    requires_yard: false,
    low_allergen: true,
    kid_safe_min_age: 4,
    heat_tolerance: 3,
    cold_tolerance: 4,
    coat_type: 'long',
    apartment_friendly: true,
    budget_band: 'medium',
    base_monthly_cost_inr: 3600,
    upfront_cost_inr: 8000,
    experience_level_required: 2,
    household_fit: 4
  },
  {
    id: 'pet_indian_spitz',
    slug: 'indian-spitz',
    name: 'Indian Spitz',
    species: 'dog',
    breed: 'Indian Spitz',
    is_native: true,
    size: 'small',
    adult_weight_kg: 10,
    energy_level: 3,
    space_demand: 2,
    min_space_sqft: 400,
    time_attention_demand: 3,
    grooming_demand: 3,
    feeding_effort: 2,
    max_alone_hours: 5,
    requires_yard: false,
    low_allergen: false,
    kid_safe_min_age: 3,
    heat_tolerance: 4,
    cold_tolerance: 3,
    coat_type: 'double',
    apartment_friendly: true,
    budget_band: 'low',
    base_monthly_cost_inr: 2500,
    upfront_cost_inr: 4500,
    experience_level_required: 1,
    household_fit: 5
  },
  {
    id: 'pet_persian_cat',
    slug: 'persian-cat',
    name: 'Persian Cat',
    species: 'cat',
    breed: 'Persian',
    is_native: false,
    size: 'small',
    adult_weight_kg: 5,
    energy_level: 1,
    space_demand: 1,
    min_space_sqft: 320,
    time_attention_demand: 3,
    grooming_demand: 5, // Daily combing mandatory, tear duct maintenance
    feeding_effort: 2,
    max_alone_hours: 6,
    requires_yard: false,
    low_allergen: false,
    kid_safe_min_age: 4,
    heat_tolerance: 2,
    cold_tolerance: 3,
    coat_type: 'long',
    apartment_friendly: true,
    budget_band: 'high',
    base_monthly_cost_inr: 3800,
    upfront_cost_inr: 9000,
    experience_level_required: 3,
    household_fit: 3
  },
  {
    id: 'pet_british_shorthair',
    slug: 'british-shorthair',
    name: 'British Shorthair Cat',
    species: 'cat',
    breed: 'British Shorthair',
    is_native: false,
    size: 'small',
    adult_weight_kg: 5,
    energy_level: 2,
    space_demand: 1,
    min_space_sqft: 350,
    time_attention_demand: 2,
    grooming_demand: 2,
    feeding_effort: 2,
    max_alone_hours: 8,
    requires_yard: false,
    low_allergen: false,
    kid_safe_min_age: 3,
    heat_tolerance: 3,
    cold_tolerance: 3,
    coat_type: 'short',
    apartment_friendly: true,
    budget_band: 'medium',
    base_monthly_cost_inr: 2800,
    upfront_cost_inr: 8000,
    experience_level_required: 1,
    household_fit: 4
  },
  {
    id: 'pet_siamese_cat',
    slug: 'siamese-cat',
    name: 'Siamese Cat',
    species: 'cat',
    breed: 'Siamese',
    is_native: false,
    size: 'small',
    adult_weight_kg: 4,
    energy_level: 3,
    space_demand: 1,
    min_space_sqft: 350,
    time_attention_demand: 4, // Highly vocal and social
    grooming_demand: 1,
    feeding_effort: 2,
    max_alone_hours: 5,
    requires_yard: false,
    low_allergen: true,
    kid_safe_min_age: 3,
    heat_tolerance: 4,
    cold_tolerance: 2,
    coat_type: 'short',
    apartment_friendly: true,
    budget_band: 'medium',
    base_monthly_cost_inr: 2600,
    upfront_cost_inr: 7500,
    experience_level_required: 2,
    household_fit: 4
  },
  {
    id: 'pet_rabbit',
    slug: 'domestic-rabbit',
    name: 'Domestic Companion Rabbit',
    species: 'small_pet',
    breed: 'Domestic Rabbit',
    is_native: false,
    size: 'small',
    adult_weight_kg: 2,
    energy_level: 2,
    space_demand: 2,
    min_space_sqft: 300,
    time_attention_demand: 2,
    grooming_demand: 2,
    feeding_effort: 3, // Fresh timothy hay and greens
    max_alone_hours: 6,
    requires_yard: false,
    low_allergen: false,
    kid_safe_min_age: 6, // Fragile spine
    heat_tolerance: 2, // Prone to heat stroke above 30°C
    cold_tolerance: 3,
    coat_type: 'short',
    apartment_friendly: true,
    budget_band: 'low',
    base_monthly_cost_inr: 1500,
    upfront_cost_inr: 3000,
    experience_level_required: 2,
    household_fit: 3
  },
  {
    id: 'pet_guinea_pig',
    slug: 'guinea-pig',
    name: 'Guinea Pig',
    species: 'small_pet',
    breed: 'Guinea Pig',
    is_native: false,
    size: 'small',
    adult_weight_kg: 1,
    energy_level: 2,
    space_demand: 1,
    min_space_sqft: 250,
    time_attention_demand: 2,
    grooming_demand: 2,
    feeding_effort: 2,
    max_alone_hours: 7,
    requires_yard: false,
    low_allergen: false,
    kid_safe_min_age: 5,
    heat_tolerance: 2,
    cold_tolerance: 3,
    coat_type: 'short',
    apartment_friendly: true,
    budget_band: 'low',
    base_monthly_cost_inr: 1200,
    upfront_cost_inr: 2500,
    experience_level_required: 1,
    household_fit: 4
  },
  {
    id: 'pet_budgerigar',
    slug: 'budgerigar',
    name: 'Budgerigar (Budgie)',
    species: 'bird',
    breed: 'Budgerigar',
    is_native: false,
    size: 'small',
    adult_weight_kg: 0.05,
    energy_level: 2,
    space_demand: 1,
    min_space_sqft: 200,
    time_attention_demand: 2,
    grooming_demand: 1,
    feeding_effort: 1,
    max_alone_hours: 8,
    requires_yard: false,
    low_allergen: false,
    kid_safe_min_age: 5,
    heat_tolerance: 3,
    cold_tolerance: 2,
    coat_type: 'none',
    apartment_friendly: true,
    budget_band: 'low',
    base_monthly_cost_inr: 700,
    upfront_cost_inr: 2000,
    experience_level_required: 1,
    household_fit: 3
  },
  {
    id: 'pet_aquarium_fish',
    slug: 'aquarium-freshwater-fish',
    name: 'Aquarium Freshwater Fish',
    species: 'fish',
    breed: 'Freshwater Tropical Fish',
    is_native: false,
    size: 'small',
    adult_weight_kg: 0.02,
    energy_level: 1,
    space_demand: 1,
    min_space_sqft: 180,
    time_attention_demand: 1,
    grooming_demand: 1,
    feeding_effort: 1,
    max_alone_hours: 12,
    requires_yard: false,
    low_allergen: true,
    kid_safe_min_age: 2,
    heat_tolerance: 4,
    cold_tolerance: 2,
    coat_type: 'none',
    apartment_friendly: true,
    budget_band: 'low',
    base_monthly_cost_inr: 600,
    upfront_cost_inr: 4000,
    experience_level_required: 2,
    household_fit: 5
  },
  {
    id: 'pet_dachshund',
    slug: 'dachshund',
    name: 'Dachshund',
    species: 'dog',
    breed: 'Dachshund',
    is_native: false,
    size: 'small',
    adult_weight_kg: 9,
    energy_level: 3,
    space_demand: 2,
    min_space_sqft: 400,
    time_attention_demand: 3,
    grooming_demand: 2,
    feeding_effort: 2,
    max_alone_hours: 5,
    requires_yard: false,
    low_allergen: false,
    kid_safe_min_age: 5,
    heat_tolerance: 3,
    cold_tolerance: 3,
    coat_type: 'short',
    apartment_friendly: true,
    budget_band: 'medium',
    base_monthly_cost_inr: 3200,
    upfront_cost_inr: 7500,
    experience_level_required: 3,
    household_fit: 3
  }
];

// 6 Demo Shelters with verified contact info across major Indian cities
export const SHELTERS = [
  {
    id: 'sh_yoda_mumbai',
    name: 'YODA (Youth Organization in Defence of Animals)',
    city: 'Mumbai',
    address: 'Subhash Chandra Bose Rd, Khar West, Mumbai, Maharashtra 400052',
    phone: '+91 98209 52339',
    email: 'contact@yoda.org.in',
    website: 'https://yodaindia.org',
    description: 'Leading animal rehabilitation sanctuary and adoption center in Mumbai specializing in Indian native puppies and rescue cats.',
    verified: true
  },
  {
    id: 'sh_friendicoes_delhi',
    name: 'Friendicoes SECA',
    city: 'Delhi',
    address: '271 & 273, Flyover Market, Defence Colony, New Delhi 110024',
    phone: '+91 11 2431 4982',
    email: 'friendicoes.india@gmail.com',
    website: 'https://friendicoes.org',
    description: 'One of northern India oldest shelter networks rescuing street dogs, abandoned pedigree pets, and community animals since 1979.',
    verified: true
  },
  {
    id: 'sh_cupa_bengaluru',
    name: 'CUPA (Compassion Unlimited Plus Action)',
    city: 'Bengaluru',
    address: 'Veterinary Hospital Campus, Bellary Rd, R.T. Nagar, Bengaluru, Karnataka 560032',
    phone: '+91 80 2294 7300',
    email: 'communications@cupaindia.org',
    website: 'https://cupaindia.org',
    description: 'Premier animal welfare organization in Bengaluru promoting Indie adoptions, geriatric animal care, and community pet-parenting education.',
    verified: true
  },
  {
    id: 'sh_resq_pune',
    name: 'RESQ Charitable Trust',
    city: 'Pune',
    address: 'Survey No 38/2, Bavdhan Khurd, Near Chandani Chowk, Pune, Maharashtra 411021',
    phone: '+91 98909 99111',
    email: 'info@resqct.org',
    website: 'https://resqct.org',
    description: 'State-of-the-art trauma hospital and rehabilitation center for domestic and wildlife animals in Pune.',
    verified: true
  },
  {
    id: 'sh_bluecross_chennai',
    name: 'Blue Cross of India',
    city: 'Chennai',
    address: '72, Velachery Rd, Guindy, Chennai, Tamil Nadu 600032',
    phone: '+91 44 2235 4959',
    email: 'bluecrossofindia@gmail.com',
    website: 'https://bluecrossofindia.org',
    description: 'Pioneer of the Animal Birth Control (ABC) program in India; champions adoption of native Indie dogs and Chippiparais in South India.',
    verified: true
  },
  {
    id: 'sh_pfa_hyderabad',
    name: 'People For Animals (PFA) Hyderabad',
    city: 'Hyderabad',
    address: 'Near Old Toll Gate, Gachibowli, Hyderabad, Telangana 500032',
    phone: '+91 40 2300 1204',
    email: 'pfahyderabad@gmail.com',
    website: 'https://peopleforanimalsindia.org',
    description: 'Active shelter and animal hospital advocating responsible adoption and humane treatment of companion animals across Telangana.',
    verified: true
  }
];

// ~30 Demo Adoptable Animals
export const ANIMALS = [
  // Mumbai
  {
    id: 'anim_01',
    name: 'Kaju',
    species: 'dog',
    breed: 'Indian Pariah',
    pet_id: 'pet_indie_dog',
    shelter_id: 'sh_yoda_mumbai',
    age_months: 14,
    gender: 'male',
    size: 'medium',
    vaccinated: true,
    neutered: true,
    description: 'Playful, super loving Indie boy rescued as a puppy. House-trained, loves belly rubs, and gets along wonderfully with cats.',
    photo_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Mumbai'
  },
  {
    id: 'anim_02',
    name: 'Rani',
    species: 'dog',
    breed: 'Indian Pariah',
    pet_id: 'pet_indie_dog',
    shelter_id: 'sh_yoda_mumbai',
    age_months: 8,
    gender: 'female',
    size: 'medium',
    vaccinated: true,
    neutered: true,
    description: 'Gentle, bright-eyed Indie pup who loves quiet apartment naps and morning beach strolls. Great for first-time dog parents.',
    photo_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Mumbai'
  },
  {
    id: 'anim_03',
    name: 'Milo',
    species: 'cat',
    breed: 'Indian Shorthair (Indie)',
    pet_id: 'pet_indie_cat',
    shelter_id: 'sh_yoda_mumbai',
    age_months: 18,
    gender: 'male',
    size: 'small',
    vaccinated: true,
    neutered: true,
    description: 'Charismatic tuxedo cat. Purrs loudly the second you walk into the room and loves warm windowsill spots.',
    photo_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Mumbai'
  },
  {
    id: 'anim_04',
    name: 'Bella',
    species: 'dog',
    breed: 'Labrador Retriever',
    pet_id: 'pet_labrador',
    shelter_id: 'sh_yoda_mumbai',
    age_months: 36,
    gender: 'female',
    size: 'large',
    vaccinated: true,
    neutered: true,
    description: 'Rescued from an owner who relocated abroad. Calm, leash-trained, and extremely friendly with children.',
    photo_url: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Mumbai'
  },
  {
    id: 'anim_05',
    name: 'Snowy',
    species: 'dog',
    breed: 'Indian Spitz',
    pet_id: 'pet_indian_spitz',
    shelter_id: 'sh_yoda_mumbai',
    age_months: 24,
    gender: 'female',
    size: 'small',
    vaccinated: true,
    neutered: true,
    description: 'Energetic, fluffy white Spitz who loves fetch and is fiercely loyal to her human. Vaccinated and spayed.',
    photo_url: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Mumbai'
  },

  // Delhi
  {
    id: 'anim_06',
    name: 'Sheru',
    species: 'dog',
    breed: 'Indian Pariah',
    pet_id: 'pet_indie_dog',
    shelter_id: 'sh_friendicoes_delhi',
    age_months: 10,
    gender: 'male',
    size: 'medium',
    vaccinated: true,
    neutered: true,
    description: 'Healthy, golden-tan Indie. Alert, quick learner, and loves food treats. Thrives in apartment settings.',
    photo_url: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Delhi'
  },
  {
    id: 'anim_07',
    name: 'Chai',
    species: 'cat',
    breed: 'Indian Shorthair (Indie)',
    pet_id: 'pet_indie_cat',
    shelter_id: 'sh_friendicoes_delhi',
    age_months: 12,
    gender: 'female',
    size: 'small',
    vaccinated: true,
    neutered: true,
    description: 'Ginger tabby girl. Independent, litter-trained, and great companion for remote-working software engineers.',
    photo_url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Delhi'
  },
  {
    id: 'anim_08',
    name: 'Bruno',
    species: 'dog',
    breed: 'Beagle',
    pet_id: 'pet_beagle',
    shelter_id: 'sh_friendicoes_delhi',
    age_months: 28,
    gender: 'male',
    size: 'small',
    vaccinated: true,
    neutered: true,
    description: 'Sweet tricolor Beagle surrendered due to family allergies. Needs an active companion who enjoys daily walks.',
    photo_url: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Delhi'
  },
  {
    id: 'anim_09',
    name: 'Simba',
    species: 'cat',
    breed: 'Persian',
    pet_id: 'pet_persian_cat',
    shelter_id: 'sh_friendicoes_delhi',
    age_months: 40,
    gender: 'male',
    size: 'small',
    vaccinated: true,
    neutered: true,
    description: 'Regal cream Persian rescued from backyard breeders. Calm temperament; requires daily coat brushing.',
    photo_url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Delhi'
  },
  {
    id: 'anim_10',
    name: 'Rocky',
    species: 'dog',
    breed: 'German Shepherd Dog',
    pet_id: 'pet_german_shepherd',
    shelter_id: 'sh_friendicoes_delhi',
    age_months: 30,
    gender: 'male',
    size: 'large',
    vaccinated: true,
    neutered: true,
    description: 'Noble and loyal GSD who knows basic commands. Best suited for an experienced dog owner with a spacious home.',
    photo_url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5455?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Delhi'
  },

  // Bengaluru
  {
    id: 'anim_11',
    name: 'Badam',
    species: 'dog',
    breed: 'Indian Pariah',
    pet_id: 'pet_indie_dog',
    shelter_id: 'sh_cupa_bengaluru',
    age_months: 9,
    gender: 'male',
    size: 'medium',
    vaccinated: true,
    neutered: true,
    description: 'Playful Indie puppy with fawn coat and chocolate nose. Highly social, friendly with neighborhood dogs and kids.',
    photo_url: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Bengaluru'
  },
  {
    id: 'anim_12',
    name: 'Gauri',
    species: 'dog',
    breed: 'Mudhol Hound',
    pet_id: 'pet_mudhol_hound',
    shelter_id: 'sh_cupa_bengaluru',
    age_months: 16,
    gender: 'female',
    size: 'large',
    vaccinated: true,
    neutered: true,
    description: 'Sleek, majestic indigenous sight hound from Karnataka. Very loyal, calm indoors, and loves weekend open-ground sprints.',
    photo_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Bengaluru'
  },
  {
    id: 'anim_13',
    name: 'Nala',
    species: 'cat',
    breed: 'Indian Shorthair (Indie)',
    pet_id: 'pet_indie_cat',
    shelter_id: 'sh_cupa_bengaluru',
    age_months: 11,
    gender: 'female',
    size: 'small',
    vaccinated: true,
    neutered: true,
    description: 'Calico cutie with huge green eyes. Loves climbing cat trees and curling up beside your laptop.',
    photo_url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Bengaluru'
  },
  {
    id: 'anim_14',
    name: 'Leo',
    species: 'dog',
    breed: 'Golden Retriever',
    pet_id: 'pet_golden_retriever',
    shelter_id: 'sh_cupa_bengaluru',
    age_months: 48,
    gender: 'male',
    size: 'large',
    vaccinated: true,
    neutered: true,
    description: 'Gentle giant who thinks he is a lapdog. Surrendered due to family moving abroad. In good health, loves cuddles.',
    photo_url: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Bengaluru'
  },
  {
    id: 'anim_15',
    name: 'Pistachio',
    species: 'small_pet',
    breed: 'Domestic Rabbit',
    pet_id: 'pet_rabbit',
    shelter_id: 'sh_cupa_bengaluru',
    age_months: 10,
    gender: 'female',
    size: 'small',
    vaccinated: true,
    neutered: true,
    description: 'Fluffy grey bunny. Free-roam indoor pet accustomed to litter tray and loves fresh coriander and timothy hay.',
    photo_url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Bengaluru'
  },

  // Pune
  {
    id: 'anim_16',
    name: 'Motu',
    species: 'dog',
    breed: 'Indian Pariah',
    pet_id: 'pet_indie_dog',
    shelter_id: 'sh_resq_pune',
    age_months: 20,
    gender: 'male',
    size: 'medium',
    vaccinated: true,
    neutered: true,
    description: 'Chubby, cheerful Indie boy. Extremely quiet at home, friendly with everyone he meets, and great walker on leash.',
    photo_url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Pune'
  },
  {
    id: 'anim_17',
    name: 'Tara',
    species: 'dog',
    breed: 'Indian Pariah',
    pet_id: 'pet_indie_dog',
    shelter_id: 'sh_resq_pune',
    age_months: 15,
    gender: 'female',
    size: 'medium',
    vaccinated: true,
    neutered: true,
    description: 'Intelligent Indie girl who learns tricks in 10 minutes. Loves hiking and weekend outdoor adventures.',
    photo_url: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Pune'
  },
  {
    id: 'anim_18',
    name: 'Oreo',
    species: 'cat',
    breed: 'Indian Shorthair (Indie)',
    pet_id: 'pet_indie_cat',
    shelter_id: 'sh_resq_pune',
    age_months: 14,
    gender: 'male',
    size: 'small',
    vaccinated: true,
    neutered: true,
    description: 'Black and white Indie cat with a heart of gold. Very quiet, loves brushing, and enjoys warm blankets.',
    photo_url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Pune'
  },
  {
    id: 'anim_19',
    name: 'Phoebe',
    species: 'dog',
    breed: 'Shih Tzu',
    pet_id: 'pet_shih_tzu',
    shelter_id: 'sh_resq_pune',
    age_months: 36,
    gender: 'female',
    size: 'small',
    vaccinated: true,
    neutered: true,
    description: 'Sweet Shih Tzu saved from neglect. Hypoallergenic coat, loves lap naps, and will happily follow you around.',
    photo_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Pune'
  },

  // Chennai
  {
    id: 'anim_20',
    name: 'Velan',
    species: 'dog',
    breed: 'Chippiparai',
    pet_id: 'pet_chippiparai',
    shelter_id: 'sh_bluecross_chennai',
    age_months: 18,
    gender: 'male',
    size: 'medium',
    vaccinated: true,
    neutered: true,
    description: 'Graceful Tamil Nadu native hound. Highly resilient in Chennai heat, quiet demeanor, very loyal to family members.',
    photo_url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Chennai'
  },
  {
    id: 'anim_21',
    name: 'Malar',
    species: 'dog',
    breed: 'Rajapalayam',
    pet_id: 'pet_rajapalayam',
    shelter_id: 'sh_bluecross_chennai',
    age_months: 22,
    gender: 'female',
    size: 'large',
    vaccinated: true,
    neutered: true,
    description: 'Pure white royal Rajapalayam hound with pink nose. Beautiful, regal, alert watchdog with gentle soul at home.',
    photo_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Chennai'
  },
  {
    id: 'anim_22',
    name: 'Cheenu',
    species: 'cat',
    breed: 'Indian Shorthair (Indie)',
    pet_id: 'pet_indie_cat',
    shelter_id: 'sh_bluecross_chennai',
    age_months: 7,
    gender: 'male',
    size: 'small',
    vaccinated: true,
    neutered: true,
    description: 'Curious young Indie cat. Litter-trained, loves chasing string toys, and great with children.',
    photo_url: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Chennai'
  },
  {
    id: 'anim_23',
    name: 'Maya',
    species: 'dog',
    breed: 'Indian Pariah',
    pet_id: 'pet_indie_dog',
    shelter_id: 'sh_bluecross_chennai',
    age_months: 12,
    gender: 'female',
    size: 'medium',
    vaccinated: true,
    neutered: true,
    description: 'Resilient and sweet Indie girl. Perfect apartment companion who loves afternoon snoozes on cool tiled floors.',
    photo_url: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Chennai'
  },

  // Hyderabad
  {
    id: 'anim_24',
    name: 'Biryani',
    species: 'dog',
    breed: 'Indian Pariah',
    pet_id: 'pet_indie_dog',
    shelter_id: 'sh_pfa_hyderabad',
    age_months: 11,
    gender: 'male',
    size: 'medium',
    vaccinated: true,
    neutered: true,
    description: 'Playful, foodie Indie boy with adorable floppy ears. Loves chicken broth treats and long leisurely walks.',
    photo_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Hyderabad'
  },
  {
    id: 'anim_25',
    name: 'Noor',
    species: 'cat',
    breed: 'Siamese',
    pet_id: 'pet_siamese_cat',
    shelter_id: 'sh_pfa_hyderabad',
    age_months: 20,
    gender: 'female',
    size: 'small',
    vaccinated: true,
    neutered: true,
    description: 'Chatty Siamese beauty with sapphire blue eyes. Loves greeting you at the door and sitting on shoulders.',
    photo_url: 'https://images.unsplash.com/photo-1513360309081-38f076278f1d?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Hyderabad'
  },
  {
    id: 'anim_26',
    name: 'Sultan',
    species: 'dog',
    breed: 'Labrador Retriever',
    pet_id: 'pet_labrador',
    shelter_id: 'sh_pfa_hyderabad',
    age_months: 30,
    gender: 'male',
    size: 'large',
    vaccinated: true,
    neutered: true,
    description: 'Black Labrador with the gentlest soul. Loves fetch, water play, and is wonderful with elderly family members.',
    photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Hyderabad'
  },
  {
    id: 'anim_27',
    name: 'Chhotu',
    species: 'dog',
    breed: 'Indian Spitz',
    pet_id: 'pet_indian_spitz',
    shelter_id: 'sh_pfa_hyderabad',
    age_months: 15,
    gender: 'male',
    size: 'small',
    vaccinated: true,
    neutered: true,
    description: 'Cheerful Indian Spitz who loves being the center of attention. Compact size makes him ideal for compact flats.',
    photo_url: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Hyderabad'
  },

  // Kolkata & Ahmedabad
  {
    id: 'anim_28',
    name: 'Mishti',
    species: 'cat',
    breed: 'Indian Shorthair (Indie)',
    pet_id: 'pet_indie_cat',
    shelter_id: 'sh_yoda_mumbai',
    age_months: 10,
    gender: 'female',
    size: 'small',
    vaccinated: true,
    neutered: true,
    description: 'Sweet tortoiseshell kitten rescued during Kolkata monsoons. Quiet, loving, and adores chin scratches.',
    photo_url: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Kolkata'
  },
  {
    id: 'anim_29',
    name: 'Toofan',
    species: 'dog',
    breed: 'Indian Pariah',
    pet_id: 'pet_indie_dog',
    shelter_id: 'sh_friendicoes_delhi',
    age_months: 12,
    gender: 'male',
    size: 'medium',
    vaccinated: true,
    neutered: true,
    description: 'Fast, playful Indie boy with endless energy for fetch and park walks. Excellent immune system, thrives in Indian heat.',
    photo_url: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Kolkata'
  },
  {
    id: 'anim_30',
    name: 'Dhokla',
    species: 'dog',
    breed: 'Indian Pariah',
    pet_id: 'pet_indie_dog',
    shelter_id: 'sh_pfa_hyderabad',
    age_months: 14,
    gender: 'female',
    size: 'medium',
    vaccinated: true,
    neutered: true,
    description: 'Warm golden coat with smiling eyes. Extremely loyal, clean habits, and very respectful of apartment space.',
    photo_url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
    status: 'adoptable',
    city: 'Ahmedabad'
  }
];

// Vet directory for major Indian cities with emergency 24/7 status
export const VETS = [
  {
    id: 'vet_01',
    name: 'Dr. Makarand Chousalkar',
    clinic_name: 'TopDog Pets Clinic & Hospital',
    city: 'Mumbai',
    area: 'Bandra West',
    phone: '+91 22 2640 1234',
    emergency_24x7: true,
    address: 'Near Mehboob Studio, Hill Rd, Bandra West, Mumbai 400050',
    rating: 4.8
  },
  {
    id: 'vet_02',
    name: 'Bai Sakarbai Dinshaw Petit Hospital (BSPCA)',
    clinic_name: 'BSPCA Animal Hospital',
    city: 'Mumbai',
    area: 'Parel',
    phone: '+91 22 2413 7518',
    emergency_24x7: true,
    address: 'Dr SS Rao Road, Near Gandhi Hospital, Parel, Mumbai 400012',
    rating: 4.5
  },
  {
    id: 'vet_03',
    name: 'Dr. Vinod Sharma',
    clinic_name: 'DCC Animal Hospital',
    city: 'Delhi',
    area: 'Greater Kailash',
    phone: '+91 11 4050 8080',
    emergency_24x7: true,
    address: 'Plot No. 1, Jagdamba Farm, DLF Farms, Chhattarpur, New Delhi 110074',
    rating: 4.9
  },
  {
    id: 'vet_04',
    name: 'Friendicoes Vet Clinic',
    clinic_name: 'Friendicoes Round-the-Clock Emergency',
    city: 'Delhi',
    area: 'Defence Colony',
    phone: '+91 11 2431 4982',
    emergency_24x7: true,
    address: '271 & 273 Flyover Market, Defence Colony, New Delhi 110024',
    rating: 4.7
  },
  {
    id: 'vet_05',
    name: 'Dr. Pawan Kumar',
    clinic_name: 'Cessna Lifeline Veterinary Hospital',
    city: 'Bengaluru',
    area: 'Domlur',
    phone: '+91 80 4165 4165',
    emergency_24x7: true,
    address: '148, Amarjyoti Layout, Intermediate Ring Rd, Domlur, Bengaluru 560071',
    rating: 4.8
  },
  {
    id: 'vet_06',
    name: 'Crown Vet Bengaluru',
    clinic_name: 'Crown Vet Care',
    city: 'Bengaluru',
    area: 'Indiranagar',
    phone: '+91 80 4370 7070',
    emergency_24x7: true,
    address: '754, 80 Feet Rd, 4th Block, Koramangala, Bengaluru 560034',
    rating: 4.7
  },
  {
    id: 'vet_07',
    name: 'Dr. Milind Hatekar',
    clinic_name: 'Crown Vet Pune',
    city: 'Pune',
    area: 'Kalyani Nagar',
    phone: '+91 20 6726 6000',
    emergency_24x7: true,
    address: 'Fortaleza Central Ave, Kalyani Nagar, Pune 411006',
    rating: 4.8
  },
  {
    id: 'vet_08',
    name: 'RESQ Animal Hospital',
    clinic_name: 'RESQ Trauma Centre',
    city: 'Pune',
    area: 'Bavdhan',
    phone: '+91 98909 99111',
    emergency_24x7: true,
    address: 'Bavdhan Khurd, Pune 411021',
    rating: 4.9
  },
  {
    id: 'vet_09',
    name: 'Dr. R. Jayaprakash',
    clinic_name: 'Madras Veterinary College Hospital (TANUVAS)',
    city: 'Chennai',
    area: 'Vepery',
    phone: '+91 44 2530 4000',
    emergency_24x7: true,
    address: 'EVK Sampath Salai, Vepery, Chennai 600007',
    rating: 4.6
  },
  {
    id: 'vet_10',
    name: 'Dr. K. G. Dutta',
    clinic_name: 'Olive Pet Clinic & Surgery',
    city: 'Hyderabad',
    area: 'Banjara Hills',
    phone: '+91 40 2335 1212',
    emergency_24x7: true,
    address: 'Road No. 12, Banjara Hills, Hyderabad 500034',
    rating: 4.7
  }
];

// Rich MongoDB Collections Data
export const QUESTIONNAIRE_STEPS = [
  {
    id: 'step_space',
    title: 'Living Space & Rules',
    description: 'Your home footprint, housing type, and society pet policies.',
    icon: 'Home',
    questions: [
      {
        id: 'living_space_sqft',
        text: 'What is the approximate carpet area of your home (sq ft)?',
        type: 'number',
        placeholder: 'e.g. 750',
        helpText: 'Helps ensure your pet has comfortable movement territory.',
        min: 150,
        max: 5000,
        defaultValue: 750,
        required: true
      },
      {
        id: 'space_capacity',
        text: 'How spacious does your apartment feel for pet movement?',
        type: 'capacity',
        options: [
          { label: 'Compact studio / 1RK', value: 1, capacityLevel: 1 },
          { label: 'Standard 1BHK (400-600 sq ft)', value: 2, capacityLevel: 2 },
          { label: 'Comfortable 2BHK (650-1000 sq ft)', value: 3, capacityLevel: 3 },
          { label: 'Spacious 3BHK / Penthouse (1100-1800 sq ft)', value: 4, capacityLevel: 4 },
          { label: 'Large independent villa / bungalow', value: 5, capacityLevel: 5 }
        ],
        required: true
      },
      {
        id: 'housing_type',
        text: 'What is your housing ownership status?',
        type: 'select',
        options: [
          { label: 'We own our home', value: 'owned' },
          { label: 'Renting with written landlord pet NOC', value: 'rental_noc' },
          { label: 'Renting with verbal landlord approval', value: 'rental_verbal' },
          { label: 'Renting, have not asked landlord yet', value: 'rental_pending' }
        ],
        required: true
      },
      {
        id: 'outdoor_access',
        text: 'What outdoor or balcony access does your home have?',
        type: 'select',
        options: [
          { label: 'No balcony or yard (closed apartment)', value: 'none' },
          { label: 'Net-protected balcony', value: 'balcony' },
          { label: 'Private terrace or compound yard', value: 'yard' }
        ],
        required: true
      },
      {
        id: 'landlord_max_weight_kg',
        text: 'Does your landlord or society have a maximum pet weight restriction?',
        type: 'select',
        options: [
          { label: 'No weight restrictions', value: 0 },
          { label: 'Small pets only (< 10 kg)', value: 10 },
          { label: 'Medium pets only (< 20 kg)', value: 20 },
          { label: 'Under 30 kg', value: 30 }
        ],
        required: false
      }
    ]
  },
  {
    id: 'step_activity',
    title: 'Daily Energy & Exercise',
    description: 'Your physical activity routine and daily walking commitment.',
    icon: 'Activity',
    questions: [
      {
        id: 'activity_capacity',
        text: 'How much active physical exercise can you provide every single day?',
        type: 'capacity',
        options: [
          { label: 'Minimal (indoor play or 10-min stroll)', value: 1, capacityLevel: 1 },
          { label: 'Low (15-20 min gentle walk once daily)', value: 2, capacityLevel: 2 },
          { label: 'Moderate (30-45 mins total walks split morning/evening)', value: 3, capacityLevel: 3 },
          { label: 'Active (60-75 mins vigorous walks, jog or fetch)', value: 4, capacityLevel: 4 },
          { label: 'Very athletic (90+ mins running, hiking or agility)', value: 5, capacityLevel: 5 }
        ],
        required: true
      }
    ]
  },
  {
    id: 'step_time',
    title: 'Time & Attention Bandwidth',
    description: 'Work schedules and hours a pet would be left alone.',
    icon: 'Clock',
    questions: [
      {
        id: 'home_alone_hours',
        text: 'On a typical weekday, how many continuous hours will the pet be alone at home?',
        type: 'number',
        placeholder: 'e.g. 4',
        helpText: 'Dogs require frequent relief breaks and interaction. Puppies cannot be left alone >3-4 hrs.',
        min: 0,
        max: 14,
        defaultValue: 4,
        required: true
      },
      {
        id: 'time_capacity',
        text: 'How much quality interaction time can you dedicate daily (grooming, play, cuddling)?',
        type: 'capacity',
        options: [
          { label: 'Under 1 hour/day', value: 1, capacityLevel: 1 },
          { label: '1 to 2 hours/day', value: 2, capacityLevel: 2 },
          { label: '2 to 3 hours/day', value: 3, capacityLevel: 3 },
          { label: '3 to 5 hours/day', value: 4, capacityLevel: 4 },
          { label: 'Work from home / Someone is always home (5+ hrs)', value: 5, capacityLevel: 5 }
        ],
        required: true
      }
    ]
  },
  {
    id: 'step_care',
    title: 'Food & Grooming Bandwidth',
    description: 'Your tolerance for shedding, salon maintenance, and diet preparation.',
    icon: 'Sparkles',
    questions: [
      {
        id: 'grooming_capacity',
        text: 'What level of coat grooming and shedding are you comfortable managing?',
        type: 'capacity',
        options: [
          { label: 'Zero shedding / low maintenance only', value: 1, capacityLevel: 1 },
          { label: 'Occasional brush-out (once a week)', value: 2, capacityLevel: 2 },
          { label: 'Moderate coat care (2-3 times/week brushing)', value: 3, capacityLevel: 3 },
          { label: 'High grooming (daily combing, regular de-matting)', value: 4, capacityLevel: 4 },
          { label: 'Deluxe coat upkeep (frequent professional salon grooming)', value: 5, capacityLevel: 5 }
        ],
        required: true
      },
      {
        id: 'feeding_capacity',
        text: 'What is your bandwidth for feeding and culinary routines?',
        type: 'capacity',
        options: [
          { label: 'Ultra simple (dry kibble or pre-packaged meals)', value: 1, capacityLevel: 1 },
          { label: 'Standard kibble plus occasional eggs/broth', value: 2, capacityLevel: 2 },
          { label: 'Cooked fresh meals (rice, boiled chicken/paneer, veggies)', value: 3, capacityLevel: 3 },
          { label: 'Dedicated balanced home-cooked pet nutrition', value: 4, capacityLevel: 4 },
          { label: 'Strict specialized veterinary or raw diet regimen', value: 5, capacityLevel: 5 }
        ],
        required: true
      }
    ]
  },
  {
    id: 'step_city',
    title: 'City & Indian Climate',
    description: 'Your city location and climate environment.',
    icon: 'MapPin',
    questions: [
      {
        id: 'city',
        text: 'Which city do you reside in?',
        type: 'select',
        options: [
          { label: 'Mumbai (Hot-Humid, coastal)', value: 'Mumbai', meta: { climate: 'hot-humid' } },
          { label: 'Delhi NCR (Composite, extreme summer & winter)', value: 'Delhi', meta: { climate: 'composite' } },
          { label: 'Bengaluru (Composite, moderate plateau)', value: 'Bengaluru', meta: { climate: 'composite' } },
          { label: 'Pune (Composite, pleasant/warm)', value: 'Pune', meta: { climate: 'composite' } },
          { label: 'Chennai (Hot-Humid, tropical)', value: 'Chennai', meta: { climate: 'hot-humid' } },
          { label: 'Hyderabad (Hot-Dry, warm Deccan)', value: 'Hyderabad', meta: { climate: 'hot-dry' } },
          { label: 'Kolkata (Hot-Humid, eastern tropical)', value: 'Kolkata', meta: { climate: 'hot-humid' } },
          { label: 'Ahmedabad (Hot-Dry, arid summer)', value: 'Ahmedabad', meta: { climate: 'hot-dry' } }
        ],
        required: true
      }
    ]
  },
  {
    id: 'step_budget',
    title: 'Monthly Pet Budget (INR)',
    description: 'Your monthly financial comfort zone for food, healthcare, and preventive meds.',
    icon: 'IndianRupee',
    questions: [
      {
        id: 'monthly_budget_inr',
        text: 'What is your comfortable monthly budget for recurring pet expenses (INR)?',
        type: 'number',
        placeholder: 'e.g. 4000',
        helpText: 'Includes quality food, anti-tick/flea preventives, routine vet checkups, and treats.',
        min: 800,
        max: 30000,
        defaultValue: 4000,
        required: true
      }
    ]
  },
  {
    id: 'step_experience',
    title: 'Pet Parenting Experience',
    description: 'Your past experience with animal handling and positive reinforcement.',
    icon: 'Award',
    questions: [
      {
        id: 'experience_capacity',
        text: 'What is your pet parenting background?',
        type: 'capacity',
        options: [
          { label: 'Complete first-timer, never had a pet', value: 1, capacityLevel: 1 },
          { label: 'Had a family pet as a child, but never primary caretaker', value: 2, capacityLevel: 2 },
          { label: 'Have fostered or cared for friends’ pets temporarily', value: 3, capacityLevel: 3 },
          { label: 'Experienced pet parent who managed training & vet visits', value: 4, capacityLevel: 4 },
          { label: 'Advanced / rescuer / multi-pet handler', value: 5, capacityLevel: 5 }
        ],
        required: true
      }
    ]
  },
  {
    id: 'step_household',
    title: 'Household, Kids & Allergies',
    description: 'Family members, children, allergies, and household consensus.',
    icon: 'Users',
    questions: [
      {
        id: 'household_capacity',
        text: 'How calm and supportive is your household environment for a pet?',
        type: 'capacity',
        options: [
          { label: 'Very busy / noisy / unpredictable routine', value: 1, capacityLevel: 1 },
          { label: 'Moderate activity with visiting guests', value: 2, capacityLevel: 2 },
          { label: 'Balanced household with structured daily routines', value: 3, capacityLevel: 3 },
          { label: 'Calm, patient environment with dedicated animal lovers', value: 4, capacityLevel: 4 },
          { label: 'Ideal pet haven with spacious quiet zones and full support', value: 5, capacityLevel: 5 }
        ],
        required: true
      },
      {
        id: 'has_pet_allergy',
        text: 'Does anyone living in your home have known pet-dander allergies?',
        type: 'boolean',
        options: [
          { label: 'No known pet allergies', value: false },
          { label: 'Yes, someone has dander/fur allergies', value: true }
        ],
        required: true
      },
      {
        id: 'has_kids_under_5',
        text: 'Are there toddlers or children under 5 years old in the house?',
        type: 'boolean',
        options: [
          { label: 'No children under 5', value: false },
          { label: 'Yes, we have a baby or toddler', value: true }
        ],
        required: true
      },
      {
        id: 'youngest_kid_age',
        text: 'Age of the youngest child in home (if any):',
        type: 'number',
        placeholder: 'e.g. 4',
        min: 0,
        max: 18,
        defaultValue: 10,
        required: false
      },
      {
        id: 'family_agreement',
        text: 'Are all family members or roommates 100% on board with adopting a pet?',
        type: 'select',
        options: [
          { label: 'Yes, all members are enthusiastic and united', value: 'all_enthusiastic' },
          { label: 'Majority agreed, some neutral', value: 'majority_positive' },
          { label: 'One person is hesitant or nervous', value: 'one_hesitant' },
          { label: 'Someone is strictly opposed', value: 'opposed' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'step_commitment',
    title: '10-15 Year Commitment Horizon',
    description: 'Pet adoption is a decade-long companionship. Testing your long-term roadmap.',
    icon: 'HeartHandshake',
    questions: [
      {
        id: 'horizon_relocation',
        text: 'If your career or studies require moving to another city or abroad in 5-10 years:',
        type: 'select',
        options: [
          { label: 'My pet will always come with me wherever I move', value: 'take_pet' },
          { label: 'I will try, but depends on apartment rules and pet policies', value: 'temporary_foster' },
          { label: 'Might have to leave with parents or rehome', value: 'leave_behind' }
        ],
        required: true
      },
      {
        id: 'horizon_milestones',
        text: 'When facing major life milestones (marriage, children, career shifts):',
        type: 'select',
        options: [
          { label: 'Pet is an inseparable family member through all milestones', value: 'non_negotiable' },
          { label: 'I will balance pet care with family adjustments', value: 'will_manage' },
          { label: 'Unsure how new family members might react', value: 'unsure' }
        ],
        required: true
      },
      {
        id: 'has_emergency_vet_fund',
        text: 'Do you have emergency savings set aside for unforeseen veterinary hospitalization?',
        type: 'select',
        options: [
          { label: 'Yes, dedicated fund of ₹20,000+ or pet insurance', value: 'yes_savings' },
          { label: 'Can manage from regular monthly salary/credit', value: 'credit_or_salary' },
          { label: 'Limited cushion, might struggle with large vet bills', value: 'limited_cushion' },
          { label: 'No emergency buffer currently', value: 'none' }
        ],
        required: true
      }
    ]
  }
];

// Rich Content for 22 Pets in MongoDB PetContent
export const PET_RICH_CONTENT = [
  {
    petSlug: 'indian-pariah-dog',
    tagline: 'India’s native ancient companion: intelligent, naturally immune, and born for our climate.',
    about: 'The Indian Pariah Dog (Indie) is an indigenous landrace canine refined by thousands of years of natural selection across the Indian subcontinent. Unlike inbred foreign breeds, Indies possess extraordinary vigor, razor-sharp instincts, and deeply affectionate loyalty.',
    historyAndOrigin: 'Depicted in ancient Indian cave art and epics including the Mahabharata, the Indie dog evolved without human genetic intervention. They are recognized worldwide by kennel cynologists as one of the purest, hardiest primitive breeds on Earth.',
    temperamentOverview: 'Intelligent, alert, self-cleaning, and fiercely protective of their family. Highly empathetic and responsive to household emotions without demanding constant hyper-stimulation.',
    commonHealthIssues: [
      'Virtually free from hereditary genetic diseases (unlike hip dysplasia in Labradors or breathing distress in Pugs)',
      'Requires standard rabies and DHPPiL vaccinations',
      'Occasional seasonal tick-fever risk preventable with routine oral preventives'
    ],
    climateCareGuide: 'Unmatched heat resistance. Can relax comfortably in Indian tropical warmth with shade and water, rarely needing artificial air-conditioning.',
    mythsAndFacts: [
      {
        myth: 'Indies are aggressive street dogs that cannot adapt to flats.',
        fact: 'Indies are naturally calm indoor sleepers who respect apartment boundaries and house-train faster than most imported breeds.'
      },
      {
        myth: 'They need raw meat and are dirty.',
        fact: 'Indies groom themselves like cats, have zero foul doggy odor, and thrive on simple balanced home meals and kibble.'
      }
    ],
    careGuide: {
      exerciseTips: 'Two 30-minute walks daily plus mental stimulation games (sniff walks, puzzle toys).',
      nutritionGuide: 'Thrives on a balanced mix of quality kibble, cooked chicken, eggs, rice, and carrots. Avoid toxic foods like onions and chocolate.',
      groomingGuide: 'Extremely easy. Single short coat needs brushing once every 10 days and a bath once a month.',
      trainingTips: 'Extremely smart. Responds wonderfully to force-free, positive reinforcement with treats. Harsh punishment will make them shy.'
    },
    images: [
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    petSlug: 'indian-indie-cat',
    tagline: 'Quiet, agile, and independent: the ultimate stress-free urban apartment pet.',
    about: 'The Indian Indie Cat (Desi Billi) is India’s natural domestic feline. Highly athletic, playful, and affectionate, they adapt effortlessly to modern Indian apartments.',
    historyAndOrigin: 'Native to South Asia for millennia, celebrated in folk tales and revered in households for keeping premises free of pests.',
    temperamentOverview: 'Independent, gentle, curious, and purr-filled. Perfect for working professionals since they sleep 14-16 hours a day and use the litter box instinctively.',
    commonHealthIssues: [
      'Extremely hardy immune system',
      'Needs core Tricat (FVRCP) and Anti-Rabies vaccinations',
      'Requires net-protected balconies to prevent High-Rise Syndrome falls'
    ],
    climateCareGuide: 'Thrives in warm Indian temperatures. Enjoys sunny patches and requires no special climate equipment.',
    mythsAndFacts: [
      {
        myth: 'Black or indie cats bring bad luck.',
        fact: 'Indie cats bring immense joy, lowered blood pressure, and loving companionship to millions of Indian homes.'
      },
      {
        myth: 'Cats cannot be affectionate like dogs.',
        fact: 'Indie cats form deep bonds with their caregivers, waiting by the door and sleeping at the foot of your bed.'
      }
    ],
    careGuide: {
      exerciseTips: 'Laser pointers, feather wands, and vertical cat scratchers provide ample workout.',
      nutritionGuide: 'High-protein wet and dry cat food. Always provide multiple clean water bowls.',
      groomingGuide: 'Self-grooming masters. Brushing once a week is plenty.',
      trainingTips: 'Instinctively uses clay or bentonite litter boxes from 4 weeks of age. Reward with creamy cat treats.'
    },
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    petSlug: 'siberian-husky',
    tagline: 'Arctic working dog: requires round-the-clock AC, high exercise, and experienced handling.',
    about: 'Siberian Huskies are magnificent sled dogs bred for sub-zero Siberian tundras. In tropical India, their thick double coat causes severe heat exhaustion unless kept in continuous air-conditioning.',
    historyAndOrigin: 'Bred by the Chukchi people of northeastern Asia for pulling sleds over vast frozen distances.',
    temperamentOverview: 'High energy, dramatic, vocal howl, strong prey drive. Prone to severe destructive separation anxiety if left idle.',
    commonHealthIssues: [
      'Heat distress and dehydration in Indian summers',
      'Severe skin infections and fungal eczema in humid coastal cities',
      'Hip dysplasia and progressive retinal atrophy'
    ],
    climateCareGuide: 'Requires continuous air-conditioning during Indian summers. Never shave their double coat as it destroys heat insulation.',
    mythsAndFacts: [
      {
        myth: 'A Husky will adapt to Indian heat just fine if given ice cubes.',
        fact: 'Husky bodies are biologically built for -40°C. In 40°C Mumbai or Delhi heat, they suffer chronic heat stress and lethargy.'
      }
    ],
    careGuide: {
      exerciseTips: '90+ minutes daily in early mornings before the sun rises or late at night.',
      nutritionGuide: 'High-protein performance diet.',
      groomingGuide: 'Heavy shedding twice a year with endless blowing coat. Daily high-velocity blow-outs.',
      trainingTips: 'Strong-willed and escape artists. High fence yards and firm leash handling required.'
    },
    images: [
      'https://images.unsplash.com/photo-1589941013453-ec89f33b5455?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    petSlug: 'labrador-retriever',
    tagline: 'Affectionate and eager to please: family favorite with high appetite and energy.',
    about: 'Labradors are one of India’s most common breeds due to their patient, gentle demeanor. However, they need strict portion control to avoid obesity and daily exercise to prevent destructive chewing in flats.',
    historyAndOrigin: 'Bred as fishing and retrieving dogs in Newfoundland, Canada.',
    temperamentOverview: 'Friendly, outgoing, highly food-motivated, patient with children.',
    commonHealthIssues: ['Prone to obesity', 'Hip and elbow dysplasia', 'Ear infections in humid weather'],
    climateCareGuide: 'Needs cool tiled resting spaces and shade during peak Indian summer afternoons.',
    mythsAndFacts: [
      {
        myth: 'Labradors are naturally calm and need no exercise.',
        fact: 'Young Labradors are energetic dynamos who need 60 minutes of daily play and walks.'
      }
    ],
    careGuide: {
      exerciseTips: 'Daily walks and fetch games.',
      nutritionGuide: 'Strict calorie monitoring. Prone to overeating.',
      groomingGuide: 'Moderate shedding. Weekly brushing with a de-shedding tool.',
      trainingTips: 'Exceptionally trainable with treat-based positive reinforcement.'
    },
    images: ['https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=800&auto=format&fit=crop&q=80']
  },
  {
    petSlug: 'rajapalayam',
    tagline: 'The royal Indian sight hound: majestic, alert, and natively adapted to southern heat.',
    about: 'Named after the town of Rajapalayam in Tamil Nadu, this noble white hound was historically bred by Nayakar royalty for hunting and estate guarding.',
    historyAndOrigin: 'Native to Tamil Nadu. Fought alongside Indian rulers including Tipu Sultan and Polygar chieftains against the British.',
    temperamentOverview: 'Regal, aloof with strangers, deeply loyal to one family. Naturally protective and vigilant.',
    commonHealthIssues: ['Occasional congenital deafness in pure white bloodlines', 'Skin sensitivity to harsh chemical shampoos'],
    climateCareGuide: 'Supreme heat tolerance. Flourishes in southern Indian tropical weather without any need for AC.',
    mythsAndFacts: [
      {
        myth: 'Native hounds are ferocious and cannot live in flats.',
        fact: 'Rajapalayams are quiet "couch potatoes" indoors when given one brisk daily walk.'
      }
    ],
    careGuide: {
      exerciseTips: '45-60 minutes daily walks or open ground runs.',
      nutritionGuide: 'High protein cooked chicken, rice, eggs, and milk/curd.',
      groomingGuide: 'Single coat with zero dematting needs. Easy wash and dry.',
      trainingTips: 'Needs early puppy socialization with new people.'
    },
    images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&auto=format&fit=crop&q=80']
  }
];

// Fallback FAQs for Keyword Advisor when Gemini key is missing or rate limited
export const FAQ_ITEMS = [
  {
    category: 'indie_vs_pedigree',
    keywords: ['indie', 'pariah', 'desi', 'street', 'purebred', 'pedigree', 'buy', 'breeder'],
    question: 'Why should I choose an Indian Indie dog or cat over buying a foreign breed?',
    answer: 'Indian Indie dogs and cats have evolved over millennia in South Asia. They have superior natural immunity to tropical parasites, virtually zero genetic disorders like hip dysplasia or brachycephalic airway distress, and thrive in Indian summer climates without requiring 24/7 air-conditioning. Choosing an Indie also stops commercial puppy mills and saves a life from urban streets.'
  },
  {
    category: 'apartment_living',
    keywords: ['flat', 'apartment', 'society', 'rwa', 'balcony', 'space', 'small'],
    question: 'Can large dogs or Indies live comfortably in small apartments?',
    answer: 'Yes! A dog indoor behavior depends far more on daily physical and mental exercise than house square footage. An Indie dog walked 45 minutes twice daily will peacefully snooze indoors. Remember to net-proof balconies with pigeon netting for safety, and note that under Animal Welfare Board of India (AWBI) guidelines, housing societies cannot legally ban pets.'
  },
  {
    category: 'diet_and_food',
    keywords: ['food', 'diet', 'kibble', 'chicken', 'rice', 'vegetarian', 'feeding'],
    question: 'What is the best daily diet for an Indie dog in India?',
    answer: 'A healthy diet combines high-quality protein (boiled chicken or eggs), brown or white rice, pumpkin/carrots, and balanced veterinary-approved kibble. Do NOT feed dogs onions, garlic, grapes, raisins, cooked poultry bones, or chocolate. Dogs are omnivores but need essential animal protein and amino acids like taurine for healthy heart function.'
  },
  {
    category: 'emergency_and_vet',
    keywords: ['vet', 'emergency', 'vomiting', 'diarrhea', 'hospital', 'tick', 'fever'],
    question: 'What should I do if my pet has a medical emergency or fever?',
    answer: 'Disclaimer: PawMatch AI does NOT provide veterinary medical diagnoses. If your pet exhibits pale gums, bloody diarrhea, sudden lethargy, continuous vomiting, or suspected heatstroke, visit a licensed 24x7 animal hospital immediately. In Indian cities, look up BSPCA (Mumbai), Friendicoes (Delhi), or Cessna Lifeline (Bengaluru).'
  },
  {
    category: 'costs',
    keywords: ['cost', 'expense', 'budget', 'price', 'monthly', 'money', 'afford'],
    question: 'How much does it realistically cost to maintain a pet in an Indian metro per month?',
    answer: 'An Indian Indie dog costs approximately ₹2,500 - ₹3,500/month for food, anti-tick preventives, and routine vet care. Imported large breeds like Golden Retrievers or Huskies cost ₹5,000 - ₹9,000+/month due to heavy food intake, grooming salons, and higher medical vulnerabilities. Indie cats cost around ₹1,800 - ₹2,500/month.'
  }
];

export const ONBOARDING_DOG_PLAN = {
  species: 'dog',
  rule333: {
    day1to3: [
      'Decompression Phase: Pet feels overwhelmed and may hide, pace, or refuse to eat.',
      'Set up a quiet, safe sleeping corner away from noisy hallways and television.',
      'Do not invite guests or throw a welcoming party; give them space to adjust.',
      'Take them out to the designated potty zone on a secure leash on a regular schedule.'
    ],
    week1to3: [
      'Routine Phase: Pet begins to realize this might be their forever home.',
      'Establish fixed meal times, walking hours, and bedtime cues.',
      'Begin gentle, positive reinforcement for basic cues (Name response, Sit, Come).',
      'Schedule a routine wellness checkup and vaccination verification with your local vet.'
    ],
    month1to3: [
      'Settling In Phase: Pet feels safe, builds trust, and reveals their true personality.',
      'Deepen bonding through interactive play and exploring new walking paths.',
      'Continue consistent house training and reward calm home behavior.'
    ]
  },
  petProofingChecklist: [
    { id: 'chk_d1', category: 'Safety', label: 'Net-proof all balconies and open window grills', description: 'Install sturdy nylon pigeon netting across all high-rise openings.' },
    { id: 'chk_d2', category: 'Safety', label: 'Tuck away electrical cords and mobile chargers', description: 'Chewing wires causes lethal electric shock, especially for teething pups.' },
    { id: 'chk_d3', category: 'Toxins', label: 'Store human medicines, phenyl & detergents in high locked cupboards', description: 'Paracetamol, ibuprofen, and floor cleaners are deadly toxic to dogs.' },
    { id: 'chk_d4', category: 'Kitchen', label: 'Trash bins must have heavy locking lids', description: 'Prevents ingestion of cooked chicken bones, onion scraps, or plastic wrapping.' },
    { id: 'chk_d5', category: 'Gear', label: 'Sturdy harness, 5-ft flat leash, and collar with contact tag', description: 'Do not use choke chains; Y-harnesses protect the trachea.' }
  ],
  firstVetVisitChecklist: [
    'Check existing vaccination booklet for Rabies and DHPPiL dates',
    'Deworming tablet administration based on accurate body weight',
    'Flea and tick spot-on or oral chewable preventive (e.g. Bravecto/Simparica)',
    'Ears, dental, and heart auscultation screening'
  ]
};

export const ONBOARDING_CAT_PLAN = {
  species: 'cat',
  rule333: {
    day1to3: [
      'Safe Room: Keep cat inside one quiet bedroom with litter box, food, and water.',
      'Allow cat to hide under bed or in closet without forcibly pulling them out.',
      'Sit quietly in the room talking softly so they get used to your scent and voice.'
    ],
    week1to3: [
      'Gradual Exploration: Leave bedroom door ajar so cat can explore the living room at their own pace.',
      'Set up horizontal and vertical scratching posts near resting areas.',
      'Scoop litter box at least once daily.'
    ],
    month1to3: [
      'Full Household Comfort: Cat claims territory, initiates cuddle sessions, and greets family.',
      'Establish a fixed playtime routine (15 mins before dinner works miracles).'
    ]
  },
  petProofingChecklist: [
    { id: 'chk_c1', category: 'Safety', label: 'Install balcony bird-netting and secure window screens', description: 'Cats jump for butterflies or birds and suffer high-rise falls without netting.' },
    { id: 'chk_c2', category: 'Toxins', label: 'Remove Lilies, Snake Plants, and toxic indoor flora', description: 'Lilies cause acute fatal kidney failure in cats even from licking pollen.' },
    { id: 'chk_c3', category: 'Sanitation', label: 'Keep litter box away from loud washing machines and food bowls', description: 'Cats require clean, quiet privacy to eliminate.' },
    { id: 'chk_c4', category: 'Objects', label: 'Hide sewing needles, threads, rubber bands, and hair ties', description: 'Linear foreign bodies get stuck in feline intestines requiring emergency surgery.' }
  ],
  firstVetVisitChecklist: [
    'Tricat (FVRCP) core feline vaccination verification',
    'Anti-Rabies vaccination booster',
    'Spot-on preventive for fleas, mites, and heartworm (e.g. Revolution/Bravecto Plus)',
    'Spay / neuter status check and microchipping'
  ]
};
