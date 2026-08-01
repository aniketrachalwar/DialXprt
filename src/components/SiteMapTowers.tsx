import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Home, FileText, MousePointerClick } from 'lucide-react';

interface SitePage {
  id: string;
  path: string;
  depth: number; // 1 = home, 2 = 1 click away, 3 = 2 clicks, etc.
  errors: number;
}

const mockData: SitePage[] = [];

export const SiteMapTowers: React.FC = () => {
  const [hoveredPage, setHoveredPage] = useState<SitePage | null>(null);

  // Constants for visualization
  const MAX_HEIGHT = 300; // max px height
  const maxErrors = mockData.length > 0 ? Math.max(...mockData.map(d => d.errors)) : 0;
  
  // Depth mapped to width classes (1 = widest, 5 = narrowest)
  const getWidthClass = (depth: number) => {
    switch(depth) {
      case 1: return 'w-24';
      case 2: return 'w-20';
      case 3: return 'w-16';
      case 4: return 'w-12';
      default: return 'w-8';
    }
  };

  const getColorClass = (errors: number) => {
    if (errors === 0) return 'bg-emerald-400';
    if (errors < 10) return 'bg-amber-400';
    if (errors < 30) return 'bg-orange-500';
    return 'bg-red-600';
  };

  return (
    <div className="w-full bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative z-10 flex flex-col h-full min-h-[500px]">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <AlertTriangle className="text-red-500 w-7 h-7" />
            Site Map Error Topology
          </h2>
          <p className="text-slate-400 font-medium mt-1">
            Visualizing structural errors. Taller towers = more errors. Wider towers = closer to home.
          </p>
        </div>

        {/* Visualization Canvas */}
        <div className="flex-1 flex items-end justify-center gap-2 sm:gap-4 md:gap-8 pb-12 pt-32 mt-auto border-b border-slate-700 relative overflow-x-auto">
          
          <AnimatePresence>
            {hoveredPage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 bg-white rounded-2xl p-5 shadow-2xl min-w-[280px] border border-slate-200 pointer-events-none z-50"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
                  <div className={`p-2 rounded-lg ${hoveredPage.errors > 20 ? 'bg-red-100' : hoveredPage.errors > 0 ? 'bg-amber-100' : 'bg-emerald-100'}`}>
                    {hoveredPage.errors > 0 ? <AlertTriangle className={`w-5 h-5 ${hoveredPage.errors > 20 ? 'text-red-600' : 'text-amber-600'}`} /> : <FileText className="w-5 h-5 text-emerald-600" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Page Path</div>
                    <div className="text-sm font-black text-slate-900 truncate max-w-[180px]">{hoveredPage.path}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-black text-slate-900">{hoveredPage.errors}</div>
                    <div className="text-xs font-bold text-slate-500 mt-1">Total Errors</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-black text-slate-900 flex items-center justify-center gap-1">
                      {hoveredPage.depth}
                    </div>
                    <div className="text-xs font-bold text-slate-500 mt-1">Clicks from Home</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Render Towers */}
          {mockData.map((page, index) => {
            const height = page.errors === 0 ? 10 : Math.max(20, (page.errors / maxErrors) * MAX_HEIGHT);
            
            return (
              <div 
                key={page.id}
                className="relative group flex flex-col items-center justify-end h-[350px] shrink-0"
                onMouseEnter={() => setHoveredPage(page)}
                onMouseLeave={() => setHoveredPage(null)}
              >
                {/* 3D-ish Tower representation */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: height, opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.05, type: 'spring' }}
                  className={`relative cursor-pointer transition-all duration-200 group-hover:brightness-125 ${getWidthClass(page.depth)}`}
                >
                  {/* Top Face (creates 3D effect) */}
                  <div className={`absolute -top-3 left-0 right-0 h-6 -skew-x-12 brightness-125 ${getColorClass(page.errors)} border border-white/20`} />
                  
                  {/* Front Face */}
                  <div className={`w-full h-full ${getColorClass(page.errors)} shadow-lg border-x border-t border-black/20 flex items-end justify-center pb-2 relative z-10 overflow-hidden`}>
                     {/* Window details (stripes) to look like a building */}
                     <div className="absolute inset-0 opacity-10 bg-[linear-gradient(transparent_2px,black_2px)] bg-[size:100%_6px]" />
                     {page.depth === 1 && <Home className="w-5 h-5 text-white/70 mb-2 relative z-20" />}
                  </div>
                </motion.div>
                
                {/* Base Shadow */}
                <div className="w-full h-2 bg-black/50 blur-[2px] rounded-[100%] mt-1 absolute -bottom-1" />
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-400 rounded-[3px] shadow-inner border border-black/10"></div> 0 Errors
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-400 rounded-[3px] shadow-inner border border-black/10"></div> Minor Errors
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded-[3px] shadow-inner border border-black/10"></div> Warnings
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded-[3px] shadow-inner border border-black/10"></div> Critical Errors
          </div>
        </div>
      </div>
    </div>
  );
};
