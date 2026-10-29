-- PawMatch India: Migration 0003 - Owner Research Data Tables & Views
-- Additive only: Does NOT drop, alter, or rename any existing object.

-- ============================================================================
-- 1. TABLE: breed_husbandry (Layer 1 - All 54 Companion Animal Breeds)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.breed_husbandry (
  breed_id uuid PRIMARY KEY REFERENCES public.breeds(id) ON DELETE CASCADE,
  raw jsonb NOT NULL,
  parse_warnings text[] DEFAULT '{}',
  source text DEFAULT 'owner_research_v1',
  created_at timestamptz DEFAULT now(),

  -- Lifespan
  lifespan_text text,
  lifespan_min_years numeric,
  lifespan_max_years numeric,
  lifespan_open_ended boolean DEFAULT false,

  -- Daily Time Commitment
  daily_time_text text,
  daily_time_min_hours numeric,
  daily_time_max_hours numeric,
  daily_time_open_ended boolean DEFAULT false,

  -- Space & Environment
  min_space_text text,
  space_class text,
  min_space_gallons numeric,
  min_space_sq_ft numeric,
  min_space_sq_in numeric,
  vertical_space_needed boolean DEFAULT false,
  ac_requirement text CHECK (ac_requirement IN ('none', 'recommended', 'required')),

  -- Behavioral / Lifestyle Scores (1-5)
  noise_level smallint CHECK (noise_level BETWEEN 1 AND 5),
  apt_suitability smallint CHECK (apt_suitability BETWEEN 1 AND 5),
  kid_friendly smallint CHECK (kid_friendly BETWEEN 1 AND 5),

  -- Monthly Cost in INR
  monthly_cost_text text,
  monthly_cost_min_inr integer,
  monthly_cost_max_inr integer,

  -- Left Alone Tolerance (Hours)
  left_alone_text text,
  left_alone_min_hours integer,
  left_alone_max_hours integer,
  left_alone_open_ended boolean DEFAULT false,
  left_alone_note text,

  -- Veterinary & Legal Status in India
  exotic_vet_needed boolean,
  legal_status_text text,
  legal_status text CHECK (legal_status IN ('legal', 'registration_required', 'registration_advised', 'restricted', 'discouraged')),
  requires_parivesh boolean DEFAULT false,
  cites_appendix_ii boolean DEFAULT false,
  requires_import_permit boolean DEFAULT false,

  -- Relational integrity checks
  CONSTRAINT chk_bh_lifespan CHECK (lifespan_min_years IS NULL OR lifespan_max_years IS NULL OR lifespan_min_years <= lifespan_max_years),
  CONSTRAINT chk_bh_daily_time CHECK (daily_time_min_hours IS NULL OR daily_time_max_hours IS NULL OR daily_time_min_hours <= daily_time_max_hours),
  CONSTRAINT chk_bh_monthly_cost CHECK (monthly_cost_min_inr IS NULL OR monthly_cost_max_inr IS NULL OR monthly_cost_min_inr <= monthly_cost_max_inr),
  CONSTRAINT chk_bh_left_alone CHECK (left_alone_min_hours IS NULL OR left_alone_max_hours IS NULL OR left_alone_min_hours <= left_alone_max_hours)
);

COMMENT ON TABLE public.breed_husbandry IS 'Layer 1: Broad husbandry, daily maintenance, and legal requirements for 54 companion animal breeds in urban India.';

