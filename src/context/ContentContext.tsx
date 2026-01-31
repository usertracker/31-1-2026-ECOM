import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { contentService } from '../services/content';

interface ContentContextType {
  assets: Record<string, string>;
  refreshAssets: () => Promise<void>;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [assets, setAssets] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const refreshAssets = async () => {
    try {
      const data = await contentService.getAllAssets();
      if (!isMounted.current) return;
      
      const assetMap: Record<string, string> = {};
      data.forEach(item => {
        assetMap[item.key] = item.value;
      });
      setAssets(assetMap);
    } catch (error) {
      console.error("Failed to load site assets", error);
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAssets();
  }, []);

  return (
    <ContentContext.Provider value={{ assets, refreshAssets, isLoading }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within a ContentProvider');
  return context;
};
