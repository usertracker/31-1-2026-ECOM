import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { SearchResults } from './pages/SearchResults';
import { Orders } from './pages/Orders';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminContent } from './pages/admin/AdminContent';
import { AdminAnalysis } from './pages/admin/AdminAnalysis';
import { AdminCustomers } from './pages/admin/AdminCustomers'; // Added

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { ProductProvider } from './context/ProductContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { ContentProvider } from './context/ContentContext';
import { LanguageProvider } from './context/LanguageContext';
import { AdminThemeProvider } from './context/AdminThemeContext';
import { ScrollToTop } from './components/ScrollToTop';
import { BackToTop } from './components/BackToTop';
import { SpinWheelModal } from './components/SpinWheelModal';

// App Content separated to handle conditional Layout
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const showNavbar = !isAdminRoute;
  
  // SHOW FOOTER ONLY ON HOME PAGE ('/')
  const showFooter = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      {showNavbar && <Navbar />}
      <main className="flex-grow relative">
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/analysis" element={<AdminAnalysis />} />
          <Route path="/admin/customers" element={<AdminCustomers />} /> {/* Added Route */}

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Add BackToTop Button for users */}
        {!isAdminRoute && <BackToTop />}
        
        {/* Spin Wheel Modal - Global - Rendered ONLY if not admin */}
        {!isAdminRoute && <SpinWheelModal />}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <ContentProvider>
            <ProductProvider>
              <RecentlyViewedProvider>
                <OrderProvider>
                  <CartProvider>
                    <WishlistProvider>
                      <LanguageProvider>
                        <AdminThemeProvider>
                          <ScrollToTop />
                          <AppContent />
                        </AdminThemeProvider>
                      </LanguageProvider>
                    </WishlistProvider>
                  </CartProvider>
                </OrderProvider>
              </RecentlyViewedProvider>
            </ProductProvider>
          </ContentProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
