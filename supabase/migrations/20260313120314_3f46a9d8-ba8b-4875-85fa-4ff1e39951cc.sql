
-- Create storage bucket for donor PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('donor-pdfs', 'donor-pdfs', true);

-- Allow anyone to upload to donor-pdfs bucket
CREATE POLICY "Anyone can upload donor pdfs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'donor-pdfs');

-- Allow anyone to read donor pdfs
CREATE POLICY "Anyone can read donor pdfs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'donor-pdfs');
