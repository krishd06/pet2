/**
 * Research Data Parser Module
 * Parses all 4 research CSV layers with lossless derivation from raw strings.
 * Every parsed value is derived from the raw string; raw strings are always kept.
 * On any unparseable pattern, sets parsed columns to null and records parse_warnings.
 */

export function normalizeDashes(str) {
  if (!str) return '';
  return String(str)
    .replace(/[\u2013\u2014]/g, '-')
    .trim();
}

export function slugifyBreed(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[/\\()]+/g, ' ')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function parseLifespan(raw) {
  const warnings = [];
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return { lifespan_min_years: null, lifespan_max_years: null, lifespan_open_ended: false, warnings };
  }

  const s = normalizeDashes(raw);
  const isOpenEnded = s.includes('+');

  // Match e.g. "13-16 yrs", "1.5-2 yrs", "30-50+ yrs", "13-16", "2-5"
  const rangeMatch = s.match(/([0-9]+(?:\.[0-9]+)?)\s*-\s*([0-9]+(?:\.[0-9]+)?)/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    return {
      lifespan_min_years: isNaN(min) ? null : min,
      lifespan_max_years: isNaN(max) ? null : max,
      lifespan_open_ended: isOpenEnded,
      warnings
    };
  }

  // Single number fallback, e.g. "12 yrs", "12"
  const singleMatch = s.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (singleMatch) {
    const val = parseFloat(singleMatch[1]);
    return {
      lifespan_min_years: isNaN(val) ? null : val,
      lifespan_max_years: isNaN(val) ? null : val,
      lifespan_open_ended: isOpenEnded,
      warnings
    };
  }

  warnings.push(`Could not parse lifespan: "${raw}"`);
  return { lifespan_min_years: null, lifespan_max_years: null, lifespan_open_ended: false, warnings };
}

export function parseDailyTime(raw) {
  const warnings = [];
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return { daily_time_min_hours: null, daily_time_max_hours: null, daily_time_open_ended: false, warnings };
  }

  const s = normalizeDashes(raw);
  const isOpenEnded = s.includes('+');

  // "1-2 hrs", "0.5-1 hr"
  const rangeMatch = s.match(/([0-9]+(?:\.[0-9]+)?)\s*-\s*([0-9]+(?:\.[0-9]+)?)/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    return {
      daily_time_min_hours: isNaN(min) ? null : min,
      daily_time_max_hours: isNaN(max) ? null : max,
      daily_time_open_ended: isOpenEnded,
      warnings
    };
  }

  // "0.5 hr", "0.5 hrs", "2 hrs", "3+ hrs"
  const singleMatch = s.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (singleMatch) {
    const val = parseFloat(singleMatch[1]);
    return {
      daily_time_min_hours: isNaN(val) ? null : val,
      daily_time_max_hours: isNaN(val) ? null : val,
      daily_time_open_ended: isOpenEnded,
      warnings
    };
  }

  warnings.push(`Could not parse daily time: "${raw}"`);
  return { daily_time_min_hours: null, daily_time_max_hours: null, daily_time_open_ended: false, warnings };
}

export function parseLeftAlone(raw) {
  const warnings = [];
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return { left_alone_min_hours: null, left_alone_max_hours: null, left_alone_open_ended: false, left_alone_note: null, warnings };
  }

  const s = normalizeDashes(raw);
  const isOpenEnded = s.includes('+');

  // Extract note in parentheses e.g. "4 (Needs buddy)"
  let note = null;
  const noteMatch = s.match(/\(([^)]+)\)/);
  if (noteMatch) {
    note = noteMatch[1].trim();
  }

  // Strip parentheses for numeric parsing
  const clean = s.replace(/\([^)]+\)/g, '').trim();

  // "4-6", "24-48"
  const rangeMatch = clean.match(/([0-9]+)\s*-\s*([0-9]+)/);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10);
    const max = parseInt(rangeMatch[2], 10);
    return {
      left_alone_min_hours: isNaN(min) ? null : min,
      left_alone_max_hours: isNaN(max) ? null : max,
      left_alone_open_ended: isOpenEnded,
      left_alone_note: note,
      warnings
    };
  }

  // "12", "24+", "4"
  const singleMatch = clean.match(/([0-9]+)/);
  if (singleMatch) {
    const val = parseInt(singleMatch[1], 10);
    return {
      left_alone_min_hours: isNaN(val) ? null : val,
      left_alone_max_hours: isNaN(val) ? null : val,
      left_alone_open_ended: isOpenEnded,
      left_alone_note: note,
      warnings
    };
  }

  warnings.push(`Could not parse left alone hours: "${raw}"`);
  return { left_alone_min_hours: null, left_alone_max_hours: null, left_alone_open_ended: false, left_alone_note: note, warnings };
}

