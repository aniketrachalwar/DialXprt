import React, { useState } from 'react';
import {
  Search,
  DollarSign,
  Home,
  Video,
  Coffee,
  CheckCircle2,
  Navigation,
  Zap,
  Wrench,
  ShoppingBag,
  Wind,
  Car,
  Hammer,
  Paintbrush,
  BookOpen,
  Scissors,
  Sparkles,
  Tv,
  Shirt,
  Bug,
  Camera,
  Utensils,
  Flame,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Activity,
  PlusSquare,
  Pill,
  Building,
  Truck,
  Package,
  Layout,
  Star,
  Shield,
  Laptop,
  Smartphone,
  Droplets,
  Recycle,
  Plane,
  Music,
  Headphones,
  Briefcase,
  Calculator,
  Globe,
  Heart,
  Trash2,
  Eye,
} from 'lucide-react';
import { Category } from '../types';
import { AppLanguage, getTranslation, getCategoryName } from '../lib/translations';
import { CATEGORY_IMAGE_MAP } from '../lib/categoryImages';

interface CategoryGridProps {
  categories: Category[];
  onSelectCategory: (categorySlug: string) => void;
  currentNeighborhood: string;
  currentLang?: AppLanguage;
}

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-6 h-6 text-amber-500" />,
  Wrench: <Wrench className="w-6 h-6 text-blue-500" />,
  ShoppingBag: <ShoppingBag className="w-6 h-6 text-emerald-500" />,
  Wind: <Wind className="w-6 h-6 text-cyan-500" />,
  Car: <Car className="w-6 h-6 text-red-500" />,
  Hammer: <Hammer className="w-6 h-6 text-yellow-600" />,
  Paintbrush: <Paintbrush className="w-6 h-6 text-indigo-500" />,
  BookOpen: <BookOpen className="w-6 h-6 text-purple-500" />,
  Scissors: <Scissors className="w-6 h-6 text-pink-500" />,
  Navigation: <Navigation className="w-6 h-6 text-teal-500" />,
  Sparkles: <Sparkles className="w-6 h-6 text-indigo-500" />,
  Tv: <Tv className="w-6 h-6 text-cyan-500" />,
  Shirt: <Shirt className="w-6 h-6 text-fuchsia-500" />,
  Bug: <Bug className="w-6 h-6 text-emerald-600" />,
  Camera: <Camera className="w-6 h-6 text-sky-500" />,
  Utensils: <Utensils className="w-6 h-6 text-orange-500" />,
  Flame: <Flame className="w-6 h-6 text-rose-500" />,
  Activity: <Activity className="w-6 h-6 text-red-500" />,
  PlusSquare: <PlusSquare className="w-6 h-6 text-red-600" />,
  Pill: <Pill className="w-6 h-6 text-teal-500" />,
  Building: <Building className="w-6 h-6 text-indigo-600" />,
  Truck: <Truck className="w-6 h-6 text-amber-600" />,
  Coffee: <Coffee className="w-6 h-6 text-amber-700" />,
  Package: <Package className="w-6 h-6 text-orange-500" />,
  Layout: <Layout className="w-6 h-6 text-purple-600" />,
  Star: <Star className="w-6 h-6 text-yellow-500" />,
  Shield: <Shield className="w-6 h-6 text-slate-700" />,
  Laptop: <Laptop className="w-6 h-6 text-gray-600" />,
  Smartphone: <Smartphone className="w-6 h-6 text-blue-600" />,
  Droplets: <Droplets className="w-6 h-6 text-cyan-600" />,
  Recycle: <Recycle className="w-6 h-6 text-emerald-600" />,
  Plane: <Plane className="w-6 h-6 text-sky-500" />,
  Music: <Music className="w-6 h-6 text-pink-600" />,
  Headphones: <Headphones className="w-6 h-6 text-purple-500" />,
  Briefcase: <Briefcase className="w-6 h-6 text-slate-600" />,
  Calculator: <Calculator className="w-6 h-6 text-emerald-700" />,
  Globe: <Globe className="w-6 h-6 text-blue-500" />,
  Heart: <Heart className="w-6 h-6 text-rose-500" />,
  MapPin: <MapPin className="w-6 h-6 text-red-500" />,
  Home: <Home className="w-6 h-6 text-indigo-500" />,
  Trash2: <Trash2 className="w-6 h-6 text-slate-500" />,
  Eye: <Eye className="w-6 h-6 text-cyan-700" />,
};

