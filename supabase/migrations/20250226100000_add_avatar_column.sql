-- Add avatar column to users table to store Google Profile Picture
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Force schema cache reload
NOTIFY pgrst, 'reload config';
