import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, ExternalLink, Sparkles } from 'lucide-react';
import { AppLanguage, getTranslation } from '../lib/translations';

interface GoogleFormRegistrationViewProps {
  onBack: () => void;
  currentLang?: AppLanguage;
}

export const GoogleFormRegistrationView: React.FC<GoogleFormRegistrationViewProps> = ({
  onBack,
  currentLang = 'en',
}) => {
  const [countdown, setCountdown] = useState(2);
  const formUrl = "https://forms.gle/QBebhxrHa3s49Ag76";

  const t = (key: string) => getTranslation(currentLang, key);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = formUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header section with brand styles */}
      <div className="flex items-center gap-3 mb-8 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <button
          onClick={onBack}
          className="p-2.5 bg-gray-50 hover:bg-[#1E2875] hover:text-white text-gray-700 rounded-xl transition-all shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center font-bold shadow-sm border border-gray-100 active:scale-95"
          title="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-extrabold text-[#1E2875] tracking-tight">
            List Your Business
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Returning to home in case of cancellation
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 sm:p-12 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-[#1a237e]/5 rounded-2xl flex items-center justify-center mb-6 relative">
          <Loader2 className="w-10 h-10 text-[#F36F21] animate-spin" />
        </div>

        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-3">
          Redirecting to Google Forms
        </h2>
        
        <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-md">
          We are opening the secure registration form. Please complete all details to list your business and start getting free leads!
        </p>

        <div className="bg-[#F4F7FA] border border-gray-100 rounded-2xl p-4 mb-8 w-full max-w-md text-left">
          <h3 className="text-xs font-bold text-[#1E2875] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            Important Note
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            After submitting the form, please click the <strong>"Return to DialXprt"</strong> link on the Google Forms confirmation screen to return back to our website.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
          <a
            href={formUrl}
            className="flex-1 py-3.5 bg-gradient-to-r from-[#1E2875] to-[#1A9E9E] hover:from-[#151C52] hover:to-[#147B7B] text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Open Form Now
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={onBack}
            className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-all active:scale-[0.98]"
          >
            Cancel & Go Back
          </button>
        </div>
        
        <p className="text-[11px] text-gray-400 mt-6">
          Redirecting automatically in {countdown} seconds...
        </p>
      </div>
    </div>
  );
};
