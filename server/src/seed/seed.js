import { getDb, inMemoryDB } from '../db/index.js';
import { connectMongo, inMemoryMongoStores } from '../db/mongo.js';
import { runMigrations } from '../db/migrate.js';
import {
  DEMO_USERS,
  CITIES,
  SCORING_WEIGHTS,
  PETS,
  SHELTERS,
  ANIMALS,
  VETS,
  QUESTIONNAIRE_STEPS,
  PET_RICH_CONTENT,
  FAQ_ITEMS,
  ONBOARDING_DOG_PLAN,
  ONBOARDING_CAT_PLAN
} from './seedData.js';
import {
  PetContent,
  QuestionnaireDefinition,
  ExplanationTemplates,
  RemediationTemplates,
  OnboardingGuides,
  FaqItems
} from '../models/index.js';
import { DEFAULT_EXPLANATION_TEMPLATES } from '../engine/explanations.js';
import { DEFAULT_REMEDIATION_CATALOG } from '../engine/remediation.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

export async function seedAll() {
  console.log('--- Starting PawMatch India Database Seeding ---');

  // Step 1: Run SQL migrations
  await runMigrations();
  const db = getDb();

  // Step 2: Seed PostgreSQL / In-Memory SQL
  console.log('Seeding SQL tables...');

  // 1. Users
  for (const user of DEMO_USERS) {
    if (db.isMock) {
      const idx = inMemoryDB.tables.users.findIndex(u => u.email === user.email);
      if (idx >= 0) inMemoryDB.tables.users[idx] = user;
      else inMemoryDB.tables.users.push(user);
    } else {
      await db.query(`
        INSERT INTO users (id, email, password_hash, role, name)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO UPDATE SET
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role,
          name = EXCLUDED.name,
          updated_at = CURRENT_TIMESTAMP
      `, [user.id, user.email, user.password_hash, user.role, user.name]);
    }
  }

  // 2. Cities
  for (const city of CITIES) {
    if (db.isMock) {
      const idx = inMemoryDB.tables.cities.findIndex(c => c.id === city.id);
      if (idx >= 0) inMemoryDB.tables.cities[idx] = city;
      else inMemoryDB.tables.cities.push(city);
    } else {
      await db.query(`
        INSERT INTO cities (id, name, climate_zone, cost_multiplier, vet_cost_multiplier, food_cost_multiplier)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          climate_zone = EXCLUDED.climate_zone,
          cost_multiplier = EXCLUDED.cost_multiplier,
          vet_cost_multiplier = EXCLUDED.vet_cost_multiplier,
          food_cost_multiplier = EXCLUDED.food_cost_multiplier
      `, [city.id, city.name, city.climate_zone, city.cost_multiplier, city.vet_cost_multiplier, city.food_cost_multiplier]);
    }
  }

  // 3. Scoring Weights
  for (const sw of SCORING_WEIGHTS) {
    if (db.isMock) {
      const idx = inMemoryDB.tables.scoring_weights.findIndex(s => s.dimension === sw.dimension);
      if (idx >= 0) inMemoryDB.tables.scoring_weights[idx] = sw;
      else inMemoryDB.tables.scoring_weights.push(sw);
    } else {
      await db.query(`
        INSERT INTO scoring_weights (dimension, weight, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (dimension) DO UPDATE SET
          weight = EXCLUDED.weight,
          description = EXCLUDED.description,
          updated_at = CURRENT_TIMESTAMP
      `, [sw.dimension, sw.weight, sw.description]);
    }
  }

  // 4. Pets (22 profiles)
  for (const p of PETS) {
    if (db.isMock) {
      const idx = inMemoryDB.tables.pets.findIndex(item => item.id === p.id);
      if (idx >= 0) inMemoryDB.tables.pets[idx] = p;
      else inMemoryDB.tables.pets.push(p);
    } else {
      await db.query(`
        INSERT INTO pets (
          id, slug, name, species, breed, is_native, size, adult_weight_kg,
          energy_level, space_demand, min_space_sqft, time_attention_demand,
          grooming_demand, feeding_effort, max_alone_hours, requires_yard,
          low_allergen, kid_safe_min_age, heat_tolerance, cold_tolerance,
          coat_type, apartment_friendly, budget_band, base_monthly_cost_inr,
          upfront_cost_inr, experience_level_required, household_fit
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12,
          $13, $14, $15, $16,
          $17, $18, $19, $20,
          $21, $22, $23, $24,
          $25, $26, $27
        )
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          name = EXCLUDED.name,
          species = EXCLUDED.species,
          breed = EXCLUDED.breed,
          is_native = EXCLUDED.is_native,
          size = EXCLUDED.size,
          adult_weight_kg = EXCLUDED.adult_weight_kg,
          energy_level = EXCLUDED.energy_level,
          space_demand = EXCLUDED.space_demand,
          min_space_sqft = EXCLUDED.min_space_sqft,
          time_attention_demand = EXCLUDED.time_attention_demand,
          grooming_demand = EXCLUDED.grooming_demand,
          feeding_effort = EXCLUDED.feeding_effort,
          max_alone_hours = EXCLUDED.max_alone_hours,
          requires_yard = EXCLUDED.requires_yard,
          low_allergen = EXCLUDED.low_allergen,
          kid_safe_min_age = EXCLUDED.kid_safe_min_age,
          heat_tolerance = EXCLUDED.heat_tolerance,
          cold_tolerance = EXCLUDED.cold_tolerance,
          coat_type = EXCLUDED.coat_type,
          apartment_friendly = EXCLUDED.apartment_friendly,
          budget_band = EXCLUDED.budget_band,
          base_monthly_cost_inr = EXCLUDED.base_monthly_cost_inr,
          upfront_cost_inr = EXCLUDED.upfront_cost_inr,
          experience_level_required = EXCLUDED.experience_level_required,
          household_fit = EXCLUDED.household_fit
      `, [
        p.id, p.slug, p.name, p.species, p.breed, p.is_native, p.size, p.adult_weight_kg,
        p.energy_level, p.space_demand, p.min_space_sqft, p.time_attention_demand,
        p.grooming_demand, p.feeding_effort, p.max_alone_hours, p.requires_yard,
        p.low_allergen, p.kid_safe_min_age, p.heat_tolerance, p.cold_tolerance,
        p.coat_type, p.apartment_friendly, p.budget_band, p.base_monthly_cost_inr,
        p.upfront_cost_inr, p.experience_level_required, p.household_fit
      ]);
    }
  }

  // 5. Shelters
  for (const sh of SHELTERS) {
    if (db.isMock) {
      const idx = inMemoryDB.tables.shelters.findIndex(s => s.id === sh.id);
      if (idx >= 0) inMemoryDB.tables.shelters[idx] = sh;
      else inMemoryDB.tables.shelters.push(sh);
    } else {
      await db.query(`
        INSERT INTO shelters (id, name, city, address, phone, email, website, description, verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          city = EXCLUDED.city,
          address = EXCLUDED.address,
          phone = EXCLUDED.phone,
          email = EXCLUDED.email,
          website = EXCLUDED.website,
          description = EXCLUDED.description
      `, [sh.id, sh.name, sh.city, sh.address, sh.phone, sh.email, sh.website, sh.description, sh.verified]);
    }
  }

  // 6. Animals
  for (const anim of ANIMALS) {
    if (db.isMock) {
      const idx = inMemoryDB.tables.animals.findIndex(a => a.id === anim.id);
      if (idx >= 0) inMemoryDB.tables.animals[idx] = anim;
      else inMemoryDB.tables.animals.push(anim);
    } else {
      await db.query(`
        INSERT INTO animals (
          id, name, species, breed, pet_id, shelter_id, age_months, gender, size,
          vaccinated, neutered, description, photo_url, status, city
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          species = EXCLUDED.species,
          breed = EXCLUDED.breed,
          pet_id = EXCLUDED.pet_id,
          shelter_id = EXCLUDED.shelter_id,
          age_months = EXCLUDED.age_months,
          gender = EXCLUDED.gender,
          size = EXCLUDED.size,
          vaccinated = EXCLUDED.vaccinated,
          neutered = EXCLUDED.neutered,
          description = EXCLUDED.description,
          photo_url = EXCLUDED.photo_url,
          status = EXCLUDED.status,
          city = EXCLUDED.city
      `, [
        anim.id, anim.name, anim.species, anim.breed, anim.pet_id, anim.shelter_id, anim.age_months, anim.gender, anim.size,
        anim.vaccinated, anim.neutered, anim.description, anim.photo_url, anim.status, anim.city
      ]);
    }
  }

  // 7. Vets
  for (const v of VETS) {
    if (db.isMock) {
      const idx = inMemoryDB.tables.vets.findIndex(item => item.id === v.id);
      if (idx >= 0) inMemoryDB.tables.vets[idx] = v;
      else inMemoryDB.tables.vets.push(v);
    } else {
      await db.query(`
        INSERT INTO vets (id, name, clinic_name, city, area, phone, emergency_24x7, address, rating)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          clinic_name = EXCLUDED.clinic_name,
          city = EXCLUDED.city,
          area = EXCLUDED.area,
          phone = EXCLUDED.phone,
          emergency_24x7 = EXCLUDED.emergency_24x7,
          address = EXCLUDED.address,
          rating = EXCLUDED.rating
      `, [v.id, v.name, v.clinic_name, v.city, v.area, v.phone, v.emergency_24x7, v.address, v.rating]);
    }
  }

  console.log(`SQL Seed complete: ${PETS.length} pets, ${CITIES.length} cities, ${SHELTERS.length} shelters, ${ANIMALS.length} animals, ${VETS.length} vets.`);

  // Step 3: Seed MongoDB / Mongoose collections
  console.log('Seeding MongoDB collections...');
  await connectMongo();

  // 1. Questionnaire Definition
  await QuestionnaireDefinition.deleteMany({});
  await QuestionnaireDefinition.create({
    version: 1,
    steps: QUESTIONNAIRE_STEPS
  });

  // 2. Explanation Templates
  await ExplanationTemplates.deleteMany({});
  for (const [dimension, tmpl] of Object.entries(DEFAULT_EXPLANATION_TEMPLATES)) {
    await ExplanationTemplates.create({
      dimension,
      matchTemplate: tmpl.match,
      frictionTemplate: tmpl.friction,
      okTemplate: tmpl.ok
    });
  }

  // 3. Remediation Templates
  await RemediationTemplates.deleteMany({});
  for (const [category, item] of Object.entries(DEFAULT_REMEDIATION_CATALOG)) {
    for (const action of item.actions) {
      await RemediationTemplates.create({
        category,
        issueTrigger: item.category,
        actionTitle: action.title,
        actionDescription: action.description,
        recommendedAlternative: action.alternative
      });
    }
  }

  // 4. Onboarding Guides
  await OnboardingGuides.deleteMany({});
  await OnboardingGuides.create(ONBOARDING_DOG_PLAN);
  await OnboardingGuides.create(ONBOARDING_CAT_PLAN);

  // 5. Faq Items
  await FaqItems.deleteMany({});
  await FaqItems.insertMany(FAQ_ITEMS);

  // 6. Pet Content
  await PetContent.deleteMany({});
  for (const pc of PET_RICH_CONTENT) {
    await PetContent.create(pc);
  }

  console.log('MongoDB Seed complete: Questionnaire, templates, onboarding plans, FAQs, and rich pet content!');
  return { success: true };
}

// Allow direct CLI invocation: node src/seed/seed.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedAll()
    .then(() => {
      console.log('Seeding finished successfully!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}
