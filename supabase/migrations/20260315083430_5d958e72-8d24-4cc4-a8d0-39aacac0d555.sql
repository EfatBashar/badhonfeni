
-- Remove the anon UPDATE policy entirely
DROP POLICY IF EXISTS "Public can update only last_donation" ON public.donors;

-- Revoke all UPDATE from anon
REVOKE UPDATE ON public.donors FROM anon;

-- Create a SECURITY DEFINER function for updating last_donation only
CREATE OR REPLACE FUNCTION public.update_donor_last_donation(
  _donor_id uuid,
  _last_donation date
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.donors
  SET last_donation = _last_donation
  WHERE id = _donor_id;
  SELECT true;
$$;

-- Allow anon and authenticated to call this function
GRANT EXECUTE ON FUNCTION public.update_donor_last_donation(uuid, date) TO anon, authenticated;
