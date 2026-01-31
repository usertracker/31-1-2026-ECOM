import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../lib/utils';
import { Minus, Plus, X, Truck, Gift, Lock, ChevronDown, Tag, Heart, Trash2, Archive, Zap, Star, ShieldCheck, ShoppingBag, CheckCircle2, MapPin, Leaf, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { AddressSelectionModal } from '../components/AddressSelectionModal';

// Mock Top Rated Reviews (Simulating global best reviews)
const TOP_REVIEWS = [
  {
    id: 1,
    name: "SUJATA S ASUNDI RAMESH",
    initials: "SS",
    rating: 5,
    date: "Dec 22, 2025",
    comment: "Right touch of Fabric (when I touch the fabric it's feel soft and design. it's just awesome",
    verified: true
  },
  {
    id: 2,
    name: "PRIYA SHARMA",
    initials: "PS",
    rating: 5,
    date: "Jan 10, 2026",
    comment: "Absolutely loved the packaging and the quality of the ring. It shines beautifully!",
    verified: true
  },
  {
    id: 3,
    name: "RAHUL VERMA",
    initials: "RV",
    rating: 5,
    date: "Feb 05, 2026",
    comment: "Delivery was super fast and the product looks exactly like the photos. Highly recommend.",
    verified: true
  },
  {
    id: 4,
    name: "ANITA DESAI",
    initials: "AD",
    rating: 5,
    date: "Feb 18, 2026",
    comment: "Great value for money. The finish is premium and feels very durable.",
    verified: true
  },
  {
    id: 5,
    name: "VIKRAM SINGH",
    initials: "VS",
    rating: 5,
    date: "Mar 01, 2026",
    comment: "Best gift for my wife. She was thrilled! Thank you FlipZon for the amazing service.",
    verified: true
  }
];

export const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { addToWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  
  // Review Slider State
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Auto-slide logic for reviews
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % TOP_REVIEWS.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, []);

  // Calculate discount based on mock original prices
  const totalOriginalPrice = cart.reduce((acc, item) => acc + item.originalPrice * item.quantity, 0);
  const totalDiscount = totalOriginalPrice - cartTotal;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const deliveryDateStr = deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // Mock Address or User Address
  const defaultAddress = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];
  
  const handleSaveForLater = (item: any) => {
    addToWishlist(item);
    removeFromCart(item.id);
    showToast("Moved to 'Save for later'", "success");
  };

  const handleBuyThisNow = (item: any) => {
    // Direct Checkout for Single Item
    navigate('/checkout', { 
        state: { 
            product: item, 
            mode: 'buy_now' 
        } 
    });
  };

  const handlePlaceOrder = () => {
    // Navigate to checkout with 'cart_checkout' mode to skip Order Summary
    navigate('/checkout', { 
        state: { 
            mode: 'cart_checkout' 
        } 
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 font-sans">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
            <img 
                src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" 
                alt="Empty Cart" 
                className="w-20 opacity-80"
            />
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6 text-sm">Add items to it now.</p>
        <Link to="/" className="bg-[#2874f0] text-white px-12 py-3 rounded-sm font-bold shadow-sm hover:bg-blue-600 transition-all text-sm">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-24 md:pb-10 font-sans">
      <AddressSelectionModal 
        isOpen={isAddressModalOpen} 
        onClose={() => setIsAddressModalOpen(false)} 
      />

      <div className="max-w-[1200px] mx-auto md:pt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-2 space-y-3">
            
            {/* --- TOP REVIEWS SLIDER --- */}
            <div className="bg-white p-3 shadow-sm rounded-sm mb-2 relative overflow-hidden">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentReviewIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-1.5"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#415d43] text-white flex items-center justify-center font-bold text-xs">
                                    {TOP_REVIEWS[currentReviewIndex].initials}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-900 text-xs uppercase">{TOP_REVIEWS[currentReviewIndex].name}</span>
                                        <span className="bg-gray-100 text-gray-500 text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 border border-gray-200">
                                            <CheckCircle2 size={10} className="text-gray-500" /> Verified Purchase
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="flex gap-0.5">
                                            {[1,2,3,4,5].map(s => (
                                                <Star key={s} size={10} fill="#00b67a" className="text-[#00b67a]" strokeWidth={0} />
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-gray-500">{TOP_REVIEWS[currentReviewIndex].date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed mt-0.5 pl-1 line-clamp-2">
                            {TOP_REVIEWS[currentReviewIndex].comment}
                        </p>
                    </motion.div>
                </AnimatePresence>
                
                {/* Dots Indicator */}
                <div className="flex justify-center gap-1 mt-2">
                    {TOP_REVIEWS.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`w-1 h-1 rounded-full transition-colors ${idx === currentReviewIndex ? 'bg-gray-800' : 'bg-gray-300'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Address Header - Updated Alignment */}
            {user && (
                <div className="bg-white p-3 shadow-sm rounded-sm flex justify-between items-center mb-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="text-sm text-gray-900 truncate">
                                <span className="text-gray-500">Deliver to: </span>
                                <span className="font-bold">{user.name}{defaultAddress ? `, ${defaultAddress.zip}` : ''}</span>
                            </div>
                            {defaultAddress?.type && (
                                <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide border border-gray-200">
                                    {defaultAddress.type}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 truncate max-w-[90%]">
                            {defaultAddress ? `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state}` : 'No address selected'}
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsAddressModalOpen(true)}
                        className="border border-gray-300 text-blue-600 px-3 py-1.5 rounded-sm text-xs font-bold hover:bg-blue-50 transition uppercase whitespace-nowrap bg-white ml-2"
                    >
                        Change
                    </button>
                </div>
            )}

            {/* Cart Items List */}
            {cart.map((item) => {
              // Stock Logic for Cart Item (Default to 5 if undefined for demo visual)
              const stockCount = item.stockCount ?? 5;
              const stockPercentage = Math.min((stockCount / 20) * 100, 100);
              const isLowStock = stockCount < 10;

              return (
              <div key={item.id} className="bg-white shadow-sm rounded-sm overflow-hidden">
                <div className="p-4 flex gap-4">
                  {/* Product Image */}
                  <div className="flex flex-col items-center gap-3 w-24 md:w-28 flex-shrink-0">
                      <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 relative">
                        <Link to={`/product/${item.id}`}>
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </Link>
                      </div>
                      
                      {/* Quantity Dropdown */}
                      <div className="relative w-full">
                        <select 
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                            className="w-full appearance-none bg-white border border-gray-300 text-gray-800 text-sm font-bold py-1 px-2 rounded-sm outline-none focus:border-blue-500 text-center"
                        >
                            {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                <option key={num} value={num}>Qty: {num}</option>
                            ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                      </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <Link to={`/product/${item.id}`} className="hover:text-blue-600 transition-colors">
                                <h3 className="font-medium text-gray-800 text-sm md:text-base mb-1 line-clamp-2 leading-snug">
                                    {item.name}
                                </h3>
                            </Link>
                            <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                        </div>
                    </div>
                    
                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            {item.rating} <Star size={8} fill="currentColor" />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">({item.reviews})</span>
                    </div>

                    {/* Price Block */}
                    <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-lg text-gray-900">₹{item.price.toLocaleString()}</span>
                        <span className="text-gray-500 line-through text-sm">₹{item.originalPrice.toLocaleString()}</span>
                        <span className="text-green-600 text-xs font-bold">{item.discount}% Off</span>
                    </div>

                    {/* --- STOCK SCARCITY INDICATOR (MINI) --- */}
                    {isLowStock && (
                        <div className="mt-2 mb-3 max-w-[250px]">
                            <p className="text-[10px] text-gray-600 mb-1">
                                Only {stockCount} Piece Available to buy
                            </p>
                            <div className="w-full h-1.5 bg-red-100 rounded-full overflow-hidden mb-1">
                                <div 
                                    className="h-full bg-[#a81919] rounded-full" 
                                    style={{ width: `${stockPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    <div className="text-xs text-gray-900 mt-2">
                        Delivery by {deliveryDateStr} | <span className="text-green-600 font-bold">Free</span> <span className="text-gray-400 line-through">₹40</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Strip */}
                <div className="border-t border-gray-100 flex divide-x divide-gray-100">
                    <button 
                        onClick={() => removeFromCart(item.id)}
                        className="flex-1 py-3 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition font-medium text-xs md:text-sm"
                    >
                        <Trash2 size={16} /> Remove
                    </button>
                    <button 
                        onClick={() => handleSaveForLater(item)}
                        className="flex-1 py-3 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition font-medium text-xs md:text-sm"
                    >
                        <Archive size={16} /> Save for later
                    </button>
                    <button 
                        onClick={() => handleBuyThisNow(item)}
                        className="flex-1 py-3 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition font-medium text-xs md:text-sm"
                    >
                        <Zap size={16} className="text-gray-400" /> Buy this now
                    </button>
                </div>
              </div>
            );
            })}
        </div>

        {/* Right Column: Price Details (Sticky on Desktop) */}
        <div className="lg:col-span-1">
            <div className="bg-white shadow-sm rounded-xl p-6 sticky top-24 border border-gray-100">
                
                {/* Item Total */}
                <div className="flex justify-between items-center mb-4">
                    <span className="text-base font-bold text-gray-900">Item(s) total</span>
                    <span className="text-base font-medium text-gray-900">{formatPrice(totalOriginalPrice)}</span>
                </div>

                {/* Purchase Protection Badge */}
                <div className="flex items-center gap-2 mb-4 bg-gray-50 p-2 rounded-lg">
                    <div className="bg-black rounded-full p-0.5">
                        <CheckCircle2 size={12} className="text-white" strokeWidth={3} />
                    </div>
                    <span className="text-xs text-gray-600 font-medium underline decoration-gray-400 underline-offset-2">
                        You're covered with FlipZon Purchase Protection
                    </span>
                </div>

                {/* Discount */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Shop discount</span>
                    <span className="text-sm text-gray-900">- {formatPrice(totalDiscount)}</span>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm text-gray-900">{formatPrice(cartTotal)}</span>
                </div>

                {/* Delivery */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-600">Delivery</span>
                        <span className="text-xs text-gray-400 underline decoration-gray-300">(To India)</span>
                    </div>
                    <span className="text-sm text-gray-900">{formatPrice(0)}</span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-gray-900">Total ({cart.length} items)</span>
                    <span className="text-lg font-bold text-gray-900">{formatPrice(cartTotal)}</span>
                </div>

                {/* Checkout Button */}
                <button 
                    onClick={handlePlaceOrder}
                    className="w-full bg-black text-white py-3.5 rounded-full font-bold text-base hover:bg-gray-800 transition-all shadow-md mb-4"
                >
                    Go to checkout
                </button>

                {/* Tax Note */}
                <p className="text-xs text-center text-gray-500 mb-2">
                    Local taxes included (where applicable)
                </p>
                <p className="text-[10px] text-center text-gray-400 mb-6">
                    * Learn more about additional taxes, duties, and fees that <span className="underline cursor-pointer">may apply</span>
                </p>

                {/* Eco Note */}
                <div className="flex gap-3 items-start pt-4 border-t border-gray-100">
                    <Leaf size={20} className="text-gray-800 flex-shrink-0 mt-0.5" fill="currentColor" />
                    <p className="text-xs text-gray-600 leading-relaxed">
                        FlipZon invests in climate solutions like electric trucks and carbon offsets for every delivery. <span className="underline cursor-pointer font-medium text-gray-800">See how</span>
                    </p>
                </div>

            </div>
        </div>

      </div>

      {/* --- STICKY BOTTOM BAR (Mobile) --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden z-50 flex items-center justify-between">
          <div>
              <p className="text-xs text-gray-500 line-through">{formatPrice(totalOriginalPrice)}</p>
              <p className="text-lg font-bold text-gray-900">{formatPrice(cartTotal)}</p>
          </div>
          <button 
            onClick={handlePlaceOrder}
            className="bg-black text-white px-6 py-3 rounded-full font-bold text-sm shadow-sm hover:bg-gray-800 transition-colors uppercase flex items-center gap-2"
          >
            <ShoppingBag size={16} />
            Place Order
          </button>
      </div>

    </div>
  );
};
