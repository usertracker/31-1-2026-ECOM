import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useProducts } from '../context/ProductContext';
import { formatPrice } from '../lib/utils';

interface SpecialDealProps {
  mode: 'jewellery' | 'gifts';
}

// Default fallback data
const DEALS = {
  jewellery: {
    id: 'jewel_ring_special', // CHANGED: Unique ID to avoid conflict with iPhone (ID: 1) in DB
    name: '18K Rose Gold Diamond Solitaire Ring',
    price: 45999,
    originalPrice: 59999,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
    description: 'Elegant solitaire ring crafted in 18K rose gold, featuring a stunning 0.5ct certified diamond. The perfect symbol of love for engagements or anniversaries.',
    category: 'Rings'
  },
  gifts: {
    id: 'special-deal-g1',
    name: 'Royal Velvet | Premium Assorted Luxury Hamper | Limited Edition',
    price: 2499,
    originalPrice: 8500,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
    description: 'An exquisite collection of gourmet chocolates, scented candles, and premium bath essentials wrapped in our signature royal velvet box.',
    category: 'Gift Sets'
  }
};

export const SpecialDeal = ({ mode }: SpecialDealProps) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { products } = useProducts();

  // Find the live product from DB to ensure image/price updates are reflected
  const defaultDeal = DEALS[mode];
  const liveProduct = products.find(p => p.id === defaultDeal.id);
  const product = liveProduct || defaultDeal;
  
  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({ hours: 10, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 }; // Reset loop
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const formatTime = (val: number) => val.toString().padStart(2, '0');

  const handleAddToCart = () => {
    // Safe discount calculation
    const discount = (product.originalPrice && product.originalPrice > 0) 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
        : 0;

    addToCart({
      ...product,
      rating: 4.9,
      reviews: 120,
      stock: true,
      discount: discount,
      images: [product.image],
      specs: []
    } as any);
    showToast('Added Special Deal to Cart!', 'success');
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 mb-8 font-sans">
      
      {/* Promo Banner - Reverted to Standard Style */}
      <div className="bg-black text-white text-center py-2 mb-6 rounded-sm font-bold text-sm tracking-widest uppercase">
        Get 10% OFF your first Purchase with Code "TRYNOW"
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Image Section */}
        <div className="md:w-1/2 relative bg-gray-50 h-[300px] md:h-auto group">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover mix-blend-multiply p-6 md:p-8 rounded-[3rem]"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x600?text=No+Image'; }}
          />
          
          {/* Navigation Arrows */}
          <button className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 md:p-2 rounded-full shadow-md hover:bg-white transition opacity-100 md:opacity-0 md:group-hover:opacity-100">
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>
          <button className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 md:p-2 rounded-full shadow-md hover:bg-white transition opacity-100 md:opacity-0 md:group-hover:opacity-100">
            <ChevronRight size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* Right: Details Section */}
        <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center items-center text-center">
          
          {/* Title */}
          <h2 className="text-xl md:text-3xl font-medium text-gray-800 mb-2 leading-tight font-serif max-w-lg">
            {product.name}
          </h2>

          {/* Countdown Timer (Restored) */}
          <div className="flex items-center gap-2 bg-red-50 px-4 py-1.5 rounded-full border border-red-100 mb-4">
            <Clock size={16} className="text-[#e42529]" />
            <span className="text-[#e42529] font-bold font-mono text-sm md:text-base">
              {formatTime(timeLeft.hours)}h : {formatTime(timeLeft.minutes)}m : {formatTime(timeLeft.seconds)}s
            </span>
            <span className="text-xs text-red-400 font-medium uppercase ml-1">Left</span>
          </div>

          {/* Price Row */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-gray-400 line-through text-lg md:text-xl decoration-gray-400">
                {formatPrice(product.originalPrice)}
            </span>
            <span className="text-3xl md:text-4xl font-bold text-[#e42529]">
                {formatPrice(product.price)}
            </span>
          </div>

          <p className="text-xs md:text-sm text-gray-500 mb-6">
            Inclusive of all Taxes Shipping calculated at checkout.
          </p>

          {/* FlipZon / Snapmint Pay Later Box - Mobile Optimized */}
          <div className="relative w-full max-w-md bg-[#f5f5f5] rounded-lg p-3 md:p-4 mb-6 border border-gray-200">
             
             {/* NEW Ribbon */}
             <div className="absolute -top-1.5 -left-1.5 z-10">
                <div className="bg-[#2e7d32] text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 shadow-sm rounded-sm">
                    NEW
                </div>
                <div 
                    className="absolute top-full left-0 w-1.5 h-1.5 bg-[#1b5e20]" 
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
                ></div>
             </div>

             <div className="flex flex-row justify-between items-center gap-2 md:gap-3">
                <div className="text-xs md:text-sm font-medium text-gray-800 text-left leading-tight">
                    or Pay <span className="text-[#7d3f98] font-bold">₹100</span> now, rest later via FlipZon Pay Later
                </div>
                
                <div className="flex flex-col items-end gap-0.5 md:gap-1 flex-shrink-0">
                    <button className="bg-white text-black text-[9px] md:text-[10px] font-bold px-2 py-1 md:px-3 md:py-1.5 rounded shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors uppercase tracking-wide whitespace-nowrap">
                        VIEW PLANS
                    </button>
                    <div className="flex items-center gap-1">
                        <span className="text-[8px] md:text-[10px] text-gray-400">By</span>
                        <img 
                            src="https://assets.snapmint.com/assets/merchant/new_sparify_img.svg" 
                            alt="snapmint" 
                            className="h-2.5 md:h-3" 
                        />
                    </div>
                </div>
             </div>
          </div>

          {/* Add to Cart Button - Black Default, Red Hover */}
          <button 
            onClick={handleAddToCart}
            className="w-full max-w-md bg-black text-white px-8 py-4 rounded-md font-bold text-sm tracking-widest hover:bg-[#e42529] transition-all duration-300 shadow-md uppercase"
          >
            ADD TO CART
          </button>

        </div>
      </div>
    </div>
  );
};
