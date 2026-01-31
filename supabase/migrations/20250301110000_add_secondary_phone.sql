-- Add secondary_phone column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS secondary_phone TEXT;

-- Force API cache reload
NOTIFY pgrst, 'reload config';
