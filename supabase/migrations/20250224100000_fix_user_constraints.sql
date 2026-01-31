-- Drop the unique constraint on phone number
-- This allows multiple users to have empty phone numbers (common with Google Auth)
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_phone_key;

-- Ensure phone column is nullable
ALTER TABLE public.users ALTER COLUMN phone DROP NOT NULL;

-- Force schema cache reload
NOTIFY pgrst, 'reload config';
