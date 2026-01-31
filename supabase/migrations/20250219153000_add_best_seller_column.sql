-- Add the missing is_best_seller column to the products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT false;

-- Force PostgREST schema cache reload to recognize the new column immediately
NOTIFY pgrst, 'reload schema';
