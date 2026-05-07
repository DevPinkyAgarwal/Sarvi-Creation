import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import LogoLoader from './components/LogoLoader';
import SmoothScroll from './components/SmoothScroll';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import SideCart from './components/SideCart';

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));

// Admin Lazy Imports
const AdminLoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const AdminProductsPage = lazy(() => import('./pages/admin/ProductsPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/OrdersPage'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/CategoriesPage'));
const AdminCustomersPage = lazy(() => import('./pages/admin/CustomersPage'));
const AdminCouponsPage = lazy(() => import('./pages/admin/CouponsPage'));
const AdminAnnouncementsPage = lazy(() => import('./pages/admin/AnnouncementsPage'));
const AdminContactPage = lazy(() => import('./pages/admin/ContactPage'));
const AdminNewsletterPage = lazy(() => import('./pages/admin/NewsletterPage'));
const AdminNotFoundPage = lazy(() => import('./pages/admin/NotFoundPage'));

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="h-screen flex items-center justify-center text-slate-400 font-serif tracking-widest uppercase text-[10px]">Loading...</div>}>
        <Routes location={location} key={location.pathname}>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Suspense fallback={<div className="p-10 text-center text-slate-400">Loading module...</div>}>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/products" element={<AdminProductsPage />} />
                      <Route path="/categories" element={<AdminCategoriesPage />} />
                      <Route path="/orders" element={<AdminOrdersPage />} />
                      <Route path="/customers" element={<AdminCustomersPage />} />
                      <Route path="/coupons" element={<AdminCouponsPage />} />
                      <Route path="/announcements" element={<AdminAnnouncementsPage />} />
                      <Route path="/newsletter" element={<AdminNewsletterPage />} />
                      <Route path="/contact" element={<AdminContactPage />} />
                      <Route path="*" element={<AdminNotFoundPage />} />
                    </Routes>
                  </Suspense>
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Frontend Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={
              <PageWrapper>
                <HomePage />
              </PageWrapper>
            } />
            <Route path="/products" element={
              <PageWrapper>
                <ProductsPage />
              </PageWrapper>
            } />
            <Route path="/category/:slug" element={
              <PageWrapper>
                <ProductsPage />
              </PageWrapper>
            } />
            <Route path="/product/:slug" element={
              <PageWrapper>
                <ProductDetailPage />
              </PageWrapper>
            } />
            <Route path="/cart" element={
              <PageWrapper>
                <CartPage />
              </PageWrapper>
            } />
            <Route path="/checkout" element={
              <PageWrapper>
                <CheckoutPage />
              </PageWrapper>
            } />
            <Route path="/login" element={
              <PageWrapper>
                <LoginPage />
              </PageWrapper>
            } />
            <Route path="/register" element={
              <PageWrapper>
                <RegisterPage />
              </PageWrapper>
            } />
            <Route path="/forgot-password" element={
              <PageWrapper>
                <ForgotPasswordPage />
              </PageWrapper>
            } />
            <Route path="/reset-password/:token" element={
              <PageWrapper>
                <div className="p-20 text-center font-serif text-2xl uppercase tracking-widest">Reset Password (API integration needed)</div>
              </PageWrapper>
            } />
            <Route path="/order-success/:id" element={
              <PageWrapper>
                <OrderSuccessPage />
              </PageWrapper>
            } />
            <Route path="/profile" element={<div className="p-20 text-center">Profile Page (Coming Soon)</div>} />
            <Route path="/profile/orders" element={<div className="p-20 text-center">Order History (Coming Soon)</div>} />
            <Route path="/wishlist" element={
              <PageWrapper>
                <WishlistPage />
              </PageWrapper>
            } />
            <Route path="/contact" element={
              <PageWrapper>
                <ContactPage />
              </PageWrapper>
            } />
            <Route path="/about" element={
              <PageWrapper>
                <AboutPage />
              </PageWrapper>
            } />
            <Route path="/info/:slug" element={
              <PageWrapper>
                <LegalPage />
              </PageWrapper>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        theme="light"
        toastOptions={{
          style: {
            background: '#FAF9F6',
            border: '1px solid #E5E7EB',
            borderRadius: '16px',
            fontSize: '12px',
            fontFamily: 'inherit',
            letterSpacing: '0.02em',
            padding: '16px 20px',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.08)'
          },
          className: 'premium-toast',
        }}
      />
      <HelmetProvider>
        <Router>
          <SmoothScroll>
            <SideCart />
            <LogoLoader />
            <ScrollToTop />
            <AnimatedRoutes />
          </SmoothScroll>
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
