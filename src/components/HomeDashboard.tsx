import React from 'react';
import { motion } from 'framer-motion';
import { HeroBanners } from './HeroBanners';
import { CategoryGrid } from './CategoryGrid';
import { ImageCategorySection } from './ImageCategorySection';
import { TravelBookings } from './TravelBookings';
import { PopularSearches } from './PopularSearches';

import { Category } from '../types';
import { AppLanguage } from '../lib/translations';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export const HomeDashboard = ({
  categories,
  onSelectCategory,
  onSearchQuery,
  currentLang,
  onShowAllCategories
}: {
  categories: Category[];
  onSelectCategory: (slug: string) => void;
  onSearchQuery: (query: string) => void;
  currentLang: AppLanguage;
  onShowAllCategories?: () => void;
}) => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 md:space-y-8 pb-10 overflow-x-hidden"
    >
      <div className="pt-4 space-y-8 px-2 sm:px-0">





        
        <motion.div variants={itemVariants}>
          <CategoryGrid 
            categories={categories} 
            onSelectCategory={onSelectCategory} 
            currentLang={currentLang}
            currentNeighborhood="Banjara Hills" 
            onShowAllCategories={onShowAllCategories || (() => onSelectCategory('all-categories'))}
          />
        </motion.div>
        
        {/* Promotional Ad Banner */}
        <motion.div variants={itemVariants} className="px-1 py-1">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#E6F4F8] to-[#E0F7FA] p-5 sm:p-6 shadow-sm flex items-center justify-between border border-blue-50">
            {/* Decorative Cloud/Badge */}
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-[#1a237e]">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            
            <div className="relative z-10 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-[#1a237e] tracking-tight mb-1">
                Need Emergency Repairs?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 font-medium">
                24/7 Verified Experts Near You
              </p>
              <button 
                onClick={() => onSelectCategory('electrician')}
                className="bg-[#1a237e] text-white px-4 py-1.5 rounded-lg text-[13px] font-semibold hover:bg-[#283593] transition-colors shadow-sm active:scale-95"
              >
                Find Experts Now
              </button>
            </div>
            
            <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 ml-2 rounded-full overflow-hidden border-[3px] border-white shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=200" 
                alt="Expert"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Pagination Dots (Static for UI resemblance) */}
            <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300/80"></div>
              <div className="w-3.5 h-1.5 rounded-full bg-[#1a237e]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300/80"></div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImageCategorySection 
            title="Wedding Requisites" 
            cards={[
              { title: 'Banquet Halls', imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('wedding') },
              { title: 'Bridal Requisite', imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('wedding') },
              { title: 'Caterers', imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('veg-cook') },
            ]} 
          />
          <ImageCategorySection 
            title="Beauty & Spa" 
            cards={[
              { title: 'Beauty Parlours', imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('beauty') },
              { title: 'Spa & Massages', imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('beauty') },
              { title: 'Salons', imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('barber') },
            ]} 
          />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImageCategorySection 
            title="Repairs & Services" 
            cards={[
              { title: 'AC Service', imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('ac-repair') },
              { title: 'Car Service', imageUrl: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('mechanic') },
              { title: 'Bike Service', imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('mechanic') },
            ]} 
          />
          <ImageCategorySection 
            title="Daily Needs" 
            cards={[
              { title: 'Movies', imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('movies') },
              { title: 'Grocery', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('kirana') },
              { title: 'Electricians', imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('electrician') },
            ]} 
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TravelBookings onSelectCategory={onSelectCategory} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <HeroBanners onSelectCategory={onSelectCategory} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <PopularSearches onSearchQuery={onSearchQuery} />
        </motion.div>
      </div>
    </motion.div>
  );
};

