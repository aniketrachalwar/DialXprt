import React from 'react';
import {
  Zap,
  Wrench,
  ShoppingBag,
  Wind,
  Car,
  Hammer,
  Paintbrush,
  BookOpen,
  Scissors,
  Navigation,
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
} from 'lucide-react';
import { Category } from '../types';
import { AppLanguage, getTranslation, getCategoryName } from '../lib/translations';

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
  Tv: <Tv className="w-6 h-6 text-[#2B3990]" />,
  Shirt: <Shirt className="w-6 h-6 text-fuchsia-500" />,
  Bug: <Bug className="w-6 h-6 text-emerald-600" />,
  Camera: <Camera className="w-6 h-6 text-sky-500" />,
  Utensils: <Utensils className="w-6 h-6 text-orange-500" />,
  Flame: <Flame className="w-6 h-6 text-rose-500" />,
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

  return (
    <section className="space-y-5 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1A237E] via-[#2B3990] to-[#1A237E] text-white p-4 sm:p-5 rounded-2xl shadow-md border border-indigo-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#F36F21] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
              Local Directory
            </span>
            <span className="text-xs font-semibold text-indigo-200 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#F36F21]" /> {currentNeighborhood}, Hyderabad
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white">
            Choose a Service to Find Nearby Experts
          </h2>
          <p className="text-xs text-indigo-200 mt-0.5">
            Select any service below to view verified local technicians & stores sorted from nearest to farthest.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/15 text-xs font-bold text-amber-300 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Offline Volunteer Verified</span>
        </div>
      </div>

      {/* Grid of All Services */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const bgStyle = CATEGORY_COLOR_BG[cat.slug] || 'bg-indigo-50 group-hover:bg-indigo-100/80 border-indigo-200';
          const icon = CATEGORY_ICON_MAP[cat.iconName] || <Wrench className="w-6 h-6 text-[#2B3990]" />;
          const catTitle = getCategoryName(cat.slug, cat.name, currentLang);

          return (
            <button
              key={cat.id}
              id={`service-card-${cat.slug}`}
              onClick={() => onSelectCategory(cat.slug)}
              className="group bg-white rounded-2xl p-3.5 sm:p-4 border border-gray-200 hover:border-[#2B3990]/50 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[140px] cursor-pointer active:scale-98"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 mb-2.5 ${bgStyle}`}>
                  {icon}
                </div>

                <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 group-hover:text-[#2B3990] transition-colors line-clamp-1">
                  {catTitle}
                </h3>
                <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                  {cat.description}
                </p>
              </div>

              <div className="pt-2.5 mt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold">
                <span className="text-[#2B3990] bg-indigo-50 group-hover:bg-indigo-100 px-2 py-0.5 rounded-full">
                  {cat.activeProvidersCount} {t('expertsNear')}
                </span>
                <span className="text-gray-400 group-hover:text-[#F36F21] group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