-- ============================================================================
-- 2. TABLE: breed_detail_mammal (Layer 2 - Deep Dive Mammals: Dogs, Cats, Rabbits)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.breed_detail_mammal (
  breed_id uuid PRIMARY KEY REFERENCES public.breeds(id) ON DELETE CASCADE,
  raw jsonb NOT NULL,
  parse_warnings text[] DEFAULT '{}',
  source text DEFAULT 'owner_research_v1',
  created_at timestamptz DEFAULT now(),

  origin_text text,
  size_text text,
  size_category text,
  weight_text text,
  weight_min_kg numeric,
  weight_max_kg numeric,
  height_text text,
  height_min_cm numeric,
  height_max_cm numeric,
  lifespan_text text,
  lifespan_min_years numeric,
  lifespan_max_years numeric,

  -- Scores (1-5) and physical exercise
  energy_level smallint CHECK (energy_level BETWEEN 1 AND 5),
  exercise_minutes integer,
  exercise_open_ended boolean DEFAULT false,
  trainability smallint CHECK (trainability BETWEEN 1 AND 5),
  intelligence smallint CHECK (intelligence BETWEEN 1 AND 5),
  shedding smallint CHECK (shedding BETWEEN 1 AND 5),
  grooming_needs smallint CHECK (grooming_needs BETWEEN 1 AND 5),
  noise_level smallint CHECK (noise_level BETWEEN 1 AND 5),
  heat_tolerance smallint CHECK (heat_tolerance BETWEEN 1 AND 5),
  cold_tolerance smallint CHECK (cold_tolerance BETWEEN 1 AND 5),
  kids_score smallint CHECK (kids_score BETWEEN 1 AND 5),
  other_pets_score smallint CHECK (other_pets_score BETWEEN 1 AND 5),
  strangers_score smallint CHECK (strangers_score BETWEEN 1 AND 5),
  separation_anxiety smallint CHECK (separation_anxiety BETWEEN 1 AND 5),
  first_time_owner smallint CHECK (first_time_owner BETWEEN 1 AND 5),
  apt_score smallint CHECK (apt_score BETWEEN 1 AND 5),

  -- Medical, Financial, and Acquisition
  health_issues_text text,
  vet_cost_yearly_text text,
  vet_cost_yearly_min_inr integer,
  vet_cost_yearly_max_inr integer,
  price_text text,
  price_type text CHECK (price_type IN ('adoption', 'purchase')),
  price_min_inr integer,
  price_max_inr integer,
  availability text,
  temperament text,

  CONSTRAINT chk_bdm_weight CHECK (weight_min_kg IS NULL OR weight_max_kg IS NULL OR weight_min_kg <= weight_max_kg),
  CONSTRAINT chk_bdm_height CHECK (height_min_cm IS NULL OR height_max_cm IS NULL OR height_min_cm <= height_max_cm),
  CONSTRAINT chk_bdm_lifespan CHECK (lifespan_min_years IS NULL OR lifespan_max_years IS NULL OR lifespan_min_years <= lifespan_max_years),
  CONSTRAINT chk_bdm_vet_cost CHECK (vet_cost_yearly_min_inr IS NULL OR vet_cost_yearly_max_inr IS NULL OR vet_cost_yearly_min_inr <= vet_cost_yearly_max_inr),
  CONSTRAINT chk_bdm_price CHECK (price_min_inr IS NULL OR price_max_inr IS NULL OR price_min_inr <= price_max_inr)
);

COMMENT ON TABLE public.breed_detail_mammal IS 'Layer 2: Detailed morphological, behavioral, medical, and cost attributes for companion mammals.';

-- ============================================================================
-- 3. TABLE: breed_detail_bird (Layer 2 - Deep Dive Birds)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.breed_detail_bird (
  breed_id uuid PRIMARY KEY REFERENCES public.breeds(id) ON DELETE CASCADE,
  raw jsonb NOT NULL,
  parse_warnings text[] DEFAULT '{}',
  source text DEFAULT 'owner_research_v1',
  created_at timestamptz DEFAULT now(),

  origin_text text,
  cage_size_text text,
  cage_length_in numeric,
  cage_width_in numeric,
  cage_height_in numeric,
  lifespan_text text,
  lifespan_min_years numeric,
  lifespan_max_years numeric,

  energy_level smallint CHECK (energy_level BETWEEN 1 AND 5),
  talking_ability smallint CHECK (talking_ability BETWEEN 1 AND 5),
  intelligence smallint CHECK (intelligence BETWEEN 1 AND 5),
  mess_level smallint CHECK (mess_level BETWEEN 1 AND 5),
  noise_level smallint CHECK (noise_level BETWEEN 1 AND 5),
  heat_tolerance smallint CHECK (heat_tolerance BETWEEN 1 AND 5),
  cold_tolerance smallint CHECK (cold_tolerance BETWEEN 1 AND 5),
  kids_score smallint CHECK (kids_score BETWEEN 1 AND 5),
  separation_anxiety smallint CHECK (separation_anxiety BETWEEN 1 AND 5),
  first_time_owner smallint CHECK (first_time_owner BETWEEN 1 AND 5),
  apt_score smallint CHECK (apt_score BETWEEN 1 AND 5),

  health_issues_text text,
  vet_cost_text text,
  vet_cost_min_inr integer,
  vet_cost_max_inr integer,
  vet_cost_period_assumed boolean DEFAULT true,
  price_text text,
  price_type text CHECK (price_type IN ('adoption', 'purchase')),
  price_min_inr integer,
  price_max_inr integer,
  availability text,
  temperament text,

  CONSTRAINT chk_bdb_lifespan CHECK (lifespan_min_years IS NULL OR lifespan_max_years IS NULL OR lifespan_min_years <= lifespan_max_years),
  CONSTRAINT chk_bdb_vet_cost CHECK (vet_cost_min_inr IS NULL OR vet_cost_max_inr IS NULL OR vet_cost_min_inr <= vet_cost_max_inr),
  CONSTRAINT chk_bdb_price CHECK (price_min_inr IS NULL OR price_max_inr IS NULL OR price_min_inr <= price_max_inr)
);

