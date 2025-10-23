// ============================================
// REGISTER PAGE
// ============================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setLoading, setError } from '../redux/slices/authSlice';
import { Mail, Lock, Loader2, UserPlus, User, LogIn } from 'lucide-react';
const apiUrl = import.meta.env.VITE_API_URL;
const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoading());
    try {
      const res = await axios.post(
        `${apiUrl}/api/auth/register`,
        { username, email, password }
      );
      console.log({ res });
      dispatch(setCredentials(res.data));
      navigate('/');
    } catch (err) {
      dispatch(setError(err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3] flex items-center justify-center px-6 overflow-hidden">
      <div className="w-full max-w-md">
        <div className="bg-[#FFF8F0] rounded-2xl shadow-2xl overflow-hidden border-2 border-[#8B4049]/10">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#8B4049] to-[#6B3039] px-6 py-6 text-center">
            <div className="w-16 h-16 bg-[#FFF8F0] rounded-full mx-auto mb-3 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-[#8B4049]" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#FFF8F0] mb-1">
              Join Us Today
            </h1>
            <p className="text-[#FFF8F0] text-sm opacity-90">
              Create an account to start ordering
            </p>
          </div>

          {/* Form Container */}
          <div className="px-6 py-6">
            {error && (
              <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-xs font-semibold text-center">{error}</p>
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-[#8B4049] font-semibold mb-1.5 text-xs uppercase tracking-wide">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-[#8B4049]/50" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 border-2 border-[#8B4049]/20 rounded-lg focus:outline-none focus:border-[#8B4049] transition-colors bg-white text-[#8B4049] placeholder-gray-400 text-sm"
                    placeholder="johndoe"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-[#8B4049] font-semibold mb-1.5 text-xs uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-[#8B4049]/50" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 border-2 border-[#8B4049]/20 rounded-lg focus:outline-none focus:border-[#8B4049] transition-colors bg-white text-[#8B4049] placeholder-gray-400 text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[#8B4049] font-semibold mb-1.5 text-xs uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-[#8B4049]/50" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 border-2 border-[#8B4049]/20 rounded-lg focus:outline-none focus:border-[#8B4049] transition-colors bg-white text-[#8B4049] placeholder-gray-400 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8B4049] text-[#FFF8F0] py-3 rounded-lg font-bold hover:bg-[#6B3039] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-[#8B4049]/20"></div>
              <span className="px-3 text-xs text-gray-500">or</span>
              <div className="flex-1 border-t border-[#8B4049]/20"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600 text-xs mb-2">Already have an account?</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-[#FFF8F0] text-[#8B4049] py-2.5 rounded-lg font-semibold border-2 border-[#8B4049] hover:bg-[#8B4049] hover:text-[#FFF8F0] transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <LogIn className="w-4 h-4" />
                Login to Your Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;