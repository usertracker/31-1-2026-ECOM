import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { Product } from '../data/mockData';
import { useAuth } from './AuthContext';
import { db } from '../services/db';
import { useToast } from './ToastContext';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isSyncing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Sync Logic: Runs when User ID changes (Login/Logout)
  useEffect(() => {
    const syncCart = async () => {
      if (user && user.role === 'user') {
        if(isMounted.current) setIsSyncing(true);
        try {
            console.log("🔄 Syncing cart for user:", user.id);
            
            // 1. Fetch existing DB Cart
            const dbCart = await db.getUserCart(user.id);
            if (!isMounted.current) return;

            // 2. MERGE LOGIC
            let hasChanges = false;
            const dbCartMap = new Map(dbCart.map(item => [item.id, item]));

            for (const localItem of cart) {
                const dbItem = dbCartMap.get(localItem.id);
                
                if (dbItem) {
                     if (localItem.quantity > 0) {
                        if (localItem.quantity !== dbItem.quantity) {
                             await db.addToCart(user.id, localItem.id, localItem.quantity);
                             hasChanges = true;
                        }
                     }
                } else {
                    await db.addToCart(user.id, localItem.id, localItem.quantity);
                    hasChanges = true;
                }
            }

            if (cart.length > 0 && hasChanges && isMounted.current) {
                showToast('Cart synced with your account', 'success');
            }

            // 4. Finally, fetch the Source of Truth from DB
            const finalCart = await db.getUserCart(user.id);
            if (isMounted.current) setCart(finalCart);

        } catch (error) {
            console.error("❌ Cart sync failed:", error);
        } finally {
            if(isMounted.current) setIsSyncing(false);
        }
      } else if (!user) {
        if(isMounted.current) setCart([]);
      }
    };

    syncCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); 

  const addToCart = async (product: Product, qty: number = 1) => {
    let newCart = [...cart];
    const existingIndex = newCart.findIndex((item) => item.id === product.id);

    if (existingIndex > -1) {
      newCart[existingIndex].quantity += qty;
    } else {
      newCart.push({ ...product, quantity: qty });
    }

    setCart(newCart);

    if (user && user.role === 'user') {
      const item = newCart.find(i => i.id === product.id);
      if (item) {
        if(isMounted.current) setIsSyncing(true);
        try {
            await db.addToCart(user.id, product.id, item.quantity);
        } catch (err) {
            console.error("Failed to save to DB", err);
        } finally {
            if(isMounted.current) setIsSyncing(false);
        }
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    
    if (user && user.role === 'user') {
      if(isMounted.current) setIsSyncing(true);
      try {
        await db.removeFromCart(user.id, productId);
      } finally {
        if(isMounted.current) setIsSyncing(false);
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );

    if (user && user.role === 'user') {
      try {
        await db.addToCart(user.id, productId, quantity);
      } catch (err) {
        console.error("Failed to update qty", err);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (user && user.role === 'user') {
      await db.clearCart(user.id);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, isSyncing }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
