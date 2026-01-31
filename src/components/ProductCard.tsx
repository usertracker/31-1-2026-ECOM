import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, TrendingUp, ShoppingBag } from 'lucide-react';
import { Product } from '../data/mockData';
import { formatPrice } from '../lib/utils';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const isWishlisted = isInWishlist(product.id);

  // Logic for "Best Seller" - Prioritize explicit flag, then fallback to logic
  const isBestSeller = product.isBestSeller || (product.price < 5000 && product.rating >= 4.8);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      showToast('Removed from Wishlist', 'info');
    } else {
      addToWishlist(product);
      showToast('Added to Wishlist', 'success');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    showToast('Added to Cart', 'success');
  };

  // Calculate a mock coupon price
  const couponPrice = Math.floor(product.price * 0.9);

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col h-full border border-gray-100/50">
      
      {/* Image Container - Responsive Height (h-48 on mobile, h-64 on desktop) */}
      <div className="relative h-48 md:h-64 w-full bg-[#f9f5f0] flex items-center justify-center overflow-hidden group-hover:bg-[#f0ebe5] transition-colors">
        
        {/* Best Seller Badge */}
        {isBestSeller && (
            <div className="absolute top-3 left-0 z-20 bg-[#8B5E3C] text-white text-[10px] font-bold px-3 py-1 rounded-r-full shadow-sm flex items-center gap-1 tracking-wide">
            <TrendingUp size={12} />
            BEST SELLER
            </div>
        )}

        <Link to={`/product/${product.id}`} className="w-full h-full block">
            <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/400x400?text=No+Image';
            }}
            />
        </Link>

        {/* Wishlist Button */}
        <button 
            onClick={toggleWishlist}
            className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all ${isWishlisted ? 'bg-white text-red-500' : 'bg-white/80 text-gray-400 hover:bg-white hover:text-red-500'}`}
        >
            <Heart fill={isWishlisted ? "currentColor" : "none"} size={18} />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm text-gray-800">
            {product.rating} <Star size={10} fill="#f59e0b" className="text-yellow-500" />
        </div>
      </div>

      {/* Content - Clean White Base */}
      <div className="flex flex-col flex-1 p-4">
        <Link to={`/product/${product.id}`} className="hover:text-[#8B5E3C] transition-colors">
          <h3 className="font-serif font-bold text-gray-900 line-clamp-2 mb-2 text-sm leading-relaxed h-10" title={product.name}>
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto">
          {/* Price Row */}
          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
            <span className="font-bold text-lg text-gray-900">{formatPrice(product.price)}</span>
            <span className="text-gray-400 text-xs line-through decoration-gray-400">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-[#8B5E3C] text-xs font-bold whitespace-nowrap bg-[#f9f5f0] px-1.5 rounded">
              {product.discount}% off
            </span>
          </div>
          
          {/* Coupon Text */}
          <p className="text-[10px] text-gray-500 font-medium mb-4 flex items-center gap-1">
            Get it for <span className="font-bold text-gray-900">{formatPrice(couponPrice)}</span> with coupon
          </p>
          
          {/* Add to Cart Button - Updated: Black to Red Hover */}
          <button 
            onClick={handleAddToCart}
            className="w-full bg-black hover:bg-[#e42529] text-white font-bold py-2.5 rounded-xl text-sm transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group/btn"
          >
            <ShoppingBag size={16} className="group-hover/btn:scale-110 transition-transform" />
            {t('add_to_cart')}
          </button>
        </div>
      </div>
    </div>
  );
};
