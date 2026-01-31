-- Enable RLS on sellers table if not already enabled
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to register as a seller (INSERT)
DROP POLICY IF EXISTS "Allow public insert to sellers" ON public.sellers;
CREATE POLICY "Allow public insert to sellers" ON public.sellers FOR INSERT WITH CHECK (true);

-- Policy to allow reading seller data (for login checks)
DROP POLICY IF EXISTS "Allow public read access to sellers" ON public.sellers;
CREATE POLICY "Allow public read access to sellers" ON public.sellers FOR SELECT USING (true);

-- Policy to allow updating seller status (for admin approvals or seller profile updates)
DROP POLICY IF EXISTS "Allow update to sellers" ON public.sellers;
CREATE POLICY "Allow update to sellers" ON public.sellers FOR UPDATE USING (true);

-- Ensure the sequence/table permissions are granted to anon/authenticated roles
GRANT ALL ON TABLE public.sellers TO anon, authenticated;
GRANT ALL ON TABLE public.products TO anon, authenticated;
GRANT ALL ON TABLE public.orders TO anon, authenticated;
GRANT ALL ON TABLE public.users TO anon, authenticated;
