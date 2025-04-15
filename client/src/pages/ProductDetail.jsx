import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ChevronRight, Star, Truck, Shield, Check, Info, ChevronDown, ChevronUp, ShoppingCart, Heart, ZoomIn, ArrowLeft, X } from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { getProductById } from '../services/productService';
import { getFeaturedProductByProductId } from '../services/featuredProductService';
import { getNewArrivalById } from '../services/newArrivalService';
import { Loader2 } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const isNewArrivalPath = location.pathname.startsWith('/new-arrivals/');
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    specifications: false,
    features: false,
    reviews: false
  });
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isNewArrival, setIsNewArrival] = useState(isNewArrivalPath);

  // Try to fetch as a product first
  const { data: product, isLoading: isLoadingProduct, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    retry: false,
    enabled: !isNewArrivalPath
  });

  // Also fetch featured product data if available
  const { data: featuredProduct, isLoading: isLoadingFeatured } = useQuery({
    queryKey: ['featuredProduct', id],
    queryFn: () => getFeaturedProductByProductId(id),
    enabled: !!product // Only fetch if we have the product
  });

  // Combine product and featured product data
  const item = featuredProduct ? {
    ...product,
    ...featuredProduct,
    name: featuredProduct.featuredTitle || product?.name,
    description: featuredProduct.featuredDescription || product?.description,
    image: featuredProduct.featuredImage || product?.image,
    galleryImages: featuredProduct.featuredGalleryImages || product?.galleryImages
  } : product;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Fetch new arrival if we're on a new arrival path or if product fetch failed
  const { data: newArrival, isLoading: isLoadingNewArrival, error: newArrivalError } = useQuery({
    queryKey: ['newArrival', id],
    queryFn: () => getNewArrivalById(id),
    enabled: isNewArrival,
    retry: false,
    onError: (error) => {
      // If both product and new arrival fetches fail, show error
      console.error('Failed to fetch item:', error);
    }
  });

  // Determine which data to use
  const itemToUse = isNewArrival ? newArrival : item;
  const isLoading = isNewArrival ? isLoadingNewArrival : isLoadingProduct;
  const error = isNewArrival ? newArrivalError : productError;

  // Log the current state for debugging
  useEffect(() => {
    console.log('Current state:', {
      isNewArrivalPath,
      isNewArrival,
      product,
      featuredProduct,
      productError,
      isLoadingFeatured
    });
  }, [isNewArrivalPath, isNewArrival, product, featuredProduct, productError, isLoadingFeatured]);

  // Handle errors more gracefully
  useEffect(() => {
    if (productError && !isNewArrival) {
      console.log('Product fetch failed, trying new arrival');
      setIsNewArrival(true);
    }
  }, [productError, isNewArrival]);

  // Fetch related products
  const { data: relatedProducts } = useQuery({
    queryKey: ['relatedProducts', id, itemToUse?.category],
    queryFn: async () => {
      if (!itemToUse?.category) return [];
      const response = await api.get(`/products/category/${encodeURIComponent(itemToUse.category)}`);
      // Filter out the current product and limit to 4 related products
      return response.data.filter(p => p._id !== id).slice(0, 4);
    },
    enabled: !!itemToUse?.category
  });

  const handleAddToCart = () => {
    if (!itemToUse) return;
    
    // For new arrivals, we don't have countInStock, so we'll assume it's in stock
    if (!isNewArrival && itemToUse.countInStock === 0) {
      toast.error('This item is out of stock');
      return;
    }
    
    addToCart({
      ...itemToUse,
      isNewArrival: isNewArrival
    }, quantity);
    toast.success('Added to cart');
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current || !isZoomed) return;
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = Math.min(Math.max((e.clientX - left) / width, 0), 1);
    const y = Math.min(Math.max((e.clientY - top) / height, 0), 1);
    
    setZoomPosition({ x, y });
  };

  const handleTouchMove = (e) => {
    if (!imageRef.current || !isZoomed) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = Math.min(Math.max((touch.clientX - left) / width, 0), 1);
    const y = Math.min(Math.max((touch.clientY - top) / height, 0), 1);
    
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (allImages && allImages[selectedImage]) {
      setIsZoomed(true);
    }
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#39b54a]"></div>
      </motion.div>
    );
  }

  if (error || !itemToUse) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Item Not Found</h1>
          <p className="text-gray-600 mb-6">The item you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-4 py-2 bg-[#39b54a] text-white rounded-lg hover:bg-[#2d8f3a] transition-colors"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Products
          </Link>
        </div>
      </motion.div>
    );
  }

  // Prepare images array, handling both product and new arrival formats
  const allImages = [itemToUse.image];
  if (itemToUse.galleryImages) {
    if (Array.isArray(itemToUse.galleryImages)) {
      // Handle new arrival format
      allImages.push(...itemToUse.galleryImages.map(img => img.url));
    } else {
      // Handle product format
      allImages.push(...itemToUse.galleryImages);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: location.state?.transition === 'slide' ? 50 : 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: location.state?.transition === 'slide' ? -50 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Link to="/products" className="ml-2 text-gray-500 hover:text-gray-700">
                Products
              </Link>
            </li>
            {itemToUse.category && (
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <Link to={`/products?category=${itemToUse.category}`} className="ml-2 text-gray-500 hover:text-gray-700">
                  {itemToUse.category}
                </Link>
              </li>
            )}
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="ml-2 text-gray-900 truncate max-w-xs">{itemToUse.name}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="relative">
            <div
              ref={imageRef}
              className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-200"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchMove={handleTouchMove}
              onClick={toggleZoom}
            >
              <img
                src={allImages[selectedImage]}
                alt={itemToUse.name}
                className={`w-full h-full object-contain p-4 transition-all duration-300 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                        cursor: 'zoom-out'
                      }
                    : {
                        cursor: 'zoom-in'
                      }
                }
              />
              {isZoomed && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <ZoomIn className="h-8 w-8 text-gray-400 opacity-50" />
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-md overflow-hidden border ${
                      selectedImage === index
                        ? 'border-[#39b54a] ring-2 ring-[#39b54a]'
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${itemToUse.name} ${index + 1}`}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/400x400?text=No+Image';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl font-bold text-gray-900">{itemToUse.name}</h1>
              {itemToUse.brand && (
                <div className="mt-2 flex items-center">
                  <span className="text-sm text-gray-500">Brand: </span>
                  <Link to={`/brand/${itemToUse.brand}`} className="ml-1 text-sm font-medium text-[#39b54a] hover:underline">
                    {itemToUse.brand}
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Rating */}
            {itemToUse.rating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(itemToUse.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill={i <= Math.floor(itemToUse.rating) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <p className="ml-2 text-sm text-gray-500">
                    {itemToUse.rating.toFixed(1)} out of 5
                  </p>
                  {itemToUse.numReviews && (
                    <p className="ml-2 text-sm text-gray-500">
                      ({itemToUse.numReviews} reviews)
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">ETB {itemToUse.price.toFixed(2)}</p>
                {itemToUse.originalPrice && (
                  <p className="ml-2 text-lg text-gray-500 line-through">
                    ETB {itemToUse.originalPrice.toFixed(2)}
                  </p>
                )}
              </div>
              {itemToUse.originalPrice && (
                <p className="mt-1 text-sm text-green-600">
                  Save ETB {(itemToUse.originalPrice - itemToUse.price).toFixed(2)} ({Math.round((1 - itemToUse.price / itemToUse.originalPrice) * 100)}% off)
                </p>
              )}
            </motion.div>

            {/* Stock Status */}
            {!isNewArrival && (
              <div className="mt-4">
                {itemToUse.countInStock > 0 ? (
                  <div className="flex items-center text-green-600">
                    <Check className="h-5 w-5 mr-1" />
                    <span>In Stock</span>
                    {itemToUse.countInStock < 10 && (
                      <span className="ml-2 text-sm text-orange-600">
                        (Only {itemToUse.countInStock} left)
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <X className="h-5 w-5 mr-1" />
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>
            )}

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6"
            >
              {/* SKU and Model */}
              {(itemToUse.sku || itemToUse.modelNumber) && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {itemToUse.sku && (
                    <div>
                      <span className="text-gray-500">SKU:</span>
                      <span className="ml-2 font-medium">{itemToUse.sku}</span>
                    </div>
                  )}
                  {itemToUse.modelNumber && (
                    <div>
                      <span className="text-gray-500">Model:</span>
                      <span className="ml-2 font-medium">{itemToUse.modelNumber}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="mt-6 flex space-x-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-3 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!isNewArrival && itemToUse.countInStock === 0}
                  className="flex-1 bg-[#39b54a] text-white px-6 py-3 rounded-md hover:bg-[#2d8f3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#39b54a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {!isNewArrival && itemToUse.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50"
                  aria-label="Add to wishlist"
                >
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </motion.div>

            {/* Description and Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              {/* Description Section */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('description')}
                  className="flex justify-between items-center w-full py-4 text-left"
                >
                  <h2 className="text-lg font-medium text-gray-900">Description</h2>
                  {expandedSections.description ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {expandedSections.description && (
                  <div className="pb-4 prose prose-sm max-w-none">
                    <p className="text-gray-600">{itemToUse.description}</p>
                    {itemToUse.detailedDescription && (
                      <div className="mt-4 text-gray-600 whitespace-pre-line">{itemToUse.detailedDescription}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Features Section */}
              {itemToUse.features && itemToUse.features.length > 0 && (
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => toggleSection('features')}
                    className="flex justify-between items-center w-full py-4 text-left"
                  >
                    <h2 className="text-lg font-medium text-gray-900">Features</h2>
                    {expandedSections.features ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {expandedSections.features && (
                    <div className="pb-4">
                      <ul className="list-disc pl-5 space-y-2">
                        {itemToUse.features.map((feature, index) => (
                          <li key={index} className="text-gray-600">{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {/* Specifications Section */}
              {(itemToUse.technicalSpecs || itemToUse.specifications || itemToUse.dimensions || itemToUse.weight || itemToUse.warranty) && (
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => toggleSection('specifications')}
                    className="flex justify-between items-center w-full py-4 text-left"
                  >
                    <h2 className="text-lg font-medium text-gray-900">Specifications</h2>
                    {expandedSections.specifications ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {expandedSections.specifications && (
                    <div className="pb-4">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        {/* Technical Specs */}
                        {itemToUse.technicalSpecs && Object.entries(itemToUse.technicalSpecs).map(([key, value]) => (
                          <div key={key}>
                            <dt className="text-sm font-medium text-gray-500">{key}</dt>
                            <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                          </div>
                        ))}
                        
                        {/* Specifications (for new arrivals) */}
                        {itemToUse.specifications && Object.entries(itemToUse.specifications).map(([key, value]) => (
                          <div key={key}>
                            <dt className="text-sm font-medium text-gray-500">{key}</dt>
                            <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                          </div>
                        ))}
                        
                        {/* Dimensions */}
                        {itemToUse.dimensions && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {itemToUse.dimensions.length} x {itemToUse.dimensions.width} x {itemToUse.dimensions.height} {itemToUse.dimensions.unit}
                            </dd>
                          </div>
                        )}
                        
                        {/* Weight */}
                        {itemToUse.weight && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Weight</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {itemToUse.weight.value} {itemToUse.weight.unit}
                            </dd>
                          </div>
                        )}
                        
                        {/* Warranty */}
                        {itemToUse.warranty && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Warranty</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {itemToUse.warranty.duration} {itemToUse.warranty.unit}
                              {itemToUse.warranty.description && (
                                <span className="block text-gray-500">{itemToUse.warranty.description}</span>
                              )}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  )}
                </div>
              )}
              
              {/* Reviews Section */}
              {itemToUse.reviews && itemToUse.reviews.length > 0 && (
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => toggleSection('reviews')}
                    className="flex justify-between items-center w-full py-4 text-left"
                  >
                    <h2 className="text-lg font-medium text-gray-900">Reviews</h2>
                    {expandedSections.reviews ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {expandedSections.reviews && (
                    <div className="pb-4">
                      {itemToUse.reviews && itemToUse.reviews.length > 0 ? (
                        <div className="space-y-6">
                          {itemToUse.reviews.map((review, index) => (
                            <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                              <div className="flex items-center">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                      }`}
                                      fill={i <= review.rating ? 'currentColor' : 'none'}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-900">
                                  {review.name}
                                </span>
                                <span className="ml-2 text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No reviews yet.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg h-full flex flex-col">
                    <div className="aspect-w-1 aspect-h-1 w-full h-48">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-[#39b54a] transition-colors line-clamp-2 h-12">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2 h-10">
                          {product.description}
                        </p>
                      </div>
                      <p className="mt-2 text-lg font-bold text-gray-900">
                        ETB {product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetail; 