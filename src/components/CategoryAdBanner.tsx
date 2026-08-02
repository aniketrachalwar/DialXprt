import React from 'react';
import { PhoneCall } from 'lucide-react';
import { Category } from '../types';

interface CategoryAdBannerProps {
  selectedCategory: string;
  categories: Category[];
}

// Mock database of top sponsored vendors per category for these banners
const CATEGORY_ADS: Record<string, { name: string; address: string; phone: string; image: string; tagLine: string }> = {
  'electricians': {
    name: 'Manikanta Electrical Works',
    address: 'Begumpet, Hyderabad',
    phone: '9848012345',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=200',
    tagLine: 'Trusted Electricians'
  },
  'plumber': {
    name: 'Balaji Plumbing Services',
    address: 'Ameerpet, Hyderabad',
    phone: '9848054321',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=200',
    tagLine: 'Expert Plumbers'
  },
  'ac-repair': {
    name: 'Cool Breeze AC Repair',
    address: 'Madhapur, Hyderabad',
    phone: '9848098765',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=200',
    tagLine: 'AC Servicing Experts'
  },
  'default': {
    name: 'DialXprt Premium Service',
    address: 'Hyderabad',
    phone: '9848000000',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=200',
    tagLine: 'Top Rated Professional'
  }
};

export const CategoryAdBanner: React.FC<CategoryAdBannerProps> = ({ selectedCategory, categories }) => {
  return null; // Disabled in production until dynamic ads are implemented


  const adData = CATEGORY_ADS[selectedCategory] || CATEGORY_ADS['default'];
  const categoryObj = categories.find(c => c.slug === selectedCategory);
  const categoryName = categoryObj ? categoryObj.name : selectedCategory;

  return (
    <div className="w-full bg-[#CD853F] rounded-xl overflow-hidden shadow-sm flex items-center relative mb-4">
      {/* Decorative background shape */}
      <div className="absolute left-24 top-0 bottom-0 w-16 bg-white/10 skew-x-12"></div>
      
      {/* Image container with custom wavy border effect (simulated with border-radius) */}
      <div className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 relative z-10 bg-white">
        <img 
          src={adData.image} 
          alt={adData.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-y-0 right-0 w-4 bg-[#CD853F] rounded-l-full translate-x-2"></div>
      </div>
      
      {/* Content */}
      <div className="flex-1 py-3 px-4 sm:px-6 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-gray-900">
          <h3 className="font-black text-sm sm:text-cyan-500ase leading-tight">{adData.name}</h3>
          <p className="text-xs font-medium mt-1 text-gray-900/80">{adData.address}</p>
        </div>
        
        {/* Call Button */}
        <a 
          href={`tel:${adData.phone}`}
          className="bg-[#FFD700] hover:bg-yellow-400 text-gray-900 font-bold px-4 py-1.5 rounded-lg text-sm flex items-center gap-1.5 w-fit shrink-0 shadow-sm transition-colors"
        >
          <PhoneCall className="w-4 h-4" />
          Call
        </a>
      </div>
    </div>
  );
};

