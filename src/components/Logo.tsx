import React from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'white' | 'official-pill';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full', className = '', size = 'md' }) => {
  // Height classes for responsive fitting
  const heightClass =
    size === 'sm' ? 'h-7 sm:h-8' : size === 'lg' ? 'h-11 sm:h-13' : size === 'xl' ? 'h-14 sm:h-16' : 'h-9 sm:h-10';

  const isPillVariant = variant === 'official-pill';
  const isWhiteVariant = variant === 'white';

  if (isPillVariant) {
    return (
      <div className={`bg-white px-3.5 py-2 rounded-xl shadow-md border border-gray-100 flex items-center justify-center inline-flex ${className}`}>
        <img src="/logo.png" alt="DialXprt Logo" className={`${heightClass} w-auto object-contain`} />
      </div>
    );
  }

  return (
    <div className={`flex items-center select-none ${isWhiteVariant ? 'bg-white/95 backdrop-blur px-2 py-1.5 rounded-lg shadow-sm' : ''} ${className}`}>
      <img src="/logo.png" alt="DialXprt Logo" className={`${heightClass} w-auto object-contain`} />
    </div>
  );
};
