import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PartyPopper, Cake, CalendarHeart, HeartHandshake, Heart, ChevronRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { OCCASION_PRODUCTS } from '../data/mockData';
import { ProductCard } from './ProductCard';

interface TailoredOccasionsProps {
  mode: 'jewellery' | 'gifts';
}

const OCCASIONS = [
  { id: 'new-year', label: 'New Year', icon: PartyPopper },
  { id: 'birthday', label: 'Birthday', icon: Cake },
  { id: 'anniversary', label: 'Anniversary', icon: CalendarHeart },
  { id: 'wedding', label: 'Wedding', icon: HeartHandshake },
  { id: 'romance', label: 'Love N Romance', icon: Heart },
];

export const TailoredOccasions = ({ mode }: TailoredOccasionsProps) => {
  const [activeTab, setActiveTab] = useState('new-year');
  const navigate = useNavigate();
  const { products: allDbProducts } = useProducts(); // Get live data

  // Helper to get products and merge with live DB data
  const getOccasionProducts = (mode: 'jewellery' | 'gifts', occasion: string) => {
    const prefix = mode === 'jewellery' ? 'j_' : 'g_';
    
    const occasionCodeMap: Record<string, string> = {
      'new-year': 'ny',
      'birthday': 'bd',
      'anniversary': 'an',
      'wedding': 'wd',
      'romance': 'rm'
    };

    const code = occasionCodeMap[occasion];
    const searchPrefix = `${prefix}${code}`;

    // 1. Find matching mock items to get IDs
    const matchingMockItems = OCCASION_PRODUCTS.filter(p => p.id.startsWith(searchPrefix));

    // 2. Map to live DB items if they exist
    return matchingMockItems.map(mockItem => {
        const liveItem = allDbProducts.find(dbItem => dbItem.id === mockItem.id);
        return liveItem || mockItem;
    });
  };

  // Limit to 6 products for the 1x6 grid
  const products = getOccasionProducts(mode, activeTab).slice(0, 6);
  const activeLabel = OCCASIONS.find(o => o.id === activeTab)?.label || 'Occasion';

  const handleViewAll = () => {
    const suffix = mode === 'jewellery' ? 'Jewellery' : 'Gifts';
    navigate(`/search?q=${encodeURIComponent(`${activeLabel} ${suffix}`)}`);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-2 md:px-4 mb-12 mt-8 font-sans">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 font-serif px-2">Tailored For Your Occasions</h2>

      {/* Tabs - Professional Design */}
      <div className="grid grid-cols-5">
        {OCCASIONS.map((occ) => (
          <button
            key={occ.id}
            onClick={() => setActiveTab(occ.id)}
            className={`flex flex-col items-center justify-center gap-1 md:gap-2 py-3 md:py-4 transition-all relative rounded-t-xl md:rounded-t-2xl ${
              activeTab === occ.id 
                ? 'bg-[#f4f1ea] text-[#424d34] font-bold border-t-[4px] border-[#424d34] z-10 shadow-sm' 
                : 'bg-white text-gray-400 hover:bg-gray-50 border-t-[4px] border-transparent border-b border-gray-100'
            }`}
          >
            <occ.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={activeTab === occ.id ? 2 : 1.5} />
            <span className="text-[9px] md:text-xs text-center leading-tight px-0.5">{occ.label}</span>
          </button>
        ))}
      </div>

      {/* Product Grid - Matching Background for Seamless Look */}
      <div className="bg-[#f4f1ea] p-2 md:p-6 rounded-b-xl rounded-tr-xl shadow-sm min-h-[400px]">
        
        {/* 1x6 Grid Layout (6 columns on large screens) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>

        <div className="flex justify-center mt-8 md:mt-10">
            <button 
                onClick={handleViewAll}
                className="flex items-center gap-1 bg-white border border-[#424d34] text-[#424d34] px-6 md:px-8 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm hover:bg-[#f4f1ea] transition-colors shadow-sm uppercase tracking-wide"
            >
                View All {activeLabel} {mode === 'jewellery' ? 'Jewellery' : 'Gifts'} <ChevronRight size={14} className="md:w-4 md:h-4" />
            </button>
        </div>
      </div>
    </div>
  );
};
