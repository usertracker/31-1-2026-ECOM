import React, { useState, useEffect } from 'react';
import { X, Heart, User, Coins, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Simple Sparkle Icon Component
const SparkleIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
);

export const SpinWheelModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const auth = useAuth();
  const navigate = useNavigate();

  // Trigger after 2 minutes (120000 ms)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const hasSeen = sessionStorage.getItem('hasSeenWelcomeModal');
      // Only show if user is NOT already logged in
      if (!hasSeen && !auth.isAuthenticated) {
        setIsOpen(true);
      }
    }, 120000); 

    return () => window.clearTimeout(timer);
  }, [auth.isAuthenticated]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenWelcomeModal', 'true');
  };

  const handleLoginRedirect = () => {
    handleClose();
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />
        
        {/* Modal Content - Beige Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-[#FFF8E7] rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row md:min-h-[500px] max-h-[85vh] md:max-h-none overflow-y-auto md:overflow-visible"
        >
          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="absolute top-2 right-2 md:top-4 md:right-4 z-20 p-2 text-gray-500 hover:text-gray-800 transition-colors bg-white/50 rounded-full md:bg-transparent"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>

          {/* Left Side - Promotional Content */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col items-center justify-center relative text-center border-b md:border-b-0 md:border-r border-[#E6C68B]/30">
             
             {/* Decorative Sparkles */}
             <div className="absolute top-4 left-4 md:top-10 md:left-10 text-[#E6C68B] opacity-60"><SparkleIcon size={16} className="md:w-6 md:h-6" /></div>
             <div className="absolute bottom-4 right-4 md:bottom-20 md:right-10 text-[#E6C68B] opacity-60"><SparkleIcon size={14} className="md:w-5 md:h-5" /></div>
             <div className="absolute top-1/2 left-2 md:left-4 text-[#E6C68B] opacity-40"><SparkleIcon size={12} className="md:w-4 md:h-4" /></div>

             {/* Gift Box Circle */}
             <div className="relative w-32 h-32 md:w-64 md:h-64 mb-4 md:mb-6 mt-2 md:mt-0">
                <div className="absolute inset-0 rounded-full border-2 border-[#E6C68B]/30 animate-spin-slow"></div>
                <div className="absolute inset-2 md:inset-4 rounded-full bg-gradient-to-b from-white/40 to-transparent flex items-center justify-center">
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/4520/4520931.png" 
                        alt="Gift Box" 
                        className="w-16 h-16 md:w-32 md:h-32 object-contain drop-shadow-xl transform hover:scale-110 transition-transform duration-500"
                    />
                </div>
             </div>

             {/* Offer Banner */}
             <div className="relative mb-4 md:mb-8 w-full max-w-[200px] md:max-w-xs">
                 <div className="absolute inset-0 bg-[#F3E5C2] transform skew-x-12 rounded-sm opacity-50"></div>
                 <div className="relative bg-gradient-to-r from-[#FDFBF7] via-[#FFF] to-[#FDFBF7] border-y border-[#E6C68B] py-2 px-4 md:py-3 md:px-6 shadow-sm">
                     <p className="text-gray-600 text-[10px] md:text-xs uppercase tracking-widest mb-0.5 md:mb-1">On your first order get</p>
                     <h3 className="text-xl md:text-3xl font-bold text-[#8B5E3C] font-serif">₹500 off</h3>
                 </div>
             </div>

             {/* Benefits */}
             <div className="w-full">
                 <h4 className="text-[#8B5E3C] font-serif text-sm md:text-lg mb-3 md:mb-4">And other benefits</h4>
                 <div className="flex justify-center gap-4 md:gap-6">
                     <div className="flex flex-col items-center gap-1">
                         <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#E6C68B] flex items-center justify-center text-white">
                             <Coins size={12} className="md:w-[14px] md:h-[14px]" />
                         </div>
                         <span className="text-[9px] md:text-[10px] text-gray-600 max-w-[50px] md:max-w-[60px] leading-tight">FlipZon Coins</span>
                     </div>
                     <div className="flex flex-col items-center gap-1">
                         <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#D65A5A] flex items-center justify-center text-white">
                             <Heart size={12} className="md:w-[14px] md:h-[14px]" />
                         </div>
                         <span className="text-[9px] md:text-[10px] text-gray-600 max-w-[50px] md:max-w-[60px] leading-tight">Unlock Wishlist</span>
                     </div>
                     <div className="flex flex-col items-center gap-1">
                         <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#4A6FA5] flex items-center justify-center text-white">
                             <User size={12} className="md:w-[14px] md:h-[14px]" />
                         </div>
                         <span className="text-[9px] md:text-[10px] text-gray-600 max-w-[50px] md:max-w-[60px] leading-tight">Personalized Shopping</span>
                     </div>
                 </div>
             </div>
          </div>

          {/* Right Side - Login Form Card */}
          <div className="w-full md:w-1/2 p-6 md:p-12 flex items-center justify-center bg-white md:bg-transparent">
            <div className="bg-white rounded-xl shadow-none md:shadow-lg p-6 md:p-10 w-full max-w-sm relative text-center">
                <div className="mb-6 md:mb-8">
                    <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-1 md:mb-2 font-serif">Welcome to FlipZon!</h2>
                    <p className="text-gray-500 text-xs md:text-sm">Login or Signup to unlock exclusive offers</p>
                </div>

                <button 
                    onClick={handleLoginRedirect}
                    className="w-full bg-[#9D2235] hover:bg-[#7a1b29] text-white font-medium py-3 md:py-4 rounded-full shadow-md transition-all transform active:scale-[0.98] text-sm md:text-base flex items-center justify-center gap-2"
                >
                    Login / Sign Up <ChevronRight size={18} />
                </button>

                <div className="mt-6 md:mt-8 text-center">
                    <p className="text-[9px] md:text-[10px] text-gray-400">
                        By continuing, I agree to <a href="#" className="underline hover:text-gray-600">Terms of Use</a> & <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>
                    </p>
                </div>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
