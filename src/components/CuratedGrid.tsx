import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const COLLECTIONS = [
  {
    id: 1,
    title: "Bridal Collection",
    subtitle: "For your special day",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
    color: "bg-rose-50",
    query: "Rings"
  },
  {
    id: 2,
    title: "Gifts for Him",
    subtitle: "Watches & Bracelets",
    image: "https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=600&auto=format&fit=crop",
    color: "bg-slate-50",
    query: "Watches"
  },
  {
    id: 3,
    title: "Everyday Luxury",
    subtitle: "Minimalist Jewelry",
    image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=600&auto=format&fit=crop",
    color: "bg-amber-50",
    query: "Necklaces"
  }
];

export const CuratedGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {COLLECTIONS.map((item) => (
        <div 
          key={item.id}
          onClick={() => navigate(`/search?category=${item.query}`)}
          className={`${item.color} rounded-lg p-6 cursor-pointer group relative overflow-hidden h-[240px] shadow-sm hover:shadow-md transition-all`}
        >
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1 font-serif">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.subtitle}</p>
            </div>
            
            <div className="flex items-center gap-2 text-gray-900 font-medium text-sm group-hover:gap-3 transition-all">
              <span>View Collection</span>
              <div className="bg-white rounded-full p-1.5 shadow-sm">
                <ArrowRight size={14} />
              </div>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 w-32 h-32 md:w-40 md:h-40 translate-x-4 translate-y-4 group-hover:scale-105 transition-transform duration-500">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover rounded-tl-[40px] shadow-lg"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
