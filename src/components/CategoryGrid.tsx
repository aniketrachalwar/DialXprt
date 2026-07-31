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
  Tv: <Tv className="w-6 h-6 text-[#1A9E9E]" />,
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

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onSelectCategory,
  currentNeighborhood,
  currentLang = 'en',
}) => {
  const t = (key: string) => getTranslation(currentLang, key);
  const [isExpanded, setIsExpanded] = useState(false);

  const displayCategories = isExpanded ? categories : categories.slice(0, 7);

  return (
    <section className="space-y-5 animate-fade-in">


      {/* Grid of All Services */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {displayCategories.map((cat) => {
          const bgStyle = CATEGORY_COLOR_BG[cat.slug] || 'bg-indigo-50 group-hover:bg-indigo-100/80 border-indigo-200';
          const imageUrl = CATEGORY_IMAGE_MAP[cat.slug] || `https://picsum.photos/seed/${cat.slug}/120/120`;
          const catTitle = getCategoryName(cat.slug, cat.name, currentLang);

          return (
            <button
              key={cat.id}
              id={`service-card-${cat.slug}`}
              onClick={() => onSelectCategory(cat.slug)}
              className="group bg-white rounded-2xl p-3.5 sm:p-4 border border-gray-200 hover:border-[#1A9E9E]/50 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[140px] cursor-pointer active:scale-98"
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 mb-2.5 overflow-hidden relative border-gray-200`}>
                  <img src={imageUrl} alt={catTitle} className="w-full h-full object-cover" loading="lazy" />
                </div>

                <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 group-hover:text-[#1A9E9E] transition-colors line-clamp-1">
                  {catTitle}
                </h3>
                <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                  {cat.description}
                </p>
              </div>

              <div className="pt-2.5 mt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold">
                <span className="text-[#1A9E9E] bg-indigo-50 group-hover:bg-indigo-100 px-2 py-0.5 rounded-full">
                  {cat.activeProvidersCount} {t('expertsNear')}
                </span>
                <span className="text-gray-400 group-hover:text-[#F36F21] group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
        
        {!isExpanded && categories.length > 7 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="group bg-gray-50 hover:bg-white rounded-2xl p-3.5 sm:p-4 border border-dashed border-gray-300 hover:border-gray-400 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center justify-center min-h-[140px] cursor-pointer active:scale-98"
          >
            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 group-hover:text-gray-900 group-hover:scale-110 transition-transform mb-2.5 shadow-sm">
              <PlusSquare className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              Show More
            </h3>
            <p className="text-[11px] text-gray-500 mt-1">
              {categories.length - 7} more categories
            </p>
          </button>
        )}
      </div>
    </section>
  );
};
