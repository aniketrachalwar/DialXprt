import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';
import { Logo } from './Logo';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string, role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [authStep, setAuthStep] = useState<'social_first' | 'email_login' | 'email_register'>('social_first');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
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
          <button onClick={onClose} className="text-teal-100 hover:text-white p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-sm text-gray-800">
          
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-gray-900">Welcome to DialXprt</h2>
            <p className="text-gray-500 font-medium text-xs">Join our community of local experts.</p>
          </div>

          {/* Social First View */}
          {authStep === 'social_first' && (
            <div className="space-y-4 pt-2">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="text-[15px]">Continue with Google</span>
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-400 font-bold tracking-wider">Or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAuthStep('email_login')}
                className="w-full bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold py-3.5 px-4 rounded-xl transition-all"
              >
                Continue with Email
              </button>
            </div>
          )}

          {/* Email View */}
          {authStep !== 'social_first' && (
            <div className="animate-fade-in">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {authStep === 'email_register' && (
                  <div>
                    <label className="block font-bold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Rahul Sharma"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-gray-50 focus:bg-white transition-colors"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5 text-xs uppercase tracking-wide">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full bg-[#0F5C5C] hover:bg-teal-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md min-h-[52px] disabled:opacity-50 mt-4 transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : authStep === 'email_register' ? 'Create Account' : 'Sign In'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
              
              <div className="text-center mt-5 space-y-4 flex flex-col">
                <button 
                  type="button" 
                  onClick={() => setAuthStep(authStep === 'email_login' ? 'email_register' : 'email_login')}
                  className="text-teal-700 hover:text-teal-900 font-bold"
                >
                  {authStep === 'email_login' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setAuthStep('social_first')}
                  className="text-gray-400 hover:text-gray-600 font-medium text-xs underline underline-offset-2"
                >
                  Back to Social Login
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
