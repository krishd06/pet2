import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeDashes,
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
} from '../../../supabase/seed/researchParser.js';

test('normalizeDashes converts en dash and em dash to hyphen', () => {
  assert.equal(normalizeDashes('13–16 yrs'), '13-16 yrs');
  assert.equal(normalizeDashes('13—16 yrs'), '13-16 yrs');
  assert.equal(normalizeDashes('13-16 yrs'), '13-16 yrs');
});

test('slugifyBreed handles hyphens, slashes, ampersands, and parentheses', () => {
  assert.equal(slugifyBreed('Indie / Indian Pariah'), 'indie-indian-pariah');
  assert.equal(slugifyBreed('Domestic Shorthair (Indie)'), 'domestic-shorthair-indie');
  assert.equal(slugifyBreed('Blue & Gold Macaw'), 'blue-and-gold-macaw');
});

test('parseLifespan handles standard, decimals, open-ended, and Layer 2 forms', () => {
  // '13–16 yrs' -> 13/16
  const r1 = parseLifespan('13–16 yrs');
  assert.equal(r1.lifespan_min_years, 13);
  assert.equal(r1.lifespan_max_years, 16);
  assert.equal(r1.lifespan_open_ended, false);

  // '1.5–2 yrs' decimals
  const r2 = parseLifespan('1.5–2 yrs');
  assert.equal(r2.lifespan_min_years, 1.5);
  assert.equal(r2.lifespan_max_years, 2);
  assert.equal(r2.lifespan_open_ended, false);

  // '30–50+ yrs' -> 30/50 open_ended true
  const r3 = parseLifespan('30–50+ yrs');
  assert.equal(r3.lifespan_min_years, 30);
  assert.equal(r3.lifespan_max_years, 50);
  assert.equal(r3.lifespan_open_ended, true);

  // Layer 2 forms
  const r4 = parseLifespan('13-16');
  assert.equal(r4.lifespan_min_years, 13);
  assert.equal(r4.lifespan_max_years, 16);

  const r5 = parseLifespan('5-10');
  assert.equal(r5.lifespan_min_years, 5);
  assert.equal(r5.lifespan_max_years, 10);

  const r6 = parseLifespan('2-5');
  assert.equal(r6.lifespan_min_years, 2);
  assert.equal(r6.lifespan_max_years, 5);
});

test('parseDailyTime handles fractions, ranges, and open-ended forms', () => {
  // '0.5 hr'
  const r1 = parseDailyTime('0.5 hr');
  assert.equal(r1.daily_time_min_hours, 0.5);
  assert.equal(r1.daily_time_max_hours, 0.5);
  assert.equal(r1.daily_time_open_ended, false);

  // '0.5 hrs'
  const r2 = parseDailyTime('0.5 hrs');
  assert.equal(r2.daily_time_min_hours, 0.5);
  assert.equal(r2.daily_time_max_hours, 0.5);

  // '1–2 hrs'
  const r3 = parseDailyTime('1–2 hrs');
  assert.equal(r3.daily_time_min_hours, 1);
  assert.equal(r3.daily_time_max_hours, 2);

  // '0.5–1 hr'
  const r4 = parseDailyTime('0.5–1 hr');
  assert.equal(r4.daily_time_min_hours, 0.5);
  assert.equal(r4.daily_time_max_hours, 1);

  // '3+ hrs' -> 3/3 open_ended true
  const r5 = parseDailyTime('3+ hrs');
  assert.equal(r5.daily_time_min_hours, 3);
  assert.equal(r5.daily_time_max_hours, 3);
  assert.equal(r5.daily_time_open_ended, true);
});

