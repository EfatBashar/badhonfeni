-- Add department and session columns to committee_members
ALTER TABLE public.committee_members ADD COLUMN department TEXT;
ALTER TABLE public.committee_members ADD COLUMN session TEXT;