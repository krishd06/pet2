# 🐾 PawMatch India — Pet Lifestyle Compatibility & Responsible Adoption Platform

> An intelligent, data-driven full-stack platform designed to eliminate pet abandonment in urban Indian households through lifestyle-compatibility matching, deal-breaker safety checks, transparent cost forecasting, and responsible native adoption.

---

## 📑 Table of Contents
1. [Project Overview & Core Mission](#-project-overview--core-mission)
2. [Tech Stack & Architecture Decisions ("Why?")](#-tech-stack--architecture-decisions-why)
3. [Database Architecture & Dual-DB Strategy](#-database-architecture--dual-db-strategy)
4. [Dataset & Urban Indian Context](#-dataset--urban-indian-context)
5. [The Algorithmic Compatibility Engine](#-the-algorithmic-compatibility-engine)
6. [AI Advisor Integration (Gemini 1.5 Flash + Fallback)](#-ai-advisor-integration)
7. [Frontend 3D Experience (Three.js & GSAP)](#-frontend-3d-experience)
8. [End-to-End System Integration Flow](#-end-to-end-system-integration-flow)
9. [Developer Handover & Setup Guide](#-developer-handover--setup-guide)
10. [Folder Structure & Key File Map](#-folder-structure--key-file-map)

---

## 🎯 Project Overview & Core Mission

### The Problem in Urban India
Over 60% of pet abandonments in metropolitan Indian cities (Delhi NCR, Mumbai, Bengaluru, Chennai, Pune) occur due to:
- **Lifestyle mismatches**: High-energy hunting or working breeds locked in small apartments without exercise.
- **Climate mismatches**: Heat-sensitive cold-climate breeds (Huskies, Saint Bernards) suffering in tropical 45°C summers.
- **Impulse buying**: Status-symbol pet purchases from illegal backyard breeders without understanding lifelong financial and time commitments.
- **Housing society restrictions**: Conflict with Resident Welfare Associations (RWAs) over noise, barking, or balcony safety.

### The PawMatch Solution
PawMatch India replaces impulse purchases with a scientific, ethical approach:
1. **Binary Deal-Breaker Screening**: Disqualifies dangerous mismatches before scoring.
2. **Multi-Dimensional Compatibility Scoring**: Evaluates 8 lifestyle dimensions with custom weights.
3. **Indigenous Native Breed Promotion**: Native Indian Indies (Desi dogs), Mudhol Hounds, Chippiparais, and Rajapalayams receive native bonuses due to superior climate immunity and apartment adaptability.
4. **Adopter Readiness & Remediation**: Grades the adopter's lifestyle readiness and outputs a practical preparation roadmap if gaps exist.
5. **Transparent INR Cost Projections**: Tailored to Indian city cost tiers (Tier 1 vs. Tier 2).
6. **Trial Foster & 30-Day Transition Support**: De-risks adoption through shelter trial periods and milestone checklists.

---

## 🛠 Tech Stack & Architecture Decisions ("Why?")

### 1. Frontend
| Technology | Version | Why Chosen? |
| :--- | :--- | :--- |
| **React** | `v18.3` | Industry standard component-driven UI with state hooks, fast virtual DOM, and rich ecosystem. |
| **Vite** | `v6.0` | Sub-second cold starts, instant Hot Module Replacement (HMR), and optimized ES module production bundling. |
| **Tailwind CSS** | `v3.4` | Rapid utility-first styling with custom palette tokens (`sand`, `earth`, `saffron`, `forest`) for a clean Indian earth-tone aesthetic. |
| **Three.js + React Three Fiber + Drei** | `v0.170 / v8 / v9` | Declarative 3D canvas rendering interactive animated GLTF models (Flamingo, Horse, Parrot, Stork) and procedural celestial creatures. |
| **GSAP + ScrollTrigger** | `v3.12` | Butter-smooth scroll choreography that synchronizes 3D creature movement, camera rotation, and story keyframes as the user scrolls. |
| **Framer Motion** | `v11.18` | Declarative micro-interactions, modal transitions, collapsible accordions, and fluid UI state changes. |
| **Recharts** | `v2.15` | Interactive radar charts and financial cost breakdown bar graphs. |
| **Lucide React** | `v0.473` | Lightweight, consistent, modern iconography. |
| **React Router DOM** | `v6.28` | Client-side routing with clean URLs and navigation history. |

### 2. Backend & API
| Technology | Version | Why Chosen? |
| :--- | :--- | :--- |
| **Node.js + Express** | `v24+ / v4.21` | Native ES modules (`import/export`), asynchronous event-driven I/O, lightweight and fast REST endpoints. |
| **Zod** | `v3.24` | Strict schema validation for questionnaire submissions, ensuring data integrity before processing. |
| **JWT (`jsonwebtoken`) + `bcryptjs`** | `v9.0 / v2.4` | Secure, stateless authentication supporting both registered users and anonymous guest session tokens. |
| **Helmet & Express Rate Limit** | `v8.0 / v7.5` | Security headers (CSP, frameguard) and protection against rate abuse and brute force. |
| **Concurrently** | `v9.1` | Allows running both the frontend dev server (`:5173`) and backend API (`:5000`) concurrently with a single `npm run dev` command. |

### 3. Artificial Intelligence
| Technology | Implementation | Why Chosen? |
| :--- | :--- | :--- |
| **Google Gemini API** | `@google/generative-ai` (`gemini-1.5-flash`) | Fast, cost-effective multimodal LLM with customized system instructions for Indian pet parenting advice. |
| **Offline FAQ Engine** | Keyword-matching fallback | Guarantees that users receive relevant advice even when offline, unauthenticated, or if API quotas are exhausted. |

---

## 🗄 Database Architecture & Dual-DB Strategy

The platform implements a **Dual-Database Architecture** combining the strengths of relational and document databases, plus an in-memory development store:

```
                      ┌────────────────────────────────────────┐
                      │             PawMatch API               │
                      └───────────────────┬────────────────────┘
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            │                             │                             │
            ▼                             ▼                             ▼
   ┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐
   │ PostgreSQL/Neon │           │  MongoDB Atlas  │           │   In-Memory     │
   │  (Relational)   │           │   (Document)    │           │ Dev Store (Mock)│
   └────────┬────────┘           └────────┬────────┘           └────────┬────────┘
            │                             │                             │
   • Users & Auth                • Pet Detailed Guides         • Zero-config fallback
   • Pets & Breeds               • Dynamic Questionnaires      • Seeds 22 pets,
   • Cities & Multipliers        • Explanation Templates         8 cities, 6 shelters,
   • Shelters & Animals          • Remediation Guides            30 animals, 10 vets
   • Vets Directory              • 30-Day Onboarding Plan      • Instant local setup
   • Assessments History         • Advisor Chat Histories
   • Foster Trial Requests       • Searchable FAQ Items
```

### Why PostgreSQL (Neon Tech)?
- **Structured tabular data**: Pets, breeds, scoring criteria, city tier data, and shelter listings require rigid relations, indexes, and fast relational joins.
- **ACID Transactions**: Guarantees consistency when users submit assessments, reserve foster trials, or update profiles.

### Why MongoDB Atlas (Mongoose)?
- **Unstructured / Polymorphic Content**: Detailed breed training tips, seasonal health warnings, and 30-day onboarding guides have varying structures.
- **Dynamic Questionnaires**: Adding or editing quiz questions does not require modifying relational SQL database schemas.
- **Conversation State**: Storing multi-turn chat message histories between users and the AI Advisor.

### The Zero-Config In-Memory Fallback
- Both `server/src/db/index.js` (SQL) and `server/src/db/mongo.js` (MongoDB) contain custom in-memory mock engines.
- **Why this matters**: Any new developer can clone the repo and immediately run `npm run dev`. The server automatically seeds 22 pets, 8 cities, 6 shelters, 30 animals, and 10 vets in memory without needing credentials!
- Once `DATABASE_URL` or `MONGODB_URI` are provided in `.env`, the system automatically switches to the live cloud databases.

---

## 📊 Dataset & Urban Indian Context

### 1. Curated Pet Breeds (22 Profiles)
- **Indian Native Breeds**:
  - *Indian Pariah Dog (Indie / Desi)*: Natural immunity, short self-cleaning coat, high heat tolerance, low genetic disease risk, loyal and gentle apartment dog.
  - *Mudhol Hound & Chippiparai*: Indigenous Indian sighthounds, sleek short coats, highly adaptable to warm climates.
  - *Rajapalayam & Kombai*: Historical Indian royal guard breeds, loyal, sturdy, low grooming requirements.
  - *Indian Domestic Shorthair (Billi)*: Resilient, independent, low-maintenance urban cat.
- **Foreign / Adapted Breeds**:
  - Labrador Retriever, Golden Retriever, Beagle, Pug, Shih Tzu, Persian Cat, Siamese Cat, Indian Ringneck Parakeet, Cockatiel, etc.
- **Explicit Exclusions / Warnings**:
  - Siberian Husky, Alaskan Malamute, Saint Bernard are flagged for severe climate incompatibility in hot/humid Indian plains.

### 2. Indian Climate Zones & City Multipliers
The platform categorizes Indian geography into distinct climate zones:
- **Hot & Humid**: Mumbai, Chennai, Kolkata (High risk for heavy double-coated dogs; requires constant AC/cooling).
- **Hot & Semi-Arid**: Delhi NCR, Jaipur, Ahmedabad (Extreme summer peaks of 45°C+; requires early morning walks).
- **Moderate / Plateau**: Bengaluru, Pune, Hyderabad (More forgiving year-round climate).

**Cost Tiers**:
- **Tier 1 Cities (Mumbai, Delhi, Bengaluru)**: Higher veterinary rates, premium pet food, grooming service costs (Cost Multiplier: 1.2x – 1.35x).
- **Tier 2/3 Cities**: Moderate expenses (Cost Multiplier: 1.0x).

---

## ⚙ The Algorithmic Compatibility Engine

Located in `server/src/engine/`, the engine operates as a pipeline of pure, deterministic functions:

```
User Questionnaire Input
         │
         ▼
[ Step 1: Readiness Score ] ──► Computes Knowledge, Financial, Time, Environment scores
         │
         ▼
[ Step 2: Remediation Plan ] ──► Generates action items for any category scoring < 70
         │
         ▼
[ Step 3: Deal-Breaker Filter ] ──► Binary pass/fail (e.g. Studio + Husky = FAIL)
         │                         Outputs "Why Not Shown" exclusion reasons
         ▼
[ Step 4: Multi-Dimensional Scoring ] ──► Evaluates 8 dimensions (0 - 100)
         │                               Applies Native Breed Bonus (+10%)
         ▼
[ Step 5: Natural Language Explanations ] ──► Synthesizes strengths & friction points
         │
         ▼
[ Step 6: 3-Tier Categorization ]
         ├── Tier 1: Highly Compatible (Score ≥ 80)
         ├── Tier 2: Consider Carefully (Score 60 - 79)
         └── Tier 3: Low Match (Score < 60)
         │
         ▼
[ Step 7: Cost Forecasting ] ──► Upfront Year 1 + Monthly recurring INR budget
```

### The 8 Evaluated Dimensions
1. **Space & Housing Compatibility**: Matches home size (studio, 1BHK, 2BHK+, villa) and outdoor yard access to pet size and territory needs.
2. **Time & Exercise Balance**: Compares owner availability and daily walking hours against breed exercise and mental stimulation demands.
3. **Budget Feasibility**: Compares user monthly budget with projected food, medical, and maintenance costs in their city.
4. **Experience & Trainability**: Flags high-stubbornness or working breeds if the user is a first-time pet parent.
5. **Climate & Heat Tolerance**: Assesses pet coat and anatomy against the user's city temperature and humidity.
6. **Noise & Society Rules**: Evaluates vocalization tendencies against apartment and RWA pet guidelines.
7. **Family & Child Safety**: Validates breed temperament around toddlers, young children, or seniors.
8. **Grooming & Shedding Tolerance**: Compares user grooming capacity and allergy sensitivity to pet coat type.

---

## 🤖 AI Advisor Integration

- **Entrypoint**: Floating widget on every page or full page at `/advisor`.
- **Engine**: Google Gemini 1.5 Flash via `@google/generative-ai`.
- **System Prompt Guardrails**:
  - **Ethical Focus**: Actively advocates for Indian Indie adoption and discourages puppy mills.
  - **Veterinary Safety Boundary**: Strictly forbidden from diagnosing medical conditions or prescribing drug dosages. Whenever illness, toxicity, or trauma is detected, it firmly instructs the user to visit a 24x7 veterinary clinic.
  - **Urban Realities**: Contextualized advice for Indian apartments (balcony pigeon nets, monsoon tick fever, heat stroke prevention).
- **Graceful Degradation**:
  - If no `GEMINI_API_KEY` is present or if the API encounters rate limits, the query automatically passes through the internal MongoDB `FaqItems` keyword-matching engine without breaking the UI.

---

## 🎨 Frontend 3D Experience

- **Component**: `client/src/components/three/AntigravityScene.jsx`
- **Features**:
  - **Photorealistic GLTF Models**: Supports live switching between real animated models (Flamingo, Horse, Parrot, Stork) and the procedural Celestial Guardian.
  - **Cinematic Studio Lighting**: 3-point lighting setup with warm key light, cool fill light, and sweeping golden rim light.
  - **Weightless Zero-G Simulation**: Gentle organic floating with harmonic breathing oscillations.
  - **Triple Particle Atmosphere**: Drei sparkles + floating golden dust motes + drifting instanced petals.
  - **Scroll Choreography**: Driven by GSAP ScrollTrigger to move the creature through 5 story phases across homepage sections:
    - *0.00 (Hero)*: Floats on the right, welcoming the user.
    - *0.25 (Features)*: Glides left, presenting an elegant profile.
    - *0.50 (Spotlight)*: Moves closer with a dramatic perspective angle.
    - *0.75 (Guides)*: Banking dynamic turn.
    - *1.00 (CTA)*: Ascends center-stage with an illuminated aura.

---

## 🔗 End-to-End System Integration Flow

1. **User visits homepage (`/`)**:
   - Sees the 3D antigravity creature, reads platform statistics, and clicks **"Take Compatibility Quiz"**.
2. **Questionnaire Submission (`/quiz`)**:
   - Answers questions on apartment type, city, budget, exercise hours, children, and pet preferences.
   - Posts payload to `POST /api/assessment/evaluate`.
   - Engine executes deal-breaker exclusions, calculates scores, generates explanations, and stores results in the database.
   - Frontend redirects to `/results/:id`.
3. **Results Dashboard (`/results/:id`)**:
   - Displays Adopter Readiness Gauge and Remediation Roadmap.
   - Renders Tier 1, Tier 2, and Tier 3 matched breeds with radar charts and cost breakdowns.
   - Displays the **"Why Not Shown"** drawer explaining exactly why certain breeds were excluded.
4. **Connecting with Local Shelters (`/adopt` & `/foster`)**:
   - User browses real adoptable animals across Indian shelters (Friendicoes, YODA, CUPA).
   - User can submit a **Trial Foster Application** to spend 7 to 14 days with an animal before finalized adoption.
5. **Post-Adoption Support (`/first-30-days`)**:
   - Interactive milestone checklist guiding the adopter through Day 1 decompression, Week 1 routine, Week 2 socialization, and Week 4 veterinary checks.
6. **24/7 AI Assistance (`/advisor`)**:
   - User queries the floating AI widget for advice on diet, vaccination schedules, training, or RWA rules.

---

## 🚀 Developer Handover & Setup Guide

### Prerequisites
- **Node.js**: `v18+` or `v20+` (Tested on `v24`)
- **npm**: `v9+` or `v10+` (Tested on `v11`)
- **Git**

### Step-by-Step Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/krishd06/pet.git
   cd pet
   ```

2. **Install Dependencies**:
   ```bash
   # Install root concurrently tool
   npm install

   # Install client dependencies
   npm install --prefix client

   # Install server dependencies
   npm install --prefix server
   ```

3. **Configure Environment Variables (Optional)**:
   - Copy `.env.example` to `.env` in the `server` directory:
     ```bash
     cp server/.env.example server/.env
     ```
   - *Note: The app will run 100% fine in in-memory mode without any credentials.*
   - If you have credentials, add:
     - `PORT=5000`
     - `DATABASE_URL=postgresql://...` (Neon Postgres)
     - `MONGODB_URI=mongodb+srv://...` (MongoDB Atlas)
     - `GEMINI_API_KEY=...` (Google AI Studio Key)
     - `JWT_SECRET=...`

4. **Run the Complete Application**:
   ```bash
   npm run dev
   ```
   - **Frontend UI**: [http://localhost:5173/](http://localhost:5173/)
   - **Backend API**: [http://localhost:5000/](http://localhost:5000/)
   - **API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Running Components Individually
- **Client only**: `npm run dev:client`
- **Server only**: `npm run dev:server`
- **Run automated engine tests**: `npm test --prefix server`
- **Build frontend for production**: `npm run build`

---

## 📁 Folder Structure & Key File Map

```
pet/
├── .gitignore                   # Excludes node_modules, build outputs, .env
├── package.json                 # Root script runner (concurrently)
├── README.md                    # System architecture & handover guide
│
├── client/                      # Vite + React Frontend
│   ├── index.html               # Web application entry
│   ├── vite.config.js           # Vite config with API proxy to :5000
│   ├── tailwind.config.js       # Custom design system tokens & colors
│   └── src/
│       ├── main.jsx             # React DOM root
│       ├── App.jsx              # Main router & layout shell
│       ├── components/
│       │   ├── Header.jsx       # Navigation bar & auth controls
│       │   ├── Footer.jsx       # Indian helpline links & info
│       │   ├── AdvisorWidget.jsx # Floating AI chatbot drawer
│       │   └── three/
│       │       └── AntigravityScene.jsx # Three.js + GSAP 3D scene
│       ├── context/
│       │   └── AuthContext.jsx  # JWT & guest session management
│       ├── lib/
│       │   └── api.js           # Centralized Axios/fetch API client
│       └── pages/
│           ├── HomePage.jsx     # Hero, 3D section, mission stats
│           ├── QuestionnairePage.jsx # Multi-step assessment quiz
│           ├── ResultsPage.jsx  # Matched breeds, radar charts, costs
│           ├── ExplorePetsPage.jsx   # Breed encyclopedia & filters
│           ├── AdoptableAnimalsPage.jsx # Indian shelter rescue animals
│           ├── TrialFosterPage.jsx   # 7-14 day foster trial program
│           ├── First30DaysPage.jsx   # Milestone transition checklist
│           └── AdvisorPage.jsx  # Dedicated full-page AI chat
│
└── server/                      # Express.js REST API Backend
    ├── vercel.json              # Vercel serverless deployment config
    ├── api/
    │   └── index.js             # Express server entry point & middleware
    ├── db/
    │   └── migrations/          # PostgreSQL table DDL schemas
    └── src/
        ├── controllers/         # Express endpoint handlers
        ├── db/
        │   ├── index.js         # PostgreSQL connection + InMemoryDB fallback
        │   ├── mongo.js         # MongoDB Mongoose + InMemoryCollection fallback
        │   └── migrate.js       # SQL migration runner
        ├── engine/              # Core Compatibility & Readiness Engine
        │   ├── dealBreakers.js  # Binary exclusion rules
        │   ├── scoring.js       # 8-dimension weighted matcher & native bonus
        │   ├── readiness.js     # Adopter lifestyle readiness scorer
        │   ├── remediation.js   # Preparation roadmap generator
        │   ├── explanations.js  # Natural language insight synthesizer
        │   ├── costs.js         # Indian city-tier financial forecaster
        │   └── index.js         # Pipeline orchestrator
        ├── middleware/
        │   └── auth.js          # JWT & guest authentication extractor
        ├── models/              # Mongoose schema definitions
        ├── routes/              # Express API route declarations
        ├── seed/
        │   ├── seedData.js      # 22 pets, 8 cities, shelters, questions data
        │   └── seed.js          # Seeding execution script
        └── services/
            └── advisorService.js # Gemini API & keyword fallback engine
```

---

*Authored for the PawMatch India project handover.*