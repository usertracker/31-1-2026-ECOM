import React, { useState, useEffect } from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../lib/utils';
import { DEAL_PRODUCTS } from '../data/mockData';
import { useProducts } from '../context/ProductContext';

export const DealOfTheDay = () => {
  const navigate = useNavigate();
  const { products } = useProducts(); // Get live products from DB
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 0, seconds: 0 });

  // Merge Mock Data with Live DB Data
  // This ensures that if you update an image/price in Admin, it shows up here
  const displayProducts = DEAL_PRODUCTS.map(mockProduct => {
    const liveProduct = products.find(p => p.id === mockProduct.id);
    return liveProduct || mockProduct;
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 }; 
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const formatTime = (val: number) => val.toString().padStart(2, '0');

  return (
    <div className="bg-white p-4 mb-3 shadow-sm rounded-sm relative overflow-hidden">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-gray-100 pb-4 gap-3">
        
        {/* Title and Timer Row */}
        <div className="flex justify-between items-start md:items-center w-full md:w-auto gap-4">
          <h2 className="text-xl font-bold text-gray-800 font-serif leading-tight max-w-[60%] md:max-w-none">
            Jewelry Deals of the Day
          </h2>
          
          {/* Timer Box - Fixed width and layout to prevent stacking */}
          <div className="flex flex-col md:flex-row items-center justify-center bg-[#fff0f0] px-3 py-2 rounded-md border border-red-100 min-w-[110px] md:min-w-0">
            <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#e42529] md:hidden" />
                <span className="text-[#e42529] font-bold font-mono text-sm whitespace-nowrap tracking-wider">
                {formatTime(timeLeft.hours)} : {formatTime(timeLeft.minutes)} : {formatTime(timeLeft.seconds)}
                </span>
            </div>
            <span className="text-[10px] text-red-400 font-bold uppercase mt-1 md:mt-0 md:ml-2">Left</span>
          </div>
        </div>

        {/* View All Button - Full width on mobile */}
        <button 
          onClick={() => navigate('/search')}
          className="w-full md:w-auto bg-[#2874f0] text-white px-6 py-2.5 rounded-sm text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
        >
          View All Deals <ChevronRight size={16} />
        </button>
      </div>

      {/* Scrollable Product List - Manual Slide, No Arrows on Mobile */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 scroll-smooth snap-x">
        {displayProducts.map((product) => (
          <div 
            key={product.id} 
            onClick={() => navigate(`/product/${product.id}`)}
            className="min-w-[160px] w-[160px] md:min-w-[200px] md:w-[200px] border border-gray-100 rounded-lg p-3 hover:shadow-lg transition-all cursor-pointer group flex flex-col items-center text-center snap-start bg-white"
          >
            <div className="h-32 w-full flex items-center justify-center mb-3 overflow-hidden bg-gray-50 rounded-md relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/200x200?text=No+Image'; }}
              />
              {/* Discount Badge inside image for better mobile space usage */}
              <div className="absolute bottom-0 left-0 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-tr-md">
                {product.discount}% OFF
              </div>
            </div>
            
            <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 h-10 w-full leading-tight group-hover:text-[#2874f0]">
                {product.name}
            </h3>
            
            <div className="flex flex-col items-center w-full mt-auto">
              <span className="font-bold text-lg text-gray-900">{formatPrice(product.price)}</span>
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
