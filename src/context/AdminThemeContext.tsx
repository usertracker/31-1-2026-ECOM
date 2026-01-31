import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface AdminThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export const AdminThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark'); // Default to Dark as requested

  useEffect(() => {
    const savedTheme = localStorage.getItem('admin_theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('admin_theme', newTheme);
  };

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext);
  if (!context) throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  return context;
};
