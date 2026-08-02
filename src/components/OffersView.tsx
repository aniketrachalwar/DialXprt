import React from 'react';
import { Tag, Sparkles, Clock } from 'lucide-react';

export const OffersView: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      <div className="bg-[#1a237e] text-white px-4 py-6 rounded-b-[2rem] shadow-sm">
        <h1 className="text-2xl font-extrabold flex items-center gap-2 mt-4">
          <Tag className="w-6 h-6" /> Exclusive Offers
        </h1>
        <p className="text-indigo-200 text-sm mt-1">Discounts & promotions just for you</p>
      </div>

      <div className="p-4 space-y-6 mt-2">
        {/* Banner 1 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-400 to-[#F36F21] p-5 sm:p-6 shadow-md text-white flex items-center justify-between">
          <div className="absolute right-0 top-0 opacity-20 transform translate-x-1/4 -translate-y-1/4">
            <Sparkles className="w-24 h-24" />
          </div>
          
          <div className="relative z-10">
            <span className="bg-white text-[#F36F21] text-[10px] font-extrabold uppercase px-2 py-1 rounded-full mb-2 inline-block">Limited Time</span>
            <h2 className="text-xl sm:text-2xl font-extrabold mb-1">Flat 20% OFF</h2>
            <p className="text-sm text-orange-50 mb-3 font-medium">On your first AC Repair service.</p>
            <button className="bg-white text-[#F36F21] font-bold text-sm px-4 py-2 rounded-xl shadow-sm hover:bg-orange-50 transition active:scale-95">
              Claim Now
            </button>
          </div>
          
          <div className="relative z-10 hidden sm:block">
            <img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=150" alt="AC Repair" className="w-20 h-20 rounded-full border-2 border-white object-cover shadow-sm" />
          </div>
        </div>

        {/* Banner 2 */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm flex">
          <div className="w-1/3 min-h-[120px]">
            <img src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=200" alt="Electrician" className="w-full h-full object-cover" />
          </div>
          <div className="w-2/3 p-4 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">Need Emergency Repair?</h3>
            <p className="text-xs text-gray-500 mb-3">Get verified experts in 30 mins.</p>
            <div className="flex items-center justify-between">
              <span className="text-[#1A9E9E] font-extrabold text-sm">Save ₹100</span>
              <button className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95">Book Now</button>
            </div>
          </div>
        </div>

        {/* Banner 3 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 p-5 sm:p-6 shadow-md text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-extrabold mb-1">Wedding Special</h2>
              <p className="text-sm text-purple-200">Up to 30% off on Caterers & Venues</p>
            </div>
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 flex justify-between items-center border border-white/20">
            <span className="font-mono font-bold tracking-widest text-lg">DIALWED30</span>
            <button className="bg-white text-purple-700 text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95">Copy Code</button>
          </div>
        </div>
      </div>
    </div>
  );
};
