import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, EnvelopeIcon, UserIcon, ShieldCheckIcon, SparklesIcon, ArrowRightIcon, KeyIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
    adminCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoverState, setHoverState] = useState({});
  const [strength, setStrength] = useState(0);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Floating animation states
  const [floatPositions, setFloatPositions] = useState([]);
  
  // Initialize floating elements
  useEffect(() => {
    const positions = Array.from({ length: 15 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 30,
      speed: 1 + Math.random() * 2,
      delay: Math.random() * 5,
      emoji: ['🍬', '🍭', '🍫', '🧁', '🍰', '🎂', '🍪', '🧋', '🍩', '🥧'][Math.floor(Math.random() * 10)]
    }));
    setFloatPositions(positions);
  }, []);

  // Password strength checker
  useEffect(() => {
    const checkStrength = () => {
      let score = 0;
      if (formData.password.length >= 8) score += 1;
      if (/[A-Z]/.test(formData.password)) score += 1;
      if (/[0-9]/.test(formData.password)) score += 1;
      if (/[^A-Za-z0-9]/.test(formData.password)) score += 1;
      setStrength(score);
    };
    
    if (formData.password) checkStrength();
    else setStrength(0);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const getStrengthColor = (strength) => {
    if (strength === 0) return 'bg-gray-500';
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-yellow-500';
    if (strength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return 'Enter password';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', {
        style: {
          background: '#FF6B8B',
          color: '#fff',
        },
        icon: '❌'
      });
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters', {
        style: {
          background: '#FF6B8B',
          color: '#fff',
        },
        icon: '🔒'
      });
      return;
    }
    
    // Admin code validation
    if (formData.isAdmin && formData.adminCode !== 'ADMIN123') {
      toast.error('Invalid admin code', {
        style: {
          background: '#FF6B8B',
          color: '#fff',
        },
        icon: '🚫'
      });
      return;
    }
    
    setLoading(true);
    
    // Create registration data
    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.isAdmin ? 'admin' : 'user'
    };
    
    try {
      const result = await register(registrationData);
      
      if (result.success) {
        toast.success('🎉 Welcome to the Sweet Universe! Account created successfully!', {
          style: {
            background: '#00C9A7',
            color: '#fff',
          },
          icon: '✨'
        });
        setTimeout(() => navigate('/'), 1000);
      } else {
        toast.error(result.error || 'Registration failed. Please try again.', {
          style: {
            background: '#FF6B8B',
            color: '#fff',
          },
          icon: '⚠️'
        });
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.', {
        style: {
          background: '#FF6B8B',
          color: '#fff',
        },
        icon: '⚡'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00C9A7]/10 via-[#845EC2]/10 to-[#FF6B8B]/10 animate-gradient-xy"></div>
      
      {/* Floating candy elements */}
      {floatPositions.map((pos, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            fontSize: `${pos.size}px`,
            animation: `float ${8 + pos.speed}s ease-in-out infinite`,
            animationDelay: `${pos.delay}s`,
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
          }}
        >
          {pos.emoji}
        </div>
      ))}

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-[#00C9A7]/20 to-[#845EC2]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-[#FF6B8B]/20 to-[#00C9A7]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="max-w-lg w-full relative z-10">
        {/* Main card with glass effect */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/20 relative overflow-hidden">
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] opacity-30 animate-border-rotate">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E]"></div>
          </div>
          
          <div className="relative">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="relative inline-block mb-6">
                <div className="relative">
                  <div className="w-28 h-28 bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] rounded-full flex items-center justify-center mx-auto shadow-2xl animate-gradient-xy">
                    <span className="text-5xl">🌟</span>
                  </div>
                  {/* Glowing ring */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] rounded-full blur-xl opacity-30 animate-pulse"></div>
                  {/* Sparkles */}
                  <div className="absolute -top-4 -right-4">
                    <SparklesIcon className="w-10 h-10 text-[#FFD166] animate-spin-slow" />
                  </div>
                  <div className="absolute -bottom-4 -left-4">
                    <SparklesIcon className="w-8 h-8 text-[#00C9A7] animate-bounce" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] bg-clip-text text-transparent animate-gradient-x">
                  Join Sweet Universe
                </span>
              </h1>
              <p className="text-gray-300 text-lg font-light tracking-wide">
                Create your account and explore magical sweets
              </p>
            </div>

            {/* Registration form */}
            <form className="space-y-7" onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Name input */}
                <div className="group relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-300 group-focus-within:scale-110">
                    <UserIcon className="h-6 w-6 text-gray-400 group-focus-within:text-[#00C9A7] transition-colors duration-300" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    onMouseEnter={() => setHoverState({...hoverState, name: true})}
                    onMouseLeave={() => setHoverState({...hoverState, name: false})}
                    className="pl-14 w-full px-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#00C9A7] focus:bg-white/10 focus:ring-4 focus:ring-[#00C9A7]/20 transition-all duration-500 placeholder-gray-400 text-white text-lg font-medium backdrop-blur-sm"
                    placeholder="Your full name"
                  />
                  <label 
                    htmlFor="name" 
                    className="absolute -top-3 left-4 px-2 text-sm font-semibold text-gray-300 bg-gradient-to-r from-[#0F0F23] via-[#1A1A2E] to-[#16213E] transition-all duration-300"
                  >
                    Full Name *
                  </label>
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#00C9A7] to-[#845EC2] transition-all duration-500 ${hoverState.name ? 'w-full' : 'w-0'}`}></div>
                </div>

                {/* Email input */}
                <div className="group relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-300 group-focus-within:scale-110">
                    <EnvelopeIcon className="h-6 w-6 text-gray-400 group-focus-within:text-[#845EC2] transition-colors duration-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onMouseEnter={() => setHoverState({...hoverState, email: true})}
                    onMouseLeave={() => setHoverState({...hoverState, email: false})}
                    className="pl-14 w-full px-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#845EC2] focus:bg-white/10 focus:ring-4 focus:ring-[#845EC2]/20 transition-all duration-500 placeholder-gray-400 text-white text-lg font-medium backdrop-blur-sm"
                    placeholder="your@email.com"
                  />
                  <label 
                    htmlFor="email" 
                    className="absolute -top-3 left-4 px-2 text-sm font-semibold text-gray-300 bg-gradient-to-r from-[#0F0F23] via-[#1A1A2E] to-[#16213E] transition-all duration-300"
                  >
                    Email Address *
                  </label>
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#845EC2] to-[#FF6B8B] transition-all duration-500 ${hoverState.email ? 'w-full' : 'w-0'}`}></div>
                </div>

                {/* Password input */}
                <div className="group relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-300 group-focus-within:scale-110">
                    <LockClosedIcon className="h-6 w-6 text-gray-400 group-focus-within:text-[#FF6B8B] transition-colors duration-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onMouseEnter={() => setHoverState({...hoverState, password: true})}
                    onMouseLeave={() => setHoverState({...hoverState, password: false})}
                    className="pl-14 pr-14 w-full px-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#FF6B8B] focus:bg-white/10 focus:ring-4 focus:ring-[#FF6B8B]/20 transition-all duration-500 placeholder-gray-400 text-white text-lg font-medium backdrop-blur-sm"
                    placeholder="••••••••••"
                  />
                  <label 
                    htmlFor="password" 
                    className="absolute -top-3 left-4 px-2 text-sm font-semibold text-gray-300 bg-gradient-to-r from-[#0F0F23] via-[#1A1A2E] to-[#16213E] transition-all duration-300"
                  >
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('password')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-xl hover:bg-white/10 transition-all duration-300 group/eye"
                    onMouseEnter={() => setHoverState({...hoverState, eye1: true})}
                    onMouseLeave={() => setHoverState({...hoverState, eye1: false})}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-6 w-6 text-gray-400 group-hover/eye:text-[#845EC2] transition-colors duration-300" />
                    ) : (
                      <EyeIcon className="h-6 w-6 text-gray-400 group-hover/eye:text-[#845EC2] transition-colors duration-300" />
                    )}
                  </button>
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#FF6B8B] to-[#00C9A7] transition-all duration-500 ${hoverState.password ? 'w-full' : 'w-0'}`}></div>
                  
                  {/* Password strength indicator */}
                  {formData.password && (
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-300">Password strength</span>
                        <span className={`text-sm font-bold ${getStrengthColor(strength).replace('bg-', 'text-')}`}>
                          {getStrengthText(strength)}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                              level <= strength ? getStrengthColor(strength) : 'bg-gray-700'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password input */}
                <div className="group relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-300 group-focus-within:scale-110">
                    <ShieldCheckIcon className="h-6 w-6 text-gray-400 group-focus-within:text-[#00C9A7] transition-colors duration-300" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onMouseEnter={() => setHoverState({...hoverState, confirmPassword: true})}
                    onMouseLeave={() => setHoverState({...hoverState, confirmPassword: false})}
                    className="pl-14 pr-14 w-full px-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#00C9A7] focus:bg-white/10 focus:ring-4 focus:ring-[#00C9A7]/20 transition-all duration-500 placeholder-gray-400 text-white text-lg font-medium backdrop-blur-sm"
                    placeholder="••••••••••"
                  />
                  <label 
                    htmlFor="confirmPassword" 
                    className="absolute -top-3 left-4 px-2 text-sm font-semibold text-gray-300 bg-gradient-to-r from-[#0F0F23] via-[#1A1A2E] to-[#16213E] transition-all duration-300"
                  >
                    Confirm Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-xl hover:bg-white/10 transition-all duration-300 group/eye"
                    onMouseEnter={() => setHoverState({...hoverState, eye2: true})}
                    onMouseLeave={() => setHoverState({...hoverState, eye2: false})}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-6 w-6 text-gray-400 group-hover/eye:text-[#845EC2] transition-colors duration-300" />
                    ) : (
                      <EyeIcon className="h-6 w-6 text-gray-400 group-hover/eye:text-[#845EC2] transition-colors duration-300" />
                    )}
                  </button>
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#00C9A7] to-[#845EC2] transition-all duration-500 ${hoverState.confirmPassword ? 'w-full' : 'w-0'}`}></div>
                  
                  {/* Password match indicator */}
                  {formData.confirmPassword && (
                    <div className="mt-2">
                      <div className={`flex items-center text-sm ${formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                        {formData.password === formData.confirmPassword ? (
                          <>
                            <ShieldCheckIcon className="w-4 h-4 mr-1" />
                            Passwords match
                          </>
                        ) : (
                          <>
                            <span className="mr-1">⚠️</span>
                            Passwords don't match
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Admin Registration Section */}
                <div className="pt-6 mt-6 border-t border-white/10 relative group/admin">
                  <div className="flex items-center mb-4 group/checkbox cursor-pointer">
                    <div className="relative">
                      <input
                        id="isAdmin"
                        name="isAdmin"
                        type="checkbox"
                        checked={formData.isAdmin}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className="w-6 h-6 border-2 border-gray-400 rounded-md peer-checked:border-[#FF6B8B] peer-checked:bg-[#FF6B8B] transition-all duration-300 flex items-center justify-center group-hover/checkbox:border-[#FF6B8B]">
                        <svg className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <label htmlFor="isAdmin" className="ml-3 text-gray-300 font-medium cursor-pointer group-hover/checkbox:text-white transition-colors duration-300 flex items-center">
                      <KeyIcon className="w-5 h-5 mr-2 text-[#FF6B8B]" />
                      Register as Admin
                    </label>
                  </div>

                  {formData.isAdmin && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-[#FF6B8B]/10 to-[#845EC2]/10 rounded-2xl border border-white/10 animate-fadeIn">
                      <div className="group relative mb-6">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-300 group-focus-within:scale-110">
                          <span className="text-xl">🔑</span>
                        </div>
                        <input
                          id="adminCode"
                          name="adminCode"
                          type="text"
                          value={formData.adminCode}
                          onChange={handleChange}
                          required={formData.isAdmin}
                          className="pl-14 w-full px-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#FF6B8B] focus:bg-white/10 focus:ring-4 focus:ring-[#FF6B8B]/20 transition-all duration-500 placeholder-gray-400 text-white text-lg font-medium backdrop-blur-sm"
                          placeholder="Enter admin code"
                        />
                        <label 
                          htmlFor="adminCode" 
                          className="absolute -top-3 left-4 px-2 text-sm font-semibold text-gray-300 bg-gradient-to-r from-[#0F0F23] via-[#1A1A2E] to-[#16213E] transition-all duration-300"
                        >
                          Admin Code *
                        </label>
                        <div className="mt-2 text-sm text-gray-400">
                          <p className="flex items-center">
                            <span className="mr-2">💡</span>
                            Use admin code: <span className="ml-2 font-bold text-[#FF6B8B] tracking-wider">ADMIN123</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-[#FF6B8B]/20 to-[#845EC2]/20 rounded-xl p-4 border border-white/10">
                        <div className="flex items-start">
                          <div className="mr-3 mt-1">
                            <span className="text-2xl">👑</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-white mb-1">Admin Privileges</h4>
                            <ul className="text-gray-300 text-sm space-y-1">
                              <li className="flex items-center">
                                <span className="w-2 h-2 bg-[#00C9A7] rounded-full mr-2"></span>
                                Add, edit, and delete sweets
                              </li>
                              <li className="flex items-center">
                                <span className="w-2 h-2 bg-[#845EC2] rounded-full mr-2"></span>
                                Restock inventory
                              </li>
                              <li className="flex items-center">
                                <span className="w-2 h-2 bg-[#FF6B8B] rounded-full mr-2"></span>
                                Full system access
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className={`relative w-full py-5 px-6 rounded-2xl font-bold text-white shadow-2xl transform transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] ${
                  loading
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] hover:shadow-[0_0_40px_rgba(0,201,167,0.3)]'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    <span className="text-xl tracking-wider">Creating Your Universe...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="text-2xl mr-3">🚀</span>
                    <span className="text-xl tracking-wider">
                      {formData.isAdmin ? 'Launch Admin Account' : 'Launch Into Sweet Universe'}
                    </span>
                    <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                )}
                {/* Shimmer effect */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </button>
            </form>

            {/* Login link */}
            <div className="mt-10 text-center">
              <p className="text-gray-400 text-lg">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] hover:from-[#00C9A7] hover:via-[#845EC2] hover:to-[#FF6B8B] transition-all duration-300 relative group/login"
                >
                  Enter Sweet Universe
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] group-hover/login:w-full transition-all duration-500"></span>
                </Link>
              </p>
              <p className="mt-4 text-gray-500 text-sm tracking-wide">
                Join thousands exploring sweet wonders every day 🌌
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm tracking-wider">
            By registering, you agree to our{' '}
            <Link to="/terms" className="text-[#00C9A7] hover:text-[#00E6B8] font-medium transition-colors duration-300">
              Terms of Wonder
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-[#845EC2] hover:text-[#9A7AD4] font-medium transition-colors duration-300">
              Privacy Galaxy
            </Link>
          </p>
        </div>
      </div>

      {/* Add custom animations to CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }
        
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes border-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-gradient-xy {
          animation: gradient-xy 15s ease infinite;
          background-size: 400% 400%;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% auto;
        }
        
        .animate-border-rotate {
          animation: border-rotate 20s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Register;