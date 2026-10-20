-- PawMatch India: PostgreSQL Migration 001
-- Tables for Users, Pets, Scoring Weights, Cities, Shelters, Animals, Vets, Assessments, Foster Trials, and Onboarding

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'adopter',
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pets (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  species VARCHAR(64) NOT NULL,
  breed VARCHAR(255) NOT NULL,
  is_native BOOLEAN NOT NULL DEFAULT FALSE,
  size VARCHAR(32) NOT NULL,
  adult_weight_kg NUMERIC(6, 2) NOT NULL,
  energy_level INT NOT NULL CHECK (energy_level BETWEEN 1 AND 5),
  space_demand INT NOT NULL CHECK (space_demand BETWEEN 1 AND 5),
  min_space_sqft INT NOT NULL,
  time_attention_demand INT NOT NULL CHECK (time_attention_demand BETWEEN 1 AND 5),
  grooming_demand INT NOT NULL CHECK (grooming_demand BETWEEN 1 AND 5),
  feeding_effort INT NOT NULL CHECK (feeding_effort BETWEEN 1 AND 5),
  max_alone_hours INT NOT NULL,
  requires_yard BOOLEAN NOT NULL DEFAULT FALSE,
  low_allergen BOOLEAN NOT NULL DEFAULT FALSE,
  kid_safe_min_age INT NOT NULL DEFAULT 0,
  heat_tolerance INT NOT NULL CHECK (heat_tolerance BETWEEN 1 AND 5),
  cold_tolerance INT NOT NULL CHECK (cold_tolerance BETWEEN 1 AND 5),
  coat_type VARCHAR(64) NOT NULL,
  apartment_friendly BOOLEAN NOT NULL DEFAULT TRUE,
  budget_band VARCHAR(32) NOT NULL,
  base_monthly_cost_inr INT NOT NULL,
  upfront_cost_inr INT NOT NULL,
  experience_level_required INT NOT NULL CHECK (experience_level_required BETWEEN 1 AND 5),
  household_fit INT NOT NULL CHECK (household_fit BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scoring_weights (
  dimension VARCHAR(64) PRIMARY KEY,
  weight INT NOT NULL,
  description VARCHAR(255),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cities (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  climate_zone VARCHAR(64) NOT NULL,
  cost_multiplier NUMERIC(4, 2) NOT NULL DEFAULT 1.00,
  vet_cost_multiplier NUMERIC(4, 2) NOT NULL DEFAULT 1.00,
  food_cost_multiplier NUMERIC(4, 2) NOT NULL DEFAULT 1.00
);

CREATE TABLE IF NOT EXISTS shelters (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(128) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(64) NOT NULL,
  email VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  description TEXT,
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS animals (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  species VARCHAR(64) NOT NULL,
  breed VARCHAR(255) NOT NULL,
  pet_id VARCHAR(64) REFERENCES pets(id) ON DELETE SET NULL,
  shelter_id VARCHAR(64) REFERENCES shelters(id) ON DELETE CASCADE,
  age_months INT NOT NULL,
  gender VARCHAR(16) NOT NULL,
  size VARCHAR(32) NOT NULL,
  vaccinated BOOLEAN DEFAULT TRUE,
  neutered BOOLEAN DEFAULT TRUE,
  description TEXT,
  photo_url TEXT,
  status VARCHAR(32) DEFAULT 'adoptable',
  city VARCHAR(128) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vets (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  clinic_name VARCHAR(255) NOT NULL,
  city VARCHAR(128) NOT NULL,
  area VARCHAR(128) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  emergency_24x7 BOOLEAN DEFAULT FALSE,
  address TEXT NOT NULL,
  rating NUMERIC(3, 1) DEFAULT 4.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assessments (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  guest_token VARCHAR(128),
  readiness_score INT NOT NULL,
  readiness_band VARCHAR(32) NOT NULL,
  answers_json TEXT NOT NULL,
  readiness_breakdown_json TEXT NOT NULL,
  top_pet_matches_json TEXT NOT NULL,
  excluded_pets_json TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS foster_trials (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  guest_token VARCHAR(128),
  animal_id VARCHAR(64) REFERENCES animals(id) ON DELETE SET NULL,
  pet_id VARCHAR(64) REFERENCES pets(id) ON DELETE SET NULL,
  trial_duration_days INT NOT NULL,
  status VARCHAR(32) DEFAULT 'planned',
  start_date DATE,
  end_date DATE,
  allergy_symptoms BOOLEAN,
  fit_rating INT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS onboarding_progress (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  species VARCHAR(64) NOT NULL,
  checklist_item_id VARCHAR(128) NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, checklist_item_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pets_species ON pets(species);
CREATE INDEX IF NOT EXISTS idx_pets_is_native ON pets(is_native);
CREATE INDEX IF NOT EXISTS idx_animals_city ON animals(city);
CREATE INDEX IF NOT EXISTS idx_animals_species ON animals(species);
CREATE INDEX IF NOT EXISTS idx_animals_status ON animals(status);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_guest_token ON assessments(guest_token);
CREATE INDEX IF NOT EXISTS idx_foster_trials_user_id ON foster_trials(user_id);
CREATE INDEX IF NOT EXISTS idx_vets_city ON vets(city);
