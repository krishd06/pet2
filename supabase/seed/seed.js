import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { importKaggleBreeds } from './importKaggleBreeds.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from server/.env, .env, or process.env
const rootEnvPath = path.resolve(__dirname, '../../.env');
const serverEnvPath = path.resolve(__dirname, '../../server/.env');

if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

function loadJson(relPath) {
  const fullPath = path.resolve(__dirname, relPath);
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
}

export async function runSupabaseSeed(options = {}) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    const errorMsg = 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in server/.env to run database seeding.';
    if (options.silent) {
      console.warn(`[Supabase Seed] ⚠️  ${errorMsg}`);
      return { success: false, error: errorMsg };
    }
    throw new Error(errorMsg);
  }

  console.log(`\n======================================================`);
  console.log(`🐾 PawMatch India: Supabase Seed Execution`);
  console.log(`Target: ${supabaseUrl}`);
  console.log(`======================================================\n`);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  // 1. Species Reference (dog, cat)
  console.log('1️⃣  Seeding Species (Dog, Cat)...');
  const speciesList = [
    { name: 'Dog', slug: 'dog' },
    { name: 'Cat', slug: 'cat' }
  ];
  const { data: speciesData, error: speciesErr } = await supabase
    .from('species')
    .upsert(speciesList, { onConflict: 'slug' })
    .select('id, slug');

  if (speciesErr) throw new Error(`Species seed error: ${speciesErr.message}`);

  const speciesMap = {};
  speciesData.forEach(s => {
    speciesMap[s.slug] = s.id;
  });

  // 2. Cities
  console.log('2️⃣  Seeding 12 Indian Cities across Tiers 1-3...');
  const citiesJson = loadJson('./cities.json');
  const { data: citiesData, error: citiesErr } = await supabase
    .from('cities')
    .upsert(citiesJson.cities, { onConflict: 'name' })
    .select('id, name');

  if (citiesErr) throw new Error(`Cities seed error: ${citiesErr.message}`);
  const cityMap = {};
  citiesData.forEach(c => {
    cityMap[c.name] = c.id;
  });

  // 3. Hand-Curated Breeds (15 Indian + 6 Cat types)
  console.log('3️⃣  Seeding Hand-Curated Indian Breeds & Cats (Clearly Marked Estimates)...');
  const breedsJson = loadJson('./breeds_curated.json');
  const breedRecords = breedsJson.breeds.map(b => {
    const { species_slug, ...rest } = b;
    return {
      ...rest,
      species_id: speciesMap[species_slug]
    };
  });

  const { data: breedsData, error: breedsErr } = await supabase
    .from('breeds')
    .upsert(breedRecords, { onConflict: 'slug' })
    .select('id, slug');

  if (breedsErr) throw new Error(`Breeds seed error: ${breedsErr.message}`);
  const breedMap = {};
  breedsData.forEach(b => {
    breedMap[b.slug] = b.id;
  });

  // 4. Kaggle Dog Breeds CSV Importer (idempotent, checks /data)
  console.log('4️⃣  Checking Kaggle Dog Breeds CSV dataset in /data...');
  await importKaggleBreeds(supabase, speciesMap['dog']);

  // 5. Health Conditions & Breed Links
  console.log('5️⃣  Seeding Health Conditions & Breed Predispositions...');
  const healthJson = loadJson('./health_conditions.json');
  const conditions = healthJson.health_conditions.map(h => ({
    name: h.name,
    description: h.description,
    severity: h.severity
  }));

  const { data: condData, error: condErr } = await supabase
    .from('health_conditions')
    .upsert(conditions, { onConflict: 'name' })
    .select('id, name');

  if (condErr) throw new Error(`Health conditions seed error: ${condErr.message}`);

  const condMap = {};
  condData.forEach(c => {
    condMap[c.name] = c.id;
  });

  const bhcLinks = [];
  for (const h of healthJson.health_conditions) {
    const conditionId = condMap[h.name];
    if (conditionId && h.breed_slugs) {
      for (const bSlug of h.breed_slugs) {
        if (breedMap[bSlug]) {
          bhcLinks.push({
            breed_id: breedMap[bSlug],
            condition_id: conditionId
          });
        }
      }
    }
  }

  if (bhcLinks.length > 0) {
    const { error: bhcErr } = await supabase
      .from('breed_health_conditions')
      .upsert(bhcLinks, { onConflict: 'breed_id,condition_id' });
    if (bhcErr) console.warn('Breed health links note:', bhcErr.message);
  }

  // 6. Cost Benchmarks
  console.log('6️⃣  Seeding India Cost Benchmarks across City Tiers...');
  const costsJson = loadJson('./cost_benchmarks.json');
  const costRecords = costsJson.cost_benchmarks.map(c => {
    const { species_slug, ...rest } = c;
    return {
      ...rest,
      species_id: speciesMap[species_slug]
    };
  });

  const { error: costErr } = await supabase
    .from('cost_benchmarks')
    .upsert(costRecords, { onConflict: 'id' });
  if (costErr) console.warn('Cost benchmarks note:', costErr.message);

  // 7. Vaccination Schedules
  console.log('7️⃣  Seeding Dog & Cat Vaccination Schedules...');
  const vaxJson = loadJson('./vaccination_schedules.json');
  const vaxRecords = vaxJson.vaccination_schedules.map(v => {
    const { species_slug, ...rest } = v;
    return {
      ...rest,
      species_id: speciesMap[species_slug]
    };
  });

  const { error: vaxErr } = await supabase
    .from('vaccination_schedules')
    .upsert(vaxRecords, { onConflict: 'id' });
  if (vaxErr) console.warn('Vaccination schedules note:', vaxErr.message);

  // 8. First 30 Days Tasks
  console.log('8️⃣  Seeding First 30 Days Onboarding Tasks...');
  const tasksJson = loadJson('./first_30_days_tasks.json');
  const taskRecords = tasksJson.tasks.map(t => {
    const { species_slug, ...rest } = t;
    return {
      ...rest,
      species_id: speciesMap[species_slug]
    };
  });

  const { error: taskErr } = await supabase
    .from('first_30_days_tasks')
    .upsert(taskRecords, { onConflict: 'id' });
  if (taskErr) console.warn('First 30 days tasks note:', taskErr.message);

  // 9. Quiz Questions & Options with trait_weights & filters
  console.log('9️⃣  Seeding Quiz Questions & Options with Trait Weights & Filters...');
  const quizJson = loadJson('./quiz_data.json');
  for (const q of quizJson.questions) {
    const { options, ...qData } = q;
    const { data: insertedQ, error: qErr } = await supabase
      .from('quiz_questions')
      .upsert([qData], { onConflict: 'id' })
      .select('id')
      .single();

    if (!qErr && insertedQ && options) {
      const optionRecords = options.map(opt => ({
        question_id: insertedQ.id,
        label: opt.label,
        value: opt.value,
        trait_weights: opt.trait_weights || {},
        filters: opt.filters || {}
      }));
      await supabase.from('quiz_options').upsert(optionRecords, { onConflict: 'id' });
    }
  }

  // 10. Partners (10 placeholder partners)
  console.log('🔟  Seeding 10 Pet Ecosystem Partners...');
  const partnersJson = loadJson('./partners.json');
  const partnerRecords = partnersJson.partners.map(p => {
    const { city_name, ...rest } = p;
    return {
      ...rest,
      city_id: cityMap[city_name] || null
    };
  });
  const { error: partErr } = await supabase
    .from('partners')
    .upsert(partnerRecords, { onConflict: 'id' });
  if (partErr) console.warn('Partners note:', partErr.message);

  // 11. Service Providers (10 placeholder providers)
  console.log('1️⃣1️⃣ Seeding 10 Verified Service Providers (Vets, Trainers, Groomers, Sitters)...');
  const spJson = loadJson('./service_providers.json');
  const spRecords = spJson.service_providers.map(sp => {
    const { city_name, ...rest } = sp;
    return {
      ...rest,
      city_id: cityMap[city_name] || Object.values(cityMap)[0]
    };
  });
  const { error: spErr } = await supabase
    .from('service_providers')
    .upsert(spRecords, { onConflict: 'id' });
  if (spErr) console.warn('Service providers note:', spErr.message);

  // 12. Shelter Outcome Stats
  console.log('1️⃣2️⃣ Seeding Shelter Outcome Statistics...');
  const statsJson = loadJson('./shelter_outcome_stats.json');
  const { error: statErr } = await supabase
    .from('shelter_outcome_stats')
    .upsert(statsJson.stats, { onConflict: 'id' });
  if (statErr) console.warn('Shelter outcome stats note:', statErr.message);

  // 13. Demo Shelters and Pets
  console.log('1️⃣3️⃣ Seeding Demo Shelters & 8 Adoptable Rescue Pets...');
  const demoJson = loadJson('./demo_shelters_and_pets.json');

  // Verify or retrieve a system/shelter profile owner
  const { data: existingProfiles } = await supabase
    .from('profiles')
    .select('id')
    .limit(1);

  let demoOwnerId = existingProfiles && existingProfiles[0] ? existingProfiles[0].id : null;

  if (!demoOwnerId) {
    // If no auth user exists yet, fetch or wait for first user
    console.log('     ℹ️  No existing profile found. Demo shelter records will link once a user registers.');
  }

  if (demoOwnerId) {
    for (const sh of demoJson.shelters) {
      const cityId = cityMap[sh.city_name] || Object.values(cityMap)[0];
      const { data: insertedShelter, error: shErr } = await supabase
        .from('shelters')
        .upsert([
          {
            owner_id: demoOwnerId,
            name: sh.name,
            city_id: cityId,
            contact_email: sh.contact_email,
            contact_phone: sh.contact_phone,
            description: sh.description,
            is_verified: sh.is_verified,
            plan: sh.plan
          }
        ], { onConflict: 'id' })
        .select('id')
        .single();

      if (!shErr && insertedShelter) {
        const matchingPets = demoJson.pets.filter(p => p.shelter_id === sh.id);
        const petInserts = matchingPets.map(p => ({
          shelter_id: insertedShelter.id,
          species_id: speciesMap[p.species_slug],
          breed_id: breedMap[p.breed_slug] || null,
          name: p.name,
          age_months: p.age_months,
          sex: p.sex,
          size_category: p.size_category,
          temperament_tags: p.temperament_tags,
          medical_notes: p.medical_notes,
          is_vaccinated: p.is_vaccinated,
          is_neutered: p.is_neutered,
          photo_urls: p.photo_urls,
          status: p.status,
          is_featured: p.is_featured
        }));

        await supabase.from('pets').upsert(petInserts, { onConflict: 'id' });
      }
    }
  }

  console.log('\n======================================================');
  console.log('🎉 PawMatch India Database Seeding Completed Successfully!');
  console.log('======================================================\n');
  return { success: true };
}

// Allow direct CLI execution: node supabase/seed/seed.js
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  runSupabaseSeed().catch(err => {
    console.error('\n❌ Seeding failed:', err.message);
    process.exit(1);
  });
}
