import React, { useState, useEffect, useMemo } from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { contentService, SiteAsset } from '../../services/content';
import { useToast } from '../../context/ToastContext';
import { Save, Upload, Loader2, RefreshCw, Image as ImageIcon, Search, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { uploadProductImage } from '../../services/storage';
import { useAdminTheme } from '../../context/AdminThemeContext';

export const AdminContent = () => {
  const [assets, setAssets] = useState<SiteAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const { showToast } = useToast();
  const { isDark } = useAdminTheme();

  // Theme Classes
  const bgClass = isDark ? 'bg-[#0f111a]' : 'bg-[#f8f9fa]';
  const cardClass = isDark ? 'bg-[#1e2130] border-gray-800' : 'bg-white border-gray-200';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputClass = isDark ? 'bg-[#13151f] border-gray-700 text-white focus:border-[#d4af37]' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-100';
  const sectionHeaderBg = isDark ? 'bg-[#13151f]' : 'bg-gray-50';

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const data = await contentService.getAllAssets();
      setAssets(data);
      const sections: Record<string, boolean> = {};
      data.forEach(a => { if (a.section) sections[a.section] = true; });
      setExpandedSections(sections);
    } catch (error) {
      showToast('Failed to load assets', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAssets(); }, []);

  const handleUpdate = async (key: string, value: string) => {
    setSavingKey(key);
    try {
      await contentService.updateAsset(key, value);
      showToast('Updated successfully', 'success');
      setAssets(prev => prev.map(a => a.key === key ? { ...a, value } : a));
    } catch (error) {
      showToast('Failed to update', 'error');
    } finally {
      setSavingKey(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('File too large (Max 5MB)', 'error'); return; }
    setUploadingKey(key);
    try {
      const url = await uploadProductImage(file);
      if (url) await handleUpdate(key, url);
    } catch (error) { showToast('Upload failed', 'error'); } finally { setUploadingKey(null); }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const groupedAssets = useMemo(() => {
    const filtered = assets.filter(a => a.label.toLowerCase().includes(searchTerm.toLowerCase()) || a.section.toLowerCase().includes(searchTerm.toLowerCase()));
    return filtered.reduce((acc, asset) => {
      const section = asset.section || 'Other';
      if (!acc[section]) acc[section] = [];
      acc[section].push(asset);
      return acc;
    }, {} as Record<string, SiteAsset[]>);
  }, [assets, searchTerm]);

  return (
    <div className={`flex h-screen font-sans overflow-hidden ${bgClass}`}>
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto pt-16 md:pt-8 transition-colors duration-300">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className={`text-3xl font-bold tracking-tight ${textMain}`}>Site Content</h1>
            <p className={`text-sm mt-1 ${textSub}`}>Manage images for Banners, Brands, Categories, and more.</p>
          </div>
          <button 
            onClick={fetchAssets} 
            className={`${cardClass} ${textSub} px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-80 transition shadow-sm font-medium text-sm`}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin text-blue-600' : ''} />
            Refresh Data
          </button>
        </div>

        <div className={`${cardClass} p-4 rounded-xl shadow-sm border mb-6 flex gap-4 sticky top-0 z-10`}>
            <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search for 'Hero', 'Tiffany', 'Necklace'..." 
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${inputClass}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className={`flex items-center gap-2 text-sm font-medium px-2 ${textSub}`}>
                <Filter size={16} />
                <span>{Object.values(groupedAssets).flat().length} Assets</span>
            </div>
        </div>

        <div className="space-y-6">
            {Object.entries(groupedAssets).map(([section, items]) => (
            <div key={section} className={`${cardClass} rounded-xl shadow-sm border overflow-hidden`}>
                <div 
                    onClick={() => toggleSection(section)}
                    className={`px-6 py-4 border-b flex justify-between items-center cursor-pointer hover:opacity-90 transition-colors ${sectionHeaderBg} ${borderColor}`}
                >
                    <div className="flex items-center gap-3">
                        <h2 className={`text-lg font-bold ${textMain}`}>{section}</h2>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                            {items.length}
                        </span>
                    </div>
                    {expandedSections[section] ? <ChevronUp size={20} className={textSub} /> : <ChevronDown size={20} className={textSub} />}
                </div>
                
                {expandedSections[section] && (
                    <div className={`divide-y ${borderColor}`}>
                    {items.map((asset) => (
                        <div key={asset.key} className={`p-6 flex flex-col lg:flex-row gap-6 items-start transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'}`}>
                        
                        <div className={`w-full lg:w-64 h-40 rounded-lg overflow-hidden border flex-shrink-0 relative group ${isDark ? 'bg-black border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
                            <img 
                                src={asset.value} 
                                alt={asset.label} 
                                className="w-full h-full object-contain p-2"
                                onError={(e) => (e.target as HTMLImageElement).src = 'https://img-wrapper.vercel.app/image?url=https://placehold.co/300x200?text=Broken+Link'}
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold flex items-center gap-1">
                                    <ImageIcon size={14} /> Preview
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-start mb-2">
                                <label className={`block text-sm font-bold ${textMain}`}>{asset.label}</label>
                                <span className={`text-[10px] font-mono px-2 py-1 rounded ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-400'}`}>{asset.key}</span>
                            </div>
                            
                            <div className="flex gap-3 mb-4">
                                <input 
                                    type="text" 
                                    value={asset.value}
                                    onChange={(e) => setAssets(prev => prev.map(a => a.key === asset.key ? { ...a, value: e.target.value } : a))}
                                    className={`flex-1 border rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 outline-none transition shadow-sm ${inputClass}`}
                                    placeholder="Paste Image URL here..."
                                />
                                <button 
                                    onClick={() => handleUpdate(asset.key, asset.value)}
                                    disabled={savingKey === asset.key}
                                    className="bg-[#d4af37] text-black px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#b5952f] transition flex items-center gap-2 disabled:opacity-70 shadow-md"
                                >
                                    {savingKey === asset.key ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Save
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className={`h-px flex-1 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                                <span className={`text-xs uppercase font-bold ${textSub}`}>OR Upload</span>
                                <div className={`h-px flex-1 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                            </div>

                            <div className="mt-4">
                                <label className={`flex items-center justify-center gap-2 w-full border-2 border-dashed rounded-lg p-3 cursor-pointer transition-all group ${isDark ? 'border-gray-700 hover:border-blue-500 hover:bg-white/5' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'} ${uploadingKey === asset.key ? 'opacity-50 cursor-wait' : ''}`}>
                                    {uploadingKey === asset.key ? (
                                        <Loader2 size={18} className="animate-spin text-blue-600" />
                                    ) : (
                                        <Upload size={18} className="text-gray-400 group-hover:text-blue-500" />
                                    )}
                                    <span className={`text-sm font-medium ${isDark ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-700'}`}>
                                        {uploadingKey === asset.key ? 'Uploading...' : 'Click to Upload New Image'}
                                    </span>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, asset.key)}
                                        disabled={!!uploadingKey}
                                    />
                                </label>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};
