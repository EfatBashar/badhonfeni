GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.donors TO authenticated;
GRANT SELECT, INSERT ON TABLE public.donors TO anon;
GRANT ALL ON TABLE public.donors TO service_role;

GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;

DROP POLICY IF EXISTS "Admin can view all donors" ON public.donors;
CREATE POLICY "Admin can view all donors"
ON public.donors
FOR SELECT
TO authenticated
USING ((SELECT auth.jwt() ->> 'email') = 'badhanfgcunit2018@gmail.com');

DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
CREATE POLICY "Admin can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING ((SELECT auth.jwt() ->> 'email') = 'badhanfgcunit2018@gmail.com');