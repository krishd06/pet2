import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  slugifyBreed,
  parseLifespan,
  parseDailyTime,
  parseLeftAlone,
  parseMonthlyCost,
  parseMoneyShorthand,
  parsePrice,
  parseRangeNumeric,
  parseExerciseMinutes,
  parseSize,
  parseCageSize,
  parseEnclosure,
  parseExoticVetNeeded,
  parseMinSpaceNeeded,
  parseLegalStatus,
  parseScore
} from './researchParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

export const SPECIES_DEFINITIONS = [
  { name: 'Dog', slug: 'dog' },
  { name: 'Cat', slug: 'cat' },
  { name: 'Rabbit', slug: 'rabbit' },
  { name: 'Guinea Pig', slug: 'guinea-pig' },
  { name: 'Hamster', slug: 'hamster' },
  { name: 'Exotic Mammal', slug: 'exotic-mammal' },
  { name: 'Bird', slug: 'bird' },
  { name: 'Fish', slug: 'fish' },
  { name: 'Reptile', slug: 'reptile' },
  { name: 'Turtle', slug: 'turtle' }
];

export const LAYER2_ALIAS_MAP = {
  Dog: {
    'Indie': 'Indie / Indian Pariah',
    'Labrador': 'Labrador Retriever',
    'Siberian Husky': 'Siberian Husky',
    'Beagle': 'Beagle',
    'Pug': 'Pug'
  },
  Cat: {
    'Dom. Shorthair': 'Domestic Shorthair (Indie)',
    'Persian': 'Persian'
  },
  Rabbit: {
    'Mini Lop': 'Mini Lop'
  },
  Bird: {
    'Budgerigar': 'Budgerigar (Budgie)',
    'Cockatiel': 'Cockatiel',
    'African Grey': 'African Grey Parrot'
  },
  Fish: {
    'Betta': 'Betta (Siamese Fighting)'
  },
  Turtle: {
    'Red-eared Slider': 'Red-eared Slider'
  },
  Reptile: {
    'Leopard Gecko': 'Leopard Gecko'
  }
};

export function normalizeNameForMatch(name) {
  if (!name) return '';
  let s = name.toLowerCase().trim();
  if (s.includes('retriever') && s.includes('labrador')) return 'labrador retriever';
  if (s.includes('german shepherd')) return 'german shepherd';
  if (s.includes('siberian huski') || s.includes('siberian husky')) return 'siberian husky';
  if (s.includes('doberman')) return 'doberman pinscher';
  if (s.includes('indie') || s.includes('indian pariah') || s.includes('desi')) return 'indian pariah';
  if (s.includes('domestic shorthair') || s.includes('desi billi') || s.includes('indie cat')) return 'domestic shorthair';

  s = s.replace(/[\(\)\[\],.\/\\-]/g, ' ').replace(/\s+/g, ' ').trim();
  if (s.endsWith('ies')) s = s.slice(0, -3) + 'y';
  else if (s.endsWith('es')) s = s.slice(0, -2);
  else if (s.endsWith('s') && !s.endsWith('ss')) s = s.slice(0, -1);
  return s.trim();
}

