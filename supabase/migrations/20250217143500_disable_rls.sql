/*
  # Fix Permissions for Auth
  Disabling Row Level Security (RLS) on public tables to allow
  anonymous users to Login/Signup and view products without complex policies.
  
  ## Impact
  - Tables: users, sellers, products, orders, otps
  - Security: RLS Disabled (Public Access for Demo)
*/

ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sellers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.otps DISABLE ROW LEVEL SECURITY;
