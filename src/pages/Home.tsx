import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/mockData';
import { useProducts } from '../context/ProductContext';
import { useContent } from '../context/ContentContext';
import { DealOfTheDay } from '../components/DealOfTheDay';
import { CuratedGrid } from '../components/CuratedGrid';
import { Newsletter } from '../components/Newsletter';
import { HeroSlider } from '../components/HeroSlider';
import { ServiceFeatures } from '../components/ServiceFeatures';
import { DeliveryUpdates } from '../components/DeliveryUpdates';
import { MostLovedGifts } from '../components/MostLovedGifts'; 
import { SpecialDeal } from '../components/SpecialDeal';
import { BestsellerBanner } from '../components/BestsellerBanner';
import { BuyingGuideBanner } from '../components/BuyingGuideBanner';
import { TailoredOccasions } from '../components/TailoredOccasions';
import { CustomerImpression } from '../components/CustomerImpression';
import { CelebrationsCalendar } from '../components/CelebrationsCalendar';
import { ProductCard } from '../components/ProductCard';
import { ChevronRight, Gem, Gift } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Home = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { assets } = useContent();
  const { t } = useLanguage();
  
  // State for the View Mode Toggle
  const [viewMode, setViewMode] = useState<'jewellery' | 'gifts'>('jewellery');

  // Filter products for "Handpicked" based on mode
  const displayedProducts = products.filter(p => {
    if (viewMode === 'jewellery') {
      return ['Rings', 'Necklaces', 'Earrings', 'Gold', 'Silver', 'Watches'].includes(p.category);
    } else {
      return ['Gift Sets', 'Personalized', 'Flowers', 'Cakes', 'Plants'].includes(p.category) || p.category === 'Gift Sets';
    }
  });

  // Helper to get category image from assets or fallback
  const getCategoryImage = (cat: any) => {
    const key = `cat_${cat.name.toLowerCase().replace(/\s+/g, '_')}`;
    return assets[key] || cat.image;
  };

  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-0 font-sans flex flex-col">
      
      {/* Dynamic Hero Slider */}
      <HeroSlider mode={viewMode} />

      <div className="bg-white shadow-sm z-10 relative mb-4 border-t border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-6 md:gap-10 min-w-full">
            {CATEGORIES.map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => navigate(`/search?category=${encodeURIComponent(cat.name)}`)}
                className="flex flex-col items-center gap-2 cursor-pointer min-w-[70px] group flex-shrink-0 py-1"
              >
                <div className="w-16 h-16 md:w-18 md:h-18 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#d4af37] p-0.5 transition-all duration-300">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-50">
                    <img 
                      src={getCategoryImage(cat)} 
                      alt={cat.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-700 group-hover:text-[#d4af37] transition-colors whitespace-nowrap">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ServiceFeatures />

      {/* --- TOGGLE BUTTONS --- */}
      <div className="max-w-[1600px] mx-auto px-4 mb-8 mt-4">
        <div className="flex justify-center items-center">
            <div className="bg-white p-1.5 rounded-full shadow-md border border-gray-100 flex gap-2">
                <button
                    onClick={() => setViewMode('jewellery')}
                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${
                        viewMode === 'jewellery' 
                        ? 'bg-[#2874f0] text-white shadow-md' 
                        : 'bg-transparent text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    <Gem size={16} />
                    Jewellery
                </button>
                <button
                    onClick={() => setViewMode('gifts')}
                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${
                        viewMode === 'gifts' 
                        ? 'bg-[#fa4a6f] text-white shadow-md' 
                        : 'bg-transparent text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    <Gift size={16} />
                    Gifts
                </button>
            </div>
        </div>
      </div>

      {/* --- CONDITIONAL SECTIONS --- */}

      {/* Tailored Occasions Section */}
      <motion.div
        key={`occasions-${viewMode}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <TailoredOccasions mode={viewMode} />
      </motion.div>

      <div className="max-w-[1600px] mx-auto px-2 md:px-4 w-full space-y-4">
        
        {/* 2.5. Buying Guide Banner (Replaces Bestseller/Special Deal in Gifts Mode) */}
        {viewMode === 'gifts' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <BuyingGuideBanner />
            </motion.div>
        )}

        {/* 3. Most Loved Gifts (Only in Gifts Mode) */}
        {viewMode === 'gifts' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <MostLovedGifts />
            </motion.div>
        )}

        {/* 4. Jewelry Deals (Only in Jewellery Mode) */}
        {viewMode === 'jewellery' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <DealOfTheDay />
            </motion.div>
        )}

      </div>

      {/* Celebrations Calendar (Moved Below Deals) */}
      <CelebrationsCalendar mode={viewMode} />

      <div className="max-w-[1600px] mx-auto px-2 md:px-4 w-full space-y-4">

        {/* 5. Special Deal of the Day (Only in Jewellery Mode now, as Gifts has Buying Guide) */}
        {viewMode === 'jewellery' && (
            <motion.div 
                key={`special-${viewMode}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <SpecialDeal mode={viewMode} />
            </motion.div>
        )}

        {/* 6. Handpicked Products (Filtered) */}
        <motion.div 
          key={viewMode} 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-4 shadow-sm rounded-sm mb-4"
        >
          {/* Updated Header */}
          <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
            <div className="flex flex-col">
               <h2 className="text-2xl font-bold text-[#172337] font-serif leading-tight">
                   {viewMode === 'jewellery' ? t('handpicked_jewellery') : t('curated_gifts')}
               </h2>
               <p className="text-gray-400 text-xs mt-2 font-medium">{t('exquisite_designs')}</p>
            </div>
            <Link to="/search" className="bg-[#2874f0] text-white px-4 py-2 rounded-md text-xs font-bold shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2 h-fit mt-1">
              <div className="flex flex-col leading-none text-left">
                  <span>{t('view_all').split(' ')[0]}</span>
                  <span>{t('view_all').split(' ')[1] || 'All'}</span>
              </div>
              <ChevronRight size={14} />
            </Link>
          </div>
          
          {/* Grid updated to show 6 items perfectly */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {displayedProducts.length > 0 ? (
                displayedProducts.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
            ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                    {t('no_results')}
                </div>
            )}
          </div>

          {/* View More Button at Bottom */}
          <div className="mt-8 flex justify-center border-t border-gray-100 pt-6">
              <button 
                onClick={() => navigate('/search')}
                className="px-10 py-3 rounded-full border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 hover:text-black transition-all shadow-sm flex items-center gap-2 group"
              >
                View More {viewMode === 'jewellery' ? 'Jewellery' : 'Gifts'}
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
          </div>

        </motion.div>

        {/* 7. Curated Grid (Only in Jewellery Mode) */}
        {viewMode === 'jewellery' && <CuratedGrid />}

      </div>

      {/* 8. Brand Strip REMOVED */}

      {/* 9. Jewellery Bestseller Banner (Only in Jewellery Mode) */}
      {viewMode === 'jewellery' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <BestsellerBanner mode="jewellery" />
          </motion.div>
      )}

      <Newsletter />
      
      {/* Customer Impression Section */}
      <CustomerImpression />

      <DeliveryUpdates />

    </div>
  );
};
