-- Add gender column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS gender TEXT;

-- Force PostgREST to reload the schema cache immediately
NOTIFY pgrst, 'reload config';
