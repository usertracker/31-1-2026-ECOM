import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '../data/mockData';
import { db } from '../services/db';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Load from DB on mount
  useEffect(() => {
    refreshProducts();
  }, []);

  const refreshProducts = async () => {
    const data = await db.getAllProducts();
    setProducts(data);
  };

  const addProduct = async (product: Product) => {
    await db.createProduct(product);
    // Optimistic update: Add to local state immediately
    setProducts(prev => [...prev, product]);
    // Background refresh to ensure consistency
    refreshProducts();
  };

  const updateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    await db.updateProduct(id, updatedProduct);
    // Optimistic update: Update local state immediately
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = async (id: string) => {
    // 1. Optimistic Update: Remove from UI immediately
    setProducts(prev => prev.filter(item => item.id !== id));
    
    // 2. Perform DB Deletion
    await db.deleteProduct(id);
    
    // 3. Optional: Refresh to be 100% sure (usually not needed if optimistic works)
    // await refreshProducts(); 
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};
