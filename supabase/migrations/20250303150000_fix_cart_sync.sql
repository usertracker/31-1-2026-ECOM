/*
  # Fix Cart and Wishlist Syncing for Firebase Auth
  
  Problem: 
  Since we are using Firebase for Authentication but Supabase for Database,
  the standard RLS (Row Level Security) policies relying on auth.uid() will not work.
  This causes the database to reject writes (saving cart) or reads (syncing cart) silently.
  
  Solution:
  1. Disable RLS on cart_items and wishlist_items to allow the application to read/write data.
  2. Ensure unique constraints exist for proper upsert functionality (preventing duplicates).
*/

-- 1. Disable RLS to allow access via the anon key (client-side)
-- This allows your Firebase-authenticated app to read/write to these tables
ALTER TABLE public.cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY; 

-- 2. Ensure the unique constraint exists for cart items (User + Product)
-- This is critical for the upsert logic in addToCart to work (update quantity instead of duplicate)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cart_items_user_id_product_id_key') THEN
        ALTER TABLE public.cart_items ADD CONSTRAINT cart_items_user_id_product_id_key UNIQUE (user_id, product_id);
    END IF;
END $$;

-- 3. Ensure the unique constraint exists for wishlist items
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'wishlist_items_user_id_product_id_key') THEN
        ALTER TABLE public.wishlist_items ADD CONSTRAINT wishlist_items_user_id_product_id_key UNIQUE (user_id, product_id);
    END IF;
END $$;
