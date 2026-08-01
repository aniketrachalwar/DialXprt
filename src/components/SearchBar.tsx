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
  compact?: boolean;
  currentNeighborhood?: string;
  onOpenLocation?: () => void;
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
  compact = false,
  currentNeighborhood = 'Hyderabad',
  onOpenLocation,
}) => {
  const t = (key: string) => getTranslation(currentLang, key);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [selectedLang, setSelectedLang] = useState<SpeechLang>(
    currentLang === 'te' ? 'te-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN'
  );
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Typewriter Animation State
  const [placeholderText, setPlaceholderText] = useState('');
  const [termIndex, setTermIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Typewriter Effect Logic
  useEffect(() => {
    const terms = [
      'Electricians',
      'Plumbers',
      'AC Repair',
      'Restaurants',
      'Mechanics',
      'Caterers',
      'Beauty Parlours',
      'Hospitals',
      'Kirana Stores'
    ];
    
    let typingSpeed = isDeleting ? 40 : 100;
    const currentTerm = terms[termIndex];
    const fullText = currentTerm + '...';

    if (!isDeleting && placeholderText === fullText) {
      const timeout = setTimeout(() => setIsDeleting(true), 2000); // Pause when word is complete
      return () => clearTimeout(timeout);
    } else if (isDeleting && placeholderText === '') {
      setIsDeleting(false);
      setTermIndex((prev) => (prev + 1) % terms.length);
      return;
    }

    const timeout = setTimeout(() => {
      setPlaceholderText((current) => {
        if (isDeleting) {
          return current.slice(0, -1);
        } else {
          return fullText.slice(0, current.length + 1);
        }
      });
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [placeholderText, isDeleting, termIndex]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSupported(true);
    }
  }, []);

  useEffect(() => {
    setSelectedLang(currentLang === 'te' ? 'te-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN');
  }, [currentLang]);

  const PREDICTIVE_TAGS: Record<string, string[]> = {
    'sound system': ['Dealer', 'Rent', 'Repair', 'Installation'],
    'ac': ['Repair', 'Installation', 'Gas Filling', 'Service'],
    'car': ['Mechanic', 'Wash', 'Accessories', 'Detailing'],
    'gym': ['Trainer', 'Equipment', 'Membership', 'Yoga'],
    'plumber': ['Emergency', 'Installation', 'Leakage', 'Pipe Fitting'],
    'electrician': ['Wiring', 'Appliance Repair', 'Installation'],
    'laptop': ['Repair', 'Screen Replacement', 'SSD Upgrade', 'Battery'],
    'mobile': ['Screen Repair', 'Battery', 'Accessories', 'Water Damage'],
    'ro': ['Service', 'Installation', 'Filter Change', 'Repair'],
    'cctv': ['Installation', 'Repair', 'AMC', 'Dealer'],
  };

  const getPredictiveTags = () => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    for (const [key, tags] of Object.entries(PREDICTIVE_TAGS)) {
      if (q.includes(key)) {
        // filter out tags already in the query
        return tags.filter(t => !q.includes(t.toLowerCase()));
      }
    }
    return [];
  };

  const predictiveTags = getPredictiveTags();


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


  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto" ref={containerRef}>
        <div className="relative">
          <div className="relative flex items-center bg-white rounded-full shadow-sm border border-gray-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all overflow-hidden h-12 md:h-14">
            
            <div className="pl-4 pr-2 text-gray-500 shrink-0">
              <Search className="w-5 h-5" />
            </div>

            <input
              id="main-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={`Search '${placeholderText.replace('...', '')}'`}
              className="w-full py-2.5 px-1 text-sm md:text-base font-medium text-gray-800 placeholder-gray-400 focus:outline-none h-full bg-transparent"
            />

            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1.5 text-gray-400 hover:text-gray-600 min-w-[36px] min-h-[36px] flex items-center justify-center shrink-0"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              id="voice-search-btn"
              onClick={handleVoiceSearch}
              className={`mr-2 w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${
                isListening
                  ? 'bg-red-100 text-red-500 animate-pulse'
                  : 'bg-indigo-50 text-indigo-500 hover:bg-indigo-100'
              }`}
              title="Speak into microphone to search"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Predictive Search Chips */}
          {predictiveTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-2 px-2 animate-fade-in">
              <span className="text-xs text-gray-500 font-medium">Suggestions:</span>
              {predictiveTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onSearchChange(`${searchQuery.trim()} ${tag}`)}
                  className="px-2.5 py-1 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 text-gray-600 text-xs font-semibold rounded-full transition-colors shadow-sm"
                >
                  +{tag}
                </button>
              ))}
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


      </div>
    </div>
  );
};

