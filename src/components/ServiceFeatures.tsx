import React from 'react';
import { Truck, ShieldCheck, Headphones, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ServiceFeatures = () => {
  const { t } = useLanguage();

  const FEATURES = [
    {
      icon: <Truck size={28} />,
      title: t('free_delivery'),
      desc: "On orders over ₹499"
    },
    {
      icon: <ShieldCheck size={28} />,
      title: t('secure_payment'),
      desc: "100% secure payment"
    },
    {
      icon: <RefreshCw size={28} />,
      title: t('easy_returns'),
      desc: "10 Days Return Policy"
    },
    {
      icon: <Headphones size={28} />,
      title: t('support_247'),
      desc: "Dedicated support"
    }
  ];

  return (
    <div className="bg-white py-8 border-b border-gray-100 shadow-sm mb-4">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-4 group cursor-default">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm md:text-base">{feature.title}</h3>
                <p className="text-xs md:text-sm text-gray-500">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
