import React from 'react';
import { Home, PlusCircle, User, ShieldCheck, Store, Crown } from 'lucide-react';
import { UserRole } from '../types';
import { AppLanguage, getTranslation } from '../lib/translations';

interface BottomNavProps {
  activeTab: 'home' | 'add' | 'account';
  onTabChange: (tab: 'home' | 'add' | 'account') => void;
  currentRole: UserRole;
  pendingCount?: number;
  currentLang?: AppLanguage;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  pendingCount = 0,
  currentLang = 'en',
}) => {
  const t = (key: string) => getTranslation(currentLang, key);

  // Label and badge customized by current active user role
  const getRoleBadgeLabel = () => {
    if (currentRole === 'admin') return t('adminTab');
    if (currentRole === 'volunteer') return t('volunteerTab');
    if (currentRole === 'vendor') return t('shopOwnerTab');
    return t('accountTab');
  };

  const getRoleIcon = () => {
    if (currentRole === 'admin') return <Crown className="w-5 h-5" />;
    if (currentRole === 'volunteer') return <ShieldCheck className="w-5 h-5" />;
    if (currentRole === 'vendor') return <Store className="w-5 h-5" />;
    return <User className="w-5 h-5" />;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200/80 shadow-2xl md:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-3 h-16 max-w-lg mx-auto px-2">
        {/* TAB 1: HOME */}
        <button
          id="bottom-nav-home-btn"
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all active:scale-95 ${
            activeTab === 'home'
              ? 'text-[#2B3990] font-extrabold border-t-2 border-[#2B3990]'
              : 'text-gray-500 hover:text-gray-900 font-medium'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-[#2B3990]' : ''}`} />
          <span className="text-[11px] mt-0.5">{t('homeTab')}</span>
        </button>

        {/* TAB 2: ADD YOUR BUSINESS (Prominent Center Button) */}
        <button
          id="bottom-nav-add-btn"
          onClick={() => onTabChange('add')}
          className="flex flex-col items-center justify-center h-full min-h-[48px] py-1 group relative active:scale-90 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-[#F36F21] hover:bg-orange-600 text-white flex items-center justify-center shadow-lg -mt-5 border-2 border-white">
            <PlusCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-extrabold text-[#F36F21] mt-0.5">{t('addBusinessTab')}</span>
        </button>

        {/* TAB 3: ACCOUNT (Role-Tailored Hub) */}
        <button
          id="bottom-nav-account-btn"
          onClick={() => onTabChange('account')}
          className={`relative flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all active:scale-95 ${
            activeTab === 'account'
              ? 'text-[#2B3990] font-extrabold border-t-2 border-[#2B3990]'
              : 'text-gray-500 hover:text-gray-900 font-medium'
          }`}
        >
          <div className="relative">
            {getRoleIcon()}
            {(currentRole === 'admin' || currentRole === 'volunteer') && pendingCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#F36F21] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-white">
                {pendingCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-0.5">{getRoleBadgeLabel()}</span>
        </button>
      </div>
    </nav>
  );
};
