import React, { useMemo } from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import { formatPrice } from '../../lib/utils';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Eye, Activity, Gift } from 'lucide-react';

export const AdminAnalysis = () => {
  const { orders } = useOrders();
  const { products } = useProducts();

  // --- Real Data Calculations ---
  
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const salesTarget = 500000; // Mock Target
  const targetPercentage = Math.min(Math.round((totalRevenue / salesTarget) * 100), 100);

  // Order Status Data for Pie Chart
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = [
    { name: 'Delivered', value: statusCounts['Delivered'] || 0, color: '#00C49F' },
    { name: 'Processing', value: statusCounts['Processing'] || 0, color: '#FFBB28' },
    { name: 'Shipped', value: statusCounts['Shipped'] || 0, color: '#0088FE' },
    { name: 'Cancelled', value: statusCounts['Cancelled'] || 0, color: '#FF8042' },
  ].filter(d => d.value > 0);

  // Monthly Sales Data (Mocked distribution based on real total for demo visual)
  const monthlyData = [
    { name: 'Jan', sales: totalRevenue * 0.1, views: 4000 },
    { name: 'Feb', sales: totalRevenue * 0.15, views: 3000 },
    { name: 'Mar', sales: totalRevenue * 0.2, views: 5000 },
    { name: 'Apr', sales: totalRevenue * 0.12, views: 2780 },
    { name: 'May', sales: totalRevenue * 0.18, views: 1890 },
    { name: 'Jun', sales: totalRevenue * 0.25, views: 2390 },
  ];

  // Mock Sparkline Data
  const sparklineData = [
    { value: 400 }, { value: 300 }, { value: 550 }, { value: 450 }, { value: 600 }, { value: 700 }, { value: 650 }
  ];

  return (
    <div className="flex h-screen bg-[#0f111a] font-sans overflow-hidden text-white">
      <AdminSidebar />
      
      <div className="flex-1 p-4 md:p-8 overflow-y-auto pt-16 md:pt-8 custom-scrollbar">
        
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Analytics Dashboard</h1>
                <p className="text-gray-400 text-sm mt-1">Real-time store performance & insights</p>
            </div>
            <div className="bg-[#1e2130] px-4 py-2 rounded-lg border border-gray-700 text-sm font-bold text-gray-300">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
        </div>

        {/* --- Top Row Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            
            {/* 1. Congratulations Card */}
            <div className="bg-gradient-to-br from-[#1e2130] to-[#13151f] p-6 rounded-2xl border border-gray-800 relative overflow-hidden shadow-lg">
                <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-1">Congratulations Admin! 🎉</h3>
                    <p className="text-gray-400 text-xs mb-6">You are the best seller of this month</p>
                    
                    <div className="mb-2">
                        <span className="text-3xl font-bold text-white">{formatPrice(totalRevenue)}</span>
                    </div>
                    <p className="text-gray-400 text-xs mb-4">{targetPercentage}% of sales target</p>
                    
                    <button className="bg-gradient-to-r from-[#d4af37] to-[#facc15] text-black px-6 py-2 rounded-full text-xs font-bold shadow-lg hover:scale-105 transition-transform">
                        View Details
                    </button>
                </div>
                {/* Decorative Gift Icon */}
                <div className="absolute right-4 bottom-4 opacity-90">
                    <Gift size={80} className="text-[#d4af37]" />
                </div>
            </div>

            {/* 2. Total Orders */}
            <div className="bg-[#1e2130] p-6 rounded-2xl border border-gray-800 shadow-lg flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                        <ShoppingCart size={24} />
                    </div>
                    <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                        +24% <TrendingUp size={12} />
                    </span>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{totalOrders}</h3>
                    <p className="text-gray-400 text-xs">Total Orders</p>
                </div>
                <div className="h-16 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparklineData}>
                            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. Total Sales */}
            <div className="bg-[#1e2130] p-6 rounded-2xl border border-gray-800 shadow-lg flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                        <DollarSign size={24} />
                    </div>
                    <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                        +14% <TrendingUp size={12} />
                    </span>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{formatPrice(totalRevenue)}</h3>
                    <p className="text-gray-400 text-xs">Total Sales</p>
                </div>
                <div className="h-16 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparklineData}>
                            <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* --- Middle Row Cards --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* 4. Total Visits (Mocked Live Data) */}
            <div className="bg-[#1e2130] p-6 rounded-2xl border border-gray-800 shadow-lg">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500 w-fit mb-3">
                            <Eye size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-white">189K</h3>
                        <p className="text-gray-400 text-xs">Total Visits</p>
                    </div>
                    <span className="text-red-500 text-xs font-bold flex items-center gap-1">
                        -35% <TrendingDown size={12} />
                    </span>
                </div>
                <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sparklineData}>
                            <defs>
                                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="#06b6d4" fillOpacity={1} fill="url(#colorVisits)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 5. Bounce Rate */}
            <div className="bg-[#1e2130] p-6 rounded-2xl border border-gray-800 shadow-lg">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500 w-fit mb-3">
                            <Activity size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-white">24.6%</h3>
                        <p className="text-gray-400 text-xs">Bounce Rate</p>
                    </div>
                    <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                        +18% <TrendingUp size={12} />
                    </span>
                </div>
                <div className="h-24 flex items-end gap-2">
                    {[40, 60, 30, 50, 80, 40, 60, 30, 50, 70].map((h, i) => (
                        <div 
                            key={i} 
                            className="flex-1 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm hover:opacity-80 transition-opacity"
                            style={{ height: `${h}%` }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>

        {/* --- Bottom Row Charts --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 6. Order Status (Donut) */}
            <div className="bg-[#1e2130] p-6 rounded-2xl border border-gray-800 shadow-lg lg:col-span-1">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white">Order Status</h3>
                </div>
                <div className="h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <p className="text-2xl font-bold text-white">{totalOrders}</p>
                        <p className="text-[10px] text-gray-400">Total Orders</p>
                    </div>
                </div>
                <div className="space-y-3 mt-4">
                    {pieData.map((entry) => (
                        <div key={entry.name} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                <span className="text-gray-300">{entry.name}</span>
                            </div>
                            <span className="font-bold text-white">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 7. Sales & Views (Bar Chart) */}
            <div className="bg-[#1e2130] p-6 rounded-2xl border border-gray-800 shadow-lg lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white">Sales & Views</h3>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis dataKey="name" stroke="#9ca3af" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                            <YAxis stroke="#9ca3af" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                            <Tooltip 
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                            />
                            <Bar dataKey="sales" name="Sales" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={12} />
                            <Bar dataKey="views" name="Views" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                
                {/* Bottom Stats Row */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-[#13151f] p-4 rounded-xl border border-gray-800 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin-slow"></div>
                        <div>
                            <p className="text-gray-400 text-xs mb-1">Monthly</p>
                            <h4 className="text-xl font-bold text-white">{formatPrice(totalRevenue * 0.25)}</h4>
                            <p className="text-green-500 text-[10px]">+16.5%</p>
                        </div>
                    </div>
                    <div className="bg-[#13151f] p-4 rounded-xl border border-gray-800 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin-slow"></div>
                        <div>
                            <p className="text-gray-400 text-xs mb-1">Yearly</p>
                            <h4 className="text-xl font-bold text-white">{formatPrice(totalRevenue * 3.5)}</h4>
                            <p className="text-green-500 text-[10px]">+24.9%</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};
