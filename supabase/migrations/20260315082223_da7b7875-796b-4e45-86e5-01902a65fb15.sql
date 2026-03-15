
-- Drop the overly permissive public INSERT policy
DROP POLICY IF EXISTS "Anyone can insert donors" ON public.donors;

-- Create a tighter public INSERT policy with field validation
CREATE POLICY "Public can insert donors with validation" ON public.donors
FOR INSERT TO public
WITH CHECK (
  -- Name must be non-empty and reasonable length
  char_length(trim(name)) >= 2 AND char_length(trim(name)) <= 100
  -- Phone must match Bangladeshi format (01XXXXXXXXX)
  AND phone ~ '^01[3-9][0-9]{8}$'
  -- Blood group must be valid
  AND blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
  -- total_donations must be 0 for new public inserts
  AND total_donations = 0
);
