import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import { formatPrice } from '../../lib/utils';
import { ShoppingBag, Package, DollarSign, Users, UploadCloud, Loader2, Trash2, RefreshCw, TrendingUp, ArrowUpRight, Activity, Eye, TrendingDown } from 'lucide-react';
import { INITIAL_PRODUCTS, OCCASION_PRODUCTS, DEAL_PRODUCTS } from '../../data/mockData';
import { supabase } from '../../lib/supabase';
import { db } from '../../services/db';
import { useToast } from '../../context/ToastContext';
import { useAdminTheme } from '../../context/AdminThemeContext';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export const AdminDashboard = () => {
  const { orders } = useOrders();
  const { products, refreshProducts } = useProducts();
  const { showToast } = useToast();
  const { isDark } = useAdminTheme();
  
  const [isSeeding, setIsSeeding] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

  // Mock Data for Charts matching the reference image style
  const chartDataGreen = [
    { value: 10 }, { value: 25 }, { value: 15 }, { value: 30 }, { value: 20 }, { value: 45 }, { value: 25 }, { value: 50 }, { value: 35 }
  ];
  const chartDataYellow = [
    { value: 20 }, { value: 15 }, { value: 35 }, { value: 25 }, { value: 45 }, { value: 30 }, { value: 60 }, { value: 40 }, { value: 25 }
  ];
  const chartDataBlue = [
    { value: 15 }, { value: 30 }, { value: 20 }, { value: 40 }, { value: 35 }, { value: 55 }, { value: 45 }, { value: 30 }, { value: 20 }
  ];

  // Theme Classes
  const bgClass = isDark ? 'bg-[#0f111a]' : 'bg-[#f8f9fa]';
  const cardClass = isDark ? 'bg-[#1e2130] border-gray-800' : 'bg-white border-gray-200';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  const tableHeaderBg = isDark ? 'bg-[#13151f]' : 'bg-gray-50';
  const tableRowHover = isDark ? 'hover:bg-[#13151f]' : 'hover:bg-gray-50';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';

  // AUTO-SYNC LOGIC
  useEffect(() => {
    const checkAndSync = async () => {
        try {
            const { count, error } = await supabase.from('products').select('*', { count: 'exact', head: true });
            if (!error && (count === 0 || (count !== null && count < 5))) {
                handleSeedData(true);
            }
        } catch (err) { console.error("Auto-sync check failed", err); }
    };
    const timer = window.setTimeout(checkAndSync, 1500);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSeedData = async (silent = false) => {
    if (!silent && !confirm("Upload ALL mock products?")) return;
    setIsSeeding(true);
    if (!silent) showToast('Starting data sync...', 'info');
    try {
        const allProductsMap = new Map();
        [...INITIAL_PRODUCTS, ...DEAL_PRODUCTS, ...OCCASION_PRODUCTS].forEach(p => allProductsMap.set(p.id, p));
        const allProducts = Array.from(allProductsMap.values());
        
        for (const product of allProducts) {
            const { id, ...productData } = product;
            const { data } = await supabase.from('products').select('id').eq('id', product.id).maybeSingle();
            if (!data) {
                await db.createProduct({ ...productData, id: product.id, sellerId: productData.sellerId || 'seller_123' });
            }
        }
        await refreshProducts();
        if (!silent) showToast(`Sync Complete!`, 'success');
    } catch (error: any) {
        if (!silent) showToast('Failed: ' + error.message, 'error');
    } finally {
        setIsSeeding(false);
    }
  };

  const handleResetData = async () => {
    if (!confirm("⚠️ DELETE ALL DATA?")) return;
    setIsResetting(true);
    try {
        await supabase.from('orders').delete().neq('id', '0');
        await supabase.from('products').delete().neq('id', '0');
        await refreshProducts();
        showToast('Database reset successfully!', 'success');
    } catch (error: any) {
        showToast('Failed: ' + error.message, 'error');
    } finally {
        setIsResetting(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshProducts();
    setIsRefreshing(false);
  };

  // --- NEW COMPONENTS MATCHING REFERENCE IMAGE ---

  const SparklineCard = ({ title, value, change, isPositive, data, colorHex }: any) => (
    <div className={`${cardClass} p-6 rounded-2xl shadow-sm border flex flex-col justify-between relative overflow-hidden h-40`}>
        <div className="flex justify-between items-start z-10 mb-2">
            <div>
                <h3 className={`text-2xl font-bold ${textMain} mb-1`}>{value}</h3>
                <p className={`text-xs font-medium ${textSub}`}>{title}</p>
            </div>
            <div className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 ${isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {change}
            </div>
        </div>
        
        {/* Chart */}
        <div className="absolute bottom-0 left-0 right-0 h-20 opacity-50">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colorHex} stopOpacity={0.5}/>
                            <stop offset="95%" stopColor={colorHex} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={colorHex} 
                        strokeWidth={2} 
                        fill={`url(#grad-${title})`} 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );

  const ProgressCard = ({ title, value, change, isPositive, goal, progress, colorClass }: any) => (
    <div className={`${cardClass} p-6 rounded-2xl shadow-sm border flex flex-col justify-between h-40`}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className={`text-2xl font-bold ${textMain} mb-1`}>{value}</h3>
                <p className={`text-xs font-medium ${textSub}`}>{title}</p>
            </div>
            <div className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 ${isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {change}
            </div>
        </div>

        <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-2">
                <span>{goal} left to Goal</span>
                <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-700/30 rounded-full h-1.5 overflow-hidden">
                <div 
                    className={`h-full rounded-full ${colorClass}`} 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    </div>
  );

  return (
    <div className={`flex h-screen font-sans overflow-hidden ${bgClass}`}>
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto pt-16 md:pt-8 custom-scrollbar transition-colors duration-300">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className={`text-3xl font-bold tracking-tight ${textMain}`}>Dashboard</h1>
                <p className={`text-sm mt-1 ${textSub}`}>Overview of your store's performance</p>
            </div>
            
            <div className="flex gap-3 flex-wrap">
                <button 
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className={`${cardClass} ${textSub} px-3 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-80 transition shadow-sm`}
                >
                    <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
                </button>

                <button 
                    onClick={handleResetData}
                    disabled={isResetting}
                    className={`${cardClass} text-red-500 px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition shadow-sm text-sm font-bold`}
                >
                    {isResetting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    <span>Reset</span>
                </button>

                <button 
                    onClick={() => handleSeedData(false)}
                    disabled={isSeeding}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-lg disabled:opacity-70 text-sm font-bold"
                >
                    {isSeeding ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                    <span>Sync Data</span>
                </button>
            </div>
        </div>
        
        {/* --- ROW 1: SPARKLINE CHARTS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <SparklineCard 
                title="Total Sales" 
                value={formatPrice(totalRevenue)} 
                change="8.6%" 
                isPositive={false} 
                data={chartDataGreen} 
                colorHex="#10b981" // Green/Teal
            />
            <SparklineCard 
                title="Total Accounts" 
                value="85,247" 
                change="23.7%" 
                isPositive={true} 
                data={chartDataYellow} 
                colorHex="#f59e0b" // Yellow/Orange
            />
            <SparklineCard 
                title="Average Weekly Sales" 
                value={formatPrice(totalRevenue / 4)} 
                change="8.6%" 
                isPositive={false} 
                data={chartDataBlue} 
                colorHex="#3b82f6" // Blue
            />
        </div>

        {/* --- ROW 2: PROGRESS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ProgressCard 
                title="Sale This Year" 
                value={formatPrice(totalRevenue * 12)} 
                change="24.7%" 
                isPositive={true} 
                goal="285" 
                progress={68} 
                colorClass="bg-blue-600"
            />
            <ProgressCard 
                title="Sale This Month" 
                value={formatPrice(totalRevenue)} 
                change="18.6%" 
                isPositive={false} 
                goal="285" 
                progress={78} 
                colorClass="bg-gradient-to-r from-orange-500 to-pink-500"
            />
            <ProgressCard 
                title="Sale This Week" 
                value={formatPrice(totalRevenue / 4)} 
                change="42.6%" 
                isPositive={true} 
                goal="285" 
                progress={88} 
                colorClass="bg-green-500"
            />
        </div>

        {/* --- ROW 3: RECENT ORDERS & SYSTEM STATUS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Orders Table */}
            <div className={`lg:col-span-2 rounded-xl shadow-sm border overflow-hidden ${cardClass}`}>
                <div className={`p-6 border-b flex justify-between items-center ${borderColor}`}>
                    <h2 className={`text-lg font-bold ${textMain}`}>Recent Orders</h2>
                    <button className="text-blue-500 text-sm font-bold hover:underline flex items-center gap-1">
                        View All <ArrowUpRight size={16} />
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                    <thead className={tableHeaderBg}>
                        <tr className={`text-xs uppercase tracking-wider ${textSub}`}>
                        <th className="px-6 py-4 font-semibold">Order ID</th>
                        <th className="px-6 py-4 font-semibold">Date</th>
                        <th className="px-6 py-4 font-semibold">Amount</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className={`text-sm divide-y ${borderColor}`}>
                        {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className={`${tableRowHover} transition-colors`}>
                            <td className={`px-6 py-4 font-medium ${textMain}`}>#{order.id.slice(0,8)}</td>
                            <td className={`px-6 py-4 ${textSub}`}>{new Date(order.date).toLocaleDateString()}</td>
                            <td className={`px-6 py-4 font-medium ${textMain}`}>{formatPrice(order.total)}</td>
                            <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 
                                order.status === 'Processing' ? 'bg-blue-500/10 text-blue-500' : 
                                'bg-gray-500/10 text-gray-500'
                            }`}>
                                {order.status}
                            </span>
                            </td>
                        </tr>
                        ))}
                        {orders.length === 0 && (
                        <tr>
                            <td colSpan={4} className={`py-12 text-center ${textSub}`}>
                            <Package size={32} className="mx-auto mb-2 opacity-50" />
                            <p>No orders found</p>
                            </td>
                        </tr>
                        )}
                    </tbody>
                    </table>
                </div>
            </div>

            {/* System Health */}
            <div className={`rounded-xl shadow-sm border p-6 ${cardClass}`}>
                <h2 className={`text-lg font-bold mb-4 ${textMain}`}>System Status</h2>
                <div className="space-y-4">
                    <div className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-100'}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-800'}`}>Database</span>
                        </div>
                        <span className="text-xs text-green-500 font-bold">Healthy</span>
                    </div>
                    <div className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>Storage</span>
                        </div>
                        <span className="text-xs text-blue-500 font-bold">Active</span>
                    </div>
                    
                    <div className={`mt-6 pt-6 border-t ${borderColor}`}>
                        <h3 className={`text-sm font-bold mb-3 ${textMain}`}>Quick Actions</h3>
                        <button className={`w-full text-left px-4 py-2 text-sm rounded-md transition mb-1 ${isDark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50'}`}>
                            • Manage Categories
                        </button>
                        <button className={`w-full text-left px-4 py-2 text-sm rounded-md transition mb-1 ${isDark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50'}`}>
                            • View User Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
