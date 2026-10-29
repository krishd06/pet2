-- ============================================================================
-- PawMatch India: Owner Research Data Import (Idempotent, Single Transaction)
-- Tables: species, breeds, health_conditions, breed_health_conditions,
--         breed_husbandry, breed_detail_mammal, breed_detail_bird, breed_detail_aquatic_reptile
-- ============================================================================

BEGIN;

-- 1. Ensure All Species Exist (Add missing only)
INSERT INTO public.species (name, slug)
VALUES
  ('Dog', 'dog'),
  ('Cat', 'cat'),
  ('Rabbit', 'rabbit'),
  ('Guinea Pig', 'guinea-pig'),
  ('Hamster', 'hamster'),
  ('Exotic Mammal', 'exotic-mammal'),
  ('Bird', 'bird'),
  ('Fish', 'fish'),
  ('Reptile', 'reptile'),
  ('Turtle', 'turtle')
ON CONFLICT (slug) DO NOTHING;

-- 2. Distinct Health Conditions (Upsert case-insensitively, keep exact wording)
INSERT INTO public.health_conditions (name)
VALUES
  ('Tick fever'),
  ('Gastro'),
  ('Hip dysplasia'),
  ('Obesity'),
  ('Ear infections'),
  ('BOAS (breathing)'),
  ('Eye issues'),
  ('Thermal stress'),
  ('Cataracts'),
  ('Kidney disease (old age)'),
  ('PKD'),
  ('Respiratory distress'),
  ('GI Stasis'),
  ('Dental issues'),
  ('Tumors'),
  ('Mites'),
  ('Egg binding'),
  ('Respiratory'),
  ('Feather plucking'),
  ('Calcium'),
  ('Fin rot'),
  ('Dropsy'),
  ('Impaction'),
  ('MBD'),
  ('Shell rot'),
  ('Salmonella')
ON CONFLICT (name) DO NOTHING;

-- 3. Breeds: Insert Only Missing Rows (ON CONFLICT DO NOTHING on species_id, slug)
-- Breed: Indie / Indian Pariah (Dog)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Indie / Indian Pariah', 'indie-indian-pariah', true, 'owner_research_v1',
  13, 16, 'medium',
  'India', 15, 25, 50, 60
FROM public.species s WHERE s.slug = 'dog'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Labrador Retriever (Dog)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Labrador Retriever', 'labrador-retriever', false, 'owner_research_v1',
  10, 12, 'large',
  'Canada', 25, 36, 55, 62
FROM public.species s WHERE s.slug = 'dog'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Golden Retriever (Dog)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Golden Retriever', 'golden-retriever', false, 'owner_research_v1',
  10, 12, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'dog'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: German Shepherd (Dog)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'German Shepherd', 'german-shepherd', false, 'owner_research_v1',
  10, 13, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'dog'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Rottweiler (Dog)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Rottweiler', 'rottweiler', false, 'owner_research_v1',
  9, 10, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'dog'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Doberman Pinscher (Dog)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Doberman Pinscher', 'doberman-pinscher', false, 'owner_research_v1',
  10, 12, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'dog'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Boxer (Dog)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Boxer', 'boxer', false, 'owner_research_v1',
  10, 12, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'dog'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Dalmatian (Dog)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Dalmatian', 'dalmatian', false, 'owner_research_v1',
  10, 13, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'dog'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Shih Tzu (Dog)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Shih Tzu', 'shih-tzu', false, 'owner_research_v1',
  10, 16, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'dog'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Beagle (Dog)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Beagle', 'beagle', false, 'owner_research_v1',
  12, 15, 'medium',
  'UK', 9, 11, 33, 41
FROM public.species s WHERE s.slug = 'dog'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Pug (Dog)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Pug', 'pug', false, 'owner_research_v1',
  12, 15, 'small',
  'China', 6, 8, 25, 30
FROM public.species s WHERE s.slug = 'dog'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: French Bulldog (Dog)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'French Bulldog', 'french-bulldog', false, 'owner_research_v1',
  10, 12, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'dog'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Pomeranian (Dog)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Pomeranian', 'pomeranian', false, 'owner_research_v1',
  12, 16, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'dog'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Dachshund (Dog)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Dachshund', 'dachshund', false, 'owner_research_v1',
  12, 16, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'dog'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Cocker Spaniel (Dog)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Cocker Spaniel', 'cocker-spaniel', false, 'owner_research_v1',
  10, 14, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'dog'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Siberian Husky (Dog)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Siberian Husky', 'siberian-husky', false, 'owner_research_v1',
  12, 14, 'large',
  'Siberia', 20, 27, 50, 60
FROM public.species s WHERE s.slug = 'dog'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Domestic Shorthair (Indie) (Cat)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Domestic Shorthair (Indie)', 'domestic-shorthair-indie', true, 'owner_research_v1',
  12, 15, 'medium',
  'Mixed', 3, 5, 20, 25
FROM public.species s WHERE s.slug = 'cat'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Persian (Cat)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Persian', 'persian', false, 'owner_research_v1',
  12, 15, 'medium',
  'Iran', 3, 5, 20, 25
FROM public.species s WHERE s.slug = 'cat'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Siamese (Cat)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Siamese', 'siamese', false, 'owner_research_v1',
  12, 15, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'cat'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Maine Coon (Cat)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Maine Coon', 'maine-coon', false, 'owner_research_v1',
  12, 15, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'cat'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Bengal Cat (Cat)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Bengal Cat', 'bengal-cat', false, 'owner_research_v1',
  12, 16, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'cat'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: British Shorthair (Cat)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'British Shorthair', 'british-shorthair', false, 'owner_research_v1',
  12, 20, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'cat'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Ragdoll (Cat)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Ragdoll', 'ragdoll', false, 'owner_research_v1',
  12, 15, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'cat'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Bombay Cat (Cat)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Bombay Cat', 'bombay-cat', false, 'owner_research_v1',
  12, 16, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'cat'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Mini Lop (Rabbit)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Mini Lop', 'mini-lop', false, 'owner_research_v1',
  8, 12, 'small',
  'Germany', 1.5, 3, 15, 20
FROM public.species s WHERE s.slug = 'rabbit'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Flemish Giant (Rabbit)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Flemish Giant', 'flemish-giant', false, 'owner_research_v1',
  8, 10, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'rabbit'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Dutch (Rabbit)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Dutch', 'dutch', false, 'owner_research_v1',
  5, 8, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'rabbit'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: American (Shorthair) (Guinea Pig)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'American (Shorthair)', 'american-shorthair', false, 'owner_research_v1',
  5, 8, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'guinea-pig'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Peruvian (Longhair) (Guinea Pig)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Peruvian (Longhair)', 'peruvian-longhair', false, 'owner_research_v1',
  5, 8, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'guinea-pig'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Syrian (Hamster)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Syrian', 'syrian', false, 'owner_research_v1',
  2, 3, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'hamster'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Winter White Dwarf (Hamster)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Winter White Dwarf', 'winter-white-dwarf', false, 'owner_research_v1',
  NULL, 2, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'hamster'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Roborovski Dwarf (Hamster)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Roborovski Dwarf', 'roborovski-dwarf', false, 'owner_research_v1',
  2, 3, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'hamster'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Budgerigar (Budgie) (Bird)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Budgerigar (Budgie)', 'budgerigar-budgie', false, 'owner_research_v1',
  5, 10, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'bird'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Cockatiel (Bird)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Cockatiel', 'cockatiel', false, 'owner_research_v1',
  10, 15, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'bird'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Lovebird (Peach-faced) (Bird)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Lovebird (Peach-faced)', 'lovebird-peach-faced', false, 'owner_research_v1',
  10, 15, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'bird'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Zebra Finch (Bird)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Zebra Finch', 'zebra-finch', false, 'owner_research_v1',
  5, 9, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'bird'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Green-cheeked Conure (Bird)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Green-cheeked Conure', 'green-cheeked-conure', false, 'owner_research_v1',
  10, 15, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'bird'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Sun Conure (Bird)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Sun Conure', 'sun-conure', false, 'owner_research_v1',
  15, 30, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'bird'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: African Grey Parrot (Bird)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'African Grey Parrot', 'african-grey-parrot', false, 'owner_research_v1',
  40, 60, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'bird'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Blue & Gold Macaw (Bird)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Blue & Gold Macaw', 'blue-and-gold-macaw', false, 'owner_research_v1',
  30, 50, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'bird'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Betta (Siamese Fighting) (Fish)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Betta (Siamese Fighting)', 'betta-siamese-fighting', false, 'owner_research_v1',
  2, 5, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'fish'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Fancy Goldfish (Fish)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Fancy Goldfish', 'fancy-goldfish', false, 'owner_research_v1',
  10, 15, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'fish'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Guppy (Fish)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Guppy', 'guppy', false, 'owner_research_v1',
  2, 3, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'fish'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Neon Tetra (Fish)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Neon Tetra', 'neon-tetra', false, 'owner_research_v1',
  2, 5, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'fish'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Angelfish (Fish)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Angelfish', 'angelfish', false, 'owner_research_v1',
  10, 12, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'fish'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Oscar (Fish)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Oscar', 'oscar', false, 'owner_research_v1',
  10, 20, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'fish'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Leopard Gecko (Reptile)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Leopard Gecko', 'leopard-gecko', false, 'owner_research_v1',
  15, 20, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'reptile'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Bearded Dragon (Reptile)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Bearded Dragon', 'bearded-dragon', false, 'owner_research_v1',
  10, 15, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'reptile'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Ball Python (Reptile)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Ball Python', 'ball-python', false, 'owner_research_v1',
  20, 30, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'reptile'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Corn Snake (Reptile)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Corn Snake', 'corn-snake', false, 'owner_research_v1',
  15, 20, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'reptile'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Red-eared Slider (Turtle)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Red-eared Slider', 'red-eared-slider', false, 'owner_research_v1',
  20, 30, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'turtle'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Ferret (Standard) (Exotic Mammal)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Ferret (Standard)', 'ferret-standard', false, 'owner_research_v1',
  6, 8, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'exotic-mammal'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: Sugar Glider (Standard) (Exotic Mammal)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'Sugar Glider (Standard)', 'sugar-glider-standard', false, 'owner_research_v1',
  10, 12, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'exotic-mammal'
ON CONFLICT (species_id, slug) DO NOTHING;

-- Breed: African Pygmy Hedgehog (Exotic Mammal)
INSERT INTO public.breeds (
  species_id, name, slug, is_indian_native, source,
  lifespan_min_years, lifespan_max_years, size_category,
  origin_country, weight_min_kg, weight_max_kg, height_min_cm, height_max_cm
)
SELECT
  s.id, 'African Pygmy Hedgehog', 'african-pygmy-hedgehog', false, 'owner_research_v1',
  3, 5, 'medium',
  NULL, NULL, NULL, NULL, NULL
FROM public.species s WHERE s.slug = 'exotic-mammal'
ON CONFLICT (species_id, slug) DO NOTHING;

-- 4. Backfill NULL Columns on Matched Existing Breeds (Never overwrite existing non-nulls)
UPDATE public.breeds b
SET
  lifespan_min_years = COALESCE(b.lifespan_min_years, 13),
  lifespan_max_years = COALESCE(b.lifespan_max_years, 16),
  size_category = COALESCE(b.size_category, 'medium'),
  origin_country = COALESCE(b.origin_country, 'India'),
  weight_min_kg = COALESCE(b.weight_min_kg, 15),
  weight_max_kg = COALESCE(b.weight_max_kg, 25),
  height_min_cm = COALESCE(b.height_min_cm, 50),
  height_max_cm = COALESCE(b.height_max_cm, 60)
WHERE b.id = (
  SELECT id FROM public.breeds
  WHERE species_id = (SELECT id FROM public.species WHERE slug = 'dog')
    AND (slug = 'indian-pariah-dog' OR slug = 'indie-indian-pariah')
  LIMIT 1
);

UPDATE public.breeds b
SET
  lifespan_min_years = COALESCE(b.lifespan_min_years, 10),
  lifespan_max_years = COALESCE(b.lifespan_max_years, 12),
  size_category = COALESCE(b.size_category, 'large'),
  origin_country = COALESCE(b.origin_country, 'Canada'),
  weight_min_kg = COALESCE(b.weight_min_kg, 25),
  weight_max_kg = COALESCE(b.weight_max_kg, 36),
  height_min_cm = COALESCE(b.height_min_cm, 55),
  height_max_cm = COALESCE(b.height_max_cm, 62)
WHERE b.id = (
  SELECT id FROM public.breeds
  WHERE species_id = (SELECT id FROM public.species WHERE slug = 'dog')
    AND (slug = 'labrador-retriever' OR slug = 'labrador-retriever')
  LIMIT 1
);

UPDATE public.breeds b
SET
  lifespan_min_years = COALESCE(b.lifespan_min_years, 10),
  lifespan_max_years = COALESCE(b.lifespan_max_years, 12),
  size_category = COALESCE(b.size_category, 'medium'),
  origin_country = COALESCE(b.origin_country, NULL),
  weight_min_kg = COALESCE(b.weight_min_kg, NULL),
  weight_max_kg = COALESCE(b.weight_max_kg, NULL),
  height_min_cm = COALESCE(b.height_min_cm, NULL),
  height_max_cm = COALESCE(b.height_max_cm, NULL)
WHERE b.id = (
  SELECT id FROM public.breeds
  WHERE species_id = (SELECT id FROM public.species WHERE slug = 'dog')
    AND (slug = 'golden-retriever' OR slug = 'golden-retriever')
  LIMIT 1
);

UPDATE public.breeds b
SET
  lifespan_min_years = COALESCE(b.lifespan_min_years, 10),
  lifespan_max_years = COALESCE(b.lifespan_max_years, 13),
  size_category = COALESCE(b.size_category, 'medium'),
  origin_country = COALESCE(b.origin_country, NULL),
  weight_min_kg = COALESCE(b.weight_min_kg, NULL),
  weight_max_kg = COALESCE(b.weight_max_kg, NULL),
  height_min_cm = COALESCE(b.height_min_cm, NULL),
  height_max_cm = COALESCE(b.height_max_cm, NULL)
WHERE b.id = (
  SELECT id FROM public.breeds
  WHERE species_id = (SELECT id FROM public.species WHERE slug = 'dog')
    AND (slug = 'german-shepherd' OR slug = 'german-shepherd')
  LIMIT 1
);

UPDATE public.breeds b
SET
  lifespan_min_years = COALESCE(b.lifespan_min_years, 10),
  lifespan_max_years = COALESCE(b.lifespan_max_years, 16),
  size_category = COALESCE(b.size_category, 'medium'),
  origin_country = COALESCE(b.origin_country, NULL),
  weight_min_kg = COALESCE(b.weight_min_kg, NULL),
  weight_max_kg = COALESCE(b.weight_max_kg, NULL),
  height_min_cm = COALESCE(b.height_min_cm, NULL),
  height_max_cm = COALESCE(b.height_max_cm, NULL)
WHERE b.id = (
  SELECT id FROM public.breeds
  WHERE species_id = (SELECT id FROM public.species WHERE slug = 'dog')
    AND (slug = 'shih-tzu' OR slug = 'shih-tzu')
  LIMIT 1
);

