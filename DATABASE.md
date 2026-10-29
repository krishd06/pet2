# PawMatch India — Supabase Database Architecture & Runbook

PawMatch India uses **Supabase (PostgreSQL)** as its primary relational and flexible JSONB data layer. This architecture provides robust relational integrity, native Row Level Security (RLS), and zero-exposure client authentication via Supabase Auth.

---

## 1. Database Architecture Overview

```
                                    +-----------------------+
                                    |   auth.users (Auth)   |
                                    +-----------+-----------+
                                                | 1:1
                                                v
+-------------------------+         +-----------+-----------+
|    Static Reference     |         |   public.profiles     |
|         Tables          |         +-----------+-----------+
+-------------------------+                     |
| - species               |                     | 1:N
| - breeds                |         +-----------v-----------+
| - health_conditions     |         |  shelters / inquiries |
| - breed_health_conds    |         |  trial_bookings       |
| - cities                |         |  subscriptions        |
| - cost_benchmarks       |         |  reminders / saves    |
| - vaccination_schedules |         +-----------------------+
| - first_30_days_tasks   |                     |
| - quiz_questions/opts   |         +-----------v-----------+
| - partners / providers  |         | quiz_sessions/results |
| - shelter_outcome_stats |         | events (Telemetry)    |
+-------------------------+         +-----------------------+
```

---

## 2. Table Specifications & Relationships

### Group 1: Static Reference Tables (Public SELECT; Write by Admin Only)

| Table | Purpose | Key Columns / Constraints |
|---|---|---|
| `species` | Animal taxonomies (Dog, Cat). | `id` (uuid PK), `name` (unique), `slug` (unique) |
| `breeds` | Breed benchmarks, 16 trait scores (1-5), size, weight, lifespan, and Indian native flag. | `id` (uuid PK), `species_id` (FK), `slug` (unique), 16 trait columns smallint (1-5), `coat_type`, `coat_length` |
| `health_conditions` | Known hereditary health vulnerabilities and climate risks. | `id` (uuid PK), `name` (unique), `description`, `severity` |
| `breed_health_conditions` | Many-to-many junction between breeds and predisposed health risks. | `PRIMARY KEY (breed_id, condition_id)` with CASCADE delete |
| `cities` | Indian urban hubs with city tier (1-3) and pet friendliness ratings. | `id` (uuid PK), `name` (unique), `state`, `tier` (1-3), `pet_friendly_score` |
| `cost_benchmarks` | Monthly recurring and upfront setup costs across species, sizes, and city tiers. | `id` (uuid PK), `species_id` (FK), `size_category`, `city_tier`, `category` (enum) |
| `vaccination_schedules` | Veterinary immunization timelines for dogs and cats in India. | `id` (uuid PK), `species_id` (FK), `vaccine_name`, `first_dose_age_weeks`, `is_core` |
| `first_30_days_tasks` | Phased roadmap tasks for adopters based on the 3-3-3 decompression rule. | `id` (uuid PK), `species_id` (FK), `day_from`, `day_to`, `title`, `category` |
| `quiz_questions` | Lifestyle & compatibility assessment questions. | `id` (uuid PK), `sort_order`, `text`, `type` (single/multi/scale), `category` |
| `quiz_options` | Assessment options with JSONB trait weights and exclusion filters. | `id` (uuid PK), `question_id` (FK), `label`, `value`, `trait_weights` (jsonb), `filters` (jsonb) |
| `partners` | Verified pet brand affiliates, food delivery, and insurance partners. | `id` (uuid PK), `name`, `category`, `url`, `commission_note`, `city_id` (nullable FK) |
| `service_providers` | Verified local veterinarians, trainers, groomers, and pet sitters. | `id` (uuid PK), `name`, `category` (enum), `city_id` (FK), `phone`, `is_verified` |
| `shelter_outcome_stats` | Adoption stay durations and velocity statistics by age group and size. | `id` (uuid PK), `species`, `age_group`, `size_category`, `avg_days_in_shelter`, `sample_size` |

### Group 2: Dynamic Tables (RLS-Secured: User Ownership & Admin Access)

