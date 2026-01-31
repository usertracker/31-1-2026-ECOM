-- Fix for ERROR 42501: Avoid altering system tables directly
-- This script safely creates the bucket and policies without requiring table ownership

-- 1. Create the 'product-images' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Policy: Allow public to view images (Conditional Check)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Public Access Product Images' 
    ) THEN
        CREATE POLICY "Public Access Product Images"
        ON storage.objects FOR SELECT
        USING ( bucket_id = 'product-images' );
    END IF;
END $$;

-- 3. Create Policy: Allow authenticated users to upload (Conditional Check)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated Uploads Product Images' 
    ) THEN
        CREATE POLICY "Authenticated Uploads Product Images"
        ON storage.objects FOR INSERT
        WITH CHECK ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
    END IF;
END $$;
