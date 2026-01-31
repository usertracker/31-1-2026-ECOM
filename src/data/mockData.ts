export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  stock: boolean;
  stockCount?: number;
  description: string;
  specs: string[];
  sellerId?: string;
  isBestSeller?: boolean;
  createdAt?: string;
}

export const CATEGORIES = [
  { id: '1', name: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=400&auto=format&fit=crop' },
  { id: '2', name: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop' },
  { id: '3', name: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400&auto=format&fit=crop' },
  { id: '4', name: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop' },
  { id: '5', name: 'Watches', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=400&auto=format&fit=crop' },
  { id: '6', name: 'Gift Sets', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop' },
  { id: '7', name: 'Personalized', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400&auto=format&fit=crop' },
  { id: '8', name: 'Gold', image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=400&auto=format&fit=crop' },
  { id: '9', name: 'Silver', image: 'https://images.unsplash.com/photo-1576159985223-45f8e63964f4?q=80&w=400&auto=format&fit=crop' },
];

export const BRANDS = [
  { id: '1', name: 'Tiffany & Co.', image: 'https://logo.clearbit.com/tiffany.com' },
  { id: '2', name: 'Pandora', image: 'https://logo.clearbit.com/pandora.net' },
  { id: '3', name: 'Swarovski', image: 'https://logo.clearbit.com/swarovski.com' },
  { id: '4', name: 'Cartier', image: 'https://logo.clearbit.com/cartier.com' },
  { id: '5', name: 'Tanishq', image: 'https://logo.clearbit.com/tanishq.co.in' },
  { id: '6', name: 'CaratLane', image: 'https://logo.clearbit.com/caratlane.com' },
  { id: '7', name: 'Giva', image: 'https://logo.clearbit.com/giva.co' },
  { id: '8', name: 'Bluestone', image: 'https://logo.clearbit.com/bluestone.com' },
  { id: '9', name: 'Malabar', image: 'https://logo.clearbit.com/malabargoldanddiamonds.com' },
  { id: '10', name: 'Kalyan', image: 'https://logo.clearbit.com/kalyanjewellers.net' },
];

// --- DEAL OF THE DAY PRODUCTS ---
export const DEAL_PRODUCTS: Product[] = [
  {
    id: 'deal1',
    name: 'Diamond Stud Earrings',
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    price: 12999,
    originalPrice: 24999,
    discount: 48,
    rating: 4.8,
    reviews: 156,
    stock: true,
    stockCount: 3,
    description: 'Classic solitary diamond stud earrings set in 14K white gold. The perfect accessory for adding a touch of elegance to any outfit, day or night.',
    specs: ['Metal: 14K White Gold', 'Stone: Diamond (0.25ct)', 'Clarity: VS2', 'Backing: Screw Back'],
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop'],
    sellerId: 'seller_123'
  },
  {
    id: 'deal2',
    name: 'Gold Plated Bangle Set',
    category: 'Gold',
    image: 'https://images.unsplash.com/photo-1596944924616-b0e1216e257e?q=80&w=800&auto=format&fit=crop',
    price: 2499,
    originalPrice: 4999,
    discount: 50,
    rating: 4.6,
    reviews: 89,
    stock: true,
    stockCount: 15,
    description: 'A set of 4 intricately designed gold-plated bangles. Traditional craftsmanship meets modern style.',
    specs: ['Material: Brass Alloy', 'Plating: 22K Gold', 'Size: 2.4, 2.6, 2.8', 'Set of: 4'],
    images: ['https://images.unsplash.com/photo-1596944924616-b0e1216e257e?q=80&w=800&auto=format&fit=crop'],
    sellerId: 'other_seller'
  },
  {
    id: 'deal3',
    name: 'Silver Charm Bracelet',
    category: 'Bracelets',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
    price: 3999,
    originalPrice: 6999,
    discount: 42,
    rating: 4.7,
    reviews: 210,
    stock: true,
    stockCount: 8,
    description: 'Sterling silver chain bracelet with assorted lucky charms. A thoughtful gift for yourself or a loved one.',
    specs: ['Material: 925 Sterling Silver', 'Length: Adjustable', 'Charms: 5 included'],
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop'],
    sellerId: 'seller_123'
  },
  {
    id: 'deal4',
    name: 'Vintage Pocket Watch',
    category: 'Watches',
    image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=800&auto=format&fit=crop',
    price: 5999,
    originalPrice: 12999,
    discount: 53,
    rating: 4.9,
    reviews: 45,
    stock: true,
    stockCount: 2,
    description: 'Antique style mechanical pocket watch with a visible gear mechanism and bronze finish.',
    specs: ['Movement: Mechanical Hand-wind', 'Case Material: Bronze Alloy', 'Chain Length: 30cm'],
    images: ['https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=800&auto=format&fit=crop'],
    sellerId: 'other_seller'
  },
  {
    id: 'deal5',
    name: 'Crystal Ring Set',
    category: 'Rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
    price: 1999,
    originalPrice: 3999,
    discount: 50,
    rating: 4.5,
    reviews: 320,
    stock: true,
    stockCount: 20,
    description: 'Set of 3 stackable rings featuring high-quality cubic zirconia crystals.',
    specs: ['Material: Silver Plated', 'Stones: Cubic Zirconia', 'Style: Stackable'],
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop'],
    sellerId: 'seller_123'
  }
];

// Occasion Specific Products
export const OCCASION_PRODUCTS: Product[] = [
  // --- JEWELLERY ---
  
  // New Year (j_ny)
  { id: 'j_ny_1', name: 'Infinity Heart Diamond Necklace', category: 'Necklaces', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80', price: 12999, originalPrice: 25000, discount: 48, rating: 4.9, isBestSeller: true, stock: true, description: 'Celebrate new beginnings with this infinite heart design.', specs: ['Material: Sterling Silver', 'Gem: Zirconia'], images: [], reviews: 45 },
  { id: 'j_ny_2', name: 'Statement Party Wear Earrings', category: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80', price: 4599, originalPrice: 8999, discount: 48, rating: 4.7, isBestSeller: false, stock: true, description: 'Bold earrings to make a statement at any party.', specs: ['Style: Dangler', 'Material: Alloy'], images: [], reviews: 32 },
  { id: 'j_ny_3', name: 'Layered Gold Chain Necklace', category: 'Necklaces', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop', price: 12499, originalPrice: 18000, discount: 30, rating: 4.6, isBestSeller: true, stock: true, description: 'Trendy layered chains for a modern look.', specs: ['Material: 18K Gold Plated', 'Layers: 3'], images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop'], reviews: 88 },
  { id: 'j_ny_4', name: 'Crystal Drop Dangler Earrings', category: 'Earrings', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=600&auto=format&fit=crop', price: 2999, originalPrice: 5999, discount: 50, rating: 4.5, isBestSeller: false, stock: true, description: 'Elegant crystal drops that catch the light.', specs: ['Stone: Crystal', 'Metal: Silver'], images: [], reviews: 21 },
  { id: 'j_ny_5', name: 'Rose Gold Party Bracelet', category: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80', price: 6999, originalPrice: 9999, discount: 30, rating: 4.9, isBestSeller: true, stock: true, description: 'A delicate rose gold bracelet for festive occasions.', specs: ['Material: Rose Gold Plated', 'Size: Adjustable'], images: [], reviews: 56 },
  { id: 'j_ny_6', name: 'Midnight Blue Stone Ring', category: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop', price: 3499, originalPrice: 6000, discount: 42, rating: 4.6, stock: true, description: 'Deep blue stone ring for evening wear.', specs: ['Stone: Sapphire Simulant', 'Metal: Silver'], images: [], reviews: 18 },

  // Birthday (j_bd)
  { id: 'j_bd_1', name: 'Crystal Birthstone Pendant', category: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=600&auto=format&fit=crop', price: 2499, originalPrice: 4999, discount: 50, rating: 4.7, stock: true, description: 'Personalized birthstone pendant to celebrate their special day.', specs: ['Material: Silver', 'Stone: Crystal'], images: [], reviews: 20 },
  { id: 'j_bd_2', name: 'Dainty Gold Chain Bracelet', category: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop', price: 5999, originalPrice: 8000, discount: 25, rating: 4.5, stock: true, description: 'Minimalist gold chain perfect for daily wear.', specs: ['Material: 14K Gold', 'Length: 7 inch'], images: [], reviews: 15 },
  { id: 'j_bd_3', name: 'Stud Earrings Set', category: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop', price: 1299, originalPrice: 2500, discount: 48, rating: 4.6, stock: true, description: 'Set of 3 stud earrings for versatile styling.', specs: ['Material: Alloy', 'Set: 3 Pairs'], images: [], reviews: 42 },
  { id: 'j_bd_4', name: 'Zodiac Sign Ring', category: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop', price: 3499, originalPrice: 5000, discount: 30, rating: 4.8, stock: true, description: 'Customizable zodiac sign ring.', specs: ['Material: Sterling Silver', 'Size: Adjustable'], images: [], reviews: 33 },
  { id: 'j_bd_5', name: 'Initial Charm Necklace', category: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=600&auto=format&fit=crop', price: 1999, originalPrice: 3500, discount: 42, rating: 4.7, stock: true, description: 'Personalized initial charm necklace.', specs: ['Material: Gold Plated', 'Charm: Letter'], images: [], reviews: 50 },
  { id: 'j_bd_6', name: 'Pearl Drop Earrings', category: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop', price: 2299, originalPrice: 4000, discount: 42, rating: 4.5, stock: true, description: 'Classic pearl drop earrings.', specs: ['Stone: Freshwater Pearl', 'Metal: Silver'], images: [], reviews: 25 },

  // Anniversary (j_an)
  { id: 'j_an_1', name: 'Diamond Eternity Band', category: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop', price: 15999, originalPrice: 30000, discount: 46, rating: 4.9, stock: true, description: 'Symbol of everlasting love with continuous diamonds.', specs: ['Material: 18K White Gold', 'Stone: Diamond'], images: [], reviews: 60 },
  { id: 'j_an_2', name: 'Couple Promise Rings', category: 'Rings', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop', price: 4999, originalPrice: 8000, discount: 37, rating: 4.7, stock: true, description: 'Matching set of rings for him and her.', specs: ['Material: Silver', 'Set: 2 Rings'], images: [], reviews: 85 },
  { id: 'j_an_3', name: 'Solitaire Pendant Necklace', category: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=600&auto=format&fit=crop', price: 8999, originalPrice: 15000, discount: 40, rating: 4.8, stock: true, description: 'Classic solitaire pendant that says "I love you".', specs: ['Material: Gold Plated', 'Stone: Moissanite'], images: [], reviews: 40 },
  { id: 'j_an_4', name: 'Luxury Watch for Him', category: 'Watches', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop', price: 12999, originalPrice: 20000, discount: 35, rating: 4.9, stock: true, description: 'Elegant timepiece for a special anniversary gift.', specs: ['Movement: Quartz', 'Strap: Leather'], images: [], reviews: 25 },
  { id: 'j_an_5', name: 'Platinum Love Bands', category: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop', price: 25000, originalPrice: 35000, discount: 28, rating: 4.9, stock: true, description: 'Pure platinum bands for the perfect couple.', specs: ['Material: Platinum', 'Weight: 6g'], images: [], reviews: 12 },
  { id: 'j_an_6', name: 'Ruby Anniversary Pendant', category: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=600&auto=format&fit=crop', price: 7500, originalPrice: 12000, discount: 37, rating: 4.7, stock: true, description: 'Celebrate milestones with a ruby pendant.', specs: ['Stone: Ruby', 'Chain: Gold'], images: [], reviews: 30 },

  // Wedding (j_wd)
  { id: 'j_wd_1', name: 'Traditional Gold Mangalsutra', category: 'Gold', image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=600&auto=format&fit=crop', price: 45000, originalPrice: 50000, discount: 10, rating: 4.8, stock: true, description: 'Intricate gold mangalsutra design for the bride.', specs: ['Material: 22K Gold', 'Weight: 8g'], images: [], reviews: 40 },
  { id: 'j_wd_2', name: 'Bridal Choker Set', category: 'Necklaces', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop', price: 25999, originalPrice: 40000, discount: 35, rating: 4.9, stock: true, description: 'Heavy bridal choker set with matching earrings.', specs: ['Material: Gold Plated', 'Stone: Kundan'], images: [], reviews: 55 },
  { id: 'j_wd_3', name: 'Diamond Wedding Band', category: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop', price: 35000, originalPrice: 45000, discount: 22, rating: 4.8, stock: true, description: 'Elegant diamond band for the groom.', specs: ['Material: Platinum', 'Stone: Diamond'], images: [], reviews: 18 },
  { id: 'j_wd_4', name: 'Temple Jewellery Set', category: 'Gold', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop', price: 18999, originalPrice: 25000, discount: 24, rating: 4.7, stock: true, description: 'Traditional temple jewellery for wedding functions.', specs: ['Material: Gold Plated', 'Design: Temple'], images: [], reviews: 30 },
  { id: 'j_wd_5', name: 'Kundan Maang Tikka', category: 'Gold', image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=600&auto=format&fit=crop', price: 4500, originalPrice: 8000, discount: 43, rating: 4.6, stock: true, description: 'Beautiful headpiece for the bride.', specs: ['Stone: Kundan', 'Plating: Gold'], images: [], reviews: 22 },
  { id: 'j_wd_6', name: 'Heavy Gold Bangle Set', category: 'Gold', image: 'https://images.unsplash.com/photo-1596944924616-b0e1216e257e?q=80&w=600&auto=format&fit=crop', price: 55000, originalPrice: 60000, discount: 8, rating: 4.9, stock: true, description: 'Set of 4 heavy gold bangles.', specs: ['Material: 22K Gold', 'Weight: 20g'], images: [], reviews: 15 },

  // Romance (j_rm)
  { id: 'j_rm_1', name: 'Rose Gold Heart Ring', category: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop', price: 8999, originalPrice: 12000, discount: 25, rating: 4.8, stock: true, description: 'Romantic rose gold ring with a heart motif.', specs: ['Material: 14K Rose Gold', 'Stone: Diamond'], images: [], reviews: 55 },
  { id: 'j_rm_2', name: 'Love Knot Bracelet', category: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop', price: 4500, originalPrice: 7000, discount: 35, rating: 4.6, stock: true, description: 'Symbolizing an unbreakable bond.', specs: ['Material: Silver', 'Design: Knot'], images: [], reviews: 28 },
  { id: 'j_rm_3', name: 'Infinity Pendant', category: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=600&auto=format&fit=crop', price: 3200, originalPrice: 5000, discount: 36, rating: 4.7, stock: true, description: 'Infinite love pendant necklace.', specs: ['Material: Sterling Silver', 'Chain: 18 inch'], images: [], reviews: 45 },
  { id: 'j_rm_4', name: 'Heart Stud Earrings', category: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop', price: 1800, originalPrice: 3000, discount: 40, rating: 4.5, stock: true, description: 'Cute heart-shaped studs.', specs: ['Material: Gold Plated', 'Backing: Push Back'], images: [], reviews: 60 },
  { id: 'j_rm_5', name: 'Couple Name Necklace', category: 'Personalized', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=600&auto=format&fit=crop', price: 2500, originalPrice: 4000, discount: 37, rating: 4.8, stock: true, description: 'Custom necklace with two names.', specs: ['Material: Silver', 'Custom: Names'], images: [], reviews: 70 },
  { id: 'j_rm_6', name: 'Rose Quartz Ring', category: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop', price: 4200, originalPrice: 6000, discount: 30, rating: 4.6, stock: true, description: 'Ring with the stone of love.', specs: ['Stone: Rose Quartz', 'Metal: Rose Gold Plated'], images: [], reviews: 35 },

  // --- GIFTS ---

  // New Year (g_ny)
  { id: 'g_ny_1', name: 'Premium Diary & Pen Set', category: 'Gift Sets', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop', price: 999, originalPrice: 1999, discount: 50, rating: 4.5, stock: true, description: 'Start the year right with this executive set.', specs: ['Includes: Diary, Pen', 'Material: Leatherette'], images: [], reviews: 10 },
  { id: 'g_ny_2', name: 'Motivational Desk Calendar', category: 'Gift Sets', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=600&auto=format&fit=crop', price: 499, originalPrice: 800, discount: 37, rating: 4.4, stock: true, description: 'Daily inspiration for the new year.', specs: ['Type: Desk Calendar', 'Year: 2025'], images: [], reviews: 25 },
  { id: 'g_ny_3', name: 'Gourmet Snack Hamper', category: 'Gift Sets', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop', price: 1599, originalPrice: 2500, discount: 36, rating: 4.7, stock: true, description: 'Assorted gourmet snacks for the party.', specs: ['Contents: Chips, Nuts, Chocolates', 'Weight: 1kg'], images: [], reviews: 40 },
  { id: 'g_ny_4', name: 'Sparkling Juice Set', category: 'Gift Sets', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop', price: 1200, originalPrice: 1800, discount: 33, rating: 4.6, stock: true, description: 'Non-alcoholic sparkling juice for celebration.', specs: ['Flavor: Apple, Grape', 'Bottles: 2'], images: [], reviews: 15 },
  { id: 'g_ny_5', name: 'Wellness Tea Kit', category: 'Gift Sets', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop', price: 899, originalPrice: 1500, discount: 40, rating: 4.8, stock: true, description: 'Start the year healthy with herbal teas.', specs: ['Flavors: Green, Chamomile', 'Box: Wooden'], images: [], reviews: 30 },
  { id: 'g_ny_6', name: 'Desk Organizer', category: 'Gift Sets', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=600&auto=format&fit=crop', price: 699, originalPrice: 1000, discount: 30, rating: 4.5, stock: true, description: 'Keep the workspace tidy.', specs: ['Material: Wood', 'Compartments: 4'], images: [], reviews: 20 },

  // Birthday (g_bd)
  { id: 'g_bd_1', name: 'Assorted Chocolate Box', category: 'Gift Sets', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop', price: 1499, originalPrice: 2000, discount: 25, rating: 4.8, stock: true, description: 'Premium assorted chocolates.', specs: ['Weight: 500g', 'Type: Truffles'], images: [], reviews: 100 },
  { id: 'g_bd_2', name: 'Personalized Photo Mug', category: 'Personalized', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop', price: 399, originalPrice: 699, discount: 42, rating: 4.5, stock: true, description: 'Custom printed mug with your photo.', specs: ['Material: Ceramic', 'Capacity: 350ml'], images: [], reviews: 150 },
  { id: 'g_bd_3', name: 'Soft Teddy Bear', category: 'Gift Sets', image: 'https://images.unsplash.com/photo-1556228552-523de5147bb6?q=80&w=600&auto=format&fit=crop', price: 899, originalPrice: 1200, discount: 25, rating: 4.7, stock: true, description: 'Cuddly soft toy for loved ones.', specs: ['Size: 12 inch', 'Color: Brown'], images: [], reviews: 60 },
  { id: 'g_bd_4', name: 'Birthday Cake Combo', category: 'Cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop', price: 999, originalPrice: 1500, discount: 33, rating: 4.6, stock: true, description: 'Chocolate cake with flowers.', specs: ['Weight: 500g', 'Flavor: Chocolate'], images: [], reviews: 80 },
  { id: 'g_bd_5', name: 'Perfume Gift Set', category: 'Gift Sets', image: 'https://images.unsplash.com/photo-1594035910387-fea477942698?q=80&w=600&auto=format&fit=crop', price: 2499, originalPrice: 4000, discount: 37, rating: 4.8, stock: true, description: 'Luxury perfume set for him/her.', specs: ['Quantity: 50ml x 2', 'Scent: Floral/Woody'], images: [], reviews: 45 },
  { id: 'g_bd_6', name: 'Indoor Plant Pot', category: 'Plants', image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?q=80&w=600&auto=format&fit=crop', price: 599, originalPrice: 999, discount: 40, rating: 4.5, stock: true, description: 'Low maintenance indoor plant.', specs: ['Plant: Snake Plant', 'Pot: Ceramic'], images: [], reviews: 30 },

  // Anniversary (g_an)
  { id: 'g_an_1', name: 'Couple Watch Set', category: 'Watches', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop', price: 8999, originalPrice: 15000, discount: 40, rating: 4.7, stock: true, description: 'Matching watches for the perfect couple.', specs: ['Brand: Titan', 'Warranty: 1 Year'], images: [], reviews: 30 },
  { id: 'g_an_2', name: 'Personalized Photo Frame', category: 'Personalized', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=600&auto=format&fit=crop', price: 799, originalPrice: 1200, discount: 33, rating: 4.5, stock: true, description: 'Wooden frame with your memory.', specs: ['Material: Wood', 'Size: 8x10'], images: [], reviews: 45 },
  { id: 'g_an_3', name: 'Premium Wine Set', category: 'Gift Sets', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop', price: 4500, originalPrice: 6000, discount: 25, rating: 4.8, stock: true, description: 'Fine wine with glasses.', specs: ['Type: Red Wine', 'Glasses: 2'], images: [], reviews: 20 },
  { id: 'g_an_4', name: 'Mr. & Mrs. Coffee Mugs', category: 'Gift Sets', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop', price: 699, originalPrice: 999, discount: 30, rating: 4.6, stock: true, description: 'Matching mugs for the couple.', specs: ['Set: 2 Mugs', 'Material: Ceramic'], images: [], reviews: 55 },
  { id: 'g_an_5', name: 'Spa Hamper', category: 'Gift Sets', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop', price: 2999, originalPrice: 4500, discount: 33, rating: 4.7, stock: true, description: 'Relaxing spa kit for two.', specs: ['Contents: Oils, Candles, Towels'], images: [], reviews: 28 },
  { id: 'g_an_6', name: 'Custom Star Map', category: 'Personalized', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=600&auto=format&fit=crop', price: 1499, originalPrice: 2500, discount: 40, rating: 4.9, stock: true, description: 'Star map of your special date.', specs: ['Size: A3', 'Frame: Black'], images: [], reviews: 40 },

  // Wedding (g_wd)
  { id: 'g_wd_1', name: 'Luxury Perfume Set', category: 'Gift Sets', image: 'https://images.unsplash.com/photo-1594035910387-fea477942698?q=80&w=600&auto=format&fit=crop', price: 3999, originalPrice: 6000, discount: 33, rating: 4.6, stock: true, description: 'His and Hers fragrance set.', specs: ['Brand: Skinn', 'Quantity: 100ml x 2'], images: [], reviews: 25 },
  { id: 'g_wd_2', name: 'Dinner Set', category: 'Home', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop', price: 5999, originalPrice: 10000, discount: 40, rating: 4.7, stock: true, description: 'Bone china dinner set for new home.', specs: ['Pieces: 32', 'Material: Bone China'], images: [], reviews: 15 },
  { id: 'g_wd_3', name: 'Home Decor Vase', category: 'Home', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=600&auto=format&fit=crop', price: 1299, originalPrice: 2500, discount: 48, rating: 4.5, stock: true, description: 'Elegant ceramic vase.', specs: ['Height: 12 inch', 'Color: White'], images: [], reviews: 35 },
  { id: 'g_wd_4', name: 'Bed Sheet Set', category: 'Home', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop', price: 1999, originalPrice: 3500, discount: 42, rating: 4.4, stock: true, description: 'Premium cotton bedsheets.', specs: ['Size: King', 'Thread Count: 300'], images: [], reviews: 50 },
  { id: 'g_wd_5', name: 'Silver Coin Gift', category: 'Silver', image: 'https://images.unsplash.com/photo-1576159985223-45f8e63964f4?q=80&w=600&auto=format&fit=crop', price: 2500, originalPrice: 3000, discount: 16, rating: 4.8, stock: true, description: 'Pure silver coin for luck.', specs: ['Weight: 20g', 'Purity: 999'], images: [], reviews: 60 },
  { id: 'g_wd_6', name: 'Couple Bathrobes', category: 'Gift Sets', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop', price: 2999, originalPrice: 5000, discount: 40, rating: 4.6, stock: true, description: 'Matching luxury bathrobes.', specs: ['Material: Cotton', 'Size: Free Size'], images: [], reviews: 22 },

  // Romance (g_rm)
  { id: 'g_rm_1', name: 'Red Roses Bouquet', category: 'Flowers', image: 'https://images.unsplash.com/photo-1563241527-3004b7be025f?q=80&w=600&auto=format&fit=crop', price: 999, originalPrice: 1500, discount: 33, rating: 4.9, stock: true, description: 'Fresh bouquet of 12 red roses.', specs: ['Flowers: 12 Roses', 'Wrapping: Red Paper'], images: [], reviews: 80 },
  { id: 'g_rm_2', name: 'Personalized LED Lamp', category: 'Personalized', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop', price: 1299, originalPrice: 2000, discount: 35, rating: 4.7, stock: true, description: '3D illusion lamp with name.', specs: ['Light: Warm White', 'Power: USB'], images: [], reviews: 65 },
  { id: 'g_rm_3', name: 'Love Letters Jar', category: 'Gift Sets', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop', price: 599, originalPrice: 999, discount: 40, rating: 4.8, stock: true, description: 'Jar filled with romantic messages.', specs: ['Messages: 50', 'Material: Glass Jar'], images: [], reviews: 90 },
  { id: 'g_rm_4', name: 'Heart Shape Cushion', category: 'Gift Sets', image: 'https://images.unsplash.com/photo-1556228552-523de5147bb6?q=80&w=600&auto=format&fit=crop', price: 499, originalPrice: 800, discount: 37, rating: 4.5, stock: true, description: 'Soft plush cushion.', specs: ['Shape: Heart', 'Color: Red'], images: [], reviews: 40 },
  { id: 'g_rm_5', name: 'Chocolate & Teddy Combo', category: 'Gift Sets', image: 'https://images.unsplash.com/photo-1599599810694-b5b3730bf7c5?q=80&w=600&auto=format&fit=crop', price: 1499, originalPrice: 2200, discount: 32, rating: 4.8, stock: true, description: 'Sweet treats with a cute bear.', specs: ['Chocolates: Ferrero', 'Teddy: 6 inch'], images: [], reviews: 55 },
  { id: 'g_rm_6', name: 'Couple Keychain Set', category: 'Personalized', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop', price: 399, originalPrice: 699, discount: 42, rating: 4.6, stock: true, description: 'Matching keychains for couples.', specs: ['Material: Metal', 'Design: Puzzle Piece'], images: [], reviews: 75 },
];

// Initial Products Data with Seller IDs
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'jewel_ring_special', 
    name: '18K Rose Gold Diamond Solitaire Ring',
    category: 'Rings',
    price: 45999,
    originalPrice: 59999,
    discount: 23,
    rating: 4.9,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598560917505-59c367dfdacf?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589674728776-0d53b12e6981?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617038220319-88af152861de?q=80&w=800&auto=format&fit=crop',
    ],
    stock: true,
    stockCount: 1,
    description: 'Elegant solitaire ring crafted in 18K rose gold, perfect for engagements or anniversaries.',
    specs: ['Material: 18K Rose Gold', 'Stone: 0.5ct Diamond', 'Weight: 3.5g', 'Certification: SGL'],
    sellerId: 'seller_123'
  },
  {
    id: '2',
    name: 'Swarovski Crystal Pendant Necklace',
    category: 'Necklaces',
    price: 8499,
    originalPrice: 12999,
    discount: 35,
    rating: 4.7,
    reviews: 340,
    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop'
    ],
    stock: true,
    stockCount: 5,
    description: 'A stunning pendant featuring a large blue Swarovski crystal surrounded by smaller stones.',
    specs: ['Chain Length: 45cm', 'Material: Rhodium Plated', 'Stone: Swarovski Crystal'],
    sellerId: 'seller_123'
  },
  // ... other products
];
