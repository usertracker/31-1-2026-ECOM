-- 1. Drop existing policies for this bucket to ensure a clean slate
-- We remove any potential conflicting policies
DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Select" ON storage.objects;

-- 2. Create a permissive upload policy (INSERT)
-- This allows ANYONE (including anonymous users) to upload to 'product-images'
-- This resolves the 403 Forbidden error during upload
CREATE POLICY "Allow Public Uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' );

-- 3. Create a permissive read policy (SELECT)
-- This allows anyone to view the images in this bucket
CREATE POLICY "Allow Public Select"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- 4. Ensure the bucket configuration is set to public
UPDATE storage.buckets
SET public = true
WHERE id = 'product-images';
