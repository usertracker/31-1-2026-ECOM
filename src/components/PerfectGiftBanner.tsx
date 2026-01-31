import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

export const PerfectGiftBanner = () => {
  const navigate = useNavigate();
  const { assets } = useContent();

  const image = assets['banner_perfect_gift'] || "https://cdn3d.iconscout.com/3d/premium/thumb/gift-box-4392087-3652564.png";

  return (
    <div className="max-w-[1600px] mx-auto px-4 mb-12 mt-8 font-sans">
      <div 
        onClick={() => navigate('/search?q=gifts')}
        className="relative w-full h-[220px] bg-[#ffebee] border-y-2 border-[#ef5350] overflow-hidden flex items-center justify-between px-6 md:px-12 cursor-pointer group"
      >
        {/* Text Content - Left Side */}
        <div className="relative z-30 max-w-xl flex flex-col justify-center h-full pt-4">
          <h2 className="text-4xl md:text-5xl font-bold text-[#d32f2f] mb-3 tracking-tight font-sans">
            Find The Perfect Gift
          </h2>
          <p className="text-[#b71c1c] text-sm md:text-lg font-medium tracking-wide max-w-md leading-relaxed">
            Discover Gifts by Recipient, Relationships & <br/> Occasions.
          </p>
          
          <button className="mt-6 bg-[#d32f2f] text-white px-8 py-3 rounded-sm font-bold text-sm tracking-wider shadow-sm hover:bg-[#b71c1c] transition-all w-fit uppercase transform group-hover:translate-x-1">
            START SEARCH
          </button>
        </div>

        {/* 3D Floating Gifts Composition */}
        <div className="absolute inset-0 pointer-events-none">
           {/* 1. Blurred Background Box (Center) */}
           <div className="absolute top-[30%] left-[45%] w-24 opacity-60 blur-[2px]">
              <img 
                src={image} 
                className="w-full h-full object-contain grayscale-[0.2]"
                alt="Gift Blur"
              />
           </div>
           
           {/* 2. Blurred Foreground Box (Bottom Center) */}
           <div className="absolute bottom-[10%] left-[55%] w-32 opacity-80 blur-[1px] transform rotate-12">
              <img 
                src={image} 
                className="w-full h-full object-contain"
                alt="Gift Blur Mid"
              />
           </div>

           {/* 3. Main Hero Box (Right Edge) */}
           <div className="absolute top-1/2 right-[-40px] md:right-[-20px] -translate-y-1/2 w-72 md:w-[450px] h-[150%] z-20 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-2">
              <img 
                src={image} 
                className="w-full h-full object-contain drop-shadow-2xl"
                alt="Main Gift"
              />
           </div>
        </div>
      </div>
    </div>
  );
};
