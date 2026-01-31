import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { Product } from '../data/mockData';
import { useAuth } from './AuthContext';
import { db } from '../services/db';
import { useToast } from './ToastContext';

interface RecentlyViewedContextType {
  viewedItems: Product[];
  addToViewed: (product: Product) => void;
  clearHistory: () => Promise<void>;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const RecentlyViewedProvider = ({ children }: { children: ReactNode }) => {
  const [viewedItems, setViewedItems] = useState<Product[]>([]);
  const { user } = useAuth();
  const { showToast } = useToast();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Load from LocalStorage on initial mount (for guests)
  useEffect(() => {
    if (!user) {
        const stored = localStorage.getItem('recentlyViewed');
        if (stored) {
            // Logic to load items from local storage IDs would go here
            // For now, we rely on DB sync when logged in
        }
    }
  }, [user]);

  // Sync Logic
  useEffect(() => {
    const syncViewed = async () => {
      if (user && user.role === 'user') {
        try {
            const dbHistory = await db.getRecentlyViewed(user.id);
            if (!isMounted.current) return;

            const localStored = localStorage.getItem('recentlyViewed');
            const localIds: string[] = localStored ? JSON.parse(localStored) : [];
            
            if (localIds.length > 0) {
                for (const pid of localIds) {
                    await db.addRecentlyViewed(user.id, pid);
                }
                localStorage.removeItem('recentlyViewed');
                
                const mergedList = await db.getRecentlyViewed(user.id);
                if (isMounted.current) setViewedItems(mergedList);
            } else {
                setViewedItems(dbHistory);
            }
        } catch (error) {
            console.error("Recently Viewed sync failed", error);
        }
      } else if (!user) {
        if (isMounted.current) setViewedItems([]);
      }
    };
    syncViewed();
  }, [user?.id]);

  const addToViewed = async (product: Product) => {
    setViewedItems((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 5);
    });

    if (user && user.role === 'user') {
      await db.addRecentlyViewed(user.id, product.id);
    } else {
      const stored = localStorage.getItem('recentlyViewed');
      const ids: string[] = stored ? JSON.parse(stored) : [];
      const newIds = [product.id, ...ids.filter(id => id !== product.id)].slice(0, 5);
      localStorage.setItem('recentlyViewed', JSON.stringify(newIds));
    }
  };

  const clearHistory = async () => {
    setViewedItems([]);
    if (user && user.role === 'user') {
        await db.clearRecentlyViewed(user.id);
        showToast('Browsing history cleared', 'success');
    } else {
        localStorage.removeItem('recentlyViewed');
        showToast('Browsing history cleared', 'success');
    }
  };

  return (
    <RecentlyViewedContext.Provider value={{ viewedItems, addToViewed, clearHistory }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  return context;
};
