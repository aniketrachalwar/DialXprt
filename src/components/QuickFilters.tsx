import React from 'react';
import { Star, ShieldCheck, Clock, Navigation } from 'lucide-react';

const QUICK_FILTERS = [
  { id: 'near', label: 'Near Me', icon: Navigation, query: '' },
  { id: '247', label: '24/7 Open', icon: Clock, query: '24/7' },
  { id: 'top', label: 'Top Rated', icon: Star, query: 'top' },
  { id: 'verified', label: 'Verified', icon: ShieldCheck, query: 'verified' },
];

interface QuickFiltersProps {
  onSelectFilter: (query: string) => void;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({ onSelectFilter }) => {
  return (
    <div className="w-full mb-4">
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
        {QUICK_FILTERS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onSelectFilter(filter.query)}
            className="flex items-center gap-1.5 shrink-0 px-4 py-2 bg-[#F3F4F6] text-gray-700 rounded-full text-[13px] font-bold hover:bg-gray-200 transition-colors shadow-sm border border-gray-100"
          >
            <filter.icon className="w-3.5 h-3.5 text-cyan-500" />
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

