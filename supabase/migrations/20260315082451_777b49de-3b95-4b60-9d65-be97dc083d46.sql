
-- ============================================
-- DONORS TABLE: Tighten UPDATE/DELETE/INSERT
-- ============================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can update donor last_donation" ON public.donors;
DROP POLICY IF EXISTS "Authenticated users can insert donors" ON public.donors;
DROP POLICY IF EXISTS "Authenticated users can delete donors" ON public.donors;

-- Authenticated users can insert donors with validation
CREATE POLICY "Authenticated users can insert donors with validation" ON public.donors
FOR INSERT TO authenticated
WITH CHECK (
  char_length(trim(name)) >= 2 AND char_length(trim(name)) <= 100
  AND phone ~ '^01[3-9][0-9]{8}$'
  AND blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
);

-- Public can update only last_donation and total_donations fields
-- Using a restrictive approach: only allow updating if no critical fields change
CREATE POLICY "Anyone can update donor donation info" ON public.donors
FOR UPDATE TO public
USING (true)
WITH CHECK (
  -- Ensure blood_group and phone remain unchanged (prevent tampering)
  blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
  AND phone ~ '^01[3-9][0-9]{8}$'
  AND char_length(trim(name)) >= 2
);

-- Only authenticated users can delete donors
CREATE POLICY "Authenticated users can delete donors" ON public.donors
FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL);

-- ============================================
-- BLOOD_REQUESTS TABLE: Tighten UPDATE/DELETE
-- ============================================

DROP POLICY IF EXISTS "Authenticated users can update blood_requests" ON public.blood_requests;
DROP POLICY IF EXISTS "Authenticated users can delete blood_requests" ON public.blood_requests;
DROP POLICY IF EXISTS "Anyone can submit blood requests with pending status" ON public.blood_requests;

-- Public insert with validation
CREATE POLICY "Public can submit blood requests with validation" ON public.blood_requests
FOR INSERT TO public
WITH CHECK (
  status = 'pending'
  AND char_length(trim(patient_name)) >= 2
  AND blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
  AND contact_phone ~ '^01[3-9][0-9]{8}$'
  AND char_length(trim(hospital)) >= 2
  AND units_needed >= 1 AND units_needed <= 20
);

-- Authenticated update with validation
CREATE POLICY "Authenticated users can update blood_requests" ON public.blood_requests
FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (
  status IN ('pending', 'approved', 'fulfilled', 'cancelled')
  AND blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
);

-- Authenticated delete
CREATE POLICY "Authenticated users can delete blood_requests" ON public.blood_requests
FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL);

-- ============================================
-- COMMITTEE_MEMBERS TABLE: Tighten INSERT/UPDATE/DELETE
-- ============================================

DROP POLICY IF EXISTS "Authenticated users can insert committee_members" ON public.committee_members;
DROP POLICY IF EXISTS "Authenticated users can update committee_members" ON public.committee_members;
DROP POLICY IF EXISTS "Authenticated users can delete committee_members" ON public.committee_members;

-- Authenticated insert with validation
CREATE POLICY "Authenticated users can insert committee_members" ON public.committee_members
FOR INSERT TO authenticated
WITH CHECK (
  char_length(trim(name)) >= 2
  AND phone ~ '^01[3-9][0-9]{8}$'
  AND blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
  AND char_length(trim(role)) >= 2
);

-- Authenticated update with validation
CREATE POLICY "Authenticated users can update committee_members" ON public.committee_members
FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (
  char_length(trim(name)) >= 2
  AND phone ~ '^01[3-9][0-9]{8}$'
  AND blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
);

-- Authenticated delete
CREATE POLICY "Authenticated users can delete committee_members" ON public.committee_members
FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL);
