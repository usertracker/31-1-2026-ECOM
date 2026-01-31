import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TRANSLATIONS } from '../data/languages';
import { useAuth } from './AuthContext';
import { db } from '../services/db';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState('en');
  const { user } = useAuth();

  // Load language from local storage or user profile
  useEffect(() => {
    const initLanguage = async () => {
      const storedLang = localStorage.getItem('app_language');
      
      if (user && user.language) {
        setLanguageState(user.language);
        if (user.language !== storedLang) {
            localStorage.setItem('app_language', user.language);
        }
      } else if (storedLang) {
        setLanguageState(storedLang);
      }
    };
    
    initLanguage();
  }, [user]);

  const setLanguage = async (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
    
    // If logged in, save to DB
    if (user) {
      try {
        await db.updateUser(user.id, { language: lang });
      } catch (error) {
        console.error("Failed to save language preference", error);
      }
    }
  };

  const t = (key: string): string => {
    const langData = TRANSLATIONS[language] || TRANSLATIONS['en'];
    return langData[key] || TRANSLATIONS['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
