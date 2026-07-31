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
  const [authStep, setAuthStep] = useState<'otp' | 'email_login' | 'email_register'>('otp');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
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

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      alert('Please enter your phone number.');
      return;
    }
    setLoading(true);
    if (!showOtpInput) {
      // Simulate sending OTP
      setTimeout(() => {
        setLoading(false);
        setShowOtpInput(true);
        alert('OTP sent! (Use 123456 to test)');
      }, 1000);
    } else {
      // Simulate verifying OTP
      setTimeout(() => {
        setLoading(false);
        if (otp === '123456') {
          onLoginSuccess(phone, role);
          onClose();
        } else {
          alert('Invalid OTP. Try 123456');
        }
      }, 800);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    if (provider === 'google') {
      if (isSupabaseConfigured && supabase) {
        try {
          setLoading(true);
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
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
          
          {authStep === 'otp' && (
            <div className="space-y-4">
              <form onSubmit={handleOtpSubmit} className="space-y-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mobile Number</label>
                  <div className="flex bg-white border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                    <span className="bg-gray-50 text-gray-500 font-medium px-3 py-2.5 border-r border-gray-300 flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10 digit number"
                      maxLength={10}
                      className="w-full px-3 py-2.5 text-sm focus:outline-none"
                      disabled={showOtpInput}
                    />
                  </div>
                </div>

                {showOtpInput && (
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Enter OTP</label>
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="6-digit OTP"
                      maxLength={6}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-center tracking-widest font-bold"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !phone || (showOtpInput && otp.length < 6)}
                  className="w-full bg-[#1E2875] hover:bg-indigo-900 text-white font-bold py-3 px-3 rounded-xl shadow min-h-[48px] disabled:opacity-50 mt-2"
                >
                  {loading ? 'Processing...' : showOtpInput ? 'Verify & Login' : 'Get OTP'}
                </button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white px-2 text-gray-400 font-bold">Or Continue With</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all min-h-[44px]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthStep('email_login')}
                  className="w-full text-indigo-600 hover:text-indigo-800 font-semibold py-2 text-center text-xs"
                >
                  Use Email & Password Instead
                </button>
              </div>
            </div>
          )}

          {authStep !== 'otp' && (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {authStep === 'email_register' && (
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-[#1E2875] hover:bg-indigo-900 text-white font-bold py-3 px-3 rounded-xl shadow min-h-[48px] disabled:opacity-50 mt-2"
              >
                {loading ? 'Processing...' : authStep === 'email_register' ? 'Create Account' : 'Sign In'}
              </button>
              
              <div className="text-center mt-2 space-y-2 flex flex-col">
                <button 
                  type="button" 
                  onClick={() => setAuthStep(authStep === 'email_login' ? 'email_register' : 'email_login')}
                  className="text-orange-600 hover:underline font-bold"
                >
                  {authStep === 'email_login' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setAuthStep('otp')}
                  className="text-gray-500 hover:text-gray-700 font-medium"
                >
                  Back to Mobile Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
