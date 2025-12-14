import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sweetsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftIcon, PhotoIcon, TagIcon, CurrencyDollarIcon, CubeIcon, SparklesIcon, PlusCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const AddSweet = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'chocolate',
    price: '',
    quantity: '10',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [hoverEffect, setHoverEffect] = useState(false);
  const [imageError, setImageError] = useState(false);

  const categories = [
    { value: 'chocolate', label: 'Chocolate', emoji: '🍫' },
    { value: 'candy', label: 'Candy', emoji: '🍬' },
    { value: 'dessert', label: 'Dessert', emoji: '🍰' },
    { value: 'pastry', label: 'Pastry', emoji: '🥐' },
    { value: 'biscuit', label: 'Biscuit', emoji: '🍪' },
    { value: 'other', label: 'Other', emoji: '🍭' }
  ];

  // Animate floating effect
  useEffect(() => {
    const interval = setInterval(() => {
      setHoverEffect(!hoverEffect);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [hoverEffect]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Reset image error when URL changes
    if (name === 'image') {
      setImageError(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    toast.error('Failed to load image. Using placeholder.', {
      style: {
        background: '#FF6B8B',
        color: '#fff',
      },
      icon: '🖼️'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.quantity) {
      toast.error('Please fill in all required fields', {
        style: {
          background: '#FF6B8B',
          color: '#fff',
        },
        icon: '⚠️'
      });
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      toast.error('Price must be greater than 0', {
        style: {
          background: '#FF6B8B',
          color: '#fff',
        },
        icon: '💰'
      });
      return;
    }

    if (parseInt(formData.quantity) < 0) {
      toast.error('Quantity cannot be negative', {
        style: {
          background: '#FF6B8B',
          color: '#fff',
        },
        icon: '📦'
      });
      return;
    }

    setLoading(true);

    try {
      const sweetData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        image: formData.image || 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop'
      };

      const response = await sweetsAPI.create(sweetData);
      
      toast.success('🎉 Sweet added to the galaxy successfully!', {
        style: {
          background: '#00C9A7',
          color: '#fff',
        },
        icon: '✨'
      });
      
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create sweet', {
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

  // Redirect if not admin
  if (!isAdmin()) {
    navigate('/');
    return null;
  }

  const CategoryOption = ({ category }) => (
    <option 
      value={category.value} 
      className="bg-[#1A1A2E] text-white"
    >
      {category.emoji} {category.label}
    </option>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
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
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-[#00C9A7]/20 to-[#845EC2]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-[#FF6B8B]/20 to-[#00C9A7]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center text-gray-300 hover:text-white transition-colors duration-300 group"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Sweet Galaxy</span>
        </button>

        {/* Main card */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/20 relative overflow-hidden">
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] opacity-30">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E]"></div>
          </div>
          
          <div className="relative">
            {/* Header */}
            <div className="text-center mb-12">
              <div className={`inline-block mb-6 transition-all duration-1000 ${hoverEffect ? 'scale-110 rotate-6' : 'scale-100'}`}>
                <div className="relative">
                  <div className="w-28 h-28 bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] rounded-full flex items-center justify-center mx-auto shadow-2xl animate-gradient-xy">
                    <PlusCircleIcon className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] rounded-full blur-xl opacity-30 animate-pulse"></div>
                  <div className="absolute -top-4 -right-4">
                    <SparklesIcon className="w-10 h-10 text-[#FFD166] animate-spin-slow" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] bg-clip-text text-transparent animate-gradient-x">
                  Create New Sweet
                </span>
              </h1>
              <p className="text-gray-300 text-lg font-light tracking-wide">
                Add a magical sweet to our cosmic collection
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Sweet Name */}
                  <div className="group relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-300 group-focus-within:scale-110">
                      <span className="text-2xl">🍯</span>
                    </div>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-14 w-full px-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#00C9A7] focus:bg-white/10 focus:ring-4 focus:ring-[#00C9A7]/20 transition-all duration-500 placeholder-gray-400 text-white text-lg font-medium backdrop-blur-sm"
                      placeholder="Enter sweet name"
                    />
                    <label className="absolute -top-3 left-4 px-2 text-sm font-semibold text-gray-300 bg-gradient-to-r from-[#0F0F23] via-[#1A1A2E] to-[#16213E] transition-all duration-300">
                      Sweet Name *
                    </label>
                  </div>

                  {/* Description */}
                  <div className="group relative">
                    <textarea
                      name="description"
                      required
                      value={formData.description}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#845EC2] focus:bg-white/10 focus:ring-4 focus:ring-[#845EC2]/20 transition-all duration-500 placeholder-gray-400 text-white text-lg font-medium backdrop-blur-sm resize-none"
                      placeholder="Describe this magical sweet..."
                    />
                    <label className="absolute -top-3 left-4 px-2 text-sm font-semibold text-gray-300 bg-gradient-to-r from-[#0F0F23] via-[#1A1A2E] to-[#16213E] transition-all duration-300">
                      Magical Description *
                    </label>
                    <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
                      {formData.description.length}/500
                    </div>
                  </div>

                  {/* Category */}
                  <div className="group relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-300 group-focus-within:scale-110">
                      <TagIcon className="w-6 h-6 text-gray-400 group-focus-within:text-[#00C9A7] transition-colors duration-300" />
                    </div>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="pl-14 w-full px-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#00C9A7] focus:bg-white/10 focus:ring-4 focus:ring-[#00C9A7]/20 transition-all duration-500 text-white text-lg font-medium backdrop-blur-sm appearance-none"
                    >
                      {categories.map((cat) => (
                        <CategoryOption key={cat.value} category={cat} />
                      ))}
                    </select>
                    <label className="absolute -top-3 left-4 px-2 text-sm font-semibold text-gray-300 bg-gradient-to-r from-[#0F0F23] via-[#1A1A2E] to-[#16213E] transition-all duration-300">
                      Category *
                    </label>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Price */}
                  <div className="group relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-300 group-focus-within:scale-110">
                      <CurrencyDollarIcon className="w-6 h-6 text-gray-400 group-focus-within:text-[#FF6B8B] transition-colors duration-300" />
                    </div>
                    <input
                      type="number"
                      name="price"
                      required
                      step="0.01"
                      min="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="pl-14 w-full px-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#FF6B8B] focus:bg-white/10 focus:ring-4 focus:ring-[#FF6B8B]/20 transition-all duration-500 placeholder-gray-400 text-white text-lg font-medium backdrop-blur-sm"
                      placeholder="0.00"
                    />
                    <label className="absolute -top-3 left-4 px-2 text-sm font-semibold text-gray-300 bg-gradient-to-r from-[#0F0F23] via-[#1A1A2E] to-[#16213E] transition-all duration-300">
                      Price ($) *
                    </label>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      USD
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="group relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-300 group-focus-within:scale-110">
                      <CubeIcon className="w-6 h-6 text-gray-400 group-focus-within:text-[#845EC2] transition-colors duration-300" />
                    </div>
                    <input
                      type="number"
                      name="quantity"
                      required
                      min="0"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="pl-14 w-full px-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#845EC2] focus:bg-white/10 focus:ring-4 focus:ring-[#845EC2]/20 transition-all duration-500 placeholder-gray-400 text-white text-lg font-medium backdrop-blur-sm"
                      placeholder="0"
                    />
                    <label className="absolute -top-3 left-4 px-2 text-sm font-semibold text-gray-300 bg-gradient-to-r from-[#0F0F23] via-[#1A1A2E] to-[#16213E] transition-all duration-300">
                      Quantity *
                    </label>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      units
                    </div>
                  </div>

                  {/* Image URL */}
                  <div className="group relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-300 group-focus-within:scale-110">
                      <PhotoIcon className="w-6 h-6 text-gray-400 group-focus-within:text-[#00C9A7] transition-colors duration-300" />
                    </div>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="pl-14 w-full px-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#00C9A7] focus:bg-white/10 focus:ring-4 focus:ring-[#00C9A7]/20 transition-all duration-500 placeholder-gray-400 text-white text-lg font-medium backdrop-blur-sm"
                      placeholder="https://example.com/sweet-image.jpg"
                    />
                    <label className="absolute -top-3 left-4 px-2 text-sm font-semibold text-gray-300 bg-gradient-to-r from-[#0F0F23] via-[#1A1A2E] to-[#16213E] transition-all duration-300">
                      Image URL
                    </label>
                  </div>

                  {/* Image Preview */}
                  {(formData.image || imageError) && (
                    <div className="mt-4 p-6 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <PhotoIcon className="w-5 h-5 mr-2 text-[#00C9A7]" />
                        Image Preview
                      </h3>
                      <div className="flex justify-center">
                        <div className="relative group/preview">
                          <img
                            src={imageError ? 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop' : formData.image}
                            alt="Sweet preview"
                            className="h-48 w-48 object-cover rounded-xl border-2 border-white/10 group-hover/preview:border-[#00C9A7] transition-all duration-300"
                            onError={handleImageError}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/preview:opacity-100 rounded-xl transition-opacity duration-300 flex items-end justify-center p-4">
                            <span className="text-white text-sm font-medium">
                              {imageError ? 'Placeholder' : 'Preview'}
                            </span>
                          </div>
                        </div>
                      </div>
                      {imageError && (
                        <p className="mt-2 text-center text-sm text-[#FF6B8B]">
                          Using default image
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Tips */}
              <div className="p-6 bg-gradient-to-r from-[#00C9A7]/10 to-[#845EC2]/10 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <SparklesIcon className="w-5 h-5 mr-2 text-[#FFD166]" />
                  Pro Tips for Magical Sweets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <span className="text-xl">💰</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Pricing</h4>
                      <p className="text-gray-300 text-sm">Set competitive prices between $1-20</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <span className="text-xl">📦</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Stock</h4>
                      <p className="text-gray-300 text-sm">Start with 10-50 units for new sweets</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <span className="text-xl">🖼️</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Images</h4>
                      <p className="text-gray-300 text-sm">Use high-quality, appetizing images</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-6 pt-8">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 py-5 px-6 bg-gradient-to-r from-white/5 to-white/10 border border-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/20 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  <span className="mr-2">←</span>
                  Cancel Mission
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-5 px-6 rounded-2xl font-bold text-lg shadow-2xl transform transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] ${
                    loading
                      ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] hover:shadow-[0_0_40px_rgba(0,201,167,0.3)]'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      <span className="text-xl">Launching Sweet...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CheckCircleIcon className="w-6 h-6 mr-3" />
                      <span className="text-xl">Launch Sweet to Galaxy</span>
                      <span className="ml-3 text-2xl">🚀</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
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

export default AddSweet;