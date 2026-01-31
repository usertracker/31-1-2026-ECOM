import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

interface CelebrationsCalendarProps {
  mode: 'jewellery' | 'gifts';
}

export const CelebrationsCalendar = ({ mode }: CelebrationsCalendarProps) => {
  const navigate = useNavigate();
  const { assets } = useContent();

  const JEWELLERY_EVENTS = [
    {
      id: 1,
      date: "14TH FEB",
      title: "Valentine's Day",
      image: assets['cal_val_day'] || "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop",
      headerColor: "bg-rose-100",
      query: "Romance" 
    },
    {
      id: 2,
      date: "9TH APR",
      title: "Ugadi / Gudi Padwa",
      image: assets['cal_ugadi'] || "https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=600&auto=format&fit=crop",
      headerColor: "bg-green-100",
      query: "Gold"
    },
    {
      id: 3,
      date: "21ST APR",
      title: "Akshaya Tritiya",
      image: assets['cal_akshaya'] || "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop",
      headerColor: "bg-yellow-100",
      query: "Gold Coin" 
    },
    {
      id: 4,
      date: "ALL YEAR",
      title: "Wedding Season",
      image: assets['cal_wedding'] || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
      headerColor: "bg-red-100",
      query: "Wedding" 
    },
    {
      id: 5,
      date: "20TH OCT",
      title: "Karwa Chauth",
      image: assets['cal_karwa'] || "https://images.unsplash.com/photo-1602751584552-8ba42d523f17?q=80&w=600&auto=format&fit=crop",
      headerColor: "bg-purple-100",
      query: "Mangalsutra" 
    }
  ];

  const GIFT_EVENTS = [
    {
      id: 1,
      date: "14TH FEB",
      title: "Valentine's Day",
      image: assets['cal_val_day'] || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop",
      headerColor: "bg-rose-100",
      query: "Romance"
    },
    {
      id: 2,
      date: "8TH MAR",
      title: "Women's Day",
      image: assets['cal_womens'] || "https://images.unsplash.com/photo-1556228552-523de5147bb6?q=80&w=600&auto=format&fit=crop",
      headerColor: "bg-pink-100",
      query: "Gift Sets"
    },
    {
      id: 3,
      date: "25TH MAR",
      title: "Holi Celebration",
      image: assets['cal_holi'] || "https://images.unsplash.com/photo-1516641396056-0ce60a85d49f?q=80&w=600&auto=format&fit=crop",
      headerColor: "bg-orange-100",
      query: "Gift Sets"
    },
    {
      id: 4,
      date: "12TH MAY",
      title: "Mother's Day",
      image: assets['cal_mothers'] || "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop",
      headerColor: "bg-blue-100",
      query: "Gift Sets"
    },
    {
      id: 5,
      date: "19TH AUG",
      title: "Raksha Bandhan",
      image: assets['cal_rakhi'] || "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop",
      headerColor: "bg-yellow-100",
      query: "Rakhi" 
    }
  ];

  const events = mode === 'jewellery' ? JEWELLERY_EVENTS : GIFT_EVENTS;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 mb-16 mt-8 font-sans">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Celebrations Calendar</h2>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
      >
        {events.map((event) => (
          <motion.div 
            key={event.id}
            variants={itemVariants}
            className="flex flex-col group cursor-pointer"
            onClick={() => navigate(`/search?q=${encodeURIComponent(event.query)}&collection=${encodeURIComponent(event.title)}`)}
          >
            <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white">
              {/* Date Header */}
              <div className={`${event.headerColor} py-2.5 text-center`}>
                <span className="text-sm font-bold text-gray-800 tracking-wide">{event.date}</span>
              </div>
              
              {/* Image */}
              <div className="aspect-square overflow-hidden relative">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
            </div>
            
            {/* Footer Label */}
            <div className="text-center mt-3">
              <h3 className="text-sm font-bold text-gray-800 group-hover:text-[#d4af37] transition-colors">
                {event.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
