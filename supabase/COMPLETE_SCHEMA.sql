-- PawMatch India: Supabase PostgreSQL Schema Migration 0001
-- Tables, Types, Enums, Constraints, Indexes, and Auto-Profile Triggers

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Enumerated Types
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('adopter', 'shelter', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.size_category AS ENUM ('small', 'medium', 'large', 'giant');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.cost_category AS ENUM ('food', 'grooming', 'vet', 'insurance', 'supplies', 'training');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.quiz_question_type AS ENUM ('single', 'multi', 'scale');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.service_provider_category AS ENUM ('vet', 'trainer', 'groomer', 'sitter');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.shelter_plan AS ENUM ('free', 'featured');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.pet_status AS ENUM ('available', 'in_trial', 'adopted');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.inquiry_status AS ENUM ('new', 'contacted', 'closed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.advisor_message_role AS ENUM ('user', 'assistant');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.trial_booking_status AS ENUM ('pending', 'active', 'adopted', 'returned', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.subscription_plan AS ENUM ('free', 'premium');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.billing_cycle AS ENUM ('monthly', 'yearly');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_purpose AS ENUM ('trial', 'subscription', 'featured_listing');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('created', 'paid', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.reminder_type AS ENUM ('vaccination', 'checkup', 'deworming', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Utility Trigger Function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 4. User Profiles (Mirrors and extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role public.user_role NOT NULL DEFAULT 'adopter',
  city text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'User profile information linked 1:1 with auth.users, specifying role (adopter, shelter, admin).';

-- Function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Auto-create profile trigger on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, city, phone, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'adopter'::public.user_role),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    city = EXCLUDED.city,
    phone = EXCLUDED.phone;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- GROUP 1: STATIC REFERENCE TABLES (Public SELECT; write only by admin/service)
-- ============================================================================

-- 1. Species
CREATE TABLE IF NOT EXISTS public.species (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.species IS 'Reference catalog for animal species (e.g. Dog, Cat).';

-- 2. Breeds (with 16 trait columns smallint 1-5, physical ranges, and coat metadata)
CREATE TABLE IF NOT EXISTS public.breeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id uuid NOT NULL REFERENCES public.species(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  breed_group text,
  origin_country text,
  is_indian_native boolean NOT NULL DEFAULT false,
  size_category public.size_category NOT NULL DEFAULT 'medium',
  weight_min_kg numeric(5,2),
  weight_max_kg numeric(5,2),
  height_min_cm numeric(5,2),
  height_max_cm numeric(5,2),
  lifespan_min_years smallint,
  lifespan_max_years smallint,
  description text,
  image_url text,
  source text,
  -- 16 trait columns rated 1 to 5
  affectionate_with_family smallint DEFAULT 3 CHECK (affectionate_with_family BETWEEN 1 AND 5),
  good_with_young_children smallint DEFAULT 3 CHECK (good_with_young_children BETWEEN 1 AND 5),
  good_with_other_dogs smallint DEFAULT 3 CHECK (good_with_other_dogs BETWEEN 1 AND 5),
  shedding_level smallint DEFAULT 3 CHECK (shedding_level BETWEEN 1 AND 5),
  coat_grooming_frequency smallint DEFAULT 3 CHECK (coat_grooming_frequency BETWEEN 1 AND 5),
  drooling_level smallint DEFAULT 1 CHECK (drooling_level BETWEEN 1 AND 5),
  openness_to_strangers smallint DEFAULT 3 CHECK (openness_to_strangers BETWEEN 1 AND 5),
  playfulness_level smallint DEFAULT 3 CHECK (playfulness_level BETWEEN 1 AND 5),
  protective_nature smallint DEFAULT 3 CHECK (protective_nature BETWEEN 1 AND 5),
  adaptability_level smallint DEFAULT 3 CHECK (adaptability_level BETWEEN 1 AND 5),
  trainability_level smallint DEFAULT 3 CHECK (trainability_level BETWEEN 1 AND 5),
  energy_level smallint DEFAULT 3 CHECK (energy_level BETWEEN 1 AND 5),
  barking_level smallint DEFAULT 3 CHECK (barking_level BETWEEN 1 AND 5),
  mental_stimulation_needs smallint DEFAULT 3 CHECK (mental_stimulation_needs BETWEEN 1 AND 5),
  heat_tolerance smallint DEFAULT 3 CHECK (heat_tolerance BETWEEN 1 AND 5),
  apartment_friendly_score smallint DEFAULT 3 CHECK (apartment_friendly_score BETWEEN 1 AND 5),
  -- Coat metadata
  coat_type text,
  coat_length text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.breeds IS 'Breed reference catalog with detailed temperament, shedding, energy, trainability, and morphology benchmarks.';

DROP TRIGGER IF EXISTS tr_breeds_updated_at ON public.breeds;
CREATE TRIGGER tr_breeds_updated_at
  BEFORE UPDATE ON public.breeds
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. Health Conditions
CREATE TABLE IF NOT EXISTS public.health_conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  severity text,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.health_conditions IS 'Known hereditary and environmental health risks affecting companion animals.';

-- 4. Breed Health Conditions Join Table
CREATE TABLE IF NOT EXISTS public.breed_health_conditions (
  breed_id uuid NOT NULL REFERENCES public.breeds(id) ON DELETE CASCADE,
  condition_id uuid NOT NULL REFERENCES public.health_conditions(id) ON DELETE CASCADE,
  PRIMARY KEY (breed_id, condition_id)
);
COMMENT ON TABLE public.breed_health_conditions IS 'Associative mapping between breeds and potential predisposed health conditions.';

-- 5. Indian Cities Reference
CREATE TABLE IF NOT EXISTS public.cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  state text NOT NULL,
  tier smallint NOT NULL CHECK (tier BETWEEN 1 AND 3),
  pet_friendly_score smallint CHECK (pet_friendly_score BETWEEN 1 AND 100),
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.cities IS 'Indian urban locations with city tier classifications (1, 2, 3) and pet friendliness rankings.';

-- 6. Cost Benchmarks
CREATE TABLE IF NOT EXISTS public.cost_benchmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id uuid NOT NULL REFERENCES public.species(id) ON DELETE CASCADE,
  size_category public.size_category NOT NULL,
  city_tier smallint NOT NULL CHECK (city_tier BETWEEN 1 AND 3),
  category public.cost_category NOT NULL,
  monthly_min_inr numeric(10,2) NOT NULL DEFAULT 0,
  monthly_max_inr numeric(10,2) NOT NULL DEFAULT 0,
  one_time_min_inr numeric(10,2) NOT NULL DEFAULT 0,
  one_time_max_inr numeric(10,2) NOT NULL DEFAULT 0,
  notes text,
  is_estimate boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.cost_benchmarks IS 'Regional financial benchmarks across Indian cities and pet sizes for food, vet care, grooming, and gear.';

-- 7. Vaccination Schedules
CREATE TABLE IF NOT EXISTS public.vaccination_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id uuid NOT NULL REFERENCES public.species(id) ON DELETE CASCADE,
  vaccine_name text NOT NULL,
  protects_against text NOT NULL,
  first_dose_age_weeks smallint NOT NULL,
  booster_interval_weeks smallint,
  is_core boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.vaccination_schedules IS 'Standard veterinary immunization milestones for companion animals in India.';

-- 8. First 30 Days Tasks
CREATE TABLE IF NOT EXISTS public.first_30_days_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id uuid NOT NULL REFERENCES public.species(id) ON DELETE CASCADE,
  day_from smallint NOT NULL,
  day_to smallint NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  sort_order smallint NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.first_30_days_tasks IS 'Curated step-by-step onboarding roadmap tasks for the first 30 days of pet parenthood.';

-- 9. Quiz Questions
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order smallint NOT NULL DEFAULT 0,
  text text NOT NULL,
  type public.quiz_question_type NOT NULL DEFAULT 'single',
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.quiz_questions IS 'Core compatibility questionnaire questions evaluating space, budget, time, and lifestyle.';

-- 10. Quiz Options
CREATE TABLE IF NOT EXISTS public.quiz_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  label text NOT NULL,
  value text NOT NULL,
  trait_weights jsonb NOT NULL DEFAULT '{}'::jsonb,
  filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.quiz_options IS 'Selectable questionnaire options containing trait score adjustment weights and hard exclusion filters.';

-- 11. Partners (Affiliate / Resource Partners)
CREATE TABLE IF NOT EXISTS public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  url text NOT NULL,
  commission_note text,
  city_id uuid REFERENCES public.cities(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  is_sponsored boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.partners IS 'Verified commercial & non-profit partners for food, pet insurance, travel, and supplies.';

-- 12. Service Providers (Vets, Trainers, Groomers, Sitters)
CREATE TABLE IF NOT EXISTS public.service_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category public.service_provider_category NOT NULL,
  city_id uuid NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  phone text NOT NULL,
  email text,
  description text,
  is_verified boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.service_providers IS 'Local directory of verified veterinarians, trainers, groomers, and pet boarding providers.';

-- 13. Shelter Outcome Statistics
CREATE TABLE IF NOT EXISTS public.shelter_outcome_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  species text NOT NULL,
  age_group text NOT NULL,
  size_category public.size_category NOT NULL,
  outcome_type text NOT NULL,
  avg_days_in_shelter numeric(6,2) NOT NULL,
  sample_size integer NOT NULL,
  source text,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.shelter_outcome_stats IS 'Aggregated adoption statistics showing average stay durations and adoption velocity across India.';

-- ============================================================================
-- GROUP 2: DYNAMIC TABLES (User, Shelter, and Transactional Data)
-- ============================================================================

-- 14. Shelters
CREATE TABLE IF NOT EXISTS public.shelters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  city_id uuid NOT NULL REFERENCES public.cities(id) ON DELETE RESTRICT,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  description text,
  is_verified boolean NOT NULL DEFAULT false,
  plan public.shelter_plan NOT NULL DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.shelters IS 'Rescue shelters and foster agencies registered to post adoptable companion animals.';

DROP TRIGGER IF EXISTS tr_shelters_updated_at ON public.shelters;
CREATE TRIGGER tr_shelters_updated_at
  BEFORE UPDATE ON public.shelters
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 15. Pets (Adoptable animals in shelters)
CREATE TABLE IF NOT EXISTS public.pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shelter_id uuid NOT NULL REFERENCES public.shelters(id) ON DELETE CASCADE,
  species_id uuid NOT NULL REFERENCES public.species(id) ON DELETE RESTRICT,
  breed_id uuid REFERENCES public.breeds(id) ON DELETE SET NULL,
  name text NOT NULL,
  age_months smallint NOT NULL,
  sex text NOT NULL,
  size_category public.size_category NOT NULL DEFAULT 'medium',
  temperament_tags text[] DEFAULT '{}'::text[],
  medical_notes text,
  is_vaccinated boolean NOT NULL DEFAULT true,
  is_neutered boolean NOT NULL DEFAULT true,
  photo_urls text[] DEFAULT '{}'::text[],
  status public.pet_status NOT NULL DEFAULT 'available',
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.pets IS 'Adoptable rescue pets listed by registered shelters.';

DROP TRIGGER IF EXISTS tr_pets_updated_at ON public.pets;
CREATE TRIGGER tr_pets_updated_at
  BEFORE UPDATE ON public.pets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 16. Adoption Inquiries
CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  status public.inquiry_status NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.inquiries IS 'Adopter inquiries submitted to shelters for specific adoptable pets.';

DROP TRIGGER IF EXISTS tr_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER tr_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 17. Quiz Sessions
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  anon_session_id text,
  consent_analytics boolean NOT NULL DEFAULT false,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);
COMMENT ON TABLE public.quiz_sessions IS 'Compatibility assessment runs submitted by registered users or anonymous guest sessions.';

-- 18. Quiz Answers
CREATE TABLE IF NOT EXISTS public.quiz_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  option_ids uuid[] DEFAULT '{}'::uuid[],
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.quiz_answers IS 'Individual user responses recorded within a quiz session.';

-- 19. Quiz Results
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  readiness_score smallint CHECK (readiness_score BETWEEN 0 AND 100),
  top_breeds jsonb NOT NULL DEFAULT '[]'::jsonb,
  forecast jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.quiz_results IS 'Computed lifestyle compatibility match outputs, readiness scores, and budget forecasts.';

-- 20. Saved Breeds (Favorites / Bookmarks)
CREATE TABLE IF NOT EXISTS public.saved_breeds (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  breed_id uuid NOT NULL REFERENCES public.breeds(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, breed_id)
);
COMMENT ON TABLE public.saved_breeds IS 'User bookmarks for breeds of interest.';

-- 21. Advisor Conversations (AI Pet Advisor)
CREATE TABLE IF NOT EXISTS public.advisor_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Pet Consultation',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.advisor_conversations IS 'Chat history sessions with the AI Pet Lifestyle Advisor.';

DROP TRIGGER IF EXISTS tr_advisor_conversations_updated_at ON public.advisor_conversations;
CREATE TRIGGER tr_advisor_conversations_updated_at
  BEFORE UPDATE ON public.advisor_conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 22. Advisor Messages
CREATE TABLE IF NOT EXISTS public.advisor_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.advisor_conversations(id) ON DELETE CASCADE,
  role public.advisor_message_role NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.advisor_messages IS 'Exchanged messages within an AI Pet Advisor consultation.';

-- 23. Usage Counters (Daily rate limits)
CREATE TABLE IF NOT EXISTS public.usage_counters (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  usage_date date NOT NULL DEFAULT CURRENT_DATE,
  advisor_messages_count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, usage_date)
);
COMMENT ON TABLE public.usage_counters IS 'Daily message counters for enforcing free and premium AI advisor usage tiers.';

-- 24. Trial Bookings (Foster-to-Adopt)
CREATE TABLE IF NOT EXISTS public.trial_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  duration_days smallint NOT NULL DEFAULT 7,
  fee_inr numeric(10,2) NOT NULL DEFAULT 0,
  status public.trial_booking_status NOT NULL DEFAULT 'pending',
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.trial_bookings IS 'Structured 7-to-14 day home trial bookings for potential adopters.';

DROP TRIGGER IF EXISTS tr_trial_bookings_updated_at ON public.trial_bookings;
CREATE TRIGGER tr_trial_bookings_updated_at
  BEFORE UPDATE ON public.trial_bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 25. Trial Check-ins
CREATE TABLE IF NOT EXISTS public.trial_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.trial_bookings(id) ON DELETE CASCADE,
  day_number smallint NOT NULL,
  note text NOT NULL,
  mood smallint CHECK (mood BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.trial_checkins IS 'Daily behavioral check-ins submitted during an active foster trial.';

-- 26. Subscriptions (Premium Memberships)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan public.subscription_plan NOT NULL DEFAULT 'free',
  billing public.billing_cycle NOT NULL DEFAULT 'monthly',
  status text NOT NULL DEFAULT 'active',
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.subscriptions IS 'Premium membership tiers unlocking personalized pet care roadmaps and priority support.';

DROP TRIGGER IF EXISTS tr_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER tr_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 27. Payments
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  purpose public.payment_purpose NOT NULL,
  amount_inr numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status public.payment_status NOT NULL DEFAULT 'created',
  provider text NOT NULL DEFAULT 'mock',
  provider_ref text,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.payments IS 'Payment transactions for trial foster bookings, premium memberships, and shelter listing upgrades.';

-- 28. Leads (Service Directory Inquiries)
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  message text,
  consent boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.leads IS 'Service quote and appointment inquiries routed to verified local pet professionals.';

-- 29. Partner Inquiries (B2B / Sponsorship)
CREATE TABLE IF NOT EXISTS public.partner_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.partner_inquiries IS 'B2B affiliate, brand sponsorship, and shelter partnership requests.';

-- 30. Reminders (Pet Care Alerts)
CREATE TABLE IF NOT EXISTS public.reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pet_name text NOT NULL,
  type public.reminder_type NOT NULL DEFAULT 'other',
  due_date date NOT NULL,
  done boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.reminders IS 'Preventive health, vaccination, and deworming reminders for pet parents.';

DROP TRIGGER IF EXISTS tr_reminders_updated_at ON public.reminders;
CREATE TRIGGER tr_reminders_updated_at
  BEFORE UPDATE ON public.reminders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 31. Events (Privacy-preserving telemetry)
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  entity_type text,
  entity_id text,
  anon_session_id text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE public.events IS 'Anonymized system and behavioral analytics event stream containing no PII.';

-- ============================================================================
-- INDEXES (All foreign keys, slug lookups, status filters, and events)
-- ============================================================================

-- Breeds & Species
CREATE INDEX IF NOT EXISTS idx_breeds_species_id ON public.breeds(species_id);
CREATE INDEX IF NOT EXISTS idx_breeds_slug ON public.breeds(slug);
CREATE INDEX IF NOT EXISTS idx_breeds_size_category ON public.breeds(size_category);
CREATE INDEX IF NOT EXISTS idx_breeds_is_indian_native ON public.breeds(is_indian_native);

-- Breed Health Conditions
CREATE INDEX IF NOT EXISTS idx_bhc_breed_id ON public.breed_health_conditions(breed_id);
CREATE INDEX IF NOT EXISTS idx_bhc_condition_id ON public.breed_health_conditions(condition_id);

-- Static Reference Tables
CREATE INDEX IF NOT EXISTS idx_cost_benchmarks_species ON public.cost_benchmarks(species_id);
CREATE INDEX IF NOT EXISTS idx_vaccination_schedules_species ON public.vaccination_schedules(species_id);
CREATE INDEX IF NOT EXISTS idx_first_30_days_tasks_species ON public.first_30_days_tasks(species_id);
CREATE INDEX IF NOT EXISTS idx_quiz_options_question_id ON public.quiz_options(question_id);
CREATE INDEX IF NOT EXISTS idx_partners_city_id ON public.partners(city_id);
CREATE INDEX IF NOT EXISTS idx_service_providers_city_id ON public.service_providers(city_id);

-- Shelters & Pets
CREATE INDEX IF NOT EXISTS idx_shelters_owner_id ON public.shelters(owner_id);
CREATE INDEX IF NOT EXISTS idx_shelters_city_id ON public.shelters(city_id);
CREATE INDEX IF NOT EXISTS idx_pets_shelter_id ON public.pets(shelter_id);
CREATE INDEX IF NOT EXISTS idx_pets_species_id ON public.pets(species_id);
CREATE INDEX IF NOT EXISTS idx_pets_breed_id ON public.pets(breed_id);
CREATE INDEX IF NOT EXISTS idx_pets_status_is_featured ON public.pets(status, is_featured);

-- Inquiries
CREATE INDEX IF NOT EXISTS idx_inquiries_pet_id ON public.inquiries(pet_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_user_id ON public.inquiries(user_id);

-- Quiz Sessions, Answers, Results
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_id ON public.quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_anon_id ON public.quiz_sessions(anon_session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_session_id ON public.quiz_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_question_id ON public.quiz_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_session_id ON public.quiz_results(session_id);

-- Saved Breeds
CREATE INDEX IF NOT EXISTS idx_saved_breeds_user_id ON public.saved_breeds(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_breeds_breed_id ON public.saved_breeds(breed_id);

-- Advisor
CREATE INDEX IF NOT EXISTS idx_advisor_conv_user_id ON public.advisor_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_advisor_msg_conv_id ON public.advisor_messages(conversation_id);

-- Usage Counters
CREATE INDEX IF NOT EXISTS idx_usage_counters_user_id ON public.usage_counters(user_id);

-- Trials
CREATE INDEX IF NOT EXISTS idx_trial_bookings_user_id ON public.trial_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_trial_bookings_pet_id ON public.trial_bookings(pet_id);
CREATE INDEX IF NOT EXISTS idx_trial_checkins_booking_id ON public.trial_checkins(booking_id);

-- Subscriptions & Payments
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);

-- Leads & Reminders
CREATE INDEX IF NOT EXISTS idx_leads_provider_id ON public.leads(provider_id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON public.reminders(user_id);

-- Events Telemetry
CREATE INDEX IF NOT EXISTS idx_events_type_created_at ON public.events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_events_anon_session_id ON public.events(anon_session_id);


-- PawMatch India: Supabase Row Level Security (RLS) Migration 0002
-- Enables RLS on all 32 tables and defines least-privilege security policies.

-- ============================================================================
-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Static Reference Tables
ALTER TABLE public.species ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breed_health_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccination_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.first_30_days_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shelter_outcome_stats ENABLE ROW LEVEL SECURITY;

-- Dynamic & User Tables
ALTER TABLE public.shelters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_breeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. PROFILES POLICIES
-- ============================================================================

CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_insert_own_or_admin"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_update_own_or_admin"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_delete_admin_only"
  ON public.profiles
  FOR DELETE
  USING (public.is_admin());

-- ============================================================================
-- 3. STATIC REFERENCE TABLES POLICIES (Public read; admin write only)
-- ============================================================================

-- Species
CREATE POLICY "species_public_read" ON public.species FOR SELECT USING (true);
CREATE POLICY "species_admin_write" ON public.species FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Breeds
CREATE POLICY "breeds_public_read" ON public.breeds FOR SELECT USING (true);
CREATE POLICY "breeds_admin_write" ON public.breeds FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Health Conditions
CREATE POLICY "health_conditions_public_read" ON public.health_conditions FOR SELECT USING (true);
CREATE POLICY "health_conditions_admin_write" ON public.health_conditions FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Breed Health Conditions
CREATE POLICY "breed_health_conditions_public_read" ON public.breed_health_conditions FOR SELECT USING (true);
CREATE POLICY "breed_health_conditions_admin_write" ON public.breed_health_conditions FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Cities
CREATE POLICY "cities_public_read" ON public.cities FOR SELECT USING (true);
CREATE POLICY "cities_admin_write" ON public.cities FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Cost Benchmarks
CREATE POLICY "cost_benchmarks_public_read" ON public.cost_benchmarks FOR SELECT USING (true);
CREATE POLICY "cost_benchmarks_admin_write" ON public.cost_benchmarks FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Vaccination Schedules
CREATE POLICY "vaccination_schedules_public_read" ON public.vaccination_schedules FOR SELECT USING (true);
CREATE POLICY "vaccination_schedules_admin_write" ON public.vaccination_schedules FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- First 30 Days Tasks
CREATE POLICY "first_30_days_tasks_public_read" ON public.first_30_days_tasks FOR SELECT USING (true);
CREATE POLICY "first_30_days_tasks_admin_write" ON public.first_30_days_tasks FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Quiz Questions
CREATE POLICY "quiz_questions_public_read" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "quiz_questions_admin_write" ON public.quiz_questions FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Quiz Options
CREATE POLICY "quiz_options_public_read" ON public.quiz_options FOR SELECT USING (true);
CREATE POLICY "quiz_options_admin_write" ON public.quiz_options FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Partners
CREATE POLICY "partners_public_read" ON public.partners FOR SELECT USING (true);
CREATE POLICY "partners_admin_write" ON public.partners FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Service Providers
CREATE POLICY "service_providers_public_read" ON public.service_providers FOR SELECT USING (true);
CREATE POLICY "service_providers_admin_write" ON public.service_providers FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Shelter Outcome Stats
CREATE POLICY "shelter_outcome_stats_public_read" ON public.shelter_outcome_stats FOR SELECT USING (true);
CREATE POLICY "shelter_outcome_stats_admin_write" ON public.shelter_outcome_stats FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================================
-- 4. DYNAMIC & USER TABLES POLICIES
-- ============================================================================

-- Shelters
-- Public can browse verified shelters; shelter owners can manage their own shelter; admins have full access
CREATE POLICY "shelters_public_read"
  ON public.shelters
  FOR SELECT
  USING (true);

CREATE POLICY "shelters_owner_insert"
  ON public.shelters
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "shelters_owner_update"
  ON public.shelters
  FOR UPDATE
  USING (auth.uid() = owner_id OR public.is_admin())
  WITH CHECK (auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "shelters_owner_delete"
  ON public.shelters
  FOR DELETE
  USING (auth.uid() = owner_id OR public.is_admin());

-- Pets
-- Adopters can read available pets; owning shelters can view all their pets; only owning shelter or admin can write
CREATE POLICY "pets_select_policy"
  ON public.pets
  FOR SELECT
  USING (
    status = 'available'
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.shelters
      WHERE shelters.id = pets.shelter_id
        AND shelters.owner_id = auth.uid()
    )
  );

CREATE POLICY "pets_insert_policy"
  ON public.pets
  FOR INSERT
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.shelters
      WHERE shelters.id = pets.shelter_id
        AND shelters.owner_id = auth.uid()
    )
  );

CREATE POLICY "pets_update_policy"
  ON public.pets
  FOR UPDATE
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.shelters
      WHERE shelters.id = pets.shelter_id
        AND shelters.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.shelters
      WHERE shelters.id = pets.shelter_id
        AND shelters.owner_id = auth.uid()
    )
  );

CREATE POLICY "pets_delete_policy"
  ON public.pets
  FOR DELETE
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.shelters
      WHERE shelters.id = pets.shelter_id
        AND shelters.owner_id = auth.uid()
    )
  );

