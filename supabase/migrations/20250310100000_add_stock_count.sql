-- Add stock_count column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock_count INTEGER DEFAULT 5;

-- Update existing products to have a random low stock for demo purposes
UPDATE products 
SET stock_count = floor(random() * 10 + 1)::int
WHERE stock_count IS NULL;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload config';
