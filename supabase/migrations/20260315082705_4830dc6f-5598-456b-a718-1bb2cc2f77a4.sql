
-- Fix the security definer view by setting it to SECURITY INVOKER
ALTER VIEW public.blood_requests_public SET (security_invoker = on);