-- Inquiries
-- Users can view their own inquiries; owning shelter owners can view inquiries for their pets; admins can view all
CREATE POLICY "inquiries_select_policy"
  ON public.inquiries
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.pets
      JOIN public.shelters ON pets.shelter_id = shelters.id
      WHERE pets.id = inquiries.pet_id
        AND shelters.owner_id = auth.uid()
    )
  );

CREATE POLICY "inquiries_insert_policy"
  ON public.inquiries
  FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "inquiries_update_policy"
  ON public.inquiries
  FOR UPDATE
  USING (
    user_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.pets
      JOIN public.shelters ON pets.shelter_id = shelters.id
      WHERE pets.id = inquiries.pet_id
        AND shelters.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    user_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.pets
      JOIN public.shelters ON pets.shelter_id = shelters.id
      WHERE pets.id = inquiries.pet_id
        AND shelters.owner_id = auth.uid()
    )
  );

CREATE POLICY "inquiries_delete_policy"
  ON public.inquiries
  FOR DELETE
  USING (user_id = auth.uid() OR public.is_admin());

-- Quiz Sessions
-- Anonymous quiz data: anon users must NOT access quiz tables directly (must route through server API via service role).
-- Authenticated users access only their own sessions.
CREATE POLICY "quiz_sessions_select_own"
  ON public.quiz_sessions
  FOR SELECT
  USING ((user_id IS NOT NULL AND user_id = auth.uid()) OR public.is_admin());

