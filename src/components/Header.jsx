import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiHeart } from 'react-icons/fi';
import { logout } from '../redux/slices/authSlice';
import { selectCartItemCount } from '../redux/slices/cartSlice';
import { selectWishlistCount } from '../redux/slices/wishlistSlice';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cartItemCount = useSelector(selectCartItemCount);
  const wishlistCount = useSelector(selectWishlistCount);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsMenuOpen(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden" 
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
      
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
              <img
                src="https://res.cloudinary.com/dwmytphop/image/upload/v1766473299/ChatGPT_Image_Dec_23_2025_12_30_26_PM_oyeb3g.jpg"
                alt="Cover Ghar"
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                COVER GHAR
              </span>
            </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium  m-2">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 font-medium">
              Products
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/my-designs" className="text-gray-700 hover:text-primary-600 font-medium">
                  My Designs
                </Link>
                <Link to="/themes" className="text-gray-700 hover:text-primary-600 font-medium">
                  Theme
                </Link>
              </>
            )}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-1.5 sm:p-2 text-gray-700 hover:text-primary-600" onClick={closeMenu}>
              <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <Link to="/wishlist" className="relative p-1.5 sm:p-2 text-gray-700 hover:text-primary-600 hidden sm:block" onClick={closeMenu}>
              <FiHeart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary-600">
                  <FiUser className="w-6 h-6" />
                  <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg">
                    Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <nav className="flex flex-col py-2">
              <Link to="/" className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium active:bg-gray-100" onClick={closeMenu}>
                Home
              </Link>
              <Link to="/products" className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium active:bg-gray-100" onClick={closeMenu}>
                Products
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/my-designs" className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium active:bg-gray-100" onClick={closeMenu}>
                    My Designs
                  </Link>
                  <Link to="/themes" className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium active:bg-gray-100" onClick={closeMenu}>
                    Themes
                  </Link>
                  <Link to="/wishlist" className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium active:bg-gray-100 flex items-center justify-between" onClick={closeMenu}>
                    <span>Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5">{wishlistCount}</span>
                    )}
                  </Link>
                  <Link to="/profile" className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium active:bg-gray-100" onClick={closeMenu}>
                    Profile
                  </Link>
                  <Link to="/orders" className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium active:bg-gray-100" onClick={closeMenu}>
                    Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 font-medium active:bg-gray-100" onClick={closeMenu}>
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-4 py-3 border-t border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </form>

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="mx-4 mt-2 mb-3 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium active:bg-red-200"
                >
                  Logout
                </button>
              ) : (
                <div className="px-4 pt-3 pb-2 space-y-2 border-t border-gray-100">
                  <Link
                    to="/login"
                    className="block w-full text-center py-2.5 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 font-medium active:bg-primary-100"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full text-center py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium active:bg-primary-800"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
    </>
  );
};

export default Header;