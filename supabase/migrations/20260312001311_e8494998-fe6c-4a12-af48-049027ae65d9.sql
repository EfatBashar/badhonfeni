CREATE POLICY "Anyone can insert donors"
ON public.donors FOR INSERT
TO public
WITH CHECK (true);