export function parseMonthlyCost(raw) {
  const warnings = [];
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return { monthly_cost_min_inr: null, monthly_cost_max_inr: null, warnings };
  }

  const s = normalizeDashes(raw).replace(/[₹,]/g, '');

  const rangeMatch = s.match(/([0-9]+)\s*-\s*([0-9]+)/);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10);
    const max = parseInt(rangeMatch[2], 10);
    return {
      monthly_cost_min_inr: isNaN(min) ? null : min,
      monthly_cost_max_inr: isNaN(max) ? null : max,
      warnings
    };
  }

  const singleMatch = s.match(/([0-9]+)/);
  if (singleMatch) {
    const val = parseInt(singleMatch[1], 10);
    return {
      monthly_cost_min_inr: isNaN(val) ? null : val,
      monthly_cost_max_inr: isNaN(val) ? null : val,
      warnings
    };
  }

  warnings.push(`Could not parse monthly cost: "${raw}"`);
  return { monthly_cost_min_inr: null, monthly_cost_max_inr: null, warnings };
}

export function parseMoneyValue(token) {
  if (!token) return null;
  const t = token.trim();
  if (!t || t.toUpperCase() === 'N/A') return null;

  // Lakh (L) e.g. 1.5L, 2L
  if (/L$/i.test(t)) {
    const num = parseFloat(t.slice(0, -1));
    return isNaN(num) ? null : Math.round(num * 100000);
  }

  // Thousand (k) e.g. 3k, 1.5k, 80k
  if (/k$/i.test(t)) {
    const num = parseFloat(t.slice(0, -1));
    return isNaN(num) ? null : Math.round(num * 1000);
  }

  // Straight integer/decimal
  const clean = t.replace(/[₹,]/g, '');
  const num = parseFloat(clean);
  return isNaN(num) ? null : Math.round(num);
}

export function parseMoneyShorthand(raw) {
  const warnings = [];
  if (!raw || typeof raw !== 'string' || !raw.trim() || raw.trim().toUpperCase() === 'N/A') {
    return { min_inr: null, max_inr: null, warnings };
  }

  const s = normalizeDashes(raw).replace(/[₹]/g, '');

  const parts = s.split('-');
  if (parts.length === 2) {
    let minToken = parts[0].trim();
    let maxToken = parts[1].trim();

    // Contextual multiplier inheritance: e.g. "80-100k" or "100-500"
    if (!/[kL]$/i.test(minToken) && /[kL]$/i.test(maxToken)) {
      const mult = maxToken.slice(-1);
      // Only inherit multiplier if min < max numeric value
      const minNum = parseFloat(minToken);
      const maxNum = parseFloat(maxToken.slice(0, -1));
      if (!isNaN(minNum) && !isNaN(maxNum) && minNum <= maxNum) {
        minToken += mult;
      }
    }

    const min = parseMoneyValue(minToken);
    const max = parseMoneyValue(maxToken);
    return { min_inr: min, max_inr: max, warnings };
  }

  if (parts.length === 1) {
    const val = parseMoneyValue(parts[0]);
    return { min_inr: val, max_inr: val, warnings };
  }

  warnings.push(`Could not parse money shorthand: "${raw}"`);
  return { min_inr: null, max_inr: null, warnings };
}

export function parsePrice(raw) {
  const warnings = [];
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return { price_type: null, price_min_inr: null, price_max_inr: null, warnings };
  }

  const clean = raw.trim();
  if (/^adoption$/i.test(clean)) {
    return { price_type: 'adoption', price_min_inr: 0, price_max_inr: 0, warnings };
  }

  const { min_inr, max_inr, warnings: moneyWarnings } = parseMoneyShorthand(raw);
  warnings.push(...moneyWarnings);

  return {
    price_type: 'purchase',
    price_min_inr: min_inr,
    price_max_inr: max_inr,
    warnings
  };
}

