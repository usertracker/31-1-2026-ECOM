import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, LogOut, ShieldCheck, Image as ImageIcon, Menu, X, BarChart2, Sun, Moon, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdminTheme } from '../context/AdminThemeContext';

export const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useAdminTheme();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const closeSidebar = () => setIsOpen(false);

  // Theme-based styles
  const bgClass = isDark ? 'bg-[#0f111a] border-gray-800' : 'bg-white border-gray-200';
  const textClass = isDark ? 'text-gray-400' : 'text-gray-600';
  const activeBgClass = isDark ? 'bg-[#1e2130] text-[#d4af37]' : 'bg-blue-50 text-blue-600';
  const hoverClass = isDark ? 'hover:bg-[#1e2130] hover:text-white' : 'hover:bg-gray-50 hover:text-gray-900';
  const borderClass = isDark ? 'border-gray-800' : 'border-gray-200';

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className={`p-2 rounded-md shadow-lg border ${isDark ? 'bg-[#1e2130] text-[#d4af37] border-gray-700' : 'bg-white text-blue-600 border-gray-200'}`}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 h-screen flex flex-col shadow-xl flex-shrink-0 font-sans transition-all duration-300 ease-in-out border-r
        ${bgClass}
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className={`p-6 border-b flex items-center justify-between ${borderClass}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#d4af37] rounded-md flex items-center justify-center text-black font-bold">
                <ShieldCheck size={20} />
            </div>
            <div>
                <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>FlipZon</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          <Link 
            to="/admin/dashboard" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              isActive('/admin/dashboard') 
              ? `${activeBgClass} shadow-sm border-l-4 ${isDark ? 'border-[#d4af37]' : 'border-blue-600'}` 
              : `${textClass} ${hoverClass}`
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>

          <Link 
            to="/admin/analysis" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              isActive('/admin/analysis') 
              ? `${activeBgClass} shadow-sm border-l-4 ${isDark ? 'border-[#d4af37]' : 'border-blue-600'}` 
              : `${textClass} ${hoverClass}`
            }`}
          >
            <BarChart2 size={20} />
            <span className="font-medium text-sm">Analysis</span>
          </Link>

          <Link 
            to="/admin/products" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              isActive('/admin/products') 
              ? `${activeBgClass} shadow-sm border-l-4 ${isDark ? 'border-[#d4af37]' : 'border-blue-600'}` 
              : `${textClass} ${hoverClass}`
            }`}
          >
            <Package size={20} />
            <span className="font-medium text-sm">Products</span>
          </Link>

          <Link 
            to="/admin/orders" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              isActive('/admin/orders') 
              ? `${activeBgClass} shadow-sm border-l-4 ${isDark ? 'border-[#d4af37]' : 'border-blue-600'}` 
              : `${textClass} ${hoverClass}`
            }`}
          >
            <ShoppingBag size={20} />
            <span className="font-medium text-sm">Orders</span>
          </Link>

          {/* New Customers Tab */}
          <Link 
            to="/admin/customers" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              isActive('/admin/customers') 
              ? `${activeBgClass} shadow-sm border-l-4 ${isDark ? 'border-[#d4af37]' : 'border-blue-600'}` 
              : `${textClass} ${hoverClass}`
            }`}
          >
            <Users size={20} />
            <span className="font-medium text-sm">Customers</span>
          </Link>

          <Link 
            to="/admin/content" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              isActive('/admin/content') 
              ? `${activeBgClass} shadow-sm border-l-4 ${isDark ? 'border-[#d4af37]' : 'border-blue-600'}` 
              : `${textClass} ${hoverClass}`
            }`}
          >
            <ImageIcon size={20} />
            <span className="font-medium text-sm">Site Content</span>
          </Link>
        </nav>

        {/* Footer Actions */}
        <div className={`p-4 border-t ${borderClass} space-y-2`}>
          {/* Theme Switcher */}
          <button 
            onClick={toggleTheme}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-colors ${textClass} ${hoverClass}`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium text-sm">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-colors group ${textClass} hover:bg-red-50 hover:text-red-500`}
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};
