import React, { useState } from 'react';
import { sweetsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  PencilIcon, 
  TrashIcon, 
  ShoppingCartIcon, 
  ArrowPathIcon,
  StarIcon,
  FireIcon,
  CurrencyDollarIcon,
  CubeIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const SweetCard = ({ sweet, onDelete, onUpdate }) => {
  const { user, isAdmin } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [restockQuantity, setRestockQuantity] = useState(10);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...sweet });
  const [isHovered, setIsHovered] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestocking, setIsRestocking] = useState(false);

  const categoryColors = {
    chocolate: 'from-[#D4A574] to-[#8B4513]',
    candy: 'from-[#FF6B8B] to-[#FF1493]',
    dessert: 'from-[#845EC2] to-[#4B0082]',
    pastry: 'from-[#00C9A7] to-[#008B8B]',
    biscuit: 'from-[#FFD166] to-[#FFA500]',
    other: 'from-[#C9ADA7] to-[#8A817C]'
  };

  const categoryEmoji = {
    chocolate: '🍫',
    candy: '🍬',
    dessert: '🍰',
    pastry: '🥐',
    biscuit: '🍪',
    other: '✨'
  };

  const handlePurchase = async () => {
    try {
      setIsPurchasing(true);
      await sweetsAPI.purchase(sweet._id, quantity);
      toast.success(`🚀 Purchased ${quantity} ${sweet.name}(s)!`, {
        style: {
          background: 'linear-gradient(135deg, #00C9A7 0%, #845EC2 100%)',
          color: '#fff',
        },
        icon: '🎯'
      });
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Purchase failed', {
        style: {
          background: '#FF6B8B',
          color: '#fff',
        },
        icon: '❌'
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestock = async () => {
    try {
      setIsRestocking(true);
      await sweetsAPI.restock(sweet._id, restockQuantity);
      toast.success(`✨ Restocked ${restockQuantity} ${sweet.name}(s)!`, {
        style: {
          background: 'linear-gradient(135deg, #00C9A7 0%, #845EC2 100%)',
          color: '#fff',
        },
        icon: '⚡'
      });
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Restock failed', {
        style: {
          background: '#FF6B8B',
          color: '#fff',
        },
        icon: '❌'
      });
    } finally {
      setIsRestocking(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`🌌 Are you sure you want to delete ${sweet.name} from the galaxy?`)) {
      try {
        await sweetsAPI.delete(sweet._id);
        toast.success(`🌟 ${sweet.name} vanished from the galaxy!`, {
          style: {
            background: 'linear-gradient(135deg, #FF6B8B 0%, #845EC2 100%)',
            color: '#fff',
          },
          icon: '✨'
        });
        if (onDelete) onDelete(sweet._id);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Delete failed', {
          style: {
            background: '#FF6B8B',
            color: '#fff',
          },
          icon: '❌'
        });
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await sweetsAPI.update(sweet._id, editData);
      toast.success(`✨ ${sweet.name} updated successfully!`, {
        style: {
          background: 'linear-gradient(135deg, #00C9A7 0%, #845EC2 100%)',
          color: '#fff',
        },
        icon: '✅'
      });
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Update failed', {
        style: {
          background: '#FF6B8B',
          color: '#fff',
        },
        icon: '❌'
      });
    }
  };

  if (isEditing) {
    return (
      <div className="bg-gradient-to-br from-[#0F0F23] to-[#1A1A2E] backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 transform transition-all duration-500 hover:shadow-3xl relative overflow-hidden">
        {/* Animated border */}
        <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] opacity-30">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E]"></div>
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#00C9A7] to-[#845EC2] flex items-center justify-center mr-4">
                <CubeIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Edit Sweet</h3>
            </div>
            <div className="text-4xl">{categoryEmoji[sweet.category] || '✨'}</div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Sweet Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:border-[#00C9A7] focus:bg-white/10 focus:ring-2 focus:ring-[#00C9A7]/20 transition-all duration-300 text-white placeholder-gray-400"
                  placeholder="Enter sweet name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
                <select
                  value={editData.category}
                  onChange={(e) => setEditData({...editData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:border-[#845EC2] focus:bg-white/10 focus:ring-2 focus:ring-[#845EC2]/20 transition-all duration-300 text-white"
                >
                  <option value="chocolate">🍫 Chocolate</option>
                  <option value="candy">🍬 Candy</option>
                  <option value="dessert">🍰 Dessert</option>
                  <option value="pastry">🥐 Pastry</option>
                  <option value="biscuit">🍪 Biscuit</option>
                  <option value="other">✨ Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({...editData, description: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:border-[#00C9A7] focus:bg-white/10 focus:ring-2 focus:ring-[#00C9A7]/20 transition-all duration-300 text-white placeholder-gray-400"
                rows="3"
                placeholder="Describe this magical sweet..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                    Price (USD)
                  </div>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={editData.price}
                    onChange={(e) => setEditData({...editData, price: parseFloat(e.target.value)})}
                    className="w-full pl-10 px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:border-[#FF6B8B] focus:bg-white/10 focus:ring-2 focus:ring-[#FF6B8B]/20 transition-all duration-300 text-white"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <div className="flex items-center">
                    <CubeIcon className="w-4 h-4 mr-2" />
                    Quantity
                  </div>
                </label>
                <input
                  type="number"
                  value={editData.quantity}
                  onChange={(e) => setEditData({...editData, quantity: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:border-[#00C9A7] focus:bg-white/10 focus:ring-2 focus:ring-[#00C9A7]/20 transition-all duration-300 text-white"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleUpdate}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-[#00C9A7] to-[#845EC2] text-white rounded-xl font-bold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
              >
                <SparklesIcon className="w-5 h-5 mr-2" />
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-[#FF6B8B]/20 to-[#845EC2]/20 text-white rounded-xl font-bold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border border-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStockStatus = () => {
    if (sweet.quantity === 0) return { color: 'from-[#FF6B8B] to-[#FF4757]', text: 'Out of Stock', icon: <XCircleIcon className="w-4 h-4" /> };
    if (sweet.quantity < 10) return { color: 'from-[#FFD166] to-[#FFA500]', text: 'Low Stock', icon: <ExclamationTriangleIcon className="w-4 h-4" /> };
    if (sweet.quantity > 50) return { color: 'from-[#00C9A7] to-[#2ECC71]', text: 'High Stock', icon: <ArrowTrendingUpIcon className="w-4 h-4" /> };
    return { color: 'from-[#845EC2] to-[#9B59B6]', text: 'In Stock', icon: <CheckCircleIcon className="w-4 h-4" /> };
  };

  const stockStatus = getStockStatus();

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glowing effect on hover */}
      <div className={`absolute -inset-2 bg-gradient-to-r ${categoryColors[sweet.category]} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
      
      {/* Main card */}
      <div className="relative bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E] backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl overflow-hidden">
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] opacity-20">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E]"></div>
        </div>
        
        {/* Sweet emoji background */}
        <div className="absolute top-4 right-4 text-6xl opacity-20 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
          {categoryEmoji[sweet.category] || '✨'}
        </div>

        <div className="relative">
          {/* Header with name and price */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${categoryColors[sweet.category]} flex items-center justify-center mr-3`}>
                  <span className="text-xl">{categoryEmoji[sweet.category]?.charAt(0) || '✨'}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{sweet.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${categoryColors[sweet.category]} text-white`}>
                      {sweet.category.charAt(0).toUpperCase() + sweet.category.slice(1)}
                    </span>
                    <div className="flex items-center ml-3">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={`w-4 h-4 ${
                          i < Math.min(Math.floor(sweet.price), 5) 
                            ? 'text-[#FFD700] fill-[#FFD700]' 
                            : 'text-gray-600'
                        }`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] bg-clip-text text-transparent animate-gradient-x">
                ${sweet.price.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400 mt-1">per unit</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 mb-8 text-lg leading-relaxed bg-gradient-to-r from-white/80 to-white/60 bg-clip-text text-transparent">
            {sweet.description}
          </p>

          {/* Stock information */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <CubeIcon className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-300 font-medium">Galactic Stock</span>
              </div>
              <div className="flex items-center">
                <div className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${stockStatus.color} text-white flex items-center`}>
                  {stockStatus.icon}
                  <span className="ml-2">{stockStatus.text}</span>
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${stockStatus.color} transition-all duration-1000 ease-out`}
                style={{ 
                  width: `${Math.min((sweet.quantity / 100) * 100, 100)}%`,
                  transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-400">0 units</span>
              <span className="text-lg font-bold text-white">
                {sweet.quantity} <span className="text-sm text-gray-400">units</span>
              </span>
              <span className="text-sm text-gray-400">100 units</span>
            </div>
          </div>

          {/* User actions */}
          {user && (
            <div className="space-y-4">
              {/* Purchase section */}
              <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <ShoppingCartIcon className="w-6 h-6 text-[#00C9A7] mr-2" />
                    <span className="text-white font-semibold">Purchase</span>
                  </div>
                  {sweet.quantity === 0 && (
                    <div className="flex items-center text-[#FF6B8B]">
                      <FireIcon className="w-5 h-5 mr-1" />
                      <span className="text-sm font-bold">SOLD OUT!</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max={sweet.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:border-[#00C9A7] focus:bg-white/10 focus:ring-2 focus:ring-[#00C9A7]/20 transition-all duration-300 text-white text-center font-bold"
                      disabled={sweet.quantity === 0}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                      units
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePurchase}
                    disabled={sweet.quantity === 0 || isPurchasing}
                    className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center ${
                      sweet.quantity === 0
                        ? 'bg-gradient-to-r from-gray-600/20 to-gray-600/10 text-gray-500 cursor-not-allowed border border-white/5'
                        : 'bg-gradient-to-r from-[#00C9A7] to-[#845EC2] text-white hover:shadow-xl hover:-translate-y-0.5'
                    } ${isPurchasing ? 'animate-pulse' : ''}`}
                  >
                    {isPurchasing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Purchasing...
                      </>
                    ) : (
                      <>
                        <ShoppingCartIcon className="w-5 h-5 mr-2" />
                        {sweet.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </>
                    )}
                  </button>
                </div>
                
                {sweet.quantity > 0 && (
                  <div className="mt-3 text-center">
                    <span className="text-sm text-gray-400">
                      Total: <span className="text-white font-bold">${(sweet.price * quantity).toFixed(2)}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Admin actions */}
              {isAdmin() && (
                <div className="space-y-4">
                  {/* Restock section */}
                  <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center mb-3">
                      <ArrowPathIcon className="w-6 h-6 text-[#845EC2] mr-2" />
                      <span className="text-white font-semibold">Restock</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          value={restockQuantity}
                          onChange={(e) => setRestockQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-24 px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl focus:border-[#845EC2] focus:bg-white/10 focus:ring-2 focus:ring-[#845EC2]/20 transition-all duration-300 text-white text-center font-bold"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                          units
                        </div>
                      </div>
                      
                      <button
                        onClick={handleRestock}
                        disabled={isRestocking}
                        className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-[#FF6B8B] to-[#845EC2] text-white hover:shadow-xl hover:-translate-y-0.5 ${isRestocking ? 'animate-pulse' : ''}`}
                      >
                        {isRestocking ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Restocking...
                          </>
                    ) : (
                          <>
                            <ArrowPathIcon className="w-5 h-5 mr-2" />
                            Restock
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Edit & Delete buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-[#00C9A7]/20 to-[#845EC2]/20 text-white hover:shadow-xl hover:-translate-y-0.5 border border-white/10 group"
                    >
                      <PencilIcon className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Edit
                    </button>
                    
                    <button
                      onClick={handleDelete}
                      className="px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-[#FF6B8B]/20 to-[#FF6B8B]/10 text-white hover:shadow-xl hover:-translate-y-0.5 border border-white/10 hover:border-[#FF6B8B]/30 group"
                    >
                      <TrashIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Non-user message */}
          {!user && (
            <div className="text-center py-6 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10">
              <SparklesIcon className="w-12 h-12 text-[#845EC2] mx-auto mb-3" />
              <p className="text-gray-300 mb-4">Login to purchase this cosmic delight!</p>
              <div className="text-sm text-gray-400">
                🚀 Explore our galaxy of sweets
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% auto;
        }
      `}</style>
    </div>
  );
};

export default SweetCard;