UPDATE public.breeds b
SET
  lifespan_min_years = COALESCE(b.lifespan_min_years, 12),
  lifespan_max_years = COALESCE(b.lifespan_max_years, 15),
  size_category = COALESCE(b.size_category, 'medium'),
  origin_country = COALESCE(b.origin_country, 'UK'),
  weight_min_kg = COALESCE(b.weight_min_kg, 9),
  weight_max_kg = COALESCE(b.weight_max_kg, 11),
  height_min_cm = COALESCE(b.height_min_cm, 33),
  height_max_cm = COALESCE(b.height_max_cm, 41)
WHERE b.id = (
  SELECT id FROM public.breeds
  WHERE species_id = (SELECT id FROM public.species WHERE slug = 'dog')
    AND (slug = 'beagle' OR slug = 'beagle')
  LIMIT 1
);

UPDATE public.breeds b
SET
  lifespan_min_years = COALESCE(b.lifespan_min_years, 12),
  lifespan_max_years = COALESCE(b.lifespan_max_years, 15),
  size_category = COALESCE(b.size_category, 'small'),
  origin_country = COALESCE(b.origin_country, 'China'),
  weight_min_kg = COALESCE(b.weight_min_kg, 6),
  weight_max_kg = COALESCE(b.weight_max_kg, 8),
  height_min_cm = COALESCE(b.height_min_cm, 25),
  height_max_cm = COALESCE(b.height_max_cm, 30)
WHERE b.id = (
  SELECT id FROM public.breeds
  WHERE species_id = (SELECT id FROM public.species WHERE slug = 'dog')
    AND (slug = 'pug' OR slug = 'pug')
  LIMIT 1
);

UPDATE public.breeds b
SET
  lifespan_min_years = COALESCE(b.lifespan_min_years, 12),
  lifespan_max_years = COALESCE(b.lifespan_max_years, 15),
  size_category = COALESCE(b.size_category, 'medium'),
  origin_country = COALESCE(b.origin_country, 'Mixed'),
  weight_min_kg = COALESCE(b.weight_min_kg, 3),
  weight_max_kg = COALESCE(b.weight_max_kg, 5),
  height_min_cm = COALESCE(b.height_min_cm, 20),
  height_max_cm = COALESCE(b.height_max_cm, 25)
WHERE b.id = (
  SELECT id FROM public.breeds
  WHERE species_id = (SELECT id FROM public.species WHERE slug = 'cat')
    AND (slug = 'indian-indie-cat' OR slug = 'domestic-shorthair-indie')
  LIMIT 1
);

UPDATE public.breeds b
SET
  lifespan_min_years = COALESCE(b.lifespan_min_years, 12),
  lifespan_max_years = COALESCE(b.lifespan_max_years, 16),
  size_category = COALESCE(b.size_category, 'medium'),
  origin_country = COALESCE(b.origin_country, NULL),
  weight_min_kg = COALESCE(b.weight_min_kg, NULL),
  weight_max_kg = COALESCE(b.weight_max_kg, NULL),
  height_min_cm = COALESCE(b.height_min_cm, NULL),
  height_max_cm = COALESCE(b.height_max_cm, NULL)
WHERE b.id = (
  SELECT id FROM public.breeds
  WHERE species_id = (SELECT id FROM public.species WHERE slug = 'cat')
    AND (slug = 'bengal-cat' OR slug = 'bengal-cat')
  LIMIT 1
);

UPDATE public.breeds b
SET
  lifespan_min_years = COALESCE(b.lifespan_min_years, 12),
  lifespan_max_years = COALESCE(b.lifespan_max_years, 20),
  size_category = COALESCE(b.size_category, 'medium'),
  origin_country = COALESCE(b.origin_country, NULL),
  weight_min_kg = COALESCE(b.weight_min_kg, NULL),
  weight_max_kg = COALESCE(b.weight_max_kg, NULL),
  height_min_cm = COALESCE(b.height_min_cm, NULL),
  height_max_cm = COALESCE(b.height_max_cm, NULL)
WHERE b.id = (
  SELECT id FROM public.breeds
  WHERE species_id = (SELECT id FROM public.species WHERE slug = 'cat')
    AND (slug = 'british-shorthair' OR slug = 'british-shorthair')
  LIMIT 1
);

UPDATE public.breeds b
SET
  lifespan_min_years = COALESCE(b.lifespan_min_years, 12),
  lifespan_max_years = COALESCE(b.lifespan_max_years, 16),
  size_category = COALESCE(b.size_category, 'medium'),
  origin_country = COALESCE(b.origin_country, NULL),
  weight_min_kg = COALESCE(b.weight_min_kg, NULL),
  weight_max_kg = COALESCE(b.weight_max_kg, NULL),
  height_min_cm = COALESCE(b.height_min_cm, NULL),
  height_max_cm = COALESCE(b.height_max_cm, NULL)
WHERE b.id = (
  SELECT id FROM public.breeds
  WHERE species_id = (SELECT id FROM public.species WHERE slug = 'cat')
    AND (slug = 'bombay-cat' OR slug = 'bombay-cat')
  LIMIT 1
);

-- 5. Link Breeds with Health Conditions (Insert only, skip existing)
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('indie-indian-pariah', 'indian-pariah-dog')
  AND hc.name = 'Tick fever'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('indie-indian-pariah', 'indian-pariah-dog')
  AND hc.name = 'Gastro'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('labrador-retriever', 'labrador-retriever')
  AND hc.name = 'Hip dysplasia'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('labrador-retriever', 'labrador-retriever')
  AND hc.name = 'Obesity'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('beagle', 'beagle')
  AND hc.name = 'Ear infections'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('beagle', 'beagle')
  AND hc.name = 'Obesity'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('pug', 'pug')
  AND hc.name = 'BOAS (breathing)'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('pug', 'pug')
  AND hc.name = 'Eye issues'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('siberian-husky')
  AND hc.name = 'Thermal stress'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('siberian-husky')
  AND hc.name = 'Cataracts'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('domestic-shorthair-indie', 'indian-indie-cat')
  AND hc.name = 'Kidney disease (old age)'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('persian')
  AND hc.name = 'PKD'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('persian')
  AND hc.name = 'Respiratory distress'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('mini-lop')
  AND hc.name = 'GI Stasis'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('mini-lop')
  AND hc.name = 'Dental issues'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('budgerigar-budgie')
  AND hc.name = 'Tumors'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('budgerigar-budgie')
  AND hc.name = 'Mites'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('cockatiel')
  AND hc.name = 'Egg binding'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('cockatiel')
  AND hc.name = 'Respiratory'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('african-grey-parrot')
  AND hc.name = 'Feather plucking'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('african-grey-parrot')
  AND hc.name = 'Calcium'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('betta-siamese-fighting')
  AND hc.name = 'Fin rot'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('betta-siamese-fighting')
  AND hc.name = 'Dropsy'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('leopard-gecko')
  AND hc.name = 'Impaction'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('leopard-gecko')
  AND hc.name = 'MBD'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('red-eared-slider')
  AND hc.name = 'Shell rot'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('red-eared-slider')
  AND hc.name = 'MBD'
ON CONFLICT (breed_id, condition_id) DO NOTHING;
INSERT INTO public.breed_health_conditions (breed_id, condition_id)
SELECT b.id, hc.id
FROM public.breeds b
CROSS JOIN public.health_conditions hc
WHERE b.slug IN ('red-eared-slider')
  AND hc.name = 'Salmonella'
ON CONFLICT (breed_id, condition_id) DO NOTHING;

