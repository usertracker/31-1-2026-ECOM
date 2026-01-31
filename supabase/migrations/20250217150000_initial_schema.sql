/*
  # Initial Schema Setup
  Creates tables for Users, Sellers, Products, Orders, and OTPs.
  Seeds initial product data.

  ## Query Description:
  1. Creates tables required by the application logic in src/services/db.ts
  2. Inserts initial product data from src/data/mockData.ts to ensure the app has content on first load.
  
  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "High"
  - Requires-Backup: false
  - Reversible: true
  
  ## Structure Details:
  - public.otps
  - public.users
  - public.sellers
  - public.products
  - public.orders
*/

-- 1. Create OTPs table
CREATE TABLE IF NOT EXISTS public.otps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Users table (Custom implementation)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    email TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create Sellers table
CREATE TABLE IF NOT EXISTS public.sellers (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    password TEXT,
    store_name TEXT,
    gstin TEXT,
    pan TEXT,
    bank_account TEXT,
    ifsc TEXT,
    status TEXT DEFAULT 'pending',
    role TEXT DEFAULT 'seller',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Create Products table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    price NUMERIC,
    original_price NUMERIC,
    discount NUMERIC,
    rating NUMERIC,
    reviews NUMERIC,
    image TEXT,
    images TEXT[],
    stock BOOLEAN DEFAULT true,
    description TEXT,
    specs TEXT[],
    seller_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Create Orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    items JSONB,
    total NUMERIC,
    status TEXT DEFAULT 'Processing',
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Seed Initial Data (Upsert to prevent duplicates)
INSERT INTO public.products (id, name, category, price, original_price, discount, rating, reviews, image, images, stock, description, specs, seller_id)
VALUES 
(
  '1', 
  'Apple iPhone 15 (Black, 128 GB)', 
  'Mobiles', 
  66999, 
  79900, 
  16, 
  4.6, 
  3400, 
  'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop'], 
  true, 
  'Experience the dynamic island and 48MP camera.', 
  ARRAY['128 GB ROM', '15.49 cm (6.1 inch) Super Retina XDR Display', '48MP + 12MP | 12MP Front Camera', 'A16 Bionic Chip Processor'], 
  'seller_123'
),
(
  '2', 
  'Sony WH-1000XM5 Wireless Headphones', 
  'Electronics', 
  26990, 
  34990, 
  22, 
  4.8, 
  1250, 
  'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop'], 
  true, 
  'Industry leading noise cancellation.', 
  ARRAY['30 Hours Battery Life', 'Touch Control', 'Multipoint Connection'], 
  'seller_123'
),
(
  '3', 
  'Nike Air Jordan 1 High', 
  'Fashion', 
  16995, 
  18995, 
  10, 
  4.7, 
  850, 
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop'], 
  true, 
  'Classic high-top sneakers for everyday wear.', 
  ARRAY['Genuine Leather', 'Rubber Sole', 'High-top design'], 
  'other_seller'
),
(
  '4', 
  'MacBook Air M2 (Midnight)', 
  'Electronics', 
  99900, 
  114900, 
  13, 
  4.9, 
  560, 
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=800&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=800&auto=format&fit=crop'], 
  true, 
  'Supercharged by M2 chip.', 
  ARRAY['8GB Unified Memory', '256GB SSD', '13.6-inch Liquid Retina Display'], 
  'seller_123'
),
(
  '5', 
  'Samsung 55" 4K Smart TV', 
  'Appliances', 
  45990, 
  69900, 
  34, 
  4.4, 
  2100, 
  'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=800&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=800&auto=format&fit=crop'], 
  true, 
  'Crystal 4K processor for lifelike color.', 
  ARRAY['4K Ultra HD (3840 x 2160)', '20 Watts Output', '3 HDMI Ports'], 
  'other_seller'
),
(
  '6', 
  'Modern Sofa Set', 
  'Home', 
  22499, 
  35000, 
  35, 
  4.2, 
  450, 
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop'], 
  true, 
  'Comfortable 3-seater sofa for your living room.', 
  ARRAY['Fabric Upholstery', 'Wooden Frame', '3 Seater'], 
  'other_seller'
),
(
  '7', 
  'Canon EOS R50 Camera', 
  'Electronics', 
  58990, 
  65990, 
  11, 
  4.5, 
  120, 
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop'], 
  false, 
  'Compact mirrorless camera for creators.', 
  ARRAY['24.2 MP', '4K Video', 'RF-S Mount'], 
  'seller_123'
),
(
  '8', 
  'Puma Men Running Shoes', 
  'Fashion', 
  2499, 
  4999, 
  50, 
  4.1, 
  3200, 
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop', 
  ARRAY['https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop'], 
  true, 
  'Lightweight running shoes for daily use.', 
  ARRAY['Mesh Upper', 'EVA Midsole', 'Lace-up'], 
  'other_seller'
)
ON CONFLICT (id) DO NOTHING;
