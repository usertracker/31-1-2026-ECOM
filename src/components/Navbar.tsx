import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, ChevronDown, Smartphone, Globe, Search, LogOut, Heart, Package, CircleUser, RefreshCw, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../data/mockData';
import { AnimatePresence, motion } from 'framer-motion';
import { DownloadAppModal } from './DownloadAppModal';
import { BRANDS, CATEGORIES } from '../data/mockData';
import { LanguageModal } from './LanguageModal';

// Custom Stylish Menu Icon to match reference
const StylishMenuIcon = ({ size = 24, color = "currentColor" }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 7H21" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 12H15" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 17H21" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#f8f9fa] text-[#212529] text-[10px] md:text-sm py-2 px-2 md:px-4 flex justify-center items-center relative border-b border-gray-200 z-[60]">
      <div className="flex items-center gap-2 md:gap-4 pr-6 md:pr-0">
        <span className="font-medium truncate max-w-[220px] md:max-w-none">Holiday Savings Inside, Christmas Bliss Here</span>
        <button className="bg-[#ffc107] hover:bg-[#ffca2c] text-black font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs transition-colors whitespace-nowrap flex-shrink-0">
          Shop Now
        </button>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-2 md:right-4 text-gray-500 hover:text-gray-800 p-1"
      >
        <div className="w-4 h-4 flex items-center justify-center font-bold">×</div>
      </button>
    </div>
  );
};

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [isCatsOpen, setIsCatsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  
  // Sticky Logic State
  const [isNavHidden, setIsNavHidden] = useState(false);
  
  // Responsive Placeholder State
  const { t, language } = useLanguage();
  const [searchPlaceholder, setSearchPlaceholder] = useState(t('search_placeholder'));

  const { cartCount, isSyncing } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();
  const { products } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Update placeholder based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSearchPlaceholder('Search');
      } else {
        setSearchPlaceholder(t('search_placeholder'));
      }
    };

    handleResize(); // Set initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [t, language]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        // Don't clear if clicking inside the dropdown itself (which is fixed positioned)
        const dropdown = document.getElementById('search-dropdown');
        if (dropdown && dropdown.contains(event.target as Node)) {
            return;
        }
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll Listener for Sticky/Hide Logic on Product Page
  useEffect(() => {
    const handleScroll = () => {
        // Only apply logic on product details page
        if (location.pathname.startsWith('/product/')) {
            const triggerSection = document.getElementById('similar-products-trigger');
            
            if (triggerSection) {
                const rect = triggerSection.getBoundingClientRect();
                // If the similar products section hits the top area (navbar height approx 70px)
                // We hide the navbar
                if (rect.top <= 100) {
                    setIsNavHidden(true);
                } else {
                    setIsNavHidden(false);
                }
            }
        } else {
            setIsNavHidden(false);
        }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Search Suggestion Logic
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const results = products.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.category.toLowerCase().includes(query)
        ).slice(0, 5);
        setSuggestions(results);
    } else {
        setSuggestions([]);
    }
  }, [searchQuery, products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSuggestions([]);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const renderSuggestions = () => {
    return (
        <AnimatePresence>
            {searchQuery && (
                <motion.div 
                    id="search-dropdown"
                    initial={{ opacity: 0, y: -10, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: -10, x: "-50%" }}
                    transition={{ duration: 0.2 }}
                    className="fixed top-[75px] left-1/2 w-[90%] md:w-[80%] max-w-[800px] bg-white shadow-2xl rounded-2xl z-[70] overflow-hidden border border-gray-100"
                >
                    {suggestions.length > 0 ? (
                        suggestions.map(product => (
                            <div 
                                key={product.id}
                                onClick={() => {
                                    navigate(`/product/${product.id}`);
                                    setSearchQuery('');
                                    setSuggestions([]);
                                }}
                                className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                            >
                                <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-base font-bold text-gray-900 truncate">{product.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{product.category}</p>
                                </div>
                                <div className="text-base font-bold text-gray-900 whitespace-nowrap">
                                    ₹{product.price.toLocaleString('en-IN')}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No results found for "{searchQuery}"
                        </div>
                    )}
                    
                    <div 
                        onClick={() => {
                            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                            setSearchQuery('');
                            setSuggestions([]);
                        }}
                        className="p-4 text-center bg-blue-50/30 hover:bg-blue-50 cursor-pointer transition-colors border-t border-gray-100"
                    >
                        <span className="text-blue-600 font-bold text-sm">
                            View all results for "{searchQuery}"
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
  };

  return (
    <>
      <DownloadAppModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <LanguageModal isOpen={isLangModalOpen} onClose={() => setIsLangModalOpen(false)} />
      
      <div className="flex flex-col w-full font-sans">
        <AnnouncementBar />

        <nav 
            className={`bg-white text-gray-800 sticky top-0 z-50 shadow-sm border-b border-gray-100 h-[70px] transition-transform duration-300 ${isNavHidden ? '-translate-y-full' : 'translate-y-0'}`}
        >
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex items-center justify-between h-full gap-2 lg:gap-4">
              
              {/* Left Section: Menu & Logo */}
              <div className="flex items-center gap-2 lg:gap-8 flex-shrink-0">
                {/* Mobile Menu Button - Left */}
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-gray-800 p-1 -ml-2">
                  <StylishMenuIcon size={24} />
                </button>

                <Link to="/" className="flex-shrink-0 flex items-center gap-1">
                  <span className="font-bold text-xl lg:text-2xl tracking-tight text-[#2874f0]">FlipZon</span>
                </Link>

                <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
                  <div 
                    className="relative group"
                    onMouseEnter={() => setIsBrandsOpen(true)}
                    onMouseLeave={() => setIsBrandsOpen(false)}
                  >
                    <button className="flex items-center gap-1 hover:text-blue-600 py-4">
                      <span>Brands</span>
                      <ChevronDown size={14} className={`transition-transform ${isBrandsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isBrandsOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md border border-gray-100 overflow-hidden py-2 z-[60]"
                        >
                          {BRANDS.slice(0, 6).map(brand => (
                            <Link 
                              key={brand.id} 
                              to={`/search?q=${brand.name}`}
                              className="block px-4 py-2 hover:bg-gray-50 text-gray-700"
                              onClick={() => setIsBrandsOpen(false)}
                            >
                              {brand.name}
                            </Link>
                          ))}
                          <Link to="/search" onClick={() => setIsBrandsOpen(false)} className="block px-4 py-2 text-blue-600 font-medium hover:bg-gray-50 border-t border-gray-100">{t('view_all')}</Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div 
                    className="relative group"
                    onMouseEnter={() => setIsCatsOpen(true)}
                    onMouseLeave={() => setIsCatsOpen(false)}
                  >
                    <button className="flex items-center gap-1 hover:text-blue-600 py-4">
                      <span>Categories</span>
                      <ChevronDown size={14} className={`transition-transform ${isCatsOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isCatsOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md border border-gray-100 overflow-hidden py-2 z-[60]"
                        >
                          {CATEGORIES.slice(0, 6).map(cat => (
                            <Link 
                              key={cat.id} 
                              to={`/search?category=${cat.name}`}
                              className="block px-4 py-2 hover:bg-gray-50 text-gray-700"
                              onClick={() => setIsCatsOpen(false)}
                            >
                              {cat.name}
                            </Link>
                          ))}
                          <Link to="/search" onClick={() => setIsCatsOpen(false)} className="block px-4 py-2 text-blue-600 font-medium hover:bg-gray-50 border-t border-gray-100">{t('view_all')}</Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Center Section: Search Bar (Always Visible) */}
              <div className="flex-1 max-w-2xl px-2 lg:px-0 relative" ref={searchContainerRef}>
                  <form 
                      onSubmit={handleSearch} 
                      className="flex items-center bg-white rounded-full w-full pl-4 pr-1 py-1 shadow-sm ring-1 ring-gray-200 focus-within:ring-[#FFC200] transition-all"
                  >
                      <input 
                          type="text" 
                          className="flex-1 bg-transparent border-none outline-none text-xs lg:text-sm text-gray-700 placeholder-gray-500 w-full"
                          placeholder={searchPlaceholder}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button 
                          type="submit" 
                          className="bg-[#FFC200] hover:bg-[#ffb300] text-black p-2 rounded-full transition-colors flex-shrink-0 shadow-sm flex items-center justify-center h-8 w-8 lg:h-9 lg:w-9"
                      >
                          <Search size={16} className="lg:w-[18px] lg:h-[18px]" />
                      </button>
                  </form>
                  
                  {/* Suggestions Dropdown (Now Centered & Wide) */}
                  {renderSuggestions()}
              </div>

              {/* Right Section: Icons */}
              <div className="flex items-center gap-3 lg:gap-6 flex-shrink-0">
                
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="hidden md:flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2 rounded-md hover:bg-black transition-colors shadow-sm text-sm font-medium"
                >
                  <Smartphone size={16} />
                  <span>Download App</span>
                </button>

                {/* Language Selector Trigger */}
                <div 
                  onClick={() => setIsLangModalOpen(true)}
                  className="hidden md:flex items-center gap-2 cursor-pointer hover:text-blue-600 transition text-sm font-medium text-gray-700 uppercase"
                >
                  <Globe size={18} />
                  <span>{language}</span>
                </div>

                {/* Account Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <button className={`flex items-center gap-2 py-2 text-sm font-medium transition ${isAuthenticated ? 'text-gray-700 hover:text-blue-600' : 'bg-white text-[#172337] px-0 lg:px-4 py-2 rounded-sm hover:bg-gray-50'}`}>
                    {isAuthenticated ? (
                      <div className="rounded-full overflow-hidden w-8 h-8 border border-gray-200">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <User size={18} className="text-gray-500" />
                            </div>
                        )}
                      </div>
                    ) : (
                      <CircleUser size={24} />
                    )}
                    <span className="hidden lg:inline">{isAuthenticated ? user?.name.split(' ')[0] : t('login')}</span>
                    <ChevronDown size={14} className={`hidden lg:block transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 w-[280px] bg-white text-gray-800 shadow-[0_8px_24px_rgba(0,0,0,0.12)] rounded-lg overflow-hidden border border-gray-100 z-[60] mt-1"
                      >
                        {/* Auth Header */}
                        {isAuthenticated ? (
                          <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <p className="text-xs text-gray-500 mb-1">{t('welcome')},</p>
                            <p className="font-bold text-gray-800 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                          </div>
                        ) : (
                          <div className="p-4 border-b border-gray-100 bg-white">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-medium text-gray-600">{t('welcome')}</p>
                            </div>
                            <p className="text-xs text-gray-500 mb-4">To access account and manage orders</p>
                            <div className="flex items-center justify-between gap-2">
                                <Link 
                                    to="/login" 
                                    onClick={() => setIsUserMenuOpen(false)}
                                    className="flex-1 bg-[#fb641b] text-white text-center py-2 rounded-sm text-sm font-bold shadow-sm hover:bg-[#f06018] uppercase"
                                >
                                    {t('login')}
                                </Link>
                                <Link 
                                    to="/signup" 
                                    onClick={() => setIsUserMenuOpen(false)}
                                    className="flex-1 bg-white border border-gray-200 text-[#2874f0] text-center py-2 rounded-sm text-sm font-bold hover:bg-gray-50 uppercase shadow-sm"
                                >
                                    {t('signup')}
                                </Link>
                            </div>
                          </div>
                        )}

                        <div className="py-2">
                          <Link 
                            to="/profile" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-sm text-gray-700 border-b border-gray-50"
                          >
                            <User size={16} className="text-gray-500" />
                            <span>{t('profile')}</span>
                          </Link>
                          <Link 
                            to="/orders" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-sm text-gray-700 border-b border-gray-50"
                          >
                            <Package size={16} className="text-gray-500" />
                            <span>{t('orders')}</span>
                          </Link>
                          <Link 
                            to="/wishlist" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-sm text-gray-700"
                          >
                            <Heart size={16} className="text-gray-500" />
                            <span>{t('wishlist')}</span>
                          </Link>
                          
                          {isAuthenticated && (
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left border-t border-gray-100 text-sm text-gray-700 mt-1">
                              <LogOut size={16} className="text-gray-500" />
                              <span>{t('logout')}</span>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/cart" className="relative text-gray-800 hover:text-blue-600 transition flex items-center gap-1">
                  <ShoppingCart size={24} />
                  {isSyncing && (
                    <RefreshCw size={12} className="animate-spin text-blue-500 absolute -bottom-2 -left-1" />
                  )}
                  <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                </Link>

              </div>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween' }}
                className="fixed top-0 left-0 h-full w-[80%] bg-white z-50 lg:hidden shadow-xl flex flex-col"
              >
                {/* Header with Back Arrow */}
                <div className="bg-[#2874f0] p-4 text-white flex justify-between items-center flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsMenuOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        {isAuthenticated && user?.avatar ? (
                            <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full object-cover border-2 border-white/50" />
                        ) : (
                            <User size={24} />
                        )}
                        <span className="font-semibold">{isAuthenticated ? user?.name : `${t('login')} & ${t('signup')}`}</span>
                    </div>
                  </div>
                </div>
                
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto text-sm font-medium text-gray-700">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-gray-400 uppercase text-xs font-bold mb-3">Shop By</h3>
                    <div className="space-y-3 pl-2">
                        <Link to="/search" onClick={() => setIsMenuOpen(false)} className="block">All Categories</Link>
                        <Link to="/search" onClick={() => setIsMenuOpen(false)} className="block">Top Brands</Link>
                    </div>
                  </div>

                  <button onClick={() => { setIsLangModalOpen(true); setIsMenuOpen(false); }} className="p-4 border-b border-gray-100 hover:bg-gray-50 flex items-center gap-4 w-full text-left">
                      <Globe size={18} className="text-gray-500" /> {t('choose_language')}
                  </button>

                  <button onClick={() => { setIsModalOpen(true); setIsMenuOpen(false); }} className="p-4 border-b border-gray-100 hover:bg-gray-50 flex items-center gap-4 w-full text-left">
                      <Smartphone size={18} className="text-gray-500" /> Download App
                  </button>

                  <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="p-4 border-b border-gray-100 hover:bg-gray-50 flex items-center gap-4 justify-between">
                    <div className="flex items-center gap-4">
                        <Heart size={18} className="text-gray-500" /> {t('wishlist')}
                    </div>
                    <span className="bg-gray-100 text-gray-600 px-2 rounded-full text-xs">{wishlist.length}</span>
                  </Link>

                  <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="p-4 border-b border-gray-100 hover:bg-gray-50 flex items-center gap-4">
                      <Package size={18} className="text-gray-500" /> {t('orders')}
                  </Link>
                </div>

                {/* Fixed Bottom Section for Logout/Login */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                    {isAuthenticated ? (
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-600 font-bold py-2 hover:bg-red-50 rounded-md transition-colors">
                            <LogOut size={18} /> {t('logout')}
                        </button>
                    ) : (
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center gap-2 text-blue-600 font-bold py-2 hover:bg-blue-50 rounded-md transition-colors">
                            <User size={18} /> {t('login')}
                        </Link>
                    )}
                </div>

              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
