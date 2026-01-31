import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/mockData';
import { useContent } from '../context/ContentContext';

interface HeroSliderProps {
  mode?: 'jewellery' | 'gifts';
}

export const HeroSlider = ({ mode = 'jewellery' }: HeroSliderProps) => {
  const [current, setCurrent] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { assets } = useContent();

  // Construct slides dynamically from assets if available, else fallback
  const ALL_SLIDES = [
    // JEWELLERY SLIDES
    {
      id: 1,
      type: 'jewellery',
      image: assets['hero_jewel_1'] || "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop",
      subtitle: "Forever Yours",
      title: "The Wedding Collection",
      cta: "SHOP RINGS",
      link: "/search?category=Rings",
      overlayColor: "bg-black/30" 
    },
    {
      id: 2,
      type: 'jewellery',
      image: assets['hero_jewel_2'] || "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2070&auto=format&fit=crop",
      subtitle: "Timeless Elegance",
      title: "Gold & Diamond Sets",
      cta: "EXPLORE LUXURY",
      link: "/search?category=Gold",
      overlayColor: "bg-black/40"
    },
    // GIFTS SLIDES
    {
      id: 3,
      type: 'gifts',
      image: assets['hero_gift_1'] || "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=2070&auto=format&fit=crop",
      subtitle: "Make Them Smile",
      title: "Perfect Gifts for Her",
      cta: "GIFT NOW",
      link: "/search?category=Gift Sets",
      overlayColor: "bg-black/20"
    },
    {
      id: 4,
      type: 'gifts',
      image: assets['hero_gift_2'] || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2070&auto=format&fit=crop",
      subtitle: "Wrapped with Love",
      title: "Luxury Gift Hampers",
      cta: "SHOP HAMPERS",
      link: "/search?q=Hamper",
      overlayColor: "bg-black/30"
    }
  ];

  // Filter slides based on mode
  const slides = ALL_SLIDES.filter(slide => slide.type === mode);

  // Reset current slide when mode changes to avoid index out of bounds
  useEffect(() => {
    setCurrent(0);
  }, [mode]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const categoryMatch = CATEGORIES.find(c => c.name.toLowerCase() === searchQuery.trim().toLowerCase());
      if (categoryMatch) {
        navigate(`/search?category=${encodeURIComponent(categoryMatch.name)}`);
      } else {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden group bg-gray-900">
      <AnimatePresence mode='wait'>
        <motion.div
          key={`${mode}-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className={`absolute inset-0 ${slides[current].overlayColor} z-10 transition-colors duration-700`} />
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center px-4 text-center max-w-4xl mx-auto">
        <AnimatePresence mode='wait'>
            <motion.div
                key={`${mode}-${current}-text`}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col items-center"
            >
                <h3 className="text-white text-lg md:text-xl font-medium tracking-wide mb-2 drop-shadow-md font-serif italic">
                    FlipZon {mode === 'jewellery' ? 'Jewels' : 'Gifting'}
                </h3>
                <span className="text-[#d4af37] text-sm md:text-base font-bold tracking-wider uppercase mb-1 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-[#d4af37]/30">
                    {slides[current].subtitle}
                </span>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl font-serif">
                    {slides[current].title}
                </h1>
                
                <button 
                    onClick={() => navigate(slides[current].link)}
                    className="bg-[#d4af37] hover:bg-[#b5952f] text-black px-8 py-3 rounded-full font-bold text-sm tracking-wider transition-all duration-300 shadow-xl mb-10 border-2 border-transparent hover:border-white/30 transform hover:scale-105"
                >
                    {slides[current].cta}
                </button>
            </motion.div>
        </AnimatePresence>

        <motion.form 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="w-full max-w-2xl relative z-30"
        >
            <div className="relative flex items-center group/search">
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={mode === 'jewellery' ? "Search for 'Diamond Rings', 'Gold Necklaces'..." : "Search for 'Gift Hampers', 'Chocolates'..."}
                    className="w-full bg-white/95 backdrop-blur-md rounded-full py-4 pl-8 pr-16 text-gray-800 placeholder-gray-500 outline-none shadow-2xl text-sm md:text-base focus:ring-4 focus:ring-[#d4af37]/50 transition-all border border-white/50"
                />
                <button 
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#d4af37] hover:bg-[#b5952f] text-black font-bold p-3 rounded-full transition-all shadow-sm flex items-center justify-center aspect-square h-auto group-hover/search:scale-105"
                >
                    <Search size={20} />
                </button>
            </div>
        </motion.form>
      </div>

      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 border border-white/10 hover:scale-110">
        <ChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 border border-white/10 hover:scale-110">
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${current === idx ? 'bg-[#d4af37] w-8' : 'bg-white/50 w-2 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </div>
  );
};