export function parseRangeNumeric(raw) {
  const warnings = [];
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return { min: null, max: null, warnings };
  }

  const s = normalizeDashes(raw);
  const rangeMatch = s.match(/([0-9]+(?:\.[0-9]+)?)\s*-\s*([0-9]+(?:\.[0-9]+)?)/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    return { min: isNaN(min) ? null : min, max: isNaN(max) ? null : max, warnings };
  }

  const singleMatch = s.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (singleMatch) {
    const val = parseFloat(singleMatch[1]);
    return { min: isNaN(val) ? null : val, max: isNaN(val) ? null : val, warnings };
  }

  warnings.push(`Could not parse numeric range: "${raw}"`);
  return { min: null, max: null, warnings };
}

export function parseExerciseMinutes(raw) {
  const warnings = [];
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return { exercise_minutes: null, exercise_open_ended: false, warnings };
  }

  const s = raw.trim();
  const isOpenEnded = s.includes('+');
  const match = s.match(/([0-9]+)/);
  if (match) {
    const val = parseInt(match[1], 10);
    return { exercise_minutes: isNaN(val) ? null : val, exercise_open_ended: isOpenEnded, warnings };
  }

  warnings.push(`Could not parse exercise minutes: "${raw}"`);
  return { exercise_minutes: null, exercise_open_ended: false, warnings };
}

export function parseSize(raw) {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();
  if (s.startsWith('small')) return 'small';
  if (s.startsWith('med')) return 'medium';
  if (s.startsWith('large')) return 'large';
  if (s.startsWith('giant')) return 'giant';
  return null;
}

export function parseCageSize(raw) {
  const warnings = [];
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return { cage_length_in: null, cage_width_in: null, cage_height_in: null, warnings };
  }

  // e.g. '24x18x18"' or '24 x 18 x 18'
  const match = raw.match(/([0-9]+(?:\.[0-9]+)?)\s*[xX]\s*([0-9]+(?:\.[0-9]+)?)\s*[xX]\s*([0-9]+(?:\.[0-9]+)?)/);
  if (match) {
    const l = parseFloat(match[1]);
    const w = parseFloat(match[2]);
    const h = parseFloat(match[3]);
    return {
      cage_length_in: isNaN(l) ? null : l,
      cage_width_in: isNaN(w) ? null : w,
      cage_height_in: isNaN(h) ? null : h,
      warnings
    };
  }

  warnings.push(`Could not parse cage dimensions: "${raw}"`);
  return { cage_length_in: null, cage_width_in: null, cage_height_in: null, warnings };
}

export function parseEnclosure(raw) {
  const warnings = [];
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return { enclosure_gallons_min: null, enclosure_open_ended: false, warnings };
  }

  const s = normalizeDashes(raw);
  const isOpenEnded = s.includes('+');

  // "5-10 Gal" -> min 5
  const rangeMatch = s.match(/([0-9]+(?:\.[0-9]+)?)\s*-\s*[0-9]+(?:\.[0-9]+)?\s*Gal/i);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    return { enclosure_gallons_min: isNaN(min) ? null : min, enclosure_open_ended: isOpenEnded, warnings };
  }

  // "75+ Gal", "20+ Gal", "10 Gal"
  const singleMatch = s.match(/([0-9]+(?:\.[0-9]+)?)\s*\+?\s*Gal/i);
  if (singleMatch) {
    const val = parseFloat(singleMatch[1]);
    return { enclosure_gallons_min: isNaN(val) ? null : val, enclosure_open_ended: isOpenEnded, warnings };
  }

  warnings.push(`Could not parse enclosure: "${raw}"`);
  return { enclosure_gallons_min: null, enclosure_open_ended: false, warnings };
}

export function parseExoticVetNeeded(raw) {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();
  if (s === 'yes') return true;
  if (s === 'no') return false;
  return null;
}

