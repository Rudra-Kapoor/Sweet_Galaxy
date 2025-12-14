import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCartIcon, UserIcon, HomeIcon, PlusIcon, SparklesIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoverEffect, setHoverEffect] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    // Animate floating effect
    const interval = setInterval(() => {
      setHoverEffect(!hoverEffect);
    }, 3000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ to, children, icon: Icon, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="relative group px-4 py-3 rounded-xl text-gray-300 hover:text-white transition-all duration-300 font-medium flex items-center space-x-2 hover:bg-white/5"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#00C9A7]/0 via-[#845EC2]/0 to-[#FF6B8B]/0 group-hover:from-[#00C9A7]/10 group-hover:via-[#845EC2]/10 group-hover:to-[#FF6B8B]/10 rounded-xl transition-all duration-500" />
      <Icon className="w-5 h-5" />
      <span>{children}</span>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#00C9A7] to-[#845EC2] group-hover:w-3/4 transition-all duration-300" />
    </Link>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-gradient-to-br from-[#0F0F23]/95 via-[#1A1A2E]/95 to-[#16213E]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-2'
          : 'bg-transparent py-4'
      }`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${10 + Math.random() * 15}px`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            >
              {['🍬', '🍭', '🍫', '🧁'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-[#00C9A7]/10 to-[#845EC2]/10 rounded-full blur-3xl animate-pulse -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-[#FF6B8B]/10 to-[#00C9A7]/10 rounded-full blur-3xl animate-pulse delay-1000 translate-x-1/2 -translate-y-1/2"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className={`flex items-center space-x-3 group transition-all duration-500 ${
                hoverEffect ? 'scale-105' : 'scale-100'
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] rounded-xl flex items-center justify-center shadow-2xl animate-gradient-xy">
                  <ShoppingCartIcon className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] bg-clip-text text-transparent animate-gradient-x">
                  Sweet Galaxy
                </span>
                <span className="text-xs text-gray-400 font-medium tracking-wider">
                  COSMIC CONFECTIONS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              <NavLink to="/" icon={HomeIcon}>
                Home
              </NavLink>

              {isAdmin() && (
                <NavLink to="/add-sweet" icon={PlusIcon}>
                  Add Sweet
                </NavLink>
              )}

              {user ? (
                <>
                  <div className="relative group ml-2">
                    <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#00C9A7]/10 via-[#845EC2]/10 to-[#FF6B8B]/10 border border-white/10 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00C9A7] to-[#845EC2] flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-semibold text-sm">{user.name}</span>
                        <div className="flex items-center space-x-1">
                          {isAdmin() && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold">
                              ADMIN
                            </span>
                          )}
                          <span className="text-xs text-gray-400">Cosmic Explorer</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute top-full right-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="bg-gradient-to-br from-[#0F0F23] to-[#1A1A2E] backdrop-blur-2xl rounded-xl border border-white/10 shadow-2xl p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 rounded-lg text-left text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 flex items-center space-x-2 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF6B8B]/20 to-[#FF6B8B]/10 flex items-center justify-center">
                            <SparklesIcon className="w-4 h-4 text-[#FF6B8B] group-hover:rotate-180 transition-transform duration-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold">Logout</span>
                            <span className="text-xs text-gray-500">Leave the galaxy</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3 ml-2">
                  <Link
                    to="/login"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00C9A7]/20 to-[#845EC2]/20 text-white font-semibold hover:from-[#00C9A7]/30 hover:to-[#845EC2]/30 transition-all duration-300 border border-white/10 hover:border-white/20 hover:shadow-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00C9A7] to-[#845EC2] text-white font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#845EC2] to-[#FF6B8B] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative">Register</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-gradient-to-r from-[#00C9A7]/20 to-[#845EC2]/20 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-white" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-white" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-6 pb-6">
              <div className="bg-gradient-to-br from-[#0F0F23]/50 to-[#1A1A2E]/50 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 space-y-4">
                <div className="space-y-2">
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-300"
                  >
                    <HomeIcon className="w-5 h-5 text-[#00C9A7]" />
                    <span className="text-white font-medium">Home</span>
                  </Link>

                  {isAdmin() && (
                    <Link
                      to="/add-sweet"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-300"
                    >
                      <PlusIcon className="w-5 h-5 text-[#845EC2]" />
                      <span className="text-white font-medium">Add Sweet</span>
                    </Link>
                  )}
                </div>

                {user ? (
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#00C9A7]/10 via-[#845EC2]/10 to-[#FF6B8B]/10 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00C9A7] to-[#845EC2] flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold">{user.name}</div>
                        <div className="flex items-center space-x-2">
                          {isAdmin() && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold">
                              ADMIN
                            </span>
                          )}
                          <span className="text-xs text-gray-400">Cosmic Explorer</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#FF6B8B] to-[#FF8BA7] text-white font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <SparklesIcon className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl bg-gradient-to-r from-[#00C9A7]/20 to-[#845EC2]/20 text-white font-semibold text-center hover:from-[#00C9A7]/30 hover:to-[#845EC2]/30 transition-all duration-300"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl bg-gradient-to-r from-[#00C9A7] to-[#845EC2] text-white font-semibold text-center hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Add padding to prevent content from hiding under fixed navbar */}
      <div className="h-24 lg:h-28" />

      {/* Add custom animations to CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-gradient-xy {
          animation: gradient-xy 15s ease infinite;
          background-size: 400% 400%;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% auto;
        }
      `}</style>
    </>
  );
};

export default Navbar;