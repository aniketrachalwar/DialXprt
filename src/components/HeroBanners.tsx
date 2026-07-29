import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

const CAROUSEL_BANNERS = [
  {
    id: 1,
    title: "Boost Your Business",
    heading: "Advertise With Us",
    btnText: "Get Listed Free",
    bgClass: "from-indigo-600 to-purple-600 text-white",
    action: 'b2b'
  },
  {
    id: 2,
    title: "Time to fly at",
    heading: "Lowest Airfares",
    btnText: "Book Now",
    bgClass: "from-sky-400 to-blue-600 text-white",
    action: 'travel'
  },
  {
    id: 3,
    title: "Need Quick Fixes?",
    heading: "Expert Repairs",
    btnText: "Find Experts",
    bgClass: "from-orange-500 to-rose-600 text-white",
    action: 'mechanic'
  }
];

export const HeroBanners = ({ onSelectCategory }: { onSelectCategory: (slug: string) => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % CAROUSEL_BANNERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Auto-scrolling Carousel */}
      <div className="flex-1 rounded-2xl p-0 flex relative overflow-hidden min-h-[160px] md:min-h-[200px] shadow-sm">
        {CAROUSEL_BANNERS.map((banner, idx) => (
          <div
            key={banner.id}
            className={`absolute inset-0 w-full h-full p-6 sm:p-8 flex flex-col justify-center items-start transition-opacity duration-1000 bg-gradient-to-r ${banner.bgClass} ${
              idx === currentIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <h2 className="text-lg sm:text-xl md:text-[#1A9E9E]xl font-medium mb-1 opacity-90">{banner.title}</h2>
            <h3 className="text-[#1A9E9E]xl sm:text-[#1A9E9E]xl md:text-4xl font-extrabold mb-4 sm:mb-5 drop-shadow-sm">{banner.heading}</h3>
            <button 
              onClick={() => onSelectCategory(banner.action)}
              className="bg-white text-gray-900 hover:bg-gray-50 px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg font-bold transition-colors shadow-sm text-sm sm:text-[#1A9E9E]ase"
            >
              {banner.btnText}
            </button>
          </div>
        ))}
        {/* Pagination Dots */}
        <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2">
          {CAROUSEL_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentIdx ? 'bg-white w-4' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Small vertical cards */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar md:w-auto pb-2 md:pb-0 -mx-1 px-1 md:mx-0 md:px-0">
        <BannerCard title="B2B" subtitle="Quick Quotes" bgClass="bg-[#1976D2]" imageUrl="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&q=80&auto=format&fit=crop" onClick={() => onSelectCategory('b2b')} />
        <BannerCard title="REPAIRS & SERVICES" subtitle="Get Nearest Vendor" bgClass="bg-[#1A9E9E]" imageUrl="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80&auto=format&fit=crop" onClick={() => onSelectCategory('mechanic')} />
        <BannerCard title="REAL ESTATE" subtitle="Finest Agents" bgClass="bg-[#5C6BC0]" imageUrl="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80&auto=format&fit=crop" onClick={() => onSelectCategory('real-estate')} />
        <BannerCard title="DOCTORS" subtitle="Book Now" bgClass="bg-[#00897B]" imageUrl="https://images.unsplash.com/photo-1594824432258-0046e3d231de?w=400&q=80&auto=format&fit=crop" onClick={() => onSelectCategory('doctors')} />
      </div>
    </div>
  );
};

const BannerCard = ({ title, subtitle, bgClass, imageUrl, onClick }: { title: string, subtitle: string, bgClass: string, imageUrl?: string, onClick: () => void }) => (
  <div onClick={onClick} className={`shrink-0 w-32 md:w-36 h-[160px] md:h-[200px] rounded-2xl p-3 sm:p-4 flex flex-col justify-between text-white relative overflow-hidden ${bgClass} cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group`}>
    {imageUrl && (
      <div className="absolute top-0 right-0 bottom-0 w-[140%] z-0 transform translate-x-[25%]">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover object-center opacity-95 group-hover:scale-105 transition-transform duration-500" 
          style={{ 
            maskImage: 'linear-gradient(to right, transparent 0%, black 50%)', 
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 50%)' 
          }}
          loading="lazy"
        />
      </div>
    )}
    <div className="relative z-20 w-[80%]">
      <h4 className="font-extrabold text-sm md:text-[#1A9E9E]ase leading-tight uppercase drop-shadow-md">{title}</h4>
      <p className="text-[11px] md:text-xs mt-1 font-medium opacity-100 leading-tight drop-shadow-md">{subtitle}</p>
    </div>
    <div className="relative z-20 bg-white/20 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-sm mt-auto self-start group-hover:bg-white/30 cursor-pointer transition-colors shadow-sm">
      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-sm" />
    </div>
  </div>
);
