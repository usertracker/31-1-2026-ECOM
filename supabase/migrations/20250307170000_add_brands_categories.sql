-- Add Categories and Brands to site_assets
INSERT INTO site_assets (key, value, label, section, type) VALUES
-- Categories
('cat_necklaces', 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=400&auto=format&fit=crop', 'Necklaces', 'Categories', 'image'),
('cat_earrings', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop', 'Earrings', 'Categories', 'image'),
('cat_rings', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400&auto=format&fit=crop', 'Rings', 'Categories', 'image'),
('cat_bracelets', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop', 'Bracelets', 'Categories', 'image'),
('cat_watches', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=400&auto=format&fit=crop', 'Watches', 'Categories', 'image'),
('cat_gift_sets', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop', 'Gift Sets', 'Categories', 'image'),
('cat_personalized', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400&auto=format&fit=crop', 'Personalized', 'Categories', 'image'),
('cat_gold', 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=400&auto=format&fit=crop', 'Gold', 'Categories', 'image'),
('cat_silver', 'https://images.unsplash.com/photo-1576159985223-45f8e63964f4?q=80&w=400&auto=format&fit=crop', 'Silver', 'Categories', 'image'),

-- Brands
('brand_tiffany', 'https://logo.clearbit.com/tiffany.com', 'Tiffany & Co.', 'Brands', 'image'),
('brand_pandora', 'https://logo.clearbit.com/pandora.net', 'Pandora', 'Brands', 'image'),
('brand_swarovski', 'https://logo.clearbit.com/swarovski.com', 'Swarovski', 'Brands', 'image'),
('brand_cartier', 'https://logo.clearbit.com/cartier.com', 'Cartier', 'Brands', 'image'),
('brand_tanishq', 'https://logo.clearbit.com/tanishq.co.in', 'Tanishq', 'Brands', 'image'),
('brand_caratlane', 'https://logo.clearbit.com/caratlane.com', 'CaratLane', 'Brands', 'image'),
('brand_giva', 'https://logo.clearbit.com/giva.co', 'Giva', 'Brands', 'image'),
('brand_bluestone', 'https://logo.clearbit.com/bluestone.com', 'Bluestone', 'Brands', 'image'),
('brand_malabar', 'https://logo.clearbit.com/malabargoldanddiamonds.com', 'Malabar', 'Brands', 'image'),
('brand_kalyan', 'https://logo.clearbit.com/kalyanjewellers.net', 'Kalyan', 'Brands', 'image')
ON CONFLICT (key) DO NOTHING;
