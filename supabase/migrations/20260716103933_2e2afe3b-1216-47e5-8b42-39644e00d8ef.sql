
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.announcements TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active announcements"
  ON public.announcements FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin can insert announcements"
  ON public.announcements FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update announcements"
  ON public.announcements FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete announcements"
  ON public.announcements FOR DELETE
  TO authenticated
  USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.update_announcements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_announcements_updated_at();

ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
ALTER TABLE public.announcements REPLICA IDENTITY FULL;

INSERT INTO public.announcements (message, is_active)
VALUES ('রক্তদান জীবন বাঁচায় — আজই বাঁধন, ফেনী সরকারি কলেজ ইউনিটে যোগাযোগ করুন। জরুরি প্রয়োজনে কল: 01577280577', true);
