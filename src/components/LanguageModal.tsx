import React, { useEffect } from 'react';
import { Globe, X, Check } from 'lucide-react';
import { AppLanguage } from '../lib/translations';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
}

const languages = [
  { code: 'en' as AppLanguage, shortLabel: 'ENG', nativeName: 'English', englishName: 'English', flag: '🇬🇧' },
  { code: 'te' as AppLanguage, shortLabel: 'తెలుగు', nativeName: 'తెలుగు', englishName: 'Telugu', flag: '🇮🇳' },
  { code: 'hi' as AppLanguage, shortLabel: 'हिंदी', nativeName: 'हिंदी', englishName: 'Hindi', flag: '🇮🇳' },
];

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onLanguageChange
}) => {

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] transition-opacity animate-fade-in"
        onClick={onClose}
      ></div>
      <div className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-[80] pointer-events-none">
        <div className="bg-white w-full max-w-sm rounded-t-[28px] sm:rounded-2xl p-5 space-y-4 shadow-2xl animate-slide-up sm:animate-fade-in pb-safe border border-gray-200 pointer-events-auto">
          {/* iOS Drag Handle */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto -mt-1 mb-2 sm:hidden"></div>

          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-500" />
              <div>
                <h3 className="font-black text-base text-gray-900">Select Language</h3>
                <p className="text-[11px] text-gray-500 font-medium">భాషను ఎంచుకోండి / भाषा चुनें</p>
              </div>
            </div>
            <button
              onClick={onClose}
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
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all text-left border active:scale-98 ${
                  currentLang === langItem.code
                    ? 'bg-indigo-50/90 border-cyan-500 text-cyan-500 shadow-xs'
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
                  <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center">
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
    </>
  );
};

