import fs from 'fs';
import path from 'path';

/**
 * Robust, zero-dependency CSV reader supporting multi-line quoted fields and varying line breaks.
 */
export function parseCSV(csvContent) {
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

  const headers = rows[0].map(h => normalizeHeader(h));
  const data = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const obj = {};
    for (let c = 0; c < headers.length; c++) {
      obj[headers[c]] = row[c] !== undefined ? row[c] : '';
    }
    data.push(obj);
  }

  return data;
}

function normalizeHeader(h) {
  return h
    .toLowerCase()
    .replace(/[/?\(\)\\]+/g, ' ')
    .replace(/\s+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function clampScore(val, defaultScore = 3) {
  const num = parseInt(val, 10);
  if (isNaN(num)) return defaultScore;
  return Math.max(1, Math.min(5, num));
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Attempts to locate the Kaggle data directory.
 * Checks /data, ./data, and ../data relative to project root.
 */
export function findDataDirectory() {
  const candidates = [
    path.resolve(process.cwd(), 'data'),
    path.resolve(process.cwd(), '..', 'data'),
    path.resolve('c:/data'),
    '/data'
  ];

  for (const dir of candidates) {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      return dir;
    }
  }
  return null;
}

/**
 * Imports Dog Breeds from Kaggle CSV files (e.g., breed_traits.csv).
 * Idempotent (uses slug conflict handling).
 * If files are absent, prints a clear message and returns safely without error.
 */
export async function importKaggleBreeds(supabase, dogSpeciesId) {
  const dataDir = findDataDirectory();

  if (!dataDir) {
    console.log('\n[Kaggle Importer] ℹ️  No /data folder found in project. Using built-in curated Indian & international breeds seed.');
    return { imported: 0, skipped: true, reason: 'directory_not_found' };
  }

  const traitsFilePath = path.join(dataDir, 'breed_traits.csv');
  const detailsFilePath = [
    path.join(dataDir, 'dog_breeds.csv'),
    path.join(dataDir, 'breeds.csv'),
    path.join(dataDir, 'breed_details.csv')
  ].find(p => fs.existsSync(p));

  if (!fs.existsSync(traitsFilePath)) {
    console.log(`\n[Kaggle Importer] ℹ️  breed_traits.csv not found in ${dataDir}.`);
    console.log('                 To import from Kaggle, place "breed_traits.csv" in the /data folder.');
    return { imported: 0, skipped: true, reason: 'file_not_found' };
  }

  console.log(`\n[Kaggle Importer] 📂 Found Kaggle dataset at ${traitsFilePath}. Parsing records...`);
  const csvContent = fs.readFileSync(traitsFilePath, 'utf-8');
  const traitsRows = parseCSV(csvContent);

  // Optional: Read secondary details file (height, weight, lifespan, description) if present
  const detailsMap = new Map();
  if (detailsFilePath && fs.existsSync(detailsFilePath)) {
    try {
      const detailsRows = parseCSV(fs.readFileSync(detailsFilePath, 'utf-8'));
      for (const d of detailsRows) {
        const breedName = d.breed || d.name || d.breed_name;
        if (breedName) {
          detailsMap.set(slugify(breedName), d);
        }
      }
    } catch (e) {
      console.warn('[Kaggle Importer] Note: Could not parse secondary details CSV:', e.message);
    }
  }

  const mappedBreeds = [];
  const seenSlugs = new Set();

  for (const row of traitsRows) {
    const rawName = row.breed || row.breed_name || row.name;
    if (!rawName) continue;

    const slug = slugify(rawName);
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const detail = detailsMap.get(slug) || {};

    // Map column aliases commonly present across Kaggle versions
    const record = {
      species_id: dogSpeciesId,
      name: rawName,
      slug,
      breed_group: detail.breed_group || detail.group || 'Companion Dog',
      origin_country: detail.origin || detail.origin_country || 'International',
      is_indian_native: false,
      size_category: (detail.size || 'medium').toLowerCase(),
      weight_min_kg: parseFloat(detail.weight_min_kg || detail.min_weight) || 12.0,
      weight_max_kg: parseFloat(detail.weight_max_kg || detail.max_weight) || 28.0,
      height_min_cm: parseFloat(detail.height_min_cm || detail.min_height) || 35.0,
      height_max_cm: parseFloat(detail.height_max_cm || detail.max_height) || 55.0,
      lifespan_min_years: parseInt(detail.lifespan_min_years || detail.min_lifespan, 10) || 10,
      lifespan_max_years: parseInt(detail.lifespan_max_years || detail.max_lifespan, 10) || 14,
      description: detail.description || `Kaggle benchmark data for ${rawName}.`,
      image_url: detail.image_url || detail.image || null,
      source: 'Kaggle Dog Breeds Dataset',

      // 16 traits normalized to 1-5
      affectionate_with_family: clampScore(row.affectionate_with_family || row.affectionate),
      good_with_young_children: clampScore(row.good_with_young_children || row.good_with_children),
      good_with_other_dogs: clampScore(row.good_with_other_dogs || row.dog_friendly),
      shedding_level: clampScore(row.shedding_level || row.shedding),
      coat_grooming_frequency: clampScore(row.coat_grooming_frequency || row.grooming_frequency),
      drooling_level: clampScore(row.drooling_level || row.drooling),
      openness_to_strangers: clampScore(row.openness_to_strangers || row.stranger_friendly),
      playfulness_level: clampScore(row.playfulness_level || row.playfulness),
      protective_nature: clampScore(row.watchdog_protective_nature || row.protective_nature || row.watchdog_nature),
      adaptability_level: clampScore(row.adaptability_level || row.adaptability),
      trainability_level: clampScore(row.trainability_level || row.trainability),
      energy_level: clampScore(row.energy_level || row.energy),
      barking_level: clampScore(row.barking_level || row.barking),
      mental_stimulation_needs: clampScore(row.mental_stimulation_needs || row.mental_needs),
      heat_tolerance: clampScore(row.heat_tolerance || 3),
      apartment_friendly_score: clampScore(row.apartment_friendly || row.apartment_friendly_score || 3),

      coat_type: row.coat_type || 'Double',
      coat_length: row.coat_length || 'Medium'
    };

    mappedBreeds.push(record);
  }

  console.log(`[Kaggle Importer] 📊 Normalized ${mappedBreeds.length} breeds from Kaggle CSV.`);

  if (supabase) {
    let successCount = 0;
    // Chunk inserts in batches of 50
    const chunkSize = 50;
    for (let i = 0; i < mappedBreeds.length; i += chunkSize) {
      const chunk = mappedBreeds.slice(i, i + chunkSize);
      const { error } = await supabase
        .from('breeds')
        .upsert(chunk, { onConflict: 'slug' });

      if (error) {
        console.error(`[Kaggle Importer] Error upserting chunk ${i / chunkSize}:`, error.message);
      } else {
        successCount += chunk.length;
      }
    }
    console.log(`[Kaggle Importer] ✅ Successfully inserted/updated ${successCount} breeds into database.`);
    return { imported: successCount, skipped: false };
  }

  return { imported: mappedBreeds.length, skipped: false, breeds: mappedBreeds };
}
