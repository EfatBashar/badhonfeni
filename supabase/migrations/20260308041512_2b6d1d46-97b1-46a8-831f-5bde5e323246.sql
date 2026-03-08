-- Create donors table
CREATE TABLE public.donors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  phone TEXT NOT NULL,
  last_donation DATE,
  total_donations INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create committee_members table
CREATE TABLE public.committee_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committee_members ENABLE ROW LEVEL SECURITY;

-- Public read access (this is a public donor directory)
CREATE POLICY "Anyone can view donors" ON public.donors FOR SELECT USING (true);
CREATE POLICY "Anyone can view committee members" ON public.committee_members FOR SELECT USING (true);