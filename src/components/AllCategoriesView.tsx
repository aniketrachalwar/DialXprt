import React, { useMemo, useState, useRef, useEffect } from 'react';
import { ArrowLeft, Search, Mic, MoreHorizontal } from 'lucide-react';
import { Category } from '../types';
import { getTranslation, getCategoryName, AppLanguage } from '../lib/translations';

interface AllCategoriesViewProps {
  categories: Category[];
  onSelectCategory: (slug: string) => void;
  onBack: () => void;
  currentLang?: AppLanguage;
}

export const AllCategoriesView: React.FC<AllCategoriesViewProps> = ({
  categories,
  onSelectCategory,
  onBack,
  currentLang = 'en',
}) => {
  const t = (key: string) => getTranslation(currentLang, key);

  const [searchQuery, setSearchQuery] = useState('');

  const groupedCategories = useMemo(() => {
    const groups: Record<string, Category[]> = {};
    const lowerQuery = searchQuery.toLowerCase();

    categories.forEach(cat => {
      const catName = getCategoryName(cat.slug, cat.name, currentLang).toLowerCase();
      if (!searchQuery || catName.includes(lowerQuery) || cat.slug.toLowerCase().includes(lowerQuery)) {
        const groupName = cat.group || 'Other Services';
        if (!groups[groupName]) {
          groups[groupName] = [];
        }
        groups[groupName].push(cat);
      }
    });
    return groups;
  }, [categories, searchQuery, currentLang]);

  const groupNames = Object.keys(groupedCategories);
  
  const [activeGroup, setActiveGroup] = useState<string>(groupNames[0] || '');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tabsRef = useRef<HTMLDivElement>(null);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140; // Offset for sticky header
      
      let current = activeGroup;
      for (const group of groupNames) {
        const element = sectionRefs.current[group];
        if (element && element.offsetTop <= scrollPosition) {
          current = group;
        }
      }
      
      if (current !== activeGroup) {
        setActiveGroup(current);
        // Try to center the tab
        const tabElement = document.getElementById(`tab-${current}`);
        if (tabElement && tabsRef.current) {
          tabsRef.current.scrollTo({
            left: tabElement.offsetLeft - tabsRef.current.offsetWidth / 2 + tabElement.offsetWidth / 2,
            behavior: 'smooth'
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [groupNames, activeGroup]);

  const scrollToGroup = (groupName: string) => {
    setActiveGroup(groupName);
    const element = sectionRefs.current[groupName];
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 120, // Offset for sticky header height
        behavior: 'smooth'
      });
    }
  };

  const toggleGroupExpand = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm pt-safe">
        {/* Search Bar Row */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-3">
          <button onClick={onBack} className="p-2 -ml-2 shrink-0 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="flex-1 relative flex items-center">
            <Search className="w-5 h-5 text-gray-800 absolute left-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full h-11 pl-10 pr-10 bg-white border border-gray-300 rounded-xl text-[15px] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-xs placeholder-gray-500 font-semibold text-gray-800"
            />
            <Mic className="w-5 h-5 text-blue-600 absolute right-3" />
          </div>
        </div>

        {/* Horizontal Tabs */}
        <div 
          ref={tabsRef}
          className="flex items-center overflow-x-auto hide-scrollbar px-1 sm:px-2 border-t border-gray-100"
        >
          {groupNames.map(group => (
            <button
              key={group}
              id={`tab-${group}`}
              onClick={() => scrollToGroup(group)}
              className={`px-4 py-3.5 whitespace-nowrap text-sm font-bold border-b-2 transition-colors ${
                activeGroup === group 
                  ? 'border-[#0070F0] text-[#0070F0]' 
                  : 'border-transparent text-gray-700 hover:text-gray-900'
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 space-y-8">
        {groupNames.map(groupName => {
          const groupCats = groupedCategories[groupName];
          const isExpanded = expandedGroups[groupName] || searchQuery.length > 0;
          const showMoreThreshold = 6;
          const hasMore = groupCats.length > showMoreThreshold;
          
          const visibleCats = (hasMore && !isExpanded) 
            ? groupCats.slice(0, showMoreThreshold - 1) 
            : groupCats;

          return (
            <div 
              key={groupName} 
              id={`section-${groupName}`}
              ref={(el) => (sectionRefs.current[groupName] = el)}
              className="space-y-4 pt-2"
            >
              <h2 className="text-[15px] font-extrabold text-gray-900 tracking-tight">{groupName}</h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {visibleCats.map(cat => {
                  const catTitle = getCategoryName(cat.slug, cat.name, currentLang);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => onSelectCategory(cat.slug)}
                      className="flex flex-col items-center justify-start gap-1.5 p-1 bg-transparent active:scale-95 transition-transform text-center"
                    >
                      <span className="text-2xl shrink-0 w-[52px] h-[52px] rounded-full flex items-center justify-center bg-gray-50 shadow-sm border border-gray-100">
                        {cat.emoji || '🔹'}
                      </span>
                      <span className="text-[11px] sm:text-xs font-semibold text-gray-800 line-clamp-2 leading-tight px-1 w-full">
                        {catTitle}
                      </span>
                    </button>
                  );
                })}
                
                {hasMore && !isExpanded && (
                  <button
                    onClick={() => toggleGroupExpand(groupName)}
                    className="flex flex-col items-center justify-start gap-1.5 p-1 bg-transparent active:scale-95 transition-transform text-center"
                  >
                    <span className="text-2xl shrink-0 w-[52px] h-[52px] rounded-full flex items-center justify-center bg-gray-50 shadow-sm border border-gray-100">
                      <MoreHorizontal className="w-6 h-6 text-gray-500" />
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-gray-800 line-clamp-2 leading-tight px-1 w-full">
                      Show More
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

