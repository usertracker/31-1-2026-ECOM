import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

// Mock Data matching the reference image
const GIFT_ITEMS = [
  {
    id: 'gift_sweets_1',
    name: 'Premium Gourmet Sweets Gift Box',
    image: 'https://images.unsplash.com/photo-1599599810694-b5b3730bf7c5?q=80&w=500&auto=format&fit=crop',
    price: 3275,
    rating: 4.8,
    reviews: 12,
    sameDay: false,
    category: 'Gift Sets'
  },
  {
    id: 'gift_flowers_1',
    name: 'Light Pink Beauty',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be025f?q=80&w=500&auto=format&fit=crop',
    price: 6645,
    rating: 4.5,
    reviews: 1,
    sameDay: true,
    category: 'Flowers'
  },
  {
    id: 'gift_cake_1',
    name: 'Chocolate Cake Petite',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500&auto=format&fit=crop',
    price: 4145,
    rating: 4.4,
    reviews: 9,
    sameDay: true,
    category: 'Cakes'
  },
  {
    id: 'gift_wine_1',
    name: 'Red Wine Combo',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=500&auto=format&fit=crop',
    price: 8245,
    rating: 4.5,
    reviews: 1,
    sameDay: true,
    category: 'Gift Sets'
  },
  {
    id: 'gift_hamper_1',
    name: 'Luxury Spa Hamper',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=500&auto=format&fit=crop',
    price: 5499,
    rating: 4.7,
    reviews: 24,
    sameDay: true,
    category: 'Gift Sets'
  },
  {
    id: 'gift_plant_1',
    name: 'Peace Lily Plant',
    image: 'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?q=80&w=500&auto=format&fit=crop',
    price: 1299,
    rating: 4.6,
    reviews: 45,
    sameDay: true,
    category: 'Plants'
  }
];

// Duplicate items for seamless rotational scroll
const ROTATIONAL_ITEMS = [...GIFT_ITEMS, ...GIFT_ITEMS];

export const MostLovedGifts = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll logic
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (scrollRef.current && !isHovered) {
        const { scrollLeft, scrollWidth } = scrollRef.current;
        const oneSetWidth = scrollWidth / 2;
        
        // If we have scrolled past the first set, reset to start instantly
        // This creates the seamless infinite loop effect
        if (scrollLeft >= oneSetWidth - 10) {
           scrollRef.current.scrollTo({ left: scrollLeft - oneSetWidth, behavior: 'auto' });
           // Small delay to allow the jump to happen before scrolling forward
           window.setTimeout(() => {
             scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
           }, 50);
        } else {
           scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    }, 3000); // 3 seconds

    return () => window.clearInterval(interval);
  }, [isHovered]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      if (direction === 'left') {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handleWishlist = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    const productData = {
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.price * 1.2,
        image: item.image,
        category: item.category,
        rating: item.rating,
        reviews: item.reviews,
        stock: true,
        discount: 0,
        images: [item.image],
        specs: [],
        description: ''
    };

    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id);
      showToast('Removed from Wishlist', 'info');
    } else {
      addToWishlist(productData as any);
      showToast('Added to Wishlist', 'success');
    }
  };

  return (
    <div 
      className="bg-white p-4 mb-3 shadow-sm rounded-sm relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
        <h2 className="text-xl font-bold text-[#172337] font-serif">Most Loved Gifts</h2>
        
        {/* Manual Controls */}
        <div className="hidden md:flex gap-2">
            <button 
                onClick={() => scroll('left')}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
            >
                <ChevronLeft size={18} />
            </button>
            <button 
                onClick={() => scroll('right')}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
            >
                <ChevronRight size={18} />
            </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar gap-4 pb-2 scroll-smooth"
      >
        {ROTATIONAL_ITEMS.map((item, index) => (
          <div 
            // Use index in key because items are duplicated
            key={`${item.id}-${index}`}
            onClick={() => navigate(`/search?q=${encodeURIComponent(item.name)}`)}
            className="min-w-[260px] w-[260px] bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer flex-shrink-0 relative group/card"
          >
            {/* Wishlist Icon */}
            <button 
              onClick={(e) => handleWishlist(e, item)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              <Heart size={18} fill={isInWishlist(item.id) ? "currentColor" : "none"} className={isInWishlist(item.id) ? "text-red-500" : ""} />
            </button>

            {/* Image */}
            <div className="h-[200px] w-full bg-gray-50 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-3">
              <h3 className="text-gray-700 font-medium text-sm mb-2 line-clamp-1" title={item.name}>
                  {item.name}
              </h3>
              
              <div className="text-lg font-bold text-gray-900 mb-2">
                  ₹ {item.price}
              </div>

              <div className="flex items-center justify-between mt-2">
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-0.5 bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                          {item.rating} <Star size={10} fill="currentColor" />
                      </span>
                      <span>({item.reviews})</span>
                  </div>

                  {/* Same Day Delivery Tag */}
                  {item.sameDay && (
                      <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                          <Truck size={12} />
                          <span>Same Day</span>
                      </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
