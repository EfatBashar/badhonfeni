DROP POLICY IF EXISTS "Admin can delete announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admin can insert announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admin can update announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admin can view all announcements" ON public.announcements;

CREATE POLICY "Admin can delete announcements"
ON public.announcements
FOR DELETE
TO authenticated
USING ((SELECT auth.jwt() ->> 'email') = 'badhanfgcunit2018@gmail.com');

CREATE POLICY "Admin can insert announcements"
ON public.announcements
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.jwt() ->> 'email') = 'badhanfgcunit2018@gmail.com');

CREATE POLICY "Admin can update announcements"
ON public.announcements
FOR UPDATE
TO authenticated
USING ((SELECT auth.jwt() ->> 'email') = 'badhanfgcunit2018@gmail.com')
WITH CHECK ((SELECT auth.jwt() ->> 'email') = 'badhanfgcunit2018@gmail.com');

CREATE POLICY "Admin can view all announcements"
ON public.announcements
FOR SELECT
TO authenticated
USING ((SELECT auth.jwt() ->> 'email') = 'badhanfgcunit2018@gmail.com');

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;