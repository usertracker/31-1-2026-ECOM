import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Lock, ShieldCheck, RotateCcw, Truck, ChevronRight, Info, Share2, ArrowLeft, Search, ShoppingCart, Clock, Heart, BadgeCheck, Home as HomeIcon, ShoppingBag, ChevronDown, Hand, Gem, Undo2, Calendar, FileText, HeartHandshake, Zap, MoreHorizontal, MapPin } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { ProductReviews } from '../components/ProductReviews';
import { RelatedProducts } from '../components/RelatedProducts';
import { formatPrice } from '../lib/utils';
import { OCCASION_PRODUCTS, DEAL_PRODUCTS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { ShareModal } from '../components/ShareModal';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AddressSelectionModal } from '../components/AddressSelectionModal';

// Fallback images to ensure diversity in the gallery
const GENERIC_IMAGES = [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1602751584552-8ba42d523f17?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop'
];

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();
  const { showToast } = useToast();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { products, refreshProducts } = useProducts();
  const { addToViewed, viewedItems } = useRecentlyViewed();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  // Force refresh on mount to ensure we have the latest data
  useEffect(() => {
    refreshProducts();
  }, []);

  // Try to find product in main context first, then fallback to static occasion products or deal products
  const product = products.find((p) => p.id === id) || 
                  OCCASION_PRODUCTS.find((p) => p.id === id) || 
                  DEAL_PRODUCTS.find((p) => p.id === id);
  
  const [activeImg, setActiveImg] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  
  // Default expanded section is now 'delivery'
  const [expandedSection, setExpandedSection] = useState<string | null>('delivery');
  
  // Mobile Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Sticky Footer Logic
  const [showStickyFooter, setShowStickyFooter] = useState(false);
  const mainActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setActiveImg(product.image);
      addToViewed(product); // Add to recently viewed history ONLY
    }
  }, [product?.id]); // Only run when product ID changes

  // Scroll Listener for Sticky Footer
  useEffect(() => {
    const handleScroll = () => {
      if (mainActionsRef.current) {
        const rect = mainActionsRef.current.getBoundingClientRect();
        // If the bottom of the main buttons container is above the viewport (scrolled past)
        // Show the sticky footer. Otherwise hide it.
        setShowStickyFooter(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) return <div className="p-10 text-center text-gray-500">Product not found</div>;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast('Added to Cart', 'success');
  };

  const handleBuyNow = () => {
    // Direct Checkout: Pass product details via state to Checkout page
    // This avoids adding to the global cart context
    navigate('/checkout', { 
      state: { 
        product: { ...product, quantity }, 
        mode: 'buy_now' 
      } 
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
        showToast('Removed from Wishlist', 'info');
    } else {
        addToWishlist(product);
        showToast('Added to Wishlist', 'success');
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Logic to ensure diverse images in gallery
  const getGalleryImages = () => {
    let imgs = product.images && product.images.length > 0 ? [...product.images] : [product.image];
    
    // If fewer than 6, fill with generic images to ensure variety
    const uniqueImages = new Set(imgs);
    let i = 0;
    while (uniqueImages.size < 6) {
        uniqueImages.add(GENERIC_IMAGES[i % GENERIC_IMAGES.length]);
        i++;
    }
    
    return Array.from(uniqueImages).slice(0, 6);
  };

  const galleryImages = getGalleryImages();

  // Handle Mobile Scroll for Dots
  const handleMobileScroll = () => {
    if (sliderRef.current) {
        const scrollPosition = sliderRef.current.scrollLeft;
        const width = sliderRef.current.offsetWidth;
        const index = Math.round(scrollPosition / width);
        setCurrentSlide(index);
    }
  };

  // Filter viewed items to exclude current product
  const otherViewedItems = viewedItems.filter(p => p.id !== product.id);

  // Mock Seller Name based on ID or random
  const sellerName = product.sellerId === 'seller_123' ? 'Appario Retail' : 'Myguitartips';

  // Calculate Delivery Date (Mock: 3 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const deliveryDateStr = deliveryDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  // Get User Address (Default or First)
  const userAddress = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];

  // Stock Scarcity Logic
  const stockCount = product.stockCount ?? 5; // Default to 5 if undefined
  const isLowStock = stockCount < 10;
  const stockPercentage = Math.min((stockCount / 20) * 100, 100); // Assume 20 is "full" bar for visual

  return (
    <div className="bg-white min-h-screen font-sans pb-24 lg:pb-0">
      
      <ShareModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        product={product} 
      />

      <AddressSelectionModal 
        isOpen={isAddressModalOpen} 
        onClose={() => setIsAddressModalOpen(false)} 
      />

      {/* --- BREADCRUMB (Mobile Only) --- */}
      <div className="max-w-[1600px] mx-auto px-4 py-3 lg:hidden">
        <div className="text-xs text-gray-500 flex items-center gap-1">
            <Link to="/" className="hover:text-[#fa4a6f] transition-colors">{t('home')}</Link> 
            <ChevronRight size={12} />
            <Link to={`/search?category=${product.category}`} className="hover:text-[#fa4a6f] transition-colors">{product.category}</Link>
        </div>
      </div>

      {/* --- SPLIT SECTION: Fixed Image & Scrollable Details --- */}
      <div className="flex flex-col lg:flex-row max-w-[1600px] mx-auto">
        
        {/* --- LEFT COLUMN: IMAGE SECTION --- */}
        <div className="lg:w-[55%] bg-white lg:sticky lg:top-[70px] lg:self-start lg:h-[calc(100vh-70px)] flex flex-col relative px-0 pb-0 pt-0 lg:px-6 lg:pb-6 lg:pt-0">
            
            {/* Desktop Breadcrumb (Sticky inside this col) */}
            <div className="hidden lg:flex text-xs text-gray-500 items-center gap-1 mb-2 mt-0 flex-shrink-0">
                <Link to="/" className="hover:text-[#fa4a6f] transition-colors">{t('home')}</Link> 
                <ChevronRight size={12} />
                <Link to={`/search?category=${product.category}`} className="hover:text-[#fa4a6f] transition-colors">{product.category}</Link>
                <ChevronRight size={12} />
                <span className="text-gray-800 font-medium truncate">{product.name}</span>
            </div>

            {/* --- MOBILE IMAGE SLIDER (ROUNDED CORNERS) --- */}
            <div className="lg:hidden relative w-full bg-white rounded-b-[30px] overflow-hidden shadow-sm mb-2">
                <div 
                    ref={sliderRef}
                    onScroll={handleMobileScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full aspect-square"
                >
                    {galleryImages.map((img, idx) => (
                        <div key={idx} className="w-full flex-shrink-0 snap-center relative">
                            <img 
                                src={img} 
                                alt={`${product.name} ${idx + 1}`} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
                
                {/* Floating Actions (Mobile) - UPDATED TO BLACK ICONS */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-3">
                    <button 
                        onClick={handleWishlist}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-gray-100 transition text-black"
                    >
                        <Heart size={18} fill={isInWishlist(product.id) ? "black" : "none"} className="text-black" />
                    </button>
                    <button 
                        onClick={() => setIsShareOpen(true)}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-gray-100 transition text-black"
                    >
                        <Share2 size={18} />
                    </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 py-3 bg-white absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/10 to-transparent">
                    {galleryImages.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`w-2 h-2 rounded-full transition-colors duration-300 ${currentSlide === idx ? 'bg-black' : 'bg-white/70'}`}
                        />
                    ))}
                </div>
            </div>
            
            {/* "In Demand" Text (Mobile) */}
            <div className="lg:hidden px-4 pb-2">
                <p className="text-[#a81919] font-bold text-xs md:text-sm">
                    In demand. {Math.floor(Math.random() * 20) + 10} people bought this in the last 24 hours.
                </p>
            </div>

            {/* --- DESKTOP IMAGE GALLERY --- */}
            <div className="hidden lg:flex flex-1 flex-col lg:flex-row gap-4 lg:gap-6 h-full items-start justify-start relative pt-0 min-h-0">
                <div className="hidden lg:flex flex-col gap-4 overflow-y-auto w-24 flex-shrink-0 no-scrollbar h-full z-10 justify-start pb-2">
                    {galleryImages.map((img, idx) => {
                        const isActive = (activeImg || product.image) === img;
                        return (
                            <div 
                                key={idx}
                                onMouseEnter={() => setActiveImg(img)}
                                onClick={() => setActiveImg(img)}
                                className={`
                                    relative flex-shrink-0 cursor-pointer transition-all duration-300 ease-out bg-white overflow-hidden
                                    ${isActive 
                                        ? 'w-20 h-20 rounded-xl border-[2px] border-black p-0.5 shadow-md z-10' 
                                        : 'w-20 h-20 rounded-xl border border-gray-200 hover:border-gray-400'
                                    }
                                `}
                            >
                                <img src={img} alt="" className={`w-full h-full object-cover rounded-lg ${isActive ? '' : 'opacity-80 hover:opacity-100'}`} />
                            </div>
                        );
                    })}
                </div>

                {/* Main Image Container with Rounded Corners */}
                <div className="relative w-full h-[400px] lg:h-full bg-gray-50 rounded-2xl lg:rounded-[32px] overflow-hidden group ml-0 shadow-sm flex-1">
                    {/* Floating Actions (Desktop) - UPDATED TO BLACK ICONS */}
                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-3">
                        <button onClick={handleWishlist} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-gray-100 transition text-black">
                            <Heart size={20} fill={isInWishlist(product.id) ? "black" : "none"} className="text-black" />
                        </button>
                        <button onClick={() => setIsShareOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-gray-100 transition text-black">
                            <Share2 size={20} />
                        </button>
                    </div>
                    <img key={activeImg || product.image} src={activeImg || product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 animate-fade-in" />
                </div>
            </div>
        </div>

        {/* --- RIGHT COLUMN: PRODUCT DETAILS --- */}
        <div className="lg:w-[45%] bg-white p-4 lg:p-8 relative z-10">
            
            {/* Price Row */}
            <div className="mb-1">
                <div className="flex items-baseline gap-3">
                    <span className="text-2xl lg:text-4xl font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="text-sm lg:text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-xs lg:text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                        {product.discount}% Off
                    </span>
                </div>
            </div>

            {/* Tax Info */}
            <p className="text-gray-500 text-xs mb-2">Local taxes included (where applicable)</p>

            {/* Title */}
            <h1 className="text-base md:text-lg text-gray-800 leading-snug mb-2 font-normal">
                {product.name}, {product.description}
            </h1>

            {/* Seller & Review Badge */}
            <div className="flex items-center gap-2 mb-6">
                <span className="font-bold text-sm text-gray-900">{sellerName}</span>
                <div className="bg-[#9747FF] rounded-full p-0.5 w-5 h-5 flex items-center justify-center">
                    <Star size={12} fill="white" className="text-white" />
                </div>
                <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} fill="black" className="text-black" />
                    ))}
                </div>
                <span className="text-gray-500 text-xs">({product.reviews})</span>
            </div>

            {/* --- STOCK SCARCITY INDICATOR --- */}
            {isLowStock && (
                <div className="mb-6">
                    <p className="text-gray-600 text-sm mb-1">
                        Only {stockCount} Piece Available to buy
                    </p>
                    <div className="w-full h-2.5 bg-red-100 rounded-full overflow-hidden mb-2">
                        <div 
                            className="h-full bg-[#a81919] rounded-full transition-all duration-500"
                            style={{ width: `${stockPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-gray-800 font-bold text-sm">
                        Designs usually don't get restocked, order today
                    </p>
                </div>
            )}

            {/* --- ACTION BUTTONS (VISIBLE ON MOBILE & DESKTOP) --- */}
            {/* Added ref to track scroll position */}
            <div ref={mainActionsRef} className="flex flex-col gap-3 mb-8 w-full">
                <div className="flex gap-3 items-end w-full">
                    <div className="w-[120px] lg:w-32 flex-shrink-0">
                        <label className="block text-[10px] lg:text-xs text-gray-500 uppercase font-bold mb-1 tracking-wide">SELECT QUANTITY:</label>
                        <div className="relative">
                            <select 
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="w-full h-10 lg:h-12 border border-gray-300 rounded-full px-3 lg:px-4 outline-none focus:border-black bg-white text-gray-800 font-bold appearance-none cursor-pointer text-xs lg:text-sm"
                            >
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>Quantity - {num}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                        </div>
                    </div>
                    
                    {/* Add to Cart Button */}
                    <button 
                        onClick={handleAddToCart}
                        className="flex-1 h-10 lg:h-12 bg-[#1a1a1a] hover:bg-black text-white rounded-full font-bold text-xs lg:text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-md transition-all transform active:scale-[0.98]"
                    >
                        <ShoppingBag size={16} />
                        ADD TO CART
                    </button>
                </div>

                {/* Buy Now Button - Full Width Yellow */}
                <button 
                    onClick={handleBuyNow}
                    className="w-full h-10 lg:h-12 bg-[#ffc107] hover:bg-[#ffca2c] text-black rounded-full font-bold text-xs lg:text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-md transition-all transform active:scale-[0.98]"
                >
                    <Zap size={16} />
                    Buy it now
                </button>
            </div>

            {/* --- NEW ACCORDION SECTION (Item Details & Delivery) --- */}
            <div className="mb-6">
                {/* Item Details */}
                <div className="border-t border-gray-200">
                    <button 
                        onClick={() => toggleSection('item-details')}
                        className="w-full flex justify-between items-center py-4 text-left group"
                    >
                        <span className="font-bold text-gray-900 text-sm">Item details</span>
                        <ChevronDown 
                            size={18} 
                            className={`text-gray-600 transition-transform duration-300 ${expandedSection === 'item-details' ? 'rotate-180' : ''}`} 
                        />
                    </button>
                    <AnimatePresence>
                        {expandedSection === 'item-details' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pb-4 text-sm text-gray-600 space-y-4">
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2">Highlights</h4>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Hand size={16} className="text-gray-800" />
                                            <span>Made by {sellerName}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Gem size={16} className="text-gray-800" />
                                            <span>Materials: {product.specs.find(s => s.includes('Material'))?.split(':')[1] || 'Premium Quality'}</span>
                                        </div>
                                    </div>
                                    
                                    <p className="leading-relaxed">
                                        {product.description}
                                    </p>
                                    <p>
                                        {product.specs.join('. ')}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Delivery & Returns */}
                <div className="border-t border-gray-200 border-b">
                    <button 
                        onClick={() => toggleSection('delivery')}
                        className="w-full flex justify-between items-center py-4 text-left group"
                    >
                        <span className="font-bold text-gray-900 text-sm">Delivery and return policies</span>
                        <ChevronDown 
                            size={18} 
                            className={`text-gray-600 transition-transform duration-300 ${expandedSection === 'delivery' ? 'rotate-180' : ''}`} 
                        />
                    </button>
                    <AnimatePresence>
                        {expandedSection === 'delivery' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pb-4 text-sm text-gray-800 space-y-4">
                                    {/* Delivery Date */}
                                    <div className="flex items-center gap-3">
                                        <Calendar size={20} strokeWidth={1.5} className="text-gray-800" />
                                        <span className="border-b border-dashed border-gray-400 pb-0.5">Order today to get by {deliveryDateStr}</span>
                                    </div>

                                    {/* Returns */}
                                    <div className="flex items-center gap-3">
                                        <FileText size={20} strokeWidth={1.5} className="text-gray-800" />
                                        <span className="border-b border-dashed border-gray-400 pb-0.5">Returns & exchanges accepted</span>
                                    </div>

                                    {/* Cost */}
                                    <div className="flex items-center gap-3">
                                        <Truck size={20} strokeWidth={1.5} className="text-gray-800" />
                                        <span>Free delivery</span>
                                    </div>

                                    {/* Location Dropdown Mock */}
                                    <div className="pt-2">
                                        <button className="flex items-center gap-1 font-bold text-gray-900 hover:bg-gray-100 px-2 -ml-2 py-1 rounded transition">
                                            Deliver to India, {userAddress?.zip || '641032'} <ChevronDown size={16} />
                                        </button>
                                        <p className="text-gray-500 text-xs mt-1">Dispatched from Mumbai, India</p>
                                    </div>

                                    {/* Eco Box */}
                                    <div className="bg-[#EDF7C7] p-3 rounded-lg text-xs text-gray-800 leading-relaxed">
                                        FlipZon invests in climate solutions like electric trucks and carbon offsets for every delivery. <span className="underline cursor-pointer">See how</span>
                                    </div>

                                    {/* Purchase Protection */}
                                    <div className="flex gap-3 pt-2">
                                        <div className="mt-1">
                                            <HeartHandshake size={24} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">FlipZon Purchase Protection</h4>
                                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                                Shop confidently on FlipZon knowing if something goes wrong with an order, we've got your back for all eligible purchases — <span className="underline cursor-pointer">see programme terms</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* --- SERVICE FEATURES GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#fa4a6f] flex-shrink-0">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">Material</h4>
                        <p className="text-xs text-gray-500">100% original product</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-[#fa4a6f] flex-shrink-0">
                        <Truck size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">Free shipping & Secure Payments</h4>
                        <p className="text-xs text-gray-500">Free shipping & COD on all India orders above ₹500</p>
                    </div>
                </div>
            </div>

            {/* --- DELIVERY DETAILS --- */}
            <div className="mb-8">
                {/* Address Card (Clickable to open modal) */}
                <div 
                    onClick={() => setIsAddressModalOpen(true)}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-blue-300 transition-all mb-3"
                >
                    {userAddress ? (
                        <>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <HomeIcon size={18} className="text-gray-700" />
                                    <span className="font-bold text-gray-900 text-sm">{user.name}</span>
                                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100">
                                        {userAddress.isDefault ? 'Default' : 'Selected'}
                                    </span>
                                </div>
                                <div className="text-blue-600 text-xs font-bold">Change</div>
                            </div>
                            <p className="text-gray-500 text-xs pl-0 md:pl-0 line-clamp-1 leading-relaxed">
                                {userAddress.street}, {userAddress.city}, {userAddress.state} - {userAddress.zip}
                            </p>
                        </>
                    ) : (
                        <div className="flex items-center justify-between py-1">
                             <div className="flex items-center gap-3">
                                <div className="bg-gray-100 p-1.5 rounded-full">
                                    <MapPin size={18} className="text-gray-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">Add Address</p>
                                    <p className="text-xs text-gray-500">To see delivery availability</p>
                                </div>
                             </div>
                             <span className="text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-full">Add</span>
                        </div>
                    )}
                </div>

                {/* Delivery Estimate - Styled exactly as requested */}
                <div className="flex items-center gap-2 text-sm text-gray-700 pl-1">
                    <Truck size={18} className="text-green-600" />
                    <span>Delivery by <span className="font-bold text-gray-900">{deliveryDateStr}</span></span>
                    <span className="text-gray-300">|</span>
                    <span className="text-green-600 font-bold">Free</span>
                </div>
            </div>

        </div>
      </div>

      {/* --- FULL WIDTH SECTION --- */}
      <div className="w-full bg-white border-t border-gray-100" id="similar-products-trigger">
          <div className="max-w-[1600px] mx-auto px-4 py-6 lg:py-8">
              {/* Product Reviews moved to top */}
              <ProductReviews product={product} />
              
              {/* Similar Products */}
              <RelatedProducts currentProductId={product.id} category={product.category} mode="similar" />
              
              {/* RESTORED "Make it special" Section */}
              <RelatedProducts currentProductId={product.id} category={product.category} mode="special" />
              
              {otherViewedItems.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-6">
                          <Clock size={20} className="text-gray-400" />
                          <h2 className="text-lg md:text-xl font-bold text-gray-800 font-serif">{t('recently_viewed')}</h2>
                      </div>
                      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                          {otherViewedItems.map((p) => (
                              <div 
                                  key={p.id}
                                  onClick={() => navigate(`/product/${p.id}`)}
                                  className="min-w-[160px] w-[160px] cursor-pointer group"
                              >
                                  <div className="h-40 bg-gray-50 rounded-lg mb-3 overflow-hidden border border-gray-100">
                                      <img 
                                          src={p.image} 
                                          alt={p.name} 
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                      />
                                  </div>
                                  <h3 className="text-xs font-medium text-gray-800 line-clamp-2 mb-1">{p.name}</h3>
                                  <span className="text-sm font-bold text-gray-900">{formatPrice(p.price)}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>
      </div>

      {/* --- SMART STICKY FOOTER --- */}
      <AnimatePresence>
        {showStickyFooter && (
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 flex items-center gap-3 justify-center"
            >
                {/* Add to Cart - Black Pill */}
                <button 
                    onClick={handleAddToCart}
                    className="flex-1 max-w-xs bg-black text-white px-6 py-3 rounded-full font-bold text-xs md:text-sm shadow-sm hover:bg-gray-800 transition-colors uppercase flex items-center justify-center gap-2"
                >
                    <ShoppingBag size={18} />
                    Add to Cart
                </button>

                {/* Buy Now - Yellow Pill */}
                <button 
                    onClick={handleBuyNow}
                    className="flex-1 max-w-xs bg-[#ffc107] text-black px-6 py-3 rounded-full font-bold text-xs md:text-sm shadow-sm hover:bg-[#ffca2c] transition-colors uppercase flex items-center justify-center gap-2"
                >
                    <Zap size={18} />
                    Buy it now
                </button>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
