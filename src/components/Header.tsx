import React, { useState } from 'react';
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
  onOpenLanguage
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

  return (
    <header className="sticky top-0 z-40 bg-[#0F5C5C] text-white shadow-md transition-all pt-safe">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 py-2">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Logo Section - Navigates Home */}
          <div
            id="header-logo-home-btn"
            className="flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity shrink-0"
            onClick={onGoHome}
            title={t('homeTab')}
          >
            <Logo variant="white" size="md" />
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

          {/* Language Switcher Section */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mobile Language Button (Visible on phone < sm) */}
            <button
              id="mobile-language-picker-btn"
              onClick={onOpenLanguage}
              className="flex sm:hidden items-center gap-1.5 bg-indigo-950/40 hover:bg-white/10 px-2 py-1.5 rounded-lg border border-indigo-500/20 active:scale-95 transition-all min-h-[38px] text-xs font-bold"
              title="Change app language"
            >
              <Globe className="w-3.5 h-3.5 text-[#F36F21] shrink-0" />
              <span className="text-xs font-black text-amber-300">{activeLangObj.shortLabel}</span>
              <ChevronDown className="w-3 h-3 text-indigo-300 shrink-0" />
            </button>

            {/* Desktop Language Switcher Bar (Visible on sm and above) */}
            <div className="hidden sm:flex items-center bg-indigo-950/80 p-1 rounded-xl border border-indigo-500/30 shrink-0">
              <Globe className="w-3.5 h-3.5 text-indigo-300 ml-1.5 mr-1 shrink-0" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-black transition-all ${
                    currentLang === lang.code
                      ? 'bg-[#F36F21] text-white shadow-xs'
                      : 'text-indigo-200 hover:text-white hover:bg-indigo-800/60'
                  }`}
                  title={lang.englishName}
                >
                  {lang.shortLabel}
                </button>
              ))}
            </div>



            {/* User Profile / Account Hub Button */}
            <button
              id="user-auth-btn"
              onClick={onOpenAccount}
              className={`flex items-center gap-1 ${userPhone ? 'bg-white/10 hover:bg-white/20' : 'bg-[#F36F21] hover:bg-orange-600 shadow-sm'} text-white p-1.5 sm:px-2.5 rounded-full sm:rounded-lg text-xs font-semibold min-w-[38px] min-h-[38px] justify-center transition-all`}
              title={userPhone ? t('accountHub') : 'Login'}
            >
              <User className={`w-4 h-4 ${userPhone ? 'text-[#F36F21]' : 'text-white'}`} />
              <span className="hidden sm:inline">{userPhone ? 'Profile' : 'Login'}</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
