/*
  # Fix Foreign Key Constraints & Cleanup Orphans
  
  1. Cleanup: Removes items from cart/wishlist/history that reference non-existent products
  2. Constraints: Updates foreign keys to use ON DELETE CASCADE
  
  This fixes the "violation of foreign key constraint" error by ensuring data integrity
  before applying the stricter rules.
*/

-- 1. Clean up orphan records (This fixes the error you saw)
-- We delete any item where the product_id is not found in the products table
DELETE FROM public.cart_items 
WHERE product_id NOT IN (SELECT id FROM public.products);

DELETE FROM public.wishlist_items 
WHERE product_id NOT IN (SELECT id FROM public.products);

DELETE FROM public.recently_viewed 
WHERE product_id NOT IN (SELECT id FROM public.products);

-- 2. Now safe to update Cart constraints
ALTER TABLE public.cart_items 
DROP CONSTRAINT IF EXISTS cart_items_product_id_fkey;

ALTER TABLE public.cart_items 
ADD CONSTRAINT cart_items_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES public.products(id) 
ON DELETE CASCADE;

-- 3. Update Wishlist constraints
ALTER TABLE public.wishlist_items 
DROP CONSTRAINT IF EXISTS wishlist_items_product_id_fkey;

ALTER TABLE public.wishlist_items 
ADD CONSTRAINT wishlist_items_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES public.products(id) 
ON DELETE CASCADE;

-- 4. Update Recently Viewed constraints
ALTER TABLE public.recently_viewed 
DROP CONSTRAINT IF EXISTS recently_viewed_product_id_fkey;

ALTER TABLE public.recently_viewed 
ADD CONSTRAINT recently_viewed_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES public.products(id) 
ON DELETE CASCADE;
