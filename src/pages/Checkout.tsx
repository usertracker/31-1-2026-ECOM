import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { formatPrice } from '../lib/utils';
import { CheckCircle2, Loader2, MapPin, Star, ChevronDown, Leaf, ShoppingBag, ArrowLeft, ArrowDown, ShieldCheck, Check, Lock, Smartphone, Plus, CreditCard, Banknote, Tag, ChevronUp, Home, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AddressSelectionModal } from '../components/AddressSelectionModal';
import { useToast } from '../context/ToastContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const Checkout = () => {
  const { cart, cartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  
  // Handle "Buy Now" Mode - Local State for Quantity Updates
  const isBuyNowMode = location.state?.mode === 'buy_now';
  const isCartCheckout = location.state?.mode === 'cart_checkout';
  const [buyNowItem, setBuyNowItem] = useState(location.state?.product);

  // Use either the single buy-now item or the full cart
  const checkoutItems = isBuyNowMode && buyNowItem ? [buyNowItem] : cart;
  
  // Calculate totals based on current checkout items
  const totalAmount = checkoutItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalOriginalPrice = checkoutItems.reduce((acc, item) => acc + item.originalPrice * item.quantity, 0);
  const discount = totalOriginalPrice - totalAmount;

  // Initialize step: If coming from Cart, skip to Payment (Step 4)
  const [step, setStep] = useState(() => {
    if (!isAuthenticated) return 1;
    if (isCartCheckout) return 4; // Skip Order Summary
    return 3; // Default to Order Summary
  });

  const [paymentMethod, setPaymentMethod] = useState('paytm'); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any>(null); // Store details for success screen
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isTotalExpanded, setIsTotalExpanded] = useState(false);

  // Form State for new address
  const [deliveryData, setDeliveryData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    zip: '',
    city: '',
    address: ''
  });

  // Initialize with first address if available
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0 && !selectedAddressId) {
        const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
        setSelectedAddressId(defaultAddr.id);
        setDeliveryData(prev => ({
            ...prev,
            zip: defaultAddr.zip,
            city: defaultAddr.city,
            address: `${defaultAddr.street}, ${defaultAddr.state}`
        }));
    }
  }, [user]);

  React.useEffect(() => {
    if (isAuthenticated && step === 1) {
        // If logged in, respect the cart checkout flag
        setStep(isCartCheckout ? 4 : 3);
    }
  }, [isAuthenticated, step, isCartCheckout]);

  // Delivery Date Logic
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const deliveryDateStr = deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // Custom Back Handler
  const handleBack = () => {
    if (step === 4) {
        // If in Payment step, go back to Order Summary (Step 3)
        // Unless we came directly from cart, then go back to cart
        if (isCartCheckout) {
            navigate('/cart');
        } else {
            setStep(3);
        }
    } else {
        navigate(-1); // Go back to Cart/Product Page
    }
  };

  const handleOrderSuccess = async (method: string) => {
    setIsProcessing(true);
    try {
        // Simulate API delay for COD
        if (method === 'Cash on Delivery') {
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        const newOrder = await addOrder(checkoutItems, totalAmount, method, deliveryData);
        setPlacedOrderDetails(newOrder);
        
        // Only clear cart if it was a full cart checkout
        if (!isBuyNowMode) {
          await clearCart();
        }
        
        setOrderPlaced(true);
        setStep(5);
    } catch (error: any) {
        console.error("Order Placement Failed:", error);
        showToast('Failed to place order. Please try again.', 'error');
    } finally {
        setIsProcessing(false);
    }
  };

  const handleRazorpayPayment = () => {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
        showToast('Razorpay SDK failed to load. Please check your internet connection.', 'error');
        return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    
    if (!razorpayKey || razorpayKey === 'YOUR_RAZORPAY_KEY_ID') {
        showToast('Razorpay Key missing in .env', 'error');
        console.error("Please add VITE_RAZORPAY_KEY_ID to your .env file");
        return;
    }

    const options = {
        key: razorpayKey,
        amount: totalAmount * 100, // Amount in paise
        currency: "INR",
        name: "FlipZon",
        description: "Order Payment",
        image: "https://i.ibb.co/HLfD5wgf/dualite-favicon.png",
        handler: function (response: any) {
            console.log("Payment Successful", response);
            handleOrderSuccess(`Online (${paymentMethod.toUpperCase()})`);
        },
        prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || ''
        },
        theme: {
            color: "#2874f0"
        },
        // STRICTLY RESTRICT TO UPI ONLY (Hide Cards/Netbanking)
        config: {
            display: {
                blocks: {
                    upi: {
                        name: "Pay via UPI",
                        instruments: [
                            {
                                method: "upi"
                            }
                        ]
                    }
                },
                sequence: ["block.upi"],
                preferences: {
                    show_default_blocks: false // This hides Cards, Netbanking, Wallet default blocks
                }
            }
        }
    };

    try {
        const rzp1 = new window.Razorpay(options);
        
        rzp1.on('payment.failed', function (response: any){
            const desc = response.error?.description || 'Payment failed';
            showToast('Payment Failed: ' + desc, 'error');
        });

        rzp1.open();
    } catch (err) {
        console.error("Razorpay Error:", err);
        showToast('Failed to initialize payment', 'error');
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'cod') {
        handleOrderSuccess('Cash on Delivery');
    } else {
        handleRazorpayPayment();
    }
  };

  const getSelectedAddressObj = () => {
      if (!user?.addresses) return null;
      return user.addresses.find(a => a.id === selectedAddressId);
  };

  const selectedAddr = getSelectedAddressObj();

  // Handle Quantity Change for both modes
  const handleQuantityChange = (itemId: string, newQty: number) => {
    if (isBuyNowMode) {
        setBuyNowItem(prev => ({ ...prev, quantity: newQty }));
    } else {
        updateQuantity(itemId, newQty);
    }
  };

  // --- STEPPER COMPONENT ---
  const Stepper = () => (
    <div className="bg-white shadow-sm p-4 mb-4 flex items-center justify-between max-w-[1200px] mx-auto md:rounded-sm">
        {/* Step 1: Address */}
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
                <Check size={14} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-800">Address</span>
        </div>

        <div className="h-[1px] bg-gray-300 flex-1 mx-4"></div>

        {/* Step 2: Order Summary */}
        <div className="flex items-center gap-2">
            {/* If we skipped to payment, show Order Summary as completed */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 3 ? 'bg-blue-600 text-white' : (step > 3 ? 'bg-blue-50 border border-blue-200 text-blue-600' : 'bg-white border border-gray-300 text-gray-500')}`}>
                {step > 3 ? <Check size={14} /> : '2'}
            </div>
            <span className={`text-xs font-medium ${step === 3 ? 'text-gray-900' : 'text-gray-500'}`}>Order Summary</span>
        </div>

        <div className="h-[1px] bg-gray-300 flex-1 mx-4"></div>

        {/* Step 3: Payment */}
        <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 4 ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-500'}`}>
                3
            </div>
            <span className={`text-xs font-medium ${step === 4 ? 'text-gray-900' : 'text-gray-500'}`}>Payment</span>
        </div>
    </div>
  );

  // --- PRICE DETAILS CARD (Reusable) ---
  const PriceDetailsCard = () => (
    <div className="bg-white shadow-sm rounded-sm p-4 border border-gray-100">
        
        {/* Item Total */}
        <div className="flex justify-between items-center mb-4">
            <span className="text-base font-bold text-gray-900">Item(s) total</span>
            <span className="text-base font-medium text-gray-900">{formatPrice(totalOriginalPrice)}</span>
        </div>

        {/* Purchase Protection Badge */}
        <div className="flex items-center gap-2 mb-4 bg-gray-50 p-2 rounded-lg">
            <div className="bg-black rounded-full p-0.5">
                <ShieldCheck size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xs text-gray-600 font-medium underline decoration-gray-400 underline-offset-2">
                You're covered with FlipZon Purchase Protection
            </span>
        </div>

        {/* Breakdown */}
        <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Shop discount</span>
                <span className="text-gray-900">- {formatPrice(discount)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <div className="flex flex-col">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-xs text-gray-400 underline decoration-gray-300">(To India)</span>
                </div>
                <span className="text-gray-900">{formatPrice(0)}</span>
            </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-6">
            <span className="text-lg font-bold text-gray-900">Total ({checkoutItems.length} items)</span>
            <span className="text-lg font-bold text-gray-900">{formatPrice(totalAmount)}</span>
        </div>

        {/* Continue Button */}
        {step === 3 && (
            <button 
                onClick={() => setStep(4)}
                className="w-full bg-black text-white py-3.5 rounded-full font-bold text-base hover:bg-gray-800 transition-all shadow-md mb-4 flex items-center justify-center gap-2"
            >
                Continue
            </button>
        )}

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
  );

  if (orderPlaced) {
    const orderId = placedOrderDetails?.id || '12345';
    const orderDate = placedOrderDetails?.created_at ? new Date(placedOrderDetails.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const orderAddr = placedOrderDetails?.shipping_address ? `${placedOrderDetails.shipping_address.street}, ${placedOrderDetails.shipping_address.city}` : deliveryData.address;
    const orderPayment = placedOrderDetails?.payment_method || 'Online';

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative"
        >
          {/* Top Section - Green */}
          <div className="bg-[#354a3d] text-white pt-8 pb-16 px-8 text-center relative">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-6 opacity-80">FlipZon</h2>
            
            <div className="mb-4 relative inline-block">
                <div className="w-16 h-16 bg-[#26a541] rounded-full flex items-center justify-center mx-auto shadow-lg relative z-10">
                    <Check size={32} strokeWidth={4} className="text-white" />
                </div>
                {/* Decorative Confetti */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute -top-2 -left-4 text-yellow-400 text-xs">★</div>
                    <div className="absolute top-2 -right-6 text-red-400 text-xs">●</div>
                    <div className="absolute -bottom-2 -left-2 text-blue-400 text-xs">▲</div>
                </div>
            </div>

            <h1 className="text-xl font-medium mb-1">Hi {user?.name?.split(' ')[0] || 'Customer'},</h1>
            <h2 className="text-3xl font-bold font-serif mb-6">Thanks for your Order!</h2>
            
            <div className="inline-block bg-[#facc15] text-black font-bold px-6 py-2 rounded-full text-sm shadow-md">
                Order No: #{orderId.slice(0, 8).toUpperCase()}
            </div>

            {/* Curved Divider */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-[98%] z-10">
                <svg viewBox="0 0 1440 120" className="w-full h-auto text-[#354a3d] fill-current transform rotate-180" preserveAspectRatio="none">
                    <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                </svg>
            </div>
          </div>

          {/* Bottom Section - Details */}
          <div className="pt-16 pb-8 px-8 bg-white">
            <div className="grid grid-cols-3 gap-4 text-center mb-10">
                <div className="flex flex-col items-center">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Date</p>
                    <p className="text-sm font-bold text-gray-800">{orderDate}</p>
                </div>
                <div className="flex flex-col items-center border-l border-r border-gray-100 px-2">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Delivery Address</p>
                    <p className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">{orderAddr}</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Payment Method</p>
                    <p className="text-sm font-bold text-gray-800">{orderPayment}</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={() => navigate('/orders')}
                    className="flex-1 py-3.5 rounded-full border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm"
                >
                    View Order
                </button>
                <button 
                    onClick={() => navigate('/')}
                    className="flex-1 py-3.5 rounded-full bg-[#354a3d] text-white font-bold hover:bg-[#2d4035] transition-colors shadow-lg text-sm flex items-center justify-center gap-2"
                >
                    Shop More <ArrowRight size={16} />
                </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm font-sans">
        <div className="bg-white p-8 rounded-lg shadow-2xl flex flex-col items-center max-w-sm w-full mx-4">
          <Loader2 size={48} className="text-blue-600 mb-4 animate-spin" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">Processing Order</h3>
          <p className="text-gray-500 text-center mb-6 text-sm">Please wait while we confirm your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-24 md:pb-6 font-sans">
      <AddressSelectionModal 
        isOpen={isAddressModalOpen} 
        onClose={() => setIsAddressModalOpen(false)} 
      />

      {/* Mobile Header for Checkout */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-40 md:hidden">
         <button onClick={handleBack} className="text-gray-600">
            <ArrowLeft size={24} />
         </button>
         <h1 className="text-lg font-medium text-gray-800">
            {step === 3 ? 'Order Summary' : 'Payments'}
         </h1>
      </div>

      {/* Stepper Header (Desktop & Mobile) */}
      <div className="pt-2 md:pt-4">
        <Stepper />
      </div>

      <div className="max-w-[1200px] mx-auto px-0 md:px-4 grid grid-cols-1 lg:grid-cols-3 gap-4 mt-0 md:mt-2">
        
        {/* Left Column: Steps */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Step 3: Order Summary */}
          {step === 3 && (
          <div className="bg-white shadow-sm rounded-sm">
             {/* Desktop Header for Step 3 */}
             <div className="hidden md:flex gap-4 p-4 border-b border-gray-100 bg-blue-600">
                <span className="px-2 text-xs font-bold flex items-center justify-center h-5 w-5 rounded-sm bg-white text-blue-600">2</span>
                <h3 className="font-bold uppercase text-sm text-white">Order Summary</h3>
             </div>
             
             <div className="bg-white">
                 {/* Deliver To Section */}
                 <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-gray-500 text-sm">Deliver to:</span>
                                <span className="font-bold text-sm text-gray-900">{user?.name}, {deliveryData.zip}</span>
                                {selectedAddr && (
                                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide border border-gray-200">
                                        {selectedAddr.type || 'HOME'}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed truncate max-w-md">
                                {deliveryData.address}, {deliveryData.city}
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsAddressModalOpen(true)}
                            className="border border-gray-300 text-blue-600 px-4 py-1.5 rounded-sm text-xs font-bold hover:bg-blue-50 transition bg-white uppercase ml-2"
                        >
                            Change
                        </button>
                    </div>
                 </div>

                 {/* Product List */}
                 <div className="divide-y divide-gray-100">
                    {checkoutItems.map((item) => {
                        // Stock Logic
                        const stockCount = item.stockCount ?? 5;
                        const stockPercentage = Math.min((stockCount / 20) * 100, 100);
                        const isLowStock = stockCount < 10;

                        return (
                        <div key={item.id} className="p-4">
                            <div className="flex gap-4">
                                {/* Left: Image & Qty */}
                                <div className="flex flex-col gap-3 w-24 md:w-28 flex-shrink-0">
                                    <div className="w-24 h-24 md:w-28 md:h-28 border border-gray-200 rounded-sm p-1 flex items-center justify-center relative bg-white">
                                        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                                    </div>
                                    
                                    <div className="relative border border-gray-300 rounded-sm">
                                        <select 
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                                            className="w-full appearance-none bg-white py-1 pl-3 pr-6 text-sm font-bold text-gray-900 focus:outline-none"
                                        >
                                            {[1,2,3,4,5].map(n => <option key={n} value={n}>Qty: {n}</option>)}
                                        </select>
                                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Right: Details */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 leading-snug">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                                    
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                            {item.rating} <Star size={8} fill="currentColor" />
                                        </div>
                                        <span className="text-xs text-gray-500 font-medium">({item.reviews})</span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="text-lg font-bold text-gray-900">
                                            {formatPrice(item.price)}
                                        </span>
                                        <span className="text-gray-400 text-sm line-through decoration-gray-400">
                                            {formatPrice(item.originalPrice)}
                                        </span>
                                        <span className="text-green-700 font-bold text-sm flex items-center gap-0.5">
                                            {item.discount}% Off
                                        </span>
                                    </div>

                                    {isLowStock && (
                                        <div className="mt-1 mb-2 max-w-[200px]">
                                            <p className="text-[10px] text-gray-600 mb-1">
                                                Only {stockCount} Piece Available to buy
                                            </p>
                                            <div className="w-full h-1.5 bg-red-100 rounded-full overflow-hidden">
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
                        </div>
                        );
                    })}
                 </div>

                 {/* Price Details Section (Mobile - Below Products) */}
                 <div className="md:hidden border-t border-gray-100 mt-2">
                    <PriceDetailsCard />
                 </div>

                 {/* Sticky Bottom Bar (Mobile) */}
                 <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden z-50 flex items-center justify-between">
                     <div className="text-sm text-gray-900">
                         <span className="text-gray-500 text-xs line-through mr-1">{formatPrice(totalOriginalPrice)}</span>
                         <span className="font-bold text-lg">{formatPrice(totalAmount)}</span>
                     </div>
                     <button 
                        onClick={() => setStep(4)} 
                        className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm shadow-sm hover:bg-gray-800 transition-colors uppercase"
                     >
                         Continue
                     </button>
                 </div>
             </div>
          </div>
          )}

          {/* Step 4: Payment Options */}
          {step === 4 && (
              <div className="bg-white shadow-sm rounded-sm overflow-hidden">
                 {/* Desktop Header */}
                 <div className="hidden md:flex gap-4 p-4 border-b border-gray-100 bg-blue-600">
                    <span className="px-2 text-xs font-bold flex items-center justify-center h-5 w-5 rounded-sm bg-white text-blue-600">3</span>
                    <h3 className="font-bold uppercase text-sm text-white">Payment Options</h3>
                 </div>

                 {/* --- Mobile Payment Header Section --- */}
                 <div className="p-4 border-b border-gray-100 bg-white">
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="text-base font-bold text-gray-800">Step 3 of 3</h2>
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <Lock size={12} /> 100% Secure
                        </div>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Payments</h1>
                 </div>

                 {/* Total Amount Collapsible */}
                 <div className="border-b border-gray-100 bg-white">
                    <div 
                        onClick={() => setIsTotalExpanded(!isTotalExpanded)}
                        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-gray-700 font-medium">Total Amount</span>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-lg">{formatPrice(totalAmount)}</span>
                            {isTotalExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                        </div>
                    </div>
                    
                    <AnimatePresence>
                        {isTotalExpanded && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-gray-50 px-4 pb-4"
                            >
                                <div className="pt-2 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-bold text-gray-900">Item(s) total</span>
                                        <span className="text-base font-bold text-gray-900">{formatPrice(totalOriginalPrice)}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 w-fit">
                                        <div className="bg-black rounded-full p-0.5">
                                            <ShieldCheck size={12} className="text-white" strokeWidth={2.5} />
                                        </div>
                                        <span className="text-xs text-gray-600 font-medium underline decoration-gray-400 underline-offset-2">
                                            You're covered with FlipZon Purchase Protection
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Shop discount</span>
                                        <span className="text-gray-900">- {formatPrice(discount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="text-gray-900">{formatPrice(totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-gray-600">Delivery</span>
                                            <span className="text-xs text-gray-400 underline decoration-gray-300">(To India)</span>
                                        </div>
                                        <span className="text-gray-900">{formatPrice(0)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-2">
                                        <span className="text-base font-bold text-gray-900">Total ({checkoutItems.length} items)</span>
                                        <span className="text-base font-bold text-gray-900">{formatPrice(totalAmount)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                 </div>

                 {/* Cashback Banner */}
                 <div className="bg-[#e8f5e9] p-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <p className="text-green-700 font-bold text-sm">5% Cashback</p>
                        <p className="text-green-600 text-xs">Claim now with payment offers</p>
                    </div>
                    <div className="flex items-center bg-white rounded-full px-2 py-1 shadow-sm gap-2">
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">-</div>
                        <Tag size={14} className="text-green-600" />
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">+3</div>
                    </div>
                 </div>

                 {/* UPI Section (Expanded) */}
                 <div className="bg-white border-b border-gray-100">
                    <div className="p-4 flex justify-between items-center bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <Smartphone size={18} className="text-gray-700" />
                            <span className="font-bold text-gray-900 text-sm uppercase">UPI</span>
                        </div>
                        <ChevronDown size={16} className="text-gray-500 rotate-180" />
                    </div>

                    <div className="p-4 space-y-6">
                        {/* Paytm */}
                        <div onClick={() => setPaymentMethod('paytm')} className="cursor-pointer">
                            <div className="flex items-start gap-3">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${paymentMethod === 'paytm' ? 'border-blue-600' : 'border-gray-400'}`}>
                                    {paymentMethod === 'paytm' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-900">Paytm</span>
                                        <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-1 rounded">FAST</span>
                                    </div>
                                    <div className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                                        <Check size={10} /> ₹10 cashback applicable*
                                    </div>
                                    
                                    {/* Pay Button (Only shows when selected) */}
                                    {paymentMethod === 'paytm' && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handlePayment(); }}
                                            className="w-full bg-black text-white font-bold py-3 rounded-sm text-sm shadow-sm hover:bg-gray-800 transition mt-3"
                                        >
                                            Pay {formatPrice(totalAmount)}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Google Pay */}
                        <div onClick={() => setPaymentMethod('gpay')} className="cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${paymentMethod === 'gpay' ? 'border-blue-600' : 'border-gray-400'}`}>
                                    {paymentMethod === 'gpay' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                                </div>
                                <div className="flex-1 flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-900">Google Pay</span>
                                    <span className="text-xs text-gray-400">GPay</span>
                                </div>
                            </div>
                            {paymentMethod === 'gpay' && (
                                <button onClick={(e) => { e.stopPropagation(); handlePayment(); }} className="w-full bg-black text-white font-bold py-3 rounded-sm text-sm shadow-sm hover:bg-gray-800 transition mt-3 ml-7" style={{width: 'calc(100% - 28px)'}}>
                                    Pay {formatPrice(totalAmount)}
                                </button>
                            )}
                        </div>

                        {/* PhonePe */}
                        <div onClick={() => setPaymentMethod('phonepe')} className="cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${paymentMethod === 'phonepe' ? 'border-blue-600' : 'border-gray-400'}`}>
                                    {paymentMethod === 'phonepe' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                                </div>
                                <div className="flex-1 flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-900">PhonePe</span>
                                    <div className="w-6 h-6 bg-[#5f259f] rounded-full flex items-center justify-center text-white text-[10px] font-bold">Pe</div>
                                </div>
                            </div>
                            {paymentMethod === 'phonepe' && (
                                <button onClick={(e) => { e.stopPropagation(); handlePayment(); }} className="w-full bg-black text-white font-bold py-3 rounded-sm text-sm shadow-sm hover:bg-gray-800 transition mt-3 ml-7" style={{width: 'calc(100% - 28px)'}}>
                                    Pay {formatPrice(totalAmount)}
                                </button>
                            )}
                        </div>

                        {/* Add New UPI ID */}
                        <div className="cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full border border-gray-400 flex-shrink-0"></div>
                                <div className="flex-1 flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-900">Add new UPI ID</span>
                                    <div className="text-xs text-blue-600 font-medium">
                                        How to find?
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
                 
                 {/* Cash on Delivery */}
                 <div onClick={() => setPaymentMethod('cod')} className="p-4 border-b border-gray-100 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${paymentMethod === 'cod' ? 'border-blue-600' : 'border-gray-400'}`}>
                            {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <Banknote size={18} className="text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Cash on Delivery</span>
                            </div>
                            
                            {paymentMethod === 'cod' && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handlePayment(); }}
                                    className="w-full bg-black text-white font-bold py-3 rounded-sm text-sm shadow-sm hover:bg-gray-800 transition mt-3"
                                >
                                    Place Order
                                </button>
                            )}
                        </div>
                    </div>
                 </div>

                 {/* --- NEW FOOTER SECTION (Taxes & Eco) --- */}
                 <div className="p-6 bg-white space-y-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Local taxes included (where applicable)</p>
                        <p className="text-[10px] text-gray-400">
                            * Learn more about additional taxes, duties, and fees that <span className="underline cursor-pointer">may apply</span>
                        </p>
                    </div>

                    <div className="flex items-start gap-3">
                        <Leaf size={20} className="text-gray-800 flex-shrink-0 mt-0.5" fill="currentColor" />
                        <p className="text-xs text-gray-600 leading-relaxed">
                            FlipZon invests in climate solutions like electric trucks and carbon offsets for every delivery. <span className="underline cursor-pointer font-medium text-gray-800">See how</span>
                        </p>
                    </div>
                 </div>

              </div>
          )}

        </div>
        
        {/* Right Column: Price Details (Sticky on Desktop) */}
        <div className="lg:col-span-1 hidden md:block">
            <div className="sticky top-24">
                <PriceDetailsCard />
            </div>
        </div>
      </div>
    </div>
  );
};
