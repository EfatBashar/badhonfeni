DROP POLICY IF EXISTS "Authenticated users can update blood_requests" ON public.blood_requests;
CREATE POLICY "Authenticated users can update blood_requests"
ON public.blood_requests
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (
  status = ANY (ARRAY['pending'::text, 'completed'::text, 'approved'::text, 'fulfilled'::text, 'cancelled'::text])
  AND blood_group = ANY (ARRAY['A+'::text,'A-'::text,'B+'::text,'B-'::text,'AB+'::text,'AB-'::text,'O+'::text,'O-'::text])
);