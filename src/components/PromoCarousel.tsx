import React, { useState, useEffect } from 'react';

const PROMO_BANNERS = [
  {
    id: 1,
    title: 'Up to 50% Off Home Deep Cleaning',
    subtitle: 'Limited Time Offer',
    bgColor: 'bg-cyan-500',
    textColor: 'text-white',
    imgUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    link: 'cleaning'
  },
  {
    id: 2,
    title: 'Top Rated Plumbers in Hyderabad',
    subtitle: 'Verified & Trusted',
    bgColor: 'bg-[#FFA500]',
    textColor: 'text-white',
    imgUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80',
    link: 'plumbers'
  },
  {
    id: 3,
    title: '24/7 Electrician Services',
    subtitle: 'Arrives in 30 mins',
    bgColor: 'bg-gray-900',
    textColor: 'text-white',
    imgUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
    link: 'electricians'
  }
];

interface PromoCarouselProps {
  onBannerClick?: (link: string) => void;
}

export const PromoCarousel: React.FC<PromoCarouselProps> = ({ onBannerClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % PROMO_BANNERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full relative overflow-hidden my-4 group rounded-2xl shadow-sm">
      <div 
        className="flex transition-transform duration-500 ease-in-out" 
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {PROMO_BANNERS.map((banner) => (
          <div 
            key={banner.id}
            onClick={() => onBannerClick && onBannerClick(banner.link)}
            className="w-full shrink-0 aspect-[16/9] sm:aspect-[21/9] lg:aspect-[28/9] relative cursor-pointer"
          >
            <img src={banner.imgUrl} alt={banner.title} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center px-6 sm:px-10`}>
              <span className={`inline-block px-2 py-1 rounded text-xs font-bold mb-2 w-max ${banner.bgColor} ${banner.textColor}`}>
                {banner.subtitle}
              </span>
              <h2 className="text-white text-xl sm:text-3xl font-black max-w-[70%] leading-tight">
                {banner.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {PROMO_BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === activeIndex ? 'w-4 bg-[#22C55E]' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

