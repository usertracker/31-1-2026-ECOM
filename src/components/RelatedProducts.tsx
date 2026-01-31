import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../data/mockData';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../lib/utils';
import { useToast } from '../context/ToastContext';

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
  mode?: 'all' | 'similar' | 'special';
}

export const RelatedProducts = ({ currentProductId, category, mode = 'all' }: RelatedProductsProps) => {
  const { products } = useProducts();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();
  
  // Limit to 6 items as requested
  const similarProducts = products
    .filter(p => p.category === category && p.id !== currentProductId)
    .slice(0, 6);

  // Limit to 6 items as requested
  const specialProducts = products
    .filter(p => (p.category === 'Gift Sets' || p.category === 'Personalized' || p.category !== category) && p.id !== currentProductId)
    .slice(0, 6);

  const ProductSection = ({ title, items, type }: { title: string, items: Product[], type: 'similar' | 'special' }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    if (items.length === 0) return null;

    const scroll = (direction: 'left' | 'right') => {
      if (scrollRef.current) {
        const { current } = scrollRef;
        const scrollAmount = 300;
        if (direction === 'left') {
          current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
          current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    };

    const handleViewMore = () => {
        if (type === 'similar') {
            navigate(`/search?category=${encodeURIComponent(category)}`);
        } else {
            navigate('/search?q=gifts');
        }
    };

    return (
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 font-serif">{title}</h2>
            <div className="hidden lg:flex gap-2">
                <button 
                    onClick={() => scroll('left')} 
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                >
                    <ChevronLeft size={18} />
                </button>
                <button 
                    onClick={() => scroll('right')} 
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>

        <div 
            ref={scrollRef}
            className="grid grid-cols-2 gap-2 lg:flex lg:gap-4 lg:overflow-x-auto lg:no-scrollbar lg:pb-4 lg:scroll-smooth"
        >
            {items.map((product) => (
                <div 
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="w-full lg:min-w-[240px] lg:w-[240px] flex-shrink-0 bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 group flex flex-col"
                >
                    {/* Image Area */}
                    <div className="relative h-40 lg:h-48 bg-gray-50 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Wishlist Button */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isInWishlist(product.id)) {
                                    removeFromWishlist(product.id);
                                    showToast('Removed from Wishlist', 'info');
                                } else {
                                    addToWishlist(product);
                                    showToast('Added to Wishlist', 'success');
                                }
                            }}
                            className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-all ${isInWishlist(product.id) ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-red-500'}`}
                        >
                            <Heart size={14} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                        </button>

                        {/* Rating Badge */}
                        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm text-gray-800 border border-gray-100">
                            <span>{product.rating}</span>
                            <Star size={8} fill="#f59e0b" className="text-yellow-500" />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col flex-1">
                        <h3 className="text-sm text-gray-900 truncate font-medium mb-1" title={product.name}>{product.name}</h3>
                        
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-bold text-gray-900 text-base">{formatPrice(product.price)}</span>
                            <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                            <span className="text-xs text-green-600 font-bold">{product.discount}% off</span>
                        </div>
                        
                        <p className="text-[10px] text-blue-600 font-medium mb-3">
                            Get it for <span className="font-bold">{formatPrice(Math.floor(product.price * 0.9))}</span> with coupon
                        </p>

                        {/* Add to Cart Button */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                                showToast('Added to Cart', 'success');
                            }}
                            className="mt-auto w-full bg-black hover:bg-[#e42529] text-white font-medium py-2 rounded-md text-sm transition-all duration-300 shadow-sm"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* View More Button */}
        <div className="mt-6 flex justify-center">
            <button 
                onClick={handleViewMore}
                className="px-8 py-2.5 border border-gray-300 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-black hover:border-black transition-all shadow-sm"
            >
                View More {type === 'similar' ? 'Similar Products' : 'Special Items'}
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4 lg:mt-8 border-t border-gray-100 pt-4 lg:pt-8">
      {(mode === 'all' || mode === 'similar') && <ProductSection title="Similar Products" items={similarProducts} type="similar" />}
      {(mode === 'all' || mode === 'special') && <ProductSection title="Make it special" items={specialProducts} type="special" />}
    </div>
  );
};
