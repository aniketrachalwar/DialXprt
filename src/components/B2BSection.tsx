import React from 'react';
import { Package, Truck, Factory, Warehouse, Building2, Wrench, Briefcase, ChevronRight } from 'lucide-react';

const B2B_CATEGORIES = [
  { id: 'b2b-1', title: 'Industrial Plants & Machinery', icon: Factory, slug: 'b2b' },
  { id: 'b2b-2', title: 'Packaging Material', icon: Package, slug: 'b2b' },
  { id: 'b2b-3', title: 'Building & Construction', icon: Building2, slug: 'real-estate' },
  { id: 'b2b-4', title: 'Commercial Vehicles', icon: Truck, slug: 'mechanic' },
  { id: 'b2b-5', title: 'Corporate Gifts', icon: Briefcase, slug: 'b2b' },
  { id: 'b2b-6', title: 'Hardware & Tools', icon: Wrench, slug: 'ac-repair' },
];

export const B2BSection = ({ onSelectCategory }: { onSelectCategory: (slug: string) => void }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-[#1A9E9E] border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Warehouse className="w-5 h-5 text-[#1A9E9E]" />
          <h3 className="font-extrabold text-gray-900 text-lg">B2B & Manufacturing</h3>
        </div>
        <button 
          onClick={() => onSelectCategory('b2b')}
          className="text-xs font-bold text-[#F36F21] hover:text-[#e0611a] flex items-center"
        >
          View All <ChevronRight className="w-3 h-3 ml-0.5" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y divide-gray-100">
        {B2B_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.slug)}
            className="p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-indigo-50/50 transition-colors group border-[#1A9E9E] border-r border-gray-100"
          >
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-100 group-hover:-translate-y-1 group-hover:shadow-md transition-all duration-300">
              <cat.icon className="w-6 h-6 text-gray-600 group-hover:text-[#1A9E9E] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-gray-700 text-center leading-tight">
              {cat.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