CREATE POLICY "quiz_sessions_insert_own"
  ON public.quiz_sessions
  FOR INSERT
  WITH CHECK ((user_id IS NOT NULL AND user_id = auth.uid()) OR public.is_admin());

CREATE POLICY "quiz_sessions_update_own"
  ON public.quiz_sessions
  FOR UPDATE
  USING ((user_id IS NOT NULL AND user_id = auth.uid()) OR public.is_admin())
  WITH CHECK ((user_id IS NOT NULL AND user_id = auth.uid()) OR public.is_admin());

CREATE POLICY "quiz_sessions_delete_own"
  ON public.quiz_sessions
  FOR DELETE
  USING ((user_id IS NOT NULL AND user_id = auth.uid()) OR public.is_admin());

-- Quiz Answers (Access via parent quiz_session ownership)
CREATE POLICY "quiz_answers_select_policy"
  ON public.quiz_answers
  FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.quiz_sessions
      WHERE quiz_sessions.id = quiz_answers.session_id
        AND quiz_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "quiz_answers_insert_policy"
  ON public.quiz_answers
  FOR INSERT
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.quiz_sessions
      WHERE quiz_sessions.id = quiz_answers.session_id
        AND quiz_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "quiz_answers_update_policy"
  ON public.quiz_answers
  FOR UPDATE
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.quiz_sessions
      WHERE quiz_sessions.id = quiz_answers.session_id
        AND quiz_sessions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.quiz_sessions
      WHERE quiz_sessions.id = quiz_answers.session_id
        AND quiz_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "quiz_answers_delete_policy"
  ON public.quiz_answers
  FOR DELETE
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.quiz_sessions
      WHERE quiz_sessions.id = quiz_answers.session_id
        AND quiz_sessions.user_id = auth.uid()
    )
  );

