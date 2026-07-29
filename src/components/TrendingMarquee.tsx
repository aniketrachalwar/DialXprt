import React from 'react';
import { Flame } from 'lucide-react';

const TRENDING_ITEMS = [
  "🔥 Trending: AC Repair in Madhapur",
  "⚡ 50+ Electricians just registered!",
  "🎉 Book Party Halls at 20% off",
  "✈️ Lowest Airfares to Dubai",
  "🏠 Top Real Estate Agents in Jubilee Hills",
  "💅 Premium Spas with discounts today",
];

export const TrendingMarquee = () => {
  return (
    <div className="bg-indigo-50 border-y border-indigo-100 py-2 overflow-hidden flex items-center shadow-inner">
      <div className="px-3 md:px-4 bg-indigo-50 z-10 flex items-center gap-1 border-r border-indigo-200">
        <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
        <span className="text-xs font-bold text-indigo-900 whitespace-nowrap">LIVE</span>
      </div>
      
      {/* Marquee Container */}
      <div className="flex-1 overflow-hidden relative flex">
        <div className="animate-marquee whitespace-nowrap flex gap-8 pl-4 items-center">
          {TRENDING_ITEMS.map((item, idx) => (
            <span key={`first-${idx}`} className="text-xs font-medium text-gray-700">
              {item}
            </span>
          ))}
          {/* Duplicate for seamless infinite loop */}
          {TRENDING_ITEMS.map((item, idx) => (
            <span key={`second-${idx}`} className="text-xs font-medium text-gray-700">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
