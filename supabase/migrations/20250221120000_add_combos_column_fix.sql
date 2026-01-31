-- Add the 'combos' column to store the array of combo objects
-- We use IF NOT EXISTS to prevent errors if it was partially applied
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS combos JSONB DEFAULT '[]'::jsonb;

-- Force PostgREST schema cache reload to recognize the new column immediately
-- This is critical for fixing the PGRST204 error
NOTIFY pgrst, 'reload schema';
