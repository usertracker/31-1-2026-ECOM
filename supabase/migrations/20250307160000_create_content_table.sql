/*
  # Create Site Assets Table
  Stores dynamic content for the website like banner images, slider images, etc.

  ## Metadata:
  - Schema-Category: "Content"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - Table: site_assets
  - Columns: key (PK), value (text), label (text), section (text)
*/

CREATE TABLE IF NOT EXISTS site_assets (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT,
  section TEXT,
  type TEXT DEFAULT 'image',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_assets ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public Read Assets" ON site_assets 
  FOR SELECT USING (true);

CREATE POLICY "Admin Manage Assets" ON site_assets 
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Seed Initial Data (Best Effort)
INSERT INTO site_assets (key, section, label, value) VALUES
-- Hero Slider
('hero_jewel_1', 'Hero Slider', 'Jewellery Slide 1 (Wedding)', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop'),
('hero_jewel_2', 'Hero Slider', 'Jewellery Slide 2 (Gold)', 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2070&auto=format&fit=crop'),
('hero_gift_1', 'Hero Slider', 'Gifts Slide 1 (Her)', 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=2070&auto=format&fit=crop'),
('hero_gift_2', 'Hero Slider', 'Gifts Slide 2 (Hampers)', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2070&auto=format&fit=crop'),

-- Banners
('banner_bestseller_gifts', 'Banners', 'Bestseller Gifts Banner', 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=2000&auto=format&fit=crop'),
('banner_bestseller_jewel', 'Banners', 'Bestseller Jewellery Banner', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2000&auto=format&fit=crop'),
('banner_buying_guide', 'Banners', 'Buying Guide Banner', 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop'),
('banner_perfect_gift', 'Banners', 'Perfect Gift Banner', 'https://cdn3d.iconscout.com/3d/premium/thumb/gift-box-4392087-3652564.png'),

-- Calendar Events
('cal_val_day', 'Celebrations', 'Valentines Day', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop'),
('cal_ugadi', 'Celebrations', 'Ugadi / Gudi Padwa', 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=600&auto=format&fit=crop'),
('cal_akshaya', 'Celebrations', 'Akshaya Tritiya', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop'),
('cal_wedding', 'Celebrations', 'Wedding Season', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop'),
('cal_karwa', 'Celebrations', 'Karwa Chauth', 'https://images.unsplash.com/photo-1602751584552-8ba42d523f17?q=80&w=600&auto=format&fit=crop'),
('cal_womens', 'Celebrations', 'Womens Day', 'https://images.unsplash.com/photo-1556228552-523de5147bb6?q=80&w=600&auto=format&fit=crop'),
('cal_holi', 'Celebrations', 'Holi', 'https://images.unsplash.com/photo-1516641396056-0ce60a85d49f?q=80&w=600&auto=format&fit=crop'),
('cal_mothers', 'Celebrations', 'Mothers Day', 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop')

ON CONFLICT (key) DO NOTHING;
