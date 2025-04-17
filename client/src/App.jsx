import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import checkEnvironmentVariables from './utils/envCheck';
import checkApiHealth from './services/healthService';
import testApiConnection from './utils/testApiConnection';



const Home = lazy(() => import('./pages/Home'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const AllProducts = lazy(() => import('./pages/AllProducts'));
const FeaturedProductsPage = lazy(() => import('./pages/FeaturedProductsPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Support = lazy(() => import('./pages/Support'));

// Category pages
const CiscoSwitch = lazy(() => import('./pages/CiscoSwitch'));
const Server = lazy(() => import('./pages/Server'));
const Monitors = lazy(() => import('./pages/Monitors'));
const LogitechWorld = lazy(() => import('./pages/LogitechWorld'));
const Bags = lazy(() => import('./pages/Bags'));
const Charger = lazy(() => import('./pages/Charger'));

// Admin Pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Products = lazy(() => import('./pages/admin/Products'));
const NewProduct = lazy(() => import('./pages/admin/NewProduct'));
const EditProduct = lazy(() => import('./pages/admin/EditProduct'));
const Users = lazy(() => import('./pages/admin/Users'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const NotFound = lazy(() => import('./pages/NotFound'));
const FeaturedProducts = lazy(() => import('./pages/admin/FeaturedProducts'));
const Partners = lazy(() => import('./pages/admin/Partners'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const FeaturedProductForm = lazy(() => import('./components/admin/FeaturedProductForm'));
const NewArrivals = lazy(() => import('./pages/admin/NewArrivals'));
const NewArrivalFormPage = lazy(() => import('./pages/admin/NewArrivalFormPage'));

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// ScrollToTop component to ensure all route changes scroll to the top
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Loading component for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner />
  </div>
);

// AnimatedRoutes component with Suspense
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/profile-settings" element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            } />
            <Route path="/order-history" element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            } />
            <Route path="/order-success" element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            } />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/featured-products" element={<FeaturedProductsPage />} />
            <Route path="/new-arrivals/:id" element={<ProductDetail />} />
            
            {/* Category Routes */}
            <Route path="/cisco-switch" element={<CiscoSwitch />} />
            <Route path="/server" element={<Server />} />
            <Route path="/monitors" element={<Monitors />} />
            <Route path="/logitech" element={<LogitechWorld />} />
            <Route path="/bags" element={<Bags />} />
            <Route path="/charger" element={<Charger />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/support" element={<Support />} />

          {/* Admin Routes */}
          <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/products/new" element={<NewProduct />} />
            <Route path="/admin/products/:id/edit" element={<EditProduct />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/featured-products" element={<FeaturedProducts />} />
            <Route path="/admin/featured-products/new" element={<FeaturedProductForm />} />
            <Route path="/admin/featured-products/:id/edit" element={<FeaturedProductForm />} />
            <Route path="/admin/partners" element={<Partners />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/new-arrivals" element={<NewArrivals />} />
            <Route path="/admin/new-arrivals/new" element={<NewArrivalFormPage />} />
            <Route path="/admin/new-arrivals/:id/edit" element={<NewArrivalFormPage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

const App = () => {
  const [apiHealthy, setApiHealthy] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL || 
    (import.meta.env.PROD ? 'https://carecorner-phi.vercel.app/api' : 'http://localhost:5001/api'));
  
  // Check environment variables and API health on app initialization
  useEffect(() => {
    const initializeApp = async () => {
      // Check environment variables
      checkEnvironmentVariables();
      
      // Test API connection
      const apiTestResult = await testApiConnection(apiUrl);
      if (!apiTestResult.success) {
        console.error('API connection test failed:', apiTestResult.error);
        setApiHealthy(false);
        setApiError(`API connection error: ${apiTestResult.error.message}`);
        return;
      }
      
      // Check API health
      try {
        const isHealthy = await checkApiHealth();
        setApiHealthy(isHealthy);
        
        if (!isHealthy) {
          console.error('API is not healthy. Some features may not work correctly.');
          setApiError('API is not responding correctly. Please try again later.');
        }
      } catch (error) {
        console.error('Failed to check API health:', error);
        setApiHealthy(false);
        setApiError(`API connection error: ${error.message}`);
      }
    };
    
    initializeApp();
  }, [apiUrl]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <CartProvider>
              <ScrollToTop />
              <div className="min-h-screen bg-gray-50">
                {!apiHealthy && (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                    <p className="font-bold">API Connection Issue</p>
                    <p>We're having trouble connecting to our servers. Some features may not work correctly.</p>
                    {apiError && <p className="text-sm mt-1">{apiError}</p>}
                    <p className="text-sm mt-1">API URL: {apiUrl}</p>
                  </div>
                )}
                <AnimatedRoutes />
                <Toaster position="top-right" />
              </div>
            </CartProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
