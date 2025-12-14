import React, { useState, useEffect } from 'react';
import SweetCard from '../components/SweetCard';
import { sweetsAPI } from '../services/api';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, SparklesIcon, ShoppingBagIcon, TagIcon, CurrencyDollarIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Home = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [hoverEffect, setHoverEffect] = useState(false);

  const categories = ['chocolate', 'candy', 'dessert', 'pastry', 'biscuit', 'other'];

  useEffect(() => {
    fetchSweets();
    
    // Animate floating effect
    const interval = setInterval(() => {
      setHoverEffect(!hoverEffect);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update active filters
    const filters = [];
    if (search) filters.push(`Search: "${search}"`);
    if (category) filters.push(`Category: ${category}`);
    if (minPrice) filters.push(`Min: $${minPrice}`);
    if (maxPrice) filters.push(`Max: $${maxPrice}`);
    setActiveFilters(filters);
  }, [search, category, minPrice, maxPrice]);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const response = await sweetsAPI.getAll(params);
      setSweets(response.data);
    } catch (error) {
      toast.error('Failed to fetch sweets', {
        style: {
          background: '#FF6B8B',
          color: '#fff',
        },
        icon: '❌'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSweets();
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setTimeout(() => fetchSweets(), 300);
  };

  const removeFilter = (filterToRemove) => {
    if (filterToRemove.startsWith('Search:')) setSearch('');
    else if (filterToRemove.startsWith('Category:')) setCategory('');
    else if (filterToRemove.startsWith('Min:')) setMinPrice('');
    else if (filterToRemove.startsWith('Max:')) setMaxPrice('');
  };

  const CategoryButton = ({ cat }) => (
    <button
      onClick={() => setCategory(category === cat ? '' : cat)}
      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
        category === cat 
          ? 'bg-gradient-to-r from-[#00C9A7] to-[#845EC2] text-white shadow-lg'
          : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
      }`}
    >
      {cat.charAt(0).toUpperCase() + cat.slice(1)}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${20 + Math.random() * 30}px`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          >
            {['🍬', '🍭', '🍫', '🧁', '🍰'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-[#00C9A7]/10 to-[#845EC2]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-[#FF6B8B]/10 to-[#00C9A7]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className={`inline-block mb-8 transition-all duration-1000 ${hoverEffect ? 'scale-110' : 'scale-100'}`}>
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] rounded-full flex items-center justify-center mx-auto shadow-2xl animate-gradient-xy">
                <ShoppingBagIcon className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="absolute -top-6 -right-6">
                <SparklesIcon className="w-12 h-12 text-[#FFD166] animate-spin-slow" />
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] bg-clip-text text-transparent animate-gradient-x">
              Sweet Galaxy
            </span>
          </h1>
          <p className="text-gray-300 text-2xl font-light tracking-wide max-w-3xl mx-auto">
            Explore an infinite universe of magical sweets and delightful treats
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <div className="flex items-center text-[#00C9A7]">
              <span className="text-2xl mr-2">⭐</span>
              <span className="font-medium">Premium Quality</span>
            </div>
            <div className="flex items-center text-[#845EC2]">
              <span className="text-2xl mr-2">🚀</span>
              <span className="font-medium">Fast Delivery</span>
            </div>
            <div className="flex items-center text-[#FF6B8B]">
              <span className="text-2xl mr-2">✨</span>
              <span className="font-medium">Magical Experience</span>
            </div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 mb-12 border border-white/20 relative overflow-hidden">
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] opacity-30">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E]"></div>
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <AdjustmentsHorizontalIcon className="w-8 h-8 text-[#00C9A7] mr-3" />
                <h2 className="text-3xl font-bold text-white">Explore & Discover</h2>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchSweets}
                  className="px-6 py-3 bg-gradient-to-r from-[#00C9A7] to-[#845EC2] text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center"
                >
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Refresh
                </button>
                {activeFilters.length > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-3 bg-gradient-to-r from-[#FF6B8B] to-[#FF8BA7] text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center"
                  >
                    <XMarkIcon className="w-5 h-5 mr-2" />
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-10">
              <div className="relative group">
                <MagnifyingGlassIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-[#00C9A7] transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search through our sweet galaxy..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#00C9A7] focus:bg-white/10 focus:ring-4 focus:ring-[#00C9A7]/20 transition-all duration-500 placeholder-gray-400 text-white text-lg font-medium backdrop-blur-sm"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-[#845EC2] to-[#FF6B8B] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center"
                >
                  <FunnelIcon className="w-5 h-5 mr-2" />
                  Search
                </button>
              </div>
            </form>

            {/* Category Filters */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <TagIcon className="w-6 h-6 text-[#845EC2] mr-3" />
                <h3 className="text-xl font-semibold text-white">Categories</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <CategoryButton key={cat} cat={cat} />
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <CurrencyDollarIcon className="w-6 h-6 text-[#FF6B8B] mr-3" />
                <h3 className="text-xl font-semibold text-white">Price Range</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Minimum</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="pl-10 w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:border-[#00C9A7] focus:bg-white/10 focus:ring-2 focus:ring-[#00C9A7]/20 transition-all duration-300 placeholder-gray-400 text-white"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Maximum</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      placeholder="100"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="pl-10 w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:border-[#FF6B8B] focus:bg-white/10 focus:ring-2 focus:ring-[#FF6B8B]/20 transition-all duration-300 placeholder-gray-400 text-white"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={fetchSweets}
                    className="w-full py-3 bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] text-white rounded-xl font-bold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex flex-wrap gap-3">
                  {activeFilters.map((filter, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-[#00C9A7]/20 to-[#845EC2]/20 rounded-xl border border-white/10 flex items-center group hover:from-[#00C9A7]/30 hover:to-[#845EC2]/30 transition-all duration-300"
                    >
                      <span className="text-white font-medium mr-2">{filter}</span>
                      <button
                        onClick={() => removeFilter(filter)}
                        className="text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sweets Grid */}
        {loading ? (
          <div className="text-center py-24">
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 border-4 border-[#00C9A7] border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">🍭</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Loading Sweet Treasures...</h3>
            <p className="text-gray-400 text-lg">Discovering magical sweets across the galaxy</p>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-24 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl rounded-3xl border border-white/20">
            <div className="text-8xl mb-6 animate-bounce">🪐</div>
            <h3 className="text-3xl font-bold text-white mb-4">No Sweets Found in This Galaxy</h3>
            <p className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto">
              Try adjusting your cosmic filters or explore different categories
            </p>
            <button
              onClick={handleClearFilters}
              className="px-8 py-4 bg-gradient-to-r from-[#00C9A7] to-[#845EC2] text-white rounded-2xl font-bold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Reset Cosmic Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">
                    Sweet Collection
                  </h2>
                  <div className="flex items-center text-gray-400">
                    <span className="mr-2">🎯</span>
                    <span className="text-lg">
                      {sweets.length} {sweets.length === 1 ? 'Magical Sweet' : 'Magical Sweets'} Discovered
                    </span>
                  </div>
                </div>
                <div className="px-6 py-3 bg-gradient-to-r from-[#00C9A7]/20 to-[#845EC2]/20 rounded-xl border border-white/10">
                  <span className="text-white font-bold text-lg">
                    Total Value: ${sweets.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sweets.map((sweet) => (
                <SweetCard
                  key={sweet._id}
                  sweet={sweet}
                  onDelete={(id) => setSweets(sweets.filter(s => s._id !== id))}
                  onUpdate={fetchSweets}
                />
              ))}
            </div>

            {/* Stats Footer */}
            <div className="mt-16 pt-12 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-gradient-to-br from-[#00C9A7]/10 to-[#00C9A7]/5 rounded-2xl border border-[#00C9A7]/20">
                  <div className="text-4xl mb-4">🍫</div>
                  <h4 className="text-xl font-bold text-white mb-2">Chocolate Collection</h4>
                  <p className="text-gray-300">
                    {sweets.filter(s => s.category === 'chocolate').length} varieties
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-[#845EC2]/10 to-[#845EC2]/5 rounded-2xl border border-[#845EC2]/20">
                  <div className="text-4xl mb-4">🍬</div>
                  <h4 className="text-xl font-bold text-white mb-2">Candy Selection</h4>
                  <p className="text-gray-300">
                    {sweets.filter(s => s.category === 'candy').length} options
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-[#FF6B8B]/10 to-[#FF6B8B]/5 rounded-2xl border border-[#FF6B8B]/20">
                  <div className="text-4xl mb-4">🍰</div>
                  <h4 className="text-xl font-bold text-white mb-2">Dessert Paradise</h4>
                  <p className="text-gray-300">
                    {sweets.filter(s => s.category === 'dessert').length} delights
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add custom animations to CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
        
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;