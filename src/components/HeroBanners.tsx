import React, { useState, useEffect } from 'react';

const CAROUSEL_BANNERS = [
  {
    id: 1,
    tag: "Limited Time Offer",
    heading: "Up to 50% Off Home Deep Cleaning",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800",
    bgClass: "bg-teal-900",
    action: 'deep-cleaning'
  },
  {
    id: 2,
    tag: "Exclusive Deal",
    heading: "Expert Plumbers Near You",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    bgClass: "bg-indigo-900",
    action: 'plumber'
  },
  {
    id: 3,
    tag: "Top Rated",
    heading: "Affordable AC Repair & Service",
    imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=800",
    bgClass: "bg-sky-900",
    action: 'ac-repair'
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
    <div className="w-full rounded-2xl overflow-hidden relative shadow-md bg-gray-900 cursor-pointer group h-[200px] md:h-[280px]"
         onClick={() => onSelectCategory(CAROUSEL_BANNERS[currentIdx].action)}>
      {CAROUSEL_BANNERS.map((banner, idx) => (
        <div
          key={banner.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            idx === currentIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img src={banner.imageUrl} alt={banner.heading} className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgClass}/90 to-transparent mix-blend-multiply`} />
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-center w-2/3">
            <span className="inline-block bg-teal-400 text-teal-950 font-bold px-3 py-1 rounded-md text-xs md:text-sm mb-3 self-start">
              {banner.tag}
            </span>
            <h2 className="text-white text-2xl md:text-4xl font-bold leading-tight drop-shadow-md">
              {banner.heading}
            </h2>
          </div>
        </div>
      ))}
      
      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
        {CAROUSEL_BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIdx(idx);
            }}
            className={`h-2 rounded-full transition-all ${idx === currentIdx ? 'bg-green-400 w-6' : 'bg-gray-300 w-2 opacity-50'}`}
          />
        ))}
      </div>
    </div>
  );
};

