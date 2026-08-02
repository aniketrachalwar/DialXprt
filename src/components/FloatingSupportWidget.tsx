import React from 'react';
import { PhoneCall } from 'lucide-react';
import { WhatsAppLogo } from './WhatsAppLogo';
import { AppLanguage } from '../lib/translations';

interface FloatingSupportWidgetProps {
  currentLang?: AppLanguage;
}

export const FloatingSupportWidget: React.FC<FloatingSupportWidgetProps> = () => {
  const adminPhone = '7878616178';
  const waSupportUrl = `https://wa.me/917878616178?text=${encodeURIComponent(
    'Hi DialXprt Support, I need help listing my store or finding a local service expert in Hyderabad.'
  )}`;

  return (
    <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] md:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-center gap-2 sm:gap-3">
      {/* 1. Direct Call Icon Button (ON TOP) */}
      <a
        id="floating-direct-call-btn"
        href={`tel:+91${adminPhone}`}
        className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-cyan-500 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-2 border-white min-w-[48px] min-h-[48px]"
        title="Direct Call Helpline"
      >
        <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 animate-pulse" />
      </a>

      {/* 2. Direct WhatsApp Icon Button (BELOW CALL) */}
      <a
        id="floating-whatsapp-btn"
        href={waSupportUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-2 border-white min-w-[48px] min-h-[48px]"
        title="Direct WhatsApp Support"
      >
        <WhatsAppLogo size="lg" />
      </a>
    </div>
  );
};



