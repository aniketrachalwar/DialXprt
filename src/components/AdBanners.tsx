import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    title: '50% OFF AC Servicing',
    subtitle: 'Beat the Hyderabad heat with top-rated experts.',
    bgClass: 'bg-gradient-to-r from-blue-600 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 2,
    title: 'Top Plumbers Near You',
    subtitle: 'Verified professionals at your doorstep in 30 mins.',
    bgClass: 'bg-gradient-to-r from-orange-500 to-red-500',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 3,
    title: 'Premium Home Cleaning',
    subtitle: 'Book now and get a free pest control inspection.',
    bgClass: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
  }
];

export const AdBanners: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <div className="relative h-40 sm:h-48 md:h-56 rounded-2xl overflow-hidden shadow-lg group bg-gray-100">
        {/* Banner Items */}
        {BANNERS.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            } ${banner.bgClass} flex`}
          >
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center text-white z-20">
              <span className="bg-white/20 w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 backdrop-blur-sm border border-white/30">
                Sponsored
              </span>
              <h2 className="text-xl sm:text-cyan-500xl font-black mb-1 sm:mb-2">{banner.title}</h2>
              <p className="text-xs sm:text-sm font-medium text-white/90 max-w-xs">{banner.subtitle}</p>
              <button className="mt-4 bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-lg w-fit shadow-md hover:bg-gray-50 transition-colors">
                Book Now
              </button>
            </div>
            
            {/* Background Image overlay with blend */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-40 mix-blend-overlay hidden sm:block">
               <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button 
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-cyan-500lack/50 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-cyan-500lack/50 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