-- Quiz Results (Access via parent quiz_session ownership)
CREATE POLICY "quiz_results_select_policy"
  ON public.quiz_results
  FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.quiz_sessions
      WHERE quiz_sessions.id = quiz_results.session_id
        AND quiz_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "quiz_results_insert_policy"
  ON public.quiz_results
  FOR INSERT
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.quiz_sessions
      WHERE quiz_sessions.id = quiz_results.session_id
        AND quiz_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "quiz_results_update_policy"
  ON public.quiz_results
  FOR UPDATE
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.quiz_sessions
      WHERE quiz_sessions.id = quiz_results.session_id
        AND quiz_sessions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.quiz_sessions
      WHERE quiz_sessions.id = quiz_results.session_id
        AND quiz_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "quiz_results_delete_policy"
  ON public.quiz_results
  FOR DELETE
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.quiz_sessions
      WHERE quiz_sessions.id = quiz_results.session_id
        AND quiz_sessions.user_id = auth.uid()
    )
  );

-- Saved Breeds (Users manage only their own bookmarks)
CREATE POLICY "saved_breeds_select_own"
  ON public.saved_breeds
  FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "saved_breeds_insert_own"
  ON public.saved_breeds
  FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "saved_breeds_delete_own"
  ON public.saved_breeds
  FOR DELETE
  USING (user_id = auth.uid() OR public.is_admin());

