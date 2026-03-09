-- Replace the permissive insert policy with a more restrictive one
DROP POLICY "Anyone can submit blood requests" ON public.blood_requests;

CREATE POLICY "Anyone can submit blood requests with pending status"
  ON public.blood_requests FOR INSERT
  WITH CHECK (status = 'pending');