-- 6. Breed Husbandry (Layer 1 - 54 Rows, Upsert on breed_id)
INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Dog","Breed":"Indie / Indian Pariah","Lifespan":"13–16 yrs","Daily Time Needed":"2–3 hrs","Min Space Needed":"Medium","Noise (1-5)":"3","Monthly Cost (₹)":"₹2,000–₹4,000","Apt Suitability (1-5)":"4","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"4","Exotic Vet Needed?":"No","Legal Status in India":"Legal. Highly suited for Indian climate."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '13–16 yrs', 13, 16, false,
  '2–3 hrs', 2, 3, false,
  'Medium', 'medium', NULL, NULL, NULL,
  false, 'none',
  3, 4, 4,
  '₹2,000–₹4,000', 2000, 4000,
  '4–6', 4, 6, false, NULL,
  false, 'Legal. Highly suited for Indian climate.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('indie-indian-pariah', 'indian-pariah-dog')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Dog","Breed":"Labrador Retriever","Lifespan":"10–12 yrs","Daily Time Needed":"2–4 hrs","Min Space Needed":"Large","Noise (1-5)":"3","Monthly Cost (₹)":"₹4,000–₹7,000","Apt Suitability (1-5)":"3","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"5","Exotic Vet Needed?":"No","Legal Status in India":"Legal."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '10–12 yrs', 10, 12, false,
  '2–4 hrs', 2, 4, false,
  'Large', 'large', NULL, NULL, NULL,
  false, 'none',
  3, 3, 5,
  '₹4,000–₹7,000', 4000, 7000,
  '4–6', 4, 6, false, NULL,
  false, 'Legal.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('labrador-retriever', 'labrador-retriever')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Dog","Breed":"Golden Retriever","Lifespan":"10–12 yrs","Daily Time Needed":"2–4 hrs","Min Space Needed":"Large","Noise (1-5)":"3","Monthly Cost (₹)":"₹4,000–₹7,000","Apt Suitability (1-5)":"3","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"5","Exotic Vet Needed?":"No","Legal Status in India":"Legal."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '10–12 yrs', 10, 12, false,
  '2–4 hrs', 2, 4, false,
  'Large', 'large', NULL, NULL, NULL,
  false, 'none',
  3, 3, 5,
  '₹4,000–₹7,000', 4000, 7000,
  '4–6', 4, 6, false, NULL,
  false, 'Legal.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('golden-retriever', 'golden-retriever')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Dog","Breed":"German Shepherd","Lifespan":"10–13 yrs","Daily Time Needed":"3–4 hrs","Min Space Needed":"Large","Noise (1-5)":"4","Monthly Cost (₹)":"₹5,000–₹8,000","Apt Suitability (1-5)":"2","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"4","Exotic Vet Needed?":"No","Legal Status in India":"Legal. High exercise requirement."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '10–13 yrs', 10, 13, false,
  '3–4 hrs', 3, 4, false,
  'Large', 'large', NULL, NULL, NULL,
  false, 'none',
  4, 2, 4,
  '₹5,000–₹8,000', 5000, 8000,
  '4–6', 4, 6, false, NULL,
  false, 'Legal. High exercise requirement.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('german-shepherd', 'german-shepherd')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Dog","Breed":"Rottweiler","Lifespan":"9–10 yrs","Daily Time Needed":"2–3 hrs","Min Space Needed":"Large","Noise (1-5)":"3","Monthly Cost (₹)":"₹5,000–₹8,000","Apt Suitability (1-5)":"2","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"No","Legal Status in India":"Legal. Strict socialization needed; some RWA limits."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '9–10 yrs', 9, 10, false,
  '2–3 hrs', 2, 3, false,
  'Large', 'large', NULL, NULL, NULL,
  false, 'none',
  3, 2, 3,
  '₹5,000–₹8,000', 5000, 8000,
  '4–6', 4, 6, false, NULL,
  false, 'Legal. Strict socialization needed; some RWA limits.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('rottweiler')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Dog","Breed":"Doberman Pinscher","Lifespan":"10–12 yrs","Daily Time Needed":"3–4 hrs","Min Space Needed":"Large","Noise (1-5)":"3","Monthly Cost (₹)":"₹4,000–₹7,000","Apt Suitability (1-5)":"2","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"4","Exotic Vet Needed?":"No","Legal Status in India":"Legal."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '10–12 yrs', 10, 12, false,
  '3–4 hrs', 3, 4, false,
  'Large', 'large', NULL, NULL, NULL,
  false, 'none',
  3, 2, 4,
  '₹4,000–₹7,000', 4000, 7000,
  '4–6', 4, 6, false, NULL,
  false, 'Legal.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('doberman-pinscher')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Dog","Breed":"Boxer","Lifespan":"10–12 yrs","Daily Time Needed":"2–3 hrs","Min Space Needed":"Large","Noise (1-5)":"3","Monthly Cost (₹)":"₹4,000–₹7,000","Apt Suitability (1-5)":"3","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"5","Exotic Vet Needed?":"No","Legal Status in India":"Legal."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '10–12 yrs', 10, 12, false,
  '2–3 hrs', 2, 3, false,
  'Large', 'large', NULL, NULL, NULL,
  false, 'none',
  3, 3, 5,
  '₹4,000–₹7,000', 4000, 7000,
  '4–6', 4, 6, false, NULL,
  false, 'Legal.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('boxer')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Dog","Breed":"Dalmatian","Lifespan":"10–13 yrs","Daily Time Needed":"2–3 hrs","Min Space Needed":"Large","Noise (1-5)":"3","Monthly Cost (₹)":"₹3,000–₹6,000","Apt Suitability (1-5)":"3","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"4","Exotic Vet Needed?":"No","Legal Status in India":"Legal. High energy."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '10–13 yrs', 10, 13, false,
  '2–3 hrs', 2, 3, false,
  'Large', 'large', NULL, NULL, NULL,
  false, 'none',
  3, 3, 4,
  '₹3,000–₹6,000', 3000, 6000,
  '4–6', 4, 6, false, NULL,
  false, 'Legal. High energy.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('dalmatian')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Dog","Breed":"Shih Tzu","Lifespan":"10–16 yrs","Daily Time Needed":"1–2 hrs","Min Space Needed":"Small","Noise (1-5)":"2","Monthly Cost (₹)":"₹3,000–₹6,000","Apt Suitability (1-5)":"5","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"No","Legal Status in India":"Legal. Requires AC & high grooming."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '10–16 yrs', 10, 16, false,
  '1–2 hrs', 1, 2, false,
  'Small', 'small', NULL, NULL, NULL,
  false, 'required',
  2, 5, 3,
  '₹3,000–₹6,000', 3000, 6000,
  '4–6', 4, 6, false, NULL,
  false, 'Legal. Requires AC & high grooming.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('shih-tzu', 'shih-tzu')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Dog","Breed":"Beagle","Lifespan":"12–15 yrs","Daily Time Needed":"2–3 hrs","Min Space Needed":"Medium","Noise (1-5)":"5","Monthly Cost (₹)":"₹3,000–₹5,000","Apt Suitability (1-5)":"3","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"4","Exotic Vet Needed?":"No","Legal Status in India":"Legal. Highly vocal (howling)."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '12–15 yrs', 12, 15, false,
  '2–3 hrs', 2, 3, false,
  'Medium', 'medium', NULL, NULL, NULL,
  false, 'none',
  5, 3, 4,
  '₹3,000–₹5,000', 3000, 5000,
  '4–6', 4, 6, false, NULL,
  false, 'Legal. Highly vocal (howling).', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('beagle', 'beagle')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Dog","Breed":"Pug","Lifespan":"12–15 yrs","Daily Time Needed":"1–2 hrs","Min Space Needed":"Small","Noise (1-5)":"2","Monthly Cost (₹)":"₹3,000–₹5,000","Apt Suitability (1-5)":"5","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"4","Exotic Vet Needed?":"No","Legal Status in India":"Legal. High risk of heatstroke in India."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '12–15 yrs', 12, 15, false,
  '1–2 hrs', 1, 2, false,
  'Small', 'small', NULL, NULL, NULL,
  false, 'none',
  2, 5, 4,
  '₹3,000–₹5,000', 3000, 5000,
  '4–6', 4, 6, false, NULL,
  false, 'Legal. High risk of heatstroke in India.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('pug', 'pug')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Dog","Breed":"French Bulldog","Lifespan":"10–12 yrs","Daily Time Needed":"1–2 hrs","Min Space Needed":"Small","Noise (1-5)":"2","Monthly Cost (₹)":"₹4,000–₹8,000","Apt Suitability (1-5)":"5","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"4","Exotic Vet Needed?":"No","Legal Status in India":"Legal. Severe heatstroke risk; AC mandatory."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '10–12 yrs', 10, 12, false,
  '1–2 hrs', 1, 2, false,
  'Small', 'small', NULL, NULL, NULL,
  false, 'required',
  2, 5, 4,
  '₹4,000–₹8,000', 4000, 8000,
  '4–6', 4, 6, false, NULL,
  false, 'Legal. Severe heatstroke risk; AC mandatory.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('french-bulldog')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Dog","Breed":"Pomeranian","Lifespan":"12–16 yrs","Daily Time Needed":"1–2 hrs","Min Space Needed":"Small","Noise (1-5)":"5","Monthly Cost (₹)":"₹2,000–₹4,000","Apt Suitability (1-5)":"5","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"No","Legal Status in India":"Legal. Highly vocal."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '12–16 yrs', 12, 16, false,
  '1–2 hrs', 1, 2, false,
  'Small', 'small', NULL, NULL, NULL,
  false, 'none',
  5, 5, 3,
  '₹2,000–₹4,000', 2000, 4000,
  '4–6', 4, 6, false, NULL,
  false, 'Legal. Highly vocal.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('pomeranian')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Dog","Breed":"Dachshund","Lifespan":"12–16 yrs","Daily Time Needed":"1–2 hrs","Min Space Needed":"Small","Noise (1-5)":"4","Monthly Cost (₹)":"₹2,000–₹4,000","Apt Suitability (1-5)":"5","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"No","Legal Status in India":"Legal. Spine precautions necessary."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '12–16 yrs', 12, 16, false,
  '1–2 hrs', 1, 2, false,
  'Small', 'small', NULL, NULL, NULL,
  false, 'none',
  4, 5, 3,
  '₹2,000–₹4,000', 2000, 4000,
  '4–6', 4, 6, false, NULL,
  false, 'Legal. Spine precautions necessary.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('dachshund')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Dog","Breed":"Cocker Spaniel","Lifespan":"10–14 yrs","Daily Time Needed":"2–3 hrs","Min Space Needed":"Medium","Noise (1-5)":"3","Monthly Cost (₹)":"₹3,000–₹6,000","Apt Suitability (1-5)":"4","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"5","Exotic Vet Needed?":"No","Legal Status in India":"Legal. High grooming needs."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '10–14 yrs', 10, 14, false,
  '2–3 hrs', 2, 3, false,
  'Medium', 'medium', NULL, NULL, NULL,
  false, 'none',
  3, 4, 5,
  '₹3,000–₹6,000', 3000, 6000,
  '4–6', 4, 6, false, NULL,
  false, 'Legal. High grooming needs.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('cocker-spaniel')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Dog","Breed":"Siberian Husky","Lifespan":"12–14 yrs","Daily Time Needed":"3–4 hrs","Min Space Needed":"Large (AC Mandatory)","Noise (1-5)":"4","Monthly Cost (₹)":"₹6,000–₹10,000","Apt Suitability (1-5)":"2","Left Alone (hrs)":"4","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"No","Legal Status in India":"Legal. Prone to severe thermal stress in India."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '12–14 yrs', 12, 14, false,
  '3–4 hrs', 3, 4, false,
  'Large (AC Mandatory)', 'large', NULL, NULL, NULL,
  false, 'required',
  4, 2, 3,
  '₹6,000–₹10,000', 6000, 10000,
  '4', 4, 4, false, NULL,
  false, 'Legal. Prone to severe thermal stress in India.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('siberian-husky')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Cat","Breed":"Domestic Shorthair (Indie)","Lifespan":"12–15 yrs","Daily Time Needed":"1–2 hrs","Min Space Needed":"Medium (Vertical space)","Noise (1-5)":"2","Monthly Cost (₹)":"₹1,500–₹3,000","Apt Suitability (1-5)":"5","Left Alone (hrs)":"8–10","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"No","Legal Status in India":"Legal."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '12–15 yrs', 12, 15, false,
  '1–2 hrs', 1, 2, false,
  'Medium (Vertical space)', 'medium', NULL, NULL, NULL,
  true, 'none',
  2, 5, 3,
  '₹1,500–₹3,000', 1500, 3000,
  '8–10', 8, 10, false, NULL,
  false, 'Legal.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('domestic-shorthair-indie', 'indian-indie-cat')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Cat","Breed":"Persian","Lifespan":"12–15 yrs","Daily Time Needed":"1–2 hrs","Min Space Needed":"Medium (Vertical space)","Noise (1-5)":"1","Monthly Cost (₹)":"₹3,000–₹5,000","Apt Suitability (1-5)":"5","Left Alone (hrs)":"8–10","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"No","Legal Status in India":"Legal. Requires AC & daily grooming."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '12–15 yrs', 12, 15, false,
  '1–2 hrs', 1, 2, false,
  'Medium (Vertical space)', 'medium', NULL, NULL, NULL,
  true, 'required',
  1, 5, 3,
  '₹3,000–₹5,000', 3000, 5000,
  '8–10', 8, 10, false, NULL,
  false, 'Legal. Requires AC & daily grooming.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('persian')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Cat","Breed":"Siamese","Lifespan":"12–15 yrs","Daily Time Needed":"2 hrs","Min Space Needed":"Medium (Vertical space)","Noise (1-5)":"4","Monthly Cost (₹)":"₹2,000–₹4,000","Apt Suitability (1-5)":"4","Left Alone (hrs)":"6–8","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"No","Legal Status in India":"Legal. Highly vocal and social."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '12–15 yrs', 12, 15, false,
  '2 hrs', 2, 2, false,
  'Medium (Vertical space)', 'medium', NULL, NULL, NULL,
  true, 'none',
  4, 4, 3,
  '₹2,000–₹4,000', 2000, 4000,
  '6–8', 6, 8, false, NULL,
  false, 'Legal. Highly vocal and social.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('siamese')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Cat","Breed":"Maine Coon","Lifespan":"12–15 yrs","Daily Time Needed":"2 hrs","Min Space Needed":"Large (Vertical space)","Noise (1-5)":"2","Monthly Cost (₹)":"₹4,000–₹7,000","Apt Suitability (1-5)":"4","Left Alone (hrs)":"6–8","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"No","Legal Status in India":"Legal. Needs large space and thermal management."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '12–15 yrs', 12, 15, false,
  '2 hrs', 2, 2, false,
  'Large (Vertical space)', 'large', NULL, NULL, NULL,
  true, 'none',
  2, 4, 3,
  '₹4,000–₹7,000', 4000, 7000,
  '6–8', 6, 8, false, NULL,
  false, 'Legal. Needs large space and thermal management.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('maine-coon')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Cat","Breed":"Bengal Cat","Lifespan":"12–16 yrs","Daily Time Needed":"2–3 hrs","Min Space Needed":"Large (Vertical space)","Noise (1-5)":"3","Monthly Cost (₹)":"₹3,000–₹5,000","Apt Suitability (1-5)":"3","Left Alone (hrs)":"6–8","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"No","Legal Status in India":"Legal. High energy, needs intense enrichment."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '12–16 yrs', 12, 16, false,
  '2–3 hrs', 2, 3, false,
  'Large (Vertical space)', 'large', NULL, NULL, NULL,
  true, 'none',
  3, 3, 3,
  '₹3,000–₹5,000', 3000, 5000,
  '6–8', 6, 8, false, NULL,
  false, 'Legal. High energy, needs intense enrichment.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('bengal-cat', 'bengal-cat')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Cat","Breed":"British Shorthair","Lifespan":"12–20 yrs","Daily Time Needed":"1–2 hrs","Min Space Needed":"Medium (Vertical space)","Noise (1-5)":"1","Monthly Cost (₹)":"₹3,000–₹5,000","Apt Suitability (1-5)":"5","Left Alone (hrs)":"8–10","Kid-Friendly (1-5)":"4","Exotic Vet Needed?":"No","Legal Status in India":"Legal."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '12–20 yrs', 12, 20, false,
  '1–2 hrs', 1, 2, false,
  'Medium (Vertical space)', 'medium', NULL, NULL, NULL,
  true, 'none',
  1, 5, 4,
  '₹3,000–₹5,000', 3000, 5000,
  '8–10', 8, 10, false, NULL,
  false, 'Legal.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('british-shorthair', 'british-shorthair')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Cat","Breed":"Ragdoll","Lifespan":"12–15 yrs","Daily Time Needed":"1–2 hrs","Min Space Needed":"Large (Indoor only)","Noise (1-5)":"1","Monthly Cost (₹)":"₹3,000–₹6,000","Apt Suitability (1-5)":"5","Left Alone (hrs)":"6–8","Kid-Friendly (1-5)":"5","Exotic Vet Needed?":"No","Legal Status in India":"Legal. AC recommended."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '12–15 yrs', 12, 15, false,
  '1–2 hrs', 1, 2, false,
  'Large (Indoor only)', 'large', NULL, NULL, NULL,
  false, 'recommended',
  1, 5, 5,
  '₹3,000–₹6,000', 3000, 6000,
  '6–8', 6, 8, false, NULL,
  false, 'Legal. AC recommended.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('ragdoll')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Cat","Breed":"Bombay Cat","Lifespan":"12–16 yrs","Daily Time Needed":"1–2 hrs","Min Space Needed":"Medium (Vertical space)","Noise (1-5)":"3","Monthly Cost (₹)":"₹1,500–₹3,000","Apt Suitability (1-5)":"5","Left Alone (hrs)":"8–10","Kid-Friendly (1-5)":"4","Exotic Vet Needed?":"No","Legal Status in India":"Legal."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '12–16 yrs', 12, 16, false,
  '1–2 hrs', 1, 2, false,
  'Medium (Vertical space)', 'medium', NULL, NULL, NULL,
  true, 'none',
  3, 5, 4,
  '₹1,500–₹3,000', 1500, 3000,
  '8–10', 8, 10, false, NULL,
  false, 'Legal.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('bombay-cat', 'bombay-cat')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Rabbit","Breed":"Mini Lop","Lifespan":"8–12 yrs","Daily Time Needed":"2–3 hrs","Min Space Needed":"Large enclosure (Free roam)","Noise (1-5)":"1","Monthly Cost (₹)":"₹1,500–₹3,000","Apt Suitability (1-5)":"4","Left Alone (hrs)":"6–8","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal (Domestic breeds only)."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '8–12 yrs', 8, 12, false,
  '2–3 hrs', 2, 3, false,
  'Large enclosure (Free roam)', 'large', NULL, NULL, NULL,
  false, 'none',
  1, 4, 3,
  '₹1,500–₹3,000', 1500, 3000,
  '6–8', 6, 8, false, NULL,
  true, 'Legal (Domestic breeds only).', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('mini-lop')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Rabbit","Breed":"Flemish Giant","Lifespan":"8–10 yrs","Daily Time Needed":"2–3 hrs","Min Space Needed":"Very Large (Room/Free roam)","Noise (1-5)":"1","Monthly Cost (₹)":"₹2,500–₹4,500","Apt Suitability (1-5)":"3","Left Alone (hrs)":"6–8","Kid-Friendly (1-5)":"4","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal (Domestic breeds only)."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '8–10 yrs', 8, 10, false,
  '2–3 hrs', 2, 3, false,
  'Very Large (Room/Free roam)', 'very_large', NULL, NULL, NULL,
  false, 'none',
  1, 3, 4,
  '₹2,500–₹4,500', 2500, 4500,
  '6–8', 6, 8, false, NULL,
  true, 'Legal (Domestic breeds only).', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('flemish-giant')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Rabbit","Breed":"Dutch","Lifespan":"5–8 yrs","Daily Time Needed":"2–3 hrs","Min Space Needed":"Large enclosure (Free roam)","Noise (1-5)":"1","Monthly Cost (₹)":"₹1,500–₹3,000","Apt Suitability (1-5)":"4","Left Alone (hrs)":"6–8","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal (Domestic breeds only)."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '5–8 yrs', 5, 8, false,
  '2–3 hrs', 2, 3, false,
  'Large enclosure (Free roam)', 'large', NULL, NULL, NULL,
  false, 'none',
  1, 4, 3,
  '₹1,500–₹3,000', 1500, 3000,
  '6–8', 6, 8, false, NULL,
  true, 'Legal (Domestic breeds only).', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('dutch')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Guinea Pig","Breed":"American (Shorthair)","Lifespan":"5–8 yrs","Daily Time Needed":"1–2 hrs","Min Space Needed":"8 sq. ft. min (Must be paired)","Noise (1-5)":"3","Monthly Cost (₹)":"₹1,500–₹2,500","Apt Suitability (1-5)":"4","Left Alone (hrs)":"6–8","Kid-Friendly (1-5)":"4","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal. Must be kept in conspecific pairs."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '5–8 yrs', 5, 8, false,
  '1–2 hrs', 1, 2, false,
  '8 sq. ft. min (Must be paired)', NULL, NULL, 8, NULL,
  false, 'none',
  3, 4, 4,
  '₹1,500–₹2,500', 1500, 2500,
  '6–8', 6, 8, false, NULL,
  true, 'Legal. Must be kept in conspecific pairs.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('american-shorthair')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Guinea Pig","Breed":"Peruvian (Longhair)","Lifespan":"5–8 yrs","Daily Time Needed":"2 hrs","Min Space Needed":"8 sq. ft. min (Must be paired)","Noise (1-5)":"3","Monthly Cost (₹)":"₹2,000–₹3,000","Apt Suitability (1-5)":"4","Left Alone (hrs)":"6–8","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal. High grooming needs; must be paired."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '5–8 yrs', 5, 8, false,
  '2 hrs', 2, 2, false,
  '8 sq. ft. min (Must be paired)', NULL, NULL, 8, NULL,
  false, 'none',
  3, 4, 3,
  '₹2,000–₹3,000', 2000, 3000,
  '6–8', 6, 8, false, NULL,
  true, 'Legal. High grooming needs; must be paired.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('peruvian-longhair')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Hamster","Breed":"Syrian","Lifespan":"2–3 yrs","Daily Time Needed":"0.5–1 hr","Min Space Needed":"450 sq. in. unbroken floor","Noise (1-5)":"1","Monthly Cost (₹)":"₹500–₹1,200","Apt Suitability (1-5)":"5","Left Alone (hrs)":"12–24","Kid-Friendly (1-5)":"2","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal. Strict solitary housing required."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '2–3 yrs', 2, 3, false,
  '0.5–1 hr', 0.5, 1, false,
  '450 sq. in. unbroken floor', NULL, NULL, NULL, 450,
  false, 'none',
  1, 5, 2,
  '₹500–₹1,200', 500, 1200,
  '12–24', 12, 24, false, NULL,
  true, 'Legal. Strict solitary housing required.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('syrian')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Hamster","Breed":"Winter White Dwarf","Lifespan":"1.5–2 yrs","Daily Time Needed":"0.5–1 hr","Min Space Needed":"450 sq. in. unbroken floor","Noise (1-5)":"1","Monthly Cost (₹)":"₹500–₹1,200","Apt Suitability (1-5)":"5","Left Alone (hrs)":"12–24","Kid-Friendly (1-5)":"2","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal. Usually solitary."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '1.5–2 yrs', 1.5, 2, false,
  '0.5–1 hr', 0.5, 1, false,
  '450 sq. in. unbroken floor', NULL, NULL, NULL, 450,
  false, 'none',
  1, 5, 2,
  '₹500–₹1,200', 500, 1200,
  '12–24', 12, 24, false, NULL,
  true, 'Legal. Usually solitary.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('winter-white-dwarf')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Hamster","Breed":"Roborovski Dwarf","Lifespan":"2–3 yrs","Daily Time Needed":"0.5 hr","Min Space Needed":"450 sq. in. unbroken floor","Noise (1-5)":"1","Monthly Cost (₹)":"₹500–₹1,200","Apt Suitability (1-5)":"5","Left Alone (hrs)":"12–24","Kid-Friendly (1-5)":"1","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal. Very fast, not for handling."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '2–3 yrs', 2, 3, false,
  '0.5 hr', 0.5, 0.5, false,
  '450 sq. in. unbroken floor', NULL, NULL, NULL, 450,
  false, 'none',
  1, 5, 1,
  '₹500–₹1,200', 500, 1200,
  '12–24', 12, 24, false, NULL,
  true, 'Legal. Very fast, not for handling.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('roborovski-dwarf')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Bird","Breed":"Budgerigar (Budgie)","Lifespan":"5–10 yrs","Daily Time Needed":"2–3 hrs","Min Space Needed":"Large flight cage","Noise (1-5)":"4","Monthly Cost (₹)":"₹500–₹1,500","Apt Suitability (1-5)":"3","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal (Non-native)."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '5–10 yrs', 5, 10, false,
  '2–3 hrs', 2, 3, false,
  'Large flight cage', 'large', NULL, NULL, NULL,
  false, 'none',
  4, 3, 3,
  '₹500–₹1,500', 500, 1500,
  '4–6', 4, 6, false, NULL,
  true, 'Legal (Non-native).', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('budgerigar-budgie')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Bird","Breed":"Cockatiel","Lifespan":"10–15 yrs","Daily Time Needed":"2–3 hrs","Min Space Needed":"Large flight cage","Noise (1-5)":"4","Monthly Cost (₹)":"₹1,000–₹2,000","Apt Suitability (1-5)":"3","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal (Non-native)."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '10–15 yrs', 10, 15, false,
  '2–3 hrs', 2, 3, false,
  'Large flight cage', 'large', NULL, NULL, NULL,
  false, 'none',
  4, 3, 3,
  '₹1,000–₹2,000', 1000, 2000,
  '4–6', 4, 6, false, NULL,
  true, 'Legal (Non-native).', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('cockatiel')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Bird","Breed":"Lovebird (Peach-faced)","Lifespan":"10–15 yrs","Daily Time Needed":"2–3 hrs","Min Space Needed":"Large flight cage","Noise (1-5)":"4","Monthly Cost (₹)":"₹1,000–₹2,000","Apt Suitability (1-5)":"3","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal (Non-native)."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '10–15 yrs', 10, 15, false,
  '2–3 hrs', 2, 3, false,
  'Large flight cage', 'large', NULL, NULL, NULL,
  false, 'none',
  4, 3, 3,
  '₹1,000–₹2,000', 1000, 2000,
  '4–6', 4, 6, false, NULL,
  true, 'Legal (Non-native).', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('lovebird-peach-faced')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Bird","Breed":"Zebra Finch","Lifespan":"5–9 yrs","Daily Time Needed":"0.5–1 hr","Min Space Needed":"Flight cage (Horizontal)","Noise (1-5)":"2","Monthly Cost (₹)":"₹500–₹1,000","Apt Suitability (1-5)":"5","Left Alone (hrs)":"8–10","Kid-Friendly (1-5)":"2","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal (Non-native). Do best in pairs/flocks."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '5–9 yrs', 5, 9, false,
  '0.5–1 hr', 0.5, 1, false,
  'Flight cage (Horizontal)', NULL, NULL, NULL, NULL,
  false, 'none',
  2, 5, 2,
  '₹500–₹1,000', 500, 1000,
  '8–10', 8, 10, false, NULL,
  true, 'Legal (Non-native). Do best in pairs/flocks.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('zebra-finch')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Bird","Breed":"Green-cheeked Conure","Lifespan":"10–15 yrs","Daily Time Needed":"3–4 hrs","Min Space Needed":"Large flight cage + outside time","Noise (1-5)":"3","Monthly Cost (₹)":"₹1,500–₹3,000","Apt Suitability (1-5)":"3","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal (Non-native). PARIVESH 2.0 registration mandatory (CITES App II)."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '10–15 yrs', 10, 15, false,
  '3–4 hrs', 3, 4, false,
  'Large flight cage + outside time', 'large', NULL, NULL, NULL,
  false, 'none',
  3, 3, 3,
  '₹1,500–₹3,000', 1500, 3000,
  '4–6', 4, 6, false, NULL,
  true, 'Legal (Non-native). PARIVESH 2.0 registration mandatory (CITES App II).', 'registration_required', true, true, false
