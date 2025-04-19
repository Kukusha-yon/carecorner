import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import { CheckCircle, Phone, Mail, MessageCircle, ShoppingBag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUserOrders, getOrderById } from '../services/orderService';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location?.state?.orderId;
  const orderItems = location?.state?.orderItems || [];
  const [redirectSeconds, setRedirectSeconds] = useState(10);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Check if we have order data in location state or localStorage
  useEffect(() => {
    // If we have location state with from=checkout, it's a direct navigation from checkout
    if (location?.state?.from === 'checkout') {
      setOrderSuccess(true);
      // Store success state in sessionStorage to handle page refreshes
      sessionStorage.setItem('orderSuccess', 'true');
      
      // If we have an orderId, store it in sessionStorage
      if (location?.state?.orderId) {
        sessionStorage.setItem('lastOrderId', location.state.orderId);
      }
    } 
    // If we don't have location state but have stored success state, use that
    else if (sessionStorage.getItem('orderSuccess') === 'true') {
      setOrderSuccess(true);
    }
    
    // If we have a lastOrderId in sessionStorage but no orderSuccess flag, set it
    else if (sessionStorage.getItem('lastOrderId')) {
      setOrderSuccess(true);
      sessionStorage.setItem('orderSuccess', 'true');
    }
    
    // If we have a last_cart_total in localStorage, it might indicate a recent order
    else if (localStorage.getItem('last_cart_total')) {
      setOrderSuccess(true);
      sessionStorage.setItem('orderSuccess', 'true');
    }
  }, [location]);
  
  // Fetch the latest orders to ensure the new order is visible
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['userOrders'],
    queryFn: getUserOrders,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
    enabled: orderSuccess // Only fetch if we have confirmed order success
  });

  // If we have a specific order ID, fetch that order
  const lastOrderId = orderId || sessionStorage.getItem('lastOrderId');
  const { data: orderDetails, isLoading: orderLoading } = useQuery({
    queryKey: ['order', lastOrderId],
    queryFn: () => {
      // Skip fetching for mock orders (client-side mocks)
      if (lastOrderId && lastOrderId.startsWith('mock_')) {
        console.log('Using mock order data, skipping fetch');
        return { _id: lastOrderId };
      }
      return lastOrderId ? getOrderById(lastOrderId) : null;
    },
    enabled: !!lastOrderId && orderSuccess,
    staleTime: 0
  });

  // Auto-redirect to order history after 10 seconds
  useEffect(() => {
    // Only set up redirection if we have confirmed order success
    if (!orderSuccess) return;
    
    const timer = setInterval(() => {
      setRedirectSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/order-history');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate, orderSuccess]);

  // Loading state - only show if we're fetching a real order (not a mock one)
  if (orderSuccess && (ordersLoading || orderLoading) && !(lastOrderId && lastOrderId.startsWith('mock_'))) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39b54a]" />
      </div>
    );
  }

  // If we don't have confirmed order success, show a different message
  if (!orderSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12">
        <div className="max-w-2xl w-full mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-500 mb-8">
              Ready to place an order? Browse our products and add items to your cart.
            </p>
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth
              className="bg-[#39b54a] hover:bg-[#2d8f3a] text-white"
              onClick={() => navigate('/products')}
            >
              Shop Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Normal order success display
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-2xl w-full mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-[#39b54a]" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank you for your order!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            We've received your order and will process it shortly.
            {orderDetails && <span className="block mt-2 font-medium">Order #: {orderDetails._id.slice(-8)}</span>}
          </p>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Next Steps
            </h2>
            <p className="text-gray-600 mb-6">
              Our team will contact you within 24 hours to discuss your order details and arrange delivery.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Phone className="w-5 h-5" />
                <span>+251 911 123 456</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Mail className="w-5 h-5" />
                <span>orders@carecorner.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <MessageCircle className="w-5 h-5" />
                <span>Telegram: @carecorner</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth
              className="bg-[#39b54a] hover:bg-[#2d8f3a] text-white"
              onClick={() => navigate('/order-history')}
            >
              View Order Status
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              fullWidth
              className="border-[#39b54a] text-[#39b54a] hover:bg-[#39b54a] hover:text-white"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            You will be automatically redirected to your order history in {redirectSeconds} seconds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess; 