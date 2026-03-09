CREATE TABLE public.blood_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  blood_group text NOT NULL,
  units_needed integer NOT NULL DEFAULT 1,
  hospital text NOT NULL,
  contact_phone text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can view requests
CREATE POLICY "Anyone can view blood requests"
  ON public.blood_requests FOR SELECT
  USING (true);

-- Anyone can submit a request (public form)
CREATE POLICY "Anyone can submit blood requests"
  ON public.blood_requests FOR INSERT
  WITH CHECK (true);