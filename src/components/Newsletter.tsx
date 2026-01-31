import React, { useState } from 'react';
import { Gift, Star } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showToast('Subscribed successfully!', 'success');
      setEmail('');
    }
  };

  return (
    <div className="bg-[#3e4152] text-white py-12 relative overflow-hidden font-sans mt-8">
      <div className="max-w-[1200px] mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        
        {/* Left Content */}
        <div className="flex items-start relative w-full md:w-auto justify-center md:justify-start">
            {/* Decorative Gift Icons mimicking the line art */}
            <div className="absolute -top-10 left-0 md:-left-12 opacity-90 text-white transform -rotate-12 hidden sm:block">
                <Gift size={42} strokeWidth={1.5} />
            </div>
            <div className="absolute -top-4 left-8 md:-left-2 opacity-90 text-white transform rotate-12 hidden sm:block">
                <Gift size={28} strokeWidth={1.5} />
            </div>

            <div className="sm:pl-16 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-white">Newsletter updates!!</h2>
                <p className="text-gray-300 text-sm max-w-md leading-relaxed">
                    Get unique & trendy gift ideas and best offers delivered to your inbox.
                </p>
            </div>
        </div>

        {/* Divider Line (Desktop) */}
        <div className="hidden md:block h-16 w-px bg-white/30 relative mx-4">
             {/* Star decoration near divider */}
             <div className="absolute -top-6 -left-3 text-gray-400 opacity-60">
                <Star size={16} />
             </div>
             <div className="absolute -top-10 left-2 text-gray-400 opacity-60">
                <Star size={12} />
             </div>
        </div>

        {/* Right Form */}
        <form onSubmit={handleSubmit} className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <input 
            type="email" 
            placeholder="Enter E-mail ID" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:w-96 h-12 px-4 text-gray-800 outline-none rounded-sm border-none placeholder-gray-500 text-sm bg-white"
            required
          />
          <button 
            type="submit" 
            className="w-full sm:w-auto bg-[#e42529] hover:bg-[#c91e22] text-white font-bold h-12 px-10 rounded-sm transition-colors uppercase text-sm tracking-wide shadow-sm"
          >
            Submit
          </button>
        </form>

      </div>
      
      {/* Background Decorations (Subtle) */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden opacity-10">
          <div className="absolute top-4 right-20 transform rotate-45">
             <Star size={40} />
          </div>
          <div className="absolute bottom-4 left-1/3 transform -rotate-12">
             <Star size={24} />
          </div>
      </div>
    </div>
  );
};
