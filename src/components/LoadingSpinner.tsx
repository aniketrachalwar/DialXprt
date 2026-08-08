import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
      <div className="relative flex items-center justify-center">
        {/* Outer pulsating ring */}
        <div className="absolute w-16 h-16 border-4 border-teal-100 rounded-full animate-ping opacity-75"></div>
        {/* Inner spinning ring */}
        <div className="absolute w-12 h-12 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin"></div>
        {/* Center dot */}
        <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
      </div>
      <p className="mt-4 text-sm font-semibold text-gray-500 tracking-widest uppercase">Loading...</p>
    </div>
  );
};
