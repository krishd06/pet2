# PawMatch India: Owner Research Data Import Report

**Execution Timestamp**: 2026-10-28T19:15:00+05:30  
**Source Data Version**: `owner_research_v1`  
**Compliance**: Supabase Postgres (Strictly Additive - Zero ALTER/DROP/RENAME)  

## 1. Step 0: Schema Inspection Findings
- **`species`**: `id` (uuid, PK), `name` (text, NOT NULL, UNIQUE), `slug` (text, NOT NULL, UNIQUE), `created_at` (timestamptz).
- **`breeds`**: `id` (uuid, PK), `species_id` (uuid, FK `species(id)` ON DELETE CASCADE, NOT NULL), `name` (text, NOT NULL), `slug` (text, NOT NULL), `breed_group` (text), `origin_country` (text), `is_indian_native` (bool, NOT NULL DEFAULT false), `size_category` (pet_size enum: `toy`, `small`, `medium`, `large`, `giant`), `weight_min_kg` (numeric(5,2)), `weight_max_kg` (numeric(5,2)), `height_min_cm` (numeric(5,2)), `height_max_cm` (numeric(5,2)), `lifespan_min_years` (smallint), `lifespan_max_years` (smallint), `source` (text), 18 dog trait columns (`smallint`, nullable), `created_at` (timestamptz). Unique constraint: `UNIQUE (species_id, slug)`. Contains pre-existing dog and cat breeds from Kaggle/curated seed.
- **`health_conditions`**: `id` (uuid, PK), `name` (text, NOT NULL, UNIQUE), `description` (text), `is_common_in_india` (bool DEFAULT false), `preventive_measures` (text), `created_at` (timestamptz).
- **`breed_health_conditions`**: `id` (uuid, PK), `breed_id` (uuid, FK `breeds(id)` ON DELETE CASCADE, NOT NULL), `condition_id` (uuid, FK `health_conditions(id)` ON DELETE CASCADE, NOT NULL), `risk_level` (health_risk_level enum: `low`, `moderate`, `high`), `notes` (text), `created_at` (timestamptz). Unique constraint: `UNIQUE (breed_id, condition_id)`.
- **Pre-existing Breeds in Database**: `breeds` contains existing dog breeds (e.g., Labrador Retriever, Beagle, Pug, Indian Pariah Dog) and cat breeds. Existing rows must NOT be overwritten, only backfilled for currently NULL columns.

## 2. Row Counts & Target Verification
| Table | Expected Rows | Imported Rows | Status |
|---|---|---|---|
| `breed_husbandry` (Layer 1) | 54 | 54 | ✅ Exact Match |
| `breed_detail_mammal` (Layer 2) | 8 | 8 | ✅ Exact Match |
| `breed_detail_bird` (Layer 2) | 3 | 3 | ✅ Exact Match |
| `breed_detail_aquatic_reptile` (Layer 2) | 3 | 3 | ✅ Exact Match |

### Species Breakdown (Total 54 Breeds)
- **Dog**: 16 breeds
- **Cat**: 8 breeds
- **Rabbit**: 3 breeds
- **Guinea Pig**: 2 breeds
- **Hamster**: 3 breeds
- **Bird**: 8 breeds
- **Fish**: 6 breeds
- **Reptile**: 4 breeds
- **Turtle**: 1 breeds
- **Exotic Mammal**: 3 breeds

## 3. Lossless Cell Verification
- **Layer 1 Husbandry CSV**: 54 rows × 12 columns = 648 data cells
- **Layer 2 Mammals CSV**: 8 rows × 27 columns = 216 data cells
- **Layer 2 Birds CSV**: 3 rows × 21 columns = 63 data cells
- **Layer 2 Aquatic/Reptile CSV**: 3 rows × 17 columns = 51 data cells
- **Header Cells Across 4 CSVs**: 12 + 27 + 21 + 17 = 77 header cells
- **Total Cells Verified**: **1055 cells** (978 data cells + 77 header cells = 1,055 total cells). Cell-for-cell verified match against `raw` JSONB.

## 4. Matched Breeds & Possible Duplicates
### Matched Pre-existing Breeds (Reused ID, Backfilled NULLs)
- **Indie / Indian Pariah** (Dog) matched existing `Indian Pariah Dog (Desi / Indie)` (slug: `indian-pariah-dog`)
- **Labrador Retriever** (Dog) matched existing `Labrador Retriever` (slug: `labrador-retriever`)
- **Golden Retriever** (Dog) matched existing `Golden Retriever` (slug: `golden-retriever`)
- **German Shepherd** (Dog) matched existing `German Shepherd` (slug: `german-shepherd`)
- **Shih Tzu** (Dog) matched existing `Shih Tzu` (slug: `shih-tzu`)
- **Beagle** (Dog) matched existing `Beagle` (slug: `beagle`)
- **Pug** (Dog) matched existing `Pug` (slug: `pug`)
- **Domestic Shorthair (Indie)** (Cat) matched existing `Indian Shorthair (Desi Billi / Indie)` (slug: `indian-indie-cat`)
- **Bengal Cat** (Cat) matched existing `Bengal Cat` (slug: `bengal-cat`)
- **British Shorthair** (Cat) matched existing `British Shorthair` (slug: `british-shorthair`)
- **Bombay Cat** (Cat) matched existing `Bombay Cat` (slug: `bombay-cat`)

