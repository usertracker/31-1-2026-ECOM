import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { Product, OCCASION_PRODUCTS, DEAL_PRODUCTS } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { Filter, ArrowLeft, SortAsc, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const collectionTitle = searchParams.get('collection');
  const { products } = useProducts();
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState(100000);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile Filter State

  useEffect(() => {
    // Combine all available products for search (Main DB + Mock Occasions + Deals)
    const allProductsMap = new Map();
    [...products, ...OCCASION_PRODUCTS, ...DEAL_PRODUCTS].forEach(p => {
        allProductsMap.set(p.id, p);
    });
    let result = Array.from(allProductsMap.values());

    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.category.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery) ||
        p.specs?.some(s => s.toLowerCase().includes(lowerQuery))
      );
    }

    if (category) {
      result = result.filter(p => p.category === category);
    }

    result = result.filter(p => p.price <= priceRange);

    setFilteredProducts(result);
  }, [query, category, priceRange, products]);

  // Reusable Filter Content
  const FilterContent = () => (
    <>
        <div className="mb-6">
            <h3 className="text-xs font-bold uppercase text-gray-500 mb-3 tracking-wide">Price Range</h3>
            <input 
            type="range" 
            min="0" 
            max="100000" 
            value={priceRange} 
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-sm mt-2 font-medium text-gray-700">
            <span>₹0</span>
            <span>₹{priceRange.toLocaleString()}+</span>
            </div>
        </div>
        
        <div className="mb-4">
            <h3 className="text-xs font-bold uppercase text-gray-500 mb-3 tracking-wide">Availability</h3>
            <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" id="stock" className="accent-black" defaultChecked />
                <label htmlFor="stock" className="text-sm text-gray-700">In Stock</label>
            </div>
            <div className="flex items-center gap-2">
                <input type="checkbox" id="fast" className="accent-black" />
                <label htmlFor="fast" className="text-sm text-gray-700">Fast Delivery</label>
            </div>
        </div>
    </>
  );

  return (
    <div className="bg-gray-100 min-h-screen py-4 font-sans">
      <div className="max-w-[1600px] mx-auto px-4">
        
        {/* Collection Header */}
        {collectionTitle && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full md:hidden">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">{collectionTitle} Collection</h1>
                    </div>
                    <p className="text-gray-500 text-sm">Handpicked selections for your special moments</p>
                </div>
                <div className="text-right hidden md:block">
                    <span className="text-3xl font-bold text-[#d4af37]">{filteredProducts.length}</span>
                    <span className="text-gray-500 text-sm block">{t('items')} Found</span>
                </div>
            </div>
        )}

        {/* Mobile Filter Bar (Not Sticky anymore) */}
        <div className="md:hidden flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-100 mb-4">
            <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 text-sm font-bold text-gray-700 w-1/2 justify-center border-r border-gray-200"
            >
                <Filter size={16} /> Filters
            </button>
            <button className="flex items-center gap-2 text-sm font-bold text-gray-700 w-1/2 justify-center">
                <SortAsc size={16} /> Sort
            </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
            
            {/* Sidebar Filters - Desktop Only */}
            <div className="hidden md:block w-full md:w-1/5 bg-white shadow-sm rounded-lg p-5 h-fit border border-gray-100 sticky top-24">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                    <Filter size={18} className="text-gray-500" />
                </div>
                <FilterContent />
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {isFilterOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsFilterOpen(false)}
                            className="fixed inset-0 bg-black/50 z-[60] md:hidden backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 w-[85%] bg-white z-[70] md:hidden shadow-2xl flex flex-col"
                        >
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1">
                                <FilterContent />
                            </div>
                            <div className="p-4 border-t border-gray-100 bg-white">
                                <button 
                                    onClick={() => setIsFilterOpen(false)}
                                    className="w-full bg-black text-white py-3 rounded-lg font-bold text-sm shadow-md"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Results Grid */}
            <div className="flex-1">
                {!collectionTitle && (
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4 flex justify-between items-center">
                        <h1 className="text-lg font-medium text-gray-800">
                            {query ? `${t('search_results')} "${query}"` : category ? `${category}` : 'All Products'}
                            <span className="text-gray-500 text-sm ml-2">({filteredProducts.length} {t('items')})</span>
                        </h1>
                        <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-black">
                            <SortAsc size={16} /> Sort by
                        </div>
                    </div>
                )}

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-gray-100">
                    <img 
                        src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-no-search-results_2353c5.png" 
                        alt="No Results" 
                        className="w-48 mb-4 opacity-80"
                    />
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{t('no_results')}</h3>
                    <p className="text-gray-500">Please check the spelling or try searching for something else</p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};
