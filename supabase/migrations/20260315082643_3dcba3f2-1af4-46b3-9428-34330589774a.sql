
-- ============================================
-- 1. FIX: Restrict public UPDATE on donors to only last_donation column
-- ============================================

-- Drop the current permissive public UPDATE policy
DROP POLICY IF EXISTS "Anyone can update donor donation info" ON public.donors;

-- Revoke all UPDATE privileges from anon on donors
REVOKE UPDATE ON public.donors FROM anon;

-- Grant UPDATE only on last_donation column to anon
GRANT UPDATE(last_donation) ON public.donors TO anon;

-- Create a tighter UPDATE policy for anon (only last_donation)
CREATE POLICY "Public can update only last_donation" ON public.donors
FOR UPDATE TO anon
USING (true)
WITH CHECK (true);

-- Authenticated users can update all columns with validation
CREATE POLICY "Authenticated users can update donors" ON public.donors
FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (
  char_length(trim(name)) >= 2
  AND phone ~ '^01[3-9][0-9]{8}$'
  AND blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
);

-- ============================================
-- 2. FIX: Restrict blood_requests SELECT to hide PII from public
-- Create a view for public access without patient PII
-- ============================================

-- Create a public-safe view for blood requests
CREATE OR REPLACE VIEW public.blood_requests_public AS
SELECT 
  id,
  blood_group,
  units_needed,
  status,
  hospital,
  created_at
FROM public.blood_requests;

-- Grant access to anon and authenticated
GRANT SELECT ON public.blood_requests_public TO anon, authenticated;

-- Now restrict the main table SELECT to authenticated only
DROP POLICY IF EXISTS "Anyone can view blood requests" ON public.blood_requests;

CREATE POLICY "Authenticated users can view blood requests" ON public.blood_requests
FOR SELECT TO authenticated
USING (true);