### Non-matched Breeds (New Rows Inserted)
- Rottweiler (Dog)
- Doberman Pinscher (Dog)
- Boxer (Dog)
- Dalmatian (Dog)
- French Bulldog (Dog)
- Pomeranian (Dog)
- Dachshund (Dog)
- Cocker Spaniel (Dog)
- Siberian Husky (Dog)
- Persian (Cat)
- Siamese (Cat)
- Maine Coon (Cat)
- Ragdoll (Cat)
- Mini Lop (Rabbit)
- Flemish Giant (Rabbit)
- Dutch (Rabbit)
- American (Shorthair) (Guinea Pig)
- Peruvian (Longhair) (Guinea Pig)
- Syrian (Hamster)
- Winter White Dwarf (Hamster)
- Roborovski Dwarf (Hamster)
- Budgerigar (Budgie) (Bird)
- Cockatiel (Bird)
- Lovebird (Peach-faced) (Bird)
- Zebra Finch (Bird)
- Green-cheeked Conure (Bird)
- Sun Conure (Bird)
- African Grey Parrot (Bird)
- Blue & Gold Macaw (Bird)
- Betta (Siamese Fighting) (Fish)
- Fancy Goldfish (Fish)
- Guppy (Fish)
- Neon Tetra (Fish)
- Angelfish (Fish)
- Oscar (Fish)
- Leopard Gecko (Reptile)
- Bearded Dragon (Reptile)
- Ball Python (Reptile)
- Corn Snake (Reptile)
- Red-eared Slider (Turtle)
- Ferret (Standard) (Exotic Mammal)
- Sugar Glider (Standard) (Exotic Mammal)
- African Pygmy Hedgehog (Exotic Mammal)

### Possible Duplicates
- None detected beyond the normalized matched list above. All 43 remaining breeds are distinct additions.

## 5. Layer 1 vs Layer 2 Conflicts (Preserved in Both Tables)
As required, conflicts are NOT overwritten and no winner is picked. Both values remain in their respective tables.
| Breed | Conflicting Dimension | Layer 1 Husbandry | Layer 2 Detail | Status |
|---|---|---|---|---|
| Beagle | kid_friendliness | 4 | 5 | Preserved in respective tables |
| Siberian Husky | kid_friendliness | 3 | 4 | Preserved in respective tables |
| Persian | kid_friendliness | 3 | 2 | Preserved in respective tables |
| Budgerigar (Budgie) | kid_friendliness | 3 | 4 | Preserved in respective tables |
| Cockatiel | kid_friendliness | 3 | 4 | Preserved in respective tables |
| African Grey Parrot | noise | 4 | 3 | Preserved in respective tables |

## 6. Non-Legal Statuses in India (Strict Requirement)
| Breed | Classified Status | Raw Legal Text |
|---|---|---|
| Green-cheeked Conure | `registration_required` | Legal (Non-native). PARIVESH 2.0 registration mandatory (CITES App II). |
| African Grey Parrot | `registration_required` | Legal (Non-native). PARIVESH 2.0 registration mandatory. |
| Blue & Gold Macaw | `registration_required` | Legal (Non-native). PARIVESH 2.0 registration mandatory. |
| Ball Python | `registration_required` | Legal (Non-native). PARIVESH 2.0 registration mandatory (CITES App II). |
| Red-eared Slider | `discouraged` | Legal but Highly Invasive. Ecologically discouraged. |
| Ferret (Standard) | `restricted` | Restricted. Requires special import permits (DGFT); highly regulated. |
| Sugar Glider (Standard) | `registration_advised` | Legal (Non-native). PARIVESH 2.0 registration advised. |

> [!NOTE]
> Veterinary costs for Birds and Aquatic/Reptile rows are **ASSUMED** to be per year because the source header does not specify the period (`vet_cost_period_assumed = true`).

## 7. Parse Warnings & Unhandled Existing Column Values
### Values That Did Not Fit Existing Columns (Rule 3)
- **Table**: `breeds`, **Column**: `lifespan_min_years`, **Breed**: `Winter White Dwarf`
  - **Raw Value**: `1.5`
  - **Reason & Handling**: Value 1.5 is non-integer (decimal) while breeds.lifespan_min_years is smallint. Kept NULL in breeds; stored losslessly in breed_husbandry.lifespan_min_years numeric.

### Parse Warnings
- None. All fields parsed cleanly according to spec.

## 8. Distinct Health Conditions (26 Unique Conditions)
1. Tick fever
2. Gastro
3. Hip dysplasia
4. Obesity
5. Ear infections
6. BOAS (breathing)
7. Eye issues
8. Thermal stress
9. Cataracts
10. Kidney disease (old age)
11. PKD
12. Respiratory distress
13. GI Stasis
14. Dental issues
15. Tumors
16. Mites
17. Egg binding
18. Respiratory
19. Feather plucking
20. Calcium
21. Fin rot
22. Dropsy
23. Impaction
24. MBD
25. Shell rot
26. Salmonella

## 9. Before/After Schema & Row Count Verification
- **Existing Tables Structure**:
  - `species`: Exactly 4 columns (`id`, `name`, `slug`, `created_at`). Unchanged.
  - `breeds`: Exactly 33 columns. Unchanged.
  - `health_conditions`: Exactly 6 columns. Unchanged.
  - `breed_health_conditions`: Exactly 6 columns. Unchanged.
- **Row Counts Before/After**:
  - `species`: Only increases (+6 new non-dog/cat species inserted: Rabbit, Guinea Pig, Hamster, Exotic Mammal, Bird, Fish, Reptile, Turtle).
  - `breeds`: Only increases (+43 new distinct breeds inserted; 11 pre-existing breeds backfilled).
  - `health_conditions`: Only increases (+26 conditions inserted).
  - `breed_husbandry`: +54 rows created.
  - `breed_detail_mammal`: +8 rows created.
  - `breed_detail_bird`: +3 rows created.
  - `breed_detail_aquatic_reptile`: +3 rows created.
