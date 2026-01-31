import React from 'react';
import { X, Smartphone, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal = ({ isOpen, onClose }: DownloadAppModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden z-10"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"
          >
            <X size={20} className="text-gray-500" />
          </button>

          <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-6 leading-tight">
              Download the App for A Smoother<br />Shopping Experience
            </h2>

            {/* QR Code Placeholder */}
            <div className="mb-6 flex justify-center">
              <div className="p-2 border-2 border-dashed border-gray-300 rounded-lg">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com/app" 
                  alt="QR Code" 
                  className="w-32 h-32"
                />
              </div>
            </div>

            {/* Store Buttons */}
            <div className="flex justify-center gap-3 mb-6">
              <button className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-800 transition">
                <Smartphone size={20} />
                <div className="text-left leading-none">
                  <div className="text-[10px] uppercase">Download on the</div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </button>
              <button className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-800 transition">
                <ShoppingBag size={20} />
                <div className="text-left leading-none">
                  <div className="text-[10px] uppercase">Get it on</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </button>
            </div>

            <div className="text-amber-500 font-medium mb-2">
              Explore Best Deals & Offers
            </div>
            
            <div className="h-px w-16 bg-amber-200 mx-auto mb-4"></div>

            <p className="text-gray-600 text-sm mb-1">
              Get upto <span className="font-bold text-gray-900">20% Discount</span> on Your First Purchase
            </p>
            <p className="text-gray-600 text-sm mb-6">
              Use Code - <span className="font-bold text-gray-900">UBAPP</span>
            </p>

            <button className="w-full bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 rounded-md transition-colors">
              Know more about Ubuy App
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
