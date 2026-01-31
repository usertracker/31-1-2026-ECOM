import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link as LinkIcon, MessageSquare, Bluetooth, Share2 } from 'lucide-react';
import { Product } from '../data/mockData';
import { useToast } from '../context/ToastContext';

// WhatsApp Icon Component
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.533 0 1.518 1.115 2.986 1.264 3.184.149.198 2.19 3.349 5.306 4.695 2.133.921 2.565.737 3.036.688.52-.05 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const ShareModal = ({ isOpen, onClose, product }: ShareModalProps) => {
  const { showToast } = useToast();
  
  // DYNAMIC URL GENERATION
  // window.location.origin gets the current domain (e.g., https://your-app.netlify.app or http://localhost:5173)
  // We append the product path to create a clean, shareable link automatically.
  const shareUrl = `${window.location.origin}/product/${product.id}`;
  
  const shareText = `Check out this ${product.name} on FlipZon!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link copied to clipboard!', 'success');
      onClose();
    } catch (err) {
      // Fallback for environments where Clipboard API is blocked (e.g. iframes)
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        showToast('Link copied to clipboard!', 'success');
        onClose();
      } catch (e) {
        console.error("Copy failed", e);
        showToast('Failed to copy link', 'error');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
    onClose();
  };

  const handleMessages = () => {
    const url = `sms:?body=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.location.href = url;
    onClose();
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: shareUrl,
        });
        onClose();
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      showToast('Sharing not supported on this device', 'info');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white w-full md:max-w-md rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} className="text-gray-800" />
                </button>
                <h2 className="text-lg font-bold text-gray-900">Share</h2>
            </div>
          </div>

          {/* Product Preview */}
          <div className="bg-gray-50 p-4 flex gap-4 items-center">
            <div className="w-16 h-16 bg-white rounded-md border border-gray-200 overflow-hidden flex-shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 truncate">{product.name}</h3>
                <p className="text-xs text-gray-500 truncate mt-0.5">{product.description || product.category}</p>
            </div>
          </div>

          {/* Share Grid */}
          <div className="p-6 grid grid-cols-4 gap-4">
            
            {/* Copy Link */}
            <button onClick={handleCopyLink} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                    <LinkIcon size={20} />
                </div>
                <span className="text-xs text-gray-600 font-medium">Copy Link</span>
            </button>

            {/* WhatsApp */}
            <button onClick={handleWhatsApp} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                    <WhatsAppIcon />
                </div>
                <span className="text-xs text-gray-600 font-medium">WhatsApp</span>
            </button>

            {/* Messages */}
            <button onClick={handleMessages} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-[#2c3e50] flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                    <MessageSquare size={20} />
                </div>
                <span className="text-xs text-gray-600 font-medium">Messages</span>
            </button>

            {/* Bluetooth (Native Share) */}
            <button onClick={handleNativeShare} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-[#2c3e50] flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                    <Bluetooth size={20} />
                </div>
                <span className="text-xs text-gray-600 font-medium">Bluetooth</span>
            </button>

          </div>
          
          {/* Bottom spacer for mobile safe area */}
          <div className="h-4 md:hidden"></div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