-- Advisor Conversations
CREATE POLICY "advisor_conv_select_own"
  ON public.advisor_conversations
  FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "advisor_conv_insert_own"
  ON public.advisor_conversations
  FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "advisor_conv_update_own"
  ON public.advisor_conversations
  FOR UPDATE
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "advisor_conv_delete_own"
  ON public.advisor_conversations
  FOR DELETE
  USING (user_id = auth.uid() OR public.is_admin());

-- Advisor Messages (Access via parent advisor_conversation ownership)
CREATE POLICY "advisor_msg_select_policy"
  ON public.advisor_messages
  FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.advisor_conversations
      WHERE advisor_conversations.id = advisor_messages.conversation_id
        AND advisor_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "advisor_msg_insert_policy"
  ON public.advisor_messages
  FOR INSERT
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.advisor_conversations
      WHERE advisor_conversations.id = advisor_messages.conversation_id
        AND advisor_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "advisor_msg_delete_policy"
  ON public.advisor_messages
  FOR DELETE
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.advisor_conversations
      WHERE advisor_conversations.id = advisor_messages.conversation_id
        AND advisor_conversations.user_id = auth.uid()
    )
  );

-- Usage Counters
CREATE POLICY "usage_counters_select_own"
  ON public.usage_counters
  FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "usage_counters_insert_own"
  ON public.usage_counters
  FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "usage_counters_update_own"
  ON public.usage_counters
  FOR UPDATE
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "usage_counters_delete_admin"
  ON public.usage_counters
  FOR DELETE
  USING (public.is_admin());

