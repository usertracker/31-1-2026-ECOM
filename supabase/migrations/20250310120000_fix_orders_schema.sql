-- Add created_at column to orders table if it doesn't exist
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- Ensure date column exists as well (since it's used in some contexts) or map it
-- We will assume the code uses created_at primarily for the timestamp

-- Notify PostgREST to reload the schema cache immediately
NOTIFY pgrst, 'reload config';
