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
}) => {
  const [isLangModalOpen, setIsLangModalOpen] = useState<boolean>(false);
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
    <header className="sticky top-0 z-40 bg-[#1A237E] text-white shadow-md transition-all pt-safe">
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

          {/* Desktop Location Picker Pill (Visible on sm and up) */}
          <button
            id="location-picker-desktop-btn"
            onClick={onOpenLocationModal}
            className="hidden sm:flex items-center gap-1.5 bg-indigo-900/80 hover:bg-indigo-800 text-white px-3 py-1.5 rounded-full text-xs font-semibold border border-indigo-500/40 transition-all min-h-[40px] shrink overflow-hidden"
            title="Change location"
          >
            <MapPin className={`w-3.5 h-3.5 shrink-0 ${isAutoDetected ? 'text-green-400 animate-pulse' : 'text-[#F57C00]'}`} />
            <span className="truncate max-w-[140px] text-xs">
              {currentNeighborhood || t('hyderabad')}
            </span>
            <span className="text-[10px] text-indigo-300 shrink-0">▼</span>
          </button>

          {/* Language Switcher Section */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mobile Language Button (Visible on phone < sm) */}
            <button
              id="mobile-language-picker-btn"
              onClick={() => setIsLangModalOpen(true)}
              className="flex sm:hidden items-center gap-1 bg-indigo-950/90 hover:bg-indigo-900 text-white px-2.5 py-1.5 rounded-xl border border-amber-400/50 shadow-xs active:scale-95 transition-all min-h-[38px] text-xs font-bold"
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

            {/* Notifications Bell */}
            <button
              id="notifications-bell-btn"
              onClick={onOpenNotifications}
              className="relative p-1.5 rounded-full text-indigo-200 hover:text-white hover:bg-indigo-800/80 transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center"
              title={t('notifications')}
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User Profile / Account Hub Button */}
            <button
              id="user-auth-btn"
              onClick={onOpenAccount}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white p-1.5 sm:px-2.5 rounded-full sm:rounded-lg text-xs font-semibold min-w-[38px] min-h-[38px] justify-center"
              title={t('accountHub')}
            >
              <User className="w-4 h-4 text-[#F36F21]" />
              <span className="hidden sm:inline">{t('accountTab')}</span>
            </button>
          </div>
        </div>

        {/* Dedicated Mobile Location Selector Bar (Visible on phone < sm) */}
        <div className="mt-1.5 sm:hidden">
          <button
            id="location-picker-mobile-bar-btn"
            onClick={onOpenLocationModal}
            className="w-full flex items-center justify-between bg-indigo-950/80 hover:bg-indigo-900/90 text-white px-3 py-1.5 rounded-xl border border-indigo-500/40 shadow-xs transition-all active:scale-98"
          >
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className={`w-4 h-4 shrink-0 ${isAutoDetected ? 'text-green-400 animate-pulse' : 'text-[#F57C00]'}`} />
              <div className="text-left min-w-0">
                <div className="flex items-center gap-1 text-[10px] text-indigo-300 font-semibold uppercase tracking-wide">
                  <span>Current Area</span>
                  {isAutoDetected && <span className="bg-green-500/20 text-green-300 px-1 rounded text-[9px]">GPS</span>}
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {currentNeighborhood || t('hyderabad')}
                </div>
              </div>
            </div>
            <span className="text-xs font-extrabold text-[#F36F21] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-lg flex items-center gap-1 shrink-0 ml-2">
              <span>Change</span>
              <ChevronDown className="w-3 h-3" />
            </span>
          </button>
        </div>
      </div>

      {/* iOS / Mobile Style Language Selection Bottom Sheet */}
      {isLangModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in text-gray-900">
          <div className="bg-white w-full max-w-sm rounded-t-[28px] sm:rounded-2xl p-5 space-y-4 shadow-2xl animate-slide-up sm:animate-fade-in pb-safe border border-gray-200">
            {/* iOS Drag Handle */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto -mt-1 mb-2 sm:hidden"></div>

            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#2B3990]" />
                <div>
                  <h3 className="font-black text-base text-gray-900">Select Language</h3>
                  <p className="text-[11px] text-gray-500 font-medium">భాషను ఎంచుకోండి / भाषा चुनें</p>
                </div>
              </div>
              <button
                onClick={() => setIsLangModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 pt-1">
              {languages.map((langItem) => (
                <button
                  key={langItem.code}
                  onClick={() => {
                    onLanguageChange(langItem.code);
                    setIsLangModalOpen(false);
                  }}
                  className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all text-left border active:scale-98 ${
                    currentLang === langItem.code
                      ? 'bg-indigo-50/90 border-[#2B3990] text-[#2B3990] shadow-xs'
                      : 'bg-gray-50/80 border-gray-200 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{langItem.flag}</span>
                    <div>
                      <p className="text-sm font-black text-gray-900">{langItem.nativeName}</p>
                      <p className="text-xs text-gray-500">{langItem.englishName}</p>
                    </div>
                  </div>
                  {currentLang === langItem.code ? (
                    <div className="w-6 h-6 rounded-full bg-[#2B3990] text-white flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-gray-300"></div>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2 text-center">
              <p className="text-[10px] text-gray-400">
                DialXprt automatically translates all Hyderabad vendor lists & services.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
