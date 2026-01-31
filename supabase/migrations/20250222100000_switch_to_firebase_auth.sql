-- Migration to support Firebase Auth with Supabase DB

-- 1. Modify users table to accept Firebase UIDs (which are strings, not always UUIDs)
ALTER TABLE public.users ALTER COLUMN id TYPE text;

-- 2. Remove Foreign Key constraint to auth.users if it exists
-- Since we are using Firebase for Auth, the users in public.users won't exist in supabase auth.users
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- 3. Update RLS Policies for Hybrid Mode
-- Since Firebase tokens aren't recognized by Supabase RLS, we need permissive policies for the public API
-- In a production app with a backend, you would verify the Firebase token. 
-- For this frontend-only hybrid, we allow public access to the users table but relying on client-side logic.

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow Public Access" ON public.users;
CREATE POLICY "Allow Public Access" ON public.users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Ensure Orders are writable
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow Public Orders" ON public.orders;
CREATE POLICY "Allow Public Orders" ON public.orders
    FOR ALL
    USING (true)
    WITH CHECK (true);
