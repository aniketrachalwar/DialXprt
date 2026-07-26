import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Mic,
  MicOff,
  X,
  Zap,
  Wrench,
  ShoppingBag,
  Wind,
  Car,
  Utensils,
  Flame,
  Hammer,
  Paintbrush,
  BookOpen,
  Scissors,
  Navigation,
  Sparkles,
  Volume2,
  User,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Star,
} from 'lucide-react';
import { Category, Vendor } from '../types';
import { AppLanguage, getTranslation, getCategoryName } from '../lib/translations';
import { WhatsAppLogo } from './WhatsAppLogo';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  categories: Category[];
  vendors?: Vendor[];
  onSelectVendor?: (vendor: Vendor) => void;
  onTrackCall?: (vendorId: string) => void;
  onTrackWhatsApp?: (vendorId: string) => void;
  totalVendorsCount: number;
  currentLang?: AppLanguage;
  onLanguageChange?: (lang: AppLanguage) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-4 h-4 text-amber-500" />,
  Wrench: <Wrench className="w-4 h-4 text-blue-500" />,
  ShoppingBag: <ShoppingBag className="w-4 h-4 text-emerald-500" />,
  Wind: <Wind className="w-4 h-4 text-cyan-500" />,
  Car: <Car className="w-4 h-4 text-red-500" />,
  Utensils: <Utensils className="w-4 h-4 text-orange-500" />,
  Flame: <Flame className="w-4 h-4 text-rose-500" />,
  Hammer: <Hammer className="w-4 h-4 text-yellow-600" />,
  Paintbrush: <Paintbrush className="w-4 h-4 text-indigo-500" />,
  BookOpen: <BookOpen className="w-4 h-4 text-purple-500" />,
  Scissors: <Scissors className="w-4 h-4 text-pink-500" />,
  Navigation: <Navigation className="w-4 h-4 text-teal-500" />,
};