test('parseLeftAlone handles ranges, singles, open-ended, and notes', () => {
  // '4–6' -> 4/6
  const r1 = parseLeftAlone('4–6');
  assert.equal(r1.left_alone_min_hours, 4);
  assert.equal(r1.left_alone_max_hours, 6);
  assert.equal(r1.left_alone_open_ended, false);
  assert.equal(r1.left_alone_note, null);

  // '12' -> 12/12
  const r2 = parseLeftAlone('12');
  assert.equal(r2.left_alone_min_hours, 12);
  assert.equal(r2.left_alone_max_hours, 12);

  // '24+' -> 24/24 open_ended true
  const r3 = parseLeftAlone('24+');
  assert.equal(r3.left_alone_min_hours, 24);
  assert.equal(r3.left_alone_max_hours, 24);
  assert.equal(r3.left_alone_open_ended, true);

  // '24–48' -> 24/48
  const r4 = parseLeftAlone('24–48');
  assert.equal(r4.left_alone_min_hours, 24);
  assert.equal(r4.left_alone_max_hours, 48);

  // '4 (Needs buddy)' -> 4/4, left_alone_note 'Needs buddy'
  const r5 = parseLeftAlone('4 (Needs buddy)');
  assert.equal(r5.left_alone_min_hours, 4);
  assert.equal(r5.left_alone_max_hours, 4);
  assert.equal(r5.left_alone_note, 'Needs buddy');
});

test('parseMonthlyCost strips symbols and parses integer INR range', () => {
  const r = parseMonthlyCost('₹2,000–₹4,000');
  assert.equal(r.monthly_cost_min_inr, 2000);
  assert.equal(r.monthly_cost_max_inr, 4000);
});

test('parseMoneyShorthand handles k, L, ranges, and N/A', () => {
  // '3k-5k' -> 3000/5000
  const r1 = parseMoneyShorthand('3k-5k');
  assert.equal(r1.min_inr, 3000);
  assert.equal(r1.max_inr, 5000);

  // '80k-1.5L' -> 80000/150000
  const r2 = parseMoneyShorthand('80k-1.5L');
  assert.equal(r2.min_inr, 80000);
  assert.equal(r2.max_inr, 150000);

  // '500-1k' -> 500/1000
  const r3 = parseMoneyShorthand('500-1k');
  assert.equal(r3.min_inr, 500);
  assert.equal(r3.max_inr, 1000);

  // '500-1.5k' -> 500/1500
  const r4 = parseMoneyShorthand('500-1.5k');
  assert.equal(r4.min_inr, 500);
  assert.equal(r4.max_inr, 1500);

  // '100-500' -> 100/500
  const r5 = parseMoneyShorthand('100-500');
  assert.equal(r5.min_inr, 100);
  assert.equal(r5.max_inr, 500);

  // 'N/A' -> null/null
  const r6 = parseMoneyShorthand('N/A');
  assert.equal(r6.min_inr, null);
  assert.equal(r6.max_inr, null);
});

test('parsePrice distinguishes Adoption from numeric purchase', () => {
  const r1 = parsePrice('Adoption');
  assert.equal(r1.price_type, 'adoption');
  assert.equal(r1.price_min_inr, 0);
  assert.equal(r1.price_max_inr, 0);

  const r2 = parsePrice('10k-20k');
  assert.equal(r2.price_type, 'purchase');
  assert.equal(r2.price_min_inr, 10000);
  assert.equal(r2.price_max_inr, 20000);
});

test('parseRangeNumeric handles weights and heights', () => {
  const r1 = parseRangeNumeric('15-25');
  assert.equal(r1.min, 15);
  assert.equal(r1.max, 25);

  const r2 = parseRangeNumeric('1.5-3');
  assert.equal(r2.min, 1.5);
  assert.equal(r2.max, 3);
});

test('parseExerciseMinutes handles 60 and 90+', () => {
  const r1 = parseExerciseMinutes('60');
  assert.equal(r1.exercise_minutes, 60);
  assert.equal(r1.exercise_open_ended, false);

  const r2 = parseExerciseMinutes('90+');
  assert.equal(r2.exercise_minutes, 90);
  assert.equal(r2.exercise_open_ended, true);
});

test('parseSize standardizes size classifications', () => {
  assert.equal(parseSize('Small'), 'small');
  assert.equal(parseSize('Med'), 'medium');
  assert.equal(parseSize('Large'), 'large');
});

test('parseCageSize extracts 3D dimensions in inches', () => {
  const r = parseCageSize('24x18x18"');
  assert.equal(r.cage_length_in, 24);
  assert.equal(r.cage_width_in, 18);
  assert.equal(r.cage_height_in, 18);
});

