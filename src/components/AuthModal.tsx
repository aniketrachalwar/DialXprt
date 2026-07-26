import React, { useState } from 'react';
import { X, Phone, ShieldCheck, CheckCircle2, User, Crown, Store } from 'lucide-react';
import { UserRole } from '../types';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (phone: string, role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAuthStep('otp');
    }, 500);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      alert('Please enter the 4-digit SMS OTP code.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(phone, role);
      onClose();
    }, 500);
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess('9849012345', role);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#1A237E] text-white p-4 flex items-center justify-between">
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
              <span className="bg-white px-2 text-gray-400 font-bold">Or 10-Digit Mobile SMS</span>
            </div>
          </div>

          {authStep === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 font-bold text-gray-500">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9849012345"
                    className="w-full pl-12 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:outline-none font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="w-full bg-[#1A237E] hover:bg-indigo-900 text-white font-bold py-3 px-3 rounded-xl shadow min-h-[48px] disabled:opacity-50"
              >
                {loading ? 'Sending SMS OTP...' : 'Send OTP via SMS'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Enter 4-Digit OTP Code</label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="e.g. 1234"
                  className="w-full px-3 py-2.5 text-center text-lg font-black tracking-widest border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1A237E] focus:outline-none"
                />
                <p className="text-[10px] text-gray-500 mt-1 text-center">OTP sent to +91 {phone}</p>
              </div>

              <button
                type="submit"
                disabled={loading || !otp}
                className="w-full bg-[#F36F21] hover:bg-orange-600 text-white font-bold py-3 px-3 rounded-xl shadow min-h-[48px] disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP & Log In'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
