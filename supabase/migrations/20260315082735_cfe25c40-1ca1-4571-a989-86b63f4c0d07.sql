
-- Drop the security invoker view approach - use column-level grants instead
DROP VIEW IF EXISTS public.blood_requests_public;

-- Add back a public SELECT policy but restrict columns via GRANT
-- First revoke all SELECT from anon on blood_requests
REVOKE SELECT ON public.blood_requests FROM anon;

-- Grant SELECT only on non-PII columns to anon
GRANT SELECT(id, blood_group, units_needed, status, hospital, created_at) ON public.blood_requests TO anon;

-- Re-add public SELECT policy (needed for anon to query at all)
CREATE POLICY "Anyone can view blood requests limited" ON public.blood_requests
FOR SELECT TO anon
USING (true);