test('parseEnclosure handles gallon minimums and open-ended flags', () => {
  const r1 = parseEnclosure('5-10 Gal');
  assert.equal(r1.enclosure_gallons_min, 5);
  assert.equal(r1.enclosure_open_ended, false);

  const r2 = parseEnclosure('75+ Gal');
  assert.equal(r2.enclosure_gallons_min, 75);
  assert.equal(r2.enclosure_open_ended, true);

  const r3 = parseEnclosure('20+ Gal');
  assert.equal(r3.enclosure_gallons_min, 20);
  assert.equal(r3.enclosure_open_ended, true);
});

test('parseExoticVetNeeded handles boolean yes/no', () => {
  assert.equal(parseExoticVetNeeded('Yes'), true);
  assert.equal(parseExoticVetNeeded('No'), false);
});

test('parseMinSpaceNeeded extracts space_class, vertical, sq_ft, sq_in, and AC requirements', () => {
  // space_class
  assert.equal(parseMinSpaceNeeded('Medium').space_class, 'medium');
  assert.equal(parseMinSpaceNeeded('Very Large (Room/Free roam)').space_class, 'very_large');
  assert.equal(parseMinSpaceNeeded('Massive Aviary').space_class, 'massive');

  // vertical_space_needed
  assert.equal(parseMinSpaceNeeded('Medium (Vertical space)').vertical_space_needed, true);
  assert.equal(parseMinSpaceNeeded('Tall arboreal cage').vertical_space_needed, true);
  assert.equal(parseMinSpaceNeeded('Large multi-level cage').vertical_space_needed, true);
  assert.equal(parseMinSpaceNeeded('Medium').vertical_space_needed, false);

  // Gallons
  assert.equal(parseMinSpaceNeeded('40–120 gallons').min_space_gallons, 40);
  assert.equal(parseMinSpaceNeeded('75+ gallons').min_space_gallons, 75);
  assert.equal(parseMinSpaceNeeded('5–10 gallons').min_space_gallons, 5);

  // sq ft and sq in
  assert.equal(parseMinSpaceNeeded('8 sq. ft. min').min_space_sq_ft, 8);
  assert.equal(parseMinSpaceNeeded('4 sq. ft. minimum').min_space_sq_ft, 4);
  assert.equal(parseMinSpaceNeeded('450 sq. in. unbroken floor').min_space_sq_in, 450);

  // AC requirement
  assert.equal(parseMinSpaceNeeded('Large (AC Mandatory)').ac_requirement, 'required');
  assert.equal(parseMinSpaceNeeded('Large', 'Requires AC in summer').ac_requirement, 'required');
  assert.equal(parseMinSpaceNeeded('Large (AC recommended)').ac_requirement, 'recommended');
  assert.equal(parseMinSpaceNeeded('Large').ac_requirement, 'none');
});

test('parseLegalStatus identifies all categories, PARIVESH, CITES, and DGFT permits', () => {
  // registration_required
  const r1 = parseLegalStatus('Legal (Non-native). PARIVESH 2.0 registration mandatory (CITES App II).');
  assert.equal(r1.legal_status, 'registration_required');
  assert.equal(r1.requires_parivesh, true);
  assert.equal(r1.cites_appendix_ii, true);

  // registration_advised
  const r2 = parseLegalStatus('Legal (Non-native). PARIVESH 2.0 registration advised.');
  assert.equal(r2.legal_status, 'registration_advised');
  assert.equal(r2.requires_parivesh, true);

  // restricted
  const r3 = parseLegalStatus('Restricted. Requires special import permits (DGFT); highly regulated.');
  assert.equal(r3.legal_status, 'restricted');
  assert.equal(r3.requires_import_permit, true);

  // discouraged
  const r4 = parseLegalStatus('Legal but Highly Invasive. Ecologically discouraged.');
  assert.equal(r4.legal_status, 'discouraged');

  // standard legal
  const r5 = parseLegalStatus('Legal. Highly suited for Indian climate.');
  assert.equal(r5.legal_status, 'legal');
});
