/*
  # Add created_at to products table

  ## Query Description:
  Adds the missing created_at column to the products table to fix PGRST204 error during data seeding.
  
  ## Metadata:
  - Schema-Category: Structural
  - Impact-Level: Low
  - Requires-Backup: false
  - Reversible: true
*/

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Force a schema cache reload to ensure the API recognizes the new column immediately
NOTIFY pgrst, 'reload config';
