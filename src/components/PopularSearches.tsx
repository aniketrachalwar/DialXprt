import React from 'react';

export const PopularSearches = ({ onSearchQuery }: { onSearchQuery: (query: string) => void }) => {
  const searches = [
    { title: 'Interior Designers', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=400' },
    { title: 'Electricians', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=400' },
    { title: 'Banquet Halls', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400' },
    { title: 'Estate Agents', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400' },
    { title: 'Plumbers', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="py-4">
      <h3 className="text-xl font-bold text-gray-900 mb-4 px-1">Popular Searches</h3>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-1">
        {searches.map((item, idx) => (
          <div key={idx} onClick={() => onSearchQuery(item.title)} className="shrink-0 w-48 md:w-56 rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="h-32 w-full overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <div className="bg-[#1877F2] p-4 flex flex-col justify-between flex-1">
              <h4 className="text-white font-bold text-sm leading-tight mb-4">{item.title}</h4>
              <button className="bg-white text-[#1877F2] font-bold text-xs py-2 px-3 rounded w-max hover:bg-gray-100 transition-colors">
                Enquire Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
