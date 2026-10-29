-- PawMatch India: PostgreSQL Migration 002
-- Extensions for Accounts & Roles, Partners, Shelters & Plans, Trial Bookings, Payments, Subscriptions, Services, Leads, and B2B Inquiries

-- Ensure shelters has user_id, plan_id, and featured flag
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS user_id VARCHAR(64);
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE shelters ADD COLUMN IF NOT EXISTS plan_name VARCHAR(64) DEFAULT 'Free';

-- Ensure animals has views_count and is_featured
ALTER TABLE animals ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE animals ADD COLUMN IF NOT EXISTS views_count INT DEFAULT 0;

-- 1. Partners Table (Affiliate / Sponsored Partners)
CREATE TABLE IF NOT EXISTS partners (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL, -- food, vaccines, grooming, insurance, crates, training, vet
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  commission_note TEXT,
  city VARCHAR(128), -- nullable (national if null)
  active BOOLEAN DEFAULT TRUE,
  badge_label VARCHAR(64) DEFAULT 'Partner',
  target_tags TEXT, -- JSON or comma-separated tags (e.g. "dog,cat,first_time,budget,large")
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Shelter Plans Table
CREATE TABLE IF NOT EXISTS shelter_plans (
  id VARCHAR(64) PRIMARY KEY,
  shelter_id VARCHAR(64) REFERENCES shelters(id) ON DELETE CASCADE,
  plan_type VARCHAR(64) NOT NULL DEFAULT 'free', -- 'free' or 'featured'
  status VARCHAR(32) NOT NULL DEFAULT 'active', -- 'active', 'expired', 'cancelled'
  amount_inr INT NOT NULL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Shelter Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id VARCHAR(64) PRIMARY KEY,
  shelter_id VARCHAR(64) REFERENCES shelters(id) ON DELETE CASCADE,
  animal_id VARCHAR(64) REFERENCES animals(id) ON DELETE SET NULL,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  adopter_name VARCHAR(255) NOT NULL,
  adopter_email VARCHAR(255) NOT NULL,
  adopter_phone VARCHAR(64) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(32) DEFAULT 'pending', -- 'pending', 'contacted', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Trial Foster Bookings Table
CREATE TABLE IF NOT EXISTS trial_bookings (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  animal_id VARCHAR(64) REFERENCES animals(id) ON DELETE SET NULL,
  pet_name VARCHAR(255) NOT NULL,
  species VARCHAR(64) NOT NULL,
  duration_days INT NOT NULL, -- 7, 14, 30
  fee_inr INT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active', -- 'active', 'completed', 'adopted', 'returned', 'cancelled'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  check_in_notes JSONB DEFAULT '[]'::jsonb, -- Array of notes with day & text
  final_outcome VARCHAR(32), -- 'adopt', 'return', 'undecided'
  final_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Payments Table (Razorpay test or mock transactions)
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  order_id VARCHAR(128) NOT NULL,
  payment_id VARCHAR(128),
  amount_inr INT NOT NULL,
  currency VARCHAR(8) DEFAULT 'INR',
  purpose VARCHAR(64) NOT NULL, -- 'trial_foster', 'shelter_featured', 'premium_subscription'
  reference_id VARCHAR(64), -- booking_id, plan_id, or sub_id
  mode VARCHAR(32) NOT NULL DEFAULT 'mock', -- 'mock' or 'razorpay_test'
  status VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'captured', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. User Subscriptions Table (Premium Tiers)
CREATE TABLE IF NOT EXISTS subscriptions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  plan_tier VARCHAR(32) NOT NULL DEFAULT 'free', -- 'free' or 'premium'
  billing_cycle VARCHAR(32) DEFAULT 'monthly', -- 'monthly' or 'yearly'
  status VARCHAR(32) NOT NULL DEFAULT 'active', -- 'active', 'expired', 'cancelled'
  start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Service Providers Table (Services Directory)
CREATE TABLE IF NOT EXISTS service_providers (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL, -- 'vet', 'trainer', 'groomer', 'sitter'
  city VARCHAR(128) NOT NULL,
  area VARCHAR(128) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  email VARCHAR(255),
  rating NUMERIC(3, 1) DEFAULT 4.8,
  reviews_count INT DEFAULT 24,
  price_range VARCHAR(32) DEFAULT '₹₹',
  experience_years INT DEFAULT 5,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Provider Leads Table (Request a quote)
CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(64) PRIMARY KEY,
  provider_id VARCHAR(64) REFERENCES service_providers(id) ON DELETE CASCADE,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_contact VARCHAR(255) NOT NULL,
  pet_details VARCHAR(255),
  message TEXT NOT NULL,
  consent BOOLEAN DEFAULT TRUE,
  status VARCHAR(32) DEFAULT 'new', -- 'new', 'contacted', 'closed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. B2B Partner Inquiries Table (For Partners page)
CREATE TABLE IF NOT EXISTS partner_inquiries (
  id VARCHAR(64) PRIMARY KEY,
  organization_name VARCHAR(255) NOT NULL,
  organization_type VARCHAR(64) NOT NULL, -- 'society', 'corporate', 'brand', 'ngo', 'other'
  contact_person VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  city VARCHAR(128) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(32) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for extensions
CREATE INDEX IF NOT EXISTS idx_partners_category ON partners(category);
CREATE INDEX IF NOT EXISTS idx_partners_active ON partners(active);
CREATE INDEX IF NOT EXISTS idx_trial_bookings_user_id ON trial_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_service_providers_category ON service_providers(category);
CREATE INDEX IF NOT EXISTS idx_service_providers_city ON service_providers(city);
CREATE INDEX IF NOT EXISTS idx_leads_provider_id ON leads(provider_id);
