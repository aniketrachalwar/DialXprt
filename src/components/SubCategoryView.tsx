import React from 'react';
import { ArrowLeft, MapPin, Wrench, Activity, Zap, Heart, PlusSquare, Star } from 'lucide-react';
import { Category } from '../types';

interface SubCategoryViewProps {
  category: Category;
  currentNeighborhood: string;
  onSelectSubCategory: (slug: string) => void;
  onBack: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  'Car': <Wrench className="w-6 h-6 text-[#1A9E9E]" />,
  'Activity': <Activity className="w-6 h-6 text-[#1A9E9E]" />,
  'Zap': <Zap className="w-6 h-6 text-[#1A9E9E]" />,
  'Heart': <Heart className="w-6 h-6 text-[#1A9E9E]" />,
  'PlusSquare': <PlusSquare className="w-6 h-6 text-[#1A9E9E]" />,
  'Star': <Star className="w-6 h-6 text-[#1A9E9E]" />,
};

export const SubCategoryView: React.FC<SubCategoryViewProps> = ({
  category,
  currentNeighborhood,
  onSelectSubCategory,
  onBack
}) => {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 bg-gray-100 hover:bg-[#1A9E9E] hover:text-white text-gray-700 rounded-xl transition-all shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center font-bold"
            title="Back to Categories"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F36F21] bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-200">
                {category.name}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#F36F21]" /> {currentNeighborhood}, Hyderabad
              </span>
            </div>

            <h1 className="font-extrabold text-base sm:text-lg text-gray-900 mt-0.5">
              Select what kind of {category.name} you need
            </h1>
          </div>
        </div>
      </div>

      {/* Grid of SubCategories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {category.subcategories?.map((subCat) => {
          const icon = (subCat.iconName && ICON_MAP[subCat.iconName]) || <Wrench className="w-6 h-6 text-[#1A9E9E]" />;
          
          return (
            <button
              key={subCat.id}
              onClick={() => onSelectSubCategory(subCat.slug)}
              className="group bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 hover:border-[#1A9E9E]/50 shadow-xs hover:shadow-md transition-all text-left flex flex-col items-center text-center justify-center cursor-pointer active:scale-98 min-h-[140px]"
            >
              <div className="w-14 h-14 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center transition-transform group-hover:scale-110 mb-3 group-hover:bg-indigo-50 group-hover:border-indigo-100">
                {icon}
              </div>
              <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-[#1A9E9E] transition-colors">
                {subCat.name}
              </h3>
            </button>
          );
        })}
      </div>
    </div>
  );
};
