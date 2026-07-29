import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Zap } from 'lucide-react';
import { Vendor } from '../types';

interface GetBestDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
  customerName: string;
  customerPhone: string;
  onSubmit: (vendorId: string, requirement: string, phone: string) => void;
}

export const GetBestDealModal: React.FC<GetBestDealModalProps> = ({
  isOpen,
  onClose,
  vendor,
  customerName,
  customerPhone,
  onSubmit,
}) => {
  const [requirement, setRequirement] = useState('');
  const [phone, setPhone] = useState(customerPhone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhone(customerPhone || '');
    }
  }, [isOpen, customerPhone]);

  if (!isOpen || !vendor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirement || !phone) return;

    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onSubmit(vendor.id, requirement, phone);
      
      // Close after showing success message
      setTimeout(() => {
        setIsSuccess(false);
        setRequirement('');
        onClose();
      }, 2500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-[28px] sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-up sm:animate-fade-in pb-safe sm:pb-0">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F5C5C] to-[#1A9E9E] text-white p-4 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="font-bold text-lg">Get Best Deal</h2>
            <p className="text-xs text-indigo-200">from {vendor.name}</p>
          </div>
          <button onClick={onClose} className="p-1 text-indigo-200 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-black text-xl text-gray-900">Request Sent!</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Your requirement has been sent to <b>{vendor.name}</b> and 2 other top-rated {vendor.category} experts in your area. They will contact you shortly!
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">What exactly do you need?</label>
                <textarea
                  required
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder={`e.g., I need ${vendor.category} service urgently today...`}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none text-sm resize-none"
                  rows={4}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Confirm Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 font-bold text-gray-500">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0F5C5C] focus:outline-none font-bold bg-gray-50"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Experts will contact you on this number to provide quotes.</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !requirement || phone.length < 10}
                className="w-full bg-[#F36F21] hover:bg-orange-600 text-white font-black py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 text-lg"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Sending Request...</span>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-white" />
                    Send Request Now
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
