import { supabaseAdmin } from '../db/supabase.js';
import { getDb } from '../db/index.js';

let cachedBreeds = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

/**
 * Fetches all 64 breeds from Supabase with joined species and husbandry data,
 * normalized into the standard pet model for the explore catalog and quiz scoring.
 */
export async function getAllBreedsData() {
  const now = Date.now();
  if (cachedBreeds && (now - cacheTimestamp < CACHE_TTL_MS)) {
    return cachedBreeds;
  }

  // 1. Try fetching from live Supabase
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('breeds')
        .select(`
          id,
          name,
          slug,
          is_indian_native,
          size_category,
          lifespan_min_years,
          lifespan_max_years,
          weight_min_kg,
          weight_max_kg,
          height_min_cm,
          height_max_cm,
          species:species_id ( id, name, slug ),
          husbandry:breed_husbandry (
            monthly_cost_min_inr,
            monthly_cost_max_inr,
            monthly_cost_text,
            noise_level,
            apt_suitability,
            kid_friendly,
            left_alone_min_hours,
            left_alone_max_hours,
            left_alone_text,
            daily_time_min_hours,
            daily_time_max_hours,
            daily_time_text,
            min_space_text,
            space_class,
            ac_requirement,
            legal_status_text,
            legal_status,
            exotic_vet_needed
          )
        `)
        .order('is_indian_native', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const normalized = data.map((b) => {
          const h = Array.isArray(b.husbandry) ? b.husbandry[0] : b.husbandry;
          const speciesSlug = b.species?.slug || 'dog';
          const isNative = Boolean(b.is_indian_native);

          // Calculate energy level (1-5) from daily care hours
          const dailyHours = h?.daily_time_max_hours || 2;
          const energyLevel = Math.min(5, Math.max(1, Math.round(dailyHours * 1.25)));

          // Heat tolerance rating (1-5): native indies get 5; AC mandatory breeds get 1
          let heatTolerance = 4;
          if (isNative) {
            heatTolerance = 5;
          } else if (h?.ac_requirement === 'mandatory' || b.slug.includes('husky') || b.slug.includes('bernard')) {
            heatTolerance = 1;
          } else if (h?.ac_requirement === 'recommended' || b.slug.includes('pug') || b.slug.includes('bulldog')) {
            heatTolerance = 2;
          } else if (speciesSlug === 'cat') {
            heatTolerance = 4;
          }

          // Cold tolerance rating (1-5)
          const coldTolerance = (b.slug.includes('husky') || b.slug.includes('bernard')) ? 5 : (isNative ? 2 : 3);

          // Coat type classification
          let coatType = 'short';
          if (b.slug.includes('husky') || b.slug.includes('bernard') || b.slug.includes('chow') || b.slug.includes('shepherd')) {
            coatType = 'double';
          } else if (b.slug.includes('persian') || b.slug.includes('shih-tzu') || b.slug.includes('golden') || b.slug.includes('angora')) {
            coatType = 'long';
          }

          // Living space square footage requirements
          let minSpaceSqft = 750;
          if (h?.space_class === 'small' || speciesSlug === 'cat' || speciesSlug === 'rabbit' || speciesSlug === 'bird' || speciesSlug === 'fish') {
            minSpaceSqft = 450;
          } else if (h?.space_class === 'large' || (b.size_category || '').toLowerCase() === 'large' || (b.size_category || '').toLowerCase() === 'giant') {
            minSpaceSqft = 1100;
          }

          const monthlyCost = h?.monthly_cost_min_inr || 3000;
          let budgetBand = 'budget';
          if (monthlyCost > 6000) budgetBand = 'premium';
          else if (monthlyCost > 3000) budgetBand = 'moderate';

          return {
            id: b.id,
            name: b.name,
            breed: b.name,
            slug: b.slug,
            species: speciesSlug,
            species_name: b.species?.name || 'Pet',
            is_native: isNative,
            size: (b.size_category || 'medium').toLowerCase(),
            lifespan: b.lifespan_min_years && b.lifespan_max_years
              ? `${b.lifespan_min_years}–${b.lifespan_max_years} yrs`
              : (h?.lifespan_text || '10–14 yrs'),
            energy_level: energyLevel,
            heat_tolerance: heatTolerance,
            cold_tolerance: coldTolerance,
            coat_type: coatType,
            apartment_friendly: (h?.apt_suitability ?? 3) >= 3,
            min_space_sqft: minSpaceSqft,
            max_alone_hours: h?.left_alone_max_hours || 6,
            base_monthly_cost_inr: monthlyCost,
            monthly_cost_max_inr: h?.monthly_cost_max_inr || 5000,
            monthly_cost_text: h?.monthly_cost_text || `₹${monthlyCost}/mo`,
            budget_band: budgetBand,
            kid_friendly: h?.kid_friendly || 4,
            noise_level: h?.noise_level || 3,
            space_demand: h?.apt_suitability ? Math.max(1, 6 - h.apt_suitability) : 3,
            time_attention_demand: Math.min(5, Math.max(1, h?.daily_time_max_hours || 3)),
            grooming_demand: coatType === 'long' ? 5 : (coatType === 'double' ? 4 : 2),
            feeding_effort: h?.exotic_vet_needed ? 4 : 2,
            legal_status: h?.legal_status_text || 'Legal companion in India',
            care_summary: h?.legal_status_text || 'Adapted companion',
            description: `${b.name} (${b.species?.name || 'Pet'}). ${h?.legal_status_text || ''} ${h?.daily_time_text ? `Requires ${h.daily_time_text} daily care.` : ''}`.trim()
          };
        });

        cachedBreeds = normalized;
        cacheTimestamp = now;
        return normalized;
      }
    } catch (err) {
      console.warn('Error fetching breeds from Supabase:', err.message);
    }
  }

  // 2. Fallback to SQL/InMemory database if Supabase query is unavailable
  const db = getDb();
  const result = await db.query('SELECT * FROM pets ORDER BY is_native DESC, name ASC');
  return result.rows || [];
}
