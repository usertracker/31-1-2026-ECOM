import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { Product } from '../data/mockData';
import { db } from '../services/db';
import { useAuth } from './AuthContext';

export interface OrderItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
  paymentMethod: string;
  userId?: string;
  shippingAddress?: {
    street: string;
    city: string;
    zip: string;
  };
  customerDetails?: {
    name: string;
    phone: string;
  };
}

interface OrderContextType {
  orders: Order[];
  addOrder: (items: OrderItem[], total: number, paymentMethod: string, deliveryData?: any) => Promise<any>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    refreshOrders();
  }, [user?.id]); 

  const refreshOrders = async () => {
    if (user) {
        let data = [];
        if (user.role === 'admin') {
            data = await db.getAllOrders();
        } else {
            data = await db.getUserOrders(user.id);
        }
        if (isMounted.current) setOrders(data);
    } else {
        if (isMounted.current) setOrders([]); 
    }
  };

  const addOrder = async (items: OrderItem[], total: number, paymentMethod: string, deliveryData?: any) => {
    const newOrder: any = {
      // Removed manual 'date' field to prevent schema mismatch. 
      // DB uses 'created_at' which is handled in db.ts
      items,
      total,
      status: 'Processing',
      paymentMethod,
      shippingAddress: deliveryData ? {
        street: deliveryData.address,
        city: deliveryData.city,
        zip: deliveryData.zip
      } : null,
      customerDetails: deliveryData ? {
        name: deliveryData.name,
        phone: deliveryData.phone
      } : null
    };
    
    // Capture the created order to return it (for the success screen)
    const createdOrder = await db.createOrder(newOrder, user?.id);
    await refreshOrders();
    return createdOrder;
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
};
