import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export const BuyingGuideBanner = () => {
  const navigate = useNavigate();
  const { assets } = useContent();

  const image = assets['banner_buying_guide'] || "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="max-w-[1600px] mx-auto px-4 mb-8 mt-8 font-sans">
      <div 
        onClick={() => navigate('/search?q=guide')}
        className="relative w-full h-[140px] md:h-[160px] rounded-lg overflow-hidden flex items-center justify-between px-6 md:px-16 cursor-pointer group shadow-sm"
        style={{ background: 'linear-gradient(90deg, #b89f72 0%, #cbb389 50%, #b89f72 100%)' }}
      >
        {/* Text Content - Left Side */}
        <div className="relative z-20 flex flex-col justify-center h-full">
          <h2 className="text-3xl md:text-4xl font-normal text-white mb-1 tracking-wide font-serif">
            Not sure what to buy?
          </h2>
          <p className="text-white/90 text-sm md:text-base font-medium tracking-wide">
            Let us help you in making that decision
          </p>
        </div>

        {/* Center Image (Necklace Bust) - Simulated with CSS/Image */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-10">
            <img 
                src={image}
                alt="Jewelry Guide" 
                className="h-[200%] w-auto object-cover opacity-40 mix-blend-overlay mask-image-gradient"
                style={{ maskImage: 'linear-gradient(to right, transparent, black, transparent)' }}
            />
        </div>

        {/* Button - Right Side */}
        <div className="relative z-20 hidden md:block">
          <button className="bg-[#6d2020] text-white pl-6 pr-4 py-3 rounded-full font-bold text-sm tracking-wide shadow-lg hover:bg-[#5a1a1a] transition-all flex items-center gap-2 group-hover:scale-105">
            View Buying Guides <ChevronRight size={16} className="bg-white/10 rounded-full p-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
