import { supabase } from '../lib/supabase';
import { Product, INITIAL_PRODUCTS, DEAL_PRODUCTS, OCCASION_PRODUCTS } from '../data/mockData';

// --- Types ---
export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  type?: 'Home' | 'Work' | 'Other';
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  secondaryPhone?: string;
  email: string;
  gender?: string;
  avatar?: string;
  addresses?: Address[];
  language?: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastSeen?: string; // New field for Admin tracking
}

// Helper to lookup product details by ID
const getProductById = (id: string): Product | undefined => {
  const allProducts = [...INITIAL_PRODUCTS, ...DEAL_PRODUCTS, ...OCCASION_PRODUCTS];
  return allProducts.find(p => p.id === id);
};

// Helper to check if error is an AbortError (harmless cancellation)
const isAbortError = (error: any) => {
  return error?.message?.includes('AbortError') || 
         error?.details?.includes('AbortError') ||
         error?.code === '20';
};

// --- The Database Service ---
export const db = {
  
  // --- User Logic ---
  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (!isAbortError(error)) console.error("Error fetching users:", error);
        return [];
      }

      return (data || []).map((u: any) => ({
        ...u,
        secondaryPhone: u.secondary_phone,
        createdAt: u.created_at || u.createdAt,
        lastSeen: u.last_sign_in_at || u.created_at // Fallback if last_sign_in not available
      }));
    } catch (err) {
      return [];
    }
  },

  async findUserByPhone(phone: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .maybeSingle();
      
      if (error) return null;
      
      if (data) {
        return { 
            ...data, 
            secondaryPhone: data.secondary_phone,
            createdAt: data.created_at || data.createdAt 
        } as UserProfile;
      }
      return null;
    } catch (err) {
      return null;
    }
  },

  async findUserById(id: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) return null;
      
      if (data) {
        return { 
            ...data, 
            secondaryPhone: data.secondary_phone,
            createdAt: data.created_at || data.createdAt 
        } as UserProfile;
      }
      return null;
    } catch (err) {
      return null;
    }
  },

  async createUser(user: UserProfile): Promise<UserProfile> {
    const { createdAt, secondaryPhone, lastSeen, ...rest } = user;
    
    const dbUser = { 
        ...rest, 
        secondary_phone: secondaryPhone,
        created_at: createdAt 
    };

    const { data, error } = await supabase
      .from('users')
      .upsert(dbUser) 
      .select()
      .single();
      
    if (error) throw error;
    
    return { 
        ...data, 
        secondaryPhone: data.secondary_phone,
        createdAt: data.created_at || data.createdAt 
    } as UserProfile;
  },

  async updateUser(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const dbUpdates: any = { ...updates };
    
    if (updates.secondaryPhone !== undefined) {
        dbUpdates.secondary_phone = updates.secondaryPhone;
        delete dbUpdates.secondaryPhone;
    }

    const { data, error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { 
        ...data, 
        secondaryPhone: data.secondary_phone,
        createdAt: data.created_at || data.createdAt 
    } as UserProfile;
  },

  // --- Cart Logic (Synced) ---
  async getUserCart(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId);

      if (error) return [];

      return data.map(item => {
        const product = getProductById(item.product_id);
        if (!product) return null;
        return { ...product, quantity: item.quantity };
      }).filter(Boolean);
    } catch (err) {
      return [];
    }
  },

  async addToCart(userId: string, productId: string, quantity: number) {
    await supabase
      .from('cart_items')
      .upsert({ 
        user_id: userId, 
        product_id: productId, 
        quantity: quantity 
      }, { onConflict: 'user_id, product_id' });
  },

  async removeFromCart(userId: string, productId: string) {
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
  },

  async clearCart(userId: string) {
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
  },

  // --- Wishlist Logic (Synced) ---
  async getUserWishlist(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', userId);

      if (error) return [];

      return data.map(item => getProductById(item.product_id)).filter(Boolean);
    } catch (err) {
      return [];
    }
  },

  async addToWishlist(userId: string, productId: string) {
    await supabase
      .from('wishlist_items')
      .upsert({ user_id: userId, product_id: productId }, { onConflict: 'user_id, product_id' });
  },

  async removeFromWishlist(userId: string, productId: string) {
    await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
  },

  // --- Recently Viewed Logic (Synced) ---
  async getRecentlyViewed(userId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('recently_viewed')
        .select('*')
        .eq('user_id', userId)
        .order('viewed_at', { ascending: false })
        .limit(5);

      if (error) return [];

      return data.map(item => getProductById(item.product_id)).filter((p): p is Product => !!p);
    } catch (err) {
      return [];
    }
  },

  async addRecentlyViewed(userId: string, productId: string) {
    await supabase
      .from('recently_viewed')
      .upsert({ 
        user_id: userId, 
        product_id: productId,
        viewed_at: new Date().toISOString()
      }, { onConflict: 'user_id, product_id' });
  },

  async clearRecentlyViewed(userId: string) {
    await supabase
      .from('recently_viewed')
      .delete()
      .eq('user_id', userId);
  },

  // --- Product Logic ---
  async getAllProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase.from('products').select('*');
      
      if (error || !data || data.length === 0) {
        const allMockData = [...INITIAL_PRODUCTS, ...DEAL_PRODUCTS, ...OCCASION_PRODUCTS];
        return Array.from(new Map(allMockData.map(p => [p.id, p])).values());
      }
      
      return data.map((p: any) => ({
        ...p,
        originalPrice: p.original_price ?? p.originalPrice,
        sellerId: p.seller_id ?? p.sellerId,
        createdAt: p.created_at ?? p.createdAt,
        isBestSeller: p.is_best_seller ?? p.isBestSeller,
        stockCount: p.stock_count ?? 5,
      })) as Product[];
    } catch (err) {
      const allMockData = [...INITIAL_PRODUCTS, ...DEAL_PRODUCTS, ...OCCASION_PRODUCTS];
      return Array.from(new Map(allMockData.map(p => [p.id, p])).values());
    }
  },

  async createProduct(product: Product): Promise<Product> {
    const dbProduct: any = {
      name: product.name,
      category: product.category,
      price: product.price,
      original_price: product.originalPrice,
      discount: product.discount,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image,
      images: product.images,
      stock: product.stock,
      stock_count: product.stockCount || 5,
      description: product.description,
      specs: product.specs,
      seller_id: product.sellerId,
      is_best_seller: product.isBestSeller || false,
      created_at: product.createdAt || new Date().toISOString()
    };

    const idToUse = (product.id && product.id.trim() !== '') ? product.id : crypto.randomUUID();
    dbProduct.id = idToUse;

    const { data, error } = await supabase.from('products').upsert(dbProduct).select().single();
    if (error) throw error;
    
    return {
      ...data,
      originalPrice: data.original_price ?? data.originalPrice,
      sellerId: data.seller_id ?? data.sellerId,
      isBestSeller: data.is_best_seller ?? data.isBestSeller,
      stockCount: data.stock_count ?? 5,
      createdAt: data.created_at ?? data.createdAt,
    } as Product;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.originalPrice !== undefined) dbUpdates.original_price = updates.originalPrice;
    if (updates.discount !== undefined) dbUpdates.discount = updates.discount;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.reviews !== undefined) dbUpdates.reviews = updates.reviews;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
    if (updates.stockCount !== undefined) dbUpdates.stock_count = updates.stockCount;
    if (updates.specs !== undefined) dbUpdates.specs = updates.specs;
    if (updates.sellerId !== undefined) dbUpdates.seller_id = updates.sellerId;
    if (updates.isBestSeller !== undefined) dbUpdates.is_best_seller = updates.isBestSeller;

    const { error } = await supabase.from('products').update(dbUpdates).eq('id', id);
    if (error) throw error;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },

  // --- Order Logic ---
  async getUserOrders(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId);
        
      if (error) return [];
      
      const orders = (data || []).map((o: any) => ({
        ...o,
        paymentMethod: o.payment_method ?? o.paymentMethod,
        shippingAddress: o.shipping_address,
        customerDetails: o.customer_details,
        date: o.date || o.created_at
      }));

      return orders.sort((a: any, b: any) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA;
      });
    } catch (err) {
      return [];
    }
  },

  async getAllOrders(): Promise<any[]> {
    try {
      const { data, error } = await supabase.from('orders').select('*');
      if (error) return [];
      
      const orders = (data || []).map((o: any) => ({
        ...o,
        paymentMethod: o.payment_method ?? o.paymentMethod,
        shippingAddress: o.shipping_address,
        customerDetails: o.customer_details,
        date: o.date || o.created_at
      }));

      return orders.sort((a: any, b: any) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA;
      });
    } catch (err) {
      return [];
    }
  },

  async createOrder(order: any, userId?: string): Promise<any> {
    const { paymentMethod, shippingAddress, customerDetails, date, ...rest } = order;

    const dbOrder = {
      ...rest,
      id: crypto.randomUUID(),
      user_id: userId || null,
      payment_method: paymentMethod,
      shipping_address: shippingAddress,
      customer_details: customerDetails,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(dbOrder)
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      ...data,
      paymentMethod: data.payment_method ?? data.paymentMethod,
      shippingAddress: data.shipping_address,
      customerDetails: data.customer_details
    };
  },

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
      
    if (error) throw error;
  }
};
