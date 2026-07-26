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

  const isWhiteVariant = variant === 'white';
  const isPillVariant = variant === 'official-pill';

  if (isPillVariant) {
    return (
      <div className={`bg-white px-3.5 py-2 rounded-xl shadow-md border border-gray-100 flex items-center gap-2.5 inline-flex ${className}`}>
        <LogoGraphic heightClass={heightClass} />
        <LogoText isWhiteText={false} showTagline={size !== 'sm'} />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <LogoGraphic heightClass={heightClass} />
      <LogoText isWhiteText={isWhiteVariant} showTagline={variant === 'full'} />
    </div>
  );
};

// 1:1 Vector Reproduction of Official DialXprt Mark (Orange 'D' + Blue Receiver)
const LogoGraphic: React.FC<{ heightClass: string }> = ({ heightClass }) => (
  <svg
    viewBox="0 0 110 95"
    className={`${heightClass} w-auto shrink-0 filter drop-shadow-xs`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer Orange 'D' Crescent Shape */}
    <path
      d="M 15 5 L 50 5 C 75 5 95 24 95 47.5 C 95 71 75 90 50 90 L 15 90 L 15 5 Z"
      fill="#F36F21"
    />

    {/* Inner White Cutout Space inside 'D' */}
    <path
      d="M 36 24 L 48 24 C 60 24 70 34 70 47.5 C 70 61 60 71 48 71 L 36 71 L 36 24 Z"
      fill="#FFFFFF"
    />

    {/* Dark Royal Blue Diagonal Telephone Receiver Handset */}
    <g transform="translate(5, 0)">
      {/* Phone Handle Body */}
      <path
        d="M 64 21 C 61 19 56 22 55 26 L 49 39 C 48 41 49 44 51 46 C 54 49 57 52 61 56 C 65 60 68 63 71 66 C 73 68 76 69 78 68 L 91 62 C 95 61 98 56 96 53 C 92 41 76 25 64 21 Z"
        fill="#2B3990"
      />
      
      {/* Receiver Diagonal Slant Crossing the D */}
      <path
        d="M 28 85 C 24 85 20 81 22 75 L 34 38 C 36 32 42 28 48 29 L 58 31 C 61 32 63 35 62 38 L 58 50 C 57 53 54 55 51 54 L 45 52 C 43 51 41 52 40 54 C 36 60 32 67 30 73 C 29 76 31 78 33 78 L 38 78 C 41 78 44 81 43 84 L 41 89 C 40 92 36 94 33 93 L 28 85 Z"
        fill="#2B3990"
      />

      {/* Connection bar bridging handset caps */}
      <path
        d="M 45 32 L 72 68 L 62 75 L 35 39 Z"
        fill="#2B3990"
      />
    </g>
  </svg>
);

// 1:1 Official Typography (DialXprt + Search Local Service Expert.)
const LogoText: React.FC<{ isWhiteText: boolean; showTagline: boolean }> = ({ isWhiteText, showTagline }) => (
  <div className="flex flex-col justify-center leading-none">
    <div className="flex items-baseline font-black tracking-tight text-2xl sm:text-3xl font-sans">
      <span className={isWhiteText ? 'text-white' : 'text-[#2B3990]'}>Dial</span>
      <span className="text-[#F36F21]">Xprt</span>
    </div>
    {showTagline && (
      <span
        className={`text-[10px] sm:text-[11.5px] font-medium tracking-tight mt-1 ${
          isWhiteText ? 'text-indigo-100' : 'text-[#111111]'
        }`}
      >
        Search Local Service Expert.
      </span>
    )}
  </div>
);
