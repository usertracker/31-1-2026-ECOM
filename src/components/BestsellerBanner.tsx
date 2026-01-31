import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';

interface BestsellerBannerProps {
  mode?: 'jewellery' | 'gifts';
}

export const BestsellerBanner = ({ mode = 'gifts' }: BestsellerBannerProps) => {
  const navigate = useNavigate();
  const { assets } = useContent();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Additional Images for Jewellery Slider
  const JEWELLERY_IMAGES = [
    assets['banner_bestseller_jewel'] || "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1602751584552-8ba42d523f17?q=80&w=2000&auto=format&fit=crop", // Ring
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2000&auto=format&fit=crop"  // Gold
  ];

  // Auto-slide logic for Jewellery mode
  useEffect(() => {
    if (mode === 'jewellery') {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % JEWELLERY_IMAGES.length);
        }, 4000);
        return () => clearInterval(timer);
    }
  }, [mode]);

  const config = {
    gifts: {
      title: "Bestseller Gifts",
      image: assets['banner_bestseller_gifts'] || "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=2000&auto=format&fit=crop",
      bgColor: "bg-[#fdf0f0]",
      gradient: "bg-gradient-to-r from-transparent via-[#fdf0f0]/60 to-[#fdf0f0]",
      textColor: "text-gray-900",
      subTextColor: "text-gray-700",
      buttonColor: "bg-black hover:bg-gray-800 text-white",
      overlay: ""
    },
    jewellery: {
      title: "Trending Jewellery",
      images: JEWELLERY_IMAGES,
      bgColor: "bg-gray-900", 
      gradient: "", // Removed white shade
      textColor: "text-white",
      subTextColor: "text-gray-200",
      buttonColor: "bg-white hover:bg-gray-100 text-black",
      overlay: "bg-black/30" // Subtle dark overlay for readability
    }
  };

  const current = config[mode];

  return (
    <div className="max-w-[1600px] mx-auto px-4 mb-6 mt-8 font-sans">
      <h2 className="text-xl font-bold text-[#172337] mb-4 font-serif">{current.title}</h2>
      
      <div 
        className={`relative w-full h-[240px] md:h-[280px] ${current.bgColor} rounded-sm overflow-hidden flex items-center cursor-pointer group`} 
        onClick={() => navigate('/search?q=Bestseller')}
      >
        
        {/* Background Image Layer */}
        <div className="absolute inset-0 w-full h-full">
            {mode === 'jewellery' ? (
                <AnimatePresence mode='wait'>
                    <motion.img 
                        key={currentSlide}
                        src={JEWELLERY_IMAGES[currentSlide]} 
                        alt="Trending Jewellery" 
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                </AnimatePresence>
            ) : (
                <img 
                    src={current.image} 
                    alt={current.title} 
                    className="w-full h-full object-cover object-left opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
            )}
            
            {/* Gradient / Overlay */}
            <div className={`absolute inset-0 ${current.gradient || current.overlay}`}></div>
        </div>

        {/* Content - Right Aligned */}
        <div className="relative z-10 ml-auto w-full md:w-1/2 p-8 md:p-16 flex flex-col items-start justify-center text-left h-full">
            <h3 className={`text-3xl md:text-4xl font-bold ${current.textColor} mb-2 tracking-tight uppercase drop-shadow-md`}>
                CUSTOMER FAVORITES
            </h3>
            <p className={`${current.subTextColor} text-lg mb-8 font-medium drop-shadow-sm`}>
                Loved & rated best for all celebrations
            </p>
            
            <button className={`${current.buttonColor} px-8 py-3 rounded-full text-sm font-bold tracking-wider transition-all shadow-lg transform group-hover:translate-x-2`}>
                SHOP BESTSELLERS
            </button>
        </div>

        {/* Dots Indicator for Jewellery Mode */}
        {mode === 'jewellery' && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {JEWELLERY_IMAGES.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                    />
                ))}
            </div>
        )}

      </div>
    </div>
  );
};
