import React, { useState, useMemo, useRef } from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { useProducts } from '../../context/ProductContext';
import { formatPrice } from '../../lib/utils';
import { Plus, Trash2, Edit, X, Search, Filter, Image as ImageIcon, Upload, Loader2, ChevronDown, ChevronUp, RefreshCw, UploadCloud, TrendingUp, AlertTriangle, MoreHorizontal, Star, Download, Settings } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Product, INITIAL_PRODUCTS, DEAL_PRODUCTS, OCCASION_PRODUCTS } from '../../data/mockData';
import { uploadProductImage } from '../../services/storage';
import { db } from '../../services/db';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminTheme } from '../../context/AdminThemeContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CATEGORY_OPTIONS = [
  'Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Watches', 
  'Gift Sets', 'Personalized', 'Gold', 'Silver', 
  'Flowers', 'Cakes', 'Plants', 'Home', 'Electronics'
];

// Updated Collection Options
const COLLECTION_OPTIONS = [
    'All Collections',
    'Trending Jewellery',
    'Tailored For Your Occasions',
    'Handpicked Jewellery'
];

export const AdminProducts = () => {
  const { products, deleteProduct, addProduct, updateProduct, refreshProducts } = useProducts();
  const { showToast } = useToast();
  const { isDark } = useAdminTheme();
  
  // Theme Classes
  const bgClass = isDark ? 'bg-[#0f111a]' : 'bg-[#f8f9fa]';
  const cardClass = isDark ? 'bg-[#1e2130] border-gray-800' : 'bg-white border-gray-200';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputClass = isDark ? 'bg-[#13151f] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#d4af37]';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';
  const tableHeaderBg = isDark ? 'bg-[#13151f]' : 'bg-gray-50';
  const tableRowHover = isDark ? 'hover:bg-[#13151f]' : 'hover:bg-gray-50';

  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  // Collection Filter State
  const [selectedCollection, setSelectedCollection] = useState('All Collections');
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Refs for file inputs
  const mainImageInputRef = useRef<HTMLInputElement>(null);

  // Image Upload State
  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const [isUploading, setIsUploading] = useState(false);

  // Filter products based on search, tabs & collection
  const filteredProducts = useMemo(() => {
    let result = products || [];
    
    // Tab Filter
    if (activeTab === 'Published') result = result.filter(p => p.stock);
    if (activeTab === 'Drafts') result = result.filter(p => !p.stock);
    if (activeTab === 'On Discount') result = result.filter(p => p.discount > 0);

    // Collection Filter
    if (selectedCollection === 'Trending Jewellery') {
        result = result.filter(p => p.isBestSeller || (p.rating >= 4.8 && p.reviews > 50));
    } else if (selectedCollection === 'Tailored For Your Occasions') {
        // Filter based on occasion categories logic used in Home
        const occasionCats = ['Rings', 'Necklaces', 'Earrings', 'Gold', 'Gift Sets', 'Personalized'];
        result = result.filter(p => occasionCats.includes(p.category));
    } else if (selectedCollection === 'Handpicked Jewellery') {
        // Filter for high-end items
        result = result.filter(p => p.price > 5000 && p.rating >= 4.5);
    }

    // Search Filter
    if (searchTerm) {
        result = result.filter(p => 
            (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    return result;
  }, [products, searchTerm, activeTab, selectedCollection]);

  const initialFormState: Partial<Product> = {
    name: '',
    category: 'Rings',
    price: 0,
    originalPrice: 0,
    image: '',
    description: '',
    stock: true,
    stockCount: 10,
    isBestSeller: false,
    rating: 4.5,
    reviews: 0,
    discount: 0,
    images: [],
    specs: [],
  };

  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);

  const confirmDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      showToast('Product deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error: any) {
      showToast('Failed to delete: ' + error.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({ ...product, stockCount: product.stockCount ?? 5 });
    setEditingId(product.id);
    setIsEditing(true);
    setIsModalOpen(true);
    setImageMode('url');
  };

  const openAddModal = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setEditingId(null);
    setIsModalOpen(true);
    setImageMode('url');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('File size must be less than 5MB', 'error'); return; }
    setIsUploading(true);
    try {
        const publicUrl = await uploadProductImage(file);
        if (publicUrl) {
            setFormData(prev => ({ ...prev, image: publicUrl }));
            showToast('Image uploaded successfully!', 'success');
        } else {
            showToast('Failed to upload image', 'error');
        }
    } catch (error) {
        showToast('Error uploading image', 'error');
    } finally {
        setIsUploading(false);
        if (mainImageInputRef.current) mainImageInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        let discount = 0;
        if (formData.originalPrice && formData.price && formData.originalPrice > 0) {
            discount = Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100);
        }

        const productToSave: Product = {
            ...formData as Product,
            id: (isEditing && editingId) ? editingId : (Date.now().toString()),
            images: [formData.image || ''],
            specs: formData.specs || ['Standard Specification'],
            discount,
            sellerId: formData.sellerId || 'admin',
            rating: formData.rating || 0,
            reviews: formData.reviews || 0,
            stockCount: formData.stockCount ?? 0,
            createdAt: formData.createdAt,
        };

        if (isEditing && editingId) {
            await updateProduct(editingId, productToSave);
        } else {
            await addProduct(productToSave);
        }
        
        showToast(isEditing ? 'Product updated successfully' : 'Product added successfully', 'success');
        setIsModalOpen(false);
    } catch (error: any) {
        showToast(error.message || 'Failed to save product.', 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleSelectProduct = (id: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedProducts(newSelected);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Price', 'Stock', 'Rating', 'Vendor'];
    const rows = filteredProducts.map(p => [
      p.id, p.name, p.category, p.price, p.stockCount, p.rating, p.sellerId
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportOpen(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Product List", 14, 15);
    
    const tableColumn = ["Name", "Category", "Price", "Stock", "Rating"];
    const tableRows = filteredProducts.map(p => [
        p.name,
        p.category,
        `Rs. ${p.price}`,
        p.stockCount,
        p.rating
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

    doc.save("products_report.pdf");
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
                <span>eCommerce</span> <span>/</span> <span className={textMain}>Products</span>
            </div>
            <h1 className={`text-3xl font-bold tracking-tight ${textMain}`}>Products</h1>
          </div>
          
          <div className="flex gap-3">
             <button className={`${cardClass} ${textSub} px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-80 transition shadow-sm font-medium text-sm`}>
                Settings <Settings size={16} />
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-700 mb-6 text-sm font-medium">
            {['All', 'Published', 'Drafts', 'On Discount'].map(tab => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 border-b-2 transition-colors ${activeTab === tab ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                    {tab} <span className="text-xs ml-1 opacity-70">
                        {tab === 'All' ? products.length : 
                         tab === 'Published' ? products.filter(p => p.stock).length : 
                         tab === 'Drafts' ? products.filter(p => !p.stock).length : 
                         products.filter(p => p.discount > 0).length}
                    </span>
                </button>
            ))}
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search Products..." 
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${inputClass}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
                {/* Collection Filter Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setIsCollectionOpen(!isCollectionOpen)}
                        className={`${cardClass} ${textSub} px-4 py-2.5 rounded-lg flex items-center gap-2 whitespace-nowrap hover:opacity-80 transition shadow-sm font-medium text-sm`}
                    >
                        {selectedCollection} <ChevronDown size={14} />
                    </button>
                    
                    {isCollectionOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsCollectionOpen(false)}></div>
                            <div className={`absolute top-full mt-1 left-0 w-56 rounded-lg shadow-lg z-20 overflow-hidden border ${cardClass}`}>
                                {COLLECTION_OPTIONS.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => { setSelectedCollection(opt); setIsCollectionOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 ${selectedCollection === opt ? 'text-blue-500 font-bold' : textSub}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <button className={`${cardClass} ${textSub} px-4 py-2.5 rounded-lg flex items-center gap-2 whitespace-nowrap hover:opacity-80 transition shadow-sm font-medium text-sm`}>
                    Vendor <ChevronDown size={14} />
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
                    onClick={openAddModal}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-lg text-sm font-bold whitespace-nowrap"
                >
                    <Plus size={18} /> Add Product
                </button>
            </div>
        </div>

        {/* Products Table */}
        <div className={`${cardClass} rounded-xl shadow-sm border overflow-hidden`}>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className={tableHeaderBg}>
                        <tr className={`text-xs uppercase tracking-wider ${textSub}`}>
                            <th className="px-6 py-4 w-10">
                                <input type="checkbox" onChange={handleSelectAll} className="rounded border-gray-600 accent-blue-600" />
                            </th>
                            <th className="px-6 py-4 font-bold">Product Name</th>
                            <th className="px-6 py-4 font-bold">Price</th>
                            <th className="px-6 py-4 font-bold">Category</th>
                            <th className="px-6 py-4 font-bold">Tags</th>
                            <th className="px-6 py-4 font-bold">Rating</th>
                            <th className="px-6 py-4 font-bold">Vendor</th>
                            <th className="px-6 py-4 font-bold">Date</th>
                            <th className="px-6 py-4 font-bold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className={`text-sm divide-y ${borderColor}`}>
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className={`${tableRowHover} transition-colors group`}>
                                <td className="px-6 py-4">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedProducts.has(product.id)}
                                        onChange={() => handleSelectProduct(product.id)}
                                        className="rounded border-gray-600 accent-blue-600" 
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0 border border-gray-600">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className={`font-bold ${textMain} line-clamp-1 w-48`}>{product.name}</p>
                                            <p className={`text-xs ${textSub}`}>{product.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className={`px-6 py-4 ${textMain} font-medium`}>{formatPrice(product.price)}</td>
                                <td className={`px-6 py-4 ${textMain}`}>{product.category}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-1 flex-wrap w-32">
                                        <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-0.5 rounded border border-blue-500/20">NEW</span>
                                        {product.stock ? (
                                            <span className="bg-green-500/10 text-green-500 text-[10px] px-2 py-0.5 rounded border border-green-500/20">STOCK</span>
                                        ) : (
                                            <span className="bg-red-500/10 text-red-500 text-[10px] px-2 py-0.5 rounded border border-red-500/20">OUT</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded w-fit">
                                        <Star size={12} className="text-yellow-500 fill-current" />
                                        <span className="text-yellow-500 font-bold text-xs">{product.rating}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-blue-500 text-xs font-medium">
                                        {product.sellerId || 'Admin'}
                                        <div className="text-gray-500 text-[10px]">India</div>
                                    </div>
                                </td>
                                <td className={`px-6 py-4 ${textSub} text-xs`}>
                                    {new Date(product.createdAt || Date.now()).toLocaleDateString()}
                                    <div className="text-[10px] opacity-70">10:45 PM</div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleEdit(product)} 
                                            className={`p-1.5 rounded hover:bg-blue-600 hover:text-white transition ${textSub}`}
                                            title="Edit Product"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => confirmDelete(product)} className={`p-1.5 rounded hover:bg-red-900/30 text-red-500`}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Mock */}
            <div className={`p-4 border-t flex justify-between items-center ${borderColor} ${tableHeaderBg}`}>
                <span className={`text-xs ${textSub}`}>Showing {filteredProducts.length} entries</span>
                <div className="flex gap-2">
                    <button className={`px-3 py-1 rounded border text-xs ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'}`}>Prev</button>
                    <button className={`px-3 py-1 rounded border text-xs ${isDark ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-600 text-white'}`}>1</button>
                    <button className={`px-3 py-1 rounded border text-xs ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'}`}>Next</button>
                </div>
            </div>
        </div>

      </div>

      {/* Modals (Delete & Add/Edit) - Reused from previous implementation */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm font-sans">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${cardClass} rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden`}
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} className="text-red-600" />
                </div>
                <h2 className={`text-xl font-bold mb-2 ${textMain}`}>Delete Product?</h2>
                <p className={`${textSub} text-sm mb-6`}>
                  Are you sure you want to delete <span className={`font-bold ${textMain}`}>"{productToDelete?.name}"</span>? 
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setIsDeleteModalOpen(false)} className={`flex-1 py-3 rounded-lg font-bold transition ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>Cancel</button>
                  <button onClick={handleConfirmDelete} disabled={isDeleting} className="flex-1 py-3 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition">Delete</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm font-sans">
          <div className={`${cardClass} rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]`}>
            <div className={`flex justify-between items-center p-6 border-b ${borderColor}`}>
              <h2 className={`text-xl font-bold ${textMain}`}>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className={`${textSub} hover:text-gray-800`}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
               {/* Form Fields... (Reusing existing form logic) */}
               <div>
                <label className={`block text-sm font-bold mb-1.5 ${textMain}`}>Product Name</label>
                <input required type="text" className={`w-full border rounded-lg p-3 outline-none transition ${inputClass}`} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={`block text-sm font-bold mb-1.5 ${textMain}`}>Price</label>
                  <input required type="number" className={`w-full border rounded-lg p-3 outline-none transition ${inputClass}`} value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
                <div>
                  <label className={`block text-sm font-bold mb-1.5 ${textMain}`}>Original Price</label>
                  <input required type="number" className={`w-full border rounded-lg p-3 outline-none transition ${inputClass}`} value={formData.originalPrice} onChange={(e) => setFormData({...formData, originalPrice: Number(e.target.value)})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                    <label className={`block text-sm font-bold mb-1.5 ${textMain}`}>Category</label>
                    <select className={`w-full border rounded-lg p-3 outline-none transition ${inputClass}`} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    {CATEGORY_OPTIONS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label className={`block text-sm font-bold mb-1.5 ${textMain}`}>Stock Quantity</label>
                    <input type="number" min="0" className={`w-full border rounded-lg p-3 outline-none transition ${inputClass}`} value={formData.stockCount} onChange={(e) => setFormData({...formData, stockCount: Number(e.target.value), stock: Number(e.target.value) > 0})} />
                </div>
              </div>
              
              {/* Image Upload */}
              <div className={`p-4 rounded-lg border ${isDark ? 'bg-[#13151f] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <label className={`block text-sm font-bold mb-3 ${textMain}`}>Product Image</label>
                <div className="flex gap-3 mb-4">
                    <button type="button" onClick={() => setImageMode('url')} className={`flex-1 py-2 rounded-md text-sm font-bold transition ${imageMode === 'url' ? 'bg-blue-600 text-white' : 'text-gray-500 border border-gray-600'}`}>Image URL</button>
                    <button type="button" onClick={() => setImageMode('file')} className={`flex-1 py-2 rounded-md text-sm font-bold transition ${imageMode === 'file' ? 'bg-blue-600 text-white' : 'text-gray-500 border border-gray-600'}`}>Upload File</button>
                </div>
                <div className="flex gap-4 items-start">
                    <div className="flex-1">
                        {imageMode === 'url' ? (
                            <input type="url" className={`w-full border rounded-lg p-3 outline-none ${inputClass}`} value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://example.com/image.jpg" />
                        ) : (
                            <div className={`relative border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer ${isDark ? 'border-gray-600 bg-[#13151f]' : 'border-gray-300 bg-white'}`}>
                                <input ref={mainImageInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e)} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <div className="flex flex-col items-center justify-center text-gray-500">
                                    {isUploading ? <Loader2 size={24} className="mb-2 animate-spin text-blue-500" /> : <Upload size={24} className="mb-2" />}
                                    <span className="text-sm font-medium">{isUploading ? 'Uploading...' : 'Click to upload'}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={`w-24 h-24 border rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center shadow-sm ${isDark ? 'bg-black border-gray-700' : 'bg-white border-gray-200'}`}>
                        {formData.image ? <img src={formData.image} alt="Preview" className="w-full h-full object-contain" /> : <ImageIcon size={24} className="text-gray-500" />}
                    </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-bold mb-1.5 ${textMain}`}>Description</label>
                <textarea className={`w-full border rounded-lg p-3 outline-none transition ${inputClass}`} rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-bold hover:bg-blue-700 shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (isEditing ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
