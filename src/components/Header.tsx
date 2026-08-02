import React, { useState, useEffect } from 'react';
import { MapPin, PlusCircle, Bell, User, ShieldCheck, Crown, Store, Globe, Home, ChevronDown, Check, X } from 'lucide-react';
import { UserRole } from '../types';
import { Logo } from './Logo';
import { AppLanguage, getTranslation } from '../lib/translations';

interface HeaderProps {
  currentNeighborhood: string;
  isAutoDetected: boolean;
  onOpenLocationModal: () => void;
  onOpenRegistration: () => void;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  onOpenAccount: () => void;
  onGoHome: () => void;
  currentRole: UserRole;
  onToggleRole: (role: UserRole) => void;
  unreadNotificationsCount: number;
  userPhone?: string;
  currentLang: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  renderCompactSearch?: React.ReactNode;
  onOpenLanguage: () => void;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  currentNeighborhood,
  isAutoDetected,
  onOpenLocationModal,
  onOpenRegistration,
  onOpenAuth,
  onOpenNotifications,
  onOpenAccount,
  onGoHome,
  currentRole,
  onToggleRole,
  unreadNotificationsCount,
  userPhone,
  currentLang,
  onLanguageChange,
  renderCompactSearch,
  onOpenLanguage,
  children
}) => {
  const t = (key: string) => getTranslation(currentLang, key);

  const getRoleBadge = () => {
    if (currentRole === 'admin') return { label: t('adminTab'), icon: Crown, bg: 'bg-purple-600 text-white' };
    if (currentRole === 'volunteer') return { label: t('volunteerTab'), icon: ShieldCheck, bg: 'bg-amber-500 text-gray-900' };
    if (currentRole === 'vendor') return { label: t('shopOwnerTab'), icon: Store, bg: 'bg-blue-600 text-white' };
    return { label: t('customer'), icon: User, bg: 'bg-emerald-600 text-white' };
  };

  const roleInfo = getRoleBadge();

  const languages = [
    { code: 'en' as AppLanguage, shortLabel: 'ENG', nativeName: 'English', englishName: 'English', flag: '🇬🇧' },
    { code: 'te' as AppLanguage, shortLabel: 'తెలుగు', nativeName: 'తెలుగు', englishName: 'Telugu', flag: '🇮🇳' },
    { code: 'hi' as AppLanguage, shortLabel: 'हिंदी', nativeName: 'हिंदी', englishName: 'Hindi', flag: '🇮🇳' },
  ];

  const activeLangObj = languages.find((l) => l.code === currentLang) || languages[0];

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 bg-white/90 backdrop-blur-md text-gray-900 shadow-sm border-b border-gray-100 transition-all pt-safe group ${isScrolled ? 'is-scrolled' : ''}`}>
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 py-3">
        {!isScrolled && (
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-3">
            {/* Logo Section - Navigates Home */}
            <div
              id="header-logo-home-btn"
              className="flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity shrink-0"
              onClick={onGoHome}
              title={t('homeTab')}
            >
              <Logo variant="default" size="md" />
              <span className="text-[9px] sm:text-[10px] bg-[#F36F21] text-white font-black px-1.5 py-0.5 rounded uppercase tracking-wider self-start mt-0.5">
                HYD
              </span>
            </div>

            {/* Optional Compact Search Bar (Sticky Mode) */}
            {renderCompactSearch && (
              <div className="hidden md:block flex-1 max-w-2xl mx-4">
                {renderCompactSearch}
              </div>
            )}

            <div className="flex items-center gap-1.5 shrink-0">

              {/* User Profile / Account Hub Button */}
              <button
                id="user-auth-btn"
                onClick={onOpenAccount}
                className={`flex items-center justify-center ${userPhone ? 'bg-gray-100 hover:bg-gray-200 rounded-lg sm:px-2.5 gap-1 min-h-[38px] min-w-[38px]' : 'bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 rounded-full w-10 h-10'} text-white shadow-sm transition-all`}
                title={userPhone ? t('accountHub') : 'Login'}
              >
                <User className={`w-5 h-5 ${userPhone ? 'text-[#F36F21]' : 'text-white'}`} />
                {userPhone && <span className="hidden sm:inline">Profile</span>}
              </button>
            </div>
          </div>
        )}

        {/* Children (SearchBar, Filters, etc.) */}
        {children && (
          <div>
            {children}
          </div>
        )}
      </div>
    </header>
  );
};



