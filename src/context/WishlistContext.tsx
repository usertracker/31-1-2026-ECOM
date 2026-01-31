import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '../data/mockData';
import { useAuth } from './AuthContext';
import { db } from '../services/db';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { user } = useAuth();
  const { showToast } = useToast();

  // Sync Logic: Runs when User ID changes
  useEffect(() => {
    const syncWishlist = async () => {
      if (user && user.role === 'user') {
        try {
            // 1. Fetch DB Wishlist
            const dbWishlist = await db.getUserWishlist(user.id);
            
            // 2. Identify Guest Items to Merge (Items in local but not in DB)
            const guestItems = wishlist.filter(localItem => 
                !dbWishlist.some(dbItem => dbItem.id === localItem.id)
            );

            if (guestItems.length > 0) {
                // Upload guest items
                for (const item of guestItems) {
                    await db.addToWishlist(user.id, item.id);
                }
                
                // 3. Refetch merged list
                const mergedList = await db.getUserWishlist(user.id);
                setWishlist(mergedList);
                showToast('Wishlist synced with account', 'success');
            } else {
                setWishlist(dbWishlist);
            }
        } catch (error) {
            console.error("Wishlist sync failed", error);
        }
      } else if (!user) {
        // Logout: Clear local wishlist
        setWishlist([]);
      }
    };
    syncWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const addToWishlist = async (product: Product) => {
    // Optimistic update
    setWishlist((prev) => {
      if (!prev.find((item) => item.id === product.id)) {
        return [...prev, product];
      }
      return prev;
    });

    if (user && user.role === 'user') {
      await db.addToWishlist(user.id, product.id);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));

    if (user && user.role === 'user') {
      await db.removeFromWishlist(user.id, productId);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
