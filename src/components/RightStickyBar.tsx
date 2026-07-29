import React from 'react';

interface RightStickyBarProps {
  onOpenRegistration: () => void;
}

export const RightStickyBar: React.FC<RightStickyBarProps> = ({ onOpenRegistration }) => {
  return (
    <div className="fixed top-1/2 right-0 -translate-y-1/2 z-50 flex flex-col gap-1 drop-shadow-xl hidden md:flex">
      {/* Advertise Button (Orange) */}
      <button 
        onClick={() => alert('Advertise page coming soon!')}
        className="bg-[#D34817] hover:bg-[#b93e13] text-white py-6 px-1.5 rounded-l-md border border-r-0 border-[#D34817] transition-colors group cursor-pointer flex items-center justify-center min-w-[40px]"
      >
        <span 
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }} 
          className="font-bold tracking-widest uppercase text-[11px] group-hover:scale-105 transition-transform"
        >
          Advertise
        </span>
      </button>

      {/* Free Listing Button (Blue) */}
      <button 
        onClick={onOpenRegistration}
        className="bg-[#0073D8] hover:bg-[#0062b8] text-white py-6 px-1.5 rounded-l-md border border-r-0 border-[#0073D8] transition-colors group cursor-pointer flex items-center justify-center min-w-[40px]"
      >
        <span 
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }} 
          className="font-bold tracking-widest uppercase text-[11px] group-hover:scale-105 transition-transform"
        >
          Free Listing
        </span>
      </button>
    </div>
  );
};