| Table | Purpose | Security & Ownership Rule |
|---|---|---|
| `profiles` | Mirrors Supabase `auth.users` with `full_name`, `role` (`adopter`, `shelter`, `admin`), `city`, `phone`. | Created automatically via Postgres trigger on `auth.users`. Users select/update own row; admins select all. |
| `shelters` | Verified rescue shelters and foster organizations. | Public read; insert/update/delete restricted to `owner_id = auth.uid()` or admin. |
| `pets` | Adoptable rescue animals listed by registered shelters. | Available pets readable by public; all writes restricted to the shelter's owner (`shelters.owner_id = auth.uid()`) or admin. |
| `inquiries` | Adoption applications and inquiries sent to shelters. | Adopter reads/edits own inquiry; shelter owner reads inquiries for their listed pets; admin reads all. |
| `quiz_sessions` | Assessment sessions for registered users and anonymous visitors. | Authenticated users access only their own sessions (`user_id = auth.uid()`). Anonymous visitors access only through server API via Service Role. |
| `quiz_answers` | Step-by-step user answers in a quiz session. | Access derived from parent `quiz_sessions` ownership. |
| `quiz_results` | Compatibility scores, top breed rankings, and monthly cost forecast JSONB. | Access derived from parent `quiz_sessions` ownership. |
| `saved_breeds` | Adopter bookmarked breeds. | `PRIMARY KEY (user_id, breed_id)`. Users select/insert/delete only their own bookmarks. |
| `advisor_conversations` | AI Pet Lifestyle Advisor chat sessions. | User-owned (`user_id = auth.uid()`). |
| `advisor_messages` | Exchanged chat messages in an AI consultation. | Access derived from parent `advisor_conversations` ownership. |
| `usage_counters` | Daily message counters enforcing rate limits. | `PRIMARY KEY (user_id, usage_date)`. |
| `trial_bookings` | 7-to-14 day Foster-to-Adopt home trial bookings. | User-owned with shelter visibility for booked pets. |
| `trial_checkins` | Daily mood and behavioral check-ins during trials. | Access derived from parent `trial_bookings` ownership. |
| `subscriptions` | Adopter premium membership tiers and validity. | Users read own subscription; updates managed by admin/server webhook. |
| `payments` | Transaction records for trials, subscriptions, and featured listings. | Users read own payments; writes verified by server. |
| `leads` | Quotes and contact requests for local service providers. | Providers and admins read; direct client inserts disabled (routed via server API with Service Role). |
| `partner_inquiries` | B2B brand and housing society inquiries. | Admin read only; direct client inserts disabled. |
| `reminders` | Preventive care, deworming, and vaccination alerts. | Users select/insert/update/delete own reminders. |
| `events` | Privacy-preserving telemetry and analytics (no PII). | Insert allowed strictly through server API; read restricted to admin. |

---

## 3. Row Level Security (RLS) Policy Design

Every table has RLS explicitly enabled:
- **Public Reference Tables:** `SELECT USING (true)` allows public read access for browsers and unauthenticated guests. `INSERT/UPDATE/DELETE` requires `is_admin() = true`.
- **User Ownership Isolation:** All user tables check `auth.uid() = user_id` or join through parent ownership (e.g. `advisor_messages` joins `advisor_conversations`).
- **Shelter Pet Management:** `pets` write operations verify that the executing user owns the shelter (`EXISTS (SELECT 1 FROM shelters WHERE shelters.id = pets.shelter_id AND shelters.owner_id = auth.uid())`).
- **Anonymous Sessions Protection:** Direct client access to anonymous quiz records is denied. Anonymous quiz creation is executed securely through the backend Express API using `SUPABASE_SERVICE_ROLE_KEY`.

---

## 4. How to Apply Migrations

Since no local Supabase CLI is connected, the SQL migrations are 100% paste-ready for the **Supabase Dashboard SQL Editor**:

