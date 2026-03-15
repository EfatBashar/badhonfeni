
-- Re-grant full SELECT on blood_requests to anon (restore patient_name & contact_phone visibility)
REVOKE SELECT ON public.blood_requests FROM anon;
GRANT SELECT ON public.blood_requests TO anon;
