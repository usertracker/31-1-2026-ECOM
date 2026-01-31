import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, MapPin, Home, Briefcase, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

interface AddressSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddressSelectionModal = ({ isOpen, onClose }: AddressSelectionModalProps) => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelectAddress = async (addressId: string) => {
    if (!user || !user.addresses) return;

    const updatedAddresses = user.addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));

    try {
      await updateUserProfile({ addresses: updatedAddresses });
      showToast('Delivery address updated', 'success');
      onClose();
    } catch (error) {
      showToast('Failed to update address', 'error');
    }
  };

  const handleAddNew = () => {
    onClose();
    navigate('/profile');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center font-sans p-0 md:p-4">
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
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white w-full md:max-w-lg rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <h2 className="text-lg font-bold text-gray-900">Select Delivery Address</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <X size={20} />
            </button>
          </div>

          {/* List */}
          <div className="p-4 overflow-y-auto flex-1 bg-gray-50">
            {user?.addresses && user.addresses.length > 0 ? (
              <div className="space-y-3">
                {user.addresses.map((addr) => (
                  <div 
                    key={addr.id}
                    onClick={() => handleSelectAddress(addr.id)}
                    className={`
                      relative p-4 rounded-xl border cursor-pointer transition-all bg-white
                      ${addr.isDefault 
                        ? 'border-blue-500 ring-1 ring-blue-500 shadow-sm' 
                        : 'border-gray-200 hover:border-blue-300'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`mt-0.5 ${addr.isDefault ? 'text-blue-600' : 'text-gray-400'}`}>
                        {addr.type === 'Work' ? <Briefcase size={20} /> : <Home size={20} />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900 text-sm">{user.name}</span>
                          <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{addr.type || 'Home'}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {addr.street}, {addr.city}, {addr.state} - {addr.zip}
                        </p>
                      </div>

                      {/* Radio Selection */}
                      <div className={`
                        w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-1
                        ${addr.isDefault ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}
                      `}>
                        {addr.isDefault && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                  <MapPin size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No addresses found</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0 z-10">
            <button 
              onClick={handleAddNew}
              className="w-full bg-white border border-blue-600 text-blue-600 py-3 rounded-lg font-bold shadow-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add New Address
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
