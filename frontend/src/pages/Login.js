import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, EnvelopeIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoverState, setHoverState] = useState({});
  const { login } = useAuth();
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
      emoji: ['🍬', '🍭', '🍫', '🧁', '🍰', '🎂', '🍪', '🧋'][Math.floor(Math.random() * 8)]
    }));
    setFloatPositions(positions);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields', {
        style: {
          background: '#FF6B8B',
          color: '#fff',
        },
        icon: '❌'
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('🎉 Welcome to Sweet Paradise!', {
          style: {
            background: '#00C9A7',
            color: '#fff',
          },
          icon: '✨'
        });
        setTimeout(() => navigate('/'), 800);
      } else {
        toast.error(result.error || 'Login failed. Please check your credentials.', {
          style: {
            background: '#FF6B8B',
            color: '#fff',
          },
          icon: '🔒'
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

      <div className="max-w-md w-full relative z-10">
        {/* Main card with glass effect */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/20 relative overflow-hidden">
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] opacity-30 animate-border-rotate">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E]"></div>
          </div>
          
          <div className="relative">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="relative inline-block mb-6">
                <div className="relative">
                  <div className="w-28 h-28 bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] rounded-full flex items-center justify-center mx-auto shadow-2xl animate-gradient-xy">
                    <span className="text-5xl">🍯</span>
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
                  Sweet Universe
                </span>
              </h1>
              <p className="text-gray-300 text-lg font-light tracking-wide">
                Enter your magical sweet haven
              </p>
            </div>

            {/* Login form */}
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Email input */}
                <div className="group relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-300 group-focus-within:scale-110">
                    <EnvelopeIcon className="h-6 w-6 text-gray-400 group-focus-within:text-[#00C9A7] transition-colors duration-300" />
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
                    className="pl-14 w-full px-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-[#00C9A7] focus:bg-white/10 focus:ring-4 focus:ring-[#00C9A7]/20 transition-all duration-500 placeholder-gray-400 text-white text-lg font-medium backdrop-blur-sm"
                    placeholder="your@email.com"
                  />
                  <label 
                    htmlFor="email" 
                    className="absolute -top-3 left-4 px-2 text-sm font-semibold text-gray-300 bg-gradient-to-r from-[#0F0F23] via-[#1A1A2E] to-[#16213E] transition-all duration-300"
                  >
                    Email Address
                  </label>
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#00C9A7] to-[#845EC2] transition-all duration-500 ${hoverState.email ? 'w-full' : 'w-0'}`}></div>
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
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-xl hover:bg-white/10 transition-all duration-300 group/eye"
                    onMouseEnter={() => setHoverState({...hoverState, eye: true})}
                    onMouseLeave={() => setHoverState({...hoverState, eye: false})}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-6 w-6 text-gray-400 group-hover/eye:text-[#845EC2] transition-colors duration-300" />
                    ) : (
                      <EyeIcon className="h-6 w-6 text-gray-400 group-hover/eye:text-[#845EC2] transition-colors duration-300" />
                    )}
                  </button>
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#845EC2] to-[#FF6B8B] transition-all duration-500 ${hoverState.password ? 'w-full' : 'w-0'}`}></div>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between">
                <div className="flex items-center group/remember cursor-pointer">
                  <div className="relative">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-gray-400 rounded-md peer-checked:border-[#00C9A7] peer-checked:bg-[#00C9A7] transition-all duration-300 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <label htmlFor="remember-me" className="ml-3 text-gray-300 font-medium cursor-pointer group-hover/remember:text-white transition-colors duration-300">
                    Remember me
                  </label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="text-[#FF6B8B] hover:text-[#FF8BA7] font-semibold transition-colors duration-300 relative group/forgot"
                >
                  Forgot password?
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF6B8B] to-[#FF8BA7] group-hover/forgot:w-full transition-all duration-300"></span>
                </Link>
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
                    <span className="text-xl tracking-wider">Unlocking Sweet Paradise...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="text-2xl mr-3">✨</span>
                    <span className="text-xl tracking-wider">Enter Sweet Universe</span>
                    <ArrowRightIcon className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                )}
                {/* Shimmer effect */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E] text-gray-400 text-sm font-medium tracking-wider">
                  CONTINUE WITH
                </span>
              </div>
            </div>

            {/* Social login */}
            <div className="grid grid-cols-2 gap-4">
              <button className="group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-4 px-4 transition-all duration-300 hover:border-[#00C9A7]/30">
                <div className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-semibold text-white">Google</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#4285F4]/0 via-[#4285F4]/10 to-[#4285F4]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
              
              <button className="group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-4 px-4 transition-all duration-300 hover:border-[#845EC2]/30">
                <div className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" fill="white" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="font-semibold text-white">GitHub</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#845EC2]/0 via-[#845EC2]/10 to-[#845EC2]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </div>

            {/* Registration link */}
            <div className="mt-12 text-center">
              <p className="text-gray-400 text-lg">
                New to the universe?{' '}
                <Link 
                  to="/register" 
                  className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] hover:from-[#00C9A7] hover:via-[#845EC2] hover:to-[#FF6B8B] transition-all duration-300 relative group/register"
                >
                  Create your galaxy account
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00C9A7] via-[#845EC2] to-[#FF6B8B] group-hover/register:w-full transition-all duration-500"></span>
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
            By entering, you agree to our{' '}
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
      `}</style>
    </div>
  );
};

export default Login;