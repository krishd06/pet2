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
