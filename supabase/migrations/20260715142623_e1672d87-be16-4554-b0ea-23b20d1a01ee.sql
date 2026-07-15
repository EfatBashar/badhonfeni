
-- 1. Helper: is_admin() security definer
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'badhanfgcunit2018@gmail.com',
    false
  );
$$;

-- 2. donors: gender + is_visible
ALTER TABLE public.donors
  ADD COLUMN IF NOT EXISTS gender text NOT NULL DEFAULT 'male',
  ADD COLUMN IF NOT EXISTS is_visible boolean NOT NULL DEFAULT true;

ALTER TABLE public.donors
  DROP CONSTRAINT IF EXISTS donors_gender_check;
ALTER TABLE public.donors
  ADD CONSTRAINT donors_gender_check CHECK (gender IN ('male','female'));

-- Replace public SELECT policy: only visible donors
DROP POLICY IF EXISTS "Anyone can view donors" ON public.donors;
CREATE POLICY "Anyone can view visible donors"
  ON public.donors FOR SELECT
  USING (is_visible = true);

-- Admin sees all (including hidden)
DROP POLICY IF EXISTS "Admin can view all donors" ON public.donors;
CREATE POLICY "Admin can view all donors"
  ON public.donors FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Update insert validation policies to allow gender
DROP POLICY IF EXISTS "Public can insert donors with validation" ON public.donors;
CREATE POLICY "Public can insert donors with validation"
  ON public.donors FOR INSERT
  WITH CHECK (
    char_length(trim(name)) >= 2
    AND char_length(trim(name)) <= 100
    AND phone ~ '^01[3-9][0-9]{8}$'
    AND blood_group = ANY (ARRAY['A+','A-','B+','B-','AB+','AB-','O+','O-'])
    AND gender IN ('male','female')
    AND total_donations = 0
  );

DROP POLICY IF EXISTS "Authenticated users can insert donors with validation" ON public.donors;
CREATE POLICY "Authenticated users can insert donors with validation"
  ON public.donors FOR INSERT
  TO authenticated
  WITH CHECK (
    char_length(trim(name)) >= 2
    AND char_length(trim(name)) <= 100
    AND phone ~ '^01[3-9][0-9]{8}$'
    AND blood_group = ANY (ARRAY['A+','A-','B+','B-','AB+','AB-','O+','O-'])
    AND gender IN ('male','female')
  );

-- 3. blood_requests: hemoglobin
ALTER TABLE public.blood_requests
  ADD COLUMN IF NOT EXISTS hemoglobin numeric(4,1) NOT NULL DEFAULT 0;

-- Update insert policy to require hemoglobin >= 5 and <= 20
DROP POLICY IF EXISTS "Public can submit blood requests with validation" ON public.blood_requests;
CREATE POLICY "Public can submit blood requests with validation"
  ON public.blood_requests FOR INSERT
  WITH CHECK (
    status = 'pending'
    AND char_length(trim(patient_name)) >= 2
    AND blood_group = ANY (ARRAY['A+','A-','B+','B-','AB+','AB-','O+','O-'])
    AND contact_phone ~ '^01[3-9][0-9]{8}$'
    AND char_length(trim(hospital)) >= 2
    AND units_needed >= 1
    AND units_needed <= 20
    AND hemoglobin >= 5
    AND hemoglobin <= 20
  );

-- 4. profiles: created_at + admin SELECT policy
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
CREATE POLICY "Admin can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_admin());
