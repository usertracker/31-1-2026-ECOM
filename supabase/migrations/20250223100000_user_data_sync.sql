-- Create Cart Items Table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id) -- Prevent duplicate rows for same product
);

-- Create Wishlist Items Table
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Update Orders Table to link to Users
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Policies for Cart
CREATE POLICY "Users can view their own cart" ON public.cart_items
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert into their own cart" ON public.cart_items
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own cart" ON public.cart_items
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete from their own cart" ON public.cart_items
  FOR DELETE USING (auth.uid()::text = user_id);

-- Policies for Wishlist
CREATE POLICY "Users can view their own wishlist" ON public.wishlist_items
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert into their own wishlist" ON public.wishlist_items
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete from their own wishlist" ON public.wishlist_items
  FOR DELETE USING (auth.uid()::text = user_id);

-- Policies for Orders (Update existing or create new)
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid()::text = user_id);

-- Force schema reload
NOTIFY pgrst, 'reload schema';
