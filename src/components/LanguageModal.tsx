import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { LANGUAGES } from '../data/languages';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal = ({ isOpen, onClose }: LanguageModalProps) => {
  const { language, setLanguage, t } = useLanguage();
  const [selected, setSelected] = useState(language);
  const { showToast } = useToast();

  const handleSave = async () => {
    await setLanguage(selected);
    showToast(`Language changed to ${LANGUAGES.find(l => l.code === selected)?.name}`, 'success');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Try FlipZon in your language</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <X size={20} />
            </button>
          </div>

          {/* Grid */}
          <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
            {LANGUAGES.map((lang) => (
              <div 
                key={lang.code}
                onClick={() => setSelected(lang.code)}
                className={`
                  relative border rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-all
                  ${selected === lang.code 
                    ? 'border-blue-600 bg-blue-50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {/* Radio Circle */}
                <div className={`
                  w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0
                  ${selected === lang.code ? 'border-blue-600' : 'border-gray-400'}
                `}>
                  {selected === lang.code && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                </div>

                {/* Text */}
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 text-lg leading-tight">{lang.native}</span>
                  <span className="text-xs text-gray-500 font-medium">{lang.name}</span>
                </div>

                {/* Check Icon for Selected */}
                {selected === lang.code && (
                  <div className="absolute top-2 right-2 text-blue-600">
                    <Check size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <button 
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-colors uppercase tracking-wide text-sm"
            >
              {t('continue')}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
