import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getFeaturedProducts } from '../services/featuredProductService';
import { useCart } from '../context/CartContext';
import OptimizedImage from '../components/ui/OptimizedImage';
import { toast } from 'react-hot-toast';
import MarketNewsSection from '../components/MarketNewsSection';
import PageTransition from '../components/ui/PageTransition';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import NewArrivalSection from '../components/NewArrivalSection';

const heroSlides = [
  {
    title: 'Outdoor LED Display Screens',
    subtitle: 'Make Your Message Stand Out',
    description: 'High-brightness outdoor LED displays perfect for billboards, stadiums, and outdoor advertising. Weather-resistant and visible in all conditions.',
    image: 'https://www.mpleddisplay.com/uploads/8f8a7a06.jpg',
    cta: 'Explore Outdoor Displays',
    link: '/products?category=outdoor-led-displays',
    theme: 'dark'
  },
  {
    title: 'CISCO Network Solutions',
    subtitle: 'Enterprise-Grade Networking',
    description: 'Discover our comprehensive range of CISCO switches and networking equipment for your business needs.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80',
    cta: 'Explore Network Solutions',
    link: '/products?category=cisco',
    theme: 'light'
  },
  {
    title: 'Indoor LED Video Walls',
    subtitle: 'Immersive Visual Experiences',
    description: 'Crystal-clear indoor LED video walls for retail, corporate lobbies, and entertainment venues. Create stunning visual displays that captivate audiences.',
    image: 'https://cdn.globalso.com/yonwaytech/yonwaytech-indoor-fixed-pillar-p2.5-led-display.jpg',
    cta: 'View Video Walls',
    link: '/products?category=indoor-led-walls',
    theme: 'dark'
  },
  {
    title: 'Premium Servers',
    subtitle: 'High-Performance Computing',
    description: 'Enterprise-grade servers and storage solutions for your growing business infrastructure.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80',
    cta: 'View Server Collection',
    link: '/products?category=server',
    theme: 'light'
  },
  {
    title: 'Rental LED Screens',
    subtitle: 'Flexible Event Solutions',
    description: 'Portable and modular LED screens for events, concerts, and temporary installations. Easy setup and stunning visuals for any occasion.',
    image: 'https://www.eagerled.com/wp-content/uploads/2022/08/640C2-1.jpg',
    cta: 'Discover Rental Options',
    link: '/products?category=rental-led-screens',
    theme: 'dark'
  },
  {
    title: 'Professional Monitors',
    subtitle: 'Crystal Clear Display',
    description: 'High-resolution monitors for enhanced productivity and immersive viewing experience.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80',
    cta: 'Browse Monitors',
    link: '/products?category=monitors',
    theme: 'light'
  },
  {
    title: 'Transparent LED Displays',
    subtitle: 'See-Through Innovation',
    description: 'Revolutionary transparent LED technology that allows light to pass through while displaying vibrant content. Perfect for retail windows and architectural installations.',
    image: 'https://static.wixstatic.com/media/6515c6_b1a192472949445998a3bbfc7259ce75~mv2.png/v1/fill/w_1920,h_1080,al_c/6515c6_b1a192472949445998a3bbfc7259ce75~mv2.png',
    cta: 'Explore Transparent LEDs',
    link: '/products?category=transparent-leds',
    theme: 'dark'
  },
  {
    title: 'Logitech World',
    subtitle: 'Premium Peripherals',
    description: 'Experience the perfect blend of comfort and performance with our premium Logitech accessories.',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80',
    cta: 'LED Outdoor',
    link: '/products?category=logitech',
    theme: 'dark'
  },
  {
    title: 'HS LED Outdoor Signs for Business',
    subtitle: 'Hang on the wall, Hang in the air',
    description: "HS LED Outdoor Signs for Business P6 40''x17'', WiFi Scrolling Programmable, Digital Electronic Message Board for Advertising, Menu Board for Restaurant, Tunemax LED Display for Sports Ticker.",
    image: 'https://www.colorlight-led.com/wp-content/uploads/2024/05/fixed-installation-LED-display-1.webp',
    cta: 'Shop Bags',
    link: '/products?category=transparent-leds',
    theme: 'light'
  },
  {
    title: 'Professional Bags',
    subtitle: 'Style Meets Functionality',
    description: 'Durable and stylish bags designed for your professional needs, perfect for carrying your tech gear.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80',
    cta: 'Shop Bags',
    link: '/products?category=bags',
    theme: 'light'
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const maxProductsToShow = 4;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [category, setCategory] = useState('all');

  const { data: featuredProducts, isLoading: featuredLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: getFeaturedProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentHero = heroSlides[currentSlide];

  const handleAddToCart = async (product) => {
    try {
      addToCart(product, 1);
      toast.success('Product added to cart');
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  const handleProductClick = (product) => {
    // Set the selected product for animation
    setSelectedProduct(product._id);
    
    // Check if productId exists and is an object (populated) or a string (ID)
    const productId = product.productId && typeof product.productId === 'object' 
      ? product.productId._id 
      : product.productId;
    
    if (!productId) {
      toast.error('Product ID not found');
      return;
    }
    
    // Navigate to the product detail page with state
    navigate(`/products/${productId}`, {
      state: { 
        from: 'featured',
        transition: 'slide'
      }
    });
  };

  if (featuredLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative w-screen h-[80vh] md:h-[90vh] overflow-hidden -mt-16 -mx-[calc(50vw-50%)]">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image Container */}
            <div className="absolute inset-0 w-screen h-full">
              <div
                className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-1000"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '100vw',
                  height: '100%',
                  objectFit: 'cover',
                  aspectRatio: '16/9'
                }}
              />
            </div>

            {/* Overlay */}
            <div
              className={`absolute inset-0 ${
                slide.theme === 'dark'
                  ? 'bg-black/20'
                  : 'bg-white/20'
              }`}
            />

            {/* Content */}
            <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
              <div className="max-w-7xl mx-auto text-center">
                <h1
                  className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 transition-colors duration-300 ${
                    slide.theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {slide.title}
                </h1>
                <h2
                  className={`text-lg sm:text-xl md:text-2xl lg:text-3xl mb-3 sm:mb-4 md:mb-6 transition-colors duration-300 ${
                    slide.theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}
                >
                  {slide.subtitle}
                </h2>
                <p
                  className={`text-base sm:text-lg md:text-xl mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto transition-colors duration-300 ${
                    slide.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {slide.description}
                </p>
                <Link
                  to={slide.link}
                  className={`inline-block px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 ${
                    slide.theme === 'dark'
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-[#39b54a] text-white hover:bg-[#2d8f3a]'
                  }`}
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'bg-[#39b54a] w-4 sm:w-6'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <NewArrivalSection />

      {/* Featured Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/featured-products" className="text-[#39b54a] hover:text-[#2d8f3a]">
              View All
            </Link>
          </div>

          {featuredLoading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="w-8 h-8 animate-spin text-[#39b54a]" />
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {Array.isArray(featuredProducts) ? 
                  featuredProducts
                    .filter(product => category === 'all' || product.category === category)
                    .sort((a, b) => {
                      if (sortBy === 'price-low') return a.price - b.price;
                      if (sortBy === 'price-high') return b.price - a.price;
                      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
                      return a.featuredOrder - b.featuredOrder; // Default to featured order
                    })
                    .slice(0, maxProductsToShow)
                    .map((product) => (
                      <motion.div 
                        key={product._id} 
                        className="group"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                        initial={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        animate={selectedProduct === product._id ? { opacity: 0.7, scale: 0.95 } : { opacity: 1, scale: 1 }}
                      >
                        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 transition-all duration-500 hover:shadow-2xl hover:border-[#39b54a] h-full flex flex-col">
                          {/* Image Container */}
                          <div 
                            onClick={() => handleProductClick(product)}
                            className="block cursor-pointer"
                          >
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={product.featuredImage || product.image}
                                alt={product.featuredTitle || product.name}
                                className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="p-3 sm:p-4 md:p-6 flex-grow flex flex-col justify-between">
                              <div>
                                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-[#39b54a] transition-colors duration-300 line-clamp-2 h-12 sm:h-14 md:h-16">
                                  {product.featuredTitle || product.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2 h-10">
                                  {product.featuredDescription || product.description}
                                </p>
                              </div>
                              <div className="flex justify-between items-center mt-auto">
                                <span className="text-lg font-bold text-gray-900">
                                  ETB {product.price.toFixed(2)}
                                </span>
                                {product.featuredButtonText && (
                                  <span className="text-sm text-[#39b54a]">
                                    {product.featuredButtonText}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  : <div className="col-span-full text-center py-8">No featured products available.</div>
                }
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured products available.</p>
            </div>
          )}
        </div>
      </section>

      {/* LED Display Solutions Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">LED Display Solutions</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Discover our comprehensive range of indoor and outdoor LED display solutions tailored for your specific needs.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Indoor LED Display Section */}
            <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-[500px] flex items-center justify-center bg-gray-100">
                <img
                  src="https://untsmart.com/cdn/shop/products/leddisplayposter.jpg?v=1703142468"
                  alt="Indoor LED Display"
                  className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-3">Indoor LED Displays</h3>
                  <p className="text-gray-200 mb-6">
                    High-resolution indoor LED displays perfect for retail spaces, corporate environments, and entertainment venues. Crystal-clear visuals with seamless integration.
                  </p>
                  <div className="flex flex-col gap-2 text-white">
                    <p className="text-lg font-semibold">Contact Information:</p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-300">Phone:</span>
                      <span>+251 911 123 456</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-300">Email:</span>
                      <span>info@carecorner.com</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-300">Address:</span>
                      <span>Addis Ababa, Ethiopia</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Outdoor LED Display Section */}
            <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-[500px] flex items-center justify-center bg-gray-100">
                <img
                  src="https://m.advertisementleddisplay.com/photo/pt33003019-100000h_outdoor_advertising_led_displays_p5mm_stadium_big_screen.jpg"
                  alt="Outdoor LED Display"
                  className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-3">Outdoor LED Displays</h3>
                  <p className="text-gray-200 mb-6">
                    Weather-resistant outdoor LED displays designed for maximum visibility in any condition. Perfect for billboards, stadiums, and outdoor advertising.
                  </p>
                  <div className="flex flex-col gap-2 text-white">
                    <p className="text-lg font-semibold">Contact Information:</p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-300">Phone:</span>
                      <span>+251 911 123 456</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-300">Email:</span>
                      <span>info@carecorner.com</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-300">Address:</span>
                      <span>Addis Ababa, Ethiopia</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market News Section */}
      <MarketNewsSection />
    </PageTransition>
  );
};

export default Home; 