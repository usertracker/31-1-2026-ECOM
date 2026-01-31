-- Add missing Gift Section assets to Site Content Manager
INSERT INTO site_assets (key, label, value, section, type) VALUES
-- Hero Slider (Gifts)
('hero_gift_1', 'Gift Hero Slide 1', 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=2070&auto=format&fit=crop', 'Hero Slider', 'image'),
('hero_gift_2', 'Gift Hero Slide 2', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2070&auto=format&fit=crop', 'Hero Slider', 'image'),

-- Banners (Gifts)
('banner_perfect_gift', 'Perfect Gift Banner', 'https://cdn3d.iconscout.com/3d/premium/thumb/gift-box-4392087-3652564.png', 'Banners', 'image'),
('banner_buying_guide', 'Buying Guide Banner', 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop', 'Banners', 'image'),
('banner_bestseller_gifts', 'Bestseller Gifts Banner', 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=2000&auto=format&fit=crop', 'Banners', 'image'),

-- Calendar Events (Gifts)
('cal_womens', 'Womens Day Event', 'https://images.unsplash.com/photo-1556228552-523de5147bb6?q=80&w=600&auto=format&fit=crop', 'Calendar', 'image'),
('cal_holi', 'Holi Event', 'https://images.unsplash.com/photo-1516641396056-0ce60a85d49f?q=80&w=600&auto=format&fit=crop', 'Calendar', 'image'),
('cal_mothers', 'Mothers Day Event', 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop', 'Calendar', 'image'),
('cal_rakhi', 'Raksha Bandhan Event', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop', 'Calendar', 'image')

ON CONFLICT (key) DO UPDATE 
SET 
  label = EXCLUDED.label,
  section = EXCLUDED.section;
