import React, { useState } from 'react';
import { X, Phone, ShieldCheck, CheckCircle2, User, Crown, Store } from 'lucide-react';
import { UserRole } from '../types';
import { Logo } from './Logo';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (phone: string, role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [authStep, setAuthStep] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(email, role);
      onClose();
    }, 800);
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    if (provider === 'google') {
      if (isSupabaseConfigured && supabase) {
        try {
          setLoading(true);
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin
            }
          });
          if (error) throw error;
        } catch (error: any) {
          console.error('Google Auth Error:', error.message);
          alert(`Google login failed: ${error.message}`);
          setLoading(false);
        }
      } else {
        alert('Google Authentication requires Supabase to be configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file!');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0F5C5C] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo variant="white" size="sm" />
          </div>
          <button onClick={onClose} className="text-indigo-200 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-gray-800">
          {/* Account Role Selector */}
          <div>
            <label className="block font-bold text-gray-700 mb-1.5">Select Account Type:</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-2 px-2 rounded-xl border text-center font-bold flex items-center justify-center gap-1.5 ${
                  role === 'customer'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-500'
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('vendor')}
                className={`py-2 px-2 rounded-xl border text-center font-bold flex items-center justify-center gap-1.5 ${
                  role === 'vendor'
                    ? 'bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-500'
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Shop Owner</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('volunteer')}
                className={`py-2 px-2 rounded-xl border text-center font-bold flex items-center justify-center gap-1.5 ${
                  role === 'volunteer'
                    ? 'bg-amber-50 border-amber-600 text-amber-900 ring-1 ring-amber-500'
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Volunteer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-2 rounded-xl border text-center font-bold flex items-center justify-center gap-1.5 ${
                  role === 'admin'
                    ? 'bg-purple-50 border-purple-600 text-purple-900 ring-1 ring-purple-500'
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Social Auth Options */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all min-h-[44px]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-2 text-gray-400 font-bold">Or Email Address</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {authStep === 'register' && (
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none"
                />
              </div>
            )}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-[#0F5C5C] hover:bg-teal-700 text-white font-bold py-3 px-3 rounded-xl shadow min-h-[48px] disabled:opacity-50 mt-2"
            >
              {loading ? 'Processing...' : authStep === 'register' ? 'Create Account' : 'Sign In'}
            </button>
            
            <div className="text-center mt-2">
              <button 
                type="button" 
                onClick={() => setAuthStep(authStep === 'login' ? 'register' : 'login')}
                className="text-[#F36F21] hover:underline font-bold"
              >
                {authStep === 'login' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
