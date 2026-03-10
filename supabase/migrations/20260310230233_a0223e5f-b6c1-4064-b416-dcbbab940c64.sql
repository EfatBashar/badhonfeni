
CREATE POLICY "Authenticated users can insert donors"
ON public.donors FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete donors"
ON public.donors FOR DELETE TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert committee_members"
ON public.committee_members FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update committee_members"
ON public.committee_members FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete committee_members"
ON public.committee_members FOR DELETE TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update blood_requests"
ON public.blood_requests FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blood_requests"
ON public.blood_requests FOR DELETE TO authenticated
USING (true);
