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
