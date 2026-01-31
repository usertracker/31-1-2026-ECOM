/*
  # Add Language Column to Users Table
  
  Adds a 'language' column to the public.users table to store user language preferences.
  
  ## Changes
  - Add 'language' column (text, default 'en') to 'users' table
  - Refresh schema cache to prevent PGRST204 errors
*/

DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'language') THEN
    ALTER TABLE public.users ADD COLUMN language text DEFAULT 'en';
  END IF;
END $$;

-- Notify PostgREST to reload the schema cache immediately
NOTIFY pgrst, 'reload config';