const CATEGORY_COLOR_BG: Record<string, string> = {
  electrician: 'bg-amber-50 group-hover:bg-amber-100/80 border-amber-200',
  plumber: 'bg-blue-50 group-hover:bg-blue-100/80 border-blue-200',
  kirana: 'bg-emerald-50 group-hover:bg-emerald-100/80 border-emerald-200',
  'ac-repair': 'bg-cyan-50 group-hover:bg-cyan-100/80 border-cyan-200',
  mechanic: 'bg-red-50 group-hover:bg-red-100/80 border-red-200',
  carpenter: 'bg-yellow-50 group-hover:bg-yellow-100/80 border-yellow-200',
  painter: 'bg-indigo-50 group-hover:bg-indigo-100/80 border-indigo-200',
  'home-tutor': 'bg-purple-50 group-hover:bg-purple-100/80 border-purple-200',
  barber: 'bg-pink-50 group-hover:bg-pink-100/80 border-pink-200',
  'taxi-auto': 'bg-teal-50 group-hover:bg-teal-100/80 border-teal-200',
  'home-cleaning': 'bg-indigo-50 group-hover:bg-indigo-100/80 border-indigo-200',
  'appliance-repair': 'bg-blue-50 group-hover:bg-blue-100/80 border-blue-200',
  tailor: 'bg-fuchsia-50 group-hover:bg-fuchsia-100/80 border-fuchsia-200',
  'pest-control': 'bg-emerald-50 group-hover:bg-emerald-100/80 border-emerald-200',
  photographer: 'bg-sky-50 group-hover:bg-sky-100/80 border-sky-200',
  'veg-cook': 'bg-orange-50 group-hover:bg-orange-100/80 border-orange-200',
  'non-veg-cook': 'bg-rose-50 group-hover:bg-rose-100/80 border-rose-200',
};

export const CategoryGrid: React.FC<CategoryGridProps & { onShowAllCategories?: () => void }> = ({
  categories,
  onSelectCategory,
  currentLang = 'en',
  onShowAllCategories
}) => {
  const t = (key: string) => getTranslation(currentLang, key);
  
  // Show first 11 categories on the home page grid (matches Column D length)
  const displayCategories = categories.slice(0, 11);

  return (
    <section className="animate-fade-in">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {displayCategories.map((cat, index) => {
          const catTitle = getCategoryName(cat.slug, cat.name, currentLang);
          
          return (
            <button
              key={cat.id}
              id={`service-card-${cat.slug}`}
              onClick={() => onSelectCategory(cat.slug)}
              className="bg-transparent rounded-xl p-2 sm:p-3 hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-1.5 min-h-[90px] cursor-pointer active:scale-95"
            >
              <span 
                className="text-3xl sm:text-4xl animate-bounce"
                style={{ animationDelay: `${index * 0.1}s`, animationDuration: '2s' }}
              >
                {cat.emoji || '🔹'}
              </span>
              <span className="font-bold text-[10px] sm:text-[11px] text-gray-800 text-center leading-tight line-clamp-2">
                {catTitle}
              </span>
            </button>
          );
        })}
        
        {/* Show More Button */}
        <button
          onClick={onShowAllCategories || (() => onSelectCategory('all-categories'))}
          className="bg-transparent rounded-xl p-2 sm:p-3 hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-1.5 min-h-[90px] cursor-pointer active:scale-95"
        >
          <div 
            className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white shadow-md transition-colors animate-bounce mt-1 mb-1"
            style={{ animationDelay: `0.6s`, animationDuration: '2s' }}
          >
            <ChevronDown className="w-5 h-5" strokeWidth={3} />
          </div>
          <span className="font-extrabold text-[10px] sm:text-[11px] text-gray-700 text-center leading-tight">
            Show More
          </span>
        </button>
      </div>
    </section>
  );
};

