import React from 'react';
import { Plane, Bus, Train, Building, Car } from 'lucide-react';

export const TravelBookings = ({ onSelectCategory }: { onSelectCategory: (slug: string) => void }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="md:max-w-xs">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Travel Bookings</h3>
        <p className="text-xs text-gray-500 mb-3">Instant ticket bookings for your best travel experience</p>
        <button className="text-[#1A9E9E]lue-600 text-xs font-bold hover:underline">Explore More</button>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0 flex-1 justify-start md:justify-around">
        <TravelCard icon={<Plane className="w-8 h-8 text-[#1A9E9E]lue-600" />} title="Flight" subtitle="Powered By Easemytrip.com" onClick={() => onSelectCategory('travel')} />
        <TravelCard icon={<Bus className="w-8 h-8 text-red-500" />} title="Bus" subtitle="Affordable Rides" onClick={() => onSelectCategory('travel')} />
        <TravelCard icon={<Train className="w-8 h-8 text-indigo-500" />} title="Train" onClick={() => onSelectCategory('travel')} />
        <TravelCard icon={<Building className="w-8 h-8 text-pink-500" />} title="Hotel" subtitle="Budget-friendly Stay" onClick={() => onSelectCategory('travel')} />
        <TravelCard icon={<Car className="w-8 h-8 text-[#1A9E9E]lue-500" />} title="Car Rentals" subtitle="Drive Easy Anywhere" onClick={() => onSelectCategory('rent')} />
      </div>
    </div>
  );
};

const TravelCard = ({ icon, title, subtitle, onClick }: { icon: React.ReactNode, title: string, subtitle?: string, onClick: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-3 min-w-[80px] shrink-0 group">
    <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex justify-center items-center group-hover:border-[#1A9E9E]lue-300 transition-colors shadow-sm">
      <div className="group-hover:-translate-y-1 transition-transform">
        {icon}
      </div>
    </div>
    <div className="text-center">
      <h4 className="font-bold text-sm text-gray-800">{title}</h4>
      {subtitle && <p className="text-[9px] text-green-600 font-medium leading-tight mt-1 max-w-[70px] mx-auto">{subtitle}</p>}
    </div>
  </button>
);
