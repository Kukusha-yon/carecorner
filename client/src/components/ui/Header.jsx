import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Search, ShoppingCart, Menu, X, User, LogOut, Settings, Package, History, Home, Network, Server, Monitor, Mouse, Briefcase, Battery } from 'lucide-react';
import SmoothLink from './SmoothLink';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Get user initials
  const getUserInitials = () => {
    if (!user?.name) return '?';
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 sm:h-10 w-auto"
                src="/logo.png"
                alt="CareCorner"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <SmoothLink
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-[#39b54a]'
                  : 'text-gray-900 hover:text-[#39b54a]'
              }`}
            >
              Home
            </SmoothLink>
            <SmoothLink
              to="/cisco-switch"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/cisco-switch'
                  ? 'text-[#39b54a]'
                  : 'text-gray-900 hover:text-[#39b54a]'
              }`}
            >
              CISCO Switch
            </SmoothLink>
            <SmoothLink
              to="/server"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/server'
                  ? 'text-[#39b54a]'
                  : 'text-gray-900 hover:text-[#39b54a]'
              }`}
            >
              Server
            </SmoothLink>
            <SmoothLink
              to="/monitors"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/monitors'
                  ? 'text-[#39b54a]'
                  : 'text-gray-900 hover:text-[#39b54a]'
              }`}
            >
              Monitors
            </SmoothLink>
            <SmoothLink
              to="/logitech"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/logitech'
                  ? 'text-[#39b54a]'
                  : 'text-gray-900 hover:text-[#39b54a]'
              }`}
            >
              Logitech World
            </SmoothLink>
            <SmoothLink
              to="/bags"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/bags'
                  ? 'text-[#39b54a]'
                  : 'text-gray-900 hover:text-[#39b54a]'
              }`}
            >
              Bags
            </SmoothLink>
            <SmoothLink
              to="/charger"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/charger'
                  ? 'text-[#39b54a]'
                  : 'text-gray-900 hover:text-[#39b54a]'
              }`}
            >
              Chargers
            </SmoothLink>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-600 hover:text-[#39b54a] transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <SmoothLink
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-[#39b54a] transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#39b54a] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </SmoothLink>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="User Menu"
                >
                  <div className="w-8 h-8 rounded-full bg-[#39b54a] text-white flex items-center justify-center font-medium">
                    {getUserInitials()}
                  </div>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile-settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <History className="w-4 h-4 mr-3" />
                          Orders
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Settings className="w-4 h-4 mr-3" />
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:block">
                <SmoothLink
                  to="/login"
                  className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-[#39b54a] hover:bg-[#2d8f3a] transition-colors"
                >
                  Sign In
                </SmoothLink>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-[#39b54a] transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl p-4 w-full max-w-2xl mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Search Products</h2>
                <div className="flex items-center space-x-2">
                  <button
                    type="submit"
                    form="search-form"
                    className="p-2 text-[#39b54a] hover:text-[#2d8f3a] hover:bg-green-50 rounded-md transition-colors duration-200"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 text-gray-500 hover:text-[#39b54a] transition-colors"
                    aria-label="Close Search"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <form
                id="search-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const query = e.target.search.value;
                  if (query.trim()) {
                    navigate(`/search?q=${encodeURIComponent(query)}`);
                    setIsSearchOpen(false);
                  }
                }}
                className="relative"
              >
                <input
                  type="text"
                  name="search"
                  placeholder="Search for products..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#39b54a] focus:border-transparent text-base sm:text-lg"
                  autoFocus
                />
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="px-4 py-4 space-y-3">
              {!user && (
                <div className="px-4 py-4 mb-2 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-100">
                  <p className="text-sm font-medium text-gray-800 mb-3">Sign in to access your account</p>
                  <Link
                    to="/login"
                    className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-[#39b54a] hover:bg-[#2d8f3a] transition-colors shadow-sm"
                  >
                    Sign In
                  </Link>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <SmoothLink
                  to="/"
                  className={`flex flex-col items-center justify-center p-3 rounded-xl ${
                    location.pathname === '/'
                      ? 'bg-[#39b54a]/10 text-[#39b54a]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Home className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Home</span>
                </SmoothLink>
                <SmoothLink
                  to="/cisco-switch"
                  className={`flex flex-col items-center justify-center p-3 rounded-xl ${
                    location.pathname === '/cisco-switch'
                      ? 'bg-[#39b54a]/10 text-[#39b54a]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Network className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">CISCO</span>
                </SmoothLink>
                <SmoothLink
                  to="/server"
                  className={`flex flex-col items-center justify-center p-3 rounded-xl ${
                    location.pathname === '/server'
                      ? 'bg-[#39b54a]/10 text-[#39b54a]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Server className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Server</span>
                </SmoothLink>
                <SmoothLink
                  to="/monitors"
                  className={`flex flex-col items-center justify-center p-3 rounded-xl ${
                    location.pathname === '/monitors'
                      ? 'bg-[#39b54a]/10 text-[#39b54a]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Monitor className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Monitors</span>
                </SmoothLink>
                <SmoothLink
                  to="/logitech"
                  className={`flex flex-col items-center justify-center p-3 rounded-xl ${
                    location.pathname === '/logitech'
                      ? 'bg-[#39b54a]/10 text-[#39b54a]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Mouse className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Logitech</span>
                </SmoothLink>
                <SmoothLink
                  to="/bags"
                  className={`flex flex-col items-center justify-center p-3 rounded-xl ${
                    location.pathname === '/bags'
                      ? 'bg-[#39b54a]/10 text-[#39b54a]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Briefcase className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Bags</span>
                </SmoothLink>
                <SmoothLink
                  to="/charger"
                  className={`flex flex-col items-center justify-center p-3 rounded-xl ${
                    location.pathname === '/charger'
                      ? 'bg-[#39b54a]/10 text-[#39b54a]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Battery className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Chargers</span>
                </SmoothLink>
                <SmoothLink
                  to="/search"
                  className={`flex flex-col items-center justify-center p-3 rounded-xl ${
                    location.pathname === '/search'
                      ? 'bg-[#39b54a]/10 text-[#39b54a]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Search className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Search</span>
                </SmoothLink>
              </div>
              
              {user && (
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="flex items-center px-2 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#39b54a] text-white flex items-center justify-center font-medium mr-3">
                      {getUserInitials()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  <Link
                    to="/profile-settings"
                    className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mb-1"
                  >
                    <User className="w-4 h-4 mr-3 text-gray-500" />
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mb-1"
                  >
                    <History className="w-4 h-4 mr-3 text-gray-500" />
                    Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mb-1"
                    >
                      <Settings className="w-4 h-4 mr-3 text-gray-500" />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg mt-2"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 