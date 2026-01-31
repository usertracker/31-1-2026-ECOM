import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, LogOut, Edit2, Shield, Camera, Save, Loader2, Plus, Trash2, X, Clock, Trash, Globe, Home, Briefcase, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { uploadProductImage } from '../services/storage';
import { Address } from '../services/db';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { formatPrice } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { LanguageModal } from '../components/LanguageModal';
import { LANGUAGES } from '../data/languages';

export const Profile = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { viewedItems, clearHistory } = useRecentlyViewed();
  const { t, language } = useLanguage();

  // --- State for Personal Info ---
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalData, setPersonalData] = useState({
    name: '',
    email: '',
    phone: '',
    secondaryPhone: '',
    gender: 'Male',
  });

  // --- State for Addresses ---
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null); // For the ... menu
  const [addressData, setAddressData] = useState<Address>({
    id: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    type: 'Home',
    isDefault: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Sync state with user data on load
  useEffect(() => {
    if (user) {
      setPersonalData({
        name: user.name === 'FlipZon User' ? '' : user.name,
        email: user.email || '',
        phone: user.phone || '',
        secondaryPhone: user.secondaryPhone || '',
        gender: (user as any).gender || 'Male',
      });
    }
  }, [user]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  if (!user) return null;

  // Calculate Profile Completion
  const calculateCompletion = () => {
    let score = 0;
    const total = 6; // Name, Email, Phone, Gender, Avatar, Address
    
    if (user.name && user.name !== 'FlipZon User') score++;
    if (user.email) score++;
    if (user.phone) score++;
    if ((user as any).gender) score++;
    if (user.avatar) score++;
    if (user.addresses && user.addresses.length > 0) score++;
    
    return Math.round((score / total) * 100);
  };

  const completionPercentage = calculateCompletion();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- Personal Info Handlers ---
  const handleSavePersonal = async () => {
    if (!personalData.name.trim()) {
        showToast('Name is required', 'error');
        return;
    }
    setIsLoading(true);
    try {
      await updateUserProfile({
        name: personalData.name,
        email: personalData.email,
        phone: personalData.phone,
        secondaryPhone: personalData.secondaryPhone,
        gender: personalData.gender,
      } as any);
      showToast('Personal information updated!', 'success');
      setIsEditingPersonal(false);
    } catch (error) {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Address Handlers ---
  const handleAddAddressClick = () => {
    if ((user.addresses?.length || 0) >= 3) {
      showToast('Maximum 3 addresses allowed', 'error');
      return;
    }
    setAddressData({ id: '', street: '', city: '', state: '', zip: '', type: 'Home', isDefault: false });
    setIsAddingAddress(true);
    setEditingAddressId(null);
  };

  const handleEditAddressClick = (e: React.MouseEvent, addr: Address) => {
    e.stopPropagation();
    setAddressData({ ...addr });
    setEditingAddressId(addr.id);
    setIsAddingAddress(true);
    setActiveMenuId(null);
  };

  const handleDeleteAddress = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    const updatedAddresses = user.addresses?.filter(a => a.id !== id) || [];
    try {
      await updateUserProfile({ addresses: updatedAddresses });
      showToast('Address deleted', 'success');
    } catch (error) {
      showToast('Failed to delete address', 'error');
    }
    setActiveMenuId(null);
  };

  const handleSetDefaultAddress = async (id: string) => {
    if (!user.addresses) return;
    
    const updatedAddresses = user.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
    }));

    try {
        await updateUserProfile({ addresses: updatedAddresses });
        showToast('Default address updated', 'success');
    } catch (error) {
        showToast('Failed to update default address', 'error');
    }
  };

  const handleSaveAddress = async () => {
    if (!addressData.street || !addressData.city || !addressData.zip) {
      showToast('Please fill all address fields', 'error');
      return;
    }

    if (addressData.street.length < 5) {
        showToast('Please enter a valid street address', 'error');
        return;
    }

    const lettersOnlyRegex = /^[A-Za-z\s]+$/;
    if (!lettersOnlyRegex.test(addressData.city)) {
        showToast('City should only contain letters', 'error');
        return;
    }
    if (!lettersOnlyRegex.test(addressData.state)) {
        showToast('State should only contain letters', 'error');
        return;
    }

    const zipRegex = /^\d{6}$/;
    if (!zipRegex.test(addressData.zip)) {
        showToast('Zip code must be exactly 6 digits', 'error');
        return;
    }

    setIsLoading(true);
    try {
      let updatedAddresses = [...(user.addresses || [])];

      if (editingAddressId) {
        updatedAddresses = updatedAddresses.map(a => a.id === editingAddressId ? { ...addressData, id: editingAddressId } : a);
      } else {
        // If first address, make it default automatically
        const isFirst = updatedAddresses.length === 0;
        updatedAddresses.push({ ...addressData, id: Date.now().toString(), isDefault: isFirst });
      }

      await updateUserProfile({ addresses: updatedAddresses });
      showToast(editingAddressId ? 'Address updated!' : 'Address added!', 'success');
      setIsAddingAddress(false);
      setEditingAddressId(null);
    } catch (error) {
      showToast('Failed to save address', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Avatar Handlers ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
    }
    setIsUploading(true);
    try {
        const publicUrl = await uploadProductImage(file);
        if (publicUrl) {
            await updateUserProfile({ avatar: publicUrl });
            showToast('Profile picture updated!', 'success');
        }
    } catch (error) {
        showToast('Failed to upload image', 'error');
    } finally {
        setIsUploading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-24 md:pb-10">
      <LanguageModal isOpen={isLangModalOpen} onClose={() => setIsLangModalOpen(false)} />
      
      {/* Header Background */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-[#2874f0] to-[#1a5fc7] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-24 relative z-10">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Avatar & Header Section */}
          <div className="flex flex-col md:flex-row items-center md:items-end px-8 pt-0 pb-8 gap-6">
            <div className="relative">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <motion.div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center overflow-hidden relative group cursor-pointer"
                >
                    {isUploading && <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-20"><Loader2 size={32} className="animate-spin text-blue-600" /></div>}
                    {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <User size={64} className="text-gray-400" />}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"><Camera size={24} className="text-white" /></div>
                </motion.div>
            </div>

            <div className="text-center md:text-left flex-1 mb-2 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user.name || 'User'}</h1>
                        <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-1"><Shield size={16} className="text-green-500" /> Verified Customer</p>
                    </div>
                    
                    {/* Profile Completion Widget */}
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 w-full md:w-64">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-bold text-gray-600">Profile Completion</span>
                            <span className={`text-xs font-bold ${completionPercentage === 100 ? 'text-green-600' : 'text-blue-600'}`}>{completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ${completionPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                                style={{ width: `${completionPercentage}%` }}
                            ></div>
                        </div>
                        {completionPercentage < 100 && (
                            <p className="text-[10px] text-gray-400 mt-1">Complete your profile to unlock benefits</p>
                        )}
                    </div>
                </div>
            </div>
          </div>

          <div className="px-6 md:px-10 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* --- LEFT COLUMN: PERSONAL INFO & LANGUAGE --- */}
            <div className="space-y-8">
                
                {/* Language Settings */}
                <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Globe size={20} className="text-blue-600" /> {t('language_settings')}
                        </h3>
                        <button 
                            onClick={() => setIsLangModalOpen(true)}
                            className="text-blue-600 text-sm font-bold hover:underline"
                        >
                            {t('edit')}
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg border border-blue-200 text-blue-600 font-bold text-xl w-12 h-12 flex items-center justify-center">
                            {LANGUAGES.find(l => l.code === language)?.native.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">{LANGUAGES.find(l => l.code === language)?.native}</p>
                            <p className="text-xs text-gray-500">{LANGUAGES.find(l => l.code === language)?.name}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><User size={20} className="text-blue-600" /> {t('personal_info')}</h3>
                        {!isEditingPersonal ? (
                            <button onClick={() => setIsEditingPersonal(true)} className="text-blue-600 text-sm font-bold hover:underline">{t('edit')}</button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => setIsEditingPersonal(false)} className="text-gray-500 text-sm font-bold hover:underline">{t('cancel')}</button>
                                <button onClick={handleSavePersonal} disabled={isLoading} className="text-green-600 text-sm font-bold hover:underline flex items-center gap-1">
                                    {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Save size={14} />} {t('save')}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name</label>
                            <input 
                                type="text" 
                                value={personalData.name} 
                                onChange={(e) => setPersonalData({...personalData, name: e.target.value})}
                                readOnly={!isEditingPersonal}
                                className={`w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none ${isEditingPersonal ? 'border-blue-300 bg-white' : 'border-gray-200'}`}
                            />
                        </div>
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email Address</label>
                            <input 
                                type="email" 
                                value={personalData.email} 
                                onChange={(e) => setPersonalData({...personalData, email: e.target.value})}
                                readOnly={!isEditingPersonal}
                                className={`w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none ${isEditingPersonal ? 'border-blue-300 bg-white' : 'border-gray-200'}`}
                            />
                        </div>
                        
                        {/* Phone Numbers Section */}
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Mobile Number</label>
                            <input 
                                type="tel" 
                                value={personalData.phone} 
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 10) setPersonalData({...personalData, phone: val});
                                }}
                                readOnly={!isEditingPersonal}
                                placeholder="Primary Mobile Number"
                                className={`w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none ${isEditingPersonal ? 'border-blue-300 bg-white' : 'border-gray-200'}`}
                            />
                        </div>
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Secondary Mobile Number (Optional)</label>
                            <input 
                                type="tel" 
                                value={personalData.secondaryPhone} 
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 10) setPersonalData({...personalData, secondaryPhone: val});
                                }}
                                readOnly={!isEditingPersonal}
                                placeholder="Add alternate number"
                                className={`w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none ${isEditingPersonal ? 'border-blue-300 bg-white' : 'border-gray-200'}`}
                            />
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Gender</label>
                            <div className="flex gap-4">
                                {['Male', 'Female'].map(g => (
                                    <label key={g} className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${isEditingPersonal ? 'cursor-pointer border-blue-200 bg-blue-50' : 'cursor-default border-gray-200 bg-gray-50'}`}>
                                        <input 
                                            type="radio" 
                                            name="gender"
                                            checked={personalData.gender === g} 
                                            onChange={() => isEditingPersonal && setPersonalData({...personalData, gender: g})}
                                            disabled={!isEditingPersonal}
                                            className="accent-blue-600" 
                                        />
                                        <span className="text-sm font-bold text-gray-700">{g}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RIGHT COLUMN: ADDRESSES --- */}
            <div className="space-y-6">
                <div className="flex justify-between items-center pb-2">
                    <h3 className="text-lg font-bold text-gray-800">Saved addresses</h3>
                    {!isAddingAddress && (user.addresses?.length || 0) < 3 && (
                        <button onClick={handleAddAddressClick} className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1">
                            <Plus size={16} /> {t('add_new_address')}
                        </button>
                    )}
                </div>

                {/* Address List */}
                {!isAddingAddress ? (
                    <div className="space-y-4">
                        {(user.addresses && user.addresses.length > 0) ? (
                            user.addresses.map((addr, idx) => (
                                <div 
                                    key={addr.id} 
                                    onClick={() => handleSetDefaultAddress(addr.id)}
                                    className={`bg-white p-4 relative group border rounded-xl transition-all cursor-pointer ${addr.isDefault ? 'border-blue-500 shadow-sm ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className={`mt-0.5 ${addr.isDefault ? 'text-blue-600' : 'text-gray-400'}`}>
                                            {addr.type === 'Work' ? <Briefcase size={20} /> : <Home size={20} />}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 flex-wrap mb-1">
                                                <span className="font-bold text-gray-900 text-sm">{user.name}</span>
                                                {/* Show 'Currently selected' badge */}
                                                {addr.isDefault && (
                                                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                                                        <CheckCircle2 size={10} /> Selected
                                                    </span>
                                                )}
                                                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">{addr.type || 'Home'}</span>
                                            </div>
                                            
                                            <p className="text-gray-500 text-sm leading-relaxed">
                                                {addr.street}, {addr.city}, {addr.state} - {addr.zip}
                                            </p>
                                            <p className="text-gray-500 text-sm mt-1">
                                                Phone: <span className="font-medium text-gray-700">{user.phone}</span>
                                            </p>
                                        </div>

                                        {/* Menu Button */}
                                        <div className="relative">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenuId(activeMenuId === addr.id ? null : addr.id);
                                                }}
                                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
                                            >
                                                <MoreHorizontal size={20} />
                                            </button>
                                            
                                            {/* Dropdown Menu */}
                                            {activeMenuId === addr.id && (
                                                <div className="absolute right-0 top-full mt-1 w-32 bg-white shadow-lg rounded-lg border border-gray-100 z-10 overflow-hidden">
                                                    <button 
                                                        onClick={(e) => handleEditAddressClick(e, addr)}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <Edit2 size={14} /> Edit
                                                    </button>
                                                    <button 
                                                        onClick={(e) => handleDeleteAddress(e, addr.id)}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 text-sm">No addresses saved yet.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Add/Edit Address Form */
                    <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-gray-800 text-sm">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h4>
                            <button onClick={() => setIsAddingAddress(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex gap-2 mb-2">
                                {['Home', 'Work', 'Other'].map(type => (
                                    <button 
                                        key={type}
                                        onClick={() => setAddressData({...addressData, type: type as any})}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${addressData.type === type ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                            <input 
                                type="text" 
                                placeholder="Street Address" 
                                value={addressData.street}
                                onChange={(e) => setAddressData({...addressData, street: e.target.value.replace(/[^a-zA-Z0-9\s,.\-#/]/g, '')})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input 
                                    type="text" 
                                    placeholder="City" 
                                    value={addressData.city}
                                    onChange={(e) => setAddressData({...addressData, city: e.target.value.replace(/[^a-zA-Z\s]/g, '')})}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                />
                                <input 
                                    type="text" 
                                    placeholder="State" 
                                    value={addressData.state}
                                    onChange={(e) => setAddressData({...addressData, state: e.target.value.replace(/[^a-zA-Z\s]/g, '')})}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Zip Code" 
                                value={addressData.zip}
                                onChange={(e) => setAddressData({...addressData, zip: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                            />
                            <button 
                                onClick={handleSaveAddress}
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition shadow-sm mt-2 flex justify-center items-center gap-2"
                            >
                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : (editingAddressId ? 'Update Address' : 'Save Address')}
                            </button>
                        </div>
                    </div>
                )}
            </div>

          </div>

          {/* --- RECENTLY VIEWED SECTION --- */}
          {viewedItems.length > 0 && (
            <div className="px-6 md:px-10 pb-10 border-t border-gray-100 pt-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Clock size={20} className="text-blue-600" /> {t('recently_viewed')}
                    </h3>
                    <button 
                        onClick={clearHistory}
                        className="text-red-500 text-xs font-bold hover:bg-red-50 px-3 py-1.5 rounded-full transition flex items-center gap-1"
                    >
                        <Trash size={12} /> {t('delete')}
                    </button>
                </div>
                
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                    {viewedItems.map((item) => (
                        <div 
                            key={item.id}
                            onClick={() => navigate(`/product/${item.id}`)}
                            className="min-w-[160px] w-[160px] bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:shadow-lg transition-all group"
                        >
                            <div className="h-32 bg-gray-50 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                            </div>
                            <h4 className="text-xs font-bold text-gray-800 line-clamp-2 mb-1 h-8">{item.name}</h4>
                            <span className="text-sm font-bold text-gray-900">{formatPrice(item.price)}</span>
                        </div>
                    ))}
                </div>
            </div>
          )}

        </motion.div>

        {/* Mobile Logout */}
        <div className="mt-8 md:hidden">
            <button onClick={handleLogout} className="w-full bg-white border border-red-100 text-red-500 py-4 rounded-xl font-bold shadow-sm flex items-center justify-center gap-2">
                <LogOut size={20} /> {t('logout')}
            </button>
        </div>
      </div>
    </div>
  );
};