FROM public.breeds b
WHERE b.slug IN ('green-cheeked-conure')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Bird","Breed":"Sun Conure","Lifespan":"15–30 yrs","Daily Time Needed":"3–4 hrs","Min Space Needed":"Large flight cage + outside time","Noise (1-5)":"5","Monthly Cost (₹)":"₹2,000–₹4,000","Apt Suitability (1-5)":"2","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal (Non-native). Extremely loud, poor for apartments."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '15–30 yrs', 15, 30, false,
  '3–4 hrs', 3, 4, false,
  'Large flight cage + outside time', 'large', NULL, NULL, NULL,
  false, 'none',
  5, 2, 3,
  '₹2,000–₹4,000', 2000, 4000,
  '4–6', 4, 6, false, NULL,
  true, 'Legal (Non-native). Extremely loud, poor for apartments.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('sun-conure')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Bird","Breed":"African Grey Parrot","Lifespan":"40–60 yrs","Daily Time Needed":"4–5 hrs","Min Space Needed":"Large cage / Aviary","Noise (1-5)":"4","Monthly Cost (₹)":"₹3,000–₹6,000","Apt Suitability (1-5)":"2","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"2","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal (Non-native). PARIVESH 2.0 registration mandatory."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '40–60 yrs', 40, 60, false,
  '4–5 hrs', 4, 5, false,
  'Large cage / Aviary', 'large', NULL, NULL, NULL,
  false, 'none',
  4, 2, 2,
  '₹3,000–₹6,000', 3000, 6000,
  '4–6', 4, 6, false, NULL,
  true, 'Legal (Non-native). PARIVESH 2.0 registration mandatory.', 'registration_required', true, false, false
FROM public.breeds b
WHERE b.slug IN ('african-grey-parrot')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Bird","Breed":"Blue & Gold Macaw","Lifespan":"30–50+ yrs","Daily Time Needed":"4–5 hrs","Min Space Needed":"Massive Aviary","Noise (1-5)":"5","Monthly Cost (₹)":"₹5,000–₹10,000","Apt Suitability (1-5)":"1","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"2","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal (Non-native). PARIVESH 2.0 registration mandatory."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '30–50+ yrs', 30, 50, true,
  '4–5 hrs', 4, 5, false,
  'Massive Aviary', 'massive', NULL, NULL, NULL,
  false, 'none',
  5, 1, 2,
  '₹5,000–₹10,000', 5000, 10000,
  '4–6', 4, 6, false, NULL,
  true, 'Legal (Non-native). PARIVESH 2.0 registration mandatory.', 'registration_required', true, false, false
FROM public.breeds b
WHERE b.slug IN ('blue-and-gold-macaw')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Fish","Breed":"Betta (Siamese Fighting)","Lifespan":"2–5 yrs","Daily Time Needed":"0.5 hrs","Min Space Needed":"5–10 gallons (Heated/Filtered)","Noise (1-5)":"1","Monthly Cost (₹)":"₹500–₹1,000","Apt Suitability (1-5)":"5","Left Alone (hrs)":"24+","Kid-Friendly (1-5)":"2","Exotic Vet Needed?":"No","Legal Status in India":"Legal. Strict solitary housing for males."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '2–5 yrs', 2, 5, false,
  '0.5 hrs', 0.5, 0.5, false,
  '5–10 gallons (Heated/Filtered)', NULL, 5, NULL, NULL,
  false, 'none',
  1, 5, 2,
  '₹500–₹1,000', 500, 1000,
  '24+', 24, 24, true, NULL,
  false, 'Legal. Strict solitary housing for males.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('betta-siamese-fighting')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Fish","Breed":"Fancy Goldfish","Lifespan":"10–15 yrs","Daily Time Needed":"0.5 hrs","Min Space Needed":"30+ gallons (High filtration)","Noise (1-5)":"1","Monthly Cost (₹)":"₹1,000–₹2,000","Apt Suitability (1-5)":"4","Left Alone (hrs)":"24+","Kid-Friendly (1-5)":"2","Exotic Vet Needed?":"No","Legal Status in India":"Legal. Massive bio-load requires large tanks."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '10–15 yrs', 10, 15, false,
  '0.5 hrs', 0.5, 0.5, false,
  '30+ gallons (High filtration)', NULL, 30, NULL, NULL,
  false, 'none',
  1, 4, 2,
  '₹1,000–₹2,000', 1000, 2000,
  '24+', 24, 24, true, NULL,
  false, 'Legal. Massive bio-load requires large tanks.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('fancy-goldfish')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Fish","Breed":"Guppy","Lifespan":"2–3 yrs","Daily Time Needed":"0.5 hrs","Min Space Needed":"10+ gallons (Filtered)","Noise (1-5)":"1","Monthly Cost (₹)":"₹500–₹1,000","Apt Suitability (1-5)":"5","Left Alone (hrs)":"24+","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"No","Legal Status in India":"Legal. Breeds rapidly."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '2–3 yrs', 2, 3, false,
  '0.5 hrs', 0.5, 0.5, false,
  '10+ gallons (Filtered)', NULL, 10, NULL, NULL,
  false, 'none',
  1, 5, 3,
  '₹500–₹1,000', 500, 1000,
  '24+', 24, 24, true, NULL,
  false, 'Legal. Breeds rapidly.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('guppy')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Fish","Breed":"Neon Tetra","Lifespan":"2–5 yrs","Daily Time Needed":"0.5 hrs","Min Space Needed":"15+ gallons (School of 6+)","Noise (1-5)":"1","Monthly Cost (₹)":"₹500–₹1,000","Apt Suitability (1-5)":"5","Left Alone (hrs)":"24+","Kid-Friendly (1-5)":"2","Exotic Vet Needed?":"No","Legal Status in India":"Legal. Schooling fish."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '2–5 yrs', 2, 5, false,
  '0.5 hrs', 0.5, 0.5, false,
  '15+ gallons (School of 6+)', NULL, 15, NULL, NULL,
  false, 'none',
  1, 5, 2,
  '₹500–₹1,000', 500, 1000,
  '24+', 24, 24, true, NULL,
  false, 'Legal. Schooling fish.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('neon-tetra')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Fish","Breed":"Angelfish","Lifespan":"10–12 yrs","Daily Time Needed":"0.5 hrs","Min Space Needed":"55+ gallons (Heated/Filtered)","Noise (1-5)":"1","Monthly Cost (₹)":"₹1,000–₹2,000","Apt Suitability (1-5)":"4","Left Alone (hrs)":"24+","Kid-Friendly (1-5)":"2","Exotic Vet Needed?":"No","Legal Status in India":"Legal. Needs tall tanks."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '10–12 yrs', 10, 12, false,
  '0.5 hrs', 0.5, 0.5, false,
  '55+ gallons (Heated/Filtered)', NULL, 55, NULL, NULL,
  false, 'none',
  1, 4, 2,
  '₹1,000–₹2,000', 1000, 2000,
  '24+', 24, 24, true, NULL,
  false, 'Legal. Needs tall tanks.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('angelfish')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Fish","Breed":"Oscar","Lifespan":"10–20 yrs","Daily Time Needed":"0.5 hrs","Min Space Needed":"75+ gallons (High filtration)","Noise (1-5)":"1","Monthly Cost (₹)":"₹1,500–₹3,000","Apt Suitability (1-5)":"3","Left Alone (hrs)":"24+","Kid-Friendly (1-5)":"2","Exotic Vet Needed?":"No","Legal Status in India":"Legal. Highly territorial cichlid."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '10–20 yrs', 10, 20, false,
  '0.5 hrs', 0.5, 0.5, false,
  '75+ gallons (High filtration)', NULL, 75, NULL, NULL,
  false, 'none',
  1, 3, 2,
  '₹1,500–₹3,000', 1500, 3000,
  '24+', 24, 24, true, NULL,
  false, 'Legal. Highly territorial cichlid.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('oscar')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Reptile","Breed":"Leopard Gecko","Lifespan":"15–20 yrs","Daily Time Needed":"0.5–1 hr","Min Space Needed":"20+ gallons (Long)","Noise (1-5)":"1","Monthly Cost (₹)":"₹1,000–₹2,000","Apt Suitability (1-5)":"5","Left Alone (hrs)":"12–24","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal (Non-native). Requires live insect diet."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '15–20 yrs', 15, 20, false,
  '0.5–1 hr', 0.5, 1, false,
  '20+ gallons (Long)', NULL, 20, NULL, NULL,
  false, 'none',
  1, 5, 3,
  '₹1,000–₹2,000', 1000, 2000,
  '12–24', 12, 24, false, NULL,
  true, 'Legal (Non-native). Requires live insect diet.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('leopard-gecko')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Reptile","Breed":"Bearded Dragon","Lifespan":"10–15 yrs","Daily Time Needed":"1–2 hrs","Min Space Needed":"75+ gallons","Noise (1-5)":"1","Monthly Cost (₹)":"₹2,000–₹4,000","Apt Suitability (1-5)":"4","Left Alone (hrs)":"10–12","Kid-Friendly (1-5)":"4","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal (Non-native). High UVB and heat requirements."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '10–15 yrs', 10, 15, false,
  '1–2 hrs', 1, 2, false,
  '75+ gallons', NULL, 75, NULL, NULL,
  false, 'none',
  1, 4, 4,
  '₹2,000–₹4,000', 2000, 4000,
  '10–12', 10, 12, false, NULL,
  true, 'Legal (Non-native). High UVB and heat requirements.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('bearded-dragon')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Reptile","Breed":"Ball Python","Lifespan":"20–30 yrs","Daily Time Needed":"0.5 hr","Min Space Needed":"40–120 gallons","Noise (1-5)":"1","Monthly Cost (₹)":"₹1,500–₹3,000","Apt Suitability (1-5)":"5","Left Alone (hrs)":"24–48","Kid-Friendly (1-5)":"2","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal (Non-native). PARIVESH 2.0 registration mandatory (CITES App II)."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '20–30 yrs', 20, 30, false,
  '0.5 hr', 0.5, 0.5, false,
  '40–120 gallons', NULL, 40, NULL, NULL,
  false, 'none',
  1, 5, 2,
  '₹1,500–₹3,000', 1500, 3000,
  '24–48', 24, 48, false, NULL,
  true, 'Legal (Non-native). PARIVESH 2.0 registration mandatory (CITES App II).', 'registration_required', true, true, false
