-- 1. Create the 'product-images' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable Row Level Security (standard practice)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to ensure clean creation (prevents duplicate policy errors)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;

-- 4. Create Policy: Allow public to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- 5. Create Policy: Allow authenticated users (admins/sellers) to upload
CREATE POLICY "Authenticated Uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
