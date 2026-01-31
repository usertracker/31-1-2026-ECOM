import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';

const REVIEWS_DATA = [
  {
    id: 1,
    category: "Earrings",
    text: "Customers enjoy exploring earrings for their elegant styles. First-time buyers often mention about the mix of style, comfort, and affordability that makes these earrings a charming choice for everyday wear and special moments alike.",
    stats: [
      { value: "94%", label: "Lightweight Designs" },
      { value: "92%", label: "Gifting Friendly" }
    ],
    helpfulCount: 70,
    author: "Verified Buyer"
  },
  {
    id: 2,
    category: "Rings",
    text: "The ring collection is praised for its precise sizing and exquisite craftsmanship. Shoppers love the attention to detail in the settings, making them perfect symbols of love that feel comfortable on the finger all day long.",
    stats: [
      { value: "98%", label: "True to Size" },
      { value: "96%", label: "Sparkle & Shine" }
    ],
    helpfulCount: 124,
    author: "Verified Buyer"
  },
  {
    id: 3,
    category: "Necklaces",
    text: "Our necklaces are frequently complimented for their versatility. From office wear to party nights, customers find the designs adaptable and durable. The chain quality is often highlighted as a standout feature.",
    stats: [
      { value: "95%", label: "Durable Quality" },
      { value: "91%", label: "Versatile Style" }
    ],
    helpfulCount: 89,
    author: "Verified Buyer"
  }
];

const CustomerImpression = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % REVIEWS_DATA.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + REVIEWS_DATA.length) % REVIEWS_DATA.length);
  };

  const current = REVIEWS_DATA[currentIndex];

  return (
    <div className="bg-[#fffbf7] py-10 md:py-10 relative overflow-hidden font-sans">
      
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#fdecef] rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#fdf2d0] rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-8">
            <span className="text-[#a88847] font-bold tracking-widest text-[10px] md:text-xs uppercase mb-2 block">Customer Voices</span>
            <h2 className="text-2xl md:text-4xl font-serif text-[#2a1b12] mb-3 md:mb-4">
              Loved by <span className="italic text-[#a88847]">Millions</span>
            </h2>
            <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-transparent via-[#a88847] to-transparent mx-auto"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
          
          {/* LEFT: The Premium Review Card */}
          <div className="w-full lg:w-1/2 relative perspective-1000">
              
              {/* Stacked Card Effect for Depth */}
              <div className="absolute top-3 left-3 md:top-4 md:left-4 w-full h-full bg-white rounded-2xl shadow-sm border border-gray-100 transform rotate-2 md:rotate-3 opacity-60 z-0"></div>
              <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 w-full h-full bg-white rounded-2xl shadow-sm border border-gray-100 transform rotate-1 opacity-80 z-10"></div>

              {/* Main Card */}
              <div className="relative bg-white rounded-2xl shadow-xl border border-[#f0e6d2] p-6 md:p-10 z-20 min-h-[280px] md:min-h-[320px] flex flex-col justify-between">
                  
                  {/* Quote Icon */}
                  <div className="absolute -top-4 left-6 md:-top-6 md:left-8 bg-[#a88847] text-white p-2.5 md:p-3 rounded-full shadow-lg">
                      <Quote size={20} className="md:w-6 md:h-6" fill="currentColor" />
                  </div>

                  <AnimatePresence mode='wait'>
                      <motion.div
                          key={currentIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.4 }}
                          className="flex-1"
                      >
                          {/* Category Tag */}
                          <div className="flex justify-end mb-3 md:mb-4">
                              <span className="bg-[#fdf2d0] text-[#8c6b28] text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                  {current.category}
                              </span>
                          </div>

                          {/* Review Text */}
                          <p className="text-gray-700 text-base md:text-xl font-serif leading-relaxed italic mb-6 md:mb-8">
                              "{current.text}"
                          </p>

                          {/* Author & Rating */}
                          <div className="flex items-center justify-between border-t border-gray-100 pt-4 md:pt-6">
                              <div className="flex items-center gap-2 md:gap-3">
                                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs md:text-sm">
                                      {current.author.charAt(0)}
                                  </div>
                                  <div>
                                      <p className="font-bold text-gray-900 text-xs md:text-sm flex items-center gap-1">
                                          {current.author} <CheckCircle2 size={12} className="text-green-500 md:w-3.5 md:h-3.5" />
                                      </p>
                                      <div className="flex text-[#a88847] gap-0.5">
                                          {[1,2,3,4,5].map(i => <Star key={i} size={10} className="md:w-3 md:h-3" fill="currentColor" />)}
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="text-[10px] md:text-xs text-gray-400 font-medium">
                                  FlipZon AI Summary
                              </div>
                          </div>
                      </motion.div>
                  </AnimatePresence>
              </div>

              {/* Navigation Buttons (Floating on sides of card on desktop) */}
              <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-30 hidden md:block">
                  <button onClick={prevReview} className="bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-[#a88847] hover:scale-110 transition-all border border-gray-100">
                      <ChevronLeft size={20} />
                  </button>
              </div>
              <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-30 hidden md:block">
                  <button onClick={nextReview} className="bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-[#a88847] hover:scale-110 transition-all border border-gray-100">
                      <ChevronRight size={20} />
                  </button>
              </div>
          </div>

          {/* RIGHT: Stats & Interactive Elements */}
          <div className="w-full lg:w-1/2 pl-0 lg:pl-8">
              <AnimatePresence mode='wait'>
                  <motion.div
                      key={`stats-${currentIndex}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                  >
                      {/* Removed Heading and Subtitle here as requested */}

                      <div className="grid grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-10">
                          {current.stats.map((stat, idx) => (
                              <div key={idx} className="bg-white p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                  <h4 className="text-2xl md:text-4xl font-bold text-[#a88847] mb-1">{stat.value}</h4>
                                  <p className="text-gray-600 font-medium text-xs md:text-sm">{stat.label}</p>
                              </div>
                          ))}
                      </div>

                      <div className="flex items-center justify-between bg-white p-3 md:p-4 rounded-lg border border-gray-100">
                          <span className="text-xs md:text-sm text-gray-600 font-medium">Was this summary helpful?</span>
                          <div className="flex items-center gap-3 md:gap-4">
                              <button className="flex items-center gap-1 md:gap-1.5 text-gray-500 hover:text-green-600 transition-colors text-xs md:text-sm">
                                  <ThumbsUp size={14} className="md:w-4 md:h-4" /> Yes
                              </button>
                              <div className="h-3 md:h-4 w-px bg-gray-200"></div>
                              <button className="flex items-center gap-1 md:gap-1.5 text-gray-500 hover:text-red-500 transition-colors text-xs md:text-sm">
                                  <ThumbsDown size={14} className="md:w-4 md:h-4" /> No
                              </button>
                          </div>
                      </div>
                      
                      {/* Mobile Navigation (Visible only on small screens) */}
                      <div className="flex justify-center gap-4 mt-6 md:hidden">
                          <button onClick={prevReview} className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50">
                              <ChevronLeft size={20} />
                          </button>
                          <button onClick={nextReview} className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50">
                              <ChevronRight size={20} />
                          </button>
                      </div>

                  </motion.div>
              </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};

export { CustomerImpression };
export default CustomerImpression;