-- Trial Bookings
CREATE POLICY "trial_bookings_select_policy"
  ON public.trial_bookings
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.pets
      JOIN public.shelters ON pets.shelter_id = shelters.id
      WHERE pets.id = trial_bookings.pet_id
        AND shelters.owner_id = auth.uid()
    )
  );

CREATE POLICY "trial_bookings_insert_own"
  ON public.trial_bookings
  FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "trial_bookings_update_policy"
  ON public.trial_bookings
  FOR UPDATE
  USING (
    user_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.pets
      JOIN public.shelters ON pets.shelter_id = shelters.id
      WHERE pets.id = trial_bookings.pet_id
        AND shelters.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    user_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.pets
      JOIN public.shelters ON pets.shelter_id = shelters.id
      WHERE pets.id = trial_bookings.pet_id
        AND shelters.owner_id = auth.uid()
    )
  );

CREATE POLICY "trial_bookings_delete_admin"
  ON public.trial_bookings
  FOR DELETE
  USING (public.is_admin());

-- Trial Checkins (Access via parent trial_booking ownership)
CREATE POLICY "trial_checkins_select_policy"
  ON public.trial_checkins
  FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.trial_bookings
      WHERE trial_bookings.id = trial_checkins.booking_id
        AND (
          trial_bookings.user_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.pets
            JOIN public.shelters ON pets.shelter_id = shelters.id
            WHERE pets.id = trial_bookings.pet_id
              AND shelters.owner_id = auth.uid()
          )
        )
    )
  );

