-- Ensure the products table is publicly readable
-- This is critical for anonymous users (customers) to see product details including combos

-- 1. Enable RLS (if not already enabled)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policy to avoid conflicts
DROP POLICY IF EXISTS "Public Read Access" ON public.products;

-- 3. Create a permissive SELECT policy for everyone
CREATE POLICY "Public Read Access"
ON public.products FOR SELECT
USING (true);

-- 4. Ensure combos column exists (redundant check for safety)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS combos JSONB DEFAULT '[]'::jsonb;

-- 5. Force schema cache reload
NOTIFY pgrst, 'reload schema';