COMMENT ON TABLE public.breed_detail_bird IS 'Layer 2: Specialized avian caging dimensions, mess, talking ability, and veterinary data.';

-- ============================================================================
-- 4. TABLE: breed_detail_aquatic_reptile (Layer 2 - Deep Dive Aquatics & Reptiles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.breed_detail_aquatic_reptile (
  breed_id uuid PRIMARY KEY REFERENCES public.breeds(id) ON DELETE CASCADE,
  raw jsonb NOT NULL,
  parse_warnings text[] DEFAULT '{}',
  source text DEFAULT 'owner_research_v1',
  created_at timestamptz DEFAULT now(),

  origin_text text,
  enclosure_text text,
  enclosure_gallons_min numeric,
  enclosure_open_ended boolean DEFAULT false,
  setup_text text,
  lifespan_text text,
  lifespan_min_years numeric,
  lifespan_max_years numeric,

  care_difficulty smallint CHECK (care_difficulty BETWEEN 1 AND 5),
  heat_tolerance smallint CHECK (heat_tolerance BETWEEN 1 AND 5),
  cold_tolerance smallint CHECK (cold_tolerance BETWEEN 1 AND 5),
  kids_score smallint CHECK (kids_score BETWEEN 1 AND 5),
  first_time_owner smallint CHECK (first_time_owner BETWEEN 1 AND 5),
  apt_score smallint CHECK (apt_score BETWEEN 1 AND 5),

  health_issues_text text,
  vet_cost_text text,
  vet_cost_min_inr integer,
  vet_cost_max_inr integer,
  vet_cost_period_assumed boolean DEFAULT true,
  price_text text,
  price_type text CHECK (price_type IN ('adoption', 'purchase')),
  price_min_inr integer,
  price_max_inr integer,
  availability text,
  temperament text,

  CONSTRAINT chk_bdar_lifespan CHECK (lifespan_min_years IS NULL OR lifespan_max_years IS NULL OR lifespan_min_years <= lifespan_max_years),
  CONSTRAINT chk_bdar_vet_cost CHECK (vet_cost_min_inr IS NULL OR vet_cost_max_inr IS NULL OR vet_cost_min_inr <= vet_cost_max_inr),
  CONSTRAINT chk_bdar_price CHECK (price_min_inr IS NULL OR price_max_inr IS NULL OR price_min_inr <= price_max_inr)
);

COMMENT ON TABLE public.breed_detail_aquatic_reptile IS 'Layer 2: Specialized aquatic and herpetological enclosure, filtration, and care data.';

-- ============================================================================
-- 5. INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_bh_breed_id ON public.breed_husbandry(breed_id);
CREATE INDEX IF NOT EXISTS idx_bh_monthly_cost_apt ON public.breed_husbandry(monthly_cost_min_inr, apt_suitability);
CREATE INDEX IF NOT EXISTS idx_bdm_breed_id ON public.breed_detail_mammal(breed_id);
CREATE INDEX IF NOT EXISTS idx_bdb_breed_id ON public.breed_detail_bird(breed_id);
CREATE INDEX IF NOT EXISTS idx_bdar_breed_id ON public.breed_detail_aquatic_reptile(breed_id);

-- ============================================================================
-- 6. ROW LEVEL SECURITY (Public SELECT; Admin/Service Role write only)
-- ============================================================================
ALTER TABLE public.breed_husbandry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breed_detail_mammal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breed_detail_bird ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breed_detail_aquatic_reptile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bh_public_select" ON public.breed_husbandry FOR SELECT USING (true);
CREATE POLICY "bh_admin_write" ON public.breed_husbandry FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "bdm_public_select" ON public.breed_detail_mammal FOR SELECT USING (true);
CREATE POLICY "bdm_admin_write" ON public.breed_detail_mammal FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "bdb_public_select" ON public.breed_detail_bird FOR SELECT USING (true);
CREATE POLICY "bdb_admin_write" ON public.breed_detail_bird FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "bdar_public_select" ON public.breed_detail_aquatic_reptile FOR SELECT USING (true);
CREATE POLICY "bdar_admin_write" ON public.breed_detail_aquatic_reptile FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================================
-- 7. VIEW: v_breeds_full
-- ============================================================================
CREATE OR REPLACE VIEW public.v_breeds_full AS
SELECT
  -- Core Breed & Species Columns
  b.id AS breed_id,
  b.name AS breed_name,
  b.slug AS breed_slug,
  b.is_indian_native,
  b.size_category AS breed_size_category,
  b.weight_min_kg AS breed_weight_min_kg,
  b.weight_max_kg AS breed_weight_max_kg,
  b.lifespan_min_years AS breed_lifespan_min_years,
  b.lifespan_max_years AS breed_lifespan_max_years,
  b.description AS breed_description,
  b.image_url AS breed_image_url,
  b.source AS breed_source,
  s.id AS species_id,
  s.name AS species_name,
  s.slug AS species_slug,

  -- Layer 1 Husbandry Columns
  bh.lifespan_text AS h_lifespan_text,
  bh.lifespan_min_years AS h_lifespan_min_years,
  bh.lifespan_max_years AS h_lifespan_max_years,
  bh.lifespan_open_ended AS h_lifespan_open_ended,
  bh.daily_time_text AS h_daily_time_text,
  bh.daily_time_min_hours AS h_daily_time_min_hours,
  bh.daily_time_max_hours AS h_daily_time_max_hours,
  bh.daily_time_open_ended AS h_daily_time_open_ended,
  bh.min_space_text AS h_min_space_text,
  bh.space_class AS h_space_class,
  bh.min_space_gallons AS h_min_space_gallons,
  bh.min_space_sq_ft AS h_min_space_sq_ft,
  bh.min_space_sq_in AS h_min_space_sq_in,
  bh.vertical_space_needed AS h_vertical_space_needed,
  bh.ac_requirement AS h_ac_requirement,
  bh.noise_level AS h_noise_level,
  bh.apt_suitability AS h_apt_suitability,
  bh.kid_friendly AS h_kid_friendly,
  bh.monthly_cost_text AS h_monthly_cost_text,
  bh.monthly_cost_min_inr AS h_monthly_cost_min_inr,
  bh.monthly_cost_max_inr AS h_monthly_cost_max_inr,
  bh.left_alone_text AS h_left_alone_text,
  bh.left_alone_min_hours AS h_left_alone_min_hours,
  bh.left_alone_max_hours AS h_left_alone_max_hours,
  bh.left_alone_open_ended AS h_left_alone_open_ended,
  bh.left_alone_note AS h_left_alone_note,
  bh.exotic_vet_needed AS h_exotic_vet_needed,
  bh.legal_status_text AS h_legal_status_text,
  bh.legal_status AS h_legal_status,
  bh.requires_parivesh AS h_requires_parivesh,
  bh.cites_appendix_ii AS h_cites_appendix_ii,
  bh.requires_import_permit AS h_requires_import_permit,
  bh.raw AS h_raw,
  bh.parse_warnings AS h_parse_warnings,

  -- Layer 2 Polymorphic Detail Columns (Prefix d_)
  COALESCE(m.origin_text, brd.origin_text, ar.origin_text) AS d_origin_text,
  m.size_text AS d_size_text,
  m.size_category AS d_size_category,
  m.weight_min_kg AS d_weight_min_kg,
  m.weight_max_kg AS d_weight_max_kg,
  m.height_min_cm AS d_height_min_cm,
  m.height_max_cm AS d_height_max_cm,
  COALESCE(m.lifespan_min_years, brd.lifespan_min_years, ar.lifespan_min_years) AS d_lifespan_min_years,
  COALESCE(m.lifespan_max_years, brd.lifespan_max_years, ar.lifespan_max_years) AS d_lifespan_max_years,
  COALESCE(m.energy_level, brd.energy_level) AS d_energy_level,
  m.exercise_minutes AS d_exercise_minutes,
  m.exercise_open_ended AS d_exercise_open_ended,
  m.trainability AS d_trainability,
  COALESCE(m.intelligence, brd.intelligence) AS d_intelligence,
  m.shedding AS d_shedding,
  m.grooming_needs AS d_grooming_needs,
  COALESCE(m.noise_level, brd.noise_level) AS d_noise_level,
  COALESCE(m.heat_tolerance, brd.heat_tolerance, ar.heat_tolerance) AS d_heat_tolerance,
  COALESCE(m.cold_tolerance, brd.cold_tolerance, ar.cold_tolerance) AS d_cold_tolerance,
  COALESCE(m.kids_score, brd.kids_score, ar.kids_score) AS d_kids_score,
  m.other_pets_score AS d_other_pets_score,
  m.strangers_score AS d_strangers_score,
  COALESCE(m.separation_anxiety, brd.separation_anxiety) AS d_separation_anxiety,
  COALESCE(m.first_time_owner, brd.first_time_owner, ar.first_time_owner) AS d_first_time_owner,
  COALESCE(m.apt_score, brd.apt_score, ar.apt_score) AS d_apt_score,

  -- Avian specific
  brd.cage_size_text AS d_cage_size_text,
  brd.cage_length_in AS d_cage_length_in,
  brd.cage_width_in AS d_cage_width_in,
  brd.cage_height_in AS d_cage_height_in,
  brd.talking_ability AS d_talking_ability,
  brd.mess_level AS d_mess_level,

  -- Aquatic/Reptile specific
  ar.enclosure_text AS d_enclosure_text,
  ar.enclosure_gallons_min AS d_enclosure_gallons_min,
  ar.enclosure_open_ended AS d_enclosure_open_ended,
  ar.setup_text AS d_setup_text,
  ar.care_difficulty AS d_care_difficulty,

  -- Shared Detail Financials & Health
  COALESCE(m.health_issues_text, brd.health_issues_text, ar.health_issues_text) AS d_health_issues_text,
  COALESCE(m.vet_cost_yearly_min_inr, brd.vet_cost_min_inr, ar.vet_cost_min_inr) AS d_vet_cost_min_inr,
  COALESCE(m.vet_cost_yearly_max_inr, brd.vet_cost_max_inr, ar.vet_cost_max_inr) AS d_vet_cost_max_inr,
  COALESCE(m.price_type, brd.price_type, ar.price_type) AS d_price_type,
  COALESCE(m.price_min_inr, brd.price_min_inr, ar.price_min_inr) AS d_price_min_inr,
  COALESCE(m.price_max_inr, brd.price_max_inr, ar.price_max_inr) AS d_price_max_inr,
  COALESCE(m.availability, brd.availability, ar.availability) AS d_availability,
  COALESCE(m.temperament, brd.temperament, ar.temperament) AS d_temperament,
  CASE
    WHEN m.breed_id IS NOT NULL THEN 'mammal'
    WHEN brd.breed_id IS NOT NULL THEN 'bird'
    WHEN ar.breed_id IS NOT NULL THEN 'aquatic_reptile'
    ELSE NULL
  END AS d_detail_layer_type
FROM public.breeds b
JOIN public.species s ON b.species_id = s.id
LEFT JOIN public.breed_husbandry bh ON b.id = bh.breed_id
LEFT JOIN public.breed_detail_mammal m ON b.id = m.breed_id
LEFT JOIN public.breed_detail_bird brd ON b.id = brd.breed_id
LEFT JOIN public.breed_detail_aquatic_reptile ar ON b.id = ar.breed_id;

COMMENT ON VIEW public.v_breeds_full IS 'Consolidated view joining breeds, species, husbandry (Layer 1), and polymorphic details (Layer 2) with d_ prefix.';