export function parseCsvPreservingHeaders(csvContent) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < csvContent.length; i++) {
    const char = csvContent[i];
    const nextChar = csvContent[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField.trim());
      if (currentRow.some(f => f.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(f => f.length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.trim());
  const data = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const obj = {};
    for (let c = 0; c < headers.length; c++) {
      obj[headers[c]] = row[c] !== undefined ? row[c] : '';
    }
    data.push(obj);
  }

  return { headers, data };
}

export function readCsvUtf8Sig(filepath) {
  if (!fs.existsSync(filepath)) {
    throw new Error(`CSV file not found: ${filepath}`);
  }
  let content = fs.readFileSync(filepath, 'utf-8');
  // Strip UTF-8 BOM if present
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return parseCsvPreservingHeaders(content);
}

export async function processOwnerResearch() {
  const dataDir = path.resolve(rootDir, 'data/user_data');

  const l1Path = path.join(dataDir, 'layer1_husbandry.csv');
  const l2MammalsPath = path.join(dataDir, 'layer2_mammals.csv');
  const l2BirdsPath = path.join(dataDir, 'layer2_birds.csv');
  const l2ArPath = path.join(dataDir, 'layer2_aquatic_reptile.csv');

  // Check existence
  for (const [name, p] of Object.entries({
    'layer1_husbandry.csv': l1Path,
    'layer2_mammals.csv': l2MammalsPath,
    'layer2_birds.csv': l2BirdsPath,
    'layer2_aquatic_reptile.csv': l2ArPath
  })) {
    if (!fs.existsSync(p)) {
      throw new Error(`Required input file is missing: ${name} at ${p}. Halting as requested.`);
    }
  }

  const l1Result = readCsvUtf8Sig(l1Path);
  const l2MammalsResult = readCsvUtf8Sig(l2MammalsPath);
  const l2BirdsResult = readCsvUtf8Sig(l2BirdsPath);
  const l2ArResult = readCsvUtf8Sig(l2ArPath);

  const l1Rows = l1Result.data;
  const l2MammalsRows = l2MammalsResult.data;
  const l2BirdsRows = l2BirdsResult.data;
  const l2ArRows = l2ArResult.data;

  // 1. Lossless cell verification
  let totalDataCells = 0;
  for (const r of l1Rows) totalDataCells += Object.keys(r).length;
  for (const r of l2MammalsRows) totalDataCells += Object.keys(r).length;
  for (const r of l2BirdsRows) totalDataCells += Object.keys(r).length;
  for (const r of l2ArRows) totalDataCells += Object.keys(r).length;

  const headerCells = 12 + 27 + 21 + 17; // 77
  const totalCellsWithHeaders = totalDataCells + headerCells;

  // 2. Pre-existing breeds check from seed/database
  const curatedBreedsPath = path.resolve(__dirname, 'breeds_curated.json');
  let existingBreeds = [];
  if (fs.existsSync(curatedBreedsPath)) {
    const raw = JSON.parse(fs.readFileSync(curatedBreedsPath, 'utf-8'));
    existingBreeds = raw.breeds || [];
  }

  const matchedBreeds = [];
  const nonMatchedBreeds = [];
  const possibleDuplicates = [];

  // Index existing breeds by species and normalized name
  const existingMap = new Map();
  for (const eb of existingBreeds) {
    const norm = normalizeNameForMatch(eb.name);
    existingMap.set(`${eb.species_slug || 'dog'}:::${norm}`, eb);
  }

  // 3. Layer 2 Indexing by (Species, Canonical Breed Name)
  const l2MammalMap = new Map();
  for (const row of l2MammalsRows) {
    const sp = row.Species || 'Dog';
    const alias = LAYER2_ALIAS_MAP[sp]?.[row.Breed] || row.Breed;
    if (!alias) {
      throw new Error(`[FAIL LOUDLY] Layer 2 mammal breed '${row.Breed}' has no mapping!`);
    }
    l2MammalMap.set(`${sp}:::${alias}`, row);
  }

  const l2BirdMap = new Map();
  for (const row of l2BirdsRows) {
    const sp = row.Species || 'Bird';
    const alias = LAYER2_ALIAS_MAP[sp]?.[row.Breed] || row.Breed;
    if (!alias) {
      throw new Error(`[FAIL LOUDLY] Layer 2 bird breed '${row.Breed}' has no mapping!`);
    }
    l2BirdMap.set(`${sp}:::${alias}`, row);
  }

  const l2ArMap = new Map();
  for (const row of l2ArRows) {
    const sp = row.Species || 'Fish';
    const alias = LAYER2_ALIAS_MAP[sp]?.[row.Breed] || row.Breed;
    if (!alias) {
      throw new Error(`[FAIL LOUDLY] Layer 2 aquatic/reptile breed '${row.Breed}' has no mapping!`);
    }
    l2ArMap.set(`${sp}:::${alias}`, row);
  }

  // 4. Parse Layer 1 and assemble database records
  const breedsToInsert = [];
  const husbandryRecords = [];
  const mammalDetailRecords = [];
  const birdDetailRecords = [];
  const arDetailRecords = [];
  const allParseWarnings = [];
  const unhandledColumnValues = [];
  const healthConditionsSet = new Set();
  const breedHealthLinks = [];
  const nonLegalStatusRows = [];
  const conflicts = [];

  const speciesCounts = {};

  for (const row of l1Rows) {
    const animal = row.Animal?.trim();
    const breedName = row.Breed?.trim();
    speciesCounts[animal] = (speciesCounts[animal] || 0) + 1;

    // Check pre-existing match for same species
    const speciesSlug = animal.toLowerCase().replace(/\s+/g, '-');
    const norm = normalizeNameForMatch(breedName);
    const existing = existingMap.get(`${speciesSlug}:::${norm}`);
    if (existing) {
      matchedBreeds.push({
        layer1_name: breedName,
        species: animal,
        existing_name: existing.name,
        existing_slug: existing.slug
      });
    } else {
      nonMatchedBreeds.push({ name: breedName, species: animal });
    }

    const breedSlug = slugifyBreed(breedName);
    const isIndianNative = (breedName === 'Indie / Indian Pariah' || breedName === 'Domestic Shorthair (Indie)');

    // Parse Lifespan
    const lifespanRes = parseLifespan(row.Lifespan);
    if (lifespanRes.warnings.length) allParseWarnings.push({ breed: breedName, field: 'Lifespan', warnings: lifespanRes.warnings });

    // Parse Daily Time
    const timeRes = parseDailyTime(row['Daily Time Needed']);
    if (timeRes.warnings.length) allParseWarnings.push({ breed: breedName, field: 'Daily Time Needed', warnings: timeRes.warnings });

    // Parse Min Space Needed
    const spaceRes = parseMinSpaceNeeded(row['Min Space Needed'], row['Legal Status in India']);
    if (spaceRes.warnings.length) allParseWarnings.push({ breed: breedName, field: 'Min Space Needed', warnings: spaceRes.warnings });

    // Parse Left Alone
    const leftRes = parseLeftAlone(row['Left Alone (hrs)']);
    if (leftRes.warnings.length) allParseWarnings.push({ breed: breedName, field: 'Left Alone (hrs)', warnings: leftRes.warnings });

    // Parse Monthly Cost
    const costRes = parseMonthlyCost(row['Monthly Cost (₹)']);
    if (costRes.warnings.length) allParseWarnings.push({ breed: breedName, field: 'Monthly Cost (₹)', warnings: costRes.warnings });

    // Parse Legal Status
    const legalRes = parseLegalStatus(row['Legal Status in India']);
    if (legalRes.warnings.length) allParseWarnings.push({ breed: breedName, field: 'Legal Status in India', warnings: legalRes.warnings });

    if (legalRes.legal_status !== 'legal') {
      nonLegalStatusRows.push({
        breed: breedName,
        legal_status: legalRes.legal_status,
        text: row['Legal Status in India']
      });
    }

    // Check integer fit for breeds.lifespan_min_years
    let breedsLifespanMin = null;
    let breedsLifespanMax = null;
    if (lifespanRes.lifespan_min_years !== null) {
      if (Number.isInteger(lifespanRes.lifespan_min_years)) {
        breedsLifespanMin = lifespanRes.lifespan_min_years;
      } else {
        unhandledColumnValues.push({
          table: 'breeds',
          column: 'lifespan_min_years',
          breed: breedName,
          value: lifespanRes.lifespan_min_years,
          reason: `Value ${lifespanRes.lifespan_min_years} is non-integer (decimal) while breeds.lifespan_min_years is smallint. Kept NULL in breeds; stored losslessly in breed_husbandry.lifespan_min_years numeric.`
        });
      }
    }
    if (lifespanRes.lifespan_max_years !== null && Number.isInteger(lifespanRes.lifespan_max_years)) {
      breedsLifespanMax = lifespanRes.lifespan_max_years;
    }

    // Check Layer 2 mammal augmentation
    const mammalRow = l2MammalMap.get(`${animal}:::${breedName}`);
    let mammalSize = 'medium';
    let weightMin = null;
    let weightMax = null;
    let heightMin = null;
    let heightMax = null;
    let originCountry = null;

    if (mammalRow) {
      originCountry = mammalRow.Origin;
      mammalSize = parseSize(mammalRow.Size) || 'medium';
      const wt = parseRangeNumeric(mammalRow['Wt(kg)']);
      weightMin = wt.min;
      weightMax = wt.max;
      const ht = parseRangeNumeric(mammalRow['Ht(cm)']);
      heightMin = ht.min;
      heightMax = ht.max;
    }

    // Breed record for `breeds` table
    breedsToInsert.push({
      species_slug: animal.toLowerCase().replace(/\s+/g, '-'),
      species_name: animal,
      name: breedName,
      slug: breedSlug,
      is_indian_native: isIndianNative,
      source: 'owner_research_v1',
      lifespan_min_years: breedsLifespanMin,
      lifespan_max_years: breedsLifespanMax,
      size_category: mammalSize,
      origin_country: originCountry,
      weight_min_kg: weightMin,
      weight_max_kg: weightMax,
      height_min_cm: heightMin,
      height_max_cm: heightMax
    });

    // Husbandry record for `breed_husbandry` table
    const warningsThisRow = [];
    if (lifespanRes.warnings.length) warningsThisRow.push(...lifespanRes.warnings);
    if (timeRes.warnings.length) warningsThisRow.push(...timeRes.warnings);
    if (spaceRes.warnings.length) warningsThisRow.push(...spaceRes.warnings);
    if (leftRes.warnings.length) warningsThisRow.push(...leftRes.warnings);
    if (costRes.warnings.length) warningsThisRow.push(...costRes.warnings);
    if (legalRes.warnings.length) warningsThisRow.push(...legalRes.warnings);

    husbandryRecords.push({
      breed_slug: breedSlug,
      breed_name: breedName,
      raw: row,
      parse_warnings: warningsThisRow,
      lifespan_text: row.Lifespan,
      lifespan_min_years: lifespanRes.lifespan_min_years,
      lifespan_max_years: lifespanRes.lifespan_max_years,
      lifespan_open_ended: lifespanRes.lifespan_open_ended,
      daily_time_text: row['Daily Time Needed'],
      daily_time_min_hours: timeRes.daily_time_min_hours,
      daily_time_max_hours: timeRes.daily_time_max_hours,
      daily_time_open_ended: timeRes.daily_time_open_ended,
      min_space_text: row['Min Space Needed'],
      space_class: spaceRes.space_class,
      min_space_gallons: spaceRes.min_space_gallons,
      min_space_sq_ft: spaceRes.min_space_sq_ft,
      min_space_sq_in: spaceRes.min_space_sq_in,
      vertical_space_needed: spaceRes.vertical_space_needed,
      ac_requirement: spaceRes.ac_requirement,
      noise_level: parseScore(row['Noise (1-5)']),
      apt_suitability: parseScore(row['Apt Suitability (1-5)']),
      kid_friendly: parseScore(row['Kid-Friendly (1-5)']),
      monthly_cost_text: row['Monthly Cost (₹)'],
      monthly_cost_min_inr: costRes.monthly_cost_min_inr,
      monthly_cost_max_inr: costRes.monthly_cost_max_inr,
      left_alone_text: row['Left Alone (hrs)'],
      left_alone_min_hours: leftRes.left_alone_min_hours,
      left_alone_max_hours: leftRes.left_alone_max_hours,
      left_alone_open_ended: leftRes.left_alone_open_ended,
      left_alone_note: leftRes.left_alone_note,
      exotic_vet_needed: parseExoticVetNeeded(row['Exotic Vet Needed?']),
      legal_status_text: row['Legal Status in India'],
      legal_status: legalRes.legal_status,
      requires_parivesh: legalRes.requires_parivesh,
      cites_appendix_ii: legalRes.cites_appendix_ii,
      requires_import_permit: legalRes.requires_import_permit
    });

    // Layer 2 Mammal Detail
    if (mammalRow) {
      const mWarnings = [];
      const mLife = parseLifespan(mammalRow.Lifespan);
      const mWt = parseRangeNumeric(mammalRow['Wt(kg)']);
      const mHt = parseRangeNumeric(mammalRow['Ht(cm)']);
      const mExer = parseExerciseMinutes(mammalRow['Exer(min)']);
      const mVet = parseMoneyShorthand(mammalRow['VetCost/Yr(₹)']);
      const mPrice = parsePrice(mammalRow['Price(₹)']);

      mWarnings.push(...mLife.warnings, ...mWt.warnings, ...mHt.warnings, ...mExer.warnings, ...mVet.warnings, ...mPrice.warnings);

      // Check conflicts with Layer 1
      if (row['Noise (1-5)'] !== mammalRow['Noise(1-5)']) {
        conflicts.push({ breed: breedName, dimension: 'noise', layer1: row['Noise (1-5)'], layer2: mammalRow['Noise(1-5)'] });
      }
      if (row['Apt Suitability (1-5)'] !== mammalRow['Apt(1-5)']) {
        conflicts.push({ breed: breedName, dimension: 'apartment_score', layer1: row['Apt Suitability (1-5)'], layer2: mammalRow['Apt(1-5)'] });
      }
      if (row['Kid-Friendly (1-5)'] !== mammalRow['Kids(1-5)']) {
        conflicts.push({ breed: breedName, dimension: 'kid_friendliness', layer1: row['Kid-Friendly (1-5)'], layer2: mammalRow['Kids(1-5)'] });
      }

      // Health Issues
      if (mammalRow['Health Issues']) {
        const issues = mammalRow['Health Issues'].split(',').map(s => s.trim()).filter(Boolean);
        for (const issue of issues) {
          healthConditionsSet.add(issue);
          breedHealthLinks.push({ breed_slug: breedSlug, condition_name: issue });
        }
      }

      mammalDetailRecords.push({
        breed_slug: breedSlug,
        raw: mammalRow,
        parse_warnings: mWarnings,
        origin_text: mammalRow.Origin,
        size_text: mammalRow.Size,
        size_category: parseSize(mammalRow.Size),
        weight_text: mammalRow['Wt(kg)'],
        weight_min_kg: mWt.min,
        weight_max_kg: mWt.max,
        height_text: mammalRow['Ht(cm)'],
        height_min_cm: mHt.min,
        height_max_cm: mHt.max,
        lifespan_text: mammalRow.Lifespan,
        lifespan_min_years: mLife.lifespan_min_years,
        lifespan_max_years: mLife.lifespan_max_years,
        energy_level: parseScore(mammalRow['Energy(1-5)']),
        exercise_minutes: mExer.exercise_minutes,
        exercise_open_ended: mExer.exercise_open_ended,
        trainability: parseScore(mammalRow['Train(1-5)']),
        intelligence: parseScore(mammalRow['Intel(1-5)']),
        shedding: parseScore(mammalRow['Shed(1-5)']),
        grooming_needs: parseScore(mammalRow['Groom(1-5)']),
        noise_level: parseScore(mammalRow['Noise(1-5)']),
        heat_tolerance: parseScore(mammalRow['HeatTol(1-5)']),
        cold_tolerance: parseScore(mammalRow['ColdTol(1-5)']),
        kids_score: parseScore(mammalRow['Kids(1-5)']),
        other_pets_score: parseScore(mammalRow['Pets(1-5)']),
        strangers_score: parseScore(mammalRow['Strangers(1-5)']),
        separation_anxiety: parseScore(mammalRow['SepAnx(1-5)']),
        first_time_owner: parseScore(mammalRow['1stTime(1-5)']),
        apt_score: parseScore(mammalRow['Apt(1-5)']),
        health_issues_text: mammalRow['Health Issues'],
        vet_cost_yearly_text: mammalRow['VetCost/Yr(₹)'],
        vet_cost_yearly_min_inr: mVet.min_inr,
        vet_cost_yearly_max_inr: mVet.max_inr,
        price_text: mammalRow['Price(₹)'],
        price_type: mPrice.price_type,
        price_min_inr: mPrice.price_min_inr,
        price_max_inr: mPrice.price_max_inr,
        availability: mammalRow.Avail,
        temperament: mammalRow.Temperament
      });
    }

    // Layer 2 Bird Detail
    const birdRow = l2BirdMap.get(`${animal}:::${breedName}`);
    if (birdRow) {
      const bWarnings = [];
      const bCage = parseCageSize(birdRow['Cage Size']);
      const bLife = parseLifespan(birdRow.Lifespan);
      const bVet = parseMoneyShorthand(birdRow['VetCost(₹)']);
      const bPrice = parsePrice(birdRow['Price(₹)']);
      bWarnings.push(...bCage.warnings, ...bLife.warnings, ...bVet.warnings, ...bPrice.warnings);

      if (row['Noise (1-5)'] !== birdRow['Noise(1-5)']) {
        conflicts.push({ breed: breedName, dimension: 'noise', layer1: row['Noise (1-5)'], layer2: birdRow['Noise(1-5)'] });
      }
      if (row['Apt Suitability (1-5)'] !== birdRow['Apt(1-5)']) {
        conflicts.push({ breed: breedName, dimension: 'apartment_score', layer1: row['Apt Suitability (1-5)'], layer2: birdRow['Apt(1-5)'] });
      }
      if (row['Kid-Friendly (1-5)'] !== birdRow['Kids(1-5)']) {
        conflicts.push({ breed: breedName, dimension: 'kid_friendliness', layer1: row['Kid-Friendly (1-5)'], layer2: birdRow['Kids(1-5)'] });
      }

      if (birdRow['Health Issues']) {
        const issues = birdRow['Health Issues'].split(',').map(s => s.trim()).filter(Boolean);
        for (const issue of issues) {
          healthConditionsSet.add(issue);
          breedHealthLinks.push({ breed_slug: breedSlug, condition_name: issue });
        }
      }

      birdDetailRecords.push({
        breed_slug: breedSlug,
        raw: birdRow,
        parse_warnings: bWarnings,
        origin_text: birdRow.Origin,
        cage_size_text: birdRow['Cage Size'],
        cage_length_in: bCage.cage_length_in,
        cage_width_in: bCage.cage_width_in,
        cage_height_in: bCage.cage_height_in,
        lifespan_text: birdRow.Lifespan,
        lifespan_min_years: bLife.lifespan_min_years,
        lifespan_max_years: bLife.lifespan_max_years,
        energy_level: parseScore(birdRow['Energy(1-5)']),
        talking_ability: parseScore(birdRow['Talking(1-5)']),
        intelligence: parseScore(birdRow['Intel(1-5)']),
        mess_level: parseScore(birdRow['Mess(1-5)']),
        noise_level: parseScore(birdRow['Noise(1-5)']),
        heat_tolerance: parseScore(birdRow['HeatTol(1-5)']),
        cold_tolerance: parseScore(birdRow['ColdTol(1-5)']),
        kids_score: parseScore(birdRow['Kids(1-5)']),
        separation_anxiety: parseScore(birdRow['SepAnx(1-5)']),
        first_time_owner: parseScore(birdRow['1stTime(1-5)']),
        apt_score: parseScore(birdRow['Apt(1-5)']),
        health_issues_text: birdRow['Health Issues'],
        vet_cost_text: birdRow['VetCost(₹)'],
        vet_cost_min_inr: bVet.min_inr,
        vet_cost_max_inr: bVet.max_inr,
        vet_cost_period_assumed: true,
        price_text: birdRow['Price(₹)'],
        price_type: bPrice.price_type,
        price_min_inr: bPrice.price_min_inr,
        price_max_inr: bPrice.price_max_inr,
        availability: birdRow.Avail,
        temperament: birdRow.Temperament
      });
    }

    // Layer 2 Aquatic / Reptile Detail
    const arRow = l2ArMap.get(`${animal}:::${breedName}`);
    if (arRow) {
      const arWarnings = [];
      const arEnc = parseEnclosure(arRow.Enclosure);
      const arLife = parseLifespan(arRow.Lifespan);
      const arVet = parseMoneyShorthand(arRow['VetCost(₹)']);
      const arPrice = parsePrice(arRow['Price(₹)']);
      arWarnings.push(...arEnc.warnings, ...arLife.warnings, ...arVet.warnings, ...arPrice.warnings);

      if (row['Apt Suitability (1-5)'] !== arRow['Apt(1-5)']) {
        conflicts.push({ breed: breedName, dimension: 'apartment_score', layer1: row['Apt Suitability (1-5)'], layer2: arRow['Apt(1-5)'] });
      }
      if (row['Kid-Friendly (1-5)'] !== arRow['Kids(1-5)']) {
        conflicts.push({ breed: breedName, dimension: 'kid_friendliness', layer1: row['Kid-Friendly (1-5)'], layer2: arRow['Kids(1-5)'] });
      }

      if (arRow['Health Issues']) {
        const issues = arRow['Health Issues'].split(',').map(s => s.trim()).filter(Boolean);
        for (const issue of issues) {
          healthConditionsSet.add(issue);
          breedHealthLinks.push({ breed_slug: breedSlug, condition_name: issue });
        }
      }

      arDetailRecords.push({
        breed_slug: breedSlug,
        raw: arRow,
        parse_warnings: arWarnings,
        origin_text: arRow.Origin,
        enclosure_text: arRow.Enclosure,
        enclosure_gallons_min: arEnc.enclosure_gallons_min,
        enclosure_open_ended: arEnc.enclosure_open_ended,
        setup_text: arRow['Water/Setup'],
        lifespan_text: arRow.Lifespan,
        lifespan_min_years: arLife.lifespan_min_years,
        lifespan_max_years: arLife.lifespan_max_years,
        care_difficulty: parseScore(arRow['Care(1-5)']),
        heat_tolerance: parseScore(arRow['HeatTol(1-5)']),
        cold_tolerance: parseScore(arRow['ColdTol(1-5)']),
        kids_score: parseScore(arRow['Kids(1-5)']),
        first_time_owner: parseScore(arRow['1stTime(1-5)']),
        apt_score: parseScore(arRow['Apt(1-5)']),
        health_issues_text: arRow['Health Issues'],
        vet_cost_text: arRow['VetCost(₹)'],
        vet_cost_min_inr: arVet.min_inr,
        vet_cost_max_inr: arVet.max_inr,
        vet_cost_period_assumed: true,
        price_text: arRow['Price(₹)'],
        price_type: arPrice.price_type,
        price_min_inr: arPrice.price_min_inr,
        price_max_inr: arPrice.price_max_inr,
        availability: arRow.Avail,
        temperament: arRow.Temperament
      });
    }
  }

  // 5. Validate Non-Legal Statuses strictly against requirement
  const expectedNonLegal = {
    registration_required: ['Green-cheeked Conure', 'African Grey Parrot', 'Blue & Gold Macaw', 'Ball Python'],
    registration_advised: ['Sugar Glider (Standard)'],
    restricted: ['Ferret (Standard)'],
    discouraged: ['Red-eared Slider']
  };

  const actualNonLegal = {
    registration_required: nonLegalStatusRows.filter(r => r.legal_status === 'registration_required').map(r => r.breed),
    registration_advised: nonLegalStatusRows.filter(r => r.legal_status === 'registration_advised').map(r => r.breed),
    restricted: nonLegalStatusRows.filter(r => r.legal_status === 'restricted').map(r => r.breed),
    discouraged: nonLegalStatusRows.filter(r => r.legal_status === 'discouraged').map(r => r.breed)
  };

  for (const key of Object.keys(expectedNonLegal)) {
    const expected = expectedNonLegal[key].sort();
    const actual = actualNonLegal[key].sort();
    if (JSON.stringify(expected) !== JSON.stringify(actual)) {
      throw new Error(`[VALIDATION FAILED] Non-legal status mismatch for '${key}'. Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)}`);
    }
  }

  return {
    l1Rows,
    l2MammalsRows,
    l2BirdsRows,
    l2ArRows,
    totalDataCells,
    headerCells,
    totalCellsWithHeaders,
    speciesCounts,
    matchedBreeds,
    nonMatchedBreeds,
    possibleDuplicates,
    breedsToInsert,
    husbandryRecords,
    mammalDetailRecords,
    birdDetailRecords,
    arDetailRecords,
    allParseWarnings,
    unhandledColumnValues,
    healthConditions: Array.from(healthConditionsSet),
    breedHealthLinks,
    nonLegalStatusRows,
    conflicts
  };
}
