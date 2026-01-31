import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gem, Watch, Gift, Heart, Crown, Sparkles, Star, ShoppingBag } from 'lucide-react';

const CATEGORIES = [
  {
    title: "Diamond Jewelry",
    icon: <Gem size={20} />,
    desc: "Explore our exquisite collection of certified diamond rings, earrings, and pendants. Perfect for engagements and special occasions.",
    query: "Rings"
  },
  {
    title: "Luxury Watches",
    icon: <Watch size={20} />,
    desc: "Timeless timepieces from top international brands. Discover classic, sport, and luxury watches for men and women.",
    query: "Watches"
  },
  {
    title: "Personalized Gifts",
    icon: <Gift size={20} />,
    desc: "Make it personal with engraved jewelry. Name necklaces, initial pendants, and custom bracelets for your loved ones.",
    query: "Personalized"
  },
  {
    title: "Wedding Collection",
    icon: <Heart size={20} />,
    desc: "Celebrate your love with our bridal sets, mangalsutras, and couple rings. Crafted to perfection for your big day.",
    query: "Gold"
  },
  {
    title: "Gold & Silver",
    icon: <Crown size={20} />,
    desc: "Invest in purity with our range of 22K Gold and 925 Sterling Silver jewelry. Traditional and modern designs available.",
    query: "Gold"
  },
  {
    title: "Fashion Jewelry",
    icon: <Sparkles size={20} />,
    desc: "Trendy and affordable fashion jewelry to style your everyday look. Statement earrings, layered necklaces, and more.",
    query: "Necklaces"
  },
  {
    title: "Gemstones",
    icon: <Star size={20} />,
    desc: "Vibrant gemstone jewelry featuring rubies, emeralds, sapphires, and pearls. Add a splash of color to your collection.",
    query: "Earrings"
  },
  {
    title: "Gift Sets",
    icon: <ShoppingBag size={20} />,
    desc: "Curated gift boxes containing matching jewelry sets. The perfect ready-to-give present for birthdays and anniversaries.",
    query: "Gift Sets"
  }
];

export const PopularCategories = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white py-10 border-t border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4">
        
        <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1 font-serif">Explore Our Collections</h2>
            <h3 className="text-sm font-bold text-gray-500 mb-4">Handpicked Categories for Every Occasion</h3>
            <hr className="border-gray-200 mb-6" />
            
            <p className="text-sm text-gray-600 leading-relaxed max-w-6xl">
            Discover the finest jewelry and gifts at FlipZon Jewels. From certified diamonds to handcrafted gold, our collection is designed to celebrate life's precious moments. Shop by category to find exactly what you're looking for.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {CATEGORIES.map((cat, idx) => (
            <div key={idx} className="group flex flex-col h-full">
              <div className="flex justify-between items-start border-b border-gray-200 pb-2 mb-3">
                <h4 
                  onClick={() => navigate(`/search?category=${encodeURIComponent(cat.query)}`)}
                  className="font-bold text-gray-800 text-sm cursor-pointer hover:text-[#d4af37] transition-colors font-serif"
                >
                  {cat.title}
                </h4>
                <div className="text-[#d4af37]">
                  {cat.icon}
                </div>
              </div>
              
              <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-4 flex-1 text-justify">
                {cat.desc}
              </p>
              
              <button 
                onClick={() => navigate(`/search?category=${encodeURIComponent(cat.query)}`)}
                className="text-xs font-bold text-gray-900 underline hover:text-[#d4af37] w-fit"
              >
                View Collection
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
