import React from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, BookOpen, Truck, Key, Search, DollarSign, Home, Activity, Plane, Scissors, Building, Map, Sparkles, Edit2, GraduationCap, Smile, ClipboardList, Monitor } from 'lucide-react';
import { Category } from '../types';

const ICON_MAP: Record<string, React.ReactNode> = {
  Activity: <Activity className="w-5 h-5 text-[#1A9E9E]lue-500" />,
  Heart: <Heart className="w-5 h-5 text-rose-500" />,
  Sparkles: <Sparkles className="w-5 h-5 text-amber-500" />,
  Plane: <Plane className="w-5 h-5 text-sky-500" />,
  Map: <Map className="w-5 h-5 text-emerald-500" />,
  Building: <Building className="w-5 h-5 text-indigo-500" />,
  Scissors: <Scissors className="w-5 h-5 text-pink-500" />,
  BookOpen: <BookOpen className="w-5 h-5 text-purple-500" />,
  Edit2: <Edit2 className="w-5 h-5 text-[#1A9E9E]lue-400" />,
  GraduationCap: <GraduationCap className="w-5 h-5 text-indigo-600" />,
  Smile: <Smile className="w-5 h-5 text-yellow-500" />,
  ClipboardList: <ClipboardList className="w-5 h-5 text-emerald-600" />,
  Monitor: <Monitor className="w-5 h-5 text-gray-700" />,
  Home: <Home className="w-5 h-5 text-indigo-500" />,
  Key: <Key className="w-5 h-5 text-yellow-600" />
};

export const SubCategoryMenu = ({
  category,
  onBack,
  onSelectSubCategory
}: {
  category: Category;
  onBack: () => void;
  onSelectSubCategory: (slug: string) => void;
}) => {
  return (
    <div className="bg-white min-h-[70vh] rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-[#1A9E9E] border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 mr-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 capitalize">{category.name.replace(/[^a-zA-Z\s]/g, '')}</h2>
      </div>

      {/* Subcategories List */}
      <div className="flex flex-col divide-y divide-gray-50">
        {category.subcategories?.map((sub) => {
          const icon = sub.iconName && ICON_MAP[sub.iconName] ? ICON_MAP[sub.iconName] : <Star className="w-5 h-5 text-gray-400" />;
          return (
            <button
              key={sub.id}
              onClick={() => onSelectSubCategory(sub.slug)}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <span className="text-base font-semibold text-gray-800">{sub.name}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