FROM public.breeds b
WHERE b.slug IN ('ball-python')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Reptile","Breed":"Corn Snake","Lifespan":"15–20 yrs","Daily Time Needed":"0.5 hr","Min Space Needed":"40+ gallons","Noise (1-5)":"1","Monthly Cost (₹)":"₹1,000–₹2,500","Apt Suitability (1-5)":"5","Left Alone (hrs)":"24–48","Kid-Friendly (1-5)":"3","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal (Non-native). Escape artist; requires secure lid."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '15–20 yrs', 15, 20, false,
  '0.5 hr', 0.5, 0.5, false,
  '40+ gallons', NULL, 40, NULL, NULL,
  false, 'none',
  1, 5, 3,
  '₹1,000–₹2,500', 1000, 2500,
  '24–48', 24, 48, false, NULL,
  true, 'Legal (Non-native). Escape artist; requires secure lid.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('corn-snake')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Turtle","Breed":"Red-eared Slider","Lifespan":"20–30 yrs","Daily Time Needed":"1 hr","Min Space Needed":"75+ gallons (Water + Basking)","Noise (1-5)":"1","Monthly Cost (₹)":"₹1,500–₹3,000","Apt Suitability (1-5)":"3","Left Alone (hrs)":"12–24","Kid-Friendly (1-5)":"2","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal but Highly Invasive. Ecologically discouraged."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '20–30 yrs', 20, 30, false,
  '1 hr', 1, 1, false,
  '75+ gallons (Water + Basking)', NULL, 75, NULL, NULL,
  false, 'none',
  1, 3, 2,
  '₹1,500–₹3,000', 1500, 3000,
  '12–24', 12, 24, false, NULL,
  true, 'Legal but Highly Invasive. Ecologically discouraged.', 'discouraged', false, false, false
FROM public.breeds b
WHERE b.slug IN ('red-eared-slider')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Exotic Mammal","Breed":"Ferret (Standard)","Lifespan":"6–8 yrs","Daily Time Needed":"3–4 hrs","Min Space Needed":"Large multi-level cage","Noise (1-5)":"2","Monthly Cost (₹)":"₹6,000–₹12,000","Apt Suitability (1-5)":"3","Left Alone (hrs)":"4–6","Kid-Friendly (1-5)":"2","Exotic Vet Needed?":"Yes","Legal Status in India":"Restricted. Requires special import permits (DGFT); highly regulated."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '6–8 yrs', 6, 8, false,
  '3–4 hrs', 3, 4, false,
  'Large multi-level cage', 'large', NULL, NULL, NULL,
  true, 'none',
  2, 3, 2,
  '₹6,000–₹12,000', 6000, 12000,
  '4–6', 4, 6, false, NULL,
  true, 'Restricted. Requires special import permits (DGFT); highly regulated.', 'restricted', false, false, true
FROM public.breeds b
WHERE b.slug IN ('ferret-standard')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Exotic Mammal","Breed":"Sugar Glider (Standard)","Lifespan":"10–12 yrs","Daily Time Needed":"3+ hrs","Min Space Needed":"Tall arboreal cage","Noise (1-5)":"3","Monthly Cost (₹)":"₹2,000–₹5,000","Apt Suitability (1-5)":"3","Left Alone (hrs)":"4 (Needs buddy)","Kid-Friendly (1-5)":"2","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal (Non-native). PARIVESH 2.0 registration advised."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '10–12 yrs', 10, 12, false,
  '3+ hrs', 3, 3, true,
  'Tall arboreal cage', NULL, NULL, NULL, NULL,
  true, 'none',
  3, 3, 2,
  '₹2,000–₹5,000', 2000, 5000,
  '4 (Needs buddy)', 4, 4, false, 'Needs buddy',
  true, 'Legal (Non-native). PARIVESH 2.0 registration advised.', 'registration_advised', true, false, false
FROM public.breeds b
WHERE b.slug IN ('sugar-glider-standard')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

INSERT INTO public.breed_husbandry (
  breed_id, raw, parse_warnings, source,
  lifespan_text, lifespan_min_years, lifespan_max_years, lifespan_open_ended,
  daily_time_text, daily_time_min_hours, daily_time_max_hours, daily_time_open_ended,
  min_space_text, space_class, min_space_gallons, min_space_sq_ft, min_space_sq_in,
  vertical_space_needed, ac_requirement,
  noise_level, apt_suitability, kid_friendly,
  monthly_cost_text, monthly_cost_min_inr, monthly_cost_max_inr,
  left_alone_text, left_alone_min_hours, left_alone_max_hours, left_alone_open_ended, left_alone_note,
  exotic_vet_needed, legal_status_text, legal_status, requires_parivesh, cites_appendix_ii, requires_import_permit
)
SELECT
  b.id, '{"Animal":"Exotic Mammal","Breed":"African Pygmy Hedgehog","Lifespan":"3–5 yrs","Daily Time Needed":"1 hr","Min Space Needed":"4 sq. ft. minimum (Heated)","Noise (1-5)":"1","Monthly Cost (₹)":"₹1,500–₹3,000","Apt Suitability (1-5)":"5","Left Alone (hrs)":"12","Kid-Friendly (1-5)":"2","Exotic Vet Needed?":"Yes","Legal Status in India":"Legal (Non-native). Must be distinct from illegal native hedgehogs."}'::jsonb, '{}'::text[], 'owner_research_v1',
  '3–5 yrs', 3, 5, false,
  '1 hr', 1, 1, false,
  '4 sq. ft. minimum (Heated)', NULL, NULL, 4, NULL,
  false, 'none',
  1, 5, 2,
  '₹1,500–₹3,000', 1500, 3000,
  '12', 12, 12, false, NULL,
  true, 'Legal (Non-native). Must be distinct from illegal native hedgehogs.', 'legal', false, false, false
FROM public.breeds b
WHERE b.slug IN ('african-pygmy-hedgehog')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  lifespan_open_ended = EXCLUDED.lifespan_open_ended,
  daily_time_text = EXCLUDED.daily_time_text,
  daily_time_min_hours = EXCLUDED.daily_time_min_hours,
  daily_time_max_hours = EXCLUDED.daily_time_max_hours,
  daily_time_open_ended = EXCLUDED.daily_time_open_ended,
  min_space_text = EXCLUDED.min_space_text,
  space_class = EXCLUDED.space_class,
  min_space_gallons = EXCLUDED.min_space_gallons,
  min_space_sq_ft = EXCLUDED.min_space_sq_ft,
  min_space_sq_in = EXCLUDED.min_space_sq_in,
  vertical_space_needed = EXCLUDED.vertical_space_needed,
  ac_requirement = EXCLUDED.ac_requirement,
  noise_level = EXCLUDED.noise_level,
  apt_suitability = EXCLUDED.apt_suitability,
  kid_friendly = EXCLUDED.kid_friendly,
  monthly_cost_text = EXCLUDED.monthly_cost_text,
  monthly_cost_min_inr = EXCLUDED.monthly_cost_min_inr,
  monthly_cost_max_inr = EXCLUDED.monthly_cost_max_inr,
  left_alone_text = EXCLUDED.left_alone_text,
  left_alone_min_hours = EXCLUDED.left_alone_min_hours,
  left_alone_max_hours = EXCLUDED.left_alone_max_hours,
  left_alone_open_ended = EXCLUDED.left_alone_open_ended,
  left_alone_note = EXCLUDED.left_alone_note,
  exotic_vet_needed = EXCLUDED.exotic_vet_needed,
  legal_status_text = EXCLUDED.legal_status_text,
  legal_status = EXCLUDED.legal_status,
  requires_parivesh = EXCLUDED.requires_parivesh,
  cites_appendix_ii = EXCLUDED.cites_appendix_ii,
  requires_import_permit = EXCLUDED.requires_import_permit;

-- 7. Breed Detail Mammal (Layer 2 - 8 Rows, Upsert on breed_id)
INSERT INTO public.breed_detail_mammal (
  breed_id, raw, parse_warnings, source,
  origin_text, size_text, size_category, weight_text, weight_min_kg, weight_max_kg, height_text, height_min_cm, height_max_cm,
  lifespan_text, lifespan_min_years, lifespan_max_years,
  energy_level, exercise_minutes, exercise_open_ended, trainability, intelligence, shedding, grooming_needs,
  noise_level, heat_tolerance, cold_tolerance, kids_score, other_pets_score, strangers_score, separation_anxiety, first_time_owner, apt_score,
  health_issues_text, vet_cost_yearly_text, vet_cost_yearly_min_inr, vet_cost_yearly_max_inr,
  price_text, price_type, price_min_inr, price_max_inr, availability, temperament
)
SELECT
  b.id, '{"Species":"Dog","Breed":"Indie","Origin":"India","Size":"Med","Wt(kg)":"15-25","Ht(cm)":"50-60","Lifespan":"13-16","Energy(1-5)":"4","Exer(min)":"60","Train(1-5)":"4","Intel(1-5)":"4","Shed(1-5)":"2","Groom(1-5)":"1","Noise(1-5)":"3","HeatTol(1-5)":"5","ColdTol(1-5)":"3","Kids(1-5)":"4","Pets(1-5)":"4","Strangers(1-5)":"3","SepAnx(1-5)":"2","1stTime(1-5)":"4","Apt(1-5)":"4","Health Issues":"Tick fever, Gastro","VetCost/Yr(₹)":"3k-5k","Price(₹)":"Adoption","Avail":"Common","Temperament":"Resilient, territorial, highly adaptable"}'::jsonb, '{}'::text[], 'owner_research_v1',
  'India', 'Med', 'medium', '15-25', 15, 25, '50-60', 50, 60,
  '13-16', 13, 16,
  4, 60, false, 4, 4, 2, 1,
  3, 5, 3, 4, 4, 3, 2, 4, 4,
  'Tick fever, Gastro', '3k-5k', 3000, 5000,
  'Adoption', 'adoption', 0, 0, 'Common', 'Resilient, territorial, highly adaptable'
FROM public.breeds b
WHERE b.slug IN ('indie-indian-pariah')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  origin_text = EXCLUDED.origin_text,
  size_text = EXCLUDED.size_text,
  size_category = EXCLUDED.size_category,
  weight_text = EXCLUDED.weight_text,
  weight_min_kg = EXCLUDED.weight_min_kg,
  weight_max_kg = EXCLUDED.weight_max_kg,
  height_text = EXCLUDED.height_text,
  height_min_cm = EXCLUDED.height_min_cm,
  height_max_cm = EXCLUDED.height_max_cm,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  energy_level = EXCLUDED.energy_level,
  exercise_minutes = EXCLUDED.exercise_minutes,
  exercise_open_ended = EXCLUDED.exercise_open_ended,
  trainability = EXCLUDED.trainability,
  intelligence = EXCLUDED.intelligence,
  shedding = EXCLUDED.shedding,
  grooming_needs = EXCLUDED.grooming_needs,
  noise_level = EXCLUDED.noise_level,
  heat_tolerance = EXCLUDED.heat_tolerance,
  cold_tolerance = EXCLUDED.cold_tolerance,
  kids_score = EXCLUDED.kids_score,
  other_pets_score = EXCLUDED.other_pets_score,
  strangers_score = EXCLUDED.strangers_score,
  separation_anxiety = EXCLUDED.separation_anxiety,
  first_time_owner = EXCLUDED.first_time_owner,
  apt_score = EXCLUDED.apt_score,
  health_issues_text = EXCLUDED.health_issues_text,
  vet_cost_yearly_text = EXCLUDED.vet_cost_yearly_text,
  vet_cost_yearly_min_inr = EXCLUDED.vet_cost_yearly_min_inr,
  vet_cost_yearly_max_inr = EXCLUDED.vet_cost_yearly_max_inr,
  price_text = EXCLUDED.price_text,
  price_type = EXCLUDED.price_type,
  price_min_inr = EXCLUDED.price_min_inr,
  price_max_inr = EXCLUDED.price_max_inr,
  availability = EXCLUDED.availability,
  temperament = EXCLUDED.temperament;

INSERT INTO public.breed_detail_mammal (
  breed_id, raw, parse_warnings, source,
  origin_text, size_text, size_category, weight_text, weight_min_kg, weight_max_kg, height_text, height_min_cm, height_max_cm,
  lifespan_text, lifespan_min_years, lifespan_max_years,
  energy_level, exercise_minutes, exercise_open_ended, trainability, intelligence, shedding, grooming_needs,
  noise_level, heat_tolerance, cold_tolerance, kids_score, other_pets_score, strangers_score, separation_anxiety, first_time_owner, apt_score,
  health_issues_text, vet_cost_yearly_text, vet_cost_yearly_min_inr, vet_cost_yearly_max_inr,
  price_text, price_type, price_min_inr, price_max_inr, availability, temperament
)
SELECT
  b.id, '{"Species":"Dog","Breed":"Labrador","Origin":"Canada","Size":"Large","Wt(kg)":"25-36","Ht(cm)":"55-62","Lifespan":"10-12","Energy(1-5)":"4","Exer(min)":"60","Train(1-5)":"5","Intel(1-5)":"5","Shed(1-5)":"4","Groom(1-5)":"2","Noise(1-5)":"3","HeatTol(1-5)":"2","ColdTol(1-5)":"4","Kids(1-5)":"5","Pets(1-5)":"5","Strangers(1-5)":"5","SepAnx(1-5)":"4","1stTime(1-5)":"5","Apt(1-5)":"3","Health Issues":"Hip dysplasia, Obesity","VetCost/Yr(₹)":"5k-8k","Price(₹)":"10k-20k","Avail":"Common","Temperament":"Eager to please, friendly, food-motivated"}'::jsonb, '{}'::text[], 'owner_research_v1',
  'Canada', 'Large', 'large', '25-36', 25, 36, '55-62', 55, 62,
  '10-12', 10, 12,
  4, 60, false, 5, 5, 4, 2,
  3, 2, 4, 5, 5, 5, 4, 5, 3,
  'Hip dysplasia, Obesity', '5k-8k', 5000, 8000,
  '10k-20k', 'purchase', 10000, 20000, 'Common', 'Eager to please, friendly, food-motivated'
