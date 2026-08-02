import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Mic, 
  Grid, 
  Target,
  Plus,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { fetchB2BProducts, B2BProduct } from '../lib/adminApi';

export const B2BView: React.FC = () => {
  const [activeCategoryTab, setActiveCategoryTab] = useState('Construction & Real Estate');
  const [sportsProducts, setSportsProducts] = useState<B2BProduct[]>([]);

  useEffect(() => {
    async function load() {
      const prods = await fetchB2BProducts();
      setSportsProducts(prods);
    }
    load();
  }, []);

  const topCategories = [
    { name: 'Construction & Real Estate', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200&h=200' },
    { name: 'Industrial Machinery', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200&h=200' },
    { name: 'Electronic Component', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200&h=200' },
    { name: 'Apparel & Fashion', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=200&h=200' },
  ];

  const exploreCategories = ['Construction & Real Estate', 'Food & Beverage', 'IT Components', 'Industrial Supply'];

  const subCategories = [
    { name: 'Hardware', image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=100&h=100' },
    { name: 'Real Estate', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=100&h=100' },
    { name: 'Drainage Products', image: 'https://images.unsplash.com/photo-1585671911429-cda043b23267?auto=format&fit=crop&q=80&w=100&h=100' },
    { name: 'Real Estate Structures', image: 'https://images.unsplash.com/photo-1428366890462-dd4baecf492b?auto=format&fit=crop&q=80&w=100&h=100' },
    { name: 'Building & Construction Services', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=100&h=100' },
  ];



  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Search Bar */}
        <div className="px-4">
          <div className="flex items-center bg-white border border-gray-300 rounded-xl px-3 py-3.5 shadow-sm">
            <Search className="w-5 h-5 text-gray-800" />
            <input 
              type="text" 
              placeholder='Search "Packaging Material..."'
              className="flex-1 ml-3 bg-transparent outline-none text-[15px] font-semibold text-gray-600 placeholder-gray-500"
            />
            <Mic className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        {/* Hero Banner */}
        <div className="px-4">
          <div className="bg-gradient-to-r from-teal-400 to-teal-200 rounded-2xl p-5 relative overflow-hidden h-[180px] shadow-sm">
            <div className="w-2/3 h-full flex flex-col justify-center space-y-2 relative z-10">
              <h2 className="text-2xl font-black text-gray-900 leading-tight">Siemens<br/>MCB</h2>
              <p className="text-xs text-gray-800 font-medium">Ingenuity for life</p>
              <button className="bg-gray-900 text-white text-sm font-bold px-4 py-1.5 rounded-full w-max mt-1 hover:bg-black transition-colors">
                Source Now
              </button>
            </div>
            {/* Banner Image Placeholder */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-center justify-end pr-2">
              <img 
                src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=300&h=300" 
                alt="Product" 
                className="h-[120%] object-contain mix-blend-multiply opacity-90 transform translate-x-4"
              />
            </div>
            {/* Dots */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {[0,1,2,3,4,5,6,7].map(i => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/40'}`}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-3 bg-white border border-gray-100 rounded-xl py-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-indigo-50 p-1.5 rounded-lg">
              <Grid className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="font-semibold text-sm text-gray-900">All Categories</span>
          </button>
          
          <button className="flex-1 flex items-center justify-center gap-3 bg-white border border-gray-100 rounded-xl py-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-rose-50 p-1.5 rounded-lg">
              <Target className="w-6 h-6 text-rose-600" />
            </div>
            <span className="font-semibold text-sm text-gray-900">Post Requirement</span>
          </button>
        </div>

        {/* Top Categories */}
        <div className="px-4">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {topCategories.map((cat, i) => (
              <div key={i} className="flex flex-col items-center gap-2 min-w-[80px]">
                <div className="w-[84px] h-[84px] rounded-full overflow-hidden bg-gray-100 p-1 shadow-sm border border-gray-50">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="text-[11px] font-semibold text-center leading-tight text-gray-900">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Explore By Categories */}
        <div className="px-4 space-y-4">
          <h3 className="font-bold text-[17px] text-gray-900">Explore By Categories</h3>
          
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {exploreCategories.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveCategoryTab(tab)}
                className={`whitespace-nowrap px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
                  activeCategoryTab === tab 
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50' 
                    : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {subCategories.map((sub, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-between p-3.5 ${
                  i !== subCategories.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 p-1 overflow-hidden">
                    <img src={sub.image} alt={sub.name} className="w-full h-full object-cover rounded-md" />
                  </div>
                  <span className="font-bold text-gray-900 text-[15px]">{sub.name}</span>
                </div>
                <button className="p-2 hover:bg-gray-50 rounded-full">
                  <Plus className="w-5 h-5 text-gray-900 stroke-[3]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Box */}
        <div className="px-4">
          <div className="bg-[#EEF4FF] rounded-2xl p-5 border border-blue-100/50 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Tell us what you need</h3>
              <p className="text-sm text-gray-700 mt-1">We will help you find verified sellers</p>
            </div>
            
            <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-3">
              <Search className="w-4 h-4 text-blue-500" />
              <input 
                type="text" 
                placeholder="Search by Product Name"
                className="flex-1 ml-2 text-sm outline-none bg-transparent placeholder-gray-400"
              />
            </div>
            
            <button className="w-full bg-[#0074D9] hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
              Get Verified Sellers <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Showcase - Sports */}
        <div className="px-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-900">Sports & Entertainment</h3>
            <ChevronRight className="w-5 h-5 text-gray-900 stroke-[3]" />
          </div>
          
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {sportsProducts.map((prod, i) => (
              <div key={i} className="min-w-[120px] max-w-[120px] bg-gray-100 rounded-xl p-3 flex flex-col h-[160px]">
                <h4 className="font-semibold text-gray-900 text-[13px] leading-tight line-clamp-2 h-10">{prod.name}</h4>
                <div className="mt-auto w-full aspect-square bg-white rounded-lg overflow-hidden flex items-center justify-center p-1 shadow-sm">
                  <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom spacer for safe area */}
        <div className="h-6"></div>
      </div>
    </div>
  );
};

