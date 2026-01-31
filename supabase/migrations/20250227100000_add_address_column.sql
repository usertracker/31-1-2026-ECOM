-- Add address column to users table to store structured address data
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS address JSONB DEFAULT NULL;

-- Force PostgREST to reload the schema cache immediately
NOTIFY pgrst, 'reload config';