FROM public.breeds b
WHERE b.slug IN ('labrador-retriever', 'labrador-retriever')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  origin_text = EXCLUDED.origin_text,
  size_text = EXCLUDED.size_text,
  size_category = EXCLUDED.size_category,
  weight_text = EXCLUDED.weight_text,
  weight_min_kg = EXCLUDED.weight_min_kg,
  weight_max_kg = EXCLUDED.weight_max_kg,
  height_text = EXCLUDED.height_text,
  height_min_cm = EXCLUDED.height_min_cm,
  height_max_cm = EXCLUDED.height_max_cm,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  energy_level = EXCLUDED.energy_level,
  exercise_minutes = EXCLUDED.exercise_minutes,
  exercise_open_ended = EXCLUDED.exercise_open_ended,
  trainability = EXCLUDED.trainability,
  intelligence = EXCLUDED.intelligence,
  shedding = EXCLUDED.shedding,
  grooming_needs = EXCLUDED.grooming_needs,
  noise_level = EXCLUDED.noise_level,
  heat_tolerance = EXCLUDED.heat_tolerance,
  cold_tolerance = EXCLUDED.cold_tolerance,
  kids_score = EXCLUDED.kids_score,
  other_pets_score = EXCLUDED.other_pets_score,
  strangers_score = EXCLUDED.strangers_score,
  separation_anxiety = EXCLUDED.separation_anxiety,
  first_time_owner = EXCLUDED.first_time_owner,
  apt_score = EXCLUDED.apt_score,
  health_issues_text = EXCLUDED.health_issues_text,
  vet_cost_yearly_text = EXCLUDED.vet_cost_yearly_text,
  vet_cost_yearly_min_inr = EXCLUDED.vet_cost_yearly_min_inr,
  vet_cost_yearly_max_inr = EXCLUDED.vet_cost_yearly_max_inr,
  price_text = EXCLUDED.price_text,
  price_type = EXCLUDED.price_type,
  price_min_inr = EXCLUDED.price_min_inr,
  price_max_inr = EXCLUDED.price_max_inr,
  availability = EXCLUDED.availability,
  temperament = EXCLUDED.temperament;

INSERT INTO public.breed_detail_mammal (
  breed_id, raw, parse_warnings, source,
  origin_text, size_text, size_category, weight_text, weight_min_kg, weight_max_kg, height_text, height_min_cm, height_max_cm,
  lifespan_text, lifespan_min_years, lifespan_max_years,
  energy_level, exercise_minutes, exercise_open_ended, trainability, intelligence, shedding, grooming_needs,
  noise_level, heat_tolerance, cold_tolerance, kids_score, other_pets_score, strangers_score, separation_anxiety, first_time_owner, apt_score,
  health_issues_text, vet_cost_yearly_text, vet_cost_yearly_min_inr, vet_cost_yearly_max_inr,
  price_text, price_type, price_min_inr, price_max_inr, availability, temperament
)
SELECT
  b.id, '{"Species":"Dog","Breed":"Beagle","Origin":"UK","Size":"Med","Wt(kg)":"9-11","Ht(cm)":"33-41","Lifespan":"12-15","Energy(1-5)":"4","Exer(min)":"60","Train(1-5)":"3","Intel(1-5)":"4","Shed(1-5)":"3","Groom(1-5)":"2","Noise(1-5)":"5","HeatTol(1-5)":"3","ColdTol(1-5)":"3","Kids(1-5)":"5","Pets(1-5)":"4","Strangers(1-5)":"4","SepAnx(1-5)":"4","1stTime(1-5)":"3","Apt(1-5)":"3","Health Issues":"Ear infections, Obesity","VetCost/Yr(₹)":"4k-6k","Price(₹)":"15k-25k","Avail":"Common","Temperament":"Merry, stubborn, driven by scent"}'::jsonb, '{}'::text[], 'owner_research_v1',
  'UK', 'Med', 'medium', '9-11', 9, 11, '33-41', 33, 41,
  '12-15', 12, 15,
  4, 60, false, 3, 4, 3, 2,
  5, 3, 3, 5, 4, 4, 4, 3, 3,
  'Ear infections, Obesity', '4k-6k', 4000, 6000,
  '15k-25k', 'purchase', 15000, 25000, 'Common', 'Merry, stubborn, driven by scent'
FROM public.breeds b
WHERE b.slug IN ('beagle', 'beagle')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  origin_text = EXCLUDED.origin_text,
  size_text = EXCLUDED.size_text,
  size_category = EXCLUDED.size_category,
  weight_text = EXCLUDED.weight_text,
  weight_min_kg = EXCLUDED.weight_min_kg,
  weight_max_kg = EXCLUDED.weight_max_kg,
  height_text = EXCLUDED.height_text,
  height_min_cm = EXCLUDED.height_min_cm,
  height_max_cm = EXCLUDED.height_max_cm,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  energy_level = EXCLUDED.energy_level,
  exercise_minutes = EXCLUDED.exercise_minutes,
  exercise_open_ended = EXCLUDED.exercise_open_ended,
  trainability = EXCLUDED.trainability,
  intelligence = EXCLUDED.intelligence,
  shedding = EXCLUDED.shedding,
  grooming_needs = EXCLUDED.grooming_needs,
  noise_level = EXCLUDED.noise_level,
  heat_tolerance = EXCLUDED.heat_tolerance,
  cold_tolerance = EXCLUDED.cold_tolerance,
  kids_score = EXCLUDED.kids_score,
  other_pets_score = EXCLUDED.other_pets_score,
  strangers_score = EXCLUDED.strangers_score,
  separation_anxiety = EXCLUDED.separation_anxiety,
  first_time_owner = EXCLUDED.first_time_owner,
  apt_score = EXCLUDED.apt_score,
  health_issues_text = EXCLUDED.health_issues_text,
  vet_cost_yearly_text = EXCLUDED.vet_cost_yearly_text,
  vet_cost_yearly_min_inr = EXCLUDED.vet_cost_yearly_min_inr,
  vet_cost_yearly_max_inr = EXCLUDED.vet_cost_yearly_max_inr,
  price_text = EXCLUDED.price_text,
  price_type = EXCLUDED.price_type,
  price_min_inr = EXCLUDED.price_min_inr,
  price_max_inr = EXCLUDED.price_max_inr,
  availability = EXCLUDED.availability,
  temperament = EXCLUDED.temperament;

INSERT INTO public.breed_detail_mammal (
  breed_id, raw, parse_warnings, source,
  origin_text, size_text, size_category, weight_text, weight_min_kg, weight_max_kg, height_text, height_min_cm, height_max_cm,
  lifespan_text, lifespan_min_years, lifespan_max_years,
  energy_level, exercise_minutes, exercise_open_ended, trainability, intelligence, shedding, grooming_needs,
  noise_level, heat_tolerance, cold_tolerance, kids_score, other_pets_score, strangers_score, separation_anxiety, first_time_owner, apt_score,
  health_issues_text, vet_cost_yearly_text, vet_cost_yearly_min_inr, vet_cost_yearly_max_inr,
  price_text, price_type, price_min_inr, price_max_inr, availability, temperament
)
SELECT
  b.id, '{"Species":"Dog","Breed":"Pug","Origin":"China","Size":"Small","Wt(kg)":"6-8","Ht(cm)":"25-30","Lifespan":"12-15","Energy(1-5)":"2","Exer(min)":"20","Train(1-5)":"3","Intel(1-5)":"3","Shed(1-5)":"4","Groom(1-5)":"3","Noise(1-5)":"2","HeatTol(1-5)":"1","ColdTol(1-5)":"3","Kids(1-5)":"4","Pets(1-5)":"4","Strangers(1-5)":"4","SepAnx(1-5)":"4","1stTime(1-5)":"4","Apt(1-5)":"5","Health Issues":"BOAS (breathing), Eye issues","VetCost/Yr(₹)":"5k-8k","Price(₹)":"15k-20k","Avail":"Common","Temperament":"Charming, lazy, severely heat-intolerant"}'::jsonb, '{}'::text[], 'owner_research_v1',
  'China', 'Small', 'small', '6-8', 6, 8, '25-30', 25, 30,
  '12-15', 12, 15,
  2, 20, false, 3, 3, 4, 3,
  2, 1, 3, 4, 4, 4, 4, 4, 5,
  'BOAS (breathing), Eye issues', '5k-8k', 5000, 8000,
  '15k-20k', 'purchase', 15000, 20000, 'Common', 'Charming, lazy, severely heat-intolerant'
FROM public.breeds b
WHERE b.slug IN ('pug', 'pug')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  origin_text = EXCLUDED.origin_text,
  size_text = EXCLUDED.size_text,
  size_category = EXCLUDED.size_category,
  weight_text = EXCLUDED.weight_text,
  weight_min_kg = EXCLUDED.weight_min_kg,
  weight_max_kg = EXCLUDED.weight_max_kg,
  height_text = EXCLUDED.height_text,
  height_min_cm = EXCLUDED.height_min_cm,
  height_max_cm = EXCLUDED.height_max_cm,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  energy_level = EXCLUDED.energy_level,
  exercise_minutes = EXCLUDED.exercise_minutes,
  exercise_open_ended = EXCLUDED.exercise_open_ended,
  trainability = EXCLUDED.trainability,
  intelligence = EXCLUDED.intelligence,
  shedding = EXCLUDED.shedding,
  grooming_needs = EXCLUDED.grooming_needs,
  noise_level = EXCLUDED.noise_level,
  heat_tolerance = EXCLUDED.heat_tolerance,
  cold_tolerance = EXCLUDED.cold_tolerance,
  kids_score = EXCLUDED.kids_score,
  other_pets_score = EXCLUDED.other_pets_score,
  strangers_score = EXCLUDED.strangers_score,
  separation_anxiety = EXCLUDED.separation_anxiety,
  first_time_owner = EXCLUDED.first_time_owner,
  apt_score = EXCLUDED.apt_score,
  health_issues_text = EXCLUDED.health_issues_text,
  vet_cost_yearly_text = EXCLUDED.vet_cost_yearly_text,
  vet_cost_yearly_min_inr = EXCLUDED.vet_cost_yearly_min_inr,
  vet_cost_yearly_max_inr = EXCLUDED.vet_cost_yearly_max_inr,
  price_text = EXCLUDED.price_text,
  price_type = EXCLUDED.price_type,
  price_min_inr = EXCLUDED.price_min_inr,
  price_max_inr = EXCLUDED.price_max_inr,
  availability = EXCLUDED.availability,
  temperament = EXCLUDED.temperament;

INSERT INTO public.breed_detail_mammal (
  breed_id, raw, parse_warnings, source,
  origin_text, size_text, size_category, weight_text, weight_min_kg, weight_max_kg, height_text, height_min_cm, height_max_cm,
  lifespan_text, lifespan_min_years, lifespan_max_years,
  energy_level, exercise_minutes, exercise_open_ended, trainability, intelligence, shedding, grooming_needs,
  noise_level, heat_tolerance, cold_tolerance, kids_score, other_pets_score, strangers_score, separation_anxiety, first_time_owner, apt_score,
  health_issues_text, vet_cost_yearly_text, vet_cost_yearly_min_inr, vet_cost_yearly_max_inr,
  price_text, price_type, price_min_inr, price_max_inr, availability, temperament
)
SELECT
  b.id, '{"Species":"Dog","Breed":"Siberian Husky","Origin":"Siberia","Size":"Large","Wt(kg)":"20-27","Ht(cm)":"50-60","Lifespan":"12-14","Energy(1-5)":"5","Exer(min)":"90+","Train(1-5)":"3","Intel(1-5)":"4","Shed(1-5)":"5","Groom(1-5)":"4","Noise(1-5)":"4","HeatTol(1-5)":"1","ColdTol(1-5)":"5","Kids(1-5)":"4","Pets(1-5)":"3","Strangers(1-5)":"4","SepAnx(1-5)":"4","1stTime(1-5)":"1","Apt(1-5)":"2","Health Issues":"Thermal stress, Cataracts","VetCost/Yr(₹)":"10k-15k","Price(₹)":"30k-50k","Avail":"Common","Temperament":"High-energy, independent, vocal (howls)"}'::jsonb, '{}'::text[], 'owner_research_v1',
  'Siberia', 'Large', 'large', '20-27', 20, 27, '50-60', 50, 60,
  '12-14', 12, 14,
  5, 90, true, 3, 4, 5, 4,
  4, 1, 5, 4, 3, 4, 4, 1, 2,
  'Thermal stress, Cataracts', '10k-15k', 10000, 15000,
  '30k-50k', 'purchase', 30000, 50000, 'Common', 'High-energy, independent, vocal (howls)'
FROM public.breeds b
WHERE b.slug IN ('siberian-husky')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  origin_text = EXCLUDED.origin_text,
  size_text = EXCLUDED.size_text,
  size_category = EXCLUDED.size_category,
  weight_text = EXCLUDED.weight_text,
  weight_min_kg = EXCLUDED.weight_min_kg,
  weight_max_kg = EXCLUDED.weight_max_kg,
  height_text = EXCLUDED.height_text,
  height_min_cm = EXCLUDED.height_min_cm,
  height_max_cm = EXCLUDED.height_max_cm,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  energy_level = EXCLUDED.energy_level,
  exercise_minutes = EXCLUDED.exercise_minutes,
  exercise_open_ended = EXCLUDED.exercise_open_ended,
  trainability = EXCLUDED.trainability,
  intelligence = EXCLUDED.intelligence,
  shedding = EXCLUDED.shedding,
  grooming_needs = EXCLUDED.grooming_needs,
  noise_level = EXCLUDED.noise_level,
  heat_tolerance = EXCLUDED.heat_tolerance,
  cold_tolerance = EXCLUDED.cold_tolerance,
  kids_score = EXCLUDED.kids_score,
  other_pets_score = EXCLUDED.other_pets_score,
  strangers_score = EXCLUDED.strangers_score,
  separation_anxiety = EXCLUDED.separation_anxiety,
  first_time_owner = EXCLUDED.first_time_owner,
  apt_score = EXCLUDED.apt_score,
  health_issues_text = EXCLUDED.health_issues_text,
  vet_cost_yearly_text = EXCLUDED.vet_cost_yearly_text,
  vet_cost_yearly_min_inr = EXCLUDED.vet_cost_yearly_min_inr,
  vet_cost_yearly_max_inr = EXCLUDED.vet_cost_yearly_max_inr,
  price_text = EXCLUDED.price_text,
  price_type = EXCLUDED.price_type,
  price_min_inr = EXCLUDED.price_min_inr,
  price_max_inr = EXCLUDED.price_max_inr,
  availability = EXCLUDED.availability,
  temperament = EXCLUDED.temperament;

INSERT INTO public.breed_detail_mammal (
  breed_id, raw, parse_warnings, source,
  origin_text, size_text, size_category, weight_text, weight_min_kg, weight_max_kg, height_text, height_min_cm, height_max_cm,
  lifespan_text, lifespan_min_years, lifespan_max_years,
  energy_level, exercise_minutes, exercise_open_ended, trainability, intelligence, shedding, grooming_needs,
  noise_level, heat_tolerance, cold_tolerance, kids_score, other_pets_score, strangers_score, separation_anxiety, first_time_owner, apt_score,
  health_issues_text, vet_cost_yearly_text, vet_cost_yearly_min_inr, vet_cost_yearly_max_inr,
  price_text, price_type, price_min_inr, price_max_inr, availability, temperament
)
SELECT
  b.id, '{"Species":"Cat","Breed":"Dom. Shorthair","Origin":"Mixed","Size":"Med","Wt(kg)":"3-5","Ht(cm)":"20-25","Lifespan":"12-15","Energy(1-5)":"3","Exer(min)":"20","Train(1-5)":"3","Intel(1-5)":"4","Shed(1-5)":"2","Groom(1-5)":"1","Noise(1-5)":"2","HeatTol(1-5)":"4","ColdTol(1-5)":"3","Kids(1-5)":"3","Pets(1-5)":"4","Strangers(1-5)":"3","SepAnx(1-5)":"2","1stTime(1-5)":"5","Apt(1-5)":"5","Health Issues":"Kidney disease (old age)","VetCost/Yr(₹)":"2k-4k","Price(₹)":"Adoption","Avail":"Common","Temperament":"Independent, hardy, varied personalities"}'::jsonb, '{}'::text[], 'owner_research_v1',
  'Mixed', 'Med', 'medium', '3-5', 3, 5, '20-25', 20, 25,
  '12-15', 12, 15,
  3, 20, false, 3, 4, 2, 1,
  2, 4, 3, 3, 4, 3, 2, 5, 5,
  'Kidney disease (old age)', '2k-4k', 2000, 4000,
  'Adoption', 'adoption', 0, 0, 'Common', 'Independent, hardy, varied personalities'
