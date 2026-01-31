-- Remove the 'combos' column from products table
ALTER TABLE products DROP COLUMN IF EXISTS combos;

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