1. Open your project on [database.new](https://database.new) or [supabase.com/dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** in the left sidebar.
3. Open `supabase/migrations/0001_schema.sql`, copy all contents, paste into the editor, and click **Run**.
4. Open `supabase/migrations/0002_rls.sql`, copy all contents, paste into the editor, and click **Run**.

---

## 5. How to Run Seeds

### A. Automatic Seed via CLI
Ensure `server/.env` contains your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, then run from the project root:
```bash
npm run seed:supabase
```
Or from the `server` folder:
```bash
npm run seed:supabase
```

### B. Admin API Seed Trigger
Admins can also trigger seeding programmatically or via cURL:
```bash
curl -X POST http://localhost:5000/api/admin/seed-supabase \
  -H "Authorization: Bearer <ADMIN_JWT>"
```

### C. Kaggle Dog Breeds CSV Import
1. Create a `data/` folder at the root of the project: `c:\Users\Krish\Desktop\pet - Copy\data\`.
2. Place the Kaggle "Dog Breeds" dataset files into it:
   - `breed_traits.csv` (Required)
   - `dog_breeds.csv` (Optional metadata: height, weight, lifespan, description)
3. Re-run `npm run seed:supabase`.
4. If no CSVs are present, the importer prints an informational message and automatically uses the 15 hand-curated Indian breeds and 6 cat types.

---

## 6. Environment Variables Reference

### Server (`server/.env`)
```ini
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi... (KEEP SECRET - Server Only)

# Server Config
PORT=5000
NODE_ENV=development
JWT_SECRET=pawmatch_super_secret_jwt_key_2026_dev_secure
CLIENT_ORIGIN=http://localhost:5173
```

### Client (`client/.env`)
```ini
# Supabase Client (Browser Safe - No service role key!)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...

# Backend API
VITE_API_URL=http://localhost:5000
```

---

## 9. Owner Research Tables & Companion Animal Extension (Migration 0003)

Migration `supabase/migrations/0003_owner_research.sql` introduces 4 additive tables, indexes, RLS policies, and a unified view to store owner research data across 54 companion animal breeds in urban India.

### 9.1 New Tables Overview
1. **`breed_husbandry`** (Layer 1 - 54 breeds):
   - **Key**: `breed_id uuid PRIMARY KEY REFERENCES public.breeds(id) ON DELETE CASCADE`
   - **Lossless Raw Data**: `raw jsonb NOT NULL` (original CSV row preserved untouched as `{original column name: original string}`)
   - **Attributes**: Lifespan (`lifespan_text`, `lifespan_min_years numeric`, `lifespan_max_years numeric`, `lifespan_open_ended bool`), daily time commitment (`daily_time_text`, `daily_time_min_hours numeric`, `daily_time_max_hours numeric`, `daily_time_open_ended bool`), min space (`min_space_text`, `space_class`, `min_space_gallons`, `min_space_sq_ft`, `min_space_sq_in`, `vertical_space_needed bool`, `ac_requirement`), scores 1-5 (`noise_level`, `apt_suitability`, `kid_friendly`), monthly costs (`monthly_cost_min_inr`, `monthly_cost_max_inr`), left alone hours (`left_alone_min_hours`, `left_alone_max_hours`, `left_alone_open_ended`, `left_alone_note`), and Indian regulatory status (`exotic_vet_needed`, `legal_status`, `requires_parivesh`, `cites_appendix_ii`, `requires_import_permit`).
   - **Constraints**: Scores `CHECK (col BETWEEN 1 AND 5)`, min/max pairs `CHECK (min <= max)`.
2. **`breed_detail_mammal`** (Layer 2 - 8 mammal breeds):
   - Morphological dimensions (weights, heights), 1-5 behavioural traits, exercise duration, shedding, grooming, Indian climate tolerances, separation anxiety, and financial metrics (yearly vet cost, purchase/adoption pricing).
3. **`breed_detail_bird`** (Layer 2 - 3 bird breeds):
   - Avian cage dimensions (inches), mess levels, talking abilities, intelligence, and veterinary costs (`vet_cost_period_assumed = true`).
4. **`breed_detail_aquatic_reptile`** (Layer 2 - 3 aquatic/reptile breeds):
   - Enclosure volume minimums (gallons), filtration/water setup descriptions, care difficulty, and specialized herpetological parameters.

### 9.2 Unified View (`v_breeds_full`)
A single additive view joining:
- `breeds` + `species`
- `breed_husbandry` (prefixed `h_`)
- `breed_detail_mammal`, `breed_detail_bird`, `breed_detail_aquatic_reptile` (prefixed `d_`)
Allows public SELECT access for fast frontend compatibility and search queries without altering existing tables.

### 9.3 Data Import & Execution
1. **Apply Additive Schema**: Paste and run `supabase/migrations/0003_owner_research.sql` in the Supabase SQL Editor.
2. **Run Import Script**:
   ```bash
   npm run import:owner-data
   ```
   Or execute `supabase/seed/import_owner_data.sql` directly inside the Supabase SQL Editor as a single, idempotent transaction (`BEGIN; ... COMMIT;`).
3. **Run Parser Tests**:
   ```bash
   npm run test:parser
   ```