FROM public.breeds b
WHERE b.slug IN ('domestic-shorthair-indie')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  origin_text = EXCLUDED.origin_text,
  size_text = EXCLUDED.size_text,
  size_category = EXCLUDED.size_category,
  weight_text = EXCLUDED.weight_text,
  weight_min_kg = EXCLUDED.weight_min_kg,
  weight_max_kg = EXCLUDED.weight_max_kg,
  height_text = EXCLUDED.height_text,
  height_min_cm = EXCLUDED.height_min_cm,
  height_max_cm = EXCLUDED.height_max_cm,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  energy_level = EXCLUDED.energy_level,
  exercise_minutes = EXCLUDED.exercise_minutes,
  exercise_open_ended = EXCLUDED.exercise_open_ended,
  trainability = EXCLUDED.trainability,
  intelligence = EXCLUDED.intelligence,
  shedding = EXCLUDED.shedding,
  grooming_needs = EXCLUDED.grooming_needs,
  noise_level = EXCLUDED.noise_level,
  heat_tolerance = EXCLUDED.heat_tolerance,
  cold_tolerance = EXCLUDED.cold_tolerance,
  kids_score = EXCLUDED.kids_score,
  other_pets_score = EXCLUDED.other_pets_score,
  strangers_score = EXCLUDED.strangers_score,
  separation_anxiety = EXCLUDED.separation_anxiety,
  first_time_owner = EXCLUDED.first_time_owner,
  apt_score = EXCLUDED.apt_score,
  health_issues_text = EXCLUDED.health_issues_text,
  vet_cost_yearly_text = EXCLUDED.vet_cost_yearly_text,
  vet_cost_yearly_min_inr = EXCLUDED.vet_cost_yearly_min_inr,
  vet_cost_yearly_max_inr = EXCLUDED.vet_cost_yearly_max_inr,
  price_text = EXCLUDED.price_text,
  price_type = EXCLUDED.price_type,
  price_min_inr = EXCLUDED.price_min_inr,
  price_max_inr = EXCLUDED.price_max_inr,
  availability = EXCLUDED.availability,
  temperament = EXCLUDED.temperament;

INSERT INTO public.breed_detail_mammal (
  breed_id, raw, parse_warnings, source,
  origin_text, size_text, size_category, weight_text, weight_min_kg, weight_max_kg, height_text, height_min_cm, height_max_cm,
  lifespan_text, lifespan_min_years, lifespan_max_years,
  energy_level, exercise_minutes, exercise_open_ended, trainability, intelligence, shedding, grooming_needs,
  noise_level, heat_tolerance, cold_tolerance, kids_score, other_pets_score, strangers_score, separation_anxiety, first_time_owner, apt_score,
  health_issues_text, vet_cost_yearly_text, vet_cost_yearly_min_inr, vet_cost_yearly_max_inr,
  price_text, price_type, price_min_inr, price_max_inr, availability, temperament
)
SELECT
  b.id, '{"Species":"Cat","Breed":"Persian","Origin":"Iran","Size":"Med","Wt(kg)":"3-5","Ht(cm)":"20-25","Lifespan":"12-15","Energy(1-5)":"1","Exer(min)":"15","Train(1-5)":"2","Intel(1-5)":"3","Shed(1-5)":"5","Groom(1-5)":"5","Noise(1-5)":"1","HeatTol(1-5)":"1","ColdTol(1-5)":"4","Kids(1-5)":"2","Pets(1-5)":"3","Strangers(1-5)":"3","SepAnx(1-5)":"3","1stTime(1-5)":"3","Apt(1-5)":"5","Health Issues":"PKD, Respiratory distress","VetCost/Yr(₹)":"6k-10k","Price(₹)":"15k-25k","Avail":"Common","Temperament":"Placid, sweet, requires constant AC"}'::jsonb, '{}'::text[], 'owner_research_v1',
  'Iran', 'Med', 'medium', '3-5', 3, 5, '20-25', 20, 25,
  '12-15', 12, 15,
  1, 15, false, 2, 3, 5, 5,
  1, 1, 4, 2, 3, 3, 3, 3, 5,
  'PKD, Respiratory distress', '6k-10k', 6000, 10000,
  '15k-25k', 'purchase', 15000, 25000, 'Common', 'Placid, sweet, requires constant AC'
FROM public.breeds b
WHERE b.slug IN ('persian')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  origin_text = EXCLUDED.origin_text,
  size_text = EXCLUDED.size_text,
  size_category = EXCLUDED.size_category,
  weight_text = EXCLUDED.weight_text,
  weight_min_kg = EXCLUDED.weight_min_kg,
  weight_max_kg = EXCLUDED.weight_max_kg,
  height_text = EXCLUDED.height_text,
  height_min_cm = EXCLUDED.height_min_cm,
  height_max_cm = EXCLUDED.height_max_cm,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  energy_level = EXCLUDED.energy_level,
  exercise_minutes = EXCLUDED.exercise_minutes,
  exercise_open_ended = EXCLUDED.exercise_open_ended,
  trainability = EXCLUDED.trainability,
  intelligence = EXCLUDED.intelligence,
  shedding = EXCLUDED.shedding,
  grooming_needs = EXCLUDED.grooming_needs,
  noise_level = EXCLUDED.noise_level,
  heat_tolerance = EXCLUDED.heat_tolerance,
  cold_tolerance = EXCLUDED.cold_tolerance,
  kids_score = EXCLUDED.kids_score,
  other_pets_score = EXCLUDED.other_pets_score,
  strangers_score = EXCLUDED.strangers_score,
  separation_anxiety = EXCLUDED.separation_anxiety,
  first_time_owner = EXCLUDED.first_time_owner,
  apt_score = EXCLUDED.apt_score,
  health_issues_text = EXCLUDED.health_issues_text,
  vet_cost_yearly_text = EXCLUDED.vet_cost_yearly_text,
  vet_cost_yearly_min_inr = EXCLUDED.vet_cost_yearly_min_inr,
  vet_cost_yearly_max_inr = EXCLUDED.vet_cost_yearly_max_inr,
  price_text = EXCLUDED.price_text,
  price_type = EXCLUDED.price_type,
  price_min_inr = EXCLUDED.price_min_inr,
  price_max_inr = EXCLUDED.price_max_inr,
  availability = EXCLUDED.availability,
  temperament = EXCLUDED.temperament;

INSERT INTO public.breed_detail_mammal (
  breed_id, raw, parse_warnings, source,
  origin_text, size_text, size_category, weight_text, weight_min_kg, weight_max_kg, height_text, height_min_cm, height_max_cm,
  lifespan_text, lifespan_min_years, lifespan_max_years,
  energy_level, exercise_minutes, exercise_open_ended, trainability, intelligence, shedding, grooming_needs,
  noise_level, heat_tolerance, cold_tolerance, kids_score, other_pets_score, strangers_score, separation_anxiety, first_time_owner, apt_score,
  health_issues_text, vet_cost_yearly_text, vet_cost_yearly_min_inr, vet_cost_yearly_max_inr,
  price_text, price_type, price_min_inr, price_max_inr, availability, temperament
)
SELECT
  b.id, '{"Species":"Rabbit","Breed":"Mini Lop","Origin":"Germany","Size":"Small","Wt(kg)":"1.5-3","Ht(cm)":"15-20","Lifespan":"8-12","Energy(1-5)":"3","Exer(min)":"60","Train(1-5)":"3","Intel(1-5)":"3","Shed(1-5)":"3","Groom(1-5)":"2","Noise(1-5)":"1","HeatTol(1-5)":"2","ColdTol(1-5)":"4","Kids(1-5)":"3","Pets(1-5)":"3","Strangers(1-5)":"2","SepAnx(1-5)":"3","1stTime(1-5)":"4","Apt(1-5)":"4","Health Issues":"GI Stasis, Dental issues","VetCost/Yr(₹)":"3k-5k","Price(₹)":"2k-4k","Avail":"Common","Temperament":"Docile, easily startled, fragile spine"}'::jsonb, '{}'::text[], 'owner_research_v1',
  'Germany', 'Small', 'small', '1.5-3', 1.5, 3, '15-20', 15, 20,
  '8-12', 8, 12,
  3, 60, false, 3, 3, 3, 2,
  1, 2, 4, 3, 3, 2, 3, 4, 4,
  'GI Stasis, Dental issues', '3k-5k', 3000, 5000,
  '2k-4k', 'purchase', 2000, 4000, 'Common', 'Docile, easily startled, fragile spine'
FROM public.breeds b
WHERE b.slug IN ('mini-lop')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  origin_text = EXCLUDED.origin_text,
  size_text = EXCLUDED.size_text,
  size_category = EXCLUDED.size_category,
  weight_text = EXCLUDED.weight_text,
  weight_min_kg = EXCLUDED.weight_min_kg,
  weight_max_kg = EXCLUDED.weight_max_kg,
  height_text = EXCLUDED.height_text,
  height_min_cm = EXCLUDED.height_min_cm,
  height_max_cm = EXCLUDED.height_max_cm,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  energy_level = EXCLUDED.energy_level,
  exercise_minutes = EXCLUDED.exercise_minutes,
  exercise_open_ended = EXCLUDED.exercise_open_ended,
  trainability = EXCLUDED.trainability,
  intelligence = EXCLUDED.intelligence,
  shedding = EXCLUDED.shedding,
  grooming_needs = EXCLUDED.grooming_needs,
  noise_level = EXCLUDED.noise_level,
  heat_tolerance = EXCLUDED.heat_tolerance,
  cold_tolerance = EXCLUDED.cold_tolerance,
  kids_score = EXCLUDED.kids_score,
  other_pets_score = EXCLUDED.other_pets_score,
  strangers_score = EXCLUDED.strangers_score,
  separation_anxiety = EXCLUDED.separation_anxiety,
  first_time_owner = EXCLUDED.first_time_owner,
  apt_score = EXCLUDED.apt_score,
  health_issues_text = EXCLUDED.health_issues_text,
  vet_cost_yearly_text = EXCLUDED.vet_cost_yearly_text,
  vet_cost_yearly_min_inr = EXCLUDED.vet_cost_yearly_min_inr,
  vet_cost_yearly_max_inr = EXCLUDED.vet_cost_yearly_max_inr,
  price_text = EXCLUDED.price_text,
  price_type = EXCLUDED.price_type,
  price_min_inr = EXCLUDED.price_min_inr,
  price_max_inr = EXCLUDED.price_max_inr,
  availability = EXCLUDED.availability,
  temperament = EXCLUDED.temperament;

-- 8. Breed Detail Bird (Layer 2 - 3 Rows, Upsert on breed_id)
INSERT INTO public.breed_detail_bird (
  breed_id, raw, parse_warnings, source,
  origin_text, cage_size_text, cage_length_in, cage_width_in, cage_height_in,
  lifespan_text, lifespan_min_years, lifespan_max_years,
  energy_level, talking_ability, intelligence, mess_level, noise_level,
  heat_tolerance, cold_tolerance, kids_score, separation_anxiety, first_time_owner, apt_score,
  health_issues_text, vet_cost_text, vet_cost_min_inr, vet_cost_max_inr, vet_cost_period_assumed,
  price_text, price_type, price_min_inr, price_max_inr, availability, temperament
)
SELECT
  b.id, '{"Species":"Bird","Breed":"Budgerigar","Origin":"Australia","Cage Size":"24x18x18\"","Lifespan":"5-10","Energy(1-5)":"4","Talking(1-5)":"3","Intel(1-5)":"3","Mess(1-5)":"3","Noise(1-5)":"4","HeatTol(1-5)":"4","ColdTol(1-5)":"2","Kids(1-5)":"4","SepAnx(1-5)":"3","1stTime(1-5)":"5","Apt(1-5)":"3","Health Issues":"Tumors, Mites","VetCost(₹)":"1k-2k","Price(₹)":"500-1k","Avail":"Common","Temperament":"Cheerful, social, active"}'::jsonb, '{}'::text[], 'owner_research_v1',
  'Australia', '24x18x18"', 24, 18, 18,
  '5-10', 5, 10,
  4, 3, 3, 3, 4,
  4, 2, 4, 3, 5, 3,
  'Tumors, Mites', '1k-2k', 1000, 2000, true,
  '500-1k', 'purchase', 500, 1000, 'Common', 'Cheerful, social, active'
FROM public.breeds b
WHERE b.slug IN ('budgerigar-budgie')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  origin_text = EXCLUDED.origin_text,
  cage_size_text = EXCLUDED.cage_size_text,
  cage_length_in = EXCLUDED.cage_length_in,
  cage_width_in = EXCLUDED.cage_width_in,
  cage_height_in = EXCLUDED.cage_height_in,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  energy_level = EXCLUDED.energy_level,
  talking_ability = EXCLUDED.talking_ability,
  intelligence = EXCLUDED.intelligence,
  mess_level = EXCLUDED.mess_level,
  noise_level = EXCLUDED.noise_level,
  heat_tolerance = EXCLUDED.heat_tolerance,
  cold_tolerance = EXCLUDED.cold_tolerance,
  kids_score = EXCLUDED.kids_score,
  separation_anxiety = EXCLUDED.separation_anxiety,
  first_time_owner = EXCLUDED.first_time_owner,
  apt_score = EXCLUDED.apt_score,
  health_issues_text = EXCLUDED.health_issues_text,
  vet_cost_text = EXCLUDED.vet_cost_text,
  vet_cost_min_inr = EXCLUDED.vet_cost_min_inr,
  vet_cost_max_inr = EXCLUDED.vet_cost_max_inr,
  vet_cost_period_assumed = EXCLUDED.vet_cost_period_assumed,
  price_text = EXCLUDED.price_text,
  price_type = EXCLUDED.price_type,
  price_min_inr = EXCLUDED.price_min_inr,
  price_max_inr = EXCLUDED.price_max_inr,
  availability = EXCLUDED.availability,
  temperament = EXCLUDED.temperament;

