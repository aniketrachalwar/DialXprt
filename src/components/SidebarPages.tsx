import React from 'react';
import {
  Heart,
  Bookmark,
  Receipt,
  Headphones,
  UserCheck,
  Shield,
  MessageSquare,
  HelpCircle,
  ArrowLeft,
  Construction
} from 'lucide-react';

interface SidebarPagesProps {
  activeTab: string;
  onBack: () => void;
}

const PageData: Record<string, { title: string; icon: React.FC<any>; description: string; color: string; bg: string }> = {
  favorites: {
    title: 'Favorites',
    icon: Heart,
    description: 'Save your favorite service providers here for quick access. This feature is coming soon.',
    color: 'text-rose-500',
    bg: 'bg-rose-50'
  },
  saved: {
    title: 'Saved Collections',
    icon: Bookmark,
    description: 'Organize professionals into custom lists for your upcoming projects.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50'
  },

};

export const SidebarPages: React.FC<SidebarPagesProps> = ({ activeTab, onBack }) => {
  const data = PageData[activeTab];

  if (!data) return null;

  const Icon = data.icon;

  return (
    <div className="min-h-[80vh] bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center space-y-6 relative overflow-hidden">
        
        {/* Decorative background element */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-50 ${data.bg}`}></div>
        <div className={`absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-50 ${data.bg}`}></div>

        <button 
          onClick={onBack}
          className="absolute top-6 left-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative z-10 space-y-5">
          <div className={`w-24 h-24 mx-auto rounded-3xl ${data.bg} flex items-center justify-center transform rotate-3 shadow-inner`}>
            <Icon className={`w-12 h-12 ${data.color} transform -rotate-3`} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{data.title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[280px] mx-auto">
              {data.description}
            </p>
          </div>

          <div className="pt-4">
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider">
              <Construction className="w-4 h-4 text-gray-400" />
              <span>Coming Soon</span>
            </div>
          </div>
          
          <button 
            onClick={onBack}
            className="w-full mt-6 bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 shadow-md shadow-gray-900/20"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

