-- Fix RLS policies for Firebase Auth integration
-- The previous policies relied on Supabase Auth (auth.uid()), which is not available
-- when using Firebase. We will disable RLS for these tables to allow the application
-- to manage data access via the Firebase User ID.

-- 1. Disable RLS for Cart Items
-- This fixes the "new row violates row-level security policy" error when adding to cart
ALTER TABLE public.cart_items DISABLE ROW LEVEL SECURITY;

-- 2. Disable RLS for Wishlist Items
ALTER TABLE public.wishlist_items DISABLE ROW LEVEL SECURITY;

-- 3. Disable RLS for Orders
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- 4. Disable RLS for Users table (to ensure profile updates work)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 5. Force API Cache Reload
NOTIFY pgrst, 'reload config';
