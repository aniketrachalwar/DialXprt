import React from 'react';

interface WhatsAppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const WhatsAppLogo: React.FC<WhatsAppLogoProps> = ({ className = '', size = 'md' }) => {
  const dimensionClass =
    size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : size === 'xl' ? 'w-10 h-10' : 'w-5 h-5';

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${dimensionClass} shrink-0 drop-shadow-sm ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer White Drop Shadow / Speech Bubble Frame */}
      <path
        d="M50 5 C25.15 5 5 25.15 5 50 C5 58.12 7.15 65.74 10.9 72.33 L5 95 L28.3 89.26 C34.66 92.74 42.06 94.7 50 94.7 C74.85 94.7 95 74.85 95 50 C95 25.15 74.85 5 50 5 Z"
        fill="#FFFFFF"
      />
      {/* Green Badge Circle */}
      <path
        d="M50 11 C28.46 11 11 28.46 11 50 C11 57.28 12.98 64.1 16.42 69.96 L11 89 L30.58 83.92 C36.2 86.9 42.82 88.6 50 88.6 C71.54 88.6 89 71.54 89 50 C89 28.46 71.54 11 50 11 Z"
        fill="#25D366"
      />
      {/* Inner White Telephone Receiver Handset */}
      <path
        d="M34.5 28 C33 28 31.5 28.6 30.5 29.8 C28.5 32 25 36.8 25 43.5 C25 50.2 28.8 58.2 36.5 65.9 C44.2 73.6 52.2 77.4 58.9 77.4 C65.6 77.4 70.4 73.9 72.6 71.9 C73.8 70.9 74.4 69.4 74.4 67.9 C74.4 66.2 70.5 59.5 68.8 58 C67.3 56.6 65.5 56.8 64.2 57.8 L60.2 61.1 C59.2 61.9 57.8 62 56.6 61.4 C53.5 59.8 47.7 54.8 45.3 51.3 C44.5 50.1 44.6 48.7 45.4 47.7 L48.2 43.4 C49.2 42 49.3 40.2 47.8 38.7 C46.2 37.1 39.8 30.8 38.1 29.2 C37.1 28.3 35.8 28 34.5 28 Z"
        fill="#FFFFFF"
      />
    </svg>
  );
};

