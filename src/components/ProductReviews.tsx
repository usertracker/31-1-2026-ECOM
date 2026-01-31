import React, { useRef, useState } from 'react';
import { Star, ChevronRight, ChevronLeft, CheckCircle2, PenLine, X } from 'lucide-react';
import { Product } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

// Updated Mock Data
const MOCK_REVIEWS = [
  {
    id: 1,
    user: "Medha Lankapalli",
    initials: "ML",
    rating: 5,
    timeAgo: "1 day ago",
    content: "The product was delivered in good condition and on time. Really loved the packaging!",
    occasion: "Birthday",
    city: "Hyderabad"
  },
  {
    id: 2,
    user: "Nayan gj",
    initials: "NG",
    rating: 5,
    timeAgo: "6 days ago",
    content: "Nice product, looks exactly like the picture.",
    occasion: "Birthday",
    city: "Bangalore"
  },
  {
    id: 3,
    user: "Saby",
    initials: "S",
    rating: 5,
    timeAgo: "3 weeks ago",
    content: "Very nice gift for my wife. She was very happy.",
    occasion: "Anniversary",
    city: "Delhi"
  },
  {
    id: 4,
    user: "Ritesh",
    initials: "R",
    rating: 5,
    timeAgo: "2 months ago",
    content: "Yes i got product and this is amazing. Quality is top notch.",
    occasion: null,
    city: "Godda"
  },
  {
    id: 5,
    user: "Ananya S.",
    initials: "AS",
    rating: 4,
    timeAgo: "2 months ago",
    content: "Beautiful design but delivery was slightly delayed.",
    occasion: "Wedding",
    city: "Mumbai"
  }
];

export const ProductReviews = ({ product }: { product: Product }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { showToast } = useToast();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 320; // Approx card width
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReviewModalOpen(false);
    showToast('Review submitted for approval!', 'success');
  };

  return (
    <div className="bg-white pt-6 pb-8 border-t border-gray-100 mt-8 font-sans">
      
      {/* Header with Add Review Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-gray-900">Customer Reviews</h2>
        <div className="flex gap-2">
            <button 
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-black text-white px-4 py-2 rounded-full text-xs md:text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
            >
                <PenLine size={14} /> <span className="hidden md:inline">Write a</span> Review
            </button>
        </div>
      </div>

      {/* --- REVIEWS SUMMARY (EXACT DESIGN MATCH) --- */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
            <Star size={20} fill="#f59e0b" className="text-yellow-500" strokeWidth={0} />
            <span className="text-xl md:text-2xl font-bold text-gray-900 leading-none">{product.rating} out of 5</span>
            <span className="text-gray-500 text-base md:text-lg font-normal">({product.reviews} reviews)</span>
        </div>
        <p className="text-xs md:text-sm text-gray-500 mb-6 pl-1">
            All reviews are from verified buyers
        </p>

        {/* Gauges - Exact Layout from Image */}
        <div className="flex overflow-x-auto no-scrollbar gap-4 md:gap-12 pb-2 pl-1">
            {/* Gauge 1 */}
            <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[1.5px] border-[#f59e0b] flex items-center justify-center text-xs md:text-sm font-bold text-gray-900 bg-white">
                    5/5
                </div>
                <div className="flex flex-col justify-center">
                    <span className="text-xs md:text-sm font-medium text-gray-900 leading-tight">Item</span>
                    <span className="text-xs md:text-sm font-medium text-gray-900 leading-tight">quality</span>
                </div>
            </div>

            {/* Gauge 2 */}
            <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[1.5px] border-[#f59e0b] flex items-center justify-center text-xs md:text-sm font-bold text-gray-900 bg-white">
                    5/5
                </div>
                <span className="text-xs md:text-sm font-medium text-gray-900 leading-tight">Delivery</span>
            </div>

            {/* Gauge 3 */}
            <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[1.5px] border-[#f59e0b] flex items-center justify-center text-xs md:text-sm font-bold text-gray-900 bg-white">
                    5/5
                </div>
                <div className="flex flex-col justify-center">
                    <span className="text-xs md:text-sm font-medium text-gray-900 leading-tight">Customer</span>
                    <span className="text-xs md:text-sm font-medium text-gray-900 leading-tight">service</span>
                </div>
            </div>
        </div>
      </div>

      <div className="relative group">
        {/* Scroll Buttons */}
        <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 border border-gray-100 hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
        >
            <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 border border-gray-100 hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
        >
            <ChevronRight size={20} className="text-gray-600" />
        </button>

        {/* Reviews Carousel */}
        <div 
            ref={scrollRef}
            className="flex overflow-x-auto no-scrollbar gap-4 pb-4 scroll-smooth"
        >
            {MOCK_REVIEWS.map((review) => (
            <div 
                key={review.id} 
                className="min-w-[280px] md:min-w-[320px] bg-white border border-gray-200 rounded-xl p-5 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow"
            >
                {/* User Info */}
                <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#4a5568] text-white flex items-center justify-center font-medium text-sm flex-shrink-0">
                        {review.initials}
                    </div>
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-medium text-gray-900 text-sm">{review.user}</span>
                            <span className="text-xs text-gray-500">• {review.timeAgo}</span>
                        </div>
                        <div className="flex text-green-600 mt-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star} 
                                    size={14} 
                                    fill={star <= review.rating ? "currentColor" : "none"} 
                                    className={star <= review.rating ? "text-green-600" : "text-gray-300"} 
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-4 flex-1">
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                        {review.content}
                    </p>
                    {review.content.length > 60 && (
                        <button className="text-xs font-bold text-gray-900 mt-1 hover:underline">read more</button>
                    )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                    {review.occasion && (
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-medium">
                            Occasion: {review.occasion}
                        </span>
                    )}
                    {review.city && (
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-medium">
                            City: {review.city}
                        </span>
                    )}
                </div>
            </div>
            ))}
        </div>
      </div>

      {/* --- ADD REVIEW MODAL --- */}
      <AnimatePresence>
        {isReviewModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsReviewModalOpen(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative bg-white w-full md:max-w-lg rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
                >
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Write a Review</h2>
                        <button onClick={() => setIsReviewModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmitReview} className="p-6 space-y-4 overflow-y-auto">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} type="button" className="text-gray-300 hover:text-yellow-400 focus:text-yellow-500 transition-colors">
                                        <Star size={32} fill="currentColor" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Review Title</label>
                            <input type="text" placeholder="Summarize your experience" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-black outline-none" required />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Details</label>
                            <textarea rows={4} placeholder="What did you like or dislike?" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-black outline-none" required></textarea>
                        </div>

                        <div className="pt-2">
                            <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold text-sm hover:bg-gray-800 transition">
                                Submit Review
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </div>
  );
};
