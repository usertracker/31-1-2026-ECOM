import React, { useState, useEffect, useMemo } from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { useAdminTheme } from '../../context/AdminThemeContext';
import { db, UserProfile } from '../../services/db';
import { useOrders } from '../../context/OrderContext';
import { Search, Download, Plus, Filter, MoreHorizontal, User, Mail, MapPin, Calendar, DollarSign, ShoppingBag, X, Loader2, Save } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const AdminCustomers = () => {
  const { isDark } = useAdminTheme();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const { orders } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const { showToast } = useToast();
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Add Customer Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    gender: 'Male'
  });

  // Theme Classes
  const bgClass = isDark ? 'bg-[#0f111a]' : 'bg-[#f8f9fa]';
  const cardClass = isDark ? 'bg-[#1e2130] border-gray-800' : 'bg-white border-gray-200';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputClass = isDark ? 'bg-[#13151f] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500';
  const tableHeaderBg = isDark ? 'bg-[#13151f]' : 'bg-gray-50';
  const tableRowHover = isDark ? 'hover:bg-[#13151f]' : 'hover:bg-gray-50';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';

  const fetchUsers = async () => {
    const data = await db.getAllUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    setIsSubmitting(true);
    try {
        // Create a new user object
        const userPayload: UserProfile = {
            id: crypto.randomUUID(), // Generate a UUID for manual customers
            name: newCustomer.name,
            email: newCustomer.email,
            phone: newCustomer.phone,
            role: 'user',
            createdAt: new Date().toISOString(),
            addresses: newCustomer.city ? [{
                id: crypto.randomUUID(),
                street: '',
                city: newCustomer.city,
                state: '',
                zip: '',
                type: 'Home',
                isDefault: true
            }] : []
        };

        await db.createUser(userPayload);
        showToast('Customer added successfully!', 'success');
        setIsAddModalOpen(false);
        setNewCustomer({ name: '', email: '', phone: '', city: '', gender: 'Male' });
        fetchUsers(); // Refresh list
    } catch (error: any) {
        console.error("Error adding customer:", error);
        showToast('Failed to add customer', 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  // Enrich User Data with Order Stats
  const enrichedUsers = useMemo(() => {
    return users.map(user => {
      const userOrders = orders.filter(o => o.userId === user.id);
      const totalSpent = userOrders.reduce((acc, o) => acc + o.total, 0);
      const lastOrder = userOrders.length > 0 
        ? new Date(Math.max(...userOrders.map(o => new Date(o.date).getTime()))).toLocaleDateString()
        : 'Never';
        
      // Location logic: Check address first, then fallback
      const location = user.addresses?.[0]?.city || 'Unknown';

      return {
        ...user,
        orderCount: userOrders.length,
        totalSpent,
        lastOrder,
        location
      };
    }).filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm)
    );
  }, [users, orders, searchTerm]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(new Set(enrichedUsers.map(u => u.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (id: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedUsers(newSelected);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Orders', 'Total Spent', 'Location', 'Last Seen'];
    const rows = enrichedUsers.map(u => [
      u.name,
      u.email,
      u.phone,
      u.orderCount,
      u.totalSpent,
      u.location,
      new Date(u.lastSeen || u.createdAt).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportOpen(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Customer List", 14, 15);
    
    const tableColumn = ["Name", "Email", "Phone", "Orders", "Spent"];
    const tableRows = enrichedUsers.map(u => [
        u.name,
        u.email,
        u.phone,
        u.orderCount,
        u.totalSpent
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

    doc.save("customers_report.pdf");
    setIsExportOpen(false);
  };

  return (
    <div className={`flex h-screen font-sans overflow-hidden ${bgClass}`}>
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto pt-16 md:pt-8 transition-colors duration-300">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>eCommerce</span> <span>/</span> <span className={textMain}>Customers</span>
            </div>
            <h1 className={`text-3xl font-bold tracking-tight ${textMain}`}>Customers</h1>
          </div>
          
          <div className="flex gap-3">
             <button className={`${cardClass} ${textSub} px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-80 transition shadow-sm font-medium text-sm`}>
                Settings
             </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search Customers..." 
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${inputClass}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
                <button className={`${cardClass} ${textSub} px-4 py-2.5 rounded-lg flex items-center gap-2 whitespace-nowrap hover:opacity-80 transition shadow-sm font-medium text-sm`}>
                    Country <Filter size={14} />
                </button>
                <button className={`${cardClass} ${textSub} px-4 py-2.5 rounded-lg flex items-center gap-2 whitespace-nowrap hover:opacity-80 transition shadow-sm font-medium text-sm`}>
                    Source <Filter size={14} />
                </button>
            </div>

            <div className="flex gap-3 ml-auto">
                <div className="relative">
                    <button 
                        onClick={() => setIsExportOpen(!isExportOpen)}
                        className={`${cardClass} ${textMain} px-4 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-80 transition shadow-sm font-bold text-sm border-opacity-50`}
                    >
                        <Download size={18} /> Export
                    </button>
                    {isExportOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsExportOpen(false)}></div>
                            <div className={`absolute top-full right-0 mt-1 w-40 rounded-lg shadow-xl overflow-hidden z-20 ${cardClass}`}>
                                <button onClick={exportToPDF} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 ${textMain}`}>Export as PDF</button>
                                <button onClick={exportToCSV} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 ${textMain}`}>Export as Excel</button>
                            </div>
                        </>
                    )}
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-lg text-sm font-bold whitespace-nowrap"
                >
                    <Plus size={18} /> Add Customer
                </button>
            </div>
        </div>

        {/* Customers Table */}
        <div className={`${cardClass} rounded-xl shadow-sm border overflow-hidden`}>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className={tableHeaderBg}>
                        <tr className={`text-xs uppercase tracking-wider ${textSub}`}>
                            <th className="px-6 py-4 w-10">
                                <input type="checkbox" onChange={handleSelectAll} className="rounded border-gray-600 accent-blue-600" />
                            </th>
                            <th className="px-6 py-4 font-bold">Customers</th>
                            <th className="px-6 py-4 font-bold">Email</th>
                            <th className="px-6 py-4 font-bold">Orders</th>
                            <th className="px-6 py-4 font-bold">Total Spent</th>
                            <th className="px-6 py-4 font-bold">Location</th>
                            <th className="px-6 py-4 font-bold">Last Seen</th>
                            <th className="px-6 py-4 font-bold">Last Order</th>
                        </tr>
                    </thead>
                    <tbody className={`text-sm divide-y ${borderColor}`}>
                        {enrichedUsers.map((user) => (
                            <tr key={user.id} className={`${tableRowHover} transition-colors group`}>
                                <td className="px-6 py-4">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedUsers.has(user.id)}
                                        onChange={() => handleSelectUser(user.id)}
                                        className="rounded border-gray-600 accent-blue-600" 
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center text-gray-300">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={20} />
                                            )}
                                        </div>
                                        <span className={`font-bold ${textMain}`}>{user.name}</span>
                                    </div>
                                </td>
                                <td className={`px-6 py-4 ${textSub} font-mono text-xs`}>{user.email}</td>
                                <td className={`px-6 py-4 ${textMain} font-medium`}>{user.orderCount}</td>
                                <td className={`px-6 py-4 ${textMain} font-bold`}>{formatPrice(user.totalSpent)}</td>
                                <td className={`px-6 py-4 ${textSub}`}>{user.location}</td>
                                <td className={`px-6 py-4 ${textSub}`}>
                                    {new Date(user.lastSeen || user.createdAt).toLocaleDateString()}
                                </td>
                                <td className={`px-6 py-4 ${textSub}`}>{user.lastOrder}</td>
                            </tr>
                        ))}
                        {enrichedUsers.length === 0 && (
                            <tr>
                                <td colSpan={8} className={`py-12 text-center ${textSub}`}>
                                    <User size={32} className="mx-auto mb-2 opacity-50" />
                                    <p>No customers found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Mock */}
            <div className={`p-4 border-t flex justify-between items-center ${borderColor} ${tableHeaderBg}`}>
                <span className={`text-xs ${textSub}`}>Showing {enrichedUsers.length} entries</span>
                <div className="flex gap-2">
                    <button className={`px-3 py-1 rounded border text-xs ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'}`}>Prev</button>
                    <button className={`px-3 py-1 rounded border text-xs ${isDark ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-600 text-white'}`}>1</button>
                    <button className={`px-3 py-1 rounded border text-xs ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'}`}>Next</button>
                </div>
            </div>
        </div>

      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className={`${cardClass} rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col`}>
                <div className={`flex justify-between items-center p-6 border-b ${borderColor}`}>
                    <h2 className={`text-xl font-bold ${textMain}`}>Add New Customer</h2>
                    <button onClick={() => setIsAddModalOpen(false)} className={`${textSub} hover:text-gray-800`}><X size={20} /></button>
                </div>
                <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
                    <div>
                        <label className={`block text-sm font-bold mb-1.5 ${textMain}`}>Full Name</label>
                        <input 
                            required 
                            type="text" 
                            className={`w-full border rounded-lg p-3 outline-none transition ${inputClass}`} 
                            value={newCustomer.name} 
                            onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} 
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-bold mb-1.5 ${textMain}`}>Email Address</label>
                        <input 
                            required 
                            type="email" 
                            className={`w-full border rounded-lg p-3 outline-none transition ${inputClass}`} 
                            value={newCustomer.email} 
                            onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} 
                            placeholder="john@example.com"
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-bold mb-1.5 ${textMain}`}>Phone Number</label>
                        <input 
                            required 
                            type="tel" 
                            className={`w-full border rounded-lg p-3 outline-none transition ${inputClass}`} 
                            value={newCustomer.phone} 
                            onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} 
                            placeholder="+91 9876543210"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-bold mb-1.5 ${textMain}`}>City</label>
                            <input 
                                type="text" 
                                className={`w-full border rounded-lg p-3 outline-none transition ${inputClass}`} 
                                value={newCustomer.city} 
                                onChange={(e) => setNewCustomer({...newCustomer, city: e.target.value})} 
                                placeholder="Mumbai"
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-bold mb-1.5 ${textMain}`}>Gender</label>
                            <select 
                                className={`w-full border rounded-lg p-3 outline-none transition ${inputClass}`} 
                                value={newCustomer.gender} 
                                onChange={(e) => setNewCustomer({...newCustomer, gender: e.target.value})}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Save Customer
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};
