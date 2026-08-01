DROP POLICY IF EXISTS "Anyone can view blood requests limited" ON public.blood_requests;
REVOKE SELECT ON public.blood_requests FROM anon;

DROP POLICY IF EXISTS "Authenticated users can update blood_requests" ON public.blood_requests;
CREATE POLICY "Authenticated users can update blood_requests"
ON public.blood_requests FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (
  status = ANY (ARRAY['pending','completed','approved','fulfilled','cancelled'])
  AND blood_group = ANY (ARRAY['A+','A-','B+','B-','AB+','AB-','O+','O-'])
);

DROP POLICY IF EXISTS "Anyone can view quiz scores" ON public.quiz_scores;
CREATE POLICY "Authenticated users can view quiz scores"
ON public.quiz_scores FOR SELECT TO authenticated
USING (true);
REVOKE SELECT ON public.quiz_scores FROM anon;

DROP POLICY IF EXISTS "Anyone can upload donor PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view donor PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload donor pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Public can read donor pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload donor pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can read donor pdfs" ON storage.objects;
CREATE POLICY "Authenticated can upload donor pdfs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'donor-pdfs');
CREATE POLICY "Authenticated can read donor pdfs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'donor-pdfs');

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_announcements_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_donor_last_donation(uuid, date) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_donor_last_donation(uuid, date) TO authenticated;