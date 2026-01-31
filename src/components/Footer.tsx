import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, MessageCircle, CreditCard, Truck, Headphones, 
  Apple, Play, AlertCircle, ShoppingBag, MapPin, Package,
  Facebook, Instagram, Youtube, Twitter, Linkedin, Lock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  const CITIES = [
    "Mumbai", "Delhi", "Bangalore", "Kolkata", "Chennai", 
    "Hyderabad", "Ahmedabad", "Pune"
  ];

  return (
    <footer className="bg-[#172337] text-white pt-6 md:pt-8 pb-0 text-xs font-sans border-t border-gray-800">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        
        {/* Top Header Strip - Compact Grid on Mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8 border-b border-gray-700 pb-4">
            <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider text-[10px] md:text-[11px]">
                <AlertCircle size={16} className="text-gray-400 flex-shrink-0" />
                <span>Quick Links</span>
            </div>
            <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider text-[10px] md:text-[11px]">
                <ShoppingBag size={16} className="text-gray-400 flex-shrink-0" />
                <span>FlipZon</span>
            </div>
            <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider text-[10px] md:text-[11px]">
                <CreditCard size={16} className="text-gray-400 flex-shrink-0" />
                <span>{t('secure_payment')}</span>
            </div>
            <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider text-[10px] md:text-[11px]">
                <Package size={16} className="text-gray-400 flex-shrink-0" />
                <span>Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider text-[10px] md:text-[11px]">
                <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                <span>Cities Covered</span>
            </div>
            <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider text-[10px] md:text-[11px]">
                <Headphones size={16} className="text-gray-400 flex-shrink-0" />
                <span>{t('support_247')}</span>
            </div>
        </div>

        {/* Main Grid Content - Optimized 2-Column Layout for Mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-8 mb-8 md:mb-10">
            
            {/* Column 1: Quick Links */}
            <div>
                <h4 className="text-white font-bold mb-3 md:hidden">Quick Links</h4>
                <ul className="space-y-2 text-[#b0b0b0]">
                    <li><Link to="#" className="hover:text-white hover:underline transition-colors">About Us</Link></li>
                    <li><Link to="#" className="hover:text-white hover:underline transition-colors">Contact Us</Link></li>
                    <li><Link to="#" className="hover:text-white hover:underline transition-colors">Corporate Enquiries</Link></li>
                    <li><Link to="#" className="hover:text-white hover:underline transition-colors">Intellectual Property</Link></li>
                    <li><Link to="#" className="hover:text-white hover:underline transition-colors">Sitemap</Link></li>
                    <li><Link to="#" className="hover:text-white hover:underline transition-colors">Track Order</Link></li>
                </ul>
            </div>

            {/* Column 2: Ubuy */}
            <div className="flex flex-col">
                <h4 className="text-white font-bold mb-3 md:hidden">FlipZon</h4>
                <ul className="space-y-2 text-[#b0b0b0] mb-4 md:mb-6">
                    <li><Link to="#" className="hover:text-white hover:underline transition-colors">FlipZon Membership</Link></li>
                    <li><Link to="#" className="hover:text-white hover:underline transition-colors">{t('customer_reviews')}</Link></li>
                    <li><Link to="#" className="hover:text-white hover:underline transition-colors">Return Policy</Link></li>
                    <li><Link to="#" className="hover:text-white hover:underline transition-colors">Careers</Link></li>
                    <li><Link to="#" className="hover:text-white hover:underline transition-colors">Blog</Link></li>
                    <li><Link to="#" className="hover:text-white hover:underline transition-colors">FlipZon Affiliates</Link></li>
                </ul>
            </div>

             {/* Column 3: Payments - Spans full width on mobile for better fit */}
            <div className="col-span-2 md:col-span-1">
                <h4 className="text-white font-bold mb-3 md:hidden">Payment Methods</h4>
                <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
                    <div className="bg-white text-black px-2 py-1.5 rounded-sm flex items-center justify-center md:justify-start gap-1.5 font-bold text-[9px] md:text-[10px] shadow-sm">
                        <CreditCard size={12} className="text-blue-600"/> Paypal
                    </div>
                    <div className="bg-white text-black px-2 py-1.5 rounded-sm flex items-center justify-center md:justify-start gap-1.5 font-bold text-[9px] md:text-[10px] shadow-sm">
                        <CreditCard size={12} className="text-orange-500"/> Discover
                    </div>
                    <div className="bg-white text-black px-2 py-1.5 rounded-sm flex items-center justify-center md:justify-start gap-1.5 font-bold text-[9px] md:text-[10px] shadow-sm">
                        <CreditCard size={12} className="text-blue-800"/> Visa
                    </div>
                    <div className="bg-white text-black px-2 py-1.5 rounded-sm flex items-center justify-center md:justify-start gap-1.5 font-bold text-[9px] md:text-[10px] shadow-sm">
                        <CreditCard size={12} className="text-red-600"/> Mastercard
                    </div>
                    <div className="bg-white text-black px-2 py-1.5 rounded-sm flex items-center justify-center md:justify-start gap-1.5 font-bold text-[9px] md:text-[10px] shadow-sm">
                        <CreditCard size={12} className="text-blue-500"/> Amex
                    </div>
                    <div className="bg-white text-black px-2 py-1.5 rounded-sm flex items-center justify-center md:justify-start gap-1.5 font-bold text-[9px] md:text-[10px] shadow-sm">
                        <CreditCard size={12} className="text-green-600"/> RuPay
                    </div>
                </div>
            </div>

            {/* Column 4: Shipping */}
            <div>
                 <h4 className="text-white font-bold mb-3 md:hidden">Shipping</h4>
                 <ul className="space-y-3 md:space-y-4 text-[#b0b0b0]">
                    <li className="flex items-start gap-2">
                        <Truck size={16} className="text-yellow-500 flex-shrink-0 mt-0.5"/> 
                        <div>
                            <span className="block text-white font-medium">Express Shipping</span>
                            <span className="text-[10px]">3-6 Business Days</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-2">
                        <Truck size={16} className="text-gray-400 flex-shrink-0 mt-0.5"/> 
                        <div>
                            <span className="block text-white font-medium">Standard Shipping</span>
                            <span className="text-[10px]">10+ Business Days</span>
                        </div>
                    </li>
                </ul>
            </div>

             {/* Column 5: Cities */}
            <div>
                 <h4 className="text-white font-bold mb-3 md:hidden">Cities Covered</h4>
                 <ul className="space-y-1.5 md:space-y-2 text-[#b0b0b0]">
                    {CITIES.map((city, index) => (
                        <li key={city} className={index >= 5 ? 'hidden md:block' : ''}>{city}</li>
                    ))}
                    <li className="pt-1"><Link to="#" className="text-blue-400 font-medium hover:underline">View More &gt;</Link></li>
                </ul>
            </div>

             {/* Column 6: Support - Spans full width on mobile */}
            <div className="col-span-2 md:col-span-1">
                <div className="bg-[#232f3e] p-3 rounded-md border border-gray-700 mb-4 shadow-md">
                    <div className="flex items-center gap-2 text-[#ffc107] mb-1">
                        <Headphones size={16} />
                        <span className="font-bold text-xs">{t('support_247')}</span>
                    </div>
                    <p className="text-[#b0b0b0] text-[10px]">
                        We answer in your native language
                    </p>
                </div>

                <div className="flex justify-between md:block mb-4 md:mb-6">
                    <div className="mb-0 md:mb-3">
                        <div className="flex items-center gap-2 text-[#b0b0b0] mb-0.5">
                            <Phone size={14} className="text-[#ffc107]"/>
                            <span>Customer Care</span>
                        </div>
                        <div className="text-white font-bold pl-6 text-xs tracking-wide">(+91) 7901655023</div>
                    </div>
                    
                    <div>
                        <div className="flex items-center gap-2 text-[#b0b0b0] mb-0.5">
                            <MessageCircle size={14} className="text-green-500"/>
                            <span>Whatsapp</span>
                        </div>
                        <div className="text-white font-bold pl-6 text-xs tracking-wide">+1 (985) 531-1119</div>
                    </div>
                </div>

                <div className="flex gap-2">
                     <button className="bg-black border border-gray-600 rounded-md flex items-center px-2 py-1.5 gap-2 hover:bg-gray-900 transition flex-1 justify-center">
                        <Apple size={16} className="text-white"/> 
                        <div className="text-left leading-none">
                            <div className="text-[8px] text-gray-400">Download on</div>
                            <div className="text-[10px] font-bold text-white">App Store</div>
                        </div>
                     </button>
                      <button className="bg-black border border-gray-600 rounded-md flex items-center px-2 py-1.5 gap-2 hover:bg-gray-900 transition flex-1 justify-center">
                        <Play size={16} className="text-white fill-current"/> 
                        <div className="text-left leading-none">
                            <div className="text-[8px] text-gray-400">Get it on</div>
                            <div className="text-[10px] font-bold text-white">Google Play</div>
                        </div>
                     </button>
                </div>
            </div>
        </div>
        
        {/* Bottom Copyright Bar */}
        <div className="border-t border-gray-800 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[#b0b0b0]">
            <div className="text-[10px] md:text-xs text-center md:text-left">
                Copyright © 2025 FlipZon Co. All rights reserved.
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[10px] md:text-xs font-medium">
                <Link to="#" className="hover:text-white transition-colors">Terms & Conditions</Link>
                <span className="text-gray-600">•</span>
                <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                <span className="text-gray-600">•</span>
                <Link to="#" className="hover:text-white transition-colors">About Us</Link>
                <span className="text-gray-600">•</span>
                <Link to="#" className="hover:text-white transition-colors">Contact Us</Link>
                <span className="text-gray-600">•</span>
                <Link to="/admin" className="hover:text-white transition-colors flex items-center gap-1">
                    <Lock size={12} /> Admin
                </Link>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                <span className="text-[10px] md:text-xs font-medium mr-1 md:mr-2">Follow Us</span>
                <a href="#" className="bg-white text-[#1877F2] p-1 md:p-1.5 rounded-full hover:scale-110 transition-transform"><Facebook size={12} className="md:w-[14px] md:h-[14px]" fill="currentColor" /></a>
                <a href="#" className="bg-white text-[#E4405F] p-1 md:p-1.5 rounded-full hover:scale-110 transition-transform"><Instagram size={12} className="md:w-[14px] md:h-[14px]" /></a>
                <a href="#" className="bg-white text-[#FF0000] p-1 md:p-1.5 rounded-full hover:scale-110 transition-transform"><Youtube size={12} className="md:w-[14px] md:h-[14px]" fill="currentColor" /></a>
                <a href="#" className="bg-white text-black p-1 md:p-1.5 rounded-full hover:scale-110 transition-transform"><Twitter size={12} className="md:w-[14px] md:h-[14px]" fill="currentColor" /></a>
                <a href="#" className="bg-white text-[#BD081C] p-1 md:p-1.5 rounded-full hover:scale-110 transition-transform"><Linkedin size={12} className="md:w-[14px] md:h-[14px]" fill="currentColor" /></a>
            </div>
        </div>
      </div>
    </footer>
  );
};
