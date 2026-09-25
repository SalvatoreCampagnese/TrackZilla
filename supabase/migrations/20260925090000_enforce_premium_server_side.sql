-- Enforce premium features on the server (issue #16).
--
-- The client decides which premium UI to show from the check-subscription
-- response, which the user can tamper with. Everything that has value on the
-- server (premium content and the free plan limit) must be checked here.

-- 1. Single source of truth: the subscribers table, written only by the
--    check-subscription and stripe-webhook edge functions (service role).
CREATE OR REPLACE FUNCTION public.is_subscribed(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.subscribers s
    WHERE s.user_id = uid
      AND s.subscribed = true
      AND (s.subscription_end IS NULL OR s.subscription_end > now())
  );
$$;

REVOKE ALL ON FUNCTION public.is_subscribed(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_subscribed(uuid) TO authenticated, service_role;

-- 2. Users must never be able to write their own subscription state.
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
REVOKE INSERT, UPDATE, DELETE ON public.subscribers FROM anon, authenticated;

-- 3. Interview questions and company reviews are premium content.
DROP POLICY IF EXISTS "All authenticated users can view interview questions" ON public.interview_questions;
DROP POLICY IF EXISTS "Users can create their own interview questions" ON public.interview_questions;

CREATE POLICY "Subscribers can view interview questions"
  ON public.interview_questions
  FOR SELECT
  TO authenticated
  USING (public.is_subscribed(auth.uid()));

CREATE POLICY "Subscribers can create their own interview questions"
  ON public.interview_questions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.is_subscribed(auth.uid()));

DROP POLICY IF EXISTS "All authenticated users can view company reviews" ON public.company_reviews;
DROP POLICY IF EXISTS "Users can create their own company reviews" ON public.company_reviews;

CREATE POLICY "Subscribers can view company reviews"
  ON public.company_reviews
  FOR SELECT
  TO authenticated
  USING (public.is_subscribed(auth.uid()));

CREATE POLICY "Subscribers can create their own company reviews"
  ON public.company_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.is_subscribed(auth.uid()));

-- 4. Free plan limit on active applications (keep in sync with
--    FREE_PLAN_APPLICATION_LIMIT in src/types/job.ts).
CREATE OR REPLACE FUNCTION public.enforce_free_plan_application_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  free_plan_limit CONSTANT integer := 50;
  active_count integer;
BEGIN
  IF NEW.deleted THEN
    RETURN NEW;
  END IF;

  -- Only a new row or a restored (undeleted) row adds to the count.
  IF TG_OP = 'UPDATE' AND OLD.deleted = false THEN
    RETURN NEW;
  END IF;

  IF public.is_subscribed(NEW.user_id) THEN
    RETURN NEW;
  END IF;

  SELECT count(*) INTO active_count
  FROM public.job_applications
  WHERE user_id = NEW.user_id
    AND deleted = false;

  IF active_count >= free_plan_limit THEN
    RAISE EXCEPTION 'free_plan_limit_reached'
      USING HINT = 'Upgrade to ProZilla to add more applications.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_free_plan_application_limit ON public.job_applications;
CREATE TRIGGER enforce_free_plan_application_limit
  BEFORE INSERT OR UPDATE OF deleted ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.enforce_free_plan_application_limit();
