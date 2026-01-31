-- 1. Add the missing 'combos' column to the products table
-- We use JSONB to efficiently store the array of combo objects
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS combos JSONB DEFAULT '[]'::jsonb;

-- 2. Ensure 'specs' column also exists (safety check)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS specs TEXT[] DEFAULT ARRAY['Standard Specification']::TEXT[];

-- 3. Force PostgREST to refresh its schema cache immediately
-- This is the critical step to fix the PGRST204 error
NOTIFY pgrst, 'reload schema';
