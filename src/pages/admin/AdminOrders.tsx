import React, { useState, useMemo } from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { useOrders } from '../../context/OrderContext';
import { formatPrice } from '../../lib/utils';
import { Search, Download, Filter, ChevronDown, Check, X, AlertCircle, Clock, User, Plus } from 'lucide-react';
import { useAdminTheme } from '../../context/AdminThemeContext';
import { db } from '../../services/db';
import { useToast } from '../../context/ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const AdminOrders = () => {
  const { orders, refreshOrders } = useOrders(); // Ensure refreshOrders is exposed in context
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const { isDark } = useAdminTheme();
  const { showToast } = useToast();

  // Status Update Handler
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
        await db.updateOrderStatus(orderId, newStatus);
        showToast(`Order #${orderId.slice(0,4)} updated to ${newStatus}`, 'success');
        // Refresh orders to show new status
        window.location.reload(); // Simple refresh for now, ideally use context refresh
    } catch (error) {
        console.error(error);
        showToast('Failed to update status', 'error');
    }
  };

  // Export to CSV/Excel
  const exportToExcel = () => {
    const headers = ['Order ID', 'Price', 'Customer', 'Status', 'Payment', 'Date'];
    const rows = orders.map(o => [
      o.id,
      o.total,
      o.customerDetails?.name || 'Guest',
      o.status,
      o.paymentMethod,
      new Date(o.date).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportOpen(false);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Order Report", 14, 15);
    
    const tableColumn = ["Order ID", "Customer", "Amount", "Status", "Date"];
    const tableRows = orders.map(order => [
        order.id.slice(0, 8),
        order.customerDetails?.name || 'Guest',
        `Rs. ${order.total}`,
        order.status,
        new Date(order.date).toLocaleDateString()
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

    doc.save("orders_report.pdf");
    setIsExportOpen(false);
  };

  // Filter Logic
  const filteredOrders = useMemo(() => {
    let result = orders;
    if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        result = result.filter(o => 
            o.id.toLowerCase().includes(lowerTerm) ||
            o.customerDetails?.name?.toLowerCase().includes(lowerTerm)
        );
    }
    if (statusFilter !== 'All') {
        result = result.filter(o => o.status === statusFilter);
    }
    return result;
  }, [orders, searchTerm, statusFilter]);

  // Theme Classes
  const bgClass = isDark ? 'bg-[#0f111a]' : 'bg-[#f8f9fa]';
  const cardClass = isDark ? 'bg-[#1e2130] border-gray-800' : 'bg-white border-gray-200';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputClass = isDark ? 'bg-[#13151f] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500';
  const tableHeaderBg = isDark ? 'bg-[#13151f]' : 'bg-gray-50';
  const tableRowHover = isDark ? 'hover:bg-[#13151f]' : 'hover:bg-gray-50';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Delivered':
            return <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-fit"><Check size={12} /> COMPLETED</span>;
        case 'Processing':
            return <span className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-fit"><Clock size={12} /> PROCESSING</span>;
        case 'Shipped':
            return <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-fit"><Truck size={12} /> SHIPPED</span>;
        case 'Cancelled':
            return <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-fit"><X size={12} /> FAILED</span>;
        default:
            return <span className="bg-gray-500/20 text-gray-500 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-fit">{status}</span>;
    }
  };

  return (
    <div className={`flex h-screen font-sans overflow-hidden ${bgClass}`}>
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto pt-16 md:pt-8 transition-colors duration-300">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            
            {/* Search */}
            <div className="relative w-full md:w-80">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search Customers..." 
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none border transition ${inputClass}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-wrap gap-3">
                {/* Status Filter */}
                <div className="relative group">
                    <button className={`${cardClass} px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium hover:opacity-80 transition shadow-sm`}>
                        {statusFilter === 'All' ? 'Payment Status' : statusFilter} <ChevronDown size={14} />
                    </button>
                    <div className={`absolute top-full right-0 mt-1 w-40 rounded-lg shadow-xl overflow-hidden z-20 hidden group-hover:block ${cardClass}`}>
                        {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 ${textMain}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Export Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setIsExportOpen(!isExportOpen)}
                        className={`${cardClass} px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium hover:opacity-80 transition shadow-sm border border-opacity-50`}
                    >
                        <Download size={16} /> Export
                    </button>
                    {isExportOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsExportOpen(false)}></div>
                            <div className={`absolute top-full right-0 mt-1 w-40 rounded-lg shadow-xl overflow-hidden z-20 ${cardClass}`}>
                                <button onClick={exportToPDF} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 ${textMain}`}>Export as PDF</button>
                                <button onClick={exportToExcel} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 ${textMain}`}>Export as Excel</button>
                            </div>
                        </>
                    )}
                </div>

                <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-lg text-sm font-bold">
                    <Plus size={16} /> Add Order
                </button>
            </div>
        </div>

        {/* Orders Table */}
        <div className={`${cardClass} rounded-xl shadow-sm border overflow-hidden`}>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className={tableHeaderBg}>
                        <tr className={`text-xs font-bold uppercase tracking-wider ${textMain}`}>
                            <th className="px-6 py-4 w-10"><input type="checkbox" className="rounded border-gray-600 accent-blue-600" /></th>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Payment</th>
                            <th className="px-6 py-4">Delivery Type</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className={`text-sm divide-y ${borderColor}`}>
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className={`${tableRowHover} transition-colors group`}>
                                <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-600 accent-blue-600" /></td>
                                <td className="px-6 py-4 font-bold text-blue-500">#{order.id.slice(0, 4)}</td>
                                <td className={`px-6 py-4 font-bold ${textMain}`}>{formatPrice(order.total)}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white font-bold">
                                            {order.customerDetails?.name?.charAt(0) || 'G'}
                                        </div>
                                        <span className={`font-medium ${textMain}`}>{order.customerDetails?.name || 'Guest'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(order.status)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-fit ${order.paymentMethod === 'Cash on Delivery' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                        {order.paymentMethod === 'Cash on Delivery' ? 'PENDING' : 'COMPLETED'}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 ${textSub}`}>{order.paymentMethod}</td>
                                <td className={`px-6 py-4 ${textSub}`}>{new Date(order.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="relative group/action inline-block">
                                        <button className={`p-1.5 rounded hover:bg-gray-700 text-gray-400`}>
                                            <Filter size={16} />
                                        </button>
                                        {/* Status Update Dropdown */}
                                        <div className={`absolute right-0 mt-1 w-40 rounded-lg shadow-xl overflow-hidden z-50 hidden group-hover/action:block ${cardClass}`}>
                                            <div className={`px-3 py-2 text-xs font-bold uppercase ${textSub} border-b ${borderColor}`}>Update Status</div>
                                            {['Processing', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'].map(s => (
                                                <button 
                                                    key={s} 
                                                    onClick={() => handleStatusUpdate(order.id, s)}
                                                    className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-100 dark:hover:bg-white/5 ${textMain}`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                    <p className={textSub}>No orders found</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