INSERT INTO public.breed_detail_bird (
  breed_id, raw, parse_warnings, source,
  origin_text, cage_size_text, cage_length_in, cage_width_in, cage_height_in,
  lifespan_text, lifespan_min_years, lifespan_max_years,
  energy_level, talking_ability, intelligence, mess_level, noise_level,
  heat_tolerance, cold_tolerance, kids_score, separation_anxiety, first_time_owner, apt_score,
  health_issues_text, vet_cost_text, vet_cost_min_inr, vet_cost_max_inr, vet_cost_period_assumed,
  price_text, price_type, price_min_inr, price_max_inr, availability, temperament
)
SELECT
  b.id, '{"Species":"Bird","Breed":"Cockatiel","Origin":"Australia","Cage Size":"24x24x36\"","Lifespan":"10-15","Energy(1-5)":"3","Talking(1-5)":"2","Intel(1-5)":"3","Mess(1-5)":"4","Noise(1-5)":"4","HeatTol(1-5)":"4","ColdTol(1-5)":"2","Kids(1-5)":"4","SepAnx(1-5)":"4","1stTime(1-5)":"4","Apt(1-5)":"3","Health Issues":"Egg binding, Respiratory","VetCost(₹)":"2k-4k","Price(₹)":"2k-4k","Avail":"Common","Temperament":"Affectionate, loves head scratches"}'::jsonb, '{}'::text[], 'owner_research_v1',
  'Australia', '24x24x36"', 24, 24, 36,
  '10-15', 10, 15,
  3, 2, 3, 4, 4,
  4, 2, 4, 4, 4, 3,
  'Egg binding, Respiratory', '2k-4k', 2000, 4000, true,
  '2k-4k', 'purchase', 2000, 4000, 'Common', 'Affectionate, loves head scratches'
FROM public.breeds b
WHERE b.slug IN ('cockatiel')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  origin_text = EXCLUDED.origin_text,
  cage_size_text = EXCLUDED.cage_size_text,
  cage_length_in = EXCLUDED.cage_length_in,
  cage_width_in = EXCLUDED.cage_width_in,
  cage_height_in = EXCLUDED.cage_height_in,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  energy_level = EXCLUDED.energy_level,
  talking_ability = EXCLUDED.talking_ability,
  intelligence = EXCLUDED.intelligence,
  mess_level = EXCLUDED.mess_level,
  noise_level = EXCLUDED.noise_level,
  heat_tolerance = EXCLUDED.heat_tolerance,
  cold_tolerance = EXCLUDED.cold_tolerance,
  kids_score = EXCLUDED.kids_score,
  separation_anxiety = EXCLUDED.separation_anxiety,
  first_time_owner = EXCLUDED.first_time_owner,
  apt_score = EXCLUDED.apt_score,
  health_issues_text = EXCLUDED.health_issues_text,
  vet_cost_text = EXCLUDED.vet_cost_text,
  vet_cost_min_inr = EXCLUDED.vet_cost_min_inr,
  vet_cost_max_inr = EXCLUDED.vet_cost_max_inr,
  vet_cost_period_assumed = EXCLUDED.vet_cost_period_assumed,
  price_text = EXCLUDED.price_text,
  price_type = EXCLUDED.price_type,
  price_min_inr = EXCLUDED.price_min_inr,
  price_max_inr = EXCLUDED.price_max_inr,
  availability = EXCLUDED.availability,
  temperament = EXCLUDED.temperament;

INSERT INTO public.breed_detail_bird (
  breed_id, raw, parse_warnings, source,
  origin_text, cage_size_text, cage_length_in, cage_width_in, cage_height_in,
  lifespan_text, lifespan_min_years, lifespan_max_years,
  energy_level, talking_ability, intelligence, mess_level, noise_level,
  heat_tolerance, cold_tolerance, kids_score, separation_anxiety, first_time_owner, apt_score,
  health_issues_text, vet_cost_text, vet_cost_min_inr, vet_cost_max_inr, vet_cost_period_assumed,
  price_text, price_type, price_min_inr, price_max_inr, availability, temperament
)
SELECT
  b.id, '{"Species":"Bird","Breed":"African Grey","Origin":"Africa","Cage Size":"36x24x48\"","Lifespan":"40-60","Energy(1-5)":"3","Talking(1-5)":"5","Intel(1-5)":"5","Mess(1-5)":"4","Noise(1-5)":"3","HeatTol(1-5)":"3","ColdTol(1-5)":"2","Kids(1-5)":"2","SepAnx(1-5)":"5","1stTime(1-5)":"1","Apt(1-5)":"2","Health Issues":"Feather plucking, Calcium","VetCost(₹)":"5k-10k","Price(₹)":"80k-1.5L","Avail":"Rare","Temperament":"Genius-level intellect, highly sensitive"}'::jsonb, '{}'::text[], 'owner_research_v1',
  'Africa', '36x24x48"', 36, 24, 48,
  '40-60', 40, 60,
  3, 5, 5, 4, 3,
  3, 2, 2, 5, 1, 2,
  'Feather plucking, Calcium', '5k-10k', 5000, 10000, true,
  '80k-1.5L', 'purchase', 80000, 150000, 'Rare', 'Genius-level intellect, highly sensitive'
FROM public.breeds b
WHERE b.slug IN ('african-grey-parrot')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  origin_text = EXCLUDED.origin_text,
  cage_size_text = EXCLUDED.cage_size_text,
  cage_length_in = EXCLUDED.cage_length_in,
  cage_width_in = EXCLUDED.cage_width_in,
  cage_height_in = EXCLUDED.cage_height_in,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  energy_level = EXCLUDED.energy_level,
  talking_ability = EXCLUDED.talking_ability,
  intelligence = EXCLUDED.intelligence,
  mess_level = EXCLUDED.mess_level,
  noise_level = EXCLUDED.noise_level,
  heat_tolerance = EXCLUDED.heat_tolerance,
  cold_tolerance = EXCLUDED.cold_tolerance,
  kids_score = EXCLUDED.kids_score,
  separation_anxiety = EXCLUDED.separation_anxiety,
  first_time_owner = EXCLUDED.first_time_owner,
  apt_score = EXCLUDED.apt_score,
  health_issues_text = EXCLUDED.health_issues_text,
  vet_cost_text = EXCLUDED.vet_cost_text,
  vet_cost_min_inr = EXCLUDED.vet_cost_min_inr,
  vet_cost_max_inr = EXCLUDED.vet_cost_max_inr,
  vet_cost_period_assumed = EXCLUDED.vet_cost_period_assumed,
  price_text = EXCLUDED.price_text,
  price_type = EXCLUDED.price_type,
  price_min_inr = EXCLUDED.price_min_inr,
  price_max_inr = EXCLUDED.price_max_inr,
  availability = EXCLUDED.availability,
  temperament = EXCLUDED.temperament;

-- 9. Breed Detail Aquatic & Reptile (Layer 2 - 3 Rows, Upsert on breed_id)
INSERT INTO public.breed_detail_aquatic_reptile (
  breed_id, raw, parse_warnings, source,
  origin_text, enclosure_text, enclosure_gallons_min, enclosure_open_ended, setup_text,
  lifespan_text, lifespan_min_years, lifespan_max_years,
  care_difficulty, heat_tolerance, cold_tolerance, kids_score, first_time_owner, apt_score,
  health_issues_text, vet_cost_text, vet_cost_min_inr, vet_cost_max_inr, vet_cost_period_assumed,
  price_text, price_type, price_min_inr, price_max_inr, availability, temperament
)
SELECT
  b.id, '{"Species":"Fish","Breed":"Betta","Origin":"Thailand","Enclosure":"5-10 Gal","Water/Setup":"Heated, Filtered","Lifespan":"2-5","Care(1-5)":"2","HeatTol(1-5)":"5","ColdTol(1-5)":"1","Kids(1-5)":"2","1stTime(1-5)":"4","Apt(1-5)":"5","Health Issues":"Fin rot, Dropsy","VetCost(₹)":"N/A","Price(₹)":"100-500","Avail":"Common","Temperament":"Aggressive to males, interactive"}'::jsonb, '{}'::text[], 'owner_research_v1',
  'Thailand', '5-10 Gal', 5, false, 'Heated, Filtered',
  '2-5', 2, 5,
  2, 5, 1, 2, 4, 5,
  'Fin rot, Dropsy', 'N/A', NULL, NULL, true,
  '100-500', 'purchase', 100, 500, 'Common', 'Aggressive to males, interactive'
FROM public.breeds b
WHERE b.slug IN ('betta-siamese-fighting')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  origin_text = EXCLUDED.origin_text,
  enclosure_text = EXCLUDED.enclosure_text,
  enclosure_gallons_min = EXCLUDED.enclosure_gallons_min,
  enclosure_open_ended = EXCLUDED.enclosure_open_ended,
  setup_text = EXCLUDED.setup_text,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  care_difficulty = EXCLUDED.care_difficulty,
  heat_tolerance = EXCLUDED.heat_tolerance,
  cold_tolerance = EXCLUDED.cold_tolerance,
  kids_score = EXCLUDED.kids_score,
  first_time_owner = EXCLUDED.first_time_owner,
  apt_score = EXCLUDED.apt_score,
  health_issues_text = EXCLUDED.health_issues_text,
  vet_cost_text = EXCLUDED.vet_cost_text,
  vet_cost_min_inr = EXCLUDED.vet_cost_min_inr,
  vet_cost_max_inr = EXCLUDED.vet_cost_max_inr,
  vet_cost_period_assumed = EXCLUDED.vet_cost_period_assumed,
  price_text = EXCLUDED.price_text,
  price_type = EXCLUDED.price_type,
  price_min_inr = EXCLUDED.price_min_inr,
  price_max_inr = EXCLUDED.price_max_inr,
  availability = EXCLUDED.availability,
  temperament = EXCLUDED.temperament;

INSERT INTO public.breed_detail_aquatic_reptile (
  breed_id, raw, parse_warnings, source,
  origin_text, enclosure_text, enclosure_gallons_min, enclosure_open_ended, setup_text,
  lifespan_text, lifespan_min_years, lifespan_max_years,
  care_difficulty, heat_tolerance, cold_tolerance, kids_score, first_time_owner, apt_score,
  health_issues_text, vet_cost_text, vet_cost_min_inr, vet_cost_max_inr, vet_cost_period_assumed,
  price_text, price_type, price_min_inr, price_max_inr, availability, temperament
)
SELECT
  b.id, '{"Species":"Reptile","Breed":"Leopard Gecko","Origin":"Asia","Enclosure":"20+ Gal","Water/Setup":"Dry, Warm Hide","Lifespan":"15-20","Care(1-5)":"2","HeatTol(1-5)":"4","ColdTol(1-5)":"2","Kids(1-5)":"3","1stTime(1-5)":"4","Apt(1-5)":"5","Health Issues":"Impaction, MBD","VetCost(₹)":"2k-4k","Price(₹)":"3k-6k","Avail":"Common","Temperament":"Docile, insectivore, nocturnal"}'::jsonb, '{}'::text[], 'owner_research_v1',
  'Asia', '20+ Gal', 20, true, 'Dry, Warm Hide',
  '15-20', 15, 20,
  2, 4, 2, 3, 4, 5,
  'Impaction, MBD', '2k-4k', 2000, 4000, true,
  '3k-6k', 'purchase', 3000, 6000, 'Common', 'Docile, insectivore, nocturnal'
FROM public.breeds b
WHERE b.slug IN ('leopard-gecko')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  origin_text = EXCLUDED.origin_text,
  enclosure_text = EXCLUDED.enclosure_text,
  enclosure_gallons_min = EXCLUDED.enclosure_gallons_min,
  enclosure_open_ended = EXCLUDED.enclosure_open_ended,
  setup_text = EXCLUDED.setup_text,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  care_difficulty = EXCLUDED.care_difficulty,
  heat_tolerance = EXCLUDED.heat_tolerance,
  cold_tolerance = EXCLUDED.cold_tolerance,
  kids_score = EXCLUDED.kids_score,
  first_time_owner = EXCLUDED.first_time_owner,
  apt_score = EXCLUDED.apt_score,
  health_issues_text = EXCLUDED.health_issues_text,
  vet_cost_text = EXCLUDED.vet_cost_text,
  vet_cost_min_inr = EXCLUDED.vet_cost_min_inr,
  vet_cost_max_inr = EXCLUDED.vet_cost_max_inr,
  vet_cost_period_assumed = EXCLUDED.vet_cost_period_assumed,
  price_text = EXCLUDED.price_text,
  price_type = EXCLUDED.price_type,
  price_min_inr = EXCLUDED.price_min_inr,
  price_max_inr = EXCLUDED.price_max_inr,
  availability = EXCLUDED.availability,
  temperament = EXCLUDED.temperament;

INSERT INTO public.breed_detail_aquatic_reptile (
  breed_id, raw, parse_warnings, source,
  origin_text, enclosure_text, enclosure_gallons_min, enclosure_open_ended, setup_text,
  lifespan_text, lifespan_min_years, lifespan_max_years,
  care_difficulty, heat_tolerance, cold_tolerance, kids_score, first_time_owner, apt_score,
  health_issues_text, vet_cost_text, vet_cost_min_inr, vet_cost_max_inr, vet_cost_period_assumed,
  price_text, price_type, price_min_inr, price_max_inr, availability, temperament
)
SELECT
  b.id, '{"Species":"Turtle","Breed":"Red-eared Slider","Origin":"US","Enclosure":"75+ Gal","Water/Setup":"Water + Basking","Lifespan":"20-30","Care(1-5)":"4","HeatTol(1-5)":"4","ColdTol(1-5)":"2","Kids(1-5)":"2","1stTime(1-5)":"2","Apt(1-5)":"3","Health Issues":"Shell rot, MBD, Salmonella","VetCost(₹)":"3k-5k","Price(₹)":"500-1.5k","Avail":"Common","Temperament":"Invasive, massive bio-load, messy"}'::jsonb, '{}'::text[], 'owner_research_v1',
  'US', '75+ Gal', 75, true, 'Water + Basking',
  '20-30', 20, 30,
  4, 4, 2, 2, 2, 3,
  'Shell rot, MBD, Salmonella', '3k-5k', 3000, 5000, true,
  '500-1.5k', 'purchase', 500, 1500, 'Common', 'Invasive, massive bio-load, messy'
FROM public.breeds b
WHERE b.slug IN ('red-eared-slider')
LIMIT 1
ON CONFLICT (breed_id) DO UPDATE SET
  raw = EXCLUDED.raw,
  parse_warnings = EXCLUDED.parse_warnings,
  origin_text = EXCLUDED.origin_text,
  enclosure_text = EXCLUDED.enclosure_text,
  enclosure_gallons_min = EXCLUDED.enclosure_gallons_min,
  enclosure_open_ended = EXCLUDED.enclosure_open_ended,
  setup_text = EXCLUDED.setup_text,
  lifespan_text = EXCLUDED.lifespan_text,
  lifespan_min_years = EXCLUDED.lifespan_min_years,
  lifespan_max_years = EXCLUDED.lifespan_max_years,
  care_difficulty = EXCLUDED.care_difficulty,
  heat_tolerance = EXCLUDED.heat_tolerance,
  cold_tolerance = EXCLUDED.cold_tolerance,
  kids_score = EXCLUDED.kids_score,
  first_time_owner = EXCLUDED.first_time_owner,
  apt_score = EXCLUDED.apt_score,
  health_issues_text = EXCLUDED.health_issues_text,
  vet_cost_text = EXCLUDED.vet_cost_text,
  vet_cost_min_inr = EXCLUDED.vet_cost_min_inr,
  vet_cost_max_inr = EXCLUDED.vet_cost_max_inr,
  vet_cost_period_assumed = EXCLUDED.vet_cost_period_assumed,
  price_text = EXCLUDED.price_text,
  price_type = EXCLUDED.price_type,
  price_min_inr = EXCLUDED.price_min_inr,
  price_max_inr = EXCLUDED.price_max_inr,
  availability = EXCLUDED.availability,
  temperament = EXCLUDED.temperament;

COMMIT;
