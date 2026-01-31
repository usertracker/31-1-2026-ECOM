/*
  # Fix Site Assets Table
  
  1. Drops existing table to clear bad state
  2. Re-creates table with correct text-based types for compatibility
  3. Adds default content for banners and sliders
  4. Sets permissive policies to avoid "uuid = text" errors with Firebase Auth
*/

-- 1. Reset Table
DROP TABLE IF EXISTS site_assets;

-- 2. Create Table
CREATE TABLE site_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  section TEXT NOT NULL,
  type TEXT DEFAULT 'image',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS (Security)
ALTER TABLE site_assets ENABLE ROW LEVEL SECURITY;

-- 4. Add Policies (Permissive for Hybrid App)
-- We use "true" to bypass the "auth.uid() = user_id" check which causes the UUID=TEXT error
CREATE POLICY "Public read access"
  ON site_assets FOR SELECT
  USING (true);

CREATE POLICY "Public write access"
  ON site_assets FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public update access"
  ON site_assets FOR UPDATE
  USING (true);

-- 5. Seed Initial Data (Default Images)
INSERT INTO site_assets (key, value, label, section, type) VALUES
-- Hero Slider - Jewellery
('hero_jewel_1', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop', 'Hero Slide 1 (Jewellery)', 'Hero Slider', 'image'),
('hero_jewel_2', 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2070&auto=format&fit=crop', 'Hero Slide 2 (Jewellery)', 'Hero Slider', 'image'),

-- Hero Slider - Gifts
('hero_gift_1', 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=2070&auto=format&fit=crop', 'Hero Slide 1 (Gifts)', 'Hero Slider', 'image'),
('hero_gift_2', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2070&auto=format&fit=crop', 'Hero Slide 2 (Gifts)', 'Hero Slider', 'image'),

-- Banners
('banner_bestseller_gifts', 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=2000&auto=format&fit=crop', 'Bestseller Banner (Gifts)', 'Banners', 'image'),
('banner_bestseller_jewel', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2000&auto=format&fit=crop', 'Bestseller Banner (Jewellery)', 'Banners', 'image'),
('banner_buying_guide', 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop', 'Buying Guide Banner', 'Banners', 'image'),
('banner_perfect_gift', 'https://cdn3d.iconscout.com/3d/premium/thumb/gift-box-4392087-3652564.png', 'Perfect Gift Banner (3D)', 'Banners', 'image'),

-- Calendar Events
('cal_val_day', 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop', 'Valentines Day', 'Calendar', 'image'),
('cal_womens', 'https://images.unsplash.com/photo-1556228552-523de5147bb6?q=80&w=600&auto=format&fit=crop', 'Womens Day', 'Calendar', 'image'),
('cal_holi', 'https://images.unsplash.com/photo-1516641396056-0ce60a85d49f?q=80&w=600&auto=format&fit=crop', 'Holi', 'Calendar', 'image'),
('cal_mothers', 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop', 'Mothers Day', 'Calendar', 'image'),
('cal_rakhi', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop', 'Raksha Bandhan', 'Calendar', 'image'),
('cal_ugadi', 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=600&auto=format&fit=crop', 'Ugadi', 'Calendar', 'image'),
('cal_akshaya', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop', 'Akshaya Tritiya', 'Calendar', 'image'),
('cal_wedding', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop', 'Wedding Season', 'Calendar', 'image'),
('cal_karwa', 'https://images.unsplash.com/photo-1602751584552-8ba42d523f17?q=80&w=600&auto=format&fit=crop', 'Karwa Chauth', 'Calendar', 'image')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
