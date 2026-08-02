import React from 'react';
import { Category } from '../types';
import { getCategoryName, AppLanguage } from '../lib/translations';
import {
  Flame, Briefcase, Activity, Plane, Star, Heart, BookOpen,
  Truck, Key, Search, DollarSign, Home, Video, Coffee,
  Zap, Wrench, ShoppingBag, Wind, Car, Hammer, Paintbrush,
  Scissors, Navigation, Sparkles, Tv, Shirt, Bug, Camera, Utensils,
  PlusSquare, Pill, Building, Package, Layout, Shield, Laptop,
  Smartphone, Droplets, Recycle, Music, Headphones, Calculator,
  Globe, MapPin, Trash2, Eye
} from 'lucide-react';
import { CATEGORY_IMAGE_MAP } from '../lib/categoryImages';

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-6 h-6 text-amber-500" />,
  Wrench: <Wrench className="w-6 h-6 text-cyan-500" />,
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
  Briefcase: <Briefcase className="w-6 h-6 text-indigo-500" />,
  Activity: <Activity className="w-6 h-6 text-cyan-500" />,
  Plane: <Plane className="w-6 h-6 text-sky-500" />,
  Star: <Star className="w-6 h-6 text-yellow-500" />,
  Heart: <Heart className="w-6 h-6 text-rose-500" />,
  Truck: <Truck className="w-6 h-6 text-orange-500" />,
  Key: <Key className="w-6 h-6 text-yellow-600" />,
  Search: <Search className="w-6 h-6 text-teal-500" />,
  DollarSign: <DollarSign className="w-6 h-6 text-emerald-600" />,
  Home: <Home className="w-6 h-6 text-indigo-600" />,
  Video: <Video className="w-6 h-6 text-red-600" />,
  Coffee: <Coffee className="w-6 h-6 text-cyan-500" />,
  PlusSquare: <PlusSquare className="w-6 h-6 text-red-600" />,
  Pill: <Pill className="w-6 h-6 text-teal-500" />,
  Building: <Building className="w-6 h-6 text-indigo-600" />,
  Package: <Package className="w-6 h-6 text-orange-500" />,
  Layout: <Layout className="w-6 h-6 text-purple-600" />,
  Shield: <Shield className="w-6 h-6 text-slate-700" />,
  Laptop: <Laptop className="w-6 h-6 text-gray-600" />,
  Smartphone: <Smartphone className="w-6 h-6 text-blue-600" />,
  Droplets: <Droplets className="w-6 h-6 text-cyan-600" />,
  Recycle: <Recycle className="w-6 h-6 text-emerald-600" />,
  Music: <Music className="w-6 h-6 text-pink-600" />,
  Headphones: <Headphones className="w-6 h-6 text-purple-500" />,
  Calculator: <Calculator className="w-6 h-6 text-emerald-700" />,
  Globe: <Globe className="w-6 h-6 text-blue-500" />,
  MapPin: <MapPin className="w-6 h-6 text-red-500" />,
  Trash2: <Trash2 className="w-6 h-6 text-slate-500" />,
  Eye: <Eye className="w-6 h-6 text-cyan-700" />,
};

export const HorizontalCategoryScroll = ({
  categories,
  onSelectCategory,
  currentLang = 'en'
}: {
  categories: Category[];
  onSelectCategory: (slug: string) => void;
  currentLang?: AppLanguage;
}) => {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-x-2 gap-y-4 py-2 px-1">
      {categories.map((cat) => {
        const icon = CATEGORY_ICON_MAP[cat.iconName] || <Wrench className="w-6 h-6 text-cyan-500" />;
        const imageUrl = CATEGORY_IMAGE_MAP[cat.slug];
        const catTitle = getCategoryName(cat.slug, cat.name, currentLang);
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.slug)}
            className="flex flex-col items-center gap-2 group cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-[70px] h-[70px] bg-white border border-gray-100 rounded-2xl flex justify-center items-center shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
              {imageUrl ? (
                <img src={imageUrl} alt={catTitle} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
              ) : (
                <div className="group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  {icon}
                </div>
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-gray-800 text-center leading-tight line-clamp-2 px-1">
              {catTitle}
            </span>
          </button>
        );
      })}
    </div>
  );
};

