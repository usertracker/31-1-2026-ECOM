/*
  # Fix Product Deletion (Cascade)
  
  ## Query Description:
  This migration updates the foreign key relationships for `cart_items`, `wishlist_items`, and `recently_viewed` tables.
  It enables `ON DELETE CASCADE`, which means when a product is deleted from the `products` table, 
  it will automatically be removed from users' carts, wishlists, and history without causing errors.

  ## Metadata:
  - Schema-Category: Structural
  - Impact-Level: Medium
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - Modifies `cart_items` table constraint
  - Modifies `wishlist_items` table constraint
  - Modifies `recently_viewed` table constraint
*/

-- Fix Cart Items Foreign Key
ALTER TABLE public.cart_items 
DROP CONSTRAINT IF EXISTS cart_items_product_id_fkey;

ALTER TABLE public.cart_items 
ADD CONSTRAINT cart_items_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES public.products(id) 
ON DELETE CASCADE;

-- Fix Wishlist Items Foreign Key
ALTER TABLE public.wishlist_items 
DROP CONSTRAINT IF EXISTS wishlist_items_product_id_fkey;

ALTER TABLE public.wishlist_items 
ADD CONSTRAINT wishlist_items_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES public.products(id) 
ON DELETE CASCADE;

-- Fix Recently Viewed Foreign Key
ALTER TABLE public.recently_viewed 
DROP CONSTRAINT IF EXISTS recently_viewed_product_id_fkey;

ALTER TABLE public.recently_viewed 
ADD CONSTRAINT recently_viewed_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES public.products(id) 
ON DELETE CASCADE;