type SpeechLang = 'en-IN' | 'te-IN' | 'hi-IN';

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  vendors = [],
  onSelectVendor,
  onTrackCall,
  onTrackWhatsApp,
  totalVendorsCount,
  currentLang = 'en',
  onLanguageChange,
}) => {
  const t = (key: string) => getTranslation(currentLang, key);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [selectedLang, setSelectedLang] = useState<SpeechLang>(
    currentLang === 'te' ? 'te-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN'
  );
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSupported(true);
    }
  }, []);

  useEffect(() => {
    setSelectedLang(currentLang === 'te' ? 'te-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN');
  }, [currentLang]);

  // Click outside listener to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVoiceSearch = () => {
    setSpeechError(null);
    setInterimTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice search is not supported on this browser version. Please try Google Chrome or Safari.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInterimTranscript(currentTranscript);

        if (event.results[0].isFinal) {
          onSearchChange(currentTranscript);
          setIsDropdownOpen(true);
          setIsListening(false);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone access blocked. Please allow mic permissions in browser settings.');
        } else {
          setSpeechError(`Could not hear speech clearly. Try again or select a different language.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
      setSpeechError('Voice search initialization error.');
    }
  };

  // Filter matching profile suggestions based on search query
  const q = searchQuery.trim().toLowerCase();
  const matchingVendors = q
    ? vendors.filter((v) => {
        const matchesName = v.name.toLowerCase().includes(q);
        const matchesOwner = v.ownerName.toLowerCase().includes(q);
        const matchesCat = (v.category || '').toLowerCase().includes(q) || (v.categorySlug || '').toLowerCase().includes(q);
        const matchesLoc = (v.neighborhood || '').toLowerCase().includes(q) || (v.address || '').toLowerCase().includes(q);
        const matchesPhone = (v.phone || '').includes(q) || (v.whatsapp || '').includes(q);
        return matchesName || matchesOwner || matchesCat || matchesLoc || matchesPhone;
      }).slice(0, 6)
    : [];

  const matchingCategories = q
    ? categories.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)).slice(0, 3)
    : [];

  return (
    <div className="w-full bg-[#1A237E] pt-2 pb-5 px-3 sm:px-6 rounded-b-2xl shadow-lg border-b border-indigo-900/40">
      <div className="max-w-4xl mx-auto space-y-3" ref={containerRef}>
        {/* Main Search Input Container */}
        <div className="relative">
          <div className="relative flex items-center bg-white rounded-2xl shadow-md border-2 border-orange-400/80 focus-within:border-[#F36F21] transition-all overflow-hidden">
            <div className="pl-3 pr-1.5 text-indigo-900 shrink-0">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#2B3990]" />
            </div>

            <input
              id="main-search-input"
              type="text"
              value={searchQuery}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setIsDropdownOpen(true);
              }}
              placeholder={t('searchPlaceholder')}
              className="w-full py-2.5 sm:py-3 px-1 text-sm sm:text-base font-medium text-gray-900 placeholder-gray-400 focus:outline-none min-h-[44px]"
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  setIsDropdownOpen(false);
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600 min-w-[36px] min-h-[36px] flex items-center justify-center shrink-0"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Voice Search Mic Button */}
            <button
              id="voice-search-btn"
              onClick={handleVoiceSearch}
              className={`mx-1 p-2 rounded-xl min-w-[40px] min-h-[40px] flex items-center justify-center transition-all shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-300'
                  : 'bg-indigo-50 text-[#2B3990] hover:bg-indigo-100'
              }`}
              title="Speak into microphone to search"
            >
              {isListening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>

          {/* INSTAGRAM-STYLE LIVE MATCHING PROFILES DROPDOWN */}
          {isDropdownOpen && q.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden divide-y divide-gray-100 animate-fade-in max-h-[75vh] overflow-y-auto">
              {/* Section Header: Matching Profiles */}
              {matchingVendors.length > 0 ? (
                <div className="p-3 bg-gray-50/60">
                  <div className="flex items-center justify-between text-[11px] font-black text-gray-500 uppercase tracking-wider px-2 pb-2">
                    <span className="flex items-center gap-1.5 text-[#2B3990]">
                      <User className="w-3.5 h-3.5 text-[#F36F21]" />
                      Matching Profiles ({matchingVendors.length})
                    </span>
                    <span className="text-[10px] text-gray-400 font-normal">Tap to view expert</span>
                  </div>

                  <div className="space-y-1.5">
                    {matchingVendors.map((vendor) => (
                      <div
                        key={vendor.id}
                        onClick={() => {
                          setIsDropdownOpen(false);
                          if (onSelectVendor) onSelectVendor(vendor);
                        }}
                        className="group flex items-center justify-between p-2.5 rounded-2xl hover:bg-indigo-50/80 border border-transparent hover:border-indigo-100 transition-all cursor-pointer"
                      >
                        {/* Left: Instagram Style Avatar + Details */}
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Avatar with Verified Ring */}
                          <div className="relative shrink-0">
                            <img
                              src={vendor.imageUrl}
                              alt={vendor.name}
                              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-indigo-200 group-hover:border-[#F36F21] transition-all shadow-xs"
                            />
                            {vendor.isVerified && (
                              <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white rounded-full p-0.5 border border-white shadow-xs">
                                <CheckCircle2 className="w-3 h-3 fill-emerald-500 text-white" />
                              </span>
                            )}
                          </div>

                          {/* Text Info */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 group-hover:text-[#2B3990] truncate">
                                {vendor.name}
                              </h4>
                              <span className="bg-indigo-100 text-[#2B3990] text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                {vendor.category}
                              </span>
                            </div>

                            <p className="text-[11px] text-gray-600 truncate flex items-center gap-1.5 mt-0.5">
                              <span className="font-semibold text-gray-800">{vendor.ownerName}</span>
                              <span className="text-gray-300">•</span>
                              <span className="flex items-center gap-0.5 text-gray-600">
                                <MapPin className="w-3 h-3 text-[#F36F21]" /> {vendor.neighborhood}
                                {vendor.distanceKm !== undefined && ` (${vendor.distanceKm} km)`}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Right: Quick Action Buttons */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                          {/* Direct Call */}
                          <a
                            href={`tel:${vendor.phone}`}
                            onClick={() => onTrackCall && onTrackCall(vendor.id)}
                            className="p-2.5 rounded-xl bg-indigo-100 hover:bg-[#2B3990] text-[#2B3990] hover:text-white transition-all shadow-2xs min-w-[38px] min-h-[38px] flex items-center justify-center"
                            title={`Call ${vendor.name}`}
                          >
                            <PhoneCall className="w-4 h-4" />
                          </a>

                          {/* Direct WhatsApp */}
                          <a
                            href={`https://wa.me/${vendor.whatsapp.startsWith('91') ? vendor.whatsapp : '91' + vendor.whatsapp}?text=${encodeURIComponent(`Hi ${vendor.ownerName}, I found your store on DialXprt Hyderabad.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => onTrackWhatsApp && onTrackWhatsApp(vendor.id)}
                            className="p-2.5 rounded-xl bg-emerald-100 hover:bg-[#25D366] text-emerald-700 hover:text-white transition-all shadow-2xs min-w-[38px] min-h-[38px] flex items-center justify-center"
                            title={`WhatsApp ${vendor.name}`}
                          >
                            <WhatsAppLogo size="sm" />
                          </a>

                          {/* View Detail Arrow */}
                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              if (onSelectVendor) onSelectVendor(vendor);
                            }}
                            className="p-2.5 rounded-xl bg-gray-100 group-hover:bg-[#F36F21] text-gray-600 group-hover:text-white transition-all min-w-[38px] min-h-[38px] flex items-center justify-center"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-gray-500">
                  No matching experts or stores found for "{searchQuery}". Try searching "Auto", "Plumber", "Syed", "Ramesh", or "Kirana".
                </div>
              )}

              {/* Section: Matching Category Quick Filters */}
              {matchingCategories.length > 0 && (
                <div className="p-3 bg-white">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-2 pb-1.5">
                    Matching Categories
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-2">
                    {matchingCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onSelectCategory(cat.slug);
                          setIsDropdownOpen(false);
                        }}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-[#2B3990] text-[#2B3990] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <span>{cat.name}</span>
                        <span className="bg-indigo-200/60 text-current text-[10px] px-1.5 rounded-full">
                          {cat.activeProvidersCount}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer: Trigger full grid view search */}
              <div
                onClick={() => setIsDropdownOpen(false)}
                className="p-2.5 bg-indigo-900 text-white text-center text-xs font-extrabold cursor-pointer hover:bg-indigo-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>Show all matching results in list for "{searchQuery}"</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </div>
            </div>
          )}
        </div>

        {/* Listening / Audio Feedback Overlay Modal */}
        {isListening && (
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl p-4 shadow-xl border border-white/20 animate-fade-in flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-ping shrink-0">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-extrabold text-sm flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  <span>{t('listeningNow')} {selectedLang === 'en-IN' ? 'English' : selectedLang === 'te-IN' ? 'Telugu (తెలుగు)' : 'Hindi (हिंदी)'}...</span>
                </p>
                <p className="text-xs text-orange-100 mt-0.5">
                  {interimTranscript ? (
                    <span className="font-bold underline">"{interimTranscript}"</span>
                  ) : (
                    <span>{t('voiceHint')}</span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsListening(false)}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-3 py-1.5 rounded-xl text-xs shrink-0"
            >
              {t('cancelVoice')}
            </button>
          </div>
        )}

        {/* Speech Error Alert Banner */}
        {speechError && (
          <div className="bg-red-100 border border-red-300 text-red-900 px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-2">
            <span>{speechError}</span>
            <button onClick={() => setSpeechError(null)} className="text-red-700 hover:text-red-900 font-bold">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Quick Stats Header */}
        <div className="flex items-center justify-between text-xs text-indigo-200 px-1 pt-1">
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <Sparkles className="w-4 h-4 text-[#F36F21]" />
            <span>Search 17+ Service Categories (Electricians, Plumbers, Auto, Cooks & Stores)</span>
          </div>
          <span className="text-[11px] font-bold text-amber-300 bg-indigo-900/80 px-2.5 py-1 rounded-full border border-indigo-500/30">
            {totalVendorsCount} {t('verifiedExpertsNear')}
          </span>
        </div>
      </div>
    </div>
  );
};

