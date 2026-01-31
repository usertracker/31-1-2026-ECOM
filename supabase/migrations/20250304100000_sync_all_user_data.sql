-- 1. Create Recently Viewed Table
CREATE TABLE IF NOT EXISTS public.recently_viewed (
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id)
);

-- 2. Enable RLS but allow access (Since we manage Auth via Firebase)
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- 3. Create Permissive Policies for Firebase Users
-- (We rely on the client sending the correct user_id, which matches Firebase UID)

-- Recently Viewed Policies
CREATE POLICY "Enable all access for recently_viewed" ON public.recently_viewed
FOR ALL USING (true) WITH CHECK (true);

-- Orders Policies (Ensure users can see their orders)
DROP POLICY IF EXISTS "Enable all access for orders" ON public.orders;
CREATE POLICY "Enable all access for orders" ON public.orders
FOR ALL USING (true) WITH CHECK (true);

-- Cart Policies (Ensure sync works)
DROP POLICY IF EXISTS "Enable all access for cart_items" ON public.cart_items;
CREATE POLICY "Enable all access for cart_items" ON public.cart_items
FOR ALL USING (true) WITH CHECK (true);

-- Wishlist Policies
DROP POLICY IF EXISTS "Enable all access for wishlist_items" ON public.wishlist_items;
CREATE POLICY "Enable all access for wishlist_items" ON public.wishlist_items
FOR ALL USING (true) WITH CHECK (true);