CREATE POLICY "trial_checkins_insert_policy"
  ON public.trial_checkins
  FOR INSERT
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.trial_bookings
      WHERE trial_bookings.id = trial_checkins.booking_id
        AND trial_bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "trial_checkins_update_policy"
  ON public.trial_checkins
  FOR UPDATE
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.trial_bookings
      WHERE trial_bookings.id = trial_checkins.booking_id
        AND trial_bookings.user_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.trial_bookings
      WHERE trial_bookings.id = trial_checkins.booking_id
        AND trial_bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "trial_checkins_delete_policy"
  ON public.trial_checkins
  FOR DELETE
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.trial_bookings
      WHERE trial_bookings.id = trial_checkins.booking_id
        AND trial_bookings.user_id = auth.uid()
    )
  );

-- Subscriptions
CREATE POLICY "subscriptions_select_own"
  ON public.subscriptions
  FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "subscriptions_insert_admin_or_server"
  ON public.subscriptions
  FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "subscriptions_update_admin_only"
  ON public.subscriptions
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "subscriptions_delete_admin_only"
  ON public.subscriptions
  FOR DELETE
  USING (public.is_admin());

-- Payments
CREATE POLICY "payments_select_own"
  ON public.payments
  FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "payments_insert_own_or_admin"
  ON public.payments
  FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "payments_update_admin_only"
  ON public.payments
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "payments_delete_admin_only"
  ON public.payments
  FOR DELETE
  USING (public.is_admin());

