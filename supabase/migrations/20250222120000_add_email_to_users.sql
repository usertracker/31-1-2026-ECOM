-- 1. Add the missing email column to the users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Force PostgREST to reload the schema cache immediately
-- This ensures the API recognizes the new column without a restart
NOTIFY pgrst, 'reload config';
