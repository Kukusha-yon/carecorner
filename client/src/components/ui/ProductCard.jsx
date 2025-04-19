import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from './Button';
import { ShoppingCart, Phone, Mail, MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductCard = memo(({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  // Check if product is valid
  if (!product || !product._id) {
    console.error('Invalid product data:', product);
    return null;
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.countInStock === 0) {
      toast.error('This product is currently out of stock. Please contact us for availability.');
      return;
    }
    
    addToCart(product);
  };

  return (
    <div 
      className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative w-full h-48 bg-gray-50">
          <div className="absolute inset-0 flex items-center justify-center p-4">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name || 'Product image'}
                className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  console.error('Error loading image:', product.image);
                  e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          {product.isBestSeller && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
              Best Seller
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <Link to={`/products/${product._id}`} className="block">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 h-12 hover:text-[#39b54a] transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl font-bold text-[#39b54a]">
              ETB {product.price.toFixed(2)}
            </span>
            {product.countInStock > 0 ? (
              <span className="text-sm text-green-600">In Stock</span>
            ) : (
              <span className="text-sm text-red-600">Out of Stock</span>
            )}
          </div>

          {product.countInStock === 0 ? (
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-600 mb-2">This item is currently out of stock. Please contact us for availability:</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+251 911 123 456</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>orders@carecorner.com</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>Telegram: @carecorner</span>
                </div>
              </div>
            </div>
          ) : null}

          <Button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className="w-full"
            variant={product.countInStock === 0 ? 'disabled' : 'primary'}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard; 