-- Leads (Service directory leads: providers/admins read; direct client inserts disabled - server API with service role handles insertion)
CREATE POLICY "leads_select_policy"
  ON public.leads
  FOR SELECT
  USING (
    public.is_admin()
    OR (user_id IS NOT NULL AND user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.service_providers
      WHERE service_providers.id = leads.provider_id
        AND service_providers.email = auth.jwt()->>'email'
    )
  );

-- Direct client inserts disabled to ensure validation, sanitization, and rate-limiting via server API
CREATE POLICY "leads_insert_server_only"
  ON public.leads
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "leads_update_admin_only"
  ON public.leads
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "leads_delete_admin_only"
  ON public.leads
  FOR DELETE
  USING (public.is_admin());

-- Partner Inquiries (B2B contacts: admin read only, direct client inserts disabled)
CREATE POLICY "partner_inquiries_select_admin"
  ON public.partner_inquiries
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "partner_inquiries_insert_server_only"
  ON public.partner_inquiries
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "partner_inquiries_update_admin"
  ON public.partner_inquiries
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "partner_inquiries_delete_admin"
  ON public.partner_inquiries
  FOR DELETE
  USING (public.is_admin());

-- Reminders (User-owned pet reminders)
CREATE POLICY "reminders_select_own"
  ON public.reminders
  FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "reminders_insert_own"
  ON public.reminders
  FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "reminders_update_own"
  ON public.reminders
  FOR UPDATE
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "reminders_delete_own"
  ON public.reminders
  FOR DELETE
  USING (user_id = auth.uid() OR public.is_admin());

-- Events (Telemetry: insert allowed ONLY through server API with service role; select admin only)
CREATE POLICY "events_select_admin"
  ON public.events
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "events_insert_server_only"
  ON public.events
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "events_delete_admin"
  ON public.events
  FOR DELETE
  USING (public.is_admin());


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