export function parseMinSpaceNeeded(spaceRaw, legalRaw = '') {
  const warnings = [];
  if (!spaceRaw || typeof spaceRaw !== 'string') {
    return {
      space_class: null,
      min_space_gallons: null,
      min_space_sq_ft: null,
      min_space_sq_in: null,
      vertical_space_needed: false,
      ac_requirement: 'none',
      warnings
    };
  }

  const s = normalizeDashes(spaceRaw);
  const combinedForAC = `${s} ${legalRaw || ''}`;

  // 1. space_class from leading word
  let space_class = null;
  if (/^very\s+large/i.test(s)) {
    space_class = 'very_large';
  } else if (/^massive/i.test(s)) {
    space_class = 'massive';
  } else if (/^small/i.test(s)) {
    space_class = 'small';
  } else if (/^medium/i.test(s)) {
    space_class = 'medium';
  } else if (/^large/i.test(s)) {
    space_class = 'large';
  }

  // 2. vertical_space_needed
  const vertical_space_needed = /vertical|arboreal|multi-level/i.test(s);

  // 3. Gallons: take the minimum number before 'gallons'
  let min_space_gallons = null;
  const galRangeMatch = s.match(/([0-9]+(?:\.[0-9]+)?)\s*-\s*[0-9]+(?:\.[0-9]+)?\s*gallons/i);
  if (galRangeMatch) {
    min_space_gallons = parseFloat(galRangeMatch[1]);
  } else {
    const galSingleMatch = s.match(/([0-9]+(?:\.[0-9]+)?)\s*\+?\s*gallons/i);
    if (galSingleMatch) {
      min_space_gallons = parseFloat(galSingleMatch[1]);
    }
  }

  // 4. Square feet: "8 sq. ft. min", "4 sq. ft. minimum"
  let min_space_sq_ft = null;
  const sqFtMatch = s.match(/([0-9]+(?:\.[0-9]+)?)\s*sq\.?\s*ft/i);
  if (sqFtMatch) {
    min_space_sq_ft = parseFloat(sqFtMatch[1]);
  }

  // 5. Square inches: "450 sq. in."
  let min_space_sq_in = null;
  const sqInMatch = s.match(/([0-9]+(?:\.[0-9]+)?)\s*sq\.?\s*in/i);
  if (sqInMatch) {
    min_space_sq_in = parseFloat(sqInMatch[1]);
  }

  // 6. AC requirement: 'required' if 'AC Mandatory' or 'Requires AC'; 'recommended' if 'AC recommended'; else 'none'
  let ac_requirement = 'none';
  if (/ac\s+mandatory|requires\s+ac/i.test(combinedForAC)) {
    ac_requirement = 'required';
  } else if (/ac\s+recommended/i.test(combinedForAC)) {
    ac_requirement = 'recommended';
  }

  return {
    space_class,
    min_space_gallons,
    min_space_sq_ft,
    min_space_sq_in,
    vertical_space_needed,
    ac_requirement,
    warnings
  };
}

export function parseLegalStatus(raw) {
  const warnings = [];
  if (!raw || typeof raw !== 'string') {
    return {
      legal_status: 'legal',
      requires_parivesh: false,
      cites_appendix_ii: false,
      requires_import_permit: false,
      warnings
    };
  }

  const s = raw.trim();
  const requires_parivesh = /PARIVESH/i.test(s);
  const cites_appendix_ii = /CITES\s+App\s+II/i.test(s);
  const requires_import_permit = /DGFT|import\s+permit/i.test(s);

  let legal_status = 'legal';
  if (/^Restricted/i.test(s)) {
    legal_status = 'restricted';
  } else if (/Legal\s+but\s+Highly\s+Invasive/i.test(s)) {
    legal_status = 'discouraged';
  } else if (/registration\s+mandatory/i.test(s) || (requires_parivesh && /mandatory/i.test(s))) {
    legal_status = 'registration_required';
  } else if (/registration\s+advised/i.test(s) || (requires_parivesh && /advised/i.test(s))) {
    legal_status = 'registration_advised';
  } else if (/^Legal/i.test(s)) {
    legal_status = 'legal';
  } else {
    warnings.push(`Unrecognized legal status wording: "${raw}"`);
  }

  return {
    legal_status,
    requires_parivesh,
    cites_appendix_ii,
    requires_import_permit,
    warnings
  };
}

export function parseScore(val) {
  if (val === null || val === undefined || val === '') return null;
  const num = parseInt(val, 10);
  if (isNaN(num)) return null;
  if (num < 1 || num > 5) return null;
  return num;
}
