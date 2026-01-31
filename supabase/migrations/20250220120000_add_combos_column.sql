-- Add a JSONB column to store an array of combo objects
-- Each object will look like: { id: string, name: string, price: number, image: string }
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS combos JSONB DEFAULT '[]'::jsonb;

-- Force PostgREST schema cache reload to recognize the new column immediately
NOTIFY pgrst, 'reload schema';
