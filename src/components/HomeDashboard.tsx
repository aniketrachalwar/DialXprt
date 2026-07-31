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
  currentLang
}: {
  categories: Category[];
  onSelectCategory: (slug: string) => void;
  onSearchQuery: (query: string) => void;
  currentLang: AppLanguage;
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
          />
        </motion.div>
        

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImageCategorySection 
            title="Wedding Requisites" 
            cards={[
              { title: 'Banquet Halls', imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('wedding') },
              { title: 'Bridal Requisite', imageUrl: 'https://images.unsplash.com/photo-1595954421407-b6f849b2cbaf?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('wedding') },
              { title: 'Caterers', imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('veg-cook') },
            ]} 
          />
          <ImageCategorySection 
            title="Beauty & Spa" 
            cards={[
              { title: 'Beauty Parlours', imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('beauty') },
              { title: 'Spa & Massages', imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('beauty') },
              { title: 'Salons', imageUrl: 'https://images.unsplash.com/photo-1521590832167-7bfcfaa6362f?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('barber') },
            ]} 
          />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImageCategorySection 
            title="Repairs & Services" 
            cards={[
              { title: 'AC Service', imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('ac-repair') },
              { title: 'Car Service', imageUrl: 'https://images.unsplash.com/photo-1632823462943-26f0b6ce7a9d?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('mechanic') },
              { title: 'Bike Service', imageUrl: 'https://images.unsplash.com/photo-1589785507851-f404433d9c79?auto=format&fit=crop&q=80&w=400', onClick: () => onSelectCategory('mechanic') },
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
