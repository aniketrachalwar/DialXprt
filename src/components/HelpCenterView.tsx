import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Search, ChevronDown, MessageSquare, Headphones, FileText, Settings } from 'lucide-react';

interface HelpCenterViewProps {
  onBack: () => void;
  onNavigateToCustomerService: () => void;
}

export const HelpCenterView: React.FC<HelpCenterViewProps> = ({ onBack, onNavigateToCustomerService }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      q: "How do I list my business on DialXprt?",
      a: "Listing your business is completely free! Just tap the 'List Business' button at the top right of the screen or in the bottom navigation menu, fill in your shop details, and submit. Our volunteer team will review it shortly."
    },
    {
      q: "What does the 'Verified' badge mean?",
      a: "The Verified badge means one of our local volunteers has physically or digitally verified the existence and contact details of the business. This ensures you are connecting with genuine local experts."
    },
    {
      q: "Is DialXprt free to use?",
      a: "Yes! DialXprt is a 100% free platform for both customers looking for services and vendors listing their businesses. We do not charge any commission."
    },
    {
      q: "How do I leave a review?",
      a: "Currently, reviews are collected internally by our volunteer team to ensure authenticity. In the future, you will be able to leave reviews directly on a vendor's profile page."
    },
    {
      q: "How can I update my business details?",
      a: "You can update your business details by logging in with your registered phone number, going to the 'Account' tab, and selecting 'Edit My Business Profile'."
    }
  ];

  const categories = [
    { icon: FileText, label: 'Getting Started', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Settings, label: 'Account Settings', color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: MessageSquare, label: 'Vendor Guide', color: 'text-emerald-500', bg: 'bg-emerald-50' }
  ];

  return (
    <div className="bg-[#F4F7FA] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-b-[40px] pb-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="flex items-center px-4 py-4 max-w-lg mx-auto gap-3 relative z-10">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 text-white/80 hover:bg-white/10 rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-black flex items-center gap-2">
            Help Center
          </h1>
        </div>

        <div className="max-w-lg mx-auto px-6 mt-2 relative z-10">
          <h2 className="text-2xl font-black mb-4">How can we help you today?</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for articles or questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-teal-500/30 shadow-lg font-medium"
            />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6 mt-4">
        
        {/* Quick Categories */}
        <div className="grid grid-cols-3 gap-3">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <button key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:border-teal-200 transition-colors active:scale-95 text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${cat.bg} ${cat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-gray-700">{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Top Articles / FAQ */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-teal-500" />
            <h2 className="font-bold text-gray-900">Popular Questions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white">
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800 text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === idx ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support Prompt */}
        <div className="bg-teal-50 border border-teal-100 rounded-3xl p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-teal-600">
            <Headphones className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Still need help?</h3>
            <p className="text-sm text-gray-600 mt-1">Our support team is available 24/7 to assist you.</p>
          </div>
          <button 
            onClick={onNavigateToCustomerService}
            className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl active:scale-95 transition-all shadow-md hover:bg-teal-700"
          >
            Contact Customer Service
          </button>
        </div>

      </div>
    </div>
  );
};
