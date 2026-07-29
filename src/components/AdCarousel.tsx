import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Users, BadgeCheck } from 'lucide-react';

const ADS = [
  {
    id: 1,
    title: "Connect with 18 Cr+ People",
    subtitle: "searching on DialXprt",
    cta: "List Your Business for FREE",
    bgClass: "bg-gradient-to-r from-[#E8EAF6] to-[#E1BEE7]", // Very light purple to lavender like Justdial
    textClass: "text-[#0F5C5C]",
    ctaClass: "bg-gradient-to-r from-[#3F51B5] to-[#E91E63] text-white",
    icon: <Users className="w-16 h-16 sm:w-24 sm:h-24 text-indigo-400 opacity-80" />,
  },
  {
    id: 2,
    title: "Need Emergency Repairs?",
    subtitle: "24/7 Verified Experts Near You",
    cta: "Find Experts Now",
    bgClass: "bg-gradient-to-r from-blue-50 to-cyan-100",
    textClass: "text-[#1A9E9E]lue-900",
    ctaClass: "bg-[#1A9E9E] text-white",
    icon: <BadgeCheck className="w-16 h-16 sm:w-24 sm:h-24 text-[#1A9E9E]lue-400 opacity-80" />,
  },
  {
    id: 3,
    title: "Grow Your Local Store",
    subtitle: "Get online orders directly on WhatsApp",
    cta: "Start Selling",
    bgClass: "bg-gradient-to-r from-emerald-50 to-teal-100",
    textClass: "text-emerald-900",
    ctaClass: "bg-emerald-600 text-white",
    icon: <TrendingUp className="w-16 h-16 sm:w-24 sm:h-24 text-emerald-400 opacity-80" />,
  }
];

export const AdCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ADS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % ADS.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? ADS.length - 1 : prev - 1));

  return (
    <div className="relative w-full rounded-2xl overflow-hidden group shadow-sm border border-gray-100">
      <div 
        className="flex transition-transform duration-700 ease-in-out h-36 sm:h-44"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {ADS.map((ad) => (
          <div key={ad.id} className={`min-w-full h-full flex items-center justify-between px-5 sm:px-10 relative overflow-hidden ${ad.bgClass}`}>
            
            {/* Background Decor */}
            <div className="absolute -right-6 -bottom-6 sm:-right-4 sm:-bottom-4 opacity-50 transform rotate-[-15deg]">
              {ad.icon}
            </div>

            <div className="relative z-10 max-w-[60%] sm:max-w-[50%]">
              <h2 className={`text-[#1A9E9E]ase sm:text-[#1A9E9E]xl font-black ${ad.textClass} leading-tight`}>
                {ad.title}
              </h2>
              <p className={`text-xs sm:text-sm font-semibold mt-1 mb-3 ${ad.textClass} opacity-80`}>
                {ad.subtitle}
              </p>
              <button className={`text-[10px] sm:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-md hover:scale-105 active:scale-95 transition-transform ${ad.ctaClass}`}>
                {ad.cta}
              </button>
            </div>
            
            {/* Image Placeholder (Mocking the person with crossed arms) */}
            <div className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/30 backdrop-blur-sm border-[#1A9E9E] border-white flex items-center justify-center shadow-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=300&q=80" alt="Professional" className="w-full h-full object-cover mix-blend-multiply" />
            </div>

          </div>
        ))}
      </div>

      {/* Manual Navigation Arrows (Hidden by default, shown on hover) */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {ADS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === idx 
                ? 'w-4 h-1.5 bg-[#0F5C5C]' 
                : 'w-1.5 h-1.5 bg-gray-400/